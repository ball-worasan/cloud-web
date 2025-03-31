"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Fade, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const themeColors = {
  primary: "#0288d1",
  secondary: "#4fc3f7",
  text: "#ffffff",
  shadow: "rgba(0, 0, 0, 0.25)",
  background:
    "linear-gradient(135deg, rgba(2, 136, 209, 0.12), rgba(255, 255, 255, 0.08))",
};

const UploadContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "2rem",
  background: themeColors.background,
  borderRadius: "24px",
  boxShadow: "0 10px 40px rgba(2, 136, 209, 0.2)",
  margin: "0 auto",
  maxWidth: "900px",
});

const UploadButton = styled(Button)({
  background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
  color: themeColors.text,
  padding: "0.75rem 2rem",
  borderRadius: "12px",
  boxShadow: `0 4px 15px ${themeColors.shadow}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 6px 20px ${themeColors.shadow}`,
    background: `linear-gradient(90deg, ${themeColors.secondary}, ${themeColors.primary})`,
  },
});

const ConfirmButton = styled(Button)({
  background: "linear-gradient(90deg, #4caf50, #81c784)",
  color: themeColors.text,
  padding: "0.75rem 2rem",
  borderRadius: "12px",
  boxShadow: `0 4px 15px ${themeColors.shadow}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 6px 20px ${themeColors.shadow}`,
    background: "linear-gradient(90deg, #81c784, #4caf50)",
  },
});

const FileInput = styled("input")({
  display: "none",
});

const TitleTypography = styled(Typography)({
  color: themeColors.text,
  background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
  padding: "1rem 2.5rem",
  borderRadius: "12px",
  boxShadow: `0 6px 20px ${themeColors.shadow}`,
  textShadow: `1px 1px 4px ${themeColors.shadow}`,
  marginBottom: "2rem",
});

const ResultTypography = styled(Typography)({
  color: themeColors.text,
  background: `linear-gradient(90deg, #7b1fa2, #e91e63)`,
  padding: "0.5rem 1.5rem",
  borderRadius: "8px",
  boxShadow: `0 4px 15px ${themeColors.shadow}`,
  marginTop: "2rem",
  marginBottom: "1rem",
});

export default function Model() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [resultImage, setResultImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // จำนวนภาพที่ต้องการ 8 ภาพ
  const maxImages = 8;

  // อัปโหลดรูปจากเครื่อง
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length + selectedImages.length > maxImages) {
      alert(`คุณสามารถอัปโหลดได้สูงสุด ${maxImages} ภาพเท่านั้น`);
      return;
    }
    const newImages = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  // ลบภาพ
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (selectedImages[index].file) {
      URL.revokeObjectURL(selectedImages[index].url);
    }
  };

  // ยืนยันและส่งรูปไป API
  const handleConfirm = async () => {
    if (selectedImages.length !== maxImages) {
      alert(`กรุณาอัปโหลดภาพให้ครบ ${maxImages} ภาพก่อนยืนยัน`);
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append("images", selectedImages[i].file);
      }

      // เรียก API อัปโหลด
      const apiResponse = await fetch(
        "https://api-cloud.iaaaiksu.com/prepare-images",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`API upload failed: ${errorText}`);
      }

      // สมมติ API ตอบกลับมาเป็นรูป (blob) ของผลลัพธ์
      const blob = await apiResponse.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
      alert("อัปโหลดและประมวลผลสำเร็จ!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContainer>
      <Fade in timeout={800}>
        <TitleTypography variant="h4" component="h1">
          ทดสอบโมเดลพยากรณ์เมฆ
        </TitleTypography>
      </Fade>

      <Fade in timeout={1000}>
        <Box sx={{ textAlign: "center" }}>
          <label htmlFor="upload-images">
            <FileInput
              id="upload-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <UploadButton
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              อัปโหลดภาพ
            </UploadButton>
          </label>
        </Box>
      </Fade>

      <Fade in timeout={1200}>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          อัปโหลดได้แล้ว: {selectedImages.length}/{maxImages}
        </Typography>
      </Fade>

      {selectedImages.length > 0 && (
        <Fade in timeout={1400}>
          <Box sx={{ mt: 4, width: "100%" }}>
            <ImageList cols={4} gap={16}>
              {selectedImages.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    loading="lazy"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src = "/images/240319_grayscale_predict.png")
                    }
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      mt: 1,
                      borderRadius: "8px",
                      width: "100%",
                    }}
                    disabled={uploading}
                  >
                    ลบ
                  </Button>
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Fade>
      )}

      {selectedImages.length === maxImages && (
        <Fade in timeout={1600}>
          <ConfirmButton
            variant="contained"
            onClick={handleConfirm}
            sx={{ mt: 3 }}
            disabled={uploading}
          >
            {uploading ? "กำลังอัปโหลด..." : "ยืนยัน"}
          </ConfirmButton>
        </Fade>
      )}

      {resultImage && (
        <Fade in timeout={1800}>
          <Box sx={{ mt: 4, width: "100%", textAlign: "center" }}>
            <ResultTypography variant="h6" component="h2">
              ผลลัพธ์การพยากรณ์
            </ResultTypography>
            <Box
              component="img"
              src={resultImage}
              alt="Prediction Result"
              sx={{
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                maxWidth: "100%",
                height: "auto",
                maxHeight: "400px",
                objectFit: "contain",
              }}
              onError={(e) =>
                (e.target.src = "/images/240319_grayscale_predict.png")
              }
            />
          </Box>
        </Fade>
      )}
    </UploadContainer>
  );
}
