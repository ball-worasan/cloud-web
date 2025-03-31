import "@/styles/globals.css";
import { Box } from "@mui/material";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata = {
    title: "พยากรณ์อากาศ - ข้อมูลสภาพอากาศแบบเรียลไทม์",
    description: "รับข้อมูลพยากรณ์อากาศล่าสุดสำหรับทุกจังหวัดในประเทศไทย อัพเดทแบบเรียลไทม์ด้วยข้อมูลที่แม่นยำ",
    keywords: "พยากรณ์อากาศ, สภาพอากาศประเทศไทย, อุณหภูมิ, ฝนตก, ลม",
    charset: "UTF-8",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "พยากรณ์อากาศ - ข้อมูลสภาพอากาศแบบเรียลไทม์",
        description: "รับข้อมูลพยากรณ์อากาศล่าสุดสำหรับทุกจังหวัดในประเทศไทย",
        type: "website",
        locale: "th_TH",
        url: "https://your-weather-app-url.com",
        siteName: "พยากรณ์อากาศ",
        images: [
            {
                url: "https://your-weather-app-url.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "พยากรณ์อากาศประเทศไทย",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "พยากรณ์อากาศ - ข้อมูลสภาพอากาศแบบเรียลไทม์",
        description: "รับข้อมูลพยากรณ์อากาศล่าสุดสำหรับทุกจังหวัดในประเทศไทย",
        image: "https://your-weather-app-url.com/twitter-image.jpg",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="th">
            <head>
                <meta name="theme-color" content="#0288d1" />
            </head>
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    minHeight: "100vh",
                }}
            >
                <Box
                    component="main"
                    sx={{
                        minHeight: "100vh",
                        padding: { xs: "1rem", md: "2rem" },
                        position: "relative",
                        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)",
                            opacity: 0.05,
                            zIndex: -1,
                        },
                    }}
                >
                    {children}
                </Box>
                <Box
                    component="footer"
                    sx={{
                        fontSize: "1.8rem",
                        py: 2,
                        textAlign: "center",
                        color: "#666",
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(5px)",
                        borderTop: "1px solid rgba(2, 136, 209, 0.2)",
                    }}
                >
                    © {new Date().getFullYear()} พยากรณ์อากาศ. สงวนลิขสิทธิ์.
                </Box>
            </body>
        </html>
    );
}