// const express = require('express');
import express from "express"
const router = express.Router();

// const bookController = require('../controllers/bookController');
import {createBook , getBooks, getBookById, updateBook, deleteBook} from "../controllers/bookControllers.js"

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

// module.exports = router;
export default router;