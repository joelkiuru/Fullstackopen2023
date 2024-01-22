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

  describe('Login', function() {
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

  describe('after user is logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test1', password: 'sana1' })
      cy.createBlog({
        user: 'pertti666',
        likes: 22,
        author: 'Keijo Keijonpää',
        title: 'Keijo Keijonpään blogi',
        url: 'keijo.keijo.keijo'
      })
    })

    it('a blog can be created', function() {
      cy.contains('Keijo Keijonpään blogi by Keijo Keijonpää')
      cy.contains('view')

    })
    it('a blog can be liked succesfully', function() {
      cy.contains('view').click()
      cy.contains('likes: 22')
      cy.contains('like').click()
      cy.contains('likes: 23')
    })

    it('user can remove their own blogs', function() {
      cy.contains('Keijo Keijonpään blogi by Keijo Keijonpää')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('Keijo Keijonpään blogi by Keijo Keijonpää').should('not.exist')
    })


    it('user can see remove button only on their own blogs', function() {
      const user = {
        name: 'Keijo Kuuppa',
        username: 'test2',
        password: 'sana2'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.createBlog({
        user: 'pertti666',
        likes: 22,
        author: 'Keijo Keijonpää',
        title: 'Keijo Keijonpään blogi',
        url: 'keijo.keijo.keijo'
      })
      cy.contains('logout').click()
      cy.login({ username: 'test2', password: 'sana2' })
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('the blog with most likes will be on top of the list', function() {
      cy.createBlog({
        user: 'pertti1',
        likes: 100,
        author: 'Keijo Keijonpää',
        title: 'The title with the second most likes after added likes',
        url: 'keijo.keijo.keijo'
      })
      cy.createBlog({
        user: 'pertti1',
        likes: 99,
        author: 'Keijo Keijonpää',
        title: 'The title with the most likes after added likes',
        url: 'pertti.pertti.pertti'
      })
      cy.get('.blog').eq(1).contains('view').click()
      cy.get('.blog').eq(1).contains('like').click()
      cy.get('.blog').eq(1).contains('like').click()
      cy.visit('http://localhost:5173')
      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
    })
  })
})