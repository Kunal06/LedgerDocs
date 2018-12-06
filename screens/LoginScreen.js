// Login Screen - login to application through ledgerdocs login. Fetch call made
// to server with username and password as parameters.
import React, {Component} from 'react';
import {View, Text,AsyncStorage,TouchableOpacity, Image, Switch, KeyboardAvoidingView} from 'react-native';
import {Button,Card, CardSection,InputVertical, Spinner,Header} from '../components/common';

var XMLParser = require('react-xml-parser');

// PHP authenticate
//const serverURL = "https://app.ledgerdocs.com/index.php/iphone/";
const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';

// PHP authenticate------
export default class LoginScreen extends React.Component{
  // static navigationOptions = {
  //   header: <Header headText="Login"> </Header>,
  // };
  static navigationOptions = {
    header: null
  };
  state = { email: '', password: '', error: '', loading: false,
  loggedIn: 'false', secure: true, remember: false};

  constructor(props){
    console.log("Login SCREEN");
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
     //console.log(currentUser.LoggedIn);
     console.log(currentUser.user_name);
     console.log(currentUser.password);
     console.log(currentUser.LoggedIn);
     console.log("REMEMBER  " +currentUser.remember);
     if(currentUser.remember){
    this.setState({
      email: currentUser.user_name,
      password: currentUser.password,
      remember: currentUser.remember
    });
}
  };
//PHP Authentication

authenticate(){
  this.setState({error: '', loading: true});
  const data = new FormData();
  data.append("user_name",  this.state.email);
  data.append("password",  this.state.password);
  console.log(data.getParts()[0].string); //email
  console.log(data.getParts()[1].string); //password
  fetch(serverURL+'authenticate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: data
  }).then((response) => response.text())
  .then((responseXML) => {
    // Showing response message coming from server.
    //console.log(responseXML);
    var xml = new XMLParser().parseFromString(responseXML);    // Assume xmlText contains the example XML
    //console.log(xml);
    //console.log(xml.getElementsByTagName('String')[0].value);
    if(xml.getElementsByTagName('String')[0].value == "success"){
      //console.log("BEGIN LOGIN");
      this.onLoginSuccess();
    }
    else{
      this.onLoginFail();
    }

  }).catch((error) => {
    console.error(error);
  });
}

_signInAsync = async () => {
  //console.log(" SIGN IN SUCCESFUL");
  // console.log("USERNAME - " + this.state.email);
  // console.log("Password - " + this.state.password);
  this.setState({
    loggedIn: 'true',
  },
);
 console.log("Remember - " + this.state.remember);
let user = {
  LoggedIn: this.state.loggedIn,
  user_name:  this.state.email,
  password:  this.state.password,
  remember: this.state.remember
}

  await AsyncStorage.setItem('User', JSON.stringify(user));
   // await AsyncStorage.setItem('LoggedIn', 'true');
   // await AsyncStorage.setItem('user', 'test');
   // await AsyncStorage.setItem('password', this.state.password);
   // const userToken = await AsyncStorage.getItem('LoggedIn');
   // const username = await AsyncStorage.getItem('username');
  // const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
   // console.log(currentUser.loggedIn);
   // console.log(currentUser.user_name);
   // console.log(currentUser.password);
  
   this.props.navigation.navigate('AuthLoading');
 };
onLoginFail(){
  this.setState({
    error: 'Authentication Failed',
    loading: false
  });
}
onLoginSuccess(){
  this._signInAsync();
  this.setState({
  error: '',
  loading: false,
  remember: false
});
}
managePasswordVisibility = () =>
  {
    this.setState({ secure: !this.state.secure });
  }
