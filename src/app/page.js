"use client"; // เพิ่มถ้าใช้ client-side features เช่น useContext

import { WeatherProvider } from "@/context/WeatherContext";
import WeatherHeader from "@/components/WeatherHeader";
import WeatherForecast from "@/components/WeatherForecast";

export default function Home() {
    return (
        <WeatherProvider>
            <WeatherHeader />
            <WeatherForecast />
        </WeatherProvider>
    );
}