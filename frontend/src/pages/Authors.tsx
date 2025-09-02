import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Author, listAuthors, createAuthor, updateAuthor, deleteAuthor } from '../api';

function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<{ id?: number; name: string; bio?: string }>({ name: '' });

  const load = useMemo(() => async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAuthors();
      setAuthors(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      if (form.id) {
        await updateAuthor(form.id, { name: form.name, bio: form.bio });
      } else {
        await createAuthor({ name: form.name, bio: form.bio });
      }
      setForm({ name: '' });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onEdit = (a: Author) => setForm({ id: a.id, name: a.name, bio: a.bio });
  const onDelete = async (id: number) => {
    try {
      await deleteAuthor(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Authors</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <div>
          <label className="block text-sm font-medium">Name<span className="text-red-600">*</span></label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            className="border rounded px-2 py-1 w-full"
            value={form.bio || ''}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Short biography"
          />
        </div>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
          {form.id ? 'Update' : 'Create'} Author
        </button>
        {form.id && (
          <button
            type="button"
            className="ml-2 px-3 py-1 rounded border"
            onClick={() => setForm({ name: '' })}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}
      {loading && <div className="mt-3">Loading...</div>}
      {!loading && authors.length === 0 && <div className="mt-3">No authors yet.</div>}

      <ul className="mt-4 divide-y">
        {authors.map((a) => (
          <li key={a.id} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.name}</div>
              {a.bio && <div className="text-sm text-gray-600">{a.bio}</div>}
            </div>
            <div className="space-x-2">
              <button className="px-2 py-1 border rounded" onClick={() => onEdit(a)}>Edit</button>
              <button className="px-2 py-1 border rounded text-red-700" onClick={() => onDelete(a.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Authors;


