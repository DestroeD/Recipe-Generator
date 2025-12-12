import React from "react";
import LoginModal from "../../../src/pages/LoginModal/LoginModal.jsx";

describe("<LoginModal />", () => {
  it("renders login form with all main controls", () => {
    cy.mount(<LoginModal />);

    cy.contains("Вхід").should("exist");

    cy.get('input[placeholder="Електронна пошта"]').should("exist");
    cy.get('input[placeholder="Пароль"]').should("exist");

    cy.contains("Увійти")
      .should("exist")
      .and("not.be.disabled");

    // лінк закриття модалки
    cy.get(".close-btn")
      .should("have.attr", "href", "/")
      .and("contain", "×");

    // лінк на реєстрацію
    cy.contains("Зареєструватися")
      .should("have.attr", "href")
      .and("include", "/register");
  });

  it("shows validation errors when submitting empty or invalid form", () => {
    cy.mount(<LoginModal />);

    cy.contains("Вкажіть email.").should("not.exist");
    cy.contains("Вкажіть пароль.").should("not.exist");

    // сабмітимо порожню форму
    cy.contains("Увійти").click();

    cy.contains("Вкажіть email.").should("exist");
    cy.contains("Вкажіть пароль.").should("exist");

    cy.get('input[placeholder="Електронна пошта"]').clear().type("not-an-email");
    cy.contains("Увійти").click();

    cy.contains("Некоректний формат email.").should("exist");
    cy.contains("Вкажіть пароль.").should("exist");
  });
});
