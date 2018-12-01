// Settigns Screen - Logout button present on page. Any other application
// settings can be implemented here.
import React, { Component } from 'react';
import { AsyncStorage,TouchableOpacity, View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import {Header, Button, Spinner} from '../components/common';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header:<Header headText="Settings"> </Header>,
    title: null,
  };
  constructor(props){
    console.log("Settings SCREEN");
    super(props);
  }

  render() {
    return (
      <View style= {styles.container} >
      <TouchableOpacity style={{height: 100,}, styles.buttonStyle} onPress={this._signOutAsync}>
      <Text style={styles.textStyle}> Log Out </Text>
      </TouchableOpacity>
      </View>
    );
  }

  _signOutAsync= async () => {
    const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
    let user = {
    LoggedIn: 'false',
    user_name: currentUser.user_name,
    password:  currentUser.password,
    remember:  currentUser.remember
  }
  await AsyncStorage.setItem('User', JSON.stringify(user));
    this.props.navigation.navigate('AuthLoading');
   }
}

const styles = StyleSheet.create({
  container:
    {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    textStyle: {
      alignSelf:'center',
      color:'#007aff',
      fontSize:16,
      fontWeight: '600',
      paddingTop:10,
      paddingBottom:10

    },
    buttonStyle: {
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderRadius:5,
      borderWidth:1,
      borderColor:'#007aff',
      marginTop: 10,
    },
});
