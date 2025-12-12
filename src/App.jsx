import { Routes, Route, Navigate } from "react-router-dom";

import LoginModal from './pages/LoginModal/LoginModal.jsx';
import RegisterModal from './pages/RegisterModal/RegisterModal.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import RecipePage from './pages/RecipePage/RecipePage.jsx';
import SavedPage from './pages/SavedPage/SavedPage.jsx';
import CreateRecipePage from './pages/CreateRecipePage/CreateRecipePage.jsx';
import GeneratorPage from './pages/GeneratorPage/GeneratorPage.jsx';
import MyRecipesPage from "./pages/MyRecipesPage/MyRecipesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Публічні */}
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:slug" element={<RecipePage />} />
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Тільки для гостей (неавторизованих) */}
      <Route element={<GuestRoute redirectTo="/" />}>
        <Route path="/login" element={<LoginModal />} />
        <Route path="/register" element={<RegisterModal />} />
      </Route>

      {/* Приватні (потрібен логін) */}
      <Route element={<ProtectedRoute redirectTo="/login" />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create" element={<CreateRecipePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/my-recipes" element={<MyRecipesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
