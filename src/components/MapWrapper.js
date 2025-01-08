
"use client";

import { PositionContext } from '@/app/page';
import dynamic from 'next/dynamic';
import { useContext } from 'react';


const Map = dynamic(() => import('@/components/Map'), {
    ssr: false 
});



export default function MapWrapper() {
 
  const {dataset} = useContext(PositionContext);
 
  

  return (
    <Map dataset={dataset?.data?.geoJSONData} />
  );
}