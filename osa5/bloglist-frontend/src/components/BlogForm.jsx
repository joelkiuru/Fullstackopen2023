import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    addBlog(blogObject)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2 style={{ marginBottom: '10px' }}>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={({ target }) => setTitle(target.value)}
            id='blog-title-input'
          />
        </div>
        <div>
          author:
          <input
            value={newAuthor}
            onChange={({ target }) => setAuthor(target.value)}
            id='blog-author-input'
          />
        </div>
        <div>
          url:
          <input
            value={newUrl}
            onChange={({ target }) => setUrl(target.value)}
            id='blog-url-input'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm