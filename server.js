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
  // console.log('addUser', req.body)
  const username = req.body.username;
  console.log('addUser', username)
  Person.find({ username: username })//, (err, data) => {}
    .then((data) => {
      // console.log('person find: \n',data)
      if (data.length === 0) {
        ralph = new Person({
          username: username,
        });
        ralph.save()//(err, data) => {
          .then((data) => {
            console.log('ralph', data._id);
            res.json({
              "username": username,
              "_id": data._id
            });
          })
          .catch((err) => { return console.log(err) });
      } else {
        res.send('Username already taken');
      }
    })
    .catch((err) => { return console.log(err) });
});

app.get('/api/users', (req, res) => {
  // console.log('getUsers', req.body)
  const username = req.body.username;
  console.log('getUsers')
  Person.find({})//, (err, data) => {}
    .then((data) => {
      // console.log('person find: \n',data);
      const map1 = data.map(x => { return { "_id": x._id, "username": x.username, "__v": x.__v } })
      res.json(map1);
    })
    .catch((err) => { return console.log(err) });
});

const displayDate = (date) => {
  console.log('DisDate', date, typeof (date))
  let nd = date

  if (typeof (date) == 'string') nd = new Date(parseInt(date))
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  let a = nd.toLocaleDateString('en-US', options)
  console.log(a)
  if (a === 'Invalid Date') return 'Invalid Date'
  let b = a.split(/,\s*|\s* /)
  console.log(b)
  return b.join(' ')
}

function isValidURL(string) {
  //var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  var res = string.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/);
  return (res !== null)
};


app.post('/api/users/:userId/exercises', (req, res) => {
  console.log('add description', req.params, req.body)
  const id = req.params.userId;
  const description = req.body.description;
  if (description === '') return res.send('description is reqiured')

  const duration = parseInt(req.body.duration);
  if (isNaN(duration) && typeof duration == 'number') return res.send('duration is reqiured to be a number')

  const newEvent = {
    description: description,
    duration: duration
  }
  // if (typeof req.body.date === 'undefined') {
  //     console.log('date was undefined')
  //     dd = new Date();
  //     console.log('date was undefined',dd)
  //     dFY = dd.getFullYear().toString();
  //     dM = (dd.getMonth().toString().length === 1) ? '0'+(dd.getMonth()+1).toString() : dd.getMonth().toString();

  //     dD = (dd.getDate().toString().length === 1) ? '0'+(dd.getDate()-1).toString() : dd.getDate().toString();

  //     req.body.date = dFY+'-'+dM+'-'+dD;

  // }

  if (req.body.date) {
    newEvent.date = new Date(req.body.date);
  }

  // if (isValidURL(req.body.date)) console.log('date sent valid:',req.body.date)
  // if (!isValidURL(req.body.date)) return console.log('date sent invalid:',req.body.date)





  Person.findOneAndUpdate({ _id: id },
    { $push: { log:newEvent } },
    { new: true }
  )   //, (err, data) => {}
    .then((data) => {
      // console.log('person find in update: \n',data)
      if (data === null) {
        res.send('username not found')
      } else {
        // console.log('updated log',data)
        res.json({
          "_id": data._id,
          "username": data.username,
          "date": displayDate(data.log[data.log.length - 1].date),
          "duration": data.log[data.log.length - 1].duration,
          "description": data.log[data.log.length - 1].description
        })
      }
    })
    .catch((err) => { return console.log(err) });
});



app.get('/api/users/:userId/exercises', (req, res) => {
  // console.log('look up log', req.params, req.body)
  const id = req.params.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  console.log('look up log', id)

  if (duration === '') return res.send('duration is reqiured')
  if (description === '') return res.send('description is reqiured')


  Person.findOne({ _id: id })   //, (err, data) => {}
    .then((data) => {
      // console.log('person find in update: \n',data)
      if (data === null) {
        res.send('username not found')
      } else {
        // console.log('found log',data)
        dispLog = data.log.map(x => {
          return {
            "description": x.description,
            "duration": x.duration,
            "date": displayDate(x.date)
          }
        });


        res.send({
          "_id": data._id,
          "username": data.username,
          // "date":data.log[data.log.length-1].date,
          // "duration":data.log[data.log.length-1].duration,
          // "description":data.log[data.log.length-1].description,
          "count": data.log.length,
          "log": dispLog
        })
      }
    })
    .catch((err) => { return console.log(err) });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



