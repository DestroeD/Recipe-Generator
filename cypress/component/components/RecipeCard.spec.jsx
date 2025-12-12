import React from "react";
import RecipeCard from "../../../src/components/RecipeCard/RecipeCard.jsx";

const CURRENT_USER_KEY = "rg_demo_current_user";

const baseRecipe = {
  id: "recipe-1",
  name: "Картопля по-селянськи",
  image: "test-image.jpg",
  time: "20 хв",
  rating: 3,
  portions: 2,
};

describe("<RecipeCard />", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem(CURRENT_USER_KEY);
    });
  });

  it("renders recipe name, time, rating stars and portions text", () => {
    cy.mount(<RecipeCard recipe={baseRecipe} />);

    cy.contains(baseRecipe.name).should("be.visible");
    cy.contains(baseRecipe.time).should("be.visible");

    cy.get(".rating-row .stars img").should("have.length", 5);

    cy.get(".portions").should("have.text", "2 порції");

    // кнопка збереження в стані 'не збережено'
    cy.contains("Зберегти рецепт").should("be.visible");
  });

  it("changes rating when clicking on a star", () => {
    cy.mount(<RecipeCard recipe={baseRecipe} />);

    cy.get(".rating-row .stars img")
      .eq(0)
      .invoke("attr", "src")
      .then((firstSrc) => {
        cy.get(".rating-row .stars img")
          .eq(4)
          .invoke("attr", "src")
          .should("not.equal", firstSrc);
      });

    cy.get(".rating-row .stars img").eq(4).click();

    // тепер 1-ша і 5-та зірки мають однаковий src (усі заповнені)
    cy.get(".rating-row .stars img")
      .eq(0)
      .invoke("attr", "src")
      .then((firstSrcAfter) => {
        cy.get(".rating-row .stars img")
          .eq(4)
          .invoke("attr", "src")
          .should("equal", firstSrcAfter);
      });
  });

  it("formats portions correctly for different values", () => {
    const recipes = [
      { ...baseRecipe, id: "r1", portions: 1 },
      { ...baseRecipe, id: "r2", portions: 2 },
      { ...baseRecipe, id: "r3", portions: 5 },
    ];

    function Wrapper() {
      return (
        <div>
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      );
    }

    cy.mount(<Wrapper />);

    cy.get(".portions").eq(0).should("have.text", "1 порція");
    cy.get(".portions").eq(1).should("have.text", "2 порції");
    cy.get(".portions").eq(2).should("have.text", "5 порцій");
  });

  it("redirects to login when saving while NOT authenticated", () => {
    // localStorage порожній → isAuthed = false
    cy.mount(<RecipeCard recipe={baseRecipe} />);

    cy.contains("Зберегти рецепт").click();

    // після кліку маємо потрапити на /login
    cy.location("pathname").should("include", "/login");
  });
});
