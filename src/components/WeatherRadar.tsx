import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issues with webpack/parcel
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherRadarProps {
    lat: number;
    lon: number;
}

// Component to update map view when props change
const MapUpdater: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], 10);
    }, [lat, lon, map]);
    return null;
};

const WeatherRadar: React.FC<WeatherRadarProps> = ({ lat, lon }) => {
    return (
        <section id="weather-radar-section">
            <h2>Live Weather Radar</h2>
            <div className="radar-container">
                <MapContainer
                    center={[lat, lon]}
                    zoom={10}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <TileLayer
                        attribution='&copy; <a href="https://www.rainviewer.com/api/weather-maps-api.html">RainViewer</a>'
                        url="https://tile.rainviewer.com/img/radar_nowcast_loop/0/512/{z}/{x}/{y}/2/1_1.png"
                        opacity={0.6}
                    />
                    <MapUpdater lat={lat} lon={lon} />
                </MapContainer>
            </div>
        </section>
    );
};

export default WeatherRadar;
