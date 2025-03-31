import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const fetchWeatherFromAPI = async (date, time) => {
  const timeNoTz = time.split("+")[0];
  const [h, m, s] = timeNoTz.split(":");
  const apiUrl = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/place?province=กาฬสินธุ์&fields=tc,cond,rain,ws10m&date=${date}&hour=${parseInt(
    h
  )}&duration=3`;
  const response = await fetch(apiUrl, {
    headers: {
      accept: "application/json",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgyY2ZkNDZhMTBhM2U3YzY2YWMzZjQ3OWI1MTQ3YTkyNGI1ZDc4NDE5MDE0NWI2NDk2YzMwNDg2MzJkMGRkNzZiODQwOTA4NWEzZjg0YjU2In0.eyJhdWQiOiIyIiwianRpIjoiODJjZmQ0NmExMGEzZTdjNjZhYzNmNDc5YjUxNDdhOTI0YjVkNzg0MTkwMTQ1YjY0OTZjMzA0ODYzMmQwZGQ3NmI4NDA5MDg1YTNmODRiNTYiLCJpYXQiOjE3NDI3NDIwNDUsIm5iZiI6MTc0Mjc0MjA0NSwiZXhwIjoxNzc0Mjc4MDQ1LCJzdWIiOiIzNzc4Iiwic2NvcGVzIjpbXX0.ZSpaiHVA9rPfY6Bk8XEr9raFxliImu81QX4Q_zpX4rzvorU63OX1KYkjf2Lv5FEwDbY-WjyB-0bSWROSO5jCavmPi1il8sQfiadhrfOSYfGhAlHobRKdDlCqQlLSnSxBeHS2sd591QcZSOs4QEdRyLbdphXgT9K2NG8O9UejXTyn2we1G8jRh3_93T9XwaKZus_PV7o5IWhSW3cMGAqq6VqAb0uEmOydyOrxYUlUv1IwCODz6KfBjGuCcwL92sOnYUXgPE_J3iOnQY6RoV5bBC4Yo3mnbX-UySm-PdMf2G8nB8X9M8KpD9enCB3KRazFBKzFc7Q1XDAsgE59H2ZJU6Ri7_ivPlqYGaNGKVE_8s5ehWC7HOyZpIaoDHJOsrcA93t44ytBBUJ7ZwulfzS0mNtOGGSp3CxzbSnRNfjbQjlWJvgl507j5elbzq55PJDFUcP2SrVzsvizs03C8lOBtzrFAoNexzdFD3IsTKtnBd-olEAuPz1WBmqbSLJpJ-a3hMy1tT-N40z-uCVL5HnK3gHf1mY8YyjqhuhRgO0tpkJCyrQsjb9Eh6d3RaYLpYH-TfV3SDsFZe_0xuDaeG73f7yWykqODftfuk9F7a8FmcogoC53_Q_dSwTqe4cEcFLaIIV4DJGKfuOtuG9v3o0TETMF-MahVBHZAGO65WbaKGY",
    },
  });

  if (!response.ok)
    throw new Error(`API request failed with status ${response.status}`);
  const data = await response.json();
  return data?.WeatherForecasts?.[0]?.forecasts || [];
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!date || !time) {
    return NextResponse.json(
      { error: "Missing date or time parameter" },
      { status: 400 }
    );
  }

  const targetTime = `${date}T${time}`.replace(" ", "+");

  try {
    const [existingData] = await db.query(
      "SELECT * FROM weather_data WHERE date = ?",
      [targetTime]
    );

    let result;

    if (existingData.length > 0) {
      const item = existingData[0];
      result = {
        time: item.date,
        temperature: item.temperature,
        icon: item.cond,
        condition: item.cond,
        wind: item.ws10m,
        rain: item.rain,
      };
    } else {
      const forecasts = await fetchWeatherFromAPI(date, time);
      const matchedForecast = forecasts.find((f) => f.time === targetTime);

      if (!matchedForecast) {
        return NextResponse.json(
          { error: `No forecast found for ${targetTime}` },
          { status: 404 }
        );
      }

      const weatherData = {
        date: matchedForecast.time,
        temperature: matchedForecast.data.tc ?? null,
        cond: matchedForecast.data.cond ?? null,
        ws10m: matchedForecast.data.ws10m ?? null,
        rain: matchedForecast.data.rain ?? 0,
      };

      await db.query(
        `INSERT INTO weather_data (date, temperature, cond, ws10m, rain)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 temperature = VALUES(temperature),
                 cond = VALUES(cond),
                 ws10m = VALUES(ws10m),
                 rain = VALUES(rain)`,
        [
          weatherData.date,
          weatherData.temperature,
          weatherData.cond,
          weatherData.ws10m,
          weatherData.rain,
        ]
      );

      result = {
        time: weatherData.date,
        temperature: weatherData.temperature,
        icon: weatherData.cond,
        condition: weatherData.cond,
        wind: weatherData.ws10m,
        rain: weatherData.rain,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/forecast:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch weather data", details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
