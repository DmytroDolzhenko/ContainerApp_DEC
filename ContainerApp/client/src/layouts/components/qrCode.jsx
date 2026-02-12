import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { containerApi } from "../api/containerApi";

export const ContainerQrCode = ({ containerId }) => {
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    containerApi.getQrCode(containerId)
      .then((data) => {
        setSvg(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження QR:", err);
        setLoading(false);
      });
  }, [containerId]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Скануйте для перегляду деталей:
      </Typography>
      <div 
        style={{ width: "250px", height: "250px", margin: "0 auto" }}
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </Box>
  );
};