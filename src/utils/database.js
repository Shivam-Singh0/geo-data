import { MongoClient } from 'mongodb';

export async function upsertGeoJson(userId, geoJSONData) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const database = client.db('GeoData');
    const collection = database.collection('SavedLocations');

    // Check if the document already exists
    const exists = await collection.findOne({ userId });

    if (exists) {
      // If the document exists, append the new geoJSONData to the existing array
      const updatedDocument = {
        $set: {
          geoJSONData: [...(exists.geoJSONData || []), ...geoJSONData], // Ensure geoJSONData is an array
        },
      };

      await collection.updateOne({ userId }, updatedDocument);
      console.log(`Successfully updated document for userId: ${userId}`);
    } else {
      // If the document does not exist, create a new document
      const newDocument = {
        userId,
        geoJSONData,
      };

      await collection.insertOne(newDocument);
      console.log(`New document created for userId: ${userId}`);
    }
  } finally {
    await client.close();
  }
}


export async function getDataSet (userId) {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const database = client.db('GeoData');
  const collection = database.collection('SavedLocations');
 try {
    return await collection.findOne({userId})
 } catch (error) {
    console.log(error)
 }
 finally {
  await client.close();
 }

}
