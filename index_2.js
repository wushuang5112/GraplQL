// 嵌套返回值
var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { graphql, buildSchema } = require('graphql')

// 构建schema，这里定义查询的语句和类型
var schema = buildSchema(`
    type Account {
        name: String,
        age: Int,
        sex:  String,
        department: String
    }
    type Query {
        hello: String,
        accountName: String,
        age: Int,
        account: Account
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
    },
    account: () => {
        return {
            name: '李四光',
            age: 18,
            sex: '男',
            department: '科学院'
        }
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
