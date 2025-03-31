"use client";
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";

const WeatherContext = createContext();

// ฟังก์ชันสร้างช่วงเวลา 7 ช่วง
const getSevenTimeRanges = (timeRange) => {
  const now = new Date();
  const totalCurrentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = Math.floor(totalCurrentMinutes / timeRange) * timeRange;

  return Array.from({ length: 7 }, (_, index) => {
    const totalMinutes = startMinutes + index * timeRange;
    let hours = Math.floor(totalMinutes / 60);
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    const newDate = new Date(now);

    if (hours >= 24) {
      hours -= 24;
      newDate.setDate(newDate.getDate() + 1);
    }

    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes}`;
    return {
      date: {
        year: newDate.getFullYear().toString(),
        month: (newDate.getMonth() + 1).toString().padStart(2, "0"),
        day: newDate.getDate().toString().padStart(2, "0"),
      },
      time: timeStr,
      origin: timeStr,
      timestamp: newDate.setHours(hours, parseInt(minutes), 0, 0),
    };
  });
};

// ฟังก์ชันอัปโหลดรูปภาพไป API
const uploadImageToAPI = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob, "240319_grayscale_predict.png");

    const apiResponse = await fetch("https://api-cloud.iaaaiksu.com/convert", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!apiResponse.ok)
      throw new Error(`HTTP Error! Status: ${apiResponse.status}`);

    const imageBlob = await apiResponse.blob();
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("❌ อัปโหลดรูปภาพล้มเหลว:", error);
    return null;
  }
};

export const WeatherProvider = ({ children }) => {
  const [timeRange, setTimeRange] = useState(60);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sevenTimeRanges = useMemo(
    () => getSevenTimeRanges(timeRange),
    [timeRange]
  );

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      const newForecastData = Array(7).fill(null);

      try {
        await Promise.all(
          sevenTimeRanges.map(async (range, i) => {
            const date = `${range.date.year}-${range.date.month}-${range.date.day}`;
            const time = `${range.time}:00+07:00`;
            const response = await fetch(
              `/api/forecast?date=${date}&time=${time}`
            );
            if (!response.ok)
              throw new Error(`Failed to fetch forecast for ${date} ${time}`);

            const data = await response.json();
            let adjustedTemp = parseFloat(data.temperature) || 25.0;

            if (timeRange !== 60) {
              const tempChange = Number(
                (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
              ).toFixed(1);
              adjustedTemp = Number(
                (adjustedTemp + parseFloat(tempChange)).toFixed(1)
              );
            }

            const imagePath = "/images/240319_grayscale_predict.png";
            const convertedImage = await uploadImageToAPI(imagePath);

            newForecastData[i] = {
              bg: data.bg,
              temp: adjustedTemp,
              icon: data.icon,
              condition: data.condition,
              wind: data.wind,
              rain: data.rain,
              image: convertedImage || imagePath,
            };
          })
        );

        setForecastData(newForecastData);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลพยากรณ์อากาศ");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [sevenTimeRanges, timeRange]);

  const value = useMemo(
    () => ({
      timeRange,
      setTimeRange,
      forecastData,
      sevenTimeRanges,
      loading,
      error,
    }),
    [timeRange, forecastData, sevenTimeRanges, loading, error]
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context)
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  return context;
};
