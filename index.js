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
        const userBooking = database.collection("Booking");
        const userReview = database.collection("Review");
        console.log("db Connected");
        // API for all places for HOme
        app.get('/Bikes', async (req, res) => {
            const cursor = bikeCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
        })

        // delete Places

        app.delete("/delteOrder/:id", async (req, res) => {
            const result = await userCollection.deleteOne({
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

        // get single Place
        app.get("/singlePlace/:id", async (req, res) => {
            const result = await userCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });
        // Get All My Orders by email
        app.get("/myOrders/:email", async (req, res) => {
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
        // Adding New Tour Spot API 
        app.post('/addTourSpot', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await userCollection.insertOne(service);
            console.log(result);
            res.json(result);

        });
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