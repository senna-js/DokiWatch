const username = "kkawathia841994"
const pass = "W8DggkJPZBU5E6ca"


import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://kkawathia841994:${pass}@mal-zoro-mapping.6mywcei.mongodb.net/?retryWrites=true&w=majority&appName=Mal-Zoro-Mapping`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const newAnime = {mal_id : 19815,al_id : 19815,zoro_id : "no-game-no-life-261"};
    // const result = await client.db("Zoro").collection("mappings").insertOne(newAnime);
    // console.log(`New listing created with the following id: ${result.insertedId}`);

    const animes =await client.db("Zoro").collection("mappings").find({}).toArray();  
    console.log(animes);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
