import { PositionContext } from "@/app/page";
import { useContext, useMemo, useRef, useState } from "react"
import { Marker, Popup, useMapEvents }from "react-leaflet"

function DraggableMarker() {
    const {position, setPosition} = useContext(PositionContext);
    
    
    const redIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        shadowSize: [41, 41],
      });
      
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })


    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
  
    return (
    <>
     {position && (
        <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        style = {{colo: "red"}} icon={redIcon}>
        <Popup minWidth={90}>
            Your are here
        </Popup>
      </Marker>
     )}
    </>
    )
  }

  export default DraggableMarker