const express = require('express');
const app = express();
const PORT = 3000; 

//Ma'lumotlar katalogini yuklash:
const books = require('./books.json');

//GET - /books:
app.get('/books', (req, res) => {
  res.json(books);
});

//GET - /books/:id:
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    res.status(404).json({ message: 'Ma\'lumot topilmadi' });
  } else {
    res.json(book);
  }
});

//POST - /books:
app.use(express.json());

app.post('/books', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    res.status(400).json({ message: 'title va author kiritilishi shart' });
    return;
  }

  const existingBook = books.find((item) => item.title === title);

  if (existingBook) {
    res.status(400).json({ message: 'Bu kitob allaqachon mavjud' });
    return;
  }

  const id = books.length + 1;
  const newBook = { id, title, author };
  books.push(newBook);

  res.status(201).json(newBook);
});


app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
