const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  console.log(titles)

  expect(titles).toContain(
    'First class tests'
  )
})

test('blogs have field named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body[0].id)

  expect(response.body[0].id).toBeDefined()
})

test('blogs can posted', async () => {
  const user = {
    username: 'root',
    password: 'sekret',
  }
  const testUser = await api
    .post('/api/login')
    .send(user)

  const newBlog = {
    title: 'Test blog',
    author: 'Erkki Pertti',
    url: 'http://www.cs.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 5,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .set('Authorization', `Bearer ${testUser.body.token}`)
    .expect('content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  console.log(titles)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(
    'Test blog'
  )
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  console.log(blogToUpdate)

  const updatedBlog = {
    title: 'Test blog',
    author: 'Erkki Pertti',
    url: 'http://www.cs.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 5
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd)

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToUpdate.title)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Pertti666',
      name: 'Pertti Erkkilä',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('new usernames have to be unique', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log(usersAtStart)
    const newUser = {
      username: 'root',
      name: 'Pertti Erkkilä',
      password: 'salainen',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('username has to be at least 3 letters long + valid error message', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log(usersAtStart)
    const newUser = {
      username: 'ro',
      name: 'Pertti Erkkilä',
      password: 'salainen',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')

  })
  test('invalid users wont be added to the database', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'ro',
      name: 'Pertti Erkkilä',
      password: 'salainen',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(
      usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})