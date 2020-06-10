// 1. DB모듈 가져오기
const mongoose = require('mongoose');

// 2. 스키마 생성
const userSchema = mongoose.Schema({

    name: {
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

});

// 3. 모델에 스키마 맵핑
const User = mongoose.model('User', userSchema);

// 4. 모델 외부참조 설정
module.exports = { User }