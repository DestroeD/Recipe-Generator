import React from "react";
import App from "../../src/App.jsx";

describe("<App />", () => {
  it("mounts without crashing", () => {
    cy.mount(<App />);

  });
});
