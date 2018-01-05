import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

class LoginScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>LoginScreen</Text>
        <View style={styles.loginButton}>
          <Button
          onPress={this.props._googleLogin} title="google login" />
        </View>
        <View style={styles.loginButton}>
          <Button
          style={styles.loginButton}
          onPress={this.props._fbLogin} title="fb login" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loginButton: {
    margin: 10,
  }
})

export default LoginScreen
