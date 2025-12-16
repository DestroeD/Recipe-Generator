const TEST_EMAIL = Cypress.env("TEST_EMAIL");

describe("Recipe Generator – публічні e2e-сценарії (Firestore + роутінг)", () => {
  it("головна сторінка завантажує рецепти з бекенду (getAllRecipes)", () => {
    cy.visit("/");

    cy.contains("Завантаження рецептів…").should("be.visible");

    cy.get(".recipes-grid .card-link", { timeout: 10000 })
      .should("have.length.at.least", 1);
  });

  it("клік по картці відкриває сторінку рецепта з бекенду", () => {
    cy.visit("/");

    cy.get(".recipes-grid .card-link", { timeout: 10000 })
      .first()
      .click();

    cy.location("pathname").should("match", /\/recipe\//);

    cy.contains("Інгредієнти").should("be.visible");
  });

  it("пошук на головній фільтрує рецепти за назвою", () => {
    cy.visit("/");

    cy.get(".recipes-grid .card-link", { timeout: 10000 })
      .first()
      .invoke("attr", "aria-label")
      .then((recipeName) => {
        const name = (recipeName || "").trim();
        expect(name).to.not.equal("");

        cy.get('input[placeholder="Назва страви..."]')
          .clear()
          .type(name);

        cy.contains("Результати пошуку").should("be.visible");
        cy.get(".recipes-grid .card-link").should(
          "have.length.at.least",
          1
        );
      });
  });

  it("неавторизований користувач не може потрапити на /create (ProtectedRoute)", () => {
    cy.visit("/create");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/login");
    cy.contains("Вхід").should("be.visible");
    cy.contains("Увійти").should("be.visible");
  });

  it("неавторизований користувач при переході на /my-recipes редіректиться на /login", () => {
    cy.visit("/");

    cy.window().then((win) => {
      win.localStorage.clear();

      return new Cypress.Promise((resolve) => {
        const req = win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
        req.onsuccess = req.onerror = req.onblocked = () => resolve();
      });
    });

    cy.visit("/my-recipes");

    cy.location("pathname").should("eq", "/login");

    cy.contains("h1", "Вхід").should("be.visible");
  });

  it("показує 404 сторінку для неіснуючого маршруту", () => {
    cy.visit("/some-non-existent-page-404");

    cy.contains("Ой! Сторінку не знайдено").should("be.visible");

    cy.contains("На головну").click();
    cy.location("pathname").should("eq", "/");
  });

  it("генератор страв звертається до бекенду і оновлює стан картки", () => {
    cy.visit("/generator");

    cy.get(".featured-card").should("have.class", "is-disabled");

    cy.contains("button", "Розпочати генерацію").click();

    cy.get("body", { timeout: 10000 }).should(($body) => {
      const hasError = $body.find(".generator-error").length > 0;
      const hasClickable = $body.find(".featured-card.is-clickable").length > 0;

      expect(
        hasError || hasClickable,
        "має зʼявитись або .generator-error, або .featured-card.is-clickable"
      ).to.be.true;

      if (hasClickable) {
        const titleText = $body.find(".featured-title").text().trim();
        expect(titleText).to.not.equal("");
      }
    });
  });
});

describe("Recipe Generator – e2e з Firebase Auth (бекенд-помилки)", () => {
  it("помилковий пароль при логіні повертає повідомлення від бекенду", () => {
    if (!TEST_EMAIL) {
      throw new Error(
        "TEST_EMAIL має бути визначений у cypress.env.json для цього тесту"
      );
    }

    // 1) Заходимо в додаток і чистимо локальні дані Firebase,
    cy.visit("/");

    cy.window().then((win) => {
      win.localStorage.clear();

      return new Cypress.Promise((resolve) => {
        const req = win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
        req.onsuccess = req.onerror = req.onblocked = () => resolve();
      });
    });

    // 2) Після очищення авторизації переходимо на /login
    cy.visit("/login");

    cy.location("pathname").should("eq", "/login");

    // 3) Вводимо email та спеціально невірний пароль
    cy.get('input[placeholder="Електронна пошта"]')
      .should("be.visible")
      .type(TEST_EMAIL);

    cy.get('input[placeholder="Пароль"]')
      .should("be.visible")
      .type("wrong-password-123");

    cy.contains("button", "Увійти").click();

    // 4) Чекаємо на відповідь бекенду та повідомлення про помилку
    cy.get(".login-error", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Невірний email або пароль.");
  });

  it("реєстрація з уже існуючим email повертає помилку auth/email-already-in-use", () => {
    if (!TEST_EMAIL) {
      throw new Error(
        "TEST_EMAIL має бути визначений у cypress.env.json для цього тесту"
      );
    }

    cy.visit("/");

    cy.window().then((win) => {
      win.localStorage.clear();

      return new Cypress.Promise((resolve) => {
        const req = win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
        req.onsuccess = req.onerror = req.onblocked = () => resolve();
      });
    });

    cy.visit("/register");

    cy.get('input[placeholder="Ім’я"]').type("Тестовий");
    cy.get('input[placeholder="Електронна пошта"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Пароль"]').type("someStrongPassword1");
    cy.get('input[placeholder="Підтвердження пароля"]').type(
      "someStrongPassword1"
    );

    cy.contains("button", "Зареєструватись").click();

    cy.get(".register-error", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Користувач з таким email вже існує.");
  });
});
