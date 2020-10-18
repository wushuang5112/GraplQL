// 简单示例
var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { graphql, buildSchema } = require('graphql')

// 构建schema，这里定义查询的语句和类型
var schema = buildSchema(`
    type Query {
        hello: String,
        accountName: String,
        age: Int,
    }
`)

// 定义查询所对应的resolver，也就是查询对应的处理器
var root = {
    hello: () => {
        return 'Hello World'
    },
    accountName: () => {
        return '张三丰'
    },
    age: () => {
        return 18
    }
}

var app = express()
app.use('/graphql/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.use('/', function(req, res, next) {
    res.send('ok!')
})

app.listen(4000)
