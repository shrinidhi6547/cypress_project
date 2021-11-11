import { imageUrl, imageSearch } from "../fixtures/data.json"

describe("Image search",()=>{
    it("Visit Image search homepage", ()=>{
        cy.visit('/')
        cy.get('[data-pid="2"]')
            .contains("Images")
            .should("have.attr", "href", "https://www.google.co.in/imghp?hl=en&ogbl")
            .click();
        cy.get('input[name="q"]',)
            .first()
            .should("be.empty");
        cy.get('[jscontroller="unV4T"][role="button"]')
            .should("be.visible");
        cy.get('button[jsname="Tg7LZd"]')
            .should('be.visible')
    });

    it("Image search by text", ()=>{
        cy.get('input[name="q"]').type(`${imageSearch}{Enter}`)
        cy.url().should("include",`https://www.google.co.in/search?q=${imageSearch}`)
    })

    it("Image search by URL", ()=>{
        cy.go('back');
        cy.intercept({
            method: "GET",
            url: `https://www.google.co.in/complete/**`
        }).as('searchResult')
        cy.get('[role="button"][aria-label="Search by image"]')
            .should("be.visible")
            .click()
            .then(()=>{
          cy.get('[id="QDMvGf"]').within(() => {
              cy.get('input[id="Ycyxxc"]')
                .should("be.empty")
                .type(imageUrl);
            cy.get('input[type="submit"]').click();
          });
          cy.wait('@searchResult')
          cy.get('input[name="q"]').should('have.value', 'aurora northern lights')
        });
    })

})