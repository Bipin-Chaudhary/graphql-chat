module.exports = `

    type Query {
        users: [User]
        messages: [Message]
    }

    type User {
        id: ID!
        name: String!
        email: String!
        messages: String!
    }

    type Message {
        id: ID!
        message: String!
        sendMail: String!
        receiverMail: String!
        timeStamp : Float!
        users: [User]
    }

    type Mutation {
        
        createUser(name:String!,email:String!): User!
        updateUser(id:ID!, name:String): User!
        deleteUser(email:String!): Boolean!
        userTyping(email:String receiverMail:String!):Boolean!

        createMessage(senderMail:String!, receiverMail:String!, message:String!, timestamp: Float!): Message!
        updateMessage(id:ID!, message:String!): Message!
        deleteMessage(id:String!): Boolean!

    }

    type Subscription {
        newMessage(receiverMail:String!): Message
        userTyping(receiverMail:String!): String
        newUser : User
        oldUser : User
    }

`;
