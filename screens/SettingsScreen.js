// Settigns Screen - Logout button present on page. Any other application
// settings can be implemented here.
import React, { Component } from 'react';
import { AsyncStorage,TouchableOpacity, View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import {Header, Button, Spinner} from '../components/common';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header:null,
    title: null,
  };
  constructor(props){
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.loggedIncontainer}>
      <View style={styles.hb_container}>
        <View style={styles.hb_center}>
          <Text style={{ fontSize: 20, color: '#fff' }}> Settings  </Text>
        </View>
        </View>
      <View style= {styles.container} >
      <TouchableOpacity style={{height: 100,}, styles.buttonStyle} onPress={this._signOutAsync}>
      <Text style={styles.textStyle}> Log Out </Text>
      </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  _signOutAsync = async () => {
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
  loggedIncontainer:
      {
        flex: 1,
        backgroundColor:'#fff',
      },
      //HeaderBanner = hb
      hb_container: {
        height: '8%',
        backgroundColor: '#365C80',
      },
      hb_left: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        left: '5%',
      },
      hb_center: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
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
