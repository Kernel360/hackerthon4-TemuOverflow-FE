import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  LinearProgress, 
  Paper, 
  Container, 
  Card, 
  CardContent, 
  Divider,
  Snackbar,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// 나눔고딕 폰트 스타일 추가
const NanumGothicStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
`;

// 스타일 태그 생성 및 추가
const style = document.createElement('style');
style.textContent = NanumGothicStyle;
document.head.appendChild(style);

interface ErrorResponse {
  title: string;
  description: string;
  solution: string;
  environment: string;
}

// 목업 데이터 배열 - Spring Boot 에러
const mockErrors: ErrorResponse[] = [
  {
    title: "Error: 'org.springframework.beans.factory.NoSuchBeanDefinitionException'",
    description: "Spring 컨테이너에서 요청한 빈(Bean)을 찾을 수 없을 때 발생하는 오류입니다. 주로 의존성 주입(DI)을 시도했으나 해당 빈이 등록되지 않았을 때 발생합니다.",
    solution: "해당 빈이 올바르게 @Component, @Service, @Repository, @Controller 등의 어노테이션으로 등록되었는지 확인하세요. 또한 컴포넌트 스캔 범위에 해당 클래스가 포함되어 있는지 확인하세요.",
    environment: "Spring Boot"
  },
  {
    title: "Error: 'org.springframework.web.HttpRequestMethodNotSupportedException'",
    description: "지원하지 않는 HTTP 메서드로 요청했을 때 발생하는 오류입니다. 예를 들어, POST 요청을 처리하는 엔드포인트에 GET 요청을 보냈을 때 발생합니다.",
    solution: "컨트롤러에서 @RequestMapping, @GetMapping, @PostMapping 등의 어노테이션이 올바르게 설정되었는지 확인하세요. 클라이언트에서 보내는 요청 메서드가 서버에서 지원하는 메서드와 일치하는지 확인하세요.",
    environment: "Spring Boot, REST API"
  },
  {
    title: "Error: 'org.hibernate.LazyInitializationException'",
    description: "Hibernate 세션이 닫힌 후에 지연 로딩(Lazy Loading)을 시도할 때 발생하는 오류입니다. 주로 엔티티 관계에서 FetchType.LAZY로 설정된 관계를 세션 외부에서 접근할 때 발생합니다.",
    solution: "1) @Transactional 범위를 확장하여 관련 데이터가 필요한 시점까지 세션을 유지하세요. 2) FetchType.EAGER로 변경하세요. 3) JPQL에서 fetch join을 사용하세요. 4) DTO로 필요한 데이터만 조회하세요.",
    environment: "Spring Boot, JPA, Hibernate"
  },
  {
    title: "Error: 'java.lang.IllegalArgumentException: Invalid format: \"text\"'",
    description: "데이터 바인딩 과정에서 잘못된 형식의 데이터가 전달되었을 때 발생하는 오류입니다. 주로 날짜, 숫자 등의 형식이 맞지 않을 때 발생합니다.",
    solution: "@DateTimeFormat 어노테이션을 사용하여 날짜 형식을 지정하거나, 커스텀 Converter를 등록하세요. 또는 @InitBinder를 사용하여 PropertyEditor를 등록하세요. 입력 값의 유효성 검사를 위해 @Valid와 함께 사용하세요.",
    environment: "Spring Boot, Spring MVC"
  },
  {
    title: "Error: 'org.springframework.dao.DataIntegrityViolationException'",
    description: "데이터베이스 무결성 제약 조건을 위반했을 때 발생하는 오류입니다. 주로 고유 키 제약 조건 위반, NOT NULL 제약 조건 위반, 외래 키 제약 조건 위반 등이 있습니다.",
    solution: "데이터베이스에 저장하기 전에 데이터의 유효성을 검사하세요. @Column(unique=true)와 같은 제약 조건이 있는 필드에 중복 값이 입력되지 않도록 하세요. 외래 키 관계가 있는 경우 참조 무결성을 유지하세요.",
    environment: "Spring Boot, JPA, 데이터베이스"
  },
  {
    title: "Error: 'org.springframework.security.access.AccessDeniedException'",
    description: "Spring Security에서 접근 권한이 없는 리소스에 접근하려고 할 때 발생하는 오류입니다.",
    solution: "SecurityConfig에서 해당 URL 패턴에 대한 접근 권한을 확인하세요. @PreAuthorize, @Secured 어노테이션이 올바르게 설정되었는지 확인하세요. 사용자의 역할(Role)이 올바르게 부여되었는지 확인하세요.",
    environment: "Spring Boot, Spring Security"
  },
  {
    title: "Error: 'org.springframework.web.bind.MissingServletRequestParameterException'",
    description: "필수 요청 파라미터가 누락되었을 때 발생하는 오류입니다. @RequestParam 어노테이션이 있는 파라미터가 요청에 포함되지 않았을 때 발생합니다.",
    solution: "required=false 옵션을 사용하여 선택적 파라미터로 설정하거나, defaultValue를 지정하세요. 클라이언트에서 필수 파라미터를 항상 포함하도록 수정하세요. @Valid와 함께 사용하여 유효성 검사를 수행하세요.",
    environment: "Spring Boot, Spring MVC"
  },
  {
    title: "Error: 'java.util.concurrent.TimeoutException: Timeout waiting for connection'",
    description: "데이터베이스 연결 풀에서 연결을 가져오는 데 시간 초과가 발생했을 때 나타나는 오류입니다. 주로 연결 풀이 고갈되었거나 데이터베이스 서버가 응답하지 않을 때 발생합니다.",
    solution: "application.properties 또는 application.yml에서 연결 풀 설정(maximum-pool-size, connection-timeout 등)을 조정하세요. 데이터베이스 연결이 제대로 반환되는지 확인하세요. 장기 실행 쿼리를 최적화하세요.",
    environment: "Spring Boot, 데이터베이스, HikariCP"
  },
  {
    title: "Error: 'org.springframework.web.multipart.MaxUploadSizeExceededException'",
    description: "파일 업로드 크기가 설정된 최대 크기를 초과했을 때 발생하는 오류입니다.",
    solution: "application.properties에서 spring.servlet.multipart.max-file-size와 spring.servlet.multipart.max-request-size 값을 증가시키세요. 클라이언트 측에서 파일 크기를 제한하는 유효성 검사를 추가하세요.",
    environment: "Spring Boot, 파일 업로드"
  }
];

const RandomError: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(false);

  const fetchRandomError = async () => {
    setLoading(true);
    setError(null);
    setAnimation(true);
    
    try {
      // 실제 API 엔드포인트로 교체해야 합니다
      // 현재는 목업 데이터를 사용합니다
      // const response = await axios.get<ErrorResponse>('https://api.example.com/random-error');
      
      // 로딩 효과를 위해 인위적인 지연 추가
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 목업 데이터에서 랜덤으로 하나 선택
      const randomIndex = Math.floor(Math.random() * mockErrors.length);
      const randomError = mockErrors[randomIndex];
      
      setError(randomError);
    } catch (err) {
      console.error('에러 정보를 가져오는 중 오류가 발생했습니다:', err);
      setShowError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimation(false), 300);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 요소 */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77, 111, 255, 0.03) 0%, rgba(77, 111, 255, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-5%',
          left: '-5%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.03) 0%, rgba(255, 107, 107, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      
      {/* 미묘한 도트 패턴 배경 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(77, 111, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Container 
        maxWidth="md" 
        sx={{ 
          py: { xs: 4, md: 8 },
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            position: 'relative',
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontFamily: '"Nanum Gothic", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(90deg, #4D6FFF 0%, #5E75FF 50%, #8080FF 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              letterSpacing: '-0.5px',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                bottom: '-10px',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #4D6FFF 0%, #8080FF 100%)',
              }
            }}
          >
            <BugReportIcon 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                mr: 1,
                verticalAlign: 'bottom',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' }
                },
                animation: 'bounce 2s ease-in-out infinite',
              }} 
            />
            오늘의 랜덤 에러
          </Typography>
          
          <Typography 
  variant="subtitle1" 
  sx={{ 
    mb: 4,
    maxWidth: '700px',
    mx: 'auto',
    fontSize: { xs: '0.95rem', sm: '1.1rem' },
    lineHeight: 1.6,
    color: alpha(theme.palette.text.primary, 0.8),
    px: { xs: 2, sm: 0 },
  }}
>
  매일 새로운 에러와 해결 방법을 소개합니다. 다양한 개발 환경에서 자주 발생하는 문제들을 미리 학습하고 대비하세요.
</Typography>

<Button 
  variant="contained" 
  size="large"
  onClick={fetchRandomError}
  disabled={loading}
  startIcon={<RefreshIcon 
    sx={{
      animation: loading ? 'spin 1s linear infinite' : 'none',
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    }}
  />}
  sx={{ 
    mt: 2,
    py: 1.5,
    px: 4,
    borderRadius: '50px',
    background: 'linear-gradient(90deg, #4D6FFF 0%, #8080FF 100%)',
    boxShadow: '0 4px 20px rgba(77, 111, 255, 0.25)',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontSize: { xs: '0.9rem', sm: '1rem' },
    fontWeight: 600,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transform: 'translateX(-100%)',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(77, 111, 255, 0.35)',
      '&::before': {
        transform: 'translateX(100%)',
        transition: 'transform 0.8s ease',
      }
    },
    '&:active': {
      transform: 'translateY(-1px)',
      boxShadow: '0 5px 15px rgba(77, 111, 255, 0.3)',
    }
  }}
>
  {loading ? '로딩 중...' : '랜덤 에러 가져오기'}
</Button>
</Box>

{loading && (
  <Box 
    sx={{ 
      width: '100%', 
      mb: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <LinearProgress 
      sx={{ 
        width: '100%',
        height: 6, 
        borderRadius: 3,
        mb: 2,
        background: alpha(theme.palette.primary.main, 0.08),
        '& .MuiLinearProgress-bar': {
          background: 'linear-gradient(90deg, #4D6FFF 0%, #8080FF 100%)',
          borderRadius: 3,
        }
      }} 
    />
    <Typography 
      variant="body2" 
      sx={{ 
        color: alpha(theme.palette.primary.main, 0.8),
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        },
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    >
      <Box 
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: theme.palette.primary.main,
          display: 'inline-block',
          mr: 1,
          '@keyframes blink': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 1 }
          },
          animation: 'blink 1s infinite'
        }}
      />
      에러 정보를 가져오는 중...
    </Typography>
  </Box>
)}

{error && (
  <Card 
    elevation={0}
    sx={{ 
      mb: 5,
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: alpha(theme.palette.primary.main, 0.1),
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      transform: animation ? 'translateY(8px)' : 'translateY(0)',
      opacity: animation ? 0.8 : 1,
      position: 'relative',
      '&:hover': {
        boxShadow: '0 15px 50px rgba(0,0,0,0.12)',
        transform: 'translateY(-5px)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%),
          radial-gradient(circle at bottom left, ${alpha('#FF6B6B', 0.03)} 0%, transparent 70%)
        `,
        zIndex: 0,
      }
    }}
  >
    <Box 
      sx={{ 
        height: '6px', 
        background: 'linear-gradient(90deg, #4D6FFF 0%, #8080FF 100%)',
      }} 
    />
    <CardContent 
      sx={{ 
        p: { xs: 2.5, sm: 4 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <CodeIcon 
            sx={{ 
              color: theme.palette.primary.main,
              mr: 1.5,
              fontSize: '1.2rem',
            }} 
          />
          <Typography 
            variant="overline" 
            sx={{ 
              color: theme.palette.primary.main,
              letterSpacing: 1.2,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            에러 타입
          </Typography>
          <Box 
            sx={{ 
              ml: 'auto',
              display: 'inline-flex',
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              fontSize: '0.7rem',
              fontWeight: 600,
              alignItems: 'center',
              height: '24px',
            }}
          >
            {error.environment}
          </Box>
        </Box>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            color: '#334155',
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.3,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontFamily: '"Nanum Gothic", sans-serif',
          }}
        >
          {error.title}
        </Typography>
      </Box>
      
      <Divider 
        sx={{ 
          my: 3,
          borderColor: alpha(theme.palette.divider, 0.5),
          opacity: 0.6,
        }} 
      />
      
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            color: '#334155',
          }}
        >
          <BugReportIcon 
            sx={{ 
              mr: 1.5, 
              color: '#FF6B6B',
              fontSize: '1.3rem'
            }} 
          />
          문제 설명
        </Typography>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            lineHeight: 1.8,
            color: alpha('#334155', 0.85),
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: 0.5,
          }}
        >
          {error.description}
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: '12px',
          background: 'linear-gradient(145deg, #f8faff 0%, #f0f7ff 100%)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1),
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '6px',
            height: '100%',
            background: 'linear-gradient(to bottom, #4CAF50, #8BC34A)',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
          }
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: '#2E7D32',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CheckCircleOutlineIcon 
            sx={{ 
              mr: 1.5,
              color: '#4CAF50',
              fontSize: '1.3rem',
            }} 
          />
          해결 방법
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            lineHeight: 1.8,
            color: alpha('#2E7D32', 0.85),
            fontSize: { xs: '0.9rem', sm: '1rem' },
            pl: 0.5,
            '& b': {
              fontWeight: 600,
              color: '#1B5E20',
            }
          }}
        >
          {error.solution.split('. ').map((sentence, index, array) => 
            index === array.length - 1 ? 
              sentence : 
              <React.Fragment key={index}>
                {sentence}.
                <br />
              </React.Fragment>
          )}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)}

<Snackbar 
  open={showError} 
  autoHideDuration={6000} 
  onClose={() => setShowError(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert 
    onClose={() => setShowError(false)} 
    severity="error"
    variant="filled"
    sx={{ 
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      width: '100%',
      alignItems: 'center',
    }}
  >
    에러 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.
  </Alert>
</Snackbar>
</Container>
    </Box>
  );
};

export default RandomError;

