import { Server } from 'socket.io';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import logging from '../utils/logging';
import * as chatServices from '../services/chat/_service.chat';
import * as cloudinaryServices from '../services/cloudinary/_service.cloudinary';
import * as chatImageServices from '../services/chatImage/_service.chatImage';
import redisClient from './redis';
import ImageBucket from '../models/enum/imageBucket.enum';
import createcompaniesNotificationService from '../services/companiesNotification/service.companiesNotification.create';

interface Payload {
  id: string;
  role: number;
}

const configSocket = (server) => {
  // Initial
  const io = new Server(server, {
    cors: {
      origin: '*',
      allowedHeaders: ['Authorization'],
    },
  });

  // Authorization midddleware
  io.use((socket, next) => {
    // const token = socket.handshake.auth.token;
    const headerAuthorization = socket.request.headers.authorization;

    if (!headerAuthorization) {
      return next(createError(401));
    }

    // GET ACCESS TOKEN
    const accessToken = headerAuthorization.split('Bearer')[1]
      ? headerAuthorization.split('Bearer')[1].toString().trim()
      : null;

    if (!accessToken) {
      return next(createError(401));
    }

    if (!accessToken.trim()) {
      return next(createError(401));
    }

    // Validate token
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      { ignoreExpiration: true },
      async function (err, payload: Payload) {
        // let payloadExpried;
        if (err) {
          // EXPIRED ERROR
          if (err.name !== 'TokenExpiredError') {
            // logging.error('Token expired error');
            // payloadExpried = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true} );
            // return next(createError(403));
            return next(createError(401));
          }

          // OTHER ERROR
          // logging.error(err.message);
          // return next(createError(401));
        }

        const { id } = payload;

        // VERIFY SUCCESS
        // SET SOCKET ID TO REDIS

        const currentSocketId = await redisClient.get(`socket-${id}`);

        if (currentSocketId) {
          // APPEND SOCKET ID TO REDIS
          redisClient.set(`socket-${id}`, `${currentSocketId},${socket.id}`, {
            EX: 60 * 60 * 24 * 30,
          });
        } else {
          // SET SOCKET ID TO REDIS
          await redisClient.set(`socket-${id}`, socket.id, {
            EX: 60 * 60 * 24 * 30,
          });
        }

        // SET USER TO SOCKET
        await redisClient.set(`socket_id-${socket.id}`, id, {
          EX: 60 * 60 * 24 * 30,
        });

        socket.request['user'] = { id };

        return next();
      },
    );
  });

  // Connect
  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // Disconnect
    socket.on('disconnect', async (reason) => {
      logging.info(`User disconnected: ${socket.id} -> ${reason}`);
      // REMOVE SOCKET ID
      // await redisClient.del(`socket-${socket.id}`);
      //  get user id
      const userId = await redisClient.get(`socket_id-${socket.id}`);

      if (userId) {
        // REMOVE SOCKET ID
        // GET SOCKET IDS
        const socketIds = await redisClient.get(`socket-${userId}`);

        if (socketIds) {
          // REMOVE SOCKET ID
          const arraySocketIds = socketIds.split(',');
          const index = arraySocketIds.indexOf(socket.id);
          arraySocketIds.splice(index, 1);

          if (arraySocketIds.length === 0) {
            await redisClient.del(`socket-${userId}`);
          } else {
            await redisClient.set(
              `socket-${userId}`,
              arraySocketIds.join(','),
              {
                EX: 60 * 60 * 24 * 30,
              },
            );
          }
        }
        await redisClient.del(`socket_id-${socket.id}`);

        socket.disconnect();

        socket.request['user'] = null;

        // io.close();
      }
    });

    // Client send message
    socket.on('client-send-message', async (data) => {
      const {
        receiverId,
        message = null,
        files = null,
        createdAt,
        type,
        postId,
        imagesType = null,
      } = data;

      if (!receiverId || !createdAt || !type || !postId) {
        return socket.emit('server-send-error-message', 'Missing data');
      }

      // INSERT TO DATABASE
      const senderId = socket.request['user'].id;

      if (type === 'text' || type === 'image' || type === 'url') {
        try {
          const chatIdInserted = await chatServices.create(
            senderId,
            receiverId,
            type,
            message,
            postId,
            createdAt,
          );

          if (!chatIdInserted) {
            // SEND ERROR MESSAGE TO CLIENT
            socket.emit('server-send-error-message', 'Create chat failure');
          } else {
            if ((type === 'image' && Array.isArray(files) && files.length > 0) || type === 'url') {
              let urlsUploaded;
              if ((type === 'image' && Array.isArray(files) && files.length > 0)) {
                if (imagesType === 'base64') {
                  files.forEach((file, index) => {
                    files[index] = Buffer.from(file, 'base64');
                  });
                }
                let success = false;

                do {
                  try {
                    urlsUploaded = await cloudinaryServices.uploadImagesCloud(
                      files,
                      ImageBucket.CHAT_IMAGES,
                    );
                    success = true;
                  } catch (error) {
                    console.error('Error uploading images to Cloudinary:', error);
                  }

                } while (!success);
              }

              if (type === 'url') {
                urlsUploaded = [files];
              }

              // INSERT TO DB
              if (urlsUploaded.length > 0) {
                // CREATE IMAGES OF CHAT
                const isCreateChatImagesSuccess =
                  await chatImageServices.create(chatIdInserted, urlsUploaded);
                if (!isCreateChatImagesSuccess) {
                  // SEND ERROR MESSAGE TO CLIENT
                  socket.emit(
                    'server-send-error-message',
                    'Create chat images failure',
                  );
                } else {
                  // EMIT TO SENDER
                  const socketIdsOfSender = await redisClient.get(
                    `socket-${senderId}`,
                  );
                  if (socketIdsOfSender) {
                    const arraySocketIdsOfSender = socketIdsOfSender.split(',');
                    arraySocketIdsOfSender.forEach((socketId) => {
                      io.to(socketId).emit('server-send-message-was-sent', {
                        id: chatIdInserted,
                        image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.CHAT_IMAGES}/${urlsUploaded[0]}`,
                        created_at: createdAt,
                        type: 'image',
                      });
                    });
                  }

                  // EMIT TO RECEIVER
                  // GET SOCKET ID OF RECEIVER
                  try {
                    const reply = await redisClient
                      .get(`socket-${receiverId}`)
                      .then((reply) => {
                        return reply.split(',');
                      });

                    if (reply) {
                      io.to(reply).emit('server-send-message-to-receiver', {
                        id: chatIdInserted,
                        sender_id: senderId,
                        image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.CHAT_IMAGES}/${urlsUploaded[0]}`,
                        type: 'image',
                        created_at: createdAt,
                      });
                    }
                  } catch (error) {
                    socket.emit(
                      'server-send-error-message',
                      'Send message to receiver failure',
                    );
                  }
                }
              }
            } else {
              // EMIT TO SENDER
              const socketIdsOfSender = await redisClient.get(
                `socket-${senderId}`,
              );

              if (socketIdsOfSender) {
                const arraySocketIdsOfSender = socketIdsOfSender.split(',');
                arraySocketIdsOfSender.forEach((socketId) => {
                  io.to(socketId).emit('server-send-message-was-sent', {
                    id: chatIdInserted,
                    message: message,
                    created_at: createdAt,
                    type: 'text',
                  });
                });
              }

              try {

              } catch (error) {
                console.log(error);
                socket.emit(
                  'server-send-error-message',
                  'Send message to receiver failure',
                );
              }
            }
          }
        } catch (error) {
          console.log(error);
          socket.emit('server-send-error-message', 'Create chat failure');
        }
      }
    })

    // Client send notification
    socket.on('send-notification', async (data) => {
      const { companyId } = data;

      if (!companyId) {
        console.error('Company ID is missing in the data');
        return;
      }

      try {
        const senderId = socket.request['user'].id;
        const createdNotification = await createcompaniesNotificationService(companyId, 0, senderId);
        if (createdNotification.status !== 200) {
          console.log(`${createdNotification.message || 'Create notification failure'}`);
          socket.emit('server-send-error-message',  `${createdNotification.message || 'Create notification failure'}`);
        } else {
          const notificationData = {
            id: createdNotification.data.id,
            companyName: createdNotification.data.companyName,
            isRead: createdNotification.data.isRead,
            senderId: createdNotification.data.senderId,
            createdAt: createdNotification.data.createdAt,
            message: `You have a new notification from ${createdNotification.data.companyName}`,
          };
          console.log('Sending notification:', notificationData);
          io.emit('server-send-notification', notificationData);
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        socket.emit('server-send-error-message', 'Send notification to receiver failure');
      }
    });
  });
  return io;
};

export default configSocket;
