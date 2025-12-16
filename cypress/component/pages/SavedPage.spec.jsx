import React from "react";
import SavedPage from "../../../src/pages/SavedPage/SavedPage.jsx";

describe("<SavedPage />", () => {
  it("renders basic layout with title and controls", () => {
    cy.mount(<SavedPage />);

    cy.get(".savedpage").should("exist");
    cy.get(".savedpage-container").should("exist");
    cy.get(".saved-section").should("exist");

    cy.contains("Збережені").should("exist");
    cy.get(".top-buttons .back-btn").should("exist");
    cy.contains("+ Створити рецепт").should("exist");

    cy.get(".search-input input[placeholder='Пошук у вашій колекції...']")
      .should("exist");

    // підсумок: коли немає пошукового запиту
    cy.contains("Усі збережені (0)").should("exist");
  });

  it("shows message when there are no saved recipes", () => {
    cy.mount(<SavedPage />);

    cy.contains("Немає збережених рецептів.").should("exist");
  });

  it("updates search summary when user types query", () => {
    cy.mount(<SavedPage />);

    cy.get(".search-input input").type("паста");

    cy.contains("Результати в збережених:").should("exist");
    cy.get(".search-query").should("contain", "паста");
    cy.get(".search-count").should("contain", "(0)");
  });
});
