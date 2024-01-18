const express= require('express')
const app=express()
const port = process.env.PORT || 4000;
const cors=require('cors')
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


//for fetching all the recipies or individual recipie per query
app.get('/allRecipes',async(req,res)=>{
      const id=req.query.meal
    

      let filter={}
      if(id){
        filter={_id:new ObjectId(id)}
      }
      const allRecipes=await recipeCollection.find(filter).toArray()
      res.send(allRecipes)
  })

// for filtering data according to search input
app.get('/allRecipe',async(req,res)=>{
      const value=req.query.value
      console.log(value)
    

      let filter={}
      if(value){
       
        filter = {
          name: { $regex: value, $options: 'i' }
        };
      }
      const allRecipes=await recipeCollection.find(filter).toArray()
      res.send(allRecipes)
  })


  //for editing recipie information
  app.patch('/allRecipes',async (req, res) => {
    const id = req.query.recipeId;
    const recipe=req.body
    const query = { _id: new ObjectId(id) }
    const updatedDoc = {
      $set: {
        name:recipe.name,
        instruction:recipe.instruction,
        ingredients:recipe.ingredients,
        image:recipe.image
      }
    }

    const result = await recipeCollection.updateOne(query, updatedDoc)
    res.send(result);
  })


//for creating recipe
app.post('/allRecipes',async(req,res)=>{
    const data=req.body
    console.log(data)
    const meal=await recipeCollection.insertOne(data)
   
    res.send(meal)

})

//for deleting a recipie
app.delete('/allRecipes/:id',async(req,res)=>{
    const id=req.params.id
  
    const  filter={_id:new ObjectId(id)}
    const recipe=await recipeCollection.deleteOne(filter)
   
    res.send(recipe)
})


app.get('/', async(req, res) => {
  res.send('Delish is running')
})
app.listen(port,()=>{
    console.log(`Delish is sitting on port ${port}`)
})  
