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
import SplashScreen from 'react-native-splash-screen'

import {Header, Button, Spinner,Card, CardSection,Input} from './components/common';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

export default class App extends React.Component {

  componentDidMount(){
    SplashScreen.hide();
  }

render(){
  return (
        <AppNavigator />
  );
}
}

const styles = {
  container:
    {
        flex: 1,
        backgroundColor:'#DDECF9',
    },
loggedIncontainer:
    {
      flex: 1,
      backgroundColor:'#fff',
    },
  MainContainer:
    {
        flex: 1,
    },

};
