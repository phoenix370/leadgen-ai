"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// 1. Create Custom Red Dot (No Website)
const redIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// 2. Create Custom Green Dot (Has Website)
const greenIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Helper component to re-center map when new data arrives
function MapUpdater({ businesses }: { businesses: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (businesses.length > 0) {
      const bounds = L.latLngBounds(businesses.map(b => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [businesses, map]);
  return null;
}

export default function LeafletMap({ businesses }: { businesses: any[] }) {
  return (
    <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Auto-zoom to fit the new businesses */}
      <MapUpdater businesses={businesses} />

      {businesses.map((biz) => (
        <Marker 
          key={biz.id} 
          position={[biz.lat, biz.lng]}
          icon={biz.hasWebsite ? greenIcon : redIcon} // Apply Red or Green dot
        >
          <Popup>
            <div className="p-1 min-w-[200px] text-black">
              <h3 className="font-bold text-lg">{biz.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{biz.category} • {biz.address}</p>
              
              <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${
                biz.hasWebsite ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {biz.hasWebsite ? '✓ HAS WEBSITE' : '✗ NO WEBSITE (LEAD)'}
              </div>

              {!biz.hasWebsite && (
                <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700">
                  Generate AI Demo Site
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}