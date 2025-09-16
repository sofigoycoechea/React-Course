const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const config = require('../utils/config')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user //Podemos usar el userExtractor para obtener el usuario

  if (!body.title || !body.author || !body.url || body.likes === undefined) {
    return response.status(400).json({ error: 'title or author or url or likes missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
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