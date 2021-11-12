import 'cypress-file-upload';
import { url, title, searchValue, imageSearch } from "../fixtures/data.json";
import { googleSearch } from "../page_objects/googleSearch";
const { textSearch, imageUrl } = imageSearch;
const { string, number, newValue, specialChar} = searchValue;
const google = new googleSearch();

// E2E testcase for Google search engine
describe("Google search", () => {
    it("Goto Google homepage", ()=>{
        cy.visit('/').then(() => {
            cy.url().should('eq', `${url}/`)
            cy.title().should('eq', `${title}`)
            cy.get('[data-pid="2"]')
                .should('be.visible')
                .should('have.attr', 'href', 'https://www.google.co.in/imghp?hl=en&ogbl')
            cy.get('[data-pid="23"]')
                .should('be.visible')
                .should('have.attr', 'href', 'https://mail.google.com/mail/&ogbl')
            cy.get('#gbwa').should('be.visible').within(()=>{
                cy.get('.gb_C').should('have.attr', 'role', 'button')
            })
            cy.get('input[name="q"]').should('be.visible');
            cy.get('.XDyW0e[aria-label="Search by voice"]').should('be.visible')
        })
    });

    it("Performing Google search", () => {
        cy.get('input[name="q"]').should('be.empty');
        // Enter String
        google.searchFor().type(`${string}`);
        cy.get('[jsname="itVqKe"][aria-label="Clear"]').should('be.visible')
        // Auto suggestion list length
        cy.get('.sbct').should('have.length', 11)
        google.searchClear();
        // Enter number
        google.searchFor().type(`${number}`);
        google.searchClear();
        // Enter special character
        google.searchFor().type(`${specialChar}`);
        // clearing input using clear button
        cy.get('[jsname="itVqKe"][aria-label="Clear"]')
            .should('be.visible')
            .click();
        cy.intercept({
            method: "GET",
            url: `${url}/complete/search?q=**`
        }).as('searchWait')
        google.searchFor().type(`${newValue}`);
        google.searchBtn()
        cy.wait('@searchWait')
        cy.url().should('include', `/search?`)
    })

    it("Goto Doodles homepage", () => {
        cy.go('back');
        cy.get('.FPdoLc.lJ9FBc').within(() => {
            cy.get('[name="btnI"]').should('have.value', "I'm Feeling Lucky").first().click({force: true})
        })
        cy.url().should('eq', `${url}/doodles`);
        cy.title().should('eq', 'Google Doodles')
        cy.get('#logo')
            .should('have.attr', 'title', 'Google Doodles')
            .should("have.attr", "href", `/doodles`)
            .click({
                force: true
            })
        cy.url().should("include", `${url}/doodles`);
    })
})

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
        cy.get('input[name="q"]').type(`${textSearch}{Enter}`)
        cy.url().should("include",`https://www.google.co.in/search?q=${textSearch}`)
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

    it("search by Image",()=>{
        const image = "Aurora.jpg"
        cy.go('back');
        cy.get('[role="button"][aria-label="Search by image"]').click();
        cy.get('.iOGqzf.H4qWMc.aXIg1b')
            .contains('Upload an image')
            .click();
        cy.intercept({
            method: "GET",
            url: `https://www.google.co.in/complete/**`
        }).as('searchResult')
        cy.get('input[name="encoded_image"]').attachFile(image)
        cy.wait('@searchResult');
        cy.get('input[name="q"]').should('have.value', 'aurora northern lights')
    })
})