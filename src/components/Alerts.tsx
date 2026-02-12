import React, { useState } from 'react';
import { WeatherAlert } from '../interfaces';

interface AlertsProps {
    alerts?: WeatherAlert[];
}

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
    const [showActiveAlerts, setShowActiveAlerts] = useState(false);

    // If no alerts, assume empty state logic from original app
    // The original app hid the "Active Alerts" link if no alerts.
    // Here we can just render the section with specific logic.
    
    // Original logic:
    // If alerts exist:
    // 1. Show "Active Alerts" link in the header/city display (we need to coordinate this).
    // 2. Render alerts in the alerts section.

    // Let's just render the section if there are alerts.
    
    if (!alerts || alerts.length === 0) {
        return (
            <section id="alerts">
                <h2>Weather Alerts</h2>
                <div id="alerts-display">
                    <p>No active weather alerts.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="alerts">
            <h2>Weather Alerts</h2>
            <div id="alerts-display">
                <h3>Active Alerts:</h3>
                {alerts.map((alert, index) => {
                    const startDate = new Date(alert.start * 1000).toLocaleString();
                    const endDate = new Date(alert.end * 1000).toLocaleString();
                    return (
                        <div key={index} className="alert-item">
                            <h4>{alert.event}</h4>
                            <p>Sender: {alert.sender_name}</p>
                            <p>From: {startDate} to {endDate}</p>
                            <p>{alert.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Alerts;
