import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

type MapRenderProps = {
  origin: string;
  destination: string;
};

function DirectionMap({ origin, destination }: MapRenderProps) {
  const map = useMap();
  const routeLibrary = useMapsLibrary("routes");
  const [directionService, setDirectionService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionRenderer, setDirectionRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [route, setRoute] = useState(0);
  const selected = routes[route];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!map || !routeLibrary) return;
    setDirectionService(new routeLibrary.DirectionsService());
    setDirectionRenderer(new routeLibrary.DirectionsRenderer({ map }));
  }, [map, routeLibrary]);

  useEffect(() => {
    if (!directionService || !directionRenderer) return;
    directionService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: true,
      })
      .then((result) => {
        directionRenderer.setDirections(result);
        directionRenderer.setOptions({
          polylineOptions: {
            strokeColor: "#C8A846",
            strokeOpacity: 1,
            strokeWeight: 4,
          },
          suppressMarkers: true,
        });
        setRoutes(result.routes);
      });
  }, [directionService, directionRenderer]);

  if (!leg) return null;

  return (
    <div className="directions z-[9999] bg-white rounded-lg shadow-md p-4 border border-[#E1D4A7]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#C8A846]">
          {selected?.summary}
        </h2>
        <div className="bg-[#F5EFD9] px-3 py-1 rounded-full text-sm font-medium text-[#C8A846]">
          {leg.duration?.text}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#C8A846] flex items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-medium text-gray-800">{leg.distance?.text}</p>
        </div>
      </div>

      <div className="border-t border-[#F5EFD9] pt-3 mt-2">
        <div className="flex items-start gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Starting Point</p>
            <p className="font-medium text-gray-800">{leg.start_address}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-medium text-gray-800">{leg.end_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const geocodeAddress = (
  address: string
): Promise<google.maps.LatLngLiteral> => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        reject(`Geocode failed: ${status}`);
      }
    });
  });
};

export const UseMapRender = ({ origin, destination }: MapRenderProps) => {
  const [originPosition, setOriginPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [destinationPosition, setDestinationPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setOriginPosition(await geocodeAddress(origin));
      setDestinationPosition(await geocodeAddress(destination));
    };
    fetchPositions();
  }, [origin, destination]);
  return (
    <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={originPosition || { lat: 10.762334, lng: 106.648775 }}
        gestureHandling={"greedy"}
        mapId={import.meta.env.VITE_MAP_ID}
      >
        {origin && (
          <Marker
            position={originPosition}
            icon={{
              url: "/img/icons/origin.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}

        {/* Marker cho destination */}
        {destination && (
          <Marker
            position={destinationPosition}
            icon={{
              url: "/img/icons/destination.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}

        <DirectionMap origin={origin} destination={destination} />
      </Map>
    </APIProvider>
  );
};
