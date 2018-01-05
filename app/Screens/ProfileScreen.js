import React from 'react'
import { View, Text, Button } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Loading from './Loading'

class ProfileScreen extends React.Component {
  render() {
    if (this.props.loggedInUserQuery.loading) {
      return <Loading />
    }
    return (
      <View>
        <Text>ProfileScreen</Text>
        <Button onPress={this.props.screenProps._logout} title="logout" />
        <Text>{this.props.loggedInUserQuery.loggedInUser.id}</Text>
      </View>
    )
  }
}

const LOGGED_IN_USER_QUERY = gql`
query {
  loggedInUser {
    id
  }
}
`

export default graphql(LOGGED_IN_USER_QUERY, { name: "loggedInUserQuery"})(ProfileScreen)
