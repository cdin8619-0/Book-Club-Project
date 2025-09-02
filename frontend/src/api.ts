const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export type Author = {
  id: number;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Book = {
  id: number;
  title: string;
  authorId: number;
  description?: string;
  publishedYear?: number;
  createdAt?: string;
  updatedAt?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// Authors
export const listAuthors = () => request<Author[]>('/authors');
export const getAuthor = (id: number) => request<Author>(`/authors/${id}`);
export const createAuthor = (data: Pick<Author, 'name' | 'bio'>) =>
  request<Author>('/authors', { method: 'POST', body: JSON.stringify(data) });
export const updateAuthor = (id: number, data: Pick<Author, 'name' | 'bio'>) =>
  request<Author>(`/authors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAuthor = (id: number) =>
  request<void>(`/authors/${id}`, { method: 'DELETE' });

// Books
export const listBooks = () => request<Book[]>('/books');
export const getBook = (id: number) => request<Book>(`/books/${id}`);
export const createBook = (data: Pick<Book, 'title' | 'authorId' | 'description' | 'publishedYear'>) =>
  request<Book>('/books', { method: 'POST', body: JSON.stringify(data) });
export const updateBook = (
  id: number,
  data: Pick<Book, 'title' | 'authorId' | 'description' | 'publishedYear'>
) => request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBook = (id: number) => request<void>(`/books/${id}`, { method: 'DELETE' });


