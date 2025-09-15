const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('list_helper', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

  describe('totalLikes', () => {
    test('of empty list is zero', () => {
      const blogs = []
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const listWithOneBlog = [
            {
              _id: '5a422aa71b54a676234d17f8',
              title: 'Go To Statement Considered Harmful',
              author: 'Edsger W. Dijkstra',
              url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
              likes: 5,
              __v: 0
            }
          ]
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
              _id: '5a422aa71b54a676234d17f8',
              title: 'Go To Statement Considered Harmful',
              author: 'Edsger W. Dijkstra',
              url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
              likes: 5,
              __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f9',
                title: 'Go To Statement Considered Harmful 2',
                author: 'Edsger W. Dijkstra 2',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 10,
                __v: 0
              }
          ]
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 15)
    })
  })

  describe('favoriteBlog', () => {
    test('of empty list is null', () => {
      const blogs = []
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that blog', () => {
      const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
      const result = listHelper.favoriteBlog(listWithOneBlog)
      const expected = {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
      assert.deepStrictEqual(result, expected)
    })

    test('of a bigger list returns the blog with most likes', () => {
      const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 12,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fa',
          title: 'Another Blog',
          author: 'Another Author',
          url: 'https://example.com',
          likes: 8,
          __v: 0
        }
      ]
      const result = listHelper.favoriteBlog(blogs)
      const expected = {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 12,
        __v: 0
      }
      assert.deepStrictEqual(result, expected)
    })

    test('when there are multiple blogs with same max likes, returns one of them', () => {
      const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Blog A',
          author: 'Author A',
          url: 'https://example.com',
          likes: 10,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'Blog B',
          author: 'Author B',
          url: 'https://example.com',
          likes: 10,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fa',
          title: 'Blog C',
          author: 'Author C',
          url: 'https://example.com',
          likes: 5,
          __v: 0
        }
      ]
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result.likes, 10)
      assert.ok(result.title === 'Blog A' || result.title === 'Blog B')
    })
  })

  describe('mostBlogs', () => {
    test('of empty list is null', () => {
      const blogs = []
      const result = listHelper.mostBlogs(blogs)
      assert.strictEqual(result, null)
    })

    test('when list has only one blog, returns that author', () => {
      const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
      const result = listHelper.mostBlogs(listWithOneBlog)
      const expected = {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
      assert.deepStrictEqual(result, expected)
    })

    test('of a bigger list returns the author with most blogs', () => {
      const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 12,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fa',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          url: 'https://example.com',
          likes: 8,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fb',
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          url: 'https://example.com',
          likes: 10,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fc',
          title: 'Agile Software Development',
          author: 'Robert C. Martin',
          url: 'https://example.com',
          likes: 7,
          __v: 0
        }
      ]
      const result = listHelper.mostBlogs(blogs)
      const expected = {
        author: 'Robert C. Martin',
        blogs: 3
      }
      assert.deepStrictEqual(result, expected)
    })

    test('when there are multiple authors with same max blogs, returns one of them', () => {
      const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Blog A1',
          author: 'Author A',
          url: 'https://example.com',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'Blog A2',
          author: 'Author A',
          url: 'https://example.com',
          likes: 8,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fa',
          title: 'Blog B1',
          author: 'Author B',
          url: 'https://example.com',
          likes: 6,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17fb',
          title: 'Blog B2',
          author: 'Author B',
          url: 'https://example.com',
          likes: 9,
          __v: 0
        }
      ]
      const result = listHelper.mostBlogs(blogs)
      // Should return one of the authors with 2 blogs
      assert.strictEqual(result.blogs, 2)
      assert.ok(result.author === 'Author A' || result.author === 'Author B')
    })
  })
})