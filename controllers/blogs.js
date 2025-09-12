const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const config = require('../utils/config')
const logger = require('../utils/logger')


blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/info', (request, response) => {
  Blog.countDocuments({}).then(count => {
    const date = new Date()
    response.send(`
      <p>Blog has info for ${count} blogs</p>
      <p>${date}</p>
    `)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id

  Blog.findById(id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.title || !body.author || !body.url || !body.likes) {
    return response.status(400).json({ error: 'title or author or url or likes missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save()
    .then(savedBlog => response.json(savedBlog))
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedBlog => {
      if (updatedBlog) response.json(updatedBlog)
      else response.status(404).end()
    })
    .catch(error => next(error))
})

module.exports = blogsRouter