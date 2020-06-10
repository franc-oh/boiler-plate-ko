// 환경변수가 운영(heroku등의 환경)이면 prod.js, 아니면 dev.js 설정참조
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}