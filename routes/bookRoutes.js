// const express = require('express');
import express from "express"
const router = express.Router();

// const bookController = require('../controllers/bookController');
import {createBook , getBooks, getBookById, updateBook, deleteBook} from "../controllers/bookControllers.js"
import authenticateToken from "../middlewares/auth.js";



router.get('/', authenticateToken , getBooks);
router.get('/:id',authenticateToken , getBookById);
router.post('/', authenticateToken , createBook);
router.put('/:id', authenticateToken , updateBook);
router.delete('/:id', authenticateToken , deleteBook);

// module.exports = router;
export default router;