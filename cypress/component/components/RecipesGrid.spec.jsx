import React from "react";
import RecipesGrid from "../../../src/components/RecipesGrid/RecipesGrid.jsx";

const mockRecipes = [
  {
    id: "r1",
    slug: "potato-bake",
    name: "Картопля запечена",
    image: "potato.jpg",
    time: "30 хв",
    rating: 4,
    portions: 2,
  },
  {
    id: "r2",
    slug: "pasta-carbonara",
    name: "Паста карбонара",
    image: "pasta.jpg",
    time: "20 хв",
    rating: 5,
    portions: 1,
  },
  {
    id: "r3",
    slug: "veggie-soup",
    name: "Овочевий суп",
    image: "soup.jpg",
    time: "25 хв",
    rating: 3,
    portions: 3,
  },
];

describe("<RecipesGrid />", () => {
  it("renders all recipes and shows total count when search is empty", () => {
    cy.mount(<RecipesGrid externalRecipes={mockRecipes} />);

    cy.get(".search-bar input[placeholder='Назва страви...']").should("exist");

    cy.contains(`Усі рецепти (${mockRecipes.length})`).should("be.visible");

    cy.get(".recipes-grid .card-link").should(
      "have.length",
      mockRecipes.length
    );

    mockRecipes.forEach((r) => {
      cy.contains(r.name).should("be.visible");
    });
  });

  it("filters recipes by search query and shows search info", () => {
    cy.mount(<RecipesGrid externalRecipes={mockRecipes} />);

    // шукаємо по слову "паста"
    cy.get(".search-bar input").type("паста");

    cy.contains("Результати пошуку:").should("be.visible");
    cy.contains('"паста"').should("be.visible");

    cy.get(".recipes-grid .card-link").should("have.length", 1);
    cy.contains("Паста карбонара").should("be.visible");
  });

  it("shows 0 results when nothing matches", () => {
    cy.mount(<RecipesGrid externalRecipes={mockRecipes} />);

    cy.get(".search-bar input").type("несуществующая страва");

    // лічильник має показувати 0
    cy.contains("(0)").should("be.visible");

    cy.get(".recipes-grid .card-link").should("have.length", 0);
  });

  it("shows loading text when fetching recipes without external list", () => {
    cy.mount(<RecipesGrid />);
    cy.contains("Завантаження рецептів…").should("exist");
  });
});
