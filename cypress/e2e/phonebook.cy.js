describe('template spec', () => {
  it('frontpage can be opened', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Phonebook')
  })
})