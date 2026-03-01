const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

    // loan api
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

    // loan application post
    app.post('/loansApplication', async (req, res) => {
      const application = req.body;
      application.createdAt = new Date();
      application.status = "Pending"; 
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    });


// get loan application role based
app.get('/loansApplication', async (req, res) => {
  try {
      const email = req.query.email; 
      let query = {};

      if (email && email !== "admin@gmail.com") {
          query = {
            $or: [
              { Email: email },
              { email: email }
            ]
          };
      }

      const result = await applicationCollection
          .find(query)
          .sort({ _id: -1 }) 
          .toArray();
          
      res.send(result);
  } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});

  // patch api for admin
    app.patch('/loansApplication/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: status }
        };
        const result = await applicationCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    
    // check admin status
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ Email: email });
      let isAdmin = false;
      if (user) {
          isAdmin = user?.role === 'Admin';
      }
      res.send({ admin: isAdmin });
    });

  //  user api
    app.put('/users', async (req, res) => {
      try {
          const user = req.body;
          const query = { Email: user.Email }; 
          const options = { upsert: true };
          
          const updateDoc = {
              $set: {
                  name: user.name,
                  photo: user.photo,
                  lastLogin: new Date().toISOString()
              },
              $setOnInsert: {
                  role: 'User', 
                  createdAt: new Date().toISOString()
              }
          };

          const result = await usersCollection.updateOne(query, updateDoc, options);
          res.send(result);
      } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
      }
    });

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Database error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Loanlink Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});