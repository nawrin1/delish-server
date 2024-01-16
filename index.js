const express= require('express')
const app=express()
const port = process.env.PORT || 4000;
require('dotenv').config()

// middleware
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqv383i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const dbConnect = async () => {
    try {
        client.connect()
        console.log('delish db Connected Successfully')
    } catch (error) {
        console.log(error.name, error.message)
    }
  }
dbConnect()


// Creating collections
const recipeCollection = client.db("delishDb").collection("allRecipes");


app.get('/allRecipes',async(req,res)=>{
      const allRecipes=await recipeCollection.find().toArray()
      res.send(allRecipes)
  })


app.get('/', async(req, res) => {
    res.send('Delish is running')
  })
app.listen(port,()=>{
    console.log(`Delish is sitting on port ${port}`)
})  