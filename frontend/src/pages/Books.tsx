import React, { useEffect, useMemo, useState } from 'react';
import { Book, Author, listBooks, listAuthors, createBook, updateBook, deleteBook } from '../api';

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<{ id?: number; title: string; authorId?: number; description?: string; publishedYear?: number }>({ title: '' });

  const load = useMemo(() => async () => {
    setLoading(true);
    setError('');
    try {
      const [b, a] = await Promise.all([listBooks(), listAuthors()]);
      setBooks(b);
      setAuthors(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    if (!form.authorId) return setError('Author is required');
    try {
      const payload = {
        title: form.title,
        authorId: form.authorId,
        description: form.description,
        publishedYear: form.publishedYear,
      };
      if (form.id) await updateBook(form.id, payload);
      else await createBook(payload);
      setForm({ title: '' });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onEdit = (b: Book) => setForm({ id: b.id, title: b.title, authorId: b.authorId, description: b.description, publishedYear: b.publishedYear });
  const onDelete = async (id: number) => { try { await deleteBook(id); await load(); } catch (e) { setError((e as Error).message); } };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Books</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <div>
          <label className="block text-sm font-medium">Title<span className="text-red-600">*</span></label>
          <input className="border rounded px-2 py-1 w-full" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Book title" />
        </div>
        <div>
          <label className="block text-sm font-medium">Author<span className="text-red-600">*</span></label>
          <select className="border rounded px-2 py-1 w-full" value={form.authorId || ''} onChange={(e) => setForm((f) => ({ ...f, authorId: Number(e.target.value) }))}>
            <option value="" disabled>Select author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea className="border rounded px-2 py-1 w-full" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" />
        </div>
        <div>
          <label className="block text-sm font-medium">Published Year</label>
          <input type="number" className="border rounded px-2 py-1 w-full" value={form.publishedYear || ''} onChange={(e) => setForm((f) => ({ ...f, publishedYear: e.target.value ? Number(e.target.value) : undefined }))} placeholder="e.g. 1999" />
        </div>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">{form.id ? 'Update' : 'Create'} Book</button>
        {form.id && <button type="button" className="ml-2 px-3 py-1 rounded border" onClick={() => setForm({ title: '' })}>Cancel</button>}
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}
      {loading && <div className="mt-3">Loading...</div>}
      {!loading && books.length === 0 && <div className="mt-3">No books yet.</div>}

      <ul className="mt-4 divide-y">
        {books.map((b) => (
          <li key={b.id} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">Author ID: {b.authorId}{b.publishedYear ? ` · ${b.publishedYear}` : ''}</div>
              {b.description && <div className="text-sm text-gray-600">{b.description}</div>}
            </div>
            <div className="space-x-2">
              <button className="px-2 py-1 border rounded" onClick={() => onEdit(b)}>Edit</button>
              <button className="px-2 py-1 border rounded text-red-700" onClick={() => onDelete(b.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;


