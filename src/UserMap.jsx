import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './UserMap.module.scss';
import ErrorBoundary from './ErrorBoundary';

function UserMap({ lat, lng, address, addressText }) {
  if (!lat || !lng) {
    return <div className={styles.userMapPlaceholder}>Карта недоступна</div>;
  }

  const coords = [lat, lng];

  return (
    <ErrorBoundary>
      <div className={styles.userMap}>
        <MapContainer center={coords} zoom={15} scrollWheelZoom={false} className={styles.userMap}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </ErrorBoundary>
  );
}

export default UserMap; 