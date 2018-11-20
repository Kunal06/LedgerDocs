/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

import {Header, Button, Spinner,Card, CardSection,Input} from './components/common';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

//PHP Authentication

const userData = {
  "user_name": '',
  "password": '',
  "client_OS": 'IOS',
}
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    loggedIn: null,
  };
/* AUTHENTICATION */
  // componentWillMount(){
  //     firebase.initializeApp({
  //       apiKey: 'AIzaSyD0wHLpHjO2U8WqsZaDKfCgd16eURcOncw',
  //   authDomain: "ledgerdocs-36555.firebaseapp.com",
  //   databaseURL: "https://ledgerdocs-36555.firebaseio.com",
  //   projectId: "ledgerdocs-36555",
  //   storageBucket: "ledgerdocs-36555.appspot.com",
  //   messagingSenderId: "767776111640"
  //     });
  //     firebase.auth().onAuthStateChanged((user) => {
  //       if(user) {
  //         this.setState({loggedIn:true});
  //         console.log("LoggedIn");
  //       }
  //       else {
  //         this.setState({loggedIn:false});
  //         console.log("LoggedOut");
  //       }
  //     });
  //   }
    state = { email: '', password: '', error: '', loading: false};

render(){
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
    <View style = {styles.MainContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
      </SafeAreaView>
  );
}
}

const styles = StyleSheet.create({
  container:
    {
        flex: 1,
        backgroundColor: '#fff',
    },
  MainContainer:
    {
        flex: 1,
    },

    bottomView:{
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
    },
    viewStyle:{
      backgroundColor:'#F8F8F8',
      // justifyContent: 'flex-start',
      // alignItems: 'center',
      height: 50,
      // paddingTop: 35,
      paddingBottom: 5,
      shadowColor: '#000000',
      shadowOffset: {width:0, height:5},
      shadowOpacity: 0.3,
      // elevation: 2,
      // position: 'relative'
    },
    textStyle:{
      color: '#fff',
      fontSize: 22
    },
    errorTextStyle: {
      fontSize: 20,
      alignSelf: 'center',
      color: 'red'
    },
    buttonStyle: {
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderRadius:5,
      borderWidth:1,
      borderColor:'#007aff',
      marginLeft:5,
      marginRight:5
    }
});
