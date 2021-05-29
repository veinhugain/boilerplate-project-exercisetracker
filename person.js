require('dotenv').config();
var mongoose = require('mongoose');

const myMongoURI = process.env['MONGO_URI'];

mongoose.connect(
  myMongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set('useFindAndModify', false);

let PersonSchema = new mongoose.Schema({
  username: {type:String,
  unique: true,
  index: true}, // String is shorthand for {type: String}
  log : [{
    description: String,
    duration : Number,
    date: {
      type: Date,
      default: new Date()
    }
    }]
  },{collection: 'exercisetracker'});

let Person = mongoose.model('Person', PersonSchema);
console.log(Person);



// Exports
exports.PersonModel = Person;
//exports.createAndSaveShortURL = createAndSaveShortURL;