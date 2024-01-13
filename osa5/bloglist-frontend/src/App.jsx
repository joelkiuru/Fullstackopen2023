import { useState, useEffect, useRef } from 'react'
import '/App.css'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs( blogs )
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      const notificationMessage = exception.response.data.error
      setNotificationMessage(notificationMessage)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`a new blog '${blogObject.title}' by ${blogObject.author} was added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      const notificationMessage = exception.response.data.error
      setNotificationMessage(notificationMessage)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()
  }

  const handleLike = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)

    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    )
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(updatedBlogs)
      setNotificationMessage(`Blog with id '${id}' deleted successfully.`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      const errorMessage = exception.response.data.error
      setNotificationMessage(errorMessage)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <div className="notification-div">
          <Notification message={notificationMessage} />
        </div>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div className="notification-div">
        <Notification message={notificationMessage} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        {user.name} logged in <button onClick={handleLogOut}>logout</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Togglable>
      </div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleBlogLike={handleLike}
          handleBlogDelete={deleteBlog}
        />
      )}

    </div>
  )
}

export default App