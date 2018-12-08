import React, { Component } from 'react';
import {SafeAreaView, Picker, Switch, KeyboardAvoidingView, ActivityIndicator,AsyncStorage,PixelRatio, Alert, TouchableOpacity,ScrollView, StyleSheet, Text, View, Image, TextInput, PickerItemIOS } from 'react-native';
import { Header,Input, Button, Spinner, Card, CardSection} from '../components/common';
import Icon from 'react-native-ionicons';
import IOSPicker from 'react-native-ios-picker';
import MultiSelect from 'react-native-multiple-select';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';
var XMLParser = require('react-xml-parser');
import LinksScreen from './LinksScreen';
var projectValues=["Select Projects"];
var projectKeys=[9999999];
var tagValues=["Select Tags"];
var tagKeys=[9999999];
var projects=[];
var notes = [];
const data = [{name: 'SanPyaeLin', code: '22'},{name: 'Jhon', code: '1'},{name: 'Marry', code: '2'}]

//let tags=[];
export default class UploadScreen extends React.Component {
    state = { email: '', password: '', note: ''};
  constructor(props){
    console.log("UPLOAD SCREEN");
    super(props);
    this._bootstrapAsync();
    this.state = {
      image: this.props.navigation.state.params.Image,
      images : this.props.navigation.state.params.Images,
      selectedItems : [],
      projectId: '',
      selectedValue: '',
      tags:[],
      activeSlide: 0,
      loading: false,
      error: '',
      //notes: ['a','b','c'],
      toggled: false,
    };
    // if(this.state.image){
    //   this.setState({
    //     images: [...this.state.images, this.state.image],
    //   })
    // }
    console.log("New array images - " + this.state.images.length);
    //console.log("New array images 0- " + this.state.images[0].uri);
  }
  static navigationOptions = {
    header: null,
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
  _renderItem ({item, index}) {
        return (
          <View style={styles.slide, {flex:1, width: 200, height: 200, alignItems: 'center', borderWidth: 1, borderColor: '#000'}}>
          <Image style={styles.avatar, {width: 200, height: 200 }} source={item} />
      </View>
        );
    }
    get pagination () {
        const { images, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={images.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }
    renderButton(){
      if(this.state.loading){
        return (
          <CardSection>
          <Spinner size= 'large' />
          </CardSection>
        );
      }
      return (
        <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} onPress={this.uploadImage.bind(this)}>
        <Text style={styles.textStyle}> Upload Image </Text>
        </TouchableOpacity>
      );
    }
  render() {
    //const { selectedItems } = this.state;
    return (
      <SafeAreaView style={styles.loggedIncontainer}>
      <View style={styles.hb_container}>
        <View style={styles.hb_center}>
          <Text style={{ fontSize: 20, color: '#fff' }}> Upload Picture </Text>
        </View>
        <TouchableOpacity style={styles.hb_left} onPress= {() => this.props.navigation.navigate('Camera')}>
        <Icon name="arrow-round-back" style={{fontSize: 50, color: "#fff"}}></Icon>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
      <KeyboardAvoidingView style={styles.container}
      behavior="position"
      enabled>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
             <View  style={{width: 300, marginBottom: 20, marginTop: 10, alignItems: 'center' }}>
             <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.images}
                renderItem={this._renderItem}
                sliderWidth={350}
                itemWidth={200}
                layout= 'default'
                removeClippedSubviews={false}
                onSnapToItem= {(index) =>{
                  console.log("Activeslide - "+ index);
                  console.log("Note - "+ notes);
                  if(!this.state.toggled){
                    notes[this.state.activeSlide] = this.state.note;
                    this.setState({ activeSlide: index, note: notes[index] });
                }
                else{
                  this.setState({ activeSlide: index });
                }
                }
                }
              />
              { this.pagination }
              </View>
             <View style={{width: 300, height: 70, padding: 5, backgroundColor: '#DDECF9'}}>
             <IOSPicker
             style= {{width: 300, height:40, borderRadius:5,
             borderBottomWidth: 1,
             borderBottomColor:'#365C80'}}
             selectedValue={this.state.selectedValue}
             mode="modal"
             onValueChange={(d, i)=> this.change(d, i)}>
             {
                projects.map((item, index)=>
                  <Picker.Item key={index} label={item.val} value={item.val} />
                )
              }
              </IOSPicker>
             </View>
             <CardSection style={{ maxHeight:550 }}>
           <View style={styles.multi}>
             <MultiSelect
               items={this.state.tags}
               uniqueKey="id"
               ref={(component) => { this.multiSelect = component }}
               onSelectedItemsChange={this.onSelectedItemsChange.bind(this)}
               selectedItems={this.state.selectedItems}
               selectText="Select Tags "
               searchInputPlaceholderText="Search Tags..."
               onChangeInput={ (text)=> console.log(text)}
               tagTextColor="#000"
               selectedItemTextColor="#365C80"
               selectedItemIconColor="#365C80"
               itemTextColor="#c7c4c4"
               displayKey="val"
               searchInputStyle={{ color: '#CCC', borderBottomWidth: 1, borderBottomColor: "#365C80"}}
               submitButtonColor="#CCC"
               submitButtonText="Submit"
               hideSubmitButton
               autoFocusInput= {false}
               tagBorderColor= {'#365C80'}
               tagRemoveIconColor ={'#365C80'}
             />
             <ScrollView style= {{padding:10, height: 30}}>
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
  <CardSection>
  <View style= {styles.containerStyle}>
  <Switch
  onValueChange={ (value) => {
    this.setState({ toggled: value });
    notes[this.state.activeSlide] = this.state.note;
  }}
  value={ this.state.toggled }
  thumbColor= '#000'
  />
    <Text style= {styles.labelstyle}>
      Use one note for all images
    </Text>
    </View>
  </CardSection>
  </Card>
  <View style={styles.container,{marginBottom: 10, alignSelf: 'stretch', position: 'relative',}}>
    {this.renderButton()}
    <TouchableOpacity style={{height: 100, alignItems:'stretch',}, styles.buttonStyle} onPress={this.goBack}>
      <Text style={styles.textStyle}> Start Again </Text>
    </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>

      </View>
      </ScrollView>
      </SafeAreaView>

    );
  }
  handleTextInput= note =>{
    this.setState({note});
    if(!this.state.toggled){
      notes[this.state.activeSlide] = this.state.note;
  }
    //this.state.notes[this.state.activeSlide] = this.state.note;
    //this.forceUpdate()
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
    //const userToken = await AsyncStorage.setItem('UploadReady', 'false');
    this.clear();
    //console.log(userToken);
    this.props.navigation.navigate('Links');
  };

  loadProjects(){
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

      if(projectsObj.length == 5){
        projectKeys=[];
        projectKeys.push(projectsObjKey[4].value);
        projectValues=[];
        projectValues.push(projectsObj[4].value);
        this.setState({
          selectedValue:projectsObj[4].value,
          projectId: projectKeys[0],
        },
      this.loadTags()
    );
        console.log(this.state.selectedValue);
      }
      else{
        this.setState({
          selectedValue:"Select Projects",
        });
        let keyvalitem = {
          id: '9999999',
          val: "Select Projects",
        }
        projects.push(keyvalitem);
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
    }
      console.log(projectKeys);
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
    console.log("project ID- " + this.state.projectId);
    // console.log("Selected Value - " + this.state.selectedValue);

    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    console.log(projectKeys[0]);
    let projID = this.state.projectId;
    if (projectKeys.length ==1){
      projID= projectKeys[0];
    }

    fetch(serverURL+'getTags/'+ projID, {
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
      for(let i = 3; i < tagObjValues.length ; i++ ){
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
    this.setState({error: '', loading: true});
    console.log("UPLOAD IMAGE - ProjectID - "+this.state.projectId);
    console.log("UPLOAD IMAGE - Note - "+this.state.note);
    //console.log("UPLOAD IMAGE - Image - "+this.state.image.uri);
    console.log("UPLOAD IMAGE - Selected Tags - "+this.state.selectedItems);
    let tagString='';
    let count = this.state.images.length;
    console.log("number of images to be uploaded - " +count);
    let imagesUploaded = 0;
    for (let tag of this.state.selectedItems) {
      tagString += tag+',';
    }
    tagString= tagString.substring(0, tagString.length - 1);
    console.log("UPLOAD IMAGE - Selected Tags - " + tagString);

    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    if(projectKeys.length == 1){
      data.append("ProjectId",  projectKeys[0]);
    }
    else {
      data.append("ProjectId",  this.state.projectId);
    }
    data.append("TagIds", tagString);

    for (var i = 0; i < this.state.images.length; i++) {
      if(this.state.toggled){
        data.append("Note", this.state.note);
      } else{
        if(this.state.activeSlide == i){
          data.append("Note", this.state.note);
        } else {
          data.append("Note", notes[i]);
        }
        console.log("UPLOAD IMAGE - Note - "+notes[i]);
      }
      data.append('image', {
        uri: this.state.images[i].uri,
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
        console.log(tagObjValues[0].value);
        if(tagObjValues[0].value == 'success'){
        }
        else{
          this.setState({error: "Error in image "+(i-3)+", " +tagObjValues[1].value+ "\n"});
          //alert("Error in image "+i+", " +tagObjValues[1].value);
        }
        imagesUploaded++;
        console.log('imagesUploaded - '+ imagesUploaded + "  Count - "+ count);
        if(imagesUploaded == count){
          if(this.state.error){
            alert(this.state.error);
            this.setState({
              loading: false,
            });
          }
          else{
            if(count >1){
              alert("Documents were uploaded successfully");
            }
            else{
              alert(tagObjValues[1].value);
            }
            this.clear();
            this.goBack();
          }
        }
      }).catch((error) => {
        console.error(error);
      });
    }

  }
  clear(){
    this.setState({
      image: '',
      images : [],
      selectedItems : [],
      projectId: '',
      selectedValue: 'SELECT PROJECTS',
      tags:[],
      activeSlide: 0,
      loading: false,
      error: ''
    });
    projectValues=["Select Projects"];
    projectKeys=[999999];
    tagValues=[];
    tagKeys=[];
    projects=[];
    notes=[];
  }
}

const styles = {
  loggedIncontainer:
      {
        flex: 1,
        backgroundColor:'#fff',
      },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'space-between',
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
  avatar: {
    width: 200,
    height: 200
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
    backgroundColor: '#DDECF9',
    padding: 10,
    width: 300,
    height: 240,
    maxHeight:530,
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
  labelstyle: {
    paddingLeft:20,
    fontSize:10,
    flex:1
  },
  containerStyle:{
    height: 30,
    flex: 1,
    flexDirection:'row',
    alignItems: 'center'
  }

};
