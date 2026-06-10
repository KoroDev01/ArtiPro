import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "https://artipro-production.up.railway.app";

  const safeFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: "include", ...options });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Le serveur n'a pas répondu correctement. Vérifiez que le backend est démarré.",
      );
    }
    return { res, data };
  };

  useEffect(() => {
    safeFetch(`${API}/me`)
      .then(({ res, data }) => {
        if (res.ok && data) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { res, data } = await safeFetch(`${API}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      if (res.status === 403 && data.proStatus) {
        const err = new Error(
          data.message || "Compte en attente de validation.",
        );
        err.proStatus = data.proStatus;
        err.proRejectionReason = data.proRejectionReason;
        err.email = data.email;
        err.firstName = data.firstName;
        err.lastName = data.lastName;
        err.companyName = data.companyName;
        err.siret = data.siret;
        throw err;
      }
      throw new Error(data.error || data.message || "Erreur de connexion");
    }

    setUser(data.user);

    if (data.banned) {
      const err = new Error("Compte suspendu.");
      err.banned = true;
      err.banPermanent = data.banPermanent;
      err.banUntil = data.banUntil;
      err.user = data.user;
      throw err;
    }

    return data.user;
  };

  const register = async (formData) => {
    const { res, data } = await safeFetch(`${API}/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok)
      throw new Error(
        data.error || data.message || "Erreur lors de l'inscription",
      );

    return data;
  };

  const logout = async () => {
    await safeFetch(`${API}/auth/signout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
