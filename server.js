const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/workout";
mongoose.connect(MONGODB_URI,{  
    useNewUrlParser:true,
    useFindAndModify:false
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/exercise', (req, res) => {
    res.sendFile(path.normalize(__dirname + "/public/exercise.html"));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.normalize(__dirname + "/public/stats.html"));
})

app.get('/api/workouts', (req, res) => {
    db.Workout.find({}).then(data => {
        console.log(data);
        res.json(data);
    });
});

app.get('/api/workouts/range', (req, res) => {
    db.Workout.find({}).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(404).json(err.message);
    });
});

app.put('/api/workouts/:id', (req, res) => {
    db.Workout.findByIdAndUpdate(req.params.id,
        { $push: { exercises: req.body } }, (err, data) => {
            if (err) console.log(err);
            else res.json(data);
        })
});

app.post('/api/workouts', (req, res) => [
    db.Workout.create(req.body, (err, data) => {
        if (err) console.log(err);
        else res.json(data);
    })
]);


app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log('Listening on http://localhost:' + PORT);
});