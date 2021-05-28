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


// const feedRalph = ({})=>{

//   {
//   username: String, // String is shorthand for {type: String}
//   log : [{
//     description: String,
//     duration : Number,
//     date: String
//     }]
//   }

// }

const Person = require("./person.js").PersonModel;

app.post('/api/users', (req, res) => {
  console.log('addUser', req.body)
  const username = req.body.username;

  Person.find({ username: username })//, (err, data) => {}
  .then((data)=>{
    console.log('person find: \n',data)
    if (data.length === 0){
      ralph = new Person({
        username: username,
      });
      ralph.save()//(err, data) => {
        .then((data) => {
          console.log('ralph', data);
          res.json({
            "username": username,
            "_id": data._id
          });
        })
        .catch((err) => { return console.log(err) });
    }else {
      res.send('Username already taken');
    }
  })
  .catch((err) => { return console.log(err) });
});

app.get('/api/users', (req, res) => {
  console.log('addUser', req.body)
  const username = req.body.username;

  Person.find({})//, (err, data) => {}
  .then((data)=>{
    console.log('person find: \n',data);
    const map1 = data.map(x=>{return {"_id":x._id,"username":x.username,"__v":x.__v}})
    res.json(map1);
  })
  .catch((err) => { return console.log(err) });
});


app.post('/api/users/:userId/exercises', (req, res) => {
  console.log('add event', req.params, req.body)
  const id = req.params.userId;
  const event = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;

  if  (duration === '') return res.send('duration is reqiured')
  if  (event === '') return res.send('description is reqiured')

  
  Person.findOneAndUpdate({ _id: id },
                          { $push: { log: {description: event ,duration: duration , date: date} } },
                          { new: true }
  )   //, (err, data) => {}
  .then((data)=>{
    console.log('person find in update: \n',data)
    if (data === null){
      res.send('username not found')
    }else{
      console.log('updated log',data)
      res.send({
        "_id":data._id,
        "username":data.username,
        "date":data.log[data.log.length-1].date,
        "duration":data.log[data.log.length-1].duration,
        "description":data.log[data.log.length-1].description})
    }
  })
  .catch((err) => { return console.log(err) });
});



app.get('/api/users/:userId/exercises', (req, res) => {
  console.log('look up log', req.params, req.body)
  const id = req.params.userId;
  const event = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;

  if  (duration === '') return res.send('duration is reqiured')
  if  (event === '') return res.send('description is reqiured')

  
  Person.findOne({ _id: id } )   //, (err, data) => {}
  .then((data)=>{
    console.log('person find in update: \n',data)
    if (data === null){
      res.send('username not found')
    }else{
      console.log('found log',data)
      res.send({
        "_id":data._id,
        "username":data.username,
       // "date":data.log[data.log.length-1].date,
       // "duration":data.log[data.log.length-1].duration,
       // "description":data.log[data.log.length-1].description,
       "count":data.log.length,
       "log": data.log
       } )
    }
  })
  .catch((err) => { return console.log(err) });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



