import { Router } from "express";

import appSignInRouter from './route.app.signIn';
import appProfileRouter from './route.app.profile';
import appSignUpRouter from './route.app.signUp';
import appWeatherRouter from './route.app.weather';


const routeV1 = Router();

routeV1.use("/sign-in", appSignInRouter);
routeV1.use("/profiles", appProfileRouter);
routeV1.use("/weather", appWeatherRouter);
routeV1.use("/", appSignUpRouter);


export default routeV1;
