const mongoose = require("mongoose");

const [, , password, name, number] = process.argv;

const mongoURL = process.env.MONGO_URI;

mongoose.set("strictQuery", false);

mongoose.connect(mongoURL);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("person", personSchema);

if (process.argv.length > 4) {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    return mongoose.connection.close();
  })
} else {
  Person.find({}).then(persons => {
    console.log("phonebook:");

    persons.map(({name, number}) => {
      console.log(`${name} ${number}`)
    });

    return mongoose.connection.close();
  })
}

