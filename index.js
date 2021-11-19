const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = `mongodb+srv://TorismPlaces:${process.env.DB_PASS}@cluster0.qdqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("MotorBike");
        const bikeCollection = database.collection("Bikes");
        const usersCollection = database.collection("User");
        const userBooking = database.collection("Booking");
        const userReview = database.collection("Review");

        console.log("db Connected");
        // API for all Bikes for HOme and Explore and Manage All Bike product
        app.get('/Bikes', async (req, res) => {
            const cursor = bikeCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
        })

        // delete Bike
        app.delete("/deleteBike/:id", async (req, res) => {
            const result = await bikeCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        // POST API For Booking 
        app.post('/booking', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await userBooking.insertOne(service);
            console.log(result);
            res.json(result);

        });

        // get single Bikes information
        app.get("/singleBike/:id", async (req, res) => {
            const result = await bikeCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });
        // Get My Orders by email
        app.get("/myBookings/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await userBooking
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        // Get All My Orders for admin
        app.get("/allOrders", async (req, res) => {
            const result = await userBooking
                .find({})
                .toArray();
            res.send(result);
        });

        /// delete order

        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await userBooking.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        // Adding New Bikes API 
        app.post('/addBike', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await bikeCollection.insertOne(service);
            console.log(result);
            res.json(result);

        });
        // Adding New Review API 
        app.post('/addReview', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await userReview.insertOne(service);
            console.log(result);
            res.json(result);
        });
        // Adding New User for register API 
        app.post('/addUser', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await usersCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        // Adding New User for Google singIn API 
        app.put('/addUser', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        // Adding Admin API
        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });
                console.log(documents);
            }
        });

        // checking admin or not
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });

        // API for all Review for HOme
        app.get('/Review', async (req, res) => {
            const cursor = userReview.find({});
            const review = await cursor.toArray();
            res.send(review);
        })
        // updated Status for pending
        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            userBooking
                .updateOne(filter, {
                    $set: { status: updatedStatus },
                })
                .then((result) => {
                    res.send(result);
                });
        });


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Assignment 12');
});

app.listen(port, (req, res) => {
    console.log("listening From Web and Port No:", port);
})