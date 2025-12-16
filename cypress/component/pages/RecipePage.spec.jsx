import React from "react";
import RecipePage from "../../../src/pages/RecipePage/RecipePage.jsx";

describe("<RecipePage />", () => {
  it("renders recipe layout with sidebar container", () => {
    cy.mount(<RecipePage />);

    cy.get(".recipepage").should("exist");
    cy.get(".recipepage-container").should("exist");
    cy.get(".recipe-content-area").should("exist");
  });

  it("shows some user-facing message while trying to load recipe", () => {
    cy.mount(<RecipePage />);

    cy.contains(
      /Завантаження рецепта…|Рецепт не знайдено\.|Не вдалося завантажити рецепт\./
    ).should("exist");
  });
});
