const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://assignment-job-task.vercel.app"],
    credentials: true,
  })
);

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSEORD}@datafind.xfgov3s.mongodb.net/?retryWrites=true&w=majority&appName=datafind`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const productCollection = client
      .db("assignment_task")
      .collection("products_list");

    app.get("/", async (req, res) => {
      res.send("hello World");
    });

    app.get("/searchText/:num", async (req, res) => {
      const regex = new RegExp(req.params.num, "i");
      let findText = { name: { $regex: regex } };
      const result = await productCollection.find(findText).toArray();
      return res.send(result);
    });

    app.get("/brandName/:num", async (req, res) => {
      const regex = new RegExp(req.params.num, "i");
      let findText = { brand: { $regex: regex } };
      const result = await productCollection.find(findText).toArray();
      return res.send(result);
    });

    app.get("/categoryname/:num", async (req, res) => {
      const regex = new RegExp(req.params.num, "i");
      let findText = { category: { $regex: regex } };
      const result = await productCollection.find(findText).toArray();
      return res.send(result);
    });

    app.get("/highToLowBalance/:num", async (req, res) => {
      // console.log(req.params.num);
      const orders = req.params.num.split(",");
      console.log(orders[0], orders[1] + " well ");
      const result = await productCollection
        .find({ price: { $gte: Number(orders[0]), $lte: Number(orders[1])} })
        .toArray();
      return res.send(result);
    });
    app.get("/product/:text", async (req, res) => {
      console.log(req.params.text);

      let pageSkip = 0;
      if (req.params.text === 0) {
        pageSkip = req.params.text === 0 || 0;
      } else {
        pageSkip = req.params.text;
      }
      try {
        const productCount = await productCollection.countDocuments();
        const product = await productCollection
          .find()
          .skip(pageSkip * 10)
          .limit(10)
          .toArray();
        return res.send({ product, productCount });
      } catch (err) {
        return res.send(err.message);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(process.env.PORT, () => {
  console.log(`This Server is Run ${process.env.PORT}`);
});
