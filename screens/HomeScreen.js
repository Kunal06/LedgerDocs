import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  View,
  FlatList,
  RefreshControl
} from 'react-native';
import { MonoText } from '../components/StyledText';
import {Header} from '../components/common';
import IOSPicker from 'react-native-ios-picker';

const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';
var XMLParser = require('react-xml-parser');

var projects=[];
var projectValues=["All Projects"];
var projectKeys=[99999999];

var updateKeys= [];
var updateValues= [];
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: <Header headText="Home"> </Header>,
  };
  state = { email: '', password: '', };
  constructor(props){
    console.log("HOME SCREEN");
    super(props);
    this._bootstrapAsync();
    this.state = {
      updates: [],
      projectId: '99999999',
      refreshing: false,
      selectedValue: '',
    };

  }
    _bootstrapAsync = async () => {
      const currentUser = JSON.parse (await AsyncStorage.getItem('User'));
       //console.log(currentUser.LoggedIn);
       console.log(currentUser.user_name);
       console.log(currentUser.password);
       console.log(currentUser.LoggedIn);
      this.setState({
        email: currentUser.user_name,
        password: currentUser.password,
      });
      this.loadProjects();
      this.loadUpdates();
    };
    fetchData = async () =>{
      this.state.projectId == '99999999' ?
      this.loadUpdates():
      this.loadUpdatesbyProject()
    }
    _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }
  renderItem = (item) => {
    return (
    <View style={styles.buttonStyle}>
        <Text style={styles.textStyle,{color:'#000'}}> {item.value} </Text>
    </View>
  );
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container, {marginTop: 120,}} contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            enabled={true}
          />
        }>

          <View>
          <FlatList
            data={this.state.updates}
            renderItem = {({item}) =>
            <View style={styles.buttonStyle}>
                <Text style={styles.updateText}> {item.val} </Text>
            </View>
          }
          />
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
        <View title="Select me" style={{width: 300, marginBottom: 20, alignItems: 'center'}}>
        <Text style= {styles.textStyle}> Select Project </Text>
        <IOSPicker
        style= {{width: 200, height:25, borderRadius:5,
        borderWidth:1,
        borderColor:'#007aff'}}
        selectedValue={this.state.selectedValue}
        mode='modal'
        data={projectValues}
        onValueChange={(d, i)=> this.change(d, i)} >
        </IOSPicker>

        </View>

        </View>
      </View>
    );
  }
  change(d, i) {
    console.log("d val - " + d);
    console.log("i Value - " + i);
    this.setState({
      selectedValue: d,
      projectId: projectKeys[i],
    },
    d == 'All Projects' ?
      this.loadUpdates.bind(this) :
      this.loadUpdatesbyProject.bind(this)

);
console.log("project ID- " + this.state.projectId);
console.log("Selected Value - " + this.state.selectedValue);
}

  loadProjects(){
    projects = [];
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(this.state.email);
    console.log(this.state.password);
    fetch(serverURL+'getProjects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    }).then((response) => response.text())
    .then((responseJson) => {
      // Showing response message coming from server after inserting records.
      //console.log("RESPONSE JSON - " +responseJson);
      var xml = new XMLParser().parseFromString(responseJson);    // Assume xmlText contains the example XML
    //  console.log(xml);
      // console.log(xml.getElementsByTagName('String')[11].value);
      let i =4;
     //console.log(xml.getElementsByTagName('key'));
     let projectsObjKey= xml.getElementsByTagName('key');
      let projectsObj= xml.getElementsByTagName('String');
      for(let i = 4; i < projectsObj.length ; i++ ){
        projectKeys.push(projectsObjKey[i].value);
        projectValues.push(projectsObj[i].value);
      //  console.log(projectsObjKey[i].value);
        let keyvalitem = {
          id: projectsObjKey[i].value,
          val: projectsObj[i].value
        }
        projects.push(keyvalitem);
      }
      //console.log(projects[5].val);

      // console.log(projects);
      // console.log(items);
      console.log(projectValues);
      this.setState({
        selectedItems:[],
      });
      // while (xml.getElementsByTagName('String')[i].value != undefined){
      //
      //   elements.push(<Card value={ xml.getElementsByTagName('String') } />);
      //   i++;
      // }
    }).catch((error) => {
      console.error(error);
    });
  }
  loadUpdatesbyProject(){
    this.setState({
      updates: []
    });
    console.log("ENTERED LOAD Updates by Project");
    console.log("project ID- " + this.state.projectId);
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(this.state.projectId);
    console.log(this.state.password);
    fetch(serverURL+'getUpdatesbyProject/'+ this.state.projectId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    }).then((response) => response.text())
    .then((responseXml) => {
      if(responseXml){
       console.log(responseXml);
      var xml = new XMLParser().parseFromString(responseXml);
      //console.log(xml);
     let objKeys= xml.getElementsByTagName('key');
      let objValues= xml.getElementsByTagName('String');
      for(let i = 4; i < objValues.length ; i++ ){

        let keyvalitem = {
          key: objKeys[i].value,
          val: objValues[i].value
        }
        this.setState({
          updates: [...this.state.updates, keyvalitem]
        });
      }
     console.log(JSON.stringify(this.state.updates));
   }
    }).catch((error) => {
      console.error(error);
    });
  }
  loadUpdates(){
    this.setState({
      updates: []
    });
    console.log("ENTERED LOAD Updates");
    console.log("project ID- " + this.state.projectId);
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(this.state.projectId);
    console.log(this.state.password);
    fetch(serverURL+'getUpdates/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    }).then((response) => response.text())
    .then((responseXml) => {
      // console.log(responseXml);
      var xml = new XMLParser().parseFromString(responseXml);
     // console.log(xml);
     let objKeys= xml.getElementsByTagName('key');
      let objValues= xml.getElementsByTagName('String');
      for(let i = 3; i < objValues.length ; i++ ){

        let keyvalitem = {
          key: objKeys[i].value,
          val: objValues[i].value
        }
        this.setState({
          updates: [...this.state.updates, keyvalitem]
        });
      }
     console.log(JSON.stringify(this.state.updates));
    }).catch((error) => {
      console.error(error);
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    top: -3,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  textStyle: {
    alignSelf:'center',
    color:'#007aff',
    fontSize:16,
    fontWeight: '600',
    paddingTop:10,
    paddingBottom:10

  },
  updateText: {
    alignSelf:'stretch',
    color:'#000',
    fontSize:12,
    paddingTop:5,
    paddingBottom:5
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
