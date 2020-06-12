const express = require('express')  // 1-1. express 모듈을 가져온다.
const app = express()               // 1-2. 'express' 함수를 이용해 새로운 express App을 생성
const port = 3000                   // 1-3. 서버 port

// 1-4. 해당 App의 root디렉토리 접근 시 문구 출력
app.get('/', (req, res) => res.send('Hello World!~~~ 안뇽 ㅎㅎㅎ'))

// 1-5. 해당 포트로 접근 시 콘솔에 문구 출력
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// 2. MongoDB 연동

// 2-1. DB모듈 가져오기
const mongoose = require('mongoose');

// 4. 비밀설정정보 관리
// 4-1. 설정파일 가져오기 
const config = require('./config/key');

// 2-2. DB connection문 작성
// 4-2. 직접 설정정보 명시 >> 설정파일에 지정한 정보를 참조하도록 대체 (은닉화) 
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



// 3. 회원가입 기능 (Client-Server 통신) 구현
const { User } = require("./models/User");
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended: true})); //application/x-www-form-urlencoded 분석
app.use(bodyparser.json()); //application/json 분석

// 3-1. Register Route 구현
app.post('/api/users/register', (req, res) => {
  
  // Client의 요청을 req.body(body-parser를 통해)에 담아 User 모델로 객체화. 
  const user = new User(req.body);

  // Client 요청 데이터를 DB로 insert하는 처리부 구현
  user.save((err, doc) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
        success: true
    })
  })
})


// 4. 로그인기능 구현
const cookieParser = require('cookie-parser');  // 생성된 토큰을 쿠키에 저장하기 위함

app.use(cookieParser());

// 4-1. login Route 구현
app.post('/api/users/login', (req, res) => {

  // 요청 이메일을 DB에서 존재여부 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 이메일이 존재한다면 요청 비밀번호 존재여부 및 맞는지 확인 __(체크 메서드는 해당 모델에서 구현)
    user.comparePassword( req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비번 틀림!!" })

      // 비밀번호까지 같다면 Token 생성 __(생성 메서드는 해당 모델에서 구현)
      user.generateToken( (err, user) => {
        if(err) return res.status(400).send(err);

        // 생성된 토큰을 쿠키에 저장 __(x_auth 쿠키로 토큰 저장)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })
      
    })

  })

})


// 5. Auth 기능 구현
const { auth } = require('./middleware/auth');

// 5-1. Auth Route 구현 __(auth = 인증처리기능을 구현한 미들웨어, 통과 시 콜백펑션 실행됨)
app.get('/api/users/auth', auth, (req, res) => {

  // 유저가 있을 시 실행되는 처리 부
  res.status(200).json({

    // 미들웨어에서 req에 대입을 시켰기 때문에 req.요소로 참조가능
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image

  })

})


// 6. 로그아웃 기능 구현

// 6-1. logout Route 구현
app.get('/api/users/logout', auth, (req, res) => {

  // 유저를 찾아서 업데이트
  User.findOneAndUpdate({ _id: req.user._id },
    {token: ""}
    ,(err, user) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
    })
})
