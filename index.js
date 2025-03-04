const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Blog'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Get Message
app.get('/', (req, res) => {
    res.send('Hello 🤝, Welcome to Blog!');
});


// Get all posts
app.get('/posts', (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results[0]);
        }
    });
});

// Create a new post
app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;
    db.query('INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
        [title, content, author], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Post added successfully', postId: result.insertId });
            }
        });
});

// Update a post by ID
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    db.query('UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?',
        [title, content, author, id], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Post updated successfully' });
            }
        });
});

// Delete a post by ID
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Post deleted successfully' });
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
