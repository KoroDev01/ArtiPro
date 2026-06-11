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
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout
      title="Catégories"
      subtitle={`${categories.length} catégorie${categories.length !== 1 ? "s" : ""} au total`}>
      <div className="max-w-2xl space-y-6">

        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
          <h2 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2">
            <FiPlus className="text-blue-500" /> Ajouter une catégorie
          </h2>
          {addError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 mb-4">
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
                className="flex-1 p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              />
              <button
                type="submit"
                disabled={adding || !newName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 flex items-center gap-1.5 flex-shrink-0">
                <FiPlus size={14} /> {adding ? "..." : "Ajouter"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-700">
              Catégories existantes
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
              {categories.length}
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-4 animate-pulse flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-200 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-100 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-3xl mb-3">🏷️</p>
              <p className="text-sm">Aucune catégorie pour l'instant.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <div key={cat._id} className="px-5 py-4">
                  {editId === cat._id ? (
                    <div className="space-y-2">
                      {editError && (
                        <p className="text-xs text-red-500">{editError}</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          autoFocus
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium min-w-0"
                        />
                        <button
                          onClick={() => handleSave(cat._id)}
                          disabled={saving}
                          className="w-9 h-9 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition flex-shrink-0">
                          <FiCheck size={15} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition flex-shrink-0">
                          <FiX size={15} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editDesc}
                        placeholder="Description (optionnel)"
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 flex items-center justify-center transition">
                          <FiEdit2 size={13} />
                        </button>
                        {deleteId === cat._id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-lg px-2 py-1">
                            <span className="text-xs text-red-600 font-medium hidden sm:block">
                              Confirmer ?
                            </span>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center">
                              <FiCheck size={11} />
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded flex items-center justify-center">
                              <FiX size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(cat._id)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition">
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
