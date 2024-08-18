const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSEORD}@datafind.xfgov3s.mongodb.net/?retryWrites=true&w=majority&appName=datafind`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const productCollection = client.db('assignment_task').collection('products_list');


    app.get('/', (req, res)=>{
        res.send('hello World')
    })
    app.get('/product/:num', async(req, res)=>{
        console.log(req.params.num)
        let pageSkip = 0;
        if(req.params.num === 0){
            pageSkip = req.params.num === 0 || 0;
        }else{
            pageSkip = req.params.num ;
        }
        
        try{
            const productCount = await productCollection.countDocuments();
            const product = await productCollection.find().skip(pageSkip * 10).limit(10).toArray();
           return res.send({product, productCount})
        }catch(err){
           return res.send(err.message)
        }

    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.listen(process.env.PORT, ()=>{
    console.log( `This Server is Run ${process.env.PORT}`)
})