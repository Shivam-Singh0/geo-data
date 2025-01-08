"use client";
import "leaflet/dist/leaflet.css";

import * as L from "leaflet"

import MapWrapper from "@/components/MapWrapper";
import { createContext, useState, useEffect, useCallback } from "react";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


export const PositionContext = createContext();

export default function Home() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState();
  const [dataset, setDataset] = useState();
  const [name, setName] = useState("");
  const [currentPosition, setCurrentPosition] = useState({
    type: "FeatureCollection",
    features: [],
  });

  //Fetching Data from backend
  const fetchData = useCallback(async () => {
    const config = {
      headers : { 'Content-Type': 'application/json'},
      params: {
        userId,
      },
    }
   
    setLoading(true);
    const data = await axios.get( '/api/upload', config)
   
    setDataset(data)
    setLoading(false);
  },[userId])

  useEffect(() => {
   

    fetchData();
  }, [fetchData])

  // Use useEffect to update currentPosition only when position changes
  useEffect(() => {
    if (position) {
      setCurrentPosition((prev) => ({
        ...prev,
        features: [
         
          {
            type: "Feature",
            properties: {"name" : name},
            geometry: {
              coordinates: [position.lat, position.lng], // Corrected typo (lng instead of lang)
              type: "Point",
            },
          },
        ],
      }));
    }
  }, [position, name]); // Only run when position changes

  if (!userId) return <RedirectToSignIn />;

  const uploadHandler = async(event) => {
    event.preventDefault();
    setName("");
    
    const geoJSONData = [
      // Your GeoJSON data array
      ...currentPosition.features
    ];
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, geoJSONData }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to upsert GeoJSON data');
      }
  
      await response.json();
      toast.success("uploaded successfully")
      fetchData();
     
    } catch (error) {
      toast.error("error occured")
      console.error(error);
      
    }
  }
  



  if (loading || !dataset) {
    return <h1>Loading....</h1>
  }


  return (
    <PositionContext.Provider value={{ setPosition, position, dataset }}>
      <ToastContainer/>
      <div className="flex">
        <MapWrapper />
        <div className="bg-white w-[30%] p-5" >
          <button className="text-white p-2 bg-blue-700 rounded-md hover:bg-blue-900" disabled={!position} onClick={uploadHandler}>Upload</button>
          <input className="ml-2  text-black border" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} disabled={!position} />
          <pre className="text-black">{JSON.stringify(currentPosition, null, 2)}</pre>
        </div>
      </div>
    </PositionContext.Provider>
  );
}
