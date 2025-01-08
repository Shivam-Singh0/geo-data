import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";

const Events = () => {
    const map = useMap();
    const currentLine = useRef(null);
    const lineTooltip = useRef(null);

    useEffect(() => {
        if (map) {
            map.on("pm:create", (e) => {
                console.log("Layer created:", e);
                const layer = e.layer;

                let latlng = null;

                if (layer instanceof L.Marker) {
                    latlng = layer.getLatLng();
                } else if (layer instanceof L.Circle) {
                    latlng = layer.getLatLng();
                } else {
                    const bounds = layer.getBounds();
                    latlng = bounds.getCenter();
                }

                if (latlng) {
                    const { lat, lng } = latlng;
                    L.popup()
                        .setLatLng(latlng)
                        .setContent(`Layer Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                        .openOn(map);
                }

                layer.on("click", () => {
                   console.log("Layer clicked", e);
                });

                layer.on("pm:edit", () => {
                    console.log("Layer edited", e);
                });

                layer.on("pm:update", () => {
                    console.log("Layer updated", e);
                });

                layer.on("pm:remove", (e) => {
                   console.log("Layer removed:", e);
                     if (layer === currentLine.current && lineTooltip.current) {
                         map.removeLayer(lineTooltip.current);
                         lineTooltip.current = null;
                     }
                });

                layer.on("pm:dragstart", (e) => {
                    console.log("Layer dragstart:", e);
                });

                layer.on("pm:dragend", (e) => {
                    console.log("Layer dragend:", e);
                });
            });


            map.on("pm:drawstart", (e) => {
              currentLine.current = null;
              lineTooltip.current = null;
              if (e.shape === "Line") {
                 e.workingLayer.on("pm:vertexadded", (vertexEvent) => {
                       currentLine.current = vertexEvent.workingLayer;
                        const coords = vertexEvent.workingLayer.getLatLngs();
                           if (coords.length >= 2) {
                               const lastPoint = coords[coords.length - 1];
                               const secondLastPoint = coords[coords.length - 2];
                               const distance = L.latLng(secondLastPoint).distanceTo(lastPoint);
                               const distanceFormatted = (distance / 1000).toFixed(2); // in Km

                                if (!lineTooltip.current) {
                                   lineTooltip.current = L.tooltip({
                                      permanent: true,
                                       direction: "top",
                                    }).addTo(map);
                                }

                             lineTooltip.current.setLatLng(lastPoint);
                             lineTooltip.current.setContent(`${distanceFormatted} km`);
                         }  else if(coords.length === 1) {
                            if(lineTooltip.current){
                                lineTooltip.current.setLatLng(coords[0])
                                lineTooltip.current.setContent(`0 km`)
                             }
                        }
                    });
                 }
               console.log("Layer drawstart:", e);
            });

            map.on("pm:drawend", (e) => {
                 console.log("Layer drawend:", e);
               if(lineTooltip.current){
                  map.removeLayer(lineTooltip.current)
                  lineTooltip.current = null
               }
                 if(e.workingLayer && e.shape === "Line"){
                 e.workingLayer.off("pm:vertexadded")
                 }
             });

           map.on("pm:globaldrawmodetoggled", (e) => {
               console.log("Layer globaldrawmodetoggled:", e);
            });

           map.on("pm:globaldragmodetoggled", (e) => {
               console.log("Layer globaldragmodetoggled:", e);
            });

           map.on("pm:globalremovalmodetoggled", (e) => {
               console.log("Layer globalremovalmodetoggled:", e);
            });

           map.on("pm:globalcutmodetoggled", (e) => {
               console.log("Layer globalcutmodetoggled:", e);
             });

           map.on("pm:globalrotatemodetoggled", (e) => {
               console.log("Layer globalrotatemodetoggled:", e);
            });

          map.on("click", (e) => {
             const { lat, lng } = e.latlng;

              L.popup()
                  .setLatLng(e.latlng)
                  .setContent(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                 .openOn(map);
          });

             // Cleanup function to remove event listeners
          return () => {
                map.off("pm:create");
                map.off("pm:drawstart");
                map.off("pm:drawend");
                map.off("pm:globaldrawmodetoggled");
                map.off("pm:globaldragmodetoggled");
                map.off("pm:globalremovalmodetoggled");
                map.off("pm:globalcutmodetoggled");
                map.off("pm:globalrotatemodetoggled");
                map.off("click");
            };
        }
    }, [map]);

    return null;
};

export default Events;