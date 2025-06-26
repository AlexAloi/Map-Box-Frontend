"use client";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";
import { WeatherStation } from "./WeatherMap";

const getStateColor = (
  state: string
):
  | "primary"
  | "error"
  | "warning"
  | "success"
  | "secondary"
  | "default"
  | "info" => {
  const colors: Record<
    string,
    | "primary"
    | "error"
    | "warning"
    | "success"
    | "secondary"
    | "default"
    | "info"
  > = {
    VIC: "primary",
    NSW: "error",
    NT: "warning",
    QLD: "success",
    SA: "secondary",
    WA: "default",
    TAS: "info",
  };
  return colors[state] || "primary";
};

export default function Filter({
  stateFilter,
  setStateFilter,
  stations,
  setSelectedStation,
  selectedStation,
  filteredStations,
}: {
  stateFilter: string;
  setStateFilter: Dispatch<SetStateAction<string>>;
  stations: WeatherStation[];
  setSelectedStation: Dispatch<SetStateAction<WeatherStation | null>>;
  selectedStation: WeatherStation | null;
  filteredStations: WeatherStation[];
}) {
  const states = useMemo(() => {
    return ["all", ...Array.from(new Set(stations.map((s) => s.state)))];
  }, [stations]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 350,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 350,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Weather Stations
        </Typography>

        {/* State Filter */}
        <FormControl fullWidth sx={{ mb: 3, mt: 2 }}>
          <InputLabel>Filter by State</InputLabel>
          <Select
            value={stateFilter}
            label="Filter by State"
            onChange={(event: SelectChangeEvent<string>) =>
              setStateFilter(event.target.value)
            }
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state === "all"
                  ? "All States"
                  : `${state} (${
                      stations.filter((s) => s.state === state).length
                    })`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Station List */}
        <Paper
          variant="outlined"
          sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}
        >
          <List dense>
            {filteredStations.map((station, index) => (
              <div key={station.id}>
                <ListItemButton
                  onClick={() => setSelectedStation(station)}
                  selected={selectedStation?.id === station.id}
                >
                  <ListItemText
                    primary={
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle2" component="span">
                          {station.weatherStationName}
                        </Typography>
                        <Chip
                          size="small"
                          label={station.state}
                          variant="outlined"
                          color={getStateColor(station.state)}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.8rem" }}
                          component="span"
                          display="block"
                        >
                          {station.site}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ fontSize: "0.75rem", fontWeight: "medium" }}
                          component="span"
                          display="block"
                        >
                          {station.portfolio}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
                {index < filteredStations.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </Drawer>
  );
}
