import React from 'react';
import {
  SafeAreaView,
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

const serverURL = "https://app.ledgerdocs.com/index.php/iphone/";
//const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';
var XMLParser = require('react-xml-parser');

var projects=[];
var projectValues=["All Projects"];
var projectKeys=[99999999];

var updateKeys= [];
var updateValues= [];
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = { email: '', password: '', };
  constructor(props){
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
      <SafeAreaView style={styles.loggedIncontainer}>
      <View style={styles.hb_container}>
        <View style={styles.hb_center}>
          <Text style={{ fontSize: 20, color: '#fff' }}> Notifications  </Text>
        </View>
        </View>
      <View style={styles.container}>
        <ScrollView style={styles.container, {marginTop: 120,}}
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
        borderColor:'#365C80'}}
        selectedValue={this.state.selectedValue}
        mode='modal'
        data={projectValues}
        onValueChange={(d, i)=> this.change(d, i)} >
        </IOSPicker>

        </View>

        </View>
      </View>
      </SafeAreaView>
    );
  }
  change(d, i) {
    this.setState({
      selectedValue: d,
      projectId: projectKeys[i],
    },
    d == 'All Projects' ?
      this.loadUpdates.bind(this) :
      this.loadUpdatesbyProject.bind(this)

);
}

  loadProjects(){
    projects = [];
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
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
      var xml = new XMLParser().parseFromString(responseJson);    // Assume xmlText contains the example XML
      let i =4;
     let projectsObjKey= xml.getElementsByTagName('key');
      let projectsObj= xml.getElementsByTagName('String');
      for(let i = 4; i < projectsObj.length ; i++ ){
        projectKeys.push(projectsObjKey[i].value);
        projectValues.push(projectsObj[i].value);
        let keyvalitem = {
          id: projectsObjKey[i].value,
          val: projectsObj[i].value
        }
        projects.push(keyvalitem);
      }

      this.setState({
        selectedItems:[],
      });
    }).catch((error) => {
      console.error(error);
    });
  }
  loadUpdatesbyProject(){
    this.setState({
      updates: []
    });
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
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
      var xml = new XMLParser().parseFromString(responseXml);
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
      }   }
    }).catch((error) => {
      console.error(error);
    });
  }
  loadUpdates(){
    this.setState({
      updates: []
    });
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    fetch(serverURL+'getUpdates/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    }).then((response) => response.text())
    .then((responseXml) => {
      var xml = new XMLParser().parseFromString(responseXml);
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
    }).catch((error) => {
      console.error(error);
    });
  }

}

const styles = {
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  textStyle: {
    alignSelf:'center',
    color:'#365C80',
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
};
