"use client";
import React, { useRef, useMemo, memo, useState } from "react";
import { Box, Typography, Fade, Modal } from "@mui/material";
import { useWeatherContext } from "@/context/WeatherContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { styled } from "@mui/system";
import Image from "next/image";

const themeColors = {
  primary: "#0288d1",
  secondary: "#4fc3f7",
  textShadow: "rgba(0, 0, 0, 0.25)",
  cardBackground:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(240, 248, 255, 0.92))",
  cardHover:
    "linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(250, 253, 255, 1))",
  border: "rgba(2, 136, 209, 0.25)",
};

const WeatherCard = styled(Box)({
  textAlign: "center",
  width: "190px",
  height: "260px",
  padding: "1.75rem",
  background: themeColors.cardBackground,
  borderRadius: "20px",
  border: `1px solid ${themeColors.border}`,
  boxShadow: "0 8px 25px rgba(2, 136, 209, 0.12)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    background: themeColors.cardHover,
    boxShadow: "0 12px 35px rgba(2, 136, 209, 0.25)",
    cursor: "pointer",
  },
});

const WeatherTypography = styled(Typography)({
  textShadow: `1px 1px 2px ${themeColors.textShadow}`,
  padding: "0.4rem 0.8rem",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.5)",
  transition: "background 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.7)",
  },
});

const ScrollContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  padding: "1rem 0.8rem",
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    height: "10px",
    background: "rgba(2, 136, 209, 0.15)",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: themeColors.primary,
    borderRadius: "5px",
    transition: "background 0.3s ease",
    "&:hover": {
      background: themeColors.secondary,
    },
  },
});

const WeatherImage = styled(Box)({
  width: "190px",
  height: "120px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 12px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const FullScreenImage = styled(Box)({
  width: "auto",
  maxWidth: "400px",
  height: "auto",
  maxHeight: "85vh",
  borderRadius: "16px",
  boxShadow: "0 6px 25px rgba(0, 0, 0, 0.35)",
  background: "rgba(255, 255, 255, 0.95)",
  padding: "1rem",
  transition: "transform 0.4s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
});

const iconMap = {
  1: <WbSunnyIcon sx={{ color: "#ffca28", fontSize: "3rem" }} />,
  2: <CloudIcon sx={{ color: "#b0bec5", fontSize: "3rem" }} />,
  3: <CloudIcon sx={{ color: "#90a4ae", fontSize: "3rem" }} />,
  4: <CloudIcon sx={{ color: "#78909c", fontSize: "3rem" }} />,
  5: <GrainIcon sx={{ color: "#4fc3f7", fontSize: "3rem" }} />,
  6: <GrainIcon sx={{ color: "#29b6f6", fontSize: "3rem" }} />,
  7: <GrainIcon sx={{ color: "#0288d1", fontSize: "3rem" }} />,
  8: <ThunderstormIcon sx={{ color: "#29b6f6", fontSize: "3rem" }} />,
  9: <AcUnitIcon sx={{ color: "#4dd0e1", fontSize: "3rem" }} />,
  10: <AcUnitIcon sx={{ color: "#80deea", fontSize: "3rem" }} />,
  11: <AcUnitIcon sx={{ color: "#b2ebf2", fontSize: "3rem" }} />,
  12: <WbSunnyIcon sx={{ color: "#ff5722", fontSize: "3rem" }} />,
};

const conditionMap = {
  1: "ท้องฟ้าแจ่มใส",
  2: "มีเมฆบางส่วน",
  3: "เมฆเป็นส่วนมาก",
  4: "มีเมฆมาก",
  5: "ฝนตกเล็กน้อย",
  6: "ฝนปานกลาง",
  7: "ฝนตกหนัก",
  8: "ฝนฟ้าคะนอง",
  9: "อากาศหนาวจัด",
  10: "อากาศหนาว",
  11: "อากาศเย็น",
  12: "อากาศร้อนจัด",
};

