import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../api";
import { authHeaders, setToken, clearToken } from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const safeFetch = async (url, options = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch(url, {
        credentials: "include",
        signal: controller.signal,
        ...options,
        headers: {
          ...authHeaders(),
          ...options.headers,
        },
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Impossible de contacter le serveur.");
      }
      return { res, data };
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error("Le serveur met trop de temps à répondre. Réessayez.");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    safeFetch(`${API_BASE}/me`)
      .then(({ res, data }) => {
        if (res.ok && data) setUser(data);
        else if (res.status === 401) clearToken();
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const buildBannedError = (data) => {
    const err = new Error(data.message || "Compte suspendu.");
    err.banned = true;
    err.banPermanent = data.banPermanent ?? !data.banUntil;
    err.banUntil = data.banUntil ?? null;
    return err;
  };

  const login = async (email, password) => {
    const { res, data } = await safeFetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      if (
        res.status === 403 &&
        (data.banned ||
          data.banPermanent ||
          data.message?.toLowerCase().includes("suspendu"))
      ) {
        throw buildBannedError(data);
      }
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
      throw new Error(
        data.error || data.message || "Email ou mot de passe incorrect.",
      );
    }

    if (data.token) setToken(data.token);
    setUser(data.user);

    if (data.banned) {
      throw buildBannedError(data);
    }

    return data.user;
  };

  const register = async (formData) => {
    const { res, data } = await safeFetch(`${API_BASE}/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok)
      throw new Error(
        data.error || data.message || "Erreur lors de l'inscription.",
      );

    return data;
  };

  const verifyEmail = async (email, code) => {
    const { res, data } = await safeFetch(`${API_BASE}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok)
      throw new Error(data.error || data.message || "Code invalide.");
    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
    return data;
  };

  const resendCode = async (email) => {
    const { res, data } = await safeFetch(`${API_BASE}/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok)
      throw new Error(
        data.error || data.message || "Erreur lors de l'envoi du code.",
      );
    return data;
  };

  const logout = async () => {
    await safeFetch(`${API_BASE}/auth/signout`).catch(() => {});
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, verifyEmail, resendCode }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth hors AuthProvider");
  return ctx;
}
