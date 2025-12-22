
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // <--- 1. ObjectId ekhane add koro

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uufcxef.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db('loan-link-db');
    const loansCollection = db.collection('loans');

    // --- API Error Fix Starts Here ---

    // 1. Shob loan pawar jonno (All Loans)
    app.get('/loans', async (req, res) => {
      const cursor = loansCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // 2. Jodi specific kono ID diye loan khujte chao (Specific Loan)
    app.get('/loans/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Ekhon ObjectId kaaj korbe
      const result = await loansCollection.findOne(query);
      res.send(result);
    });

    app.post('/loans', async (req, res) => {
      const loans = req.body;
      const result = await loansCollection.insertOne(loans);
      res.send(result);
    });

    // --- API Error Fix Ends Here ---

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Database error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Loanlink is running');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});