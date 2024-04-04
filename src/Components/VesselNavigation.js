import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import startPointIcon from '../assets/start.png';
import endPointIcon from '../assets/end.png';
import vesselIcon from '../assets/boat.png';
import L from 'leaflet';
import { Container } from '@mui/material';

const VesselNavigation = () => {
  const startLat = 22.1696;
  const startLon=91.4996;
  const endLat= 22.2637;
  const endLon= 91.7159;
  const speed= 20 // Speed in kmph
  const [newLat, setNewLat] = useState(startLat);
  const [newLon, setNewLon] = useState(startLon);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [reachedDestination, setReachedDestination] = useState(false);
  const updateInterval = 500; // Update every 0.5 second

  const calculateNewPosition = useCallback(() => {
    const distance = Math.sqrt(Math.pow(endLat - startLat, 2) + Math.pow(endLon - startLon, 2));
    const traveledDistance = (speed * (timeElapsed / 3600)); // Convert time to hours
    const ratio = traveledDistance / distance;
    const newLat = startLat + (endLat - startLat) * ratio;
    const newLon = startLon + (endLon - startLon) * ratio;
    return [newLat, newLon];
  }, [endLat, endLon, startLat, startLon, speed, timeElapsed]);

  const updatePosition = useCallback(() => {
    const [newLat, newLon] = calculateNewPosition();

    setNewLat(newLat);
    setNewLon(newLon);
    setTimeElapsed(timeElapsed + updateInterval / 1000); // Increment time elapsed

    if (newLat >= endLat && newLon >= endLon) {
      console.log('Reached destination.');
      setReachedDestination(true);
    }
  }, [calculateNewPosition, endLat, endLon, setNewLat, setNewLon, setTimeElapsed, timeElapsed, updateInterval]);

  useEffect(() => {
    if (!reachedDestination) {
      const updatePositionInterval = setInterval(updatePosition, updateInterval);
      return () => clearInterval(updatePositionInterval);
    }
  }, [updatePosition, updateInterval, reachedDestination]);
  // const rotationAngle = Math.atan2(endLat - startLat, endLon - startLon) * (180 / Math.PI);
  const deltaX = endLon - startLon;
  const deltaY = endLat - startLat;
  const angleRad = Math.atan2(deltaY, deltaX);
  const angleDeg = (angleRad * 180) / Math.PI + 20;
  const boatIcon = L.divIcon({
    className: 'boat-icon',
    html: `<img src="${vesselIcon}" style="transform: rotate(${angleDeg}deg); width: 10px; height: 50px;" />`,
    iconSize: [32, 32],
  });
  
  return (
    <>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '19rem', paddingRight: '19rem'}}>
  <Container maxWidth="xl" style={{ margin: '1rem', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ flexBasis: '40%', color: 'black',marginLeft:'2rem' }}>
        <h3>Starting</h3>
        <p>Lat: {startLat.toFixed(4)}</p>
        <p>Long: {startLon.toFixed(4)}</p>
      </div>
      <div style={{ flexBasis: '25%', color: 'black' }}>
        {/* <h5>Speed </h5> */}
        <p>Speed : {speed} km/h </p>
      </div>
      <div style={{ flexBasis: '35%', color: 'black', marginLeft: '5rem'}}>
        <h3>Ending</h3>
        <p>Lat:  {endLat.toFixed(4)}</p>
        <p>Long: {endLon.toFixed(4)}</p>
      </div>
    </div>
  </Container>
</div>

    <MapContainer center={[startLat, startLon]} zoom={11} style={{ height: '500px',margin:'2rem' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <Marker position={[startLat, startLon]} icon={L.icon({ iconUrl: startPointIcon, iconSize: [32, 32] })} />
      <Marker position={[endLat, endLon]} icon={L.icon({ iconUrl: endPointIcon, iconSize: [32, 32] })} />
      {!reachedDestination && <Marker position={[newLat, newLon]}icon={boatIcon} />}
      {reachedDestination && <Marker position={[endLat, endLon]} icon={L.icon({ iconUrl: vesselIcon, iconSize: [10, 50] })} />}
    </MapContainer>
  
    </>
  );
};

export default VesselNavigation;
