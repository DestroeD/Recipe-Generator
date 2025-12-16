import React from "react";
import NotFoundPage from "../../../src/pages/NotFoundPage/NotFoundPage.jsx";

describe("<NotFoundPage />", () => {
  it("renders main 404 texts and actions", () => {
    cy.mount(<NotFoundPage />);

    cy.contains("404").should("be.visible");
    cy.contains("Ой! Сторінку не знайдено").should("be.visible");

    cy.contains(
      "Можливо, посилання застаріло або ви помилилися в адресі. Спробуйте повернутися або знайти потрібний рецепт нижче."
    ).should("be.visible");

    cy.contains("← Назад").should("be.visible");
    cy.contains("На головну").should("be.visible");
    cy.contains("+ Створити рецепт").should("be.visible");
  });

  it("has correct navigation links", () => {
    cy.mount(<NotFoundPage />);

    // Кнопки-навігація (Link)
    cy.contains("На головну").should("have.attr", "href", "/");
    cy.contains("+ Створити рецепт").should("have.attr", "href", "/create");

    cy.contains("збережені рецепти").should("have.attr", "href", "/saved");
    cy.contains("згенеруйте страву").should("have.attr", "href", "/generator");

    cy.get(".nf-search-btn").should("have.attr", "href", "/");
  });

  it("renders search input with placeholder", () => {
    cy.mount(<NotFoundPage />);

    cy.get("input[placeholder^='Спробуйте']").should("exist");
  });
});
