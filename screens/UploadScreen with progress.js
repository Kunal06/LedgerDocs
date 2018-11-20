import React, { Component } from 'react';
import { KeyboardAvoidingView, AsyncStorage,PixelRatio, Alert, TouchableOpacity,ScrollView, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { futch, Header,Input, Button, Spinner, Card, CardSection} from '../components/common';
import Icon from 'react-native-ionicons';
import IOSPicker from 'react-native-ios-picker';
import MultiSelect from 'react-native-multiple-select';

const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';
var XMLParser = require('react-xml-parser');
import LinksScreen from './LinksScreen';
var projectValues=[];
var projectKeys=[];
var tagValues=[];
var tagKeys=[];
const projects=[];
//let tags=[];
export default class UploadScreen extends React.Component {
    state = { email: '', password: '', note: ''};
  constructor(props){
    console.log("UPLOAD SCREEN");
    super(props);
    this._bootstrapAsync();
    this.state = {
      image: this.props.navigation.state.params.Image,
      selectedItems : [],
      projectId: '',
      selectedValue: 'SELECT PROJECTS',
      tags:[],
      language: 'SElect',
    };
    // if(this.state.image){
    //   this.setState({
    //     images: [...this.state.images, this.state.image],
    //   })
    // }
  }
  static navigationOptions = {
    header: <Header headText="Upload Image"> </Header>,
  };
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
  };
  componentDidMount() {
    console.log("Component DID MOunt ENtered");
    this.loadTags.bind(this);
  }
  // shouldComponentUpdate(nextprops, prevprojectId){
  //   if (this.state.prevprojectId !== this.state.projectId) {
  //       console.log("Enter update projectID - - - " + this.state.projectId);
  //       return true
  //   }
  //   return false
  // }
  render() {
    //const { selectedItems } = this.state;
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
      <KeyboardAvoidingView style={styles.container}
      behavior="position"
      enabled>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
           <View style={[styles.avatar, styles.avatarContainer, {width: 300, marginBottom: 20, marginTop: 10, alignItems: 'center'}]}>
           {console.log(this.state.image)}
             <Image style={styles.avatar, {width: 250, height: 250 }} source={this.state.image} />
             </View>
             <View title="Select me" style={{width: 300,marginBottom: 20, alignItems: 'center'}}>
             <Text style= {styles.textStyle}> Select Project </Text>
             <IOSPicker
             style= {{width: 200, height:25, borderRadius:5,
             borderWidth:1,
             borderColor:'#007aff'}}
             selectedValue={this.state.selectedValue}
             mode='modal'
             data={projectValues}
             onValueChange={(d, i)=> this.change(d, i)} />
             </View>
             <CardSection style={{ maxHeight:500 }}>
           <View style={{ flex: 1,width: 300, maxHeight:500 }}>
             <MultiSelect
               items={this.state.tags}
               uniqueKey="id"
               ref={(component) => { this.multiSelect = component }}
               onSelectedItemsChange={this.onSelectedItemsChange.bind(this)}
               selectedItems={this.state.selectedItems}
               selectText="Select Tags "
               searchInputPlaceholderText="Search Tags..."
               onChangeInput={ (text)=> console.log(text)}
               tagRemoveIconColor="#CCC"
               tagBorderColor="#CCC"
               tagTextColor="#000"
               selectedItemTextColor="#CCC"
               selectedItemIconColor="#CCC"
               itemTextColor="#000"
               displayKey="val"
               searchInputStyle={{ color: '#CCC' }}
               submitButtonColor="#CCC"
               submitButtonText="Submit"
               hideSubmitButton
               autoFocusInput= {false}
             />
             <ScrollView>
             {
               this.multiselect
               ?
               this.multiSelect.getSelectedItemsExt(this.state.selectedItems)
               :
               null
             }
             </ScrollView>
           </View>
</CardSection>
<Card>
<CardSection>
<View style={{ width: 300,height: 40, backgroundColor: this.state.note,
       borderWidth: 0}}>
    <TextInput
      multiline = {true}
      numberOfLines = {2}
      value = {this.state.note}
      onChangeText={this.handleTextInput.bind(this)}
      editable = {true}
      maxLength = {60}
      placeholder= "ADD NOTE HERE"
      spellCheck={true}
      blurOnSubmit
      />
  </View>
  </CardSection>
  </Card>
  <View style={styles.container,{marginBottom: 10, alignSelf: 'stretch', position: 'relative',}}>
           <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} onPress={this.uploadImage.bind(this)}>
           <Text style={styles.textStyle}> Upload Image </Text>
           </TouchableOpacity>
           <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} onPress={this.goBack}>
             <Text style={styles.textStyle}> Take Another Picture </Text>
           </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>

      </View>
      </ScrollView>
    );
  }
  handleTextInput= note =>{
    this.setState({note});
  }
  change(d, i) {
    console.log("d val - " + d);
    console.log("i Value - " + i);
    this.setState({
      selectedValue: d,
      projectId: projectKeys[i],
    },
   this.loadTags.bind(this)
);

    console.log("project ID- " + this.state.projectId);
    console.log("Selected Value - " + this.state.selectedValue);
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  goBack = async () => {
    const userToken = await AsyncStorage.setItem('UploadReady', 'false');
    //console.log(userToken);
    this.props.navigation.navigate('Links');
  };

  loadProjects(){
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(this.state.email);
    console.log(this.state.password);

    futch(serverURL+'getProjects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    },(e) => {
          const progress = e.loaded / e.total;
          console.log(progress);
          this.setState({
            progress: progress
          });
        })
    .then((responseJson) => {
      // Showing response message coming from server after inserting records.
      console.log("RESPONSE JSON - " + JSON.stringify(responseJson));
      //var xml = new XMLParser().parseFromString(responseJson);    // Assume xmlText contains the example XML
    //  console.log(xml);
      // console.log(xml.getElementsByTagName('String')[11].value);
      let i =4;
     //console.log(xml.getElementsByTagName('key'));
     // let projectsObjKey= xml.getElementsByTagName('key');
     //  let projectsObj= xml.getElementsByTagName('String');
     //  for(let i = 4; i < projectsObj.length ; i++ ){
     //    projectKeys.push(projectsObjKey[i].value);
     //    projectValues.push(projectsObj[i].value);
     //  //  console.log(projectsObjKey[i].value);
     //    let keyvalitem = {
     //      id: projectsObjKey[i].value,
     //      val: projectsObj[i].value
     //    }
     //    projects.push(keyvalitem);
     //  }
     //  //console.log(projects[5].val);
     //
     //  // console.log(projects);
     //  // console.log(items);
     //  console.log(projectValues);
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
  loadTags(){
    // console.log("ENTERED LOAD TAGS");
    // console.log("project ID- " + this.state.projectId);
    // console.log("Selected Value - " + this.state.selectedValue);

    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(this.state.projectId);
    //console.log(this.state.password);
    fetch(serverURL+'getTags/'+ this.state.projectId, {
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
      console.log(xml);
      // console.log(xml.getElementsByTagName('String')[11].value);
      let i =4;
      this.setState({
        tags:[],
      });
     //console.log(xml.getElementsByTagName('key'));
     let tagObjKeys= xml.getElementsByTagName('key');
      let tagObjValues= xml.getElementsByTagName('String');
      for(let i = 4; i < tagObjValues.length ; i++ ){
        tagKeys.push(tagObjKeys[i].value);
        tagValues.push(tagObjValues[i].value);
        let keyvalitem = {
          id: tagObjKeys[i].value,
          val: tagObjValues[i].value
        }
        this.setState({
          tags: [...this.state.tags, keyvalitem]
        });

        //console.log(tagObjKeys[i].value);

      }
      console.log(tagObjValues);
      console.log("TAGS - ");
      console.log(this.state.tags);
      // while (xml.getElementsByTagName('String')[i].value != undefined){
      //
      //   elements.push(<Card value={ xml.getElementsByTagName('String') } />);
      //   i++;
      // }
    }).catch((error) => {
      console.error(error);
    });
  }
  uploadImage(){
    console.log("UPLOAD IMAGE - ProjectID - "+this.state.projectId);
    console.log("UPLOAD IMAGE - Note - "+this.state.note);
    console.log("UPLOAD IMAGE - Image - "+this.state.image.uri);
    console.log("UPLOAD IMAGE - Selected Tags - "+this.state.selectedItems);
    let tagString='';
    for (let tag of this.state.selectedItems) {
      tagString += tag+',';
    }
    tagString= tagString.substring(0, tagString.length - 1);
    console.log("UPLOAD IMAGE - Selected Tags - " + tagString);

    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    data.append("ProjectId",  this.state.projectId);
    data.append("TagIds", tagString);
    data.append("Note", this.state.note);
    data.append('image', {
      uri: this.state.image.uri,
      type: 'image/jpeg', // or photo.type
      name: 'test'+ new Date().toLocaleString() + '.jpeg'
    });
    fetch(serverURL+'upload', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data
    }).then((response) => response.text())
    .then((responseJson) => {
      // Showing response message coming from server after inserting records.
      console.log("RESPONSE JSON - " +responseJson);
      var xml = new XMLParser().parseFromString(responseJson);    // Assume xmlText contains the example XML
      console.log(xml);
      // console.log(xml.getElementsByTagName('String')[11].value);
      let i =4;
     //console.log(xml.getElementsByTagName('key'));
     let tagObjKeys= xml.getElementsByTagName('key');
      let tagObjValues= xml.getElementsByTagName('String');
      alert(tagObjValues[1].value);
    }).catch((error) => {
      console.error(error);
    });
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'space-between',
    // justifyContent: 'center',
  },
  heading: {
    flex: 2,
    fontSize: 20,
  },
  dropdown: {
    height: 15,
    width: 250,
    fontSize: 15,
  },
  submitButton: {
    flex: 3,
    height: 5,
    flexDirection: 'row',
    justifyContent:'flex-end',
    bottom: 0,
},
avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 30,
    width: 250,
    height: 250
  },
  pickerStyle:  {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor :'#fff',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    alignItems: 'center',
  },
  multi: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  buttonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#007aff',
    marginTop: 10,
  },
  textStyle: {
    alignSelf:'center',
    color:'#007aff',
    fontSize:16,
    fontWeight: '600',
    paddingTop:10,
    paddingBottom:10
  },
  footer: {
    width: '100%',
      height: 50,
      backgroundColor: '#FF9800',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
  },

};
//
// <ModalDropdown dropdownStyle={{width: 200, height:40}} options={projectKeys}/>
// <ModalDropdown dropdownStyle={{width: 200, height:40}} options={projectValues}/>
