import React from "react";
import CreateRecipePage from "../../../src/pages/CreateRecipePage/CreateRecipePage.jsx";

const DRAFT_KEY = "rg_create_recipe_draft_v1";
const CURRENT_USER_KEY = "rg_demo_current_user";

describe("<CreateRecipePage />", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem(DRAFT_KEY);
      win.localStorage.removeItem(CURRENT_USER_KEY);
    });
  });

  it("renders basic layout and main controls", () => {
    cy.mount(<CreateRecipePage />);

    cy.get(".recipepage").should("exist");
    cy.get(".recipepage-container").should("exist");

    // топ-бар
    cy.contains("Видалити").should("exist");
    cy.contains("Опублікувати").should("exist");

    cy.get(".title-input")
      .should("exist")
      .and("have.attr", "placeholder", "Назва страви...");

    cy.contains("Інгредієнти:").should("exist");
    cy.contains("Як приготувати").should("exist");

    cy.get(".ing-list li").should("have.length", 2);
    cy.get(".steps-list .step").should("have.length", 2);
  });

  it('adds new ingredient row when clicking "+ Додати інгредієнт"', () => {
    cy.mount(<CreateRecipePage />);

    cy.get(".ing-list li").should("have.length", 2);
    cy.contains("+ Додати інгредієнт").click();
    cy.get(".ing-list li").should("have.length", 3);
  });

  it('adds new step row when clicking "+ Додати крок"', () => {
    cy.mount(<CreateRecipePage />);

    cy.get(".steps-list .step").should("have.length", 2);
    cy.contains("+ Додати крок").click();
    cy.get(".steps-list .step").should("have.length", 3);
  });

  it('clears form when clicking "Видалити" і підтвердженні у вікні', () => {
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
    });

    cy.mount(<CreateRecipePage />);

    // заповнюємо трохи полів
    cy.get(".title-input").type("Тестовий рецепт");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    // натискаємо "Видалити"
    cy.contains("Видалити").click();

    cy.get(".title-input").should("have.value", "");
    cy.get(".ing-list li").should("have.length", 2);
    cy.get(".ing-list li .ing-input").each(($input) => {
      cy.wrap($input).should("have.value", "");
    });
    cy.get(".steps-list .step").should("have.length", 2);
    cy.get(".steps-list .step .step-input").each(($input) => {
      cy.wrap($input).should("have.value", "");
    });
  });

  it("redirects to login when trying to publish without authenticated user", () => {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWithMatch",
      "увійти в акаунт"
    );

    cy.location("pathname").should("include", "/login");
  });


  it("shows error when title is missing for logged-in user", () => {
    cy.window().then((win) => {
      // емулюємо залогіненого користувача
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should("have.been.calledWith", "Вкажіть назву страви.");
  });

  it("shows error when no ingredients are provided", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Тестова страва без інгредієнтів");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWith",
      "Додайте хоча б один інгредієнт."
    );
  });

  it("shows error when no steps are provided", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Страва без кроків");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWith",
      "Додайте хоча б один крок приготування."
    );
  });

  it("shows error when main photo is missing", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    // валідні назва / порції / час / інгредієнти / кроки, але без фото
    cy.get(".title-input").type("Картопля по-селянськи");
    cy.get(".portion-input").type("2");
    cy.get(".time-input").type("30 хв");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати картоплю");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWith",
      "Додайте головне фото страви."
    );
  });

  it("shows error when servings are out of allowed range", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      win.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          mainPhoto: "data:image/png;base64,AAA",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Страва з некоректними порціями");
    // 0 порцій → невалідний діапазон
    cy.get(".portion-input").type("0");
    cy.get(".time-input").type("30 хв");

    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWith",
      "Вкажіть коректну кількість порцій (ціле число від 1 до 99)."
    );
  });

  it("shows error when servings field is empty", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      win.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          mainPhoto: "data:image/png;base64,AAA",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Страва без вказаних порцій");
    cy.get(".time-input").type("30 хв");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWith",
      "Вкажіть коректну кількість порцій (ціле число від 1 до 99)."
    );
  });

  it("shows error when time has invalid format", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      win.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          mainPhoto: "data:image/png;base64,AAA",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Страва з дивним часом");
    cy.get(".portion-input").type("3");
    cy.get(".time-input").type("30 хвилин");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWithMatch",
      "час приготування"
    );
  });

  it("shows error when time is empty", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "u1",
          name: "Користувач",
          email: "user@example.com",
        })
      );
      win.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          mainPhoto: "data:image/png;base64,AAA",
        })
      );
      cy.stub(win, "alert").as("alert");
    });

    cy.mount(<CreateRecipePage />);

    cy.get(".title-input").type("Страва без часу");
    cy.get(".portion-input").type("2");
    cy.get(".ing-list li").first().find(".ing-input").type("Картопля");
    cy.get(".steps-list .step").first().find(".step-input").type("Нарізати");

    cy.contains("Опублікувати").click();

    cy.get("@alert").should(
      "have.been.calledWithMatch",
      "час приготування"
    );
  });
});
