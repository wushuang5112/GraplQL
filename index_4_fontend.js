// 前端通过fetch请求数据，并通过字面量模板进行查询
var express = require('express')
var path = require('path')
var { graphqlHTTP } = require('express-graphql')
var { graphql, buildSchema } = require('graphql')

// 构建schema，这里定义查询的语句和类型
var schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
        salary(city: String): Int
    }
    type Query {
        getClassMates(classNo: Int!): [String]
        account(username: String): Account
    }
`)

// 定义查询所对应的resolver，也就是查询对应的处理器
var root = {
    getClassMates({ classNo }) {
        const obj = {
            31: ['张三', '李四', '王五'],
            61: ['张大三', '李大四', '王大五']
        }
        return obj[classNo]
    },
    account({ username }) {
        const name = username
        const sex = 'man'
        const age = 18
        const department = '开发部'
        const salary = ({ city }) => {
            const arr = ['北京', '上海', '广州', '上海']
            if (arr.indexOf(city) !== -1) {
                return 10000
            }
            return 3000
        }

        return {
            name,
            sex,
            age,
            department,
            salary
        }
    }
}

var app = express()

// 模板引擎设置
// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use('/graphql/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.use(express.static('public'))

app.use('/', function(req, res, next) {
    res.send('ok!')
})

app.listen(4000)
