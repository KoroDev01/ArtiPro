import { Routes, Route } from "react-router-dom";
import Acceuil from "./assets/Pages/Accuill.jsx";
import Artisant from "./assets/Pages/Artisants.jsx";
import ProfileArtisants from "./assets/Pages/ProfileArtisants.jsx";
import JobRequests from "./assets/Pages/Demandes.jsx";
import Login from "./assets/Pages/Login.jsx";
import SignIn from "./assets/Pages/Register.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/find-artisan" element={<Artisant />} />
        <Route path="/artisan/:id" element={<ProfileArtisants />} />
        <Route path="/demandes" element={<JobRequests />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl font-bold">
              Page Not Found
            </h1>
          }
        />
      </Routes>
    </>
  );
}

export default App;