const ForecastCard = memo(({ timeRange, forecast, onClick }) => {
  const imageSrc = forecast?.image;

  const getTempBackground = (temp) => {
    if (!temp) return "linear-gradient(90deg, #90a4ae, #b0bec5)";
    if (temp < 15) return "linear-gradient(90deg, #4dd0e1, #b2ebf2)";
    if (temp < 25) return "linear-gradient(90deg, #80deea, #e0f7fa)";
    if (temp < 35) return "linear-gradient(90deg, #ffca28, #ffe082)";
    return "linear-gradient(90deg, #ff5722, #ff8a65)";
  };

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <WeatherCard onClick={() => onClick(imageSrc)}>
          <WeatherTypography
            variant="subtitle1"
            sx={{
              color: themeColors.primary,
              fontWeight: 600,
              fontSize: "1.5rem",
              background: "rgba(255, 255, 255, 0.7)",
              border: `2px solid ${themeColors.border}`,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {`${timeRange.date.day}/${timeRange.date.month}/${timeRange.date.year} ${timeRange.origin}`}
          </WeatherTypography>
          <Box
            sx={{
              fontSize: "3.5rem",
              fontWeight: 700,
              my: "1rem",
              background: getTempBackground(forecast?.temp),
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            {forecast?.temp ? `${forecast.temp}°C` : "-"}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              my: "1rem",
            }}
          >
            {forecast?.icon ? (
              iconMap[forecast.icon]
            ) : (
              <CloudIcon sx={{ color: "#90a4ae", fontSize: "3rem" }} />
            )}
            <WeatherTypography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "1.4rem" }}
            >
              {forecast?.condition
                ? conditionMap[forecast.condition]
                : "ไม่มีข้อมูล"}
            </WeatherTypography>
          </Box>
          <WeatherTypography
            variant="body1"
            sx={{ color: themeColors.primary, fontSize: "1.4rem" }}
          >
            ฝน: {forecast?.rain ? `${forecast.rain}%` : "-"}
          </WeatherTypography>
          <WeatherTypography
            variant="body1"
            sx={{ color: themeColors.primary, fontSize: "1.4rem" }}
          >
            ลม: {forecast?.wind ? `${forecast.wind} กม./ชม.` : "-"}
          </WeatherTypography>
        </WeatherCard>
        <WeatherImage>
          <Image
            src={imageSrc}
            alt={conditionMap[forecast?.condition] || "สภาพอากาศ"}
            width={190}
            height={120}
            style={{ objectFit: "cover" }}
            onError={(e) => (e.target.src = "/images/placeholder.png")}
          />
        </WeatherImage>
      </Box>
    </Fade>
  );
});

ForecastCard.displayName = "ForecastCard";

export default function WeatherForecast() {
  const { timeRange, forecastData, sevenTimeRanges, loading, error } =
    useWeatherContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const forecastRef = useRef(null);

  const handleImageClick = (image) => image && setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);

  const forecastCards = useMemo(() => {
    if (loading) {
      return (
        <Typography
          sx={{
            mx: "auto",
            py: 4,
            color: "text.secondary",
            fontSize: "1.5rem",
          }}
        >
          กำลังโหลด...
        </Typography>
      );
    }

    // แสดงข้อมูลที่มีอยู่แม้ว่าจะมี error บางส่วน
    return sevenTimeRanges.map((timeRange, index) => {
      const forecast = forecastData[index];
      return (
        <ForecastCard
          key={timeRange.timestamp}
          timeRange={timeRange}
          forecast={forecast || {}} // ส่ง object ว่างถ้าไม่มีข้อมูล เพื่อให้การ์ดยังคงแสดงผล
          onClick={handleImageClick}
        />
      );
    });
  }, [sevenTimeRanges, forecastData, loading]);

  return (
    <Box
      sx={{
        maxWidth: "1440px",
        mx: "auto",
        p: "2rem 1.5rem",
        borderRadius: "24px",
        background:
          "linear-gradient(135deg, rgba(2, 136, 209, 0.12), rgba(255, 255, 255, 0.08))",
        boxShadow: "0 10px 40px rgba(2, 136, 209, 0.2)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: "1rem",
          color: "white",
          background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
          p: "1.2rem 2.5rem",
          borderRadius: "12px",
          fontSize: { xs: "2rem", md: "2.8rem" },
          fontWeight: 700,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        พยากรณ์ทุก {timeRange} นาที
      </Typography>
      {error && (
        <Typography
          sx={{ textAlign: "center", color: "error.main", mb: "1rem" }}
        >
          บางข้อมูลอาจไม่พร้อมใช้งาน: {error}
        </Typography>
      )}
      <ScrollContainer ref={forecastRef}>{forecastCards}</ScrollContainer>
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Fade in={!!selectedImage} timeout={400}>
          <FullScreenImage>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="ภาพพยากรณ์อากาศแบบเต็มหน้าจอ"
                width={350}
                height={350}
                style={{ objectFit: "contain" }}
              />
            )}
          </FullScreenImage>
        </Fade>
      </Modal>
    </Box>
  );
}
