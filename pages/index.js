import Head from "next/head";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import mapStyle from "../components/mapStyle";
import { useState, useCallback } from "react";
import Shell from "../components/Shell";
import { Store } from "../contexts/Store";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  fontFamily: "proxima-nova",
};
const center = {
  lat: -33.8688,
  lng: 151.2093,
};
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: false,
};

export default function Home() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_TOKEN,
    libraries,
  });

  const [Selected, setSelected] = useState(null);

  const addLog = Store((state) => state.addLog);
  const Logs = Store((state) => state.Logs);

  const onMapClick = useCallback((event) => {
    addLog(event.latLng.lat(), event.latLng.lng(), new Date());
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div className="absolute w-screen h-screen top-0 left-0">
      <Head>
        <title>Ghosts Alert Global</title>
        <meta
          name="description"
          content="Ghosts! An app to track all your ghost sightings!"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/jyh4wlw.css"
        ></link>
        <style>
          {`
         ul {
       padding-inline-start: 0px !important;
          }

          `}
        </style>
      </Head>
      <style jsx>
        {`
          font-family: proxima-nova, sans-serif !important;
        `}
      </style>
      <main className="relative h-full">
        <Shell panTo={panTo}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {Logs.map((marker) => (
              <Marker
                key={marker.time.toISOString()}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: "/ghost.svg",
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                onClick={() => {
                  setSelected(marker);
                  console.log(marker.lat);
                }}
              />
            ))}
            {Selected ? (
              <InfoWindow
                position={{ lat: Selected.lat, lng: Selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <p>Ghost seen at</p>
                  <p>{formatRelative(Selected.time, new Date())}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </Shell>
      </main>
    </div>
  );
}
