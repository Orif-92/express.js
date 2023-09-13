const express = require('express');
const app = express();
const PORT = 3000; 

//Ma'lumotlar katalogini yuklash:
const books = require('./books.json');

//GET - /books:
app.get('/books', (req, res) => {
  res.json(books);
});

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
