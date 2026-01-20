// const pool = require('../db');
import  pool  from "../db/index.js";

export const createBook = async (req, res) => {
  try {
    const { title, author, published_year } = req.body;
    const result = await pool.query(
      'INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *',
      [title, author, published_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getBooks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, published_year } = req.body;
    const result = await pool.query(
      'UPDATE books SET title=$1, author=$2, published_year=$3 WHERE id=$4 RETURNING *',
      [title, author, published_year, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};