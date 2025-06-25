"use client";
import StateFilter from "@/components/Filter";
import WeatherMap from "@/components/WeatherMap";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ height: "100vh", py: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weather Stations Map
      </Typography>

      <Box sx={{ display: "flex", height: "calc(100vh - 120px)", gap: 2 }}>
        {/* Left Sidebar for Filters */}
        <Paper sx={{ width: 300, p: 2 }}>
          <StateFilter />
        </Paper>

        {/* Main Map Area */}
        <Paper sx={{ flex: 1, overflow: "hidden" }}>
          <WeatherMap />
        </Paper>
      </Box>
    </Container>
  );
}
