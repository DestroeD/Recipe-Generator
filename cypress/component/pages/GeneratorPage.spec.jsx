import React from "react";
import GeneratorPage from "../../../src/pages/GeneratorPage/GeneratorPage.jsx";

describe("<GeneratorPage />", () => {
  it("renders basic layout, featured card and CTA button", () => {
    cy.mount(<GeneratorPage />);

    cy.contains("Генератор страв").should("exist");

    // топ-кнопки
    cy.contains("+ Створити рецепт").should("exist");
    cy.contains("Вхід").should("exist");

    // картка з плейсхолдером
    cy.get(".featured-card").should("exist");
    cy.get(".featured-title")
      .contains("Натисніть “Розпочати генерацію”")
      .should("exist");

    cy.get(".featured-desc")
      .should("contain", "випадковий рецепт")
      .and("exist");

    // кнопка запуску генерації
    cy.contains("Розпочати генерацію")
      .should("exist")
      .and("not.be.disabled");
  });

  it("has disabled save button and non-clickable card before recipe is generated", () => {
    cy.mount(<GeneratorPage />);

    cy.get(".featured-card")
      .should("have.class", "is-disabled")
      .and("have.attr", "tabindex", "-1");

    cy.get(".save-outline").should("be.disabled");
  });
});
