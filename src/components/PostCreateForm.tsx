import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PostCreateForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('No access token found')
      return
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/article`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      }
    )

    if (!response.ok) {
      console.error('Failed to create post')
      return
    }

    const data = await response.json()
    console.log('Post created successfully:', data)
    navigate('/posts')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <label
          htmlFor="title"
          className="mb-2 font-semibold">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="content"
          className="mb-2 font-semibold">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="h-40 resize-none rounded border border-gray-300 p-2"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700">
        등록
      </button>
    </form>
  )
}

export default PostCreateForm
