import { Routes, Route } from "react-router-dom";
import Acceuil from "./assets/Pages/Accuill.jsx";
import Artisant from "./assets/Pages/Artisants.jsx";
import ProfileArtisants from "./assets/Pages/ProfileArtisants.jsx";
import JobRequests from "./assets/Pages/Demandes.jsx";
import JobDetails from "./assets/Pages/JobDetails.jsx";
import Login from "./assets/Pages/Login.jsx";
import SignIn from "./assets/Pages/Register.jsx";
import Messages from "./assets/Pages/Messages.jsx";
import Profile from "./assets/Pages/Profile.jsx";
import Dashboard from "./assets/Pages/Dashboard.jsx";
import NotFound from "./assets/Pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminCategories from "./assets/Pages/AdminCategories.jsx";
import AdminUsers from "./assets/Pages/AdminUsers.jsx";
import AdminCandidatures from "./assets/Pages/AdminCandidatures.jsx";
import PendingApproval from "./assets/Pages/PendingApproval.jsx";
import BannedPage from "./assets/Pages/BannedPage.jsx";
import CGU from "./assets/Pages/CGU.jsx";
import MentionsLegales from "./assets/Pages/MentionsLegales.jsx";
import Confidentialite from "./assets/Pages/Confidentialite.jsx";
import VerifyEmail from "./assets/Pages/VerifyEmail.jsx";
import ForgotPassword from "./assets/Pages/ForgotPassword.jsx";
import ResetPassword from "./assets/Pages/ResetPassword.jsx";
import Contact from "./assets/Pages/Contact.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/find-artisan" element={<Artisant />} />
        <Route path="/artisan/:id" element={<ProfileArtisants />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verification-email" element={<VerifyEmail />} />
        <Route
          path="/demandes"
          element={
            <ProtectedRoute>
              <JobRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demandes/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/candidatures"
          element={
            <AdminRoute>
              <AdminCandidatures />
            </AdminRoute>
          }
        />
        <Route path="/inscription-en-attente" element={<PendingApproval />} />
        <Route path="/compte-suspendu" element={<BannedPage />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
