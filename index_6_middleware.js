// 使用中间件，通过cookies的auth字段控制访问权限
var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { graphql, buildSchema } = require('graphql')

// 构建schema，这里定义查询的语句和类型
var schema = buildSchema(`
    input AcccountInput {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Mutation {
        createAccount(input: AcccountInput): Account
        updateAccount(id: ID!, input: AcccountInput): Account
    }
    type Query {
        accounts: [Account]
    }
`)

const fakeDb = {}

// 定义查询所对应的resolver，也就是查询对应的处理器
var root = {
    accounts() {
        var arr = []
        for(const key in fakeDb) {
            arr.push(fakeDb[key])
        }
        return arr
    },
    createAccount({ input }) {
        // 相当于数据库的保存
        fakeDb[input.name] = input
        // 返回保存结果
        return fakeDb[input.name]
    },
    
    updateAccount({ id, input }) {
        // 相当于数据库的更新
        const updatedAccount = Object.assign({}, fakeDb[id], input)
        fakeDb[id] = updatedAccount
        // 返回更新结果
        return updatedAccount
    }
}

var app = express()

var middleware = (req, res, next) => {
    console.log('====: ', req.headers.cookie)
    if (req.url.indexOf('/graphq') !== -1 && (!req.headers.cookie || req.headers.cookie.indexOf('auth') === -1)) {
        res.send(JSON.stringify({
            error: "您没有权限访问接口"
        }))
        return
    }
    next()
}

// 注册中间件
app.use(middleware)

app.use('/graphql/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.use('/', function(req, res, next) {
    res.send('ok!')
})

app.listen(4000)
