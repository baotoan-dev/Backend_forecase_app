import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../utils/logging";
import axios from "axios";

interface Payload {
  id: string;
  role: number;
}

const currentWeatherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const weatherKey = process.env.WEATHER_API_KEY;
    const city = req.body.city;
    const lat = req.body.lat;
    const lon = req.body.lon;

    logging.info("Current weather controller start ...");

    if (!city && (!lat || !lon)) {
      return next(createError(400, "Missing parameters"));
    }

    // Tính toán ngày hôm qua
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate());
    const yesterdayString = yesterday.toISOString().split("T")[0];

    let url: string;
    let urlFeature: string;
    let urlHistory: string;
    if (city) {
      url = `https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${city}`;
      urlFeature = `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${city}&days=4`;
      urlHistory = `https://api.weatherapi.com/v1/history.json?key=${weatherKey}&q=${city}&dt=${yesterdayString}`;
    } else {
      url = `https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${lat},${lon}`;
      urlFeature = `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${lat},${lon}&days=4`;
      urlHistory = `https://api.weatherapi.com/v1/history.json?key=${weatherKey}&q=${lat},${lon}&dt=${yesterdayString}`;
    }

    logging.info(`Fetching weather data from URL: ${url}`);
    logging.info(`Fetching forecast data from URL: ${urlFeature}`);
    logging.info(`Fetching history data from URL: ${urlHistory}`);

    // Gửi yêu cầu tới API
    const [currentWeatherRes, forecastWeatherRes, historyWeatherRes] =
      await Promise.all([
        axios.get(url),
        axios.get(urlFeature),
        axios.get(urlHistory),
      ]);

    // Trả về kết quả từ API
    res.status(200).json({
      status: 200,
      message: "Weather data fetched",
      data: {
        current: currentWeatherRes.data,
        forecast: forecastWeatherRes.data,
        history: historyWeatherRes.data,
      },
    });
  } catch (error) {
    logging.error(`[currentWeatherController] ${error.message}`);
    return next(createError(500));
  }
};

export default currentWeatherController;
