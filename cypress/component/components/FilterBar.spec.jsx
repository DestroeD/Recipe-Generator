import React from "react";
import FilterBar from "../../../src/components/FilterBar/FilterBar.jsx";

describe("<FilterBar />", () => {
  it("renders main controls and triggers initial search", () => {
    const onResults = cy.spy().as("onResults");

    cy.mount(<FilterBar onResults={onResults} />);

    // Заголовки й кнопки
    cy.contains("Фільтри").should("be.visible");
    cy.contains("Скинути").should("be.visible");
    cy.contains("Показати рецепти з:").should("be.visible");
    cy.contains("Показати рецепти без:").should("be.visible");

    cy.contains("+ Створити рецепт")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "/create");

    ["<15", "15-30", "30-45", ">45"].forEach((t) => {
      cy.contains(`${t} хв`).should("exist");
    });

    cy.contains("Вегетаріанські страви").should("exist");

    cy.get("@onResults").should("have.been.called");
  });

  it("updates time and vegetarian filters and triggers search again", () => {
    const onResults = cy.spy().as("onResults");

    cy.mount(<FilterBar onResults={onResults} />);

    cy.get("@onResults").then((spy) => {
      const initialCount = spy.callCount;

      cy.contains("label", "15-30 хв")
        .find("input[type='checkbox']")
        .click()
        .should("be.checked");

      cy.contains("label", "Вегетаріанські страви")
        .find("input[type='checkbox']")
        .click()
        .should("be.checked");

      cy.wrap(null).then(() => {
        expect(spy.callCount).to.be.greaterThan(initialCount);
      });
    });
  });

  it("reset button clears filters and inputs", () => {
    const onResults = cy.spy().as("onResults");

    cy.mount(<FilterBar onResults={onResults} />);

    cy.contains("label", "30-45 хв")
      .find("input[type='checkbox']")
      .click()
      .should("be.checked");

    cy.contains("label", "Вегетаріанські страви")
      .find("input[type='checkbox']")
      .click()
      .should("be.checked");

    cy.get(".filter-group")
      .first()
      .find("input[type='text']")
      .type("картопля");

    cy.get(".filter-group")
      .eq(1)
      .find("input[type='text']")
      .type("бекон");

    cy.get(".filter-group").first().find("input[type='text']").should("have.value", "картопля");
    cy.get(".filter-group").eq(1).find("input[type='text']").should("have.value", "бекон");

    cy.contains("Скинути").click();

    // Чекбокси повинні очиститися
    cy.contains("label", "30-45 хв")
      .find("input[type='checkbox']")
      .should("not.be.checked");

    cy.contains("label", "Вегетаріанські страви")
      .find("input[type='checkbox']")
      .should("not.be.checked");

    // Інпути мають стати порожніми
    cy.get(".filter-group").first().find("input[type='text']").should("have.value", "");
    cy.get(".filter-group").eq(1).find("input[type='text']").should("have.value", "");
  });
});
