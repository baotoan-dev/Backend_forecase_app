import { createClient } from 'redis';
// import util from 'util';
import logging from '../utils/logging';

const PORT = +process.env.REDIS_PORT || 6379;
const HOST = process.env.REDIS_HOST || '127.0.0.1';
const PASSWORD = process.env.REDIS_PASSWORD || '';


const client = createClient({
  url: `redis://default:${PASSWORD}@${HOST}:${PORT}`,
})

client.connect();

client.on('error', (err) => logging.error(`Connect to redis failure: ${err}`));

client.on('connect', (err) => logging.success('Connect to redis successfully'));

client.on('ready', (err) =>
  logging.success(`Redis is ready on ${HOST}:${PORT}`)
);

client.on('disconnect', () => logging.warning('Redis disconnected'));

// client.get = util.promisify(client.get);
// client.get = util.promisify(client.get).bind(client);

// client.del = util.promisify(client.del).bind(client);

export function deleteSocket(socketId: string, accountId: string) {
  client.del(`socket_id-${socketId}`);

  client.get(`socket-${accountId}`).then((reply) => {
    if (!reply) return;
    let arraySocketId = reply.split(',');
    let index = arraySocketId.indexOf(socketId);
    arraySocketId.splice(index, 1);
    if (arraySocketId.length === 0) return client.del(`socket-${accountId}`);
    client.set(`socket-${accountId}`, arraySocketId.join(','));
  })
}

export default client;