renderButton(){
  if(this.state.loading){
    return <Spinner size= "small" /> ;
  }
  return (
    <View style= {styles.loginButton}>
    <Button style={styles.buttonStyle} Pressed = {this.authenticate.bind(this)}>
        Log in
      </Button>
      </View>
  );
}

  render() {
    return (
      <KeyboardAvoidingView
      style={{backgroundColor:'#DDECF9', flex:1, color: "#365C80"}}
      behavior="position"
      keyboardVerticalOffset={-150}
      enabled>
      <View >
      <Card>
      <Image
        style= {{alignSelf: 'center'}}
        source={require('../assets/images/Logo.png')}
      />
      <Text style= {{alignSelf: 'center', fontSize: 26, color: "#365C80"}}>
      Log in to your Account
      </Text>
      </Card>

      <Card>
      <View style={styles.inputFieldContainer}>
          <InputVertical
            placeholder= ''
            label = 'Email'
            value = {this.state.email}
            onChangeText={email => this.setState({email})}
            />
            </View>

      <View style={styles.inputFieldContainer}>
        <InputVertical
          secureTextEntry = {this.state.secure}
          placeholder= ""
          label = "Password"
          value = {this.state.password}
          onChangeText={password => this.setState({password})} />
          <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>
            <Image source = { ( this.state.secure ) ? require('../assets/images/hide.png') : require('../assets/images/view.png') } style = { styles.btnImage } />
          </TouchableOpacity>
          </View>
       <Text style= {styles.errorTextStyle}>
        {this.state.error}
       </Text>
       <View style= {styles.switchStyle}>
       <Switch
       onValueChange={ (value) => {
         this.setState({ remember: value });
       }}
       value={ this.state.remember }
       trackColor= {{false: "#fff" ,true: "#fff"}}
       thumbColor= {(this.state.remember == true) ? "#365C80" :"#C7C4C4" }
       ios_backgroundColor= {"#fff"}
       />
         <Text style= {styles.switchTextStyle}>
           Remember Me
         </Text>
         </View>
         <View style= {{height: 80}}>
          {this.renderButton()}
          </View>
        <View style= {styles.signup}>
          <Text style= {{ alignSelf: 'center', fontSize: 14}}> Don't Have an Account? <Text style={{textDecorationLine: 'underline'}}> Sign up </Text></Text>
        </View>

      </Card>
      </View>
      </KeyboardAvoidingView>

    );
  }
}
const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
    color: "#365C80"
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#365C80',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#007aff',
    marginLeft:5,
    marginRight:5
  },
  inputFieldContainer:  {
    padding: 5,
    backgroundColor :'#DDECF9',
    position: 'relative',
    alignItems: 'flex-start',
    height: 100,
     maxHeight:500 ,
     paddingLeft:8,
     flexDirection: 'row',
     color: "#365C80"

  },
   loginButton:  {
    alignItems:"center",
    padding: 20,
    backgroundColor :'#DDECF9',
    position: 'relative',
    alignItems: 'flex-start',
    height: 80,
     maxHeight:500 ,

  },
  signup:{
    alignItems:"center",
    backgroundColor :'#DDECF9',
    position: 'relative',
    alignItems: 'flex-start',
    height: 80,
     maxHeight:80 ,
     flexDirection: 'column',
     color: "#365C80"
  },
  btnImage:
  {
    resizeMode: 'contain',
    height: '100%',
    width: '100%'
  },
  visibilityBtn:
  {
    position: 'relative',
    right: 3,
    height: 60,
    width: 35,
    padding: 6,
    marginTop : 30,
    alignItems: 'flex-end'
  },
  switchStyle:
  {
    position: 'relative',
    padding: 5,
    flexDirection: 'row',
  },
  switchTextStyle:
  {
    color: "#365C80",
    position: 'relative',
    padding: 5,
    flexDirection: 'row',
  },
};


/*          onChangeText={password => this.setState({password})} />
    "password" can be called whatever as it is the variable
    representing the value received from the field
    // justifyContent- Horizontal, alignItems- Vertical
    bind- to make sure we stay in the same context as the class as
    we dont know when it will be run
    */
