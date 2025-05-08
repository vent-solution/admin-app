import React from "react";
import { RxCross1 } from "react-icons/rx";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface Props {
  toggleOpenAndCloseMap: () => void;
  coords: {
    lat: number;
    lng: number;
  };
  distance: number;
}

const libraries: any = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const Maps: React.FC<Props> = ({ toggleOpenAndCloseMap, coords }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAADf7n_P7fW6iORAB2vCzyGoDDtEzdv0c",
    libraries,
  });

  return (
    <div className="w-full my-5 h-[calc(100vh-200px)] shadow-xl relative flex items-center justify-center ">
      <button
        className="text-xl font-bold lg:hover:text-white lg:hover:bg-red-500 p-2 absolute top-1 right-1 z-20"
        onClick={toggleOpenAndCloseMap}
      >
        <RxCross1 />
      </button>

      {loadError && <h1>Error loading maps!</h1>}

      {!isLoaded && !loadError && <h1>Loading maps...</h1>}

      {isLoaded && !loadError && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coords}
          zoom={10}
        >
          <Marker position={coords} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Maps;
