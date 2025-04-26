require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const PORT = process.env.PORT ?? 3001;

const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (req, res, next) => {
  Person.find({})
    .then(persons => {
      const date = new Date();
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date.toString()}</p>
      `);
    })
    .catch(err => next(err));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(err => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const {name, number} = req.body;

  if (!(name || number)) return res.status(400).json({error: "name or number is not passed"});

  const newPerson = new Person({
    name: name,
    number: number
  });

  newPerson.save()
    .then(person => {
      res.status(201).json(person);
    })
    .catch(err => next(err))
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  if (!(name || number)) return res.status(400).send({error: "not all properties specified"});

  Person.findById(id)
    .then(person => {
      if (!person) return res.status(404).end();

      person.name = name;
      person.number = number;

      return person.save({validateBeforeSave: true})
        .then(updatedPerson => res.status(200));
    })
    .catch(err => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const {id} = req.params;

  Person.findById(id)
    .then(person => {
      if (!person) return res.status(404).end();

      res.json(person);
    })
    .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const {id} = req.params;

  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));
})

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).send({error: "malformatted id"});
  } else if (err.name === "ValidationError") {
    return res.status(400).json({error: err.message});
  }

  next(err);
}

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server is started at http://localhost:${PORT}/`));
  })
  .catch(err => {
    console.log(err);
  })