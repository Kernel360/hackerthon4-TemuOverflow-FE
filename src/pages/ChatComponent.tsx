import React, { useState, useRef, useEffect } from 'react'
import './ChatComponent.css'

interface Message {
  text: string
  isUser: boolean
  isError: boolean
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: '발생한 오류를 입력해주세요!', isUser: false, isError: false }
  ])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)

  const API_URL = 'http://13.125.174.224/api/chat'

  // 스크롤을 아래로 이동하는 함수
  const scrollToBottom = (): void => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }

  // 새 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 페이지 로드 시 입력 필드에 포커스
  useEffect(() => {
    messageInputRef.current?.focus()
  }, [])

  // Claude API에 메시지를 전송하는 함수
  const sendToClaude = async (message: string): Promise<string> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error response:', errorText)
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      return data.reply as string
    } catch (error) {
      console.error('Error sending message to API:', error)
      throw error
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const message = inputMessage.trim()
    if (!message) return

    // 사용자 메시지 추가
    setMessages(prevMessages => [
      ...prevMessages,
      { text: message, isUser: true, isError: false }
    ])

    // 입력 필드 초기화
    setInputMessage('')

    // 로딩 상태 설정
    setIsLoading(true)

    try {
      // API로 메시지 전송
      const reply = await sendToClaude(message)

      // 응답 메시지 추가
      setMessages(prevMessages => [
        ...prevMessages,
        { text: reply, isUser: false, isError: false }
      ])
    } catch (error) {
      // 에러 메시지 추가
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: 'Sorry, I had trouble processing your request. Please try again.',
          isUser: false,
          isError: true
        }
      ])
    } finally {
      // 로딩 상태 해제
      setIsLoading(false)
      // 입력 필드에 포커스
      messageInputRef.current?.focus()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Error Fixer Bot</h1>
      </div>

      <div
        className="chat-messages"
        ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? 'user' : 'bot'} ${msg.isError ? 'error' : ''}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}

        {isLoading && (
          <div
            className="typing-indicator"
            id="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <form
          id="chat-form"
          onSubmit={handleSubmit}>
          <input
            type="text"
            id="message-input"
            ref={messageInputRef}
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputMessage(e.target.value)
            }
            placeholder="오류를 이곳에 붙여넣기 해주세요."
            autoComplete="off"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            id="send-button"
            disabled={isLoading}>
            전송
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatComponent
