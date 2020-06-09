const express = require('express')  // 1-1. express 모듈을 가져온다.
const app = express()               // 1-2. 'express' 함수를 이용해 새로운 express App을 생성
const port = 3000                   // 1-3. 서버 port

// 1-4. 해당 App의 root디렉토리 접근 시 문구 출력
app.get('/', (req, res) => res.send('Hello World!~~~ 안뇽'))

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