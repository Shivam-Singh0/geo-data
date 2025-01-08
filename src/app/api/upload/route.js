
import {getDataSet, upsertGeoJson} from "@/utils/database"

export async function POST(req) {
  const { userId, geoJSONData } = await req.json();

  try {
    await upsertGeoJson(userId, geoJSONData);
    return new Response(JSON.stringify({ message: 'GeoJSON data upserted successfully' }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error upserting GeoJSON data' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}



export async function GET(req) {
  const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
 
  
  try {
    const data = await getDataSet(userId);
    return new Response(JSON.stringify(data),  {
      status : 200,
      headers: { 'Content-Type': 'application/json' } 
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ message: 'Error upserting GeoJSON data' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
