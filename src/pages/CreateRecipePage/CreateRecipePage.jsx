import './CreateRecipePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import cameraIcon from '../../assets/icons/camera.svg';
import profileIcon from '../../assets/icons/user-icon.svg';
import clockIcon from '../../assets/icons/clock.svg';

export default function CreateRecipePage() {
  return (
    <div className="recipepage">
      <div className="recipepage-container">
        <Sidebar />

        <main className="recipe-content-area">
          <div className="recipe-topbar">
            <button className="back-btn" aria-label="Назад">
              ←
            </button>

            <div className="right-actions">
              <button className="delete-btn">Видалити</button>
              <button className="publish-btn">Опублікувати</button>
            </div>
          </div>

          <div className="header-grid">
            <figure className="photo-wrap placeholder">
              <div className="upload-placeholder">
                <img src={cameraIcon} alt="upload" />
                <p>Завантажити фото</p>
                <small>* Використовуйте лише свої авторські фото</small>
              </div>
            </figure>

            <div className="info-wrap">
              <input type="text" className="title-input" placeholder="Назва страви..." />

              <div className="author-row">
                <img src={profileIcon} alt="user" className="avatar" />
                <div className="author-meta">
                  <div className="nickname">Nickname</div>
                  <textarea
                    placeholder="Розкажіть трохи більше про цю страву..."
                    className="desc-input"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <section className="block ingredients">
              <h2>Інгредієнти:</h2>

              <label className="portion-label">Порції</label>
              <input type="text" placeholder="Скільки порцій?" className="portion-input" />

              <ul className="ing-list">
                <li>
                  <input type="text" placeholder="Додайте інгредієнт..." className="ing-input" />
                </li>
                <li>
                  <input type="text" placeholder="Додайте інгредієнт..." className="ing-input" />
                </li>
              </ul>

              <button className="add-bttn">+ Додати інгредієнт</button>
            </section>

            <section className="block steps">
              <div className="steps-header">
                <h2>Як приготувати</h2>
                <div className="time">
                  <img src={clockIcon} alt="clock" />
                  <input type="text" placeholder="Час приготування" className="time-input" />
                </div>
              </div>

              <ol className="steps-list">
                <li className="step">
                  <span className="num">1</span>
                  <div className="step-row">
                    <input type="text" placeholder="Опишіть крок..." className="step-input" />
                    <div className="photo-upload">
                      <img src={cameraIcon} alt="upload" />
                    </div>
                  </div>
                </li>

                <li className="step">
                  <span className="num">2</span>
                  <div className="step-row">
                    <input type="text" placeholder="Опишіть крок..." className="step-input" />
                    <div className="photo-upload">
                      <img src={cameraIcon} alt="upload" />
                    </div>
                  </div>
                </li>
              </ol>

              <button className="add-bttn">+ Додати крок</button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
