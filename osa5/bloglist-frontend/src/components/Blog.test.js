import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog component tests', () => {
  test('blog in default state shows only title and author', () => {
    const blog = {
      user: 'pertti666',
      likes: 22,
      author: 'Keijo Keijonpää',
      title: 'Keijo Keijonpään blogi',
      url: 'keijo.keijo.keijo'
    }

    const { container } = render(<Blog blog={blog} user={blog.user}/>)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'Keijo Keijonpään blogi'
    )
    const element = screen.queryByText('keijo.keijo.keijo')
    expect(element).toBeNull()
    screen.debug()
  })

  test('when a blog is expanded by clicking, more blog info is displayed', async () => {
    const blog = {
      user: 'pertti666',
      likes: 22,
      author: 'Keijo Keijonpää',
      title: 'Keijo Keijonpään blogi',
      url: 'keijo.keijo.keijo'
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} toggleBlogStatus={mockHandler} user={blog.user}/>)


    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByTestId('blog-expanded')

    expect(element).toBeDefined()
  })

  test('clicking the button twice calls event handler twice', async () => {
    const blog = {
      user: 'pertti666',
      likes: 22,
      author: 'Keijo Keijonpää',
      title: 'Keijo Keijonpään blogi',
      url: 'keijo.keijo.keijo'
    }

    const user = userEvent.setup()
    const handleBlogLike = jest.fn()

    render(<Blog blog={blog} handleBlogLike={handleBlogLike} user={blog.user}/>)


    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleBlogLike).toHaveBeenCalledTimes(2)
  })
})