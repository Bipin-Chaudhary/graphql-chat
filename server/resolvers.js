const UsersModel = require('./models/usersModel')
const MessagesModel = require('./models/messagesModel')
const {PubSub, withFilter}= require('graphql-subscriptions')

const pubsub = new PubSub()


module.exports = {

    Query: {
        users: async()=> await UsersModel.find({}),
        messages:async()=> await MessagesModel.find({}) 
    },

    Mutation: {

        createUser :async(_,{name,email})=>{
            const user = await UsersModel.create({name,email})
            await user.save()
            pubsub.publish('newUser',{newUser:user})
            return user
        },

        updateUser: async (_,{id,name})=>{
            const user = await UsersModel.findOneAndUpdate({_id:id},{name},{new:true})
            return true
        },

        deleteUser : async (_, {email})=>{
            await Promise.all([
                UsersModel.findOneAndDelete({email:email}),
                MessagesModel.deleteMany({senderMail:email})
            ])

            pubsub.publish('oldUser',{oldUser:email})
            return true
        },

        userTyping: (_,{email,receiverMail})=>{
            pubsub.publish('userTyping',{userTyping:email,recieverMail})
            return true
        },

        createMessage:async(_, {senderMail,receiverMail,message,timestamp})=>{
            const userText = new MessagesModel({
                senderMail,
                receiverMail,
                message,
                timestamp
            })

            await userText.save()
            pubsub.publish('newMessage',{newMessage:userText,receiverMail: receiverMail})
            return userText
        },

        updateMessage: async (_,{id,message})=>{
            const userText = await MessagesModel.findOneAndUpdate(
                {_id:id},
                {message},
                {new:true}
            )
            return userText
        },

        deleteMessage : async (_,{id})=>{
            await MessagesModel.findOneAndDelete({_id:id})
            return true
        }
    },

    Subscription:{
        newMessage:{
            subscribe:withFilter(
                ()=> pubsub.asyncIterator('newMessage'),(payload,variables)=>{
                    return payload.receiverMail === variables.receiverMail
                }
            )
        },

        newUser: {
            subscribe:()=>{
                // return pubsub.asyncIterator('newUser')
                return pubsub.asyncIterator('newUser')
            }
        },

        oldUser:{
            subscribe: ()=>{
                return pubsub.asyncIterator('oldUser')
            }
        },

        userTyping:{
            subscribe: withFilter(
                ()=> pubsub.asyncIterator('userTyping'),
                (payload,variables)=>{
                    return payload.receiverMail === variables.receiverMail
                }
            )
        }
    }
}