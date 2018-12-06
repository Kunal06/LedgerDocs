import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();

    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = JSON.parse (await AsyncStorage.getItem('User'));
    console.log("userToken - "+ JSON.stringify(userToken));
    if (userToken == null){
      this.props.navigation.navigate('Auth');
    }
    //console.log(userToken.LoggedIn == "true" ? "Main" : "Auth");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.timeoutHandle = setTimeout(()=>{
              // Add your logic for the transition
              this.props.navigation.navigate(userToken.LoggedIn == "true" ? 'Main' : 'Auth');
         }, 1000);
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
