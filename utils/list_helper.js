const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  return blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

//¿Qué hace Object.entries?
//Convierte el objeto en un array de pares [clave, valor]
//{ "Alice": 2, "Bob": 1 } → [["Alice", 2], ["Bob", 1]]
  const topAuthor = Object.entries(authorCounts).reduce((top, [author, count]) => {
    return count > top.blogs ? { author, blogs: count } : top
  }, { author: '', blogs: 0 })
  
  return topAuthor
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }