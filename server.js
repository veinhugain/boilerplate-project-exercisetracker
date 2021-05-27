const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");


app.use(cors())
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const Person = require("./person.js").PersonModel;

app.post('/api/users', (req, res) => {
  console.log(req.body)








  res.json({answer: req.body.username})
});



app.post('/api/users/:userId/exercises', (req, res) => {
  console.log(req.params,req.body)








  res.json({answer: req.params.userId})
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})




