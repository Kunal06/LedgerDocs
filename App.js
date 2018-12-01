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

render(){
  return (
    <SafeAreaView style={styles.container}>
    <View style = {styles.MainContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
      </SafeAreaView>
  );
}
}

const styles = {
  container:
    {
        flex: 1,
        backgroundColor:'#DDECF9'
    },
  MainContainer:
    {
        flex: 1,
    },

};
