const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((prev, current) => (
    prev.likes > current.likes ? prev : current
  ), blogs[0])

  const result = {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
