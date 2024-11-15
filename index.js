const express = require('express');
const app = express();
const PORT = 5000;

// Middleware for parsing JSON requests
app.use(express.json());

// In-memory database for books
let books = [
  { id: 1, title: "1984", author: "George Orwell", publishedYear: 1949 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", publishedYear: 1960 },
];

// Front page route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Book API</h1>
    <p>This API allows you to manage a list of books. Use the following endpoints:</p>
    <ul>
      <li><strong>GET /books</strong> - Retrieve all books</li>
      <li><strong>GET /books/:id</strong> - Retrieve a book by ID</li>
      <li><strong>POST /books</strong> - Add a new book</li>
      <li><strong>PUT /books/:id</strong> - Update a book</li>
      <li><strong>DELETE /books/:id</strong> - Delete a book</li>
    </ul>
    <p>Send JSON payloads to <strong>POST</strong> and <strong>PUT</strong> requests to create or update books.</p>
  `);
});

// GET all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// GET a book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(book);
});

// POST a new book
app.post('/books', (req, res) => {
  const { title, author, publishedYear } = req.body;
  if (!title || !author || !publishedYear) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    publishedYear
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT to update a book
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const { title, author, publishedYear } = req.body;
  if (!title || !author || !publishedYear) {
    return res.status(400).json({ message: "All fields are required" });
  }
  book.title = title;
  book.author = author;
  book.publishedYear = publishedYear;
  res.status(200).json(book);
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  books.splice(bookIndex, 1);
  res.status(200).json({ message: "Book deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
