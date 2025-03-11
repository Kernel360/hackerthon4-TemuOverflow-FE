import React, { useState, useRef, useEffect } from 'react'
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
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '90vh',
  margin: '0 auto',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
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
  backgroundColor: '#5c6bc0',
  color: 'white',
  padding: '20px',
  textAlign: 'center',
  '& h1': {
    fontSize: '1.5rem',
    fontWeight: 600
  }
})

const ChatMessages = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
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
      padding: '12px 16px',
      borderRadius: '18px',
      fontSize: '0.95rem',
      lineHeight: 1.4,
      backgroundColor:
        iserror === 'true'
          ? '#ffebee'
          : isuser === 'true'
            ? '#5c6bc0'
            : '#f1f0f0',
      color:
        iserror === 'true' ? '#c62828' : isuser === 'true' ? 'white' : '#333',
      borderBottomRightRadius: isuser === 'true' ? '5px' : '18px',
      borderBottomLeftRadius: isuser === 'true' ? '18px' : '5px',
      border: iserror === 'true' ? '1px solid #ef9a9a' : 'none'
    }
  })
)

const TypingIndicator = styled('div')({
  display: 'flex',
  padding: '12px 16px',
  backgroundColor: '#f1f0f0',
  borderRadius: '18px',
  borderBottomLeftRadius: '5px',
  width: 'fit-content',
  alignSelf: 'flex-start',
  '& span': {
    height: '8px',
    width: '8px',
    backgroundColor: '#888',
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
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 0.4,
      transform: 'scale(1)'
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.2)'
    },
    '100%': {
      opacity: 0.4,
      transform: 'scale(1)'
    }
  }
})

const ChatInput = styled('div')({
  padding: '16px',
  borderTop: '1px solid #eee',
  backgroundColor: 'white',
  '& form': {
    display: 'flex',
    gap: '10px'
  },
  '& input': {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '24px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#5c6bc0'
    },
    '&:disabled': {
      backgroundColor: '#f5f5f5'
    }
  },
  '& button': {
    backgroundColor: '#5c6bc0',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#4a5ab9'
    },
    '&:disabled': {
      backgroundColor: '#bdbdbd',
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
