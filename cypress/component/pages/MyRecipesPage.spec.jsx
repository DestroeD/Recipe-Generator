import React from "react";
import MyRecipesPage from "../../../src/pages/MyRecipesPage/MyRecipesPage.jsx";

describe("<MyRecipesPage />", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it("renders layout and message for NOT authenticated user", () => {
    cy.mount(<MyRecipesPage />);

    cy.contains("Мої рецепти (0)").should("exist");

    cy.get("button.back-btn")
      .should("exist")
      .and("contain", "←");

    cy.contains("+ Створити рецепт")
      .should("have.attr", "href", "/create");

    // повідомлення для неавторизованого користувача
    cy.contains("Увійдіть у акаунт, щоб переглянути свої рецепти.")
      .should("exist");
  });

  it("does not show search or grid when user is NOT authenticated", () => {
    cy.mount(<MyRecipesPage />);

    cy.get('input[placeholder="Пошук ваших рецептів..."]').should(
      "not.exist"
    );

    cy.get(".saved-grid").should("not.exist");

    cy.contains("Увійдіть у акаунт, щоб переглянути свої рецепти.")
      .should("be.visible");
  });
});
