import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import './CreateRecipePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import cameraIcon from '../../assets/icons/camera.svg';
import profileIcon from '../../assets/icons/user-icon.svg';
import clockIcon from '../../assets/icons/clock.svg';

export default function CreateRecipePage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const authorName =
    user?.name || user?.displayName || user?.email || "Гість";

  // стейти форми
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("");
  const [time, setTime] = useState("");

  // масиви інгредієнтів та кроків
  const [ingredients, setIngredients] = useState(["", ""]);
  const [steps, setSteps] = useState(["", ""]);

  // головне фото
  const [mainPhoto, setMainPhoto] = useState(null);

  // фото для кроків
  const [stepPhotos, setStepPhotos] = useState([null, null]);

  // допоміжні хендлери
  const handleIngredientChange = (index, value) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, ""]);
  };

  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // видалення інгредієнта
  const handleRemoveIngredient = (index) => {
    setIngredients((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // видалення кроку
  const handleRemoveStep = (index) => {
    setSteps((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });

    setStepPhotos((prev) => {
    if (prev.length === 1) return prev;
    return prev.filter((_, i) => i !== index);
  });
  };

  const handleAddStep = () => {
    setSteps((prev) => [...prev, ""]);
    setStepPhotos((prev) => [...prev, null]);
  };

  // обробка завантаження головного фото
  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMainPhoto(url);
  };

  // обробка завантаження фото конкретного кроку
  const handleStepPhotoChange = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStepPhotos((prev) => {
      const copy = [...prev];
      copy[index] = url;
      return copy;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setServings("");
    setTime("");
    setIngredients(["", ""]);
    setSteps(["", ""]);
    setMainPhoto(null);
    setStepPhotos([null, null]);
  };

  const handleDelete = () => {
    if (window.confirm("Очистити форму?")) {
      resetForm();
    }
  };

  // ВАЛІДАЦІЯ КІЛЬКОСТІ ПОРЦІЙ
  const isValidServings = (value) => {
    const trimmed = value.trim();

    if (!trimmed) return false;

    if (!/^\d{1,2}$/.test(trimmed)) return false;

    const num = Number(trimmed);
    return num >= 1 && num <= 99;
  };

  // ВАЛІДАЦІЯ ЧАСУ ПРИГОТУВАННЯ
  const isValidTime = (value) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return false;

    const regex = /^\d{1,3}\s*(хв|хв\.|год|год\.)$/;
    return regex.test(trimmed);
  };

  const handlePublish = () => {
    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();
    const cleanedServings = servings.trim();
    const cleanedTime = time.trim();

    const cleanedIngredients = ingredients
      .map((i) => i.trim())
      .filter(Boolean);
    const cleanedSteps = steps.map((s) => s.trim()).filter(Boolean);

    // 1) Перевірка обовʼязкових полів
    if (!cleanedTitle) {
      alert("Вкажіть назву страви.");
      return;
    }

    if (cleanedIngredients.length === 0) {
      alert("Додайте хоча б один інгредієнт.");
      return;
    }

    if (cleanedSteps.length === 0) {
      alert("Додайте хоча б один крок приготування.");
      return;
    }

    // 2) Перевірка кількості порцій
    if (!isValidServings(cleanedServings)) {
      alert("Вкажіть коректну кількість порцій (ціле число від 1 до 99).");
      return;
    }

    // 3) Перевірка часу приготування
    if (!isValidTime(cleanedTime)) {
      alert('Вкажіть час приготування у форматі типу "30 хв" або "2 год".');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      name: cleanedTitle,
      description: cleanedDescription,
      servings: Number(cleanedServings),
      time: cleanedTime,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      mainPhoto,
      stepPhotos,
      author: authorName,
    };

    console.log("NEW RECIPE (без бекенду):", newRecipe);
    alert("Рецепт умовно опубліковано (консоль).");

    resetForm();
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <div className="recipepage">
      <div className="recipepage-container">
        <Sidebar />

        <main className="recipe-content-area">
          <div className="recipe-topbar">
            <button
                className="back-btn"
                type="button"
                onClick={handleBack}
                aria-label="Повернутися на попередню сторінку"
                title="Назад"
              >
                ←
              </button>

            <div className="right-actions">
              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
              >
                Видалити
              </button>

              <button
                type="button"
                className="publish-btn"
                onClick={handlePublish}
              >
                Опублікувати
              </button>
            </div>
          </div>

          <div className="header-grid">
            <figure className="photo-wrap placeholder">
              <label className="upload-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleMainPhotoChange}
                />
                {mainPhoto ? (
                  <img
                    src={mainPhoto}
                    alt="Головне фото страви"
                    className="main-photo-preview"
                  />
                ) : (
                  <>
                    <img src={cameraIcon} alt="upload" />
                    <p>Завантажити фото</p>
                    <small>* Використовуйте лише свої авторські фото</small>
                  </>
                )}
              </label>
            </figure>

            <div className="info-wrap">
              <input
                type="text"
                className="title-input"
                placeholder="Назва страви..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="author-row">
                <img src={profileIcon} alt="user" className="avatar" />
                <div className="author-meta">
                  <div className="nickname">{authorName}</div>
                  <textarea
                    placeholder="Розкажіть трохи більше про цю страву..."
                    className="desc-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <section className="block ingredients">
              <h2>Інгредієнти:</h2>

              <label className="portion-label">Порції</label>
              <input
                type="text"
                placeholder="Скільки порцій?"
                className="portion-input"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />

              <ul className="ing-list">
                {ingredients.map((ing, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      placeholder="Додайте інгредієнт..."
                      className="ing-input"
                      value={ing}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveIngredient(index)}
                      aria-label="Видалити інгредієнт"
                    >
                      -
                    </button>
                  </li>
                ))}
              </ul>

              <button
                className="add-bttn"
                type="button"
                onClick={handleAddIngredient}
              >
                + Додати інгредієнт
              </button>
            </section>

            <section className="block steps">
              <div className="steps-header">
                <h2>Як приготувати</h2>
                <div className="time">
                  <img src={clockIcon} alt="clock" />
                  <input
                    type="text"
                    placeholder="Час приготування"
                    className="time-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <ol className="steps-list">
                {steps.map((step, index) => (
                  <li className="step" key={index}>
                    <span className="num">{index + 1}</span>
                    <div className="step-row">
                      <input
                        type="text"
                        placeholder="Опишіть крок..."
                        className="step-input"
                        value={step}
                        onChange={(e) =>
                          handleStepChange(index, e.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveStep(index)}
                        aria-label="Видалити крок"
                      >
                        -
                      </button>

                      <label className="photo-upload">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleStepPhotoChange(index, e)}
                        />
                        {stepPhotos[index] ? (
                          <img
                            src={stepPhotos[index]}
                            alt={`Фото кроку ${index + 1}`}
                            className="step-photo-preview"
                          />
                        ) : (
                          <img
                            src={cameraIcon}
                            alt="upload"
                            className="step-photo-icon"
                          />
                        )}
                      </label>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                className="add-bttn"
                type="button"
                onClick={handleAddStep}
              >
                + Додати крок
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}