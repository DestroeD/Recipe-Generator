import React from "react";
import RegisterModal from "../../../src/pages/RegisterModal/RegisterModal.jsx";

describe("<RegisterModal />", () => {
  it("renders registration form with all fields and controls", () => {
    cy.mount(<RegisterModal />);

    cy.contains("Реєстрація").should("exist");

    cy.get('input[placeholder="Ім’я"]').should("exist");
    cy.get('input[placeholder="Електронна пошта"]').should("exist");
    cy.get('input[placeholder="Пароль"]').should("exist");
    cy.get('input[placeholder="Підтвердження пароля"]').should("exist");

    cy.contains("Зареєструватись")
      .should("exist")
      .and("not.be.disabled");

    cy.get(".close-btn")
      .should("have.attr", "href", "/")
      .and("contain", "×");
  });

  it("shows proper validation errors when submitting invalid form", () => {
    cy.mount(<RegisterModal />);

    // спочатку помилок немає
    cy.contains("Вкажіть ім’я.").should("not.exist");
    cy.contains("Вкажіть email.").should("not.exist");
    cy.contains("Вкажіть пароль.").should("not.exist");
    cy.contains("Підтвердіть пароль.").should("not.exist");

    // 1) сабмітимо порожню форму
    cy.contains("Зареєструватись").click();

    cy.contains("Вкажіть ім’я.").should("exist");
    cy.contains("Вкажіть email.").should("exist");
    cy.contains("Вкажіть пароль.").should("exist");
    cy.contains("Підтвердіть пароль.").should("exist");

    // 2) заповнюємо некоректними даними
    cy.get('input[placeholder="Ім’я"]').clear().type("A");
    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("not-an-email");
    cy.get('input[placeholder="Пароль"]').clear().type("123");
    cy.get('input[placeholder="Підтвердження пароля"]')
      .clear()
      .type("321");

    cy.contains("Зареєструватись").click();

    cy.contains("Ім’я занадто коротке (мінімум 2 символи).").should("exist");
    cy.contains("Некоректний формат email.").should("exist");
    cy.contains("Закороткий пароль (мінімум 6 символів).").should("exist");
    cy.contains("Паролі не збігаються.").should("exist");
  });
});
