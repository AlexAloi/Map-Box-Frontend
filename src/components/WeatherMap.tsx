"use client";
import { Box, Chip, Divider, Paper, Typography } from "@mui/material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Filter from "./Filter";

interface Variable {
  id: number;
  name: string;
  unit: string;
  longName: string;
}

interface Measurement {
  id: number;
  timestamp: string;
  value: number;
  variable: Variable;
}

export interface WeatherStation {
  id: number;
  weatherStationName: string;
  site: string;
  portfolio: string;
  state: string;
  latitude: number;
  longitude: number;
  measurements: Measurement[];
  last_updated?: string;
}

interface WeatherStationMapProps {
  weatherStations?: WeatherStation[];
}

type StateFilter = "all" | string;

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_API;

const WeatherMap: React.FC<WeatherStationMapProps> = ({
  weatherStations = [],
}) => {
  const stations = weatherStations;
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(
    null
  );
  const filteredStations = useMemo(() => {
    return stateFilter === "all"
      ? stations
      : stations.filter((station) => station.state === stateFilter);
  }, [stateFilter, stations]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || loading) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredStations.forEach((station) => {
      const markerElement = document.createElement("div");
      markerElement.style.width = "20px";
      markerElement.style.height = "20px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.backgroundColor = getMarkerColor(station.state);
      markerElement.style.border = "2px solid white";
      markerElement.style.cursor = "pointer";
      markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      markerElement.style.transition = "transform 0.2s ease";
      markerElement.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedStation(station);
      });
      const marker = new mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter, loading]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [133.7751, -25.2744], // Center of Australia
      zoom: 4,
    });

    setLoading(false);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const getMarkerColor = (state: string): string => {
    const colors: Record<string, string> = {
      VIC: "#1976d2",
      NSW: "#d32f2f",
      NT: "#f57c00",
      QLD: "#388e3c",
      SA: "#7b1fa2",
      WA: "#455a64",
      TAS: "#00796b",
    };
    return colors[state] || "#1976d2";
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Main Map Container */}
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <Box ref={mapContainerRef} sx={{ width: "100%", height: "100%" }} />
        <Filter
          filteredStations={filteredStations}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          stations={stations}
          setSelectedStation={setSelectedStation}
          selectedStation={selectedStation}
        />

        {/* Station Detail Panel */}
        {selectedStation && (
          <Paper
            elevation={8}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 400,
              maxHeight: "calc(100vh - 32px)",
              overflow: "auto",
              zIndex: 1000,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedStation.weatherStationName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedStation.site} - {selectedStation.portfolio}
              </Typography>
              <Box sx={{ mt: 1, mb: 2 }}>
                <Chip
                  label={selectedStation.state}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                All Measurements
              </Typography>

              {selectedStation.measurements &&
              selectedStation.measurements.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Object.entries(
                    selectedStation.measurements
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .reduce(
                        (
                          groups: { [key: string]: Measurement[] },
                          measurement
                        ) => {
                          const dateTime = measurement.timestamp;
                          if (!groups[dateTime]) {
                            groups[dateTime] = [];
                          }
                          groups[dateTime].push(measurement);
                          return groups;
                        },
                        {}
                      )
                  ).map(([dateTime, measurements]) => (
                    <Paper
                      key={dateTime}
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "grey.50" }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        gutterBottom
                      >
                        {new Date(dateTime).toLocaleString()}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {measurements.map((measurement) => (
                          <Box
                            key={measurement.id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 0.5,
                              borderBottom:
                                measurements.length > 1 ? "1px solid" : "none",
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {measurement.variable.longName}:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {measurement.value} {measurement.variable.unit}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No measurements available
                </Typography>
              )}
              {selectedStation.last_updated && (
                <Box
                  sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Station last updated:{" "}
                    {new Date(selectedStation.last_updated).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default WeatherMap;
