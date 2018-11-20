import React, { Component } from 'react';
import { AsyncStorage,TouchableOpacity, View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import {Header, Button, Spinner} from '../components/common';
import MultiSelect from 'react-native-multiple-select';


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header:<Header headText="Settings"> </Header>,
    title: null,
  };
  constructor(props){
    console.log("Settings SCREEN");
    super(props);
    this.state = {
      selectedItems : [],
    };

  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
     const { selectedItems } = this.state;
    return (
      <View style= {styles.container} >
      <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} onPress={this._signOutAsync}>
      <Text style={styles.textStyle}> Log Out </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} >
      <Text style={styles.textStyle}> Upload Screen </Text>
      </TouchableOpacity>
      </View>
    );
  }

  _signOutAsync= async () => {
    const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
    let user = {
    LoggedIn: 'false',
    user_name: currentUser.user_name,
    password:  currentUser.password
  }
  await AsyncStorage.setItem('User', JSON.stringify(user));

    //firebase.auth().signOut();
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
  MainContainer:
    {
        flex: 1,
    },
    viewStyle:{
      backgroundColor:'#F8F8F8',
      justifyContent: 'flex-start',
      // alignItems: 'center',
      // paddingTop: 35,
      shadowColor: '#000000',
      shadowOffset: {width:0, height:5},
      shadowOpacity: 0.3,
      position: "relative",
      // elevation: 2,
      // position: 'relative'
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
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 30,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    multi: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      padding: 10,
    },
});
