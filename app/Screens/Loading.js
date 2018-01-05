import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

class Loading extends React.Component {
  render() {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
        <Text>Loading...</Text>
        <Text>Loading...</Text>
        <Text>Loading...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: 'blue',
    flex: 1
  }
})

export default Loading
