"use client";
import React from "react";
import { Box, Typography, Select, MenuItem, Fade } from "@mui/material";
import { useWeatherContext } from "@/context/WeatherContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/system";

const themeColors = {
  primaryGradient: "linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)",
  hoverGradient: "linear-gradient(135deg, #0277bd 0%, #42a5f5 100%)",
  text: "#ffffff",
  accent: "rgba(255, 255, 255, 0.9)",
  shadow: "rgba(0, 0, 0, 0.3)",
};

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "3.5rem",
  padding: "2rem",
  background: themeColors.primaryGradient,
  borderRadius: "24px",
  border: "2px solid rgba(255, 255, 255, 0.25)",
  boxShadow: `0 10px 30px ${themeColors.shadow}`,
  backdropFilter: "blur(10px)",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(45deg, rgba(255, 255, 255, 0.15), transparent)",
    pointerEvents: "none",
    animation: "shine 4s infinite ease-in-out",
  },
  "@keyframes shine": {
    "0%": { transform: "translateX(-100%)" },
    "50%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-100%)" },
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: "2rem",
    padding: "1.5rem",
  },
}));

const HeaderTypography = styled(Typography)({
  fontWeight: 700,
  color: themeColors.text,
  textShadow: `2px 2px 8px ${themeColors.shadow}`,
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1.25rem",
  background: "rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const StyledSelect = styled(Select)({
  background: "rgba(255, 255, 255, 0.2)",
  color: themeColors.text,
  borderRadius: "12px",
  border: `2px solid ${themeColors.accent}`,
  boxShadow: `0 4px 12px ${themeColors.shadow}`,
  padding: "0.25rem",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.3)",
    borderColor: themeColors.text,
    transform: "translateY(-3px)",
    boxShadow: `0 6px 18px ${themeColors.shadow}`,
  },
  "& .MuiSelect-icon": {
    color: themeColors.text,
    transition: "transform 0.3s ease",
  },
  "&:hover .MuiSelect-icon": {
    transform: "rotate(180deg)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    padding: "0.6rem 1.25rem",
    fontWeight: 500,
  },
});

const timeRangeOptions = [
  // { value: 15, label: "15 นาที" },
  // { value: 30, label: "30 นาที" },
  { value: 60, label: "1 ชั่วโมง" },
];

export default function WeatherHeader() {
  const { timeRange, setTimeRange } = useWeatherContext();

  return (
    <HeaderContainer>
      <Fade in timeout={800}>
        <HeaderTypography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <LocationOnIcon
            sx={{
              fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem" },
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.2)" },
            }}
          />
          พยากรณ์อากาศ กาฬสินธุ์
        </HeaderTypography>
      </Fade>

      <Fade in timeout={1000}>
        <Box
          sx={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <StyledSelect
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: {
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                  boxShadow: `0 6px 20px ${themeColors.shadow}`,
                  marginTop: "0.5rem",
                },
              },
            }}
            sx={{
              minWidth: { xs: "180px", md: "160px" },
              minHeight: { xs: "50px", md: "60px" },
              fontSize: { xs: "1.2rem", md: "1.4rem" },
            }}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  padding: "0.75rem 1.25rem",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: themeColors.hoverGradient,
                    color: themeColors.text,
                    transform: "translateX(4px)",
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </Box>
      </Fade>
    </HeaderContainer>
  );
}
