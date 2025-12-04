import React from "react";
import HomePage from "../../../src/pages/HomePage/HomePage.jsx";

describe("<HomePage />", () => {
  it("renders sidebar, recipes section and filter bar", () => {
    cy.mount(<HomePage />);

    cy.get(".homepage").should("exist");
    cy.get(".homepage-container").should("exist");

    cy.contains("RecGen").should("exist");
    cy.contains("Пошук").should("exist");

    cy.get(".recipes-section .search-bar input[placeholder='Назва страви...']")
      .should("exist");

    cy.contains("Фільтри").should("exist");
  });

  it("shows text 'Усі рецепти' when filters are not applied", () => {
    cy.mount(<HomePage />);

    cy.get(".search-info .search-label")
      .contains("Усі рецепти")
      .should("exist");
  });
});
