import React, { useEffect, useMemo, useState } from 'react';
import { Book, Author, listBooks, listAuthors, createBook, updateBook, deleteBook } from '../api';

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, s