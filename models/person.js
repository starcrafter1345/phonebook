const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d{7,8}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model("person", personSchema);

module.exports = Person;