// === [1] MongoDB Model & Schema 생성
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
    password: {
        type: String,
        minlength: 5
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

    // === [2] 비밀설정 암호화하기
    const bcrypt = require('bcrypt');
    
    // --- 1. salt를 생성할 때 필요한 saltRounds 생성 (리터럴=암호화할 자릿수)
    const saltRounds = 10; 

    // --- 2-1. 해당 스키마가 save되기 전 암호화되도록 구현 __(next()를 통해 다음처리로 이동.)
    userSchema.pre('save', function( next ) {
        var user = this;    // 순수 비번을 가져오기 위해 User스키마 변수 선언
        
        // --- 2-2. 비밀번호가 변경되었을 경우에만 암호화 로직 처리되도록 구현
        if(user.isModified('password')) {

            // --- 2-3. 암호화 처리를 위해 salt 생성
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(err) return next(err)

                // --- 2-4. salt를 가지고 암호화 처리 __(user.password = 순수 비번)
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if(err) return next(err)
                    user.password = hash;   // 순수 비번을 암호화 비번으로 대치
                    next()
                })
            })
        } else {
            next()
        }

    })


    // === [3] 로그인 기능 구현
    
    // --- 1. 비밀번호 존재여부 확인하는 메소드 생성
    userSchema.methods.comparePassword = function(planePassword, cb) {
        // planePassword를 암호화하여 비교
        bcrypt.compare(planePassword, this.password, function(err, isMatch) {
            if(err) return cb(err);
            cb(null, isMatch);
        })

    }

    // --- 2. token생성하는 메소드 생성
    const jwt = require('jsonwebtoken')

    userSchema.methods.generateToken = function(cb) {
        var user = this;

        // jsonwebtoken을 이용해 토큰생성
        var token = jwt.sign(user._id.toHexString(), 'secretToken');

        user.token = token;
        user.save(function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    }

// 3. 모델에 스키마 맵핑
const User = mongoose.model('User', userSchema);

// 4. 모델 외부참조 설정
module.exports = { User }