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

import { checkLanguageParams } from '../middlewares/utils/midleware.checkLanguageParams';
import routeV1 from './app/v1/_route.app.v1';

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
