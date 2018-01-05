import React from 'react'
import { AsyncStorage } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

import Main from './Screens/Main'
import { SIMPLE_API, SUBSCRIPTIONS_API, TOKEN } from './constants'

const httpLink = new HttpLink({
  uri: SIMPLE_API
})

const wsLink = new WebSocketLink(SUBSCRIPTIONS_API, {
  reconnect: true
})

const authLink = setContext(async(_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}`: null
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Main />
      </ApolloProvider>
    )
  }
}

export default App
