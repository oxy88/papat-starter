import React from 'react'
import { View, Text, Button } from 'react-native'

class ProfileScreen extends React.Component {
  render() {
    return (
      <View>
        {console.log(this.props.screenProps)}
        <Text>ProfileScreen</Text>
        <Button onPress={this.props.screenProps._logout} title="logout" />
      </View>
    )
  }
}

export default ProfileScreen
