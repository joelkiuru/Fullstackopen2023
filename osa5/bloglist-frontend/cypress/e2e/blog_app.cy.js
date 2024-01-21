describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Pertti Perjantai',
      username: 'test1',
      password: 'sana1'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })


  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:eq(0)').type('test1')
      cy.get('input:eq(1)').type('sana1')
      cy.contains('login').click()
      cy.contains('Pertti Perjantai')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:eq(0)').type('test1')
      cy.get('input:eq(1)').type('sana2')
      cy.contains('login').click()

      cy.get('.notification-div').should('contain', 'invalid username or password')
      cy.contains('Pertti Perjantai').should('not.exist')
    })
  })
})