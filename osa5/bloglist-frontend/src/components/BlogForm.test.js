import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('blogform component tests', () => {
  test('BlogForm component calls addBlog with right values when blog is created', async () => {

    const user = userEvent.setup()
    const addBlog = jest.fn()

    const { container } = render(<BlogForm addBlog={addBlog} />)

    const createButton = screen.getByText('create')
    const titleInput = container.querySelector('#blog-title-input')
    const authorInput = container.querySelector('#blog-author-input')
    const urlInput = container.querySelector('#blog-url-input')

    await user.type(titleInput, 'Keijo Keijonpään Blogi')
    await user.type(authorInput, 'Keijo Keijonpää')
    await user.type(urlInput, 'keijo.keijo.keijo')

    await user.click(createButton)

    console.log(addBlog.mock.calls)

    expect(addBlog.mock.calls[0][0].title).toBe('Keijo Keijonpään Blogi')
    expect(addBlog.mock.calls[0][0].author).toBe('Keijo Keijonpää')
    expect(addBlog.mock.calls[0][0].url).toBe('keijo.keijo.keijo')
  })
})