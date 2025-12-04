import React from "react";
import AuthSwitch from "../../../src/components/AuthSwitch/AuthSwitch.jsx";

const CURRENT_USER_KEY = "rg_demo_current_user";

describe("<AuthSwitch />", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem(CURRENT_USER_KEY);
    });
  });

  it("renders login link when user is NOT authenticated", () => {
    cy.mount(<AuthSwitch />);

    cy.contains("Вхід")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "/login");
  });

  it("renders profile button when user IS authenticated", () => {
    // емулюємо залогіненого користувача в localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          id: "test-user-id",
          name: "Тестовий Користувач",
          email: "test@example.com",
        })
      );
    });

    cy.mount(<AuthSwitch />);

    cy.get(".auth-profile-btn")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "/profile");

    cy.get(".auth-profile-btn img")
      .should("have.attr", "alt", "Профіль");
  });
});
