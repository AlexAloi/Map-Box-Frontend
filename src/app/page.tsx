"use client";

import WeatherMap, { WeatherStation } from "@/components/WeatherMap";
import { Box, Container, Paper } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/weather-station/stations"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stations");
      }

      const data = await response.json();
      setStations(data);
    } catch (err) {
      console.error("Error fetching stations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", py: 2 }}>
      <Box sx={{ display: "flex", height: "calc(100vh - 120px)", gap: 2 }}>
        <Paper sx={{ flex: 1, overflow: "hidden" }}>
          {!loading && <WeatherMap weatherStations={stations} />}
        </Paper>
      </Box>
    </Container>
  );
}
