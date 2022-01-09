import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);

import {
    ApolloServer
} from 'apollo-server-express';
const app = express();


app.use(cors());


const server = new ApolloServer({});


server.applyMiddleware({

app,

path: '/graphql'

});


app.listen({

port: 8000

}, () => {

console.log('Apollo Server on http://localhost:8000/graphql');

});