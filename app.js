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

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
