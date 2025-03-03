const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Added bcrypt for password hashing
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// ✅ API to add a new book
app.post('/add-book', verifyToken, async (req, res) => {
    try {
        const { title, author, category, description } = req.body;

        if (!title || !author) {
            return res.status(400).json({ error: 'Title and Author are required' });
        }

        const result = await pool.query(
            'INSERT INTO books (title, author, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, category, description]
        );

        res.status(201).json({ message: 'Book added successfully', book: result.rows[0] });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ API to get all books
app.get('/all-books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ API to register a new user
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and Password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        const token = jwt.sign({ id: result.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ API to login a user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and Password are required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: result.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ API to get user details
app.get('/api/me', verifyToken, async (req, res) => {
    try {
        res.json({ message: "User is authenticated", user: req.user });
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/upload-book', async (req, res) => {
    try {
        const { title, author, category, description } = req.body;

        if (!title || !author) {
            return res.status(400).json({ error: 'Title and Author are required' });
        }

        const result = await pool.query(
            'INSERT INTO books (title, author, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, category, description]
        );

        res.status(201).json({ message: 'Book uploaded successfully', book: result.rows[0] });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});