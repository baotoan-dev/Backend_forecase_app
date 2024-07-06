import express from "express";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import weatherController from "../../../controllers/weather/_controller.weather";

const router = express.Router();
// READ

router.post("/current", verifyAccessToken,  weatherController.currentWeather);
export default router;
