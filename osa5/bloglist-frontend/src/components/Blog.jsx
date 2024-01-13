import { useState } from 'react'

const Blog = ({ blog, handleBlogLike, handleBlogDelete }) => {

  const [isBlogExpanded, setIsBlogExpanded] = useState(false)

  const buttonLable =  isBlogExpanded ? 'hide' : 'view'


  const toggleBlogStatus = () => {
    setIsBlogExpanded(!isBlogExpanded)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()
    blog.likes++

    const blogObject = {
      user: blog.user,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    handleBlogLike(blog.id, blogObject)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    const confirmMessage = `Remove blog ${blog.title} by ${blog.author}?`
    if (window.confirm(confirmMessage)) {
      handleBlogDelete(blog.id)
    }
  }


  return (
    <div style = {blogStyle}>
      <div>
        {blog.title} by {blog.author} <button onClick={toggleBlogStatus}>{buttonLable}</button>
      </div>
      {isBlogExpanded && (
        <div>
          <div>url: {blog.url} </div>
          <div>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>user: {blog.user ? blog.user.username : 'none'}</div>
          {blog.user && blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog