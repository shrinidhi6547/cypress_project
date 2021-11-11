// const { url } = Cypress.env()
import { url, title, value, newValue } from "../fixtures/data.json";
import { googleSearch } from "../page_objects/googleSearch";
const google = new googleSearch();

// E2E testcase for Google search engine
describe("Google search", () => {
    it("Goto Google homepage", () => {
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


        })
    });

    it("Performing Google search", () => {
        cy.get('input[name="q"]').should('be.empty');
        cy.intercept({
            method: "GET",
            url: `${url}/complete/search?**`
        }).as('searchWait')
        google.searchFor().type(`${value}`);
        // suggestion list length
        cy.get('.sbct').should('have.length', 11)
        // clearing input using backspace
        google.searchClear();
        google.searchFor().type(`${value}`);
        // clearing input using clear button
        cy.get('[jsname="itVqKe"]').click();
        google.searchFor().type(`${newValue}`);
        google.searchBtn()
        cy.wait('@searchWait')
        cy.url().should('include', `/search?`)
    })

    it("Goto Doodles - feeling lucky", () => {
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