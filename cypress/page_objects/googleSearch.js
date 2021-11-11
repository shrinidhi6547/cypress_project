export class googleSearch {
    searchFor() {
        return cy.get('input[name="q"]').first()
    }

    searchBtn() {
        return cy.get('form').submit();
    }

    searchClear() {
        return cy.get('[name="q"]').type('{selectall}{backspace}').then(()=>{
            cy.get('[name="q"]').should('be.empty') 
        })
    }

}