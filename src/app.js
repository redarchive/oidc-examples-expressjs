const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

const log = console.log

// --- SETTINGS

  // 서비스 포트
  const PORT = 3000

  // 클라이언트 ID: 발급은 https://center.gbsw.hs.kr 에서 로그인 후 신규등록!
  const CLIENT_ID = 'f0c1f28d-6f92-4372-ad29-08fa835e56ac'

  // 받아올 개인정보 목록: 사용 가능한 목록 참고 -> https://github.com/redarchive/center-oidc/wiki/%ED%86%B5%ED%95%A9%EB%A1%9C%EA%B7%B8%EC%9D%B8%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%82%AC%EC%9A%A9%EB%B2%95#scope-%ED%85%8C%EC%9D%B4%EB%B8%94
  const SCOPES = 'openid real_name class_info'

  // 리다이렉트 주소: 등록시 입력한 주소 사용!
  const REDIRECT_URI = `http://localhost:${PORT}/callback`

  // 검증용 NONCE: 아무 값이나 사용
  const NONCE = `example-${Math.random()}`

  // 로그인 주소
  const LOGIN_URL =
    'https://center.gbsw.hs.kr/login' +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&scope=${SCOPES}` +
      `&nonce=${NONCE}` +
      `&response_type=id_token`

// ---


app.use((req, res, next) => {
  log(`브라우저가 "${req.path}" 로 접속했습니다`)
  next()
})


app.get('/', (req, res) => {
  log('ㄴ 로그인 버튼을 표시했습니다')
  res.send(`<a href="${LOGIN_URL}">login</a>`)
})


app.get('/callback', (req, res) => {
  log(`ㄴ 전달받은 id_token = "${req.query.id_token}"`)

  const decoded = jwt.decode(req.query.id_token)

  log(`ㄴ id_token을 JWT로 디코딩 한 결과:`, decoded)

  if (decoded.nonce === NONCE)
    log('ㄴ nonce값이 동일한 것을 확인했습니다. (안전함)')
  else
    log('ㄴ nonce값이 다릅니다. 서버가 재시작 했거나 보안 결함이 있습니다. (안전하지 않음)')
  
  res.set('Content-Type', 'text/plain')
  res.send(`LOGIN RESULT:\n${JSON.stringify(decoded, null, 2)}`)
})


app.listen(PORT, () =>
  log(`서버가 실행되었습니다 : http://localhost:${PORT}`))
