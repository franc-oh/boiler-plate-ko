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

// 2-2. DB connection문 작성
mongoose.connect('mongodb+srv://devSaintLaurent:dhrudgns123$@boilerplate-qjngi.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



// 3. 회원가입 기능 (Client-Server 통신) 구현
const { User } = require("./models/User");
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended: true})); //application/x-www-form-urlencoded 분석
app.use(bodyparser.json()); //application/json 분석

// 3-1. Register Route 생성
app.post('/register', (req, res) => {
  
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

