const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT ?? 3001;

let phoneBook = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (req, res) => {
  const date = new Date();

  res.send(`
    <p>Phonebook has info for ${phoneBook.length} people</p>
    <p>${date.toString()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  res.json(phoneBook);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!(name || number)) return res.status(400).json({error: "name or number is not passed"});

  if (phoneBook.find(p => p.name === name)) return res.status(400).json({error: "this is already exists"});

  const newPerson = {
    id: Math.floor(Math.random() * 100).toString(),
    name: name,
    number: number
  }

  phoneBook.push(newPerson);

  res.status(201).end();
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = phoneBook.find(p => p.id.toString() === id.toString());

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  phoneBook = phoneBook.filter(p => p.id.toString() !== id.toString());

  res.status(200).end();
})

app.listen(PORT, () => console.log(`Server is started at http://localhost:${PORT}/`));