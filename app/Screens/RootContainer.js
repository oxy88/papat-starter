import React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'

import { SIMPLE_API, SUBSCRIPTIONS_API, TOKEN } from '../config/constants'

import LoginContainer from './LoginContainer'

const httpLink = new HttpLink({
  uri: SIMPLE_API
})

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const wsLink = new WebSocketLink({
  uri: SUBSCRIPTIONS_API,
  options: {
    reconnect: true,
    // connectionParams: {
    //   authToken: AsyncStorage.getItem(TOKEN)
    // }
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
  link: link,
  cache: new InMemoryCache()
})

export default class RootContainer extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoginContainer />
      </ApolloProvider>
    );
  }
}
