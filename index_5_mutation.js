// mutation用法
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

app.use('/graphql/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.use('/', function(req, res, next) {
    res.send('ok!')
})

app.listen(4000)

/* 客户端调用方法
# 创建
mutation {
  createAccount(input: {name: "李一峰", age: 23, sex: "男", department: "演艺部"}) {
    name
    age
    sex
    department
  }
}

# 更新
mutation {
  updateAccount(id: "李一峰", input: {
    age: 101
  }) {
    age
  }
}

# 查询
query {
  accounts {
    name
    age
    sex
    department
  }
}
*/

/*
GrapHQ的类型系统
对象类型和字段
type Character {
  name: String!
  appearsIn: [Episode!]!
}
标量类型（Scalar Types）：Int, Float, String, Boolean, ID
枚举类型（Enumeration Types）
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
接口（Interfaces）
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}
联合类型（Union Types）
union SearchResult = Human | Droid | Starship
输入类型（Input Types）
input ReviewInput {
  stars: Int!
  commentary: String
}
*/