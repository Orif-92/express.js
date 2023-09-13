const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000; 

// JSON ma'lumotlarni o'qib olish uchun middleware
app.use(express.json()); 

app.use(express.static('public'));

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
const addBookMiddleware = (req, res, next) => {
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

  // Kitoblarni books.json fayliga yozish
  fs.writeFile('books.json', JSON.stringify(books), (err) => {
    if (err) {
      res.status(500).json({ message: 'Ma\'lumotlar yozilmadi' });
      return;
    }
    res.status(201).json(newBook);
  });
};

app.post('/books', addBookMiddleware);

//PUT - /books/:id:
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;

  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    res.status(404).json({ message: 'Ma\'lumot topilmadi' });
    return;
  }

  if (!title || !author) {
    res.status(400).json({ message: 'title va author kiritilishi shart' });
    return;
  }

  const existingBook = books.find((item) => item.title === title && item.id !== id);

  if (existingBook) {
    res.status(400).json({ message: 'Bu kitob allaqachon mavjud' });
    return;
  }

  // O'zgartirilgan ma'lumotlarni yozish
  books[bookIndex] = { id, title, author };

  // Faylga yozish
  fs.writeFile('books.json', JSON.stringify(books, null, 2), (err) => {
    if (err) {
      res.status(500).json({ message: 'Ma\'lumotlar yozilmadi' });
    } else {
      res.json(books[bookIndex]);
    }
  });
});

//DELETE - /books/:id:
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    res.status(404).json({ message: 'Ma\'lumot topilmadi' });
    return;
  }

  // Ma'lumotlarni o'chirish
  books.splice(bookIndex, 1);

  // Faylga yozish
  fs.writeFile('books.json', JSON.stringify(books, null, 2), (err) => {
    if (err) {
      res.status(500).json({ message: 'Ma\'lumotlar o\'chirilmadi' });
    } else {
      res.status(204).end();
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});