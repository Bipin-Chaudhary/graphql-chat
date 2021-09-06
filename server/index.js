const {ApolloServer, gql} = require('apollo-server-express')
const app = require('express')()
const mongoose = require('mongoose')
const {createServer} = require('http')
const {execute,subscribe} = require('graphql')
const {SubscriptionServer} = require('subscriptions-transport-ws')
const {makeExecutableSchema} = require('@graphql-tools/schema')
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core')
const {PubSub, withFilter}= require('graphql-subscriptions')

const pubsub = new PubSub()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')


//db
mongoose.connect('mongodb://localhost:27017/graphql-chat')
.then(()=>console.log('database connected...'))
.catch(error=>console.log('error in db connection'))

const schema = makeExecutableSchema({typeDefs,resolvers})


async function startServer() {
    
    const httpServer = createServer(app)
    const server = new ApolloServer({
        schema,
        // context:{pubsub},
        plugins:[{
            async serverWillStart(){
                return{
                    async drainServer(){
                        subscriptionServer.close()
                    }
                }
            }
        },ApolloServerPluginLandingPageGraphQLPlayground()]
    })
    
    await server.start()

    server.applyMiddleware({app})
    
    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
    },{
        server:httpServer,
        path:server.graphqlPath
    })
    
    
    httpServer.listen(4000,()=>{
        console.log(`server is now running on http://localhost:${4000}/graphql`)
    })
}

startServer()

