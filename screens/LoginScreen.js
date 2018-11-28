// Login Screen - login to application through ledgerdocs login. Fetch call made
// to server with username and password as parameters.
import React, {Component} from 'react';
import {View, Text,AsyncStorage,TouchableOpacity} from 'react-native';
import {Button,Card, CardSection,Input, Spinner,Header} from '../components/common';

var XMLParser = require('react-xml-parser');

// PHP authenticate
//const serverURL = "https://app.ledgerdocs.com/index.php/iphone/";
const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';

// PHP authenticate------

export default class LoginScreen extends React.Component{
  static navigationOptions = {
    header: <Header headText="Login"> </Header>,
  };
  state = { email: '', password: '', error: '', loading: false, loggedIn: 'false'};

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

onButtonPress(){
  const { email,password } = this.state;

  this.setState({error: '', loading: true});

  firebase.auth().signInWithEmailAndPassword(email,password)
    .then(this.onLoginSuccess.bind(this))
    .catch(() => {
      firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(this.onLoginSuccess.bind(this))
        .catch(this.onLoginFail.bind(this));
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
let user = {
  LoggedIn: this.state.loggedIn,
  user_name:  this.state.email,
  password:  this.state.password
}

  await AsyncStorage.setItem('User', JSON.stringify(user));
   // await AsyncStorage.setItem('LoggedIn', 'true');
   // await AsyncStorage.setItem('user', 'test');
   // await AsyncStorage.setItem('password', this.state.password);
   // const userToken = await AsyncStorage.getItem('LoggedIn');
   // const username = await AsyncStorage.getItem('username');
  const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
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
  this.setState({email:'',
  password:'',
  error: '',
  loading: false
});
}

renderButton(){
  if(this.state.loading){
    return <Spinner size= "small" />;
  }
  return (
    <Button style={styles.buttonStyle, this.props.buttonStyle} Pressed = {this.authenticate.bind(this)}>
        Log in
      </Button>
  );
}

  render() {
    return (
      <View style={{backgroundColor:'#fff', flex:1,}}>
      <Card>
        <CardSection>
          <Input
            placeholder= 'user@gmail.com'
            label = 'Email'
            value = {this.state.email}
            onChangeText={email => this.setState({email})}
            />
        </CardSection>

        <CardSection>
        <Input
          secureTextEntry
          placeholder= "password"
          label = "Password"
          value = {this.state.password}
          onChangeText={password => this.setState({password})} />
       </CardSection>

       <Text style= {styles.errorTextStyle}>
        {this.state.error}
       </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>

      </Card>
      </View>
    );
  }
}
const styles = {
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
};


/*          onChangeText={password => this.setState({password})} />
    "password" can be called whatever as it is the variable
    representing the value received from the field
    // justifyContent- Horizontal, alignItems- Vertical
    bind- to make sure we stay in the same context as the class as
    we dont know when it will be run
    */
