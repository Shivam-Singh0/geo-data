import { createControlComponent } from "@react-leaflet/core";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const Geoman = L.Control.extend({
  options: {},
  initialize(options) {
    L.setOptions(this, options);
  },

  addTo(map) {
    if (!map.pm) return;

    map.pm.addControls({
      ...this.options,
    });
  },
});



const createGeomanInstance = (props) => {
    
  return new Geoman(props);
};

export const GeomanControl = createControlComponent(createGeomanInstance);
