import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'

interface Message {
  text: string
  isUser: boolean
  isError: boolean
}

// 스타일드 컴포넌트 정의
const ChatContainerStyled = styled('div')({
  width: '100%',
  maxWidth: '800px',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '90vh',
  margin: '0 auto',
  fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
  '& *': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  '@media (max-width: 768px)': {
    height: '100vh',
    borderRadius: 0
  }
})

const ChatHeader = styled('div')({
  background: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
  color: 'white',
  padding: '24px',
  textAlign: 'center',
  '& h1': {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.02em'
  }
})

const ChatMessages = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  backgroundColor: '#f8f9fa'
})

const MessageDiv = styled('div')<{ isuser: string; iserror: string }>(
  ({ isuser, iserror }) => ({
    display: 'flex',
    maxWidth: '80%',
    alignSelf: isuser === 'true' ? 'flex-end' : 'flex-start',
    '@media (max-width: 768px)': {
      maxWidth: '90%'
    },
    '& .message-content': {
      padding: '12px 18px',
      borderRadius: '20px',
      fontSize: '0.95rem',
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      backgroundColor:
        iserror === 'true'
          ? '#fff2f0'
          : isuser === 'true'
            ? '#4568dc'
            : '#ffffff',
      color:
        iserror === 'true' ? '#cf1322' : isuser === 'true' ? 'white' : '#2c3e50',
      borderBottomRightRadius: isuser === 'true' ? '6px' : '20px',
      borderBottomLeftRadius: isuser === 'true' ? '20px' : '6px',
      border: iserror === 'true' ? '1px solid #ffccc7' : 'none',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    }
  })
)

const TypingIndicator = styled('div')({
  display: 'flex',
  padding: '12px 18px',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  borderBottomLeftRadius: '6px',
  width: 'fit-content',
  alignSelf: 'flex-start',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  '& span': {
    height: '8px',
    width: '8px',
    backgroundColor: '#4568dc',
    borderRadius: '50%',
    margin: '0 2px',
    display: 'inline-block',
    opacity: 0.4
  },
  '& span:nth-of-type(1)': {
    animation: 'pulse 1s infinite'
  },
  '& span:nth-of-type(2)': {
    animation: 'pulse 1s infinite 0.2s'
  },
  '& span:nth-of-type(3)': {
    animation: 'pulse 1s infinite 0.4s'
  }
})

const ChatInput = styled('div')({
  padding: '20px',
  borderTop: '1px solid #edf2f7',
  backgroundColor: '#ffffff',
  '& form': {
    display: 'flex',
    gap: '12px'
  },
  '& input': {
    flex: 1,
    padding: '14px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '30px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: '#4568dc',
      boxShadow: '0 0 0 3px rgba(69, 104, 220, 0.1)'
    },
    '&:disabled': {
      backgroundColor: '#f8f9fa',
      borderColor: '#e2e8f0'
    }
  },
  '& button': {
    background: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '14px 28px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(69, 104, 220, 0.2)'
    },
    '&:disabled': {
      background: '#e2e8f0',
      transform: 'none',
      boxShadow: 'none',
      cursor: 'not-allowed'
    }
  }
})

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: '발생한 오류를 입력해주세요!', isUser: false, isError: false }
  ])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

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

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

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

    const startTime = new Date()
    const startTimeStr = startTime.toLocaleTimeString() + '.' + startTime.getMilliseconds().toString().padStart(3, '0')
    console.log(`사용자 메시지 전송 시간: ${startTimeStr}`)

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
      
      const endTime = new Date()
      const endTimeStr = endTime.toLocaleTimeString() + '.' + endTime.getMilliseconds().toString().padStart(3, '0')
      const responseTime = endTime.getTime() - startTime.getTime()
      
      console.log(`봇 응답 수신 시간: ${endTimeStr}`)
      console.log(`응답 소요 시간: ${responseTime}ms`)

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
    <ChatContainerStyled>
      <ChatHeader>
        <h1>Error Fixer Bot</h1>
      </ChatHeader>

      <ChatMessages ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <MessageDiv
            key={index}
            isuser={msg.isUser.toString()}
            iserror={msg.isError.toString()}>
            <div className="message-content">{msg.text}</div>
          </MessageDiv>
        ))}

        {isLoading && (
          <TypingIndicator>
            <span></span>
            <span></span>
            <span></span>
          </TypingIndicator>
        )}
      </ChatMessages>

      <ChatInput>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
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
            disabled={isLoading}>
            전송
          </button>
        </form>
      </ChatInput>
    </ChatContainerStyled>
  )
}

export default ChatComponent
