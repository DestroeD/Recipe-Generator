import React from "react";
import Sidebar from "../../../src/components/Sidebar/Sidebar.jsx";

describe("<Sidebar />", () => {
  it("renders logo, title and collapse button", () => {
    cy.mount(<Sidebar />);

    cy.contains("RecGen").should("be.visible");
    cy.get(".sidebar-header .logo").should("exist");

    cy.get(".collapse-btn").should("be.visible");
  });

  it("contains all navigation links with correct URLs", () => {
    cy.mount(<Sidebar />);

    cy.contains("Пошук")
      .closest("a")
      .should("have.attr", "href", "/");

    cy.contains("Збережені страви")
      .closest("a")
      .should("have.attr", "href", "/saved");

    cy.contains("Випадкова страва")
      .closest("a")
      .should("have.attr", "href", "/generator");

    cy.contains("Профіль")
      .closest("a")
      .should("have.attr", "href", "/profile");
  });

  it("renders nav links with 'nav-link' class", () => {
  cy.mount(<Sidebar />);

  cy.contains("Пошук")
    .closest("a")
    .should("have.class", "nav-link");

  cy.contains("Збережені страви")
    .closest("a")
    .should("have.class", "nav-link");

  cy.contains("Випадкова страва")
    .closest("a")
    .should("have.class", "nav-link");

  cy.contains("Профіль")
    .closest("a")
    .should("have.class", "nav-link");
});
});
