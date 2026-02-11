import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useHospitals } from "@/hooks/use-health";
// Third-party components
import { MapPin, Navigation, Loader2 } from "lucide-react";
import L from "leaflet";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// @ts-ignore
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icon for Hospitals (Blue)
const hospitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Icon for User Location
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function HospitalMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionDenied(true);
          }
          // Default to Istanbul center if location fails
          setLocation({ lat: 41.0082, lng: 28.9784 });
        }
      );
    } else {
      // Default to Istanbul
      setLocation({ lat: 41.0082, lng: 28.9784 });
    }
  }, []);

  const { data: hospitals, isLoading } = useHospitals(
    location ? { ...location, radius: 5000 } : null
  );

  if (!location) {
    return (
      <div className="h-96 w-full rounded-3xl bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Konumunuz alınıyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-1 shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden">
      <div className="h-[500px] w-full relative rounded-2xl overflow-hidden z-0">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold">Sizin Konumunuz</div>
            </Popup>
          </Marker>

          {hospitals?.map((hospital: any) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={hospitalIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-primary text-base mb-1">{hospital.name}</h3>
                  <p className="text-sm text-slate-600 mb-1">Sağlık Kurumu</p>
                  <p className="text-sm text-slate-600 mb-2">{hospital.address}</p>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {hospital.distance ? `${(hospital.distance / 1000).toFixed(1)} km` : ''}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Overlay Legend */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-100 z-[1000] text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="font-medium text-slate-700">Sizin Konumunuz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="font-medium text-slate-700">Hastaneler</span>
          </div>
        </div>

        {permissionDenied && (
          <div className="absolute bottom-4 left-4 right-4 bg-yellow-50/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-yellow-200 z-[1000] text-sm flex items-start gap-3">
            <Navigation className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-800">Konum İzni Verilmedi</p>
              <p className="text-yellow-700">Size en yakın hastaneleri göstermek için tarayıcı konum iznine ihtiyacımız var. Varsayılan olarak İstanbul merkez gösteriliyor.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
