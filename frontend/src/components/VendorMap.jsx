import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function VendorMap({ vendors, center }) {
  if (!center) return null;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '320px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User's own location — a filled circle, visually distinct from vendor pins */}
      <Circle
        center={[center.lat, center.lng]}
        radius={200}
        pathOptions={{ color: '#C9672E', fillColor: '#C9672E', fillOpacity: 0.4 }}
      >
        <Popup>You are here</Popup>
      </Circle>

      {vendors
        .filter((v) => v.latitude && v.longitude)
        .map((vendor) => (
          <Marker key={vendor.id} position={[vendor.latitude, vendor.longitude]}>
            <Popup>
              <strong>{vendor.businessName}</strong>
              <br />
              ★ {vendor.avgRating.toFixed(1)} ({vendor.ratingCount})
              <br />
              <Link to={`/vendor/${vendor.id}`} className="text-terracotta">
                View details →
              </Link>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}