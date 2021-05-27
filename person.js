require('dotenv').config();
var mongoose = require('mongoose');

const myMongoURI = process.env['MONGO_URI'];

mongoose.connect(
  myMongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

let PersonSchema = new mongoose.Schema({
  username: String, // String is shorthand for {type: String}
  log : [{
    description: String,
    duration : Number,
    date: String
    }]
  },{collection: 'exercisetracker'});

let Person = mongoose.model('Person', PersonSchema);
console.log(Person);



// Exports
exports.PersonModel = Person;
//exports.createAndSaveShortURL = createAndSaveShortURL;