import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function AdminCategories() {
  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (authLoading || user?.role !== "admin") return;
    fetchCategories();
  }, [authLoading, user?.role]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") return <Navigate to="/" replace />;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAddError("");
    setAdding(true);
    try {
      const res = await api.post("/categories", {
        name: newName.trim(),
        description: newDesc.trim(),
      });
      setCategories((prev) => [...prev, res.data]);
      setNewName("");
      setNewDesc("");
    } catch (err) {
      setAddError(err.response?.data?.error || "Erreur lors de l'ajout.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
    setEditError("");
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
    setEditError("");
  };

  const handleSave = async (id) => {
    if (!editName.trim()) return;
    setEditError("");
    setSaving(true);
    try {
      const res = await api.put(`/categories/${id}`, {
        name: editName.trim(),
        description: editDesc.trim(),
      });
      setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      cancelEdit();
    } catch (err) {
      setEditError(
        err.response?.data?.error || "Erreur lors de la mise à jour.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      /* ignore */
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout
      title="Catégories"
      subtitle={`${categories.length} catégorie${categories.length !== 1 ? "s" : ""} au total`}>
      <div className="max-w-2xl space-y-6">

        <div className="dark-card rounded-2xl p-5 md:p-6">
          <h2 className="font-semibold text-sm text-zinc-300 mb-4 flex items-center gap-2">
            <FiPlus className="text-blue-400" /> Ajouter une catégorie
          </h2>
          {addError && (
            <div className="alert-error mb-4">
              {addError}
            </div>
          )}
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom de la catégorie (ex: Électricité)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="input-field flex-1 min-w-0"
              />
              <button
                type="submit"
                disabled={adding || !newName.trim()}
                className="btn-primary disabled:opacity-60 flex items-center gap-1.5 flex-shrink-0">
                <FiPlus size={14} /> {adding ? "..." : "Ajouter"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="input-field"
            />
          </form>
        </div>

        <div className="dark-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-sm text-zinc-300">
              Catégories existantes
            </h2>
            <span className="text-xs text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full">
              {categories.length}
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-4 animate-pulse flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/10 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-3xl mb-3">🏷️</p>
              <p className="text-sm">Aucune catégorie pour l'instant.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {categories.map((cat) => (
                <div key={cat._id} className="px-5 py-4">
                  {editId === cat._id ? (
                    <div className="space-y-2">
                      {editError && (
                        <p className="text-xs text-red-400">{editError}</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          autoFocus
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field flex-1 font-medium min-w-0"
                        />
                        <button
                          onClick={() => handleSave(cat._id)}
                          disabled={saving}
                          className="w-9 h-9 bg-green-500/15 hover:bg-green-500/25 text-green-400 rounded-lg flex items-center justify-center transition flex-shrink-0">
                          <FiCheck size={15} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-9 h-9 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg flex items-center justify-center transition flex-shrink-0">
                          <FiX size={15} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editDesc}
                        placeholder="Description (optionnel)"
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="input-field text-zinc-400"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-white truncate">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="text-xs text-zinc-500 mt-0.5 truncate">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/15 text-zinc-500 hover:text-blue-400 flex items-center justify-center transition">
                          <FiEdit2 size={13} />
                        </button>
                        {deleteId === cat._id ? (
                          <div className="flex items-center gap-1 bg-red-500/10 rounded-lg px-2 py-1">
                            <span className="text-xs text-red-400 font-medium hidden sm:block">
                              Confirmer ?
                            </span>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center">
                              <FiCheck size={11} />
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="w-6 h-6 bg-white/10 hover:bg-white/20 text-zinc-300 rounded flex items-center justify-center">
                              <FiX size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(cat._id)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/15 text-zinc-500 hover:text-red-400 flex items-center justify-center transition">
                            <FiTrash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
