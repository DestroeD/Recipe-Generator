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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/create" element={<CreateRecipePage />} />
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/recipe/:slug" element={<RecipePage />} />
      <Route path="/login" element={<LoginModal />} />
      <Route path="/register" element={<RegisterModal />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/my-recipes" element={<MyRecipesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
