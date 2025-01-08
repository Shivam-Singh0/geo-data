
import { MapContainer, Marker, Polygon, Polyline, Popup, Rectangle, TileLayer, FeatureGroup } from 'react-leaflet'

import DraggableMarker from './DraggableMarker'
import { GeomanControl } from './GeomanControl'
import Events from './Events'



export default function Map({dataset}) {
  
  
  return (
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '80vh', width: '70%' }}>
    
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <GeomanControl />
  <Events />
  <DraggableMarker />

  {dataset?.map((feauture, idx) => (
    feauture.geometry.type == "Point" ? (
      <Marker key={idx} position={feauture.geometry.coordinates}>
     <Popup>
       <p>{feauture.properties.name}</p>
     </Popup>
   </Marker>
    ) : feauture.geometry.type == "LineString" ? (
      <Polyline pathOptions={{color: "lime"}} positions={feauture.geometry.coordinates} key={idx} >
         <Popup>
       <p>{feauture.properties.name}</p>
     </Popup>
      </Polyline>
    ): (
      feauture.geometry.type == "Polygon" ? <Polygon pathOptions={{color: "blue"}} positions={feauture.geometry.coordinates} key={idx} >
        <Popup>
       <p>{feauture.properties.name}</p>
     </Popup>
      </Polygon>
      : (
        <Rectangle bounds={feauture.geometry.coordinates} pathOptions={{color: "red"}} key={idx} />
      )
    )
    
  ))}
 
</MapContainer>
  )
}
