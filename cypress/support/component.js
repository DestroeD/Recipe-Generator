import '@cypress/code-coverage/support';
import React from "react";
import { mount as cypressMount } from "cypress/react";
import { AppProviders } from "../../src/test-utils/TestProviders.jsx";
import "./commands";

Cypress.Commands.add("mount", (component, options = {}) => {
  const wrapped = React.createElement(AppProviders, null, component);
  return cypressMount(wrapped, options);
});

export {};