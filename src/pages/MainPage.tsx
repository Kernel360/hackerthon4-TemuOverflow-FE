import React from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
  useMediaQuery,
  styled,
  useTheme
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// 커스텀 스타일 컴포넌트
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f2f6fb', // indigo-50
  padding: theme.spacing(10, 0, 8),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0, 12)
  }
}))

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)'
  }
}))

function MainPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 히어로 섹션 */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center">
            <Grid
              item
              xs={12}
              md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: '#252941' // indigo-950
                }}>
                당신의 <br></br>오류를 해결하세요
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{
                  color: '#3f4770', // indigo-900
                  mb: 4
                }}>
                에러 공유 게시판과 에러 해결 챗봇을 통해 <br></br>오류를 빠르게
                해결하세요.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#5c6bc0', // indigo-600
                    '&:hover': { backgroundColor: '#5661ac' /* indigo-700 */ },
                    px: 4,
                    py: 1.5
                  }}>
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#5c6bc0', // indigo-600
                    color: '#5c6bc0',
                    '&:hover': { borderColor: '#5661ac' /* indigo-700 */ },
                    px: 4,
                    py: 1.5
                  }}>
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}>
              <Box
                sx={{
                  backgroundColor: '#f9e8db', // tumbleweed-100
                  borderRadius: 4,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #f3cdb5' // tumbleweed-200
                }}>
                <Typography
                  variant="h5"
                  sx={{ color: '#cc492a' /* tumbleweed-600 */ }}>
                  <img
                    src="../../indexMain.png"
                    alt="Hero Image"
                    style={{
                      width: '500px', // 원하는 가로 크기
                      height: '350px', // 원하는 세로 크기
                      borderRadius: '20px', // 모서리 둥글게 (값을 조절 가능)
                      objectFit: 'cover', // 비율 유지하며 꽉 채우기 (필요시)
                      display: 'block', // 정렬 이슈 방지
                      margin: '0 auto' // 중앙 정렬 (필요한 경우)
                    }}
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* 특징 섹션 */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#252941', // indigo-950
              mb: 6
            }}>
            Key Features
          </Typography>

          <Grid
            container
            spacing={4}>
            {/* 첫 번째 카드: 에러 해결 게시판 */}
            <Grid
              item
              xs={12}
              md={4}>
              <FeatureCard>
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: '#e6eff9', // indigo-100
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      backgroundColor: '#8093d4', // indigo-500
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden' // 이미지가 넘치지 않도록 설정
                    }}>
                    <img
                      src="../../errorArticle.png" // 실제 이미지 경로로 변경하세요
                      alt="게시판 아이콘"
                      style={{
                        width: '100%', // 부모(Box) 크기에 맞춰 꽉 채우기
                        height: '100%',
                        objectFit: 'cover' // 비율을 유지하면서 꽉 차게
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#48528b' /* indigo-800 */
                    }}>
                    에러 해결 게시판
                  </Typography>
                  <Typography color="text.secondary">
                    개발자들이 겪는 다양한 에러와 해결책을 공유하는 공간입니다.
                    비슷한 문제를 겪는 사람들과 함께 해결책을 찾아보세요.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: '#e18056', // tumbleweed-400
                      '&:hover': { color: '#da6035' /* tumbleweed-500 */ }
                    }}>
                    게시판 가기
                  </Button>
                </Box>
              </FeatureCard>
            </Grid>

            {/* 두 번째 카드: AI 에러 도우미 */}
            <Grid
              item
              xs={12}
              md={4}>
              <FeatureCard>
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: '#fdf5ef', // tumbleweed-50
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      backgroundColor: '#8093d4', // indigo-500
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden' // 이미지가 넘치지 않도록 설정
                    }}>
                    <img
                      src="../../errorApi.png" // 실제 이미지 경로로 변경하세요
                      alt="게시판 아이콘"
                      style={{
                        width: '100%', // 부모(Box) 크기에 맞춰 꽉 채우기
                        height: '100%',
                        objectFit: 'cover' // 비율을 유지하면서 꽉 차게
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#48528b' /* indigo-800 */
                    }}>
                    AI 에러 도우미
                  </Typography>
                  <Typography color="text.secondary">
                    인공지능 기술을 활용해 실시간으로 에러를 분석하고 해결책을
                    제시합니다. 복잡한 문제도 AI와 함께라면 빠르게 해결할 수
                    있습니다.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: '#e18056', // tumbleweed-400
                      '&:hover': { color: '#da6035' /* tumbleweed-500 */ }
                    }}>
                    AI 챗봇 시작하기
                  </Button>
                </Box>
              </FeatureCard>
            </Grid>

            {/* 세 번째 카드: 오늘의 에러 */}
            <Grid
              item
              xs={12}
              md={4}>
              <FeatureCard>
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: '#d2e0f3', // indigo-200
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      backgroundColor: '#8093d4', // indigo-500
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden' // 이미지가 넘치지 않도록 설정
                    }}>
                    <img
                      src="../../todayError.png" // 실제 이미지 경로로 변경하세요
                      alt="게시판 아이콘"
                      style={{
                        width: '100%', // 부모(Box) 크기에 맞춰 꽉 채우기
                        height: '100%',
                        objectFit: 'cover' // 비율을 유지하면서 꽉 차게
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#48528b' /* indigo-800 */
                    }}>
                    오늘의 에러
                  </Typography>
                  <Typography color="text.secondary">
                    매일 새로운 에러와 해결 방법을 소개합니다. 다양한 개발
                    환경에서 자주 발생하는 문제들을 미리 학습하고 대비하세요.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: '#e18056', // tumbleweed-400
                      '&:hover': { color: '#da6035' /* tumbleweed-500 */ }
                    }}>
                    더 알아보기
                  </Button>
                </Box>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box
        sx={{
          py: 10,
          backgroundColor: '#fdf5ef', // tumbleweed-50
          borderTop: '1px solid #f9e8db', // tumbleweed-100
          borderBottom: '1px solid #f9e8db' // tumbleweed-100
        }}>
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: '#252941', // indigo-950
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              textAlign: 'center'
            }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'white'
              }}>
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h6"
              paragraph
              sx={{
                color: '#b7cbea', // indigo-300
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}>
              Join thousands of satisfied customers who have transformed their
              digital experience.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#da6035', // tumbleweed-500
                '&:hover': { backgroundColor: '#cc492a' /* tumbleweed-600 */ },
                px: 5,
                py: 1.5,
                fontSize: '1.1rem'
              }}>
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 푸터 */}
      <Box
        component="footer"
        sx={{
          py: 6,
          backgroundColor: '#f2f6fb', // indigo-50
          borderTop: '1px solid #e6eff9' // indigo-100
        }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}>
            <Grid
              item
              xs={12}
              md={4}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#48528b' /* indigo-800 */ }}>
                Brand Logo
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: '#3f4770' /* indigo-900 */ }}>
                Creating innovative solutions since 2023.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}>
              <Grid
                container
                spacing={2}>
                {['Products', 'Features', 'Resources', 'Company', 'Legal'].map(
                  section => (
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={2}
                      key={section}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          color: '#48528b' /* indigo-800 */
                        }}>
                        {section}
                      </Typography>
                      <Box
                        component="ul"
                        sx={{ p: 0, mt: 1, listStyle: 'none' }}>
                        {[1, 2, 3].map(item => (
                          <Box
                            component="li"
                            key={item}
                            sx={{ mt: 0.5 }}>
                            <Typography
                              component="a"
                              href="#"
                              variant="body2"
                              sx={{
                                color: '#5661ac', // indigo-700
                                textDecoration: 'none',
                                '&:hover': {
                                  color: '#da6035' /* tumbleweed-500 */
                                }
                              }}>
                              Link {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            sx={{
              mt: 6,
              color: '#3f4770' /* indigo-900 */,
              textAlign: 'center'
            }}>
            © 2023 Your Company. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default MainPage
