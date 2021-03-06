import React from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import LoginScreen from './LoginScreen'
import Loading from './Loading'
import RootNavigator from './RootNavigator'

import { TOKEN, IOS_CLIENT_ID, WEB_CLIENT_ID } from '../config/constants'

class LoginContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedSignedIn: false,
      isSignedIn: false
    }
  }

  async componentWillMount() {
    this._setupGoogleSignin()
    const token = await AsyncStorage.getItem(TOKEN)
    if (token) {
      this.setState({ isSignedIn: true })
    }
    this.setState({ checkedSignedIn: true })
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
      });
    }
    catch(err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

  async _googleLogin() {
    try {
      const user = await GoogleSignin.signIn()
      const mutationResult = await this.props.googleLoginMutation({
        variables: {
          googleToken: user.idToken
        }
      })
      await AsyncStorage.setItem(TOKEN, mutationResult.data.authenticateGoogleUser.token)
      this.setState({ isSignedIn: true })
    } catch(e) {
      console.log('google signin error', e)
    }
  }

  async _fbLogin() {
    try {
      const loginResult = await LoginManager.logInWithReadPermissions(['public_profile'])
      if (loginResult.isCancelled) {
        alert('Login cancelled')
      } else {
        const accessTokenData = await AccessToken.getCurrentAccessToken()
        const mutationResult = await this.props.fbLoginMutation({
          variables: {
            facebookToken: accessTokenData.accessToken.toString()
          }
        })
        await AsyncStorage.setItem(TOKEN, mutationResult.data.authenticateUser.token)
        this.setState({ isSignedIn: true })
      }
    } catch(e) {
      alert('login fail with error: ' + e)
    }
  }

  async _logout() {
    await AsyncStorage.removeItem(TOKEN)
    const fbToken = await AccessToken.getCurrentAccessToken()
    const googleToken = await GoogleSignin.currentUserAsync()
    if (googleToken) {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
    }
    if (fbToken) {
      LoginManager.logOut()
    }
    this.setState({ isSignedIn: false })
  }

  render() {
    const { isSignedIn, checkedSignedIn } = this.state
    if (!checkedSignedIn) {
      return <Loading />
    }
    if (!isSignedIn) {
      return <LoginScreen
        _googleLogin = {this._googleLogin.bind(this)}
        _fbLogin = {this._fbLogin.bind(this)}
      />
    }
    if (isSignedIn) {
      return <RootNavigator
      screenProps = {{
        _logout: this._logout.bind(this)
      }
      }
      />
    }
  }
}

const GOOGLE_LOGIN_MUTATION = gql`
  mutation($googleToken: String!) {
    authenticateGoogleUser(
      googleToken: $googleToken
    ) {
      token
    }
  }
`

const FB_LOGIN_MUTATION = gql`
  mutation($facebookToken: String!) {
    authenticateUser(
      facebookToken: $facebookToken
    ) {
      token
    }
  }
`

export default compose(
  graphql(GOOGLE_LOGIN_MUTATION, { name: "googleLoginMutation"}),
  graphql(FB_LOGIN_MUTATION, { name: "fbLoginMutation"})
)(LoginContainer)
