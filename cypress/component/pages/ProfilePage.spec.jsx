import React from "react";
import ProfilePage from "../../../src/pages/ProfilePage/ProfilePage.jsx";

describe("<ProfilePage />", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it("renders default profile info when there is no user", () => {
    cy.mount(<ProfilePage />);

    cy.contains("Профіль").should("exist");
    cy.contains("Користувач").should("exist");

    cy.contains("Збережені рецепти")
      .should("have.attr", "href", "/saved");
    cy.contains("Мої рецепти")
      .should("have.attr", "href", "/my-recipes");

    cy.contains("Вийти").should("exist");
  });

  it("switches to edit mode and back when cancelling", () => {
    cy.mount(<ProfilePage />);

    cy.contains("Редагувати профіль").click();

    cy.get("input.profile-name-input")
      .should("exist")
      .and("have.value", "");

    cy.contains("Скасувати").should("exist");
    cy.contains("Зберегти").should("exist");

    cy.contains("Скасувати").click();

    cy.get("input.profile-name-input").should("not.exist");
    cy.contains("Редагувати профіль").should("exist");
    cy.contains("Користувач").should("exist");
  });
});
