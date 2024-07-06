'use-strict';

import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  Application,
} from 'express';
import createError from 'http-errors';

import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

// ADMIN
import homeAdminRouter from './app/v1/route.app.homeAdmin';

// APP
// import appAccountRouter from './app/v1/route.app.account';
// import appSignInRouter from './app/v1/route.app.signIn';
// import appSiteRouter from './app/v1/route.app.site';
// import appProfileRouter from './app/v1/route.app.profile';
// import appPostRouter from './app/v1/route.app.post';
// import appCategoryRouter from './app/v1/route.app.category';
// import appLocationRouter from './app/v1/route.app.location';
// import appBookmarkRouter from './app/v1/route.app.bookmark';
// import appHistoryRouter from './app/v1/route.app.history';
// import themeRouter from './app/v1/route.app.theme';
// import bannerRouter from './app/v1/route.app.banner';
// import appApplicationRouter from './app/v1/route.app.application';
// import appSearchRouter from './app/v1/route.app.search';
// import appNotificationRouter from './app/v1/route.app.notification';
// import chatRouter from './app/v1/route.app.chat';
// import fcmRouter from './app/v1/route.app.fcm-token';
import { checkLanguageParams } from '../middlewares/utils/midleware.checkLanguageParams';
import routeV1 from './app/v1/_route.app.v1';
import routeV2 from './app/v2/_route.app.v2';

const route = (app: Application) => {
  app.all('/', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  //SWAGGER
  const swaggerOptions: Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Swagger API',
        version: '1.0.0',
        description: 'Jobs App API',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 5000}`,
        },
      ],
    },
    apis: [
      `${__dirname}/../swagger/*.yaml`,
      `${__dirname}/../swagger/**/*.yaml`,
      `${__dirname}/../src/swagger/*.yaml`, // FOR NPM WEBPACK (DEBUG MODE)
      `${__dirname}/../src/swagger/**/*.yaml`, // FOR NPM WEBPACK (DEBUG MODE)
    ],
  };
  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  app.use(checkLanguageParams);

  app.use('/api/v1/apis-doc', serve, setup(swaggerDocs));

  app.use('/api/v1', routeV1); // SITE
  app.use('/api/v2', routeV2)

  // ERROR ROUTES
  app.use((req: Request, res: Response, next: NextFunction) => {
    return next(createError(404));
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    return res.status(err.status || 500).json({
      code: err.status || 500,
      success: false,
      message: err.message,
    });
  };

  app.use(errorHandler);
};

export default route;
