import { TabNavigator } from 'react-navigation'

import ProfileScreen from './ProfileScreen'
import PartyScreen from './PartyScreen'
import ChatScreen from './ChatScreen'

const RootNavigator = TabNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Party: {
    screen: PartyScreen
  },
  Chat: {
    screen: ChatScreen
  }
})

export default RootNavigator
