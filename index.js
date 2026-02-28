
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // <--- 1. ObjectId ekhane add koro

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',           
    'https://loan-link-4d8e2.web.app',  
    'https://loan-link-4d8e2.firebaseapp.com'
  ],
  credentials: true
}));

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
    const db = client.db('loan-link-db'); 
const loansCollection = db.collection('loans'); 
const applicationCollection = db.collection('application');
const usersCollection = db.collection("users"); 

  

    
    app.get('/loans', async (req, res) => {
      const cursor = loansCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    

  
app.get('/loans/latest', async (req, res) => {
  const result = await loansCollection
      .find()
      .sort({ _id: -1 }) 
      .limit(6)          
      .toArray();
   res.send(result);
});

  
    app.get('/loans/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const result = await loansCollection.findOne(query);
      res.send(result);
    });

    app.post('/loansApplication', async (req, res) => {
      const application = req.body;
      application.createdAt = new Date();
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    });

    app.get('/loansApplication',async(req, res)=>{
      const query = {}
      const email = req.query.email
      if(email){
        query.Email = email
      }
      const cursor = applicationCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    });

    // ২. ইউজার সেভ বা আপডেট করার রুট (PUT Method)
app.put('/users', async (req, res) => {
  try {
      const user = req.body;
      // আমরা ইমেইল দিয়ে চেক করবো ইউজার অলরেডি আছে কি না
      const query = { Email: user.Email }; 
      
      const options = { upsert: true }; // ইউজার না থাকলে নতুন তৈরি করবে
      
      const updateDoc = {
          $set: {
              name: user.name,
              photo: user.photo,
              lastLogin: new Date().toISOString() // শেষ কখন লগইন করেছে তা ট্র্যাক করবে
          },
          // নিচের অংশটি শুধুমাত্র নতুন ইউজারের ক্ষেত্রে সেভ হবে
          $setOnInsert: {
              role: 'User', // ডিফল্ট রোল 'User' হিসেবে থাকবে
              createdAt: new Date().toISOString()
          }
      };

      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
  } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});

// ৩. (অপশনাল) সব ইউজার দেখার জন্য গেট রুট (অ্যাডমিন প্যানেলের জন্য লাগবে)
app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

 

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