"use client";

export default function WeatherMap() {
  (async () => console.log("yeah", await fetch("api/weather-station")))();
  return <>test</>;
}
