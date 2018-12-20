import React, { Component } from 'react';
import {SafeAreaView, Picker, Switch, KeyboardAvoidingView, ActivityIndicator,AsyncStorage,PixelRatio, Alert, TouchableOpacity,ScrollView, StyleSheet, Text, View, Image, TextInput, PickerItemIOS } from 'react-native';
import { Header,Input, Button, Spinner, Card, CardSection, TextArea} from '../components/common';
import Icon from 'react-native-ionicons';
import IOSPicker from 'react-native-ios-picker';
import MultiSelect from 'react-native-multiple-select';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import InputScrollView from 'react-native-input-scroll-view';

const serverURL = "https://app.ledgerdocs.com/index.php/iphone/";
//const serverURL = "https://migration.ledgersonline.com/index.php/Iphone/";
import FormData from 'FormData';
var XMLParser = require('react-xml-parser');
import LinksScreen from './LinksScreen';
var projectValues=["Select Projects"];
var projectKeys=[9999999];
var tagValues=["Select Tags"];
var tagKeys=[9999999];
var projects=[];
var notes = [];

//let tags=[];
export default class UploadScreen extends React.Component {
    state = { email: '', password: '', note: ''};
  constructor(props){
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
  }
  static navigationOptions = {
    header: null,
  };
  _bootstrapAsync = async () => {
    const currentUser = JSON.parse (await AsyncStorage.getItem('User'));

    this.setState({
      email: currentUser.user_name,
      password: currentUser.password,
    });

    this.loadProjects();
  };
  componentDidMount() {
    this.loadTags.bind(this);
  }
  _renderItem ({item, index}) {
        return (
          <View style={styles.slide, {flex:1, width: 200, height: 180, alignItems: 'center',}}>
          <Image style={styles.avatar, {width: 200, height: 180 }} source={item} />
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
                  marginHorizontal: 0,
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
          <TouchableOpacity style={styles.pf_right} onPress={this.uploadImage.bind(this)} >
          <Spinner size= 'large' />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={styles.pf_right} onPress={this.uploadImage.bind(this)} >
          <Text style={{color: "#fff"}}> Upload Image </Text>
        </TouchableOpacity>
      );
    }
  render() {
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


          <ScrollView  style={{backgroundColor:'#fff', flex:1, color: "#365C80"}}>
          <InputScrollView
          ref={(scrollView) => { this.scrollView = scrollView }}
          keyboardOffset ={0}
          >

            <View style={styles.container}>


                 <View  style={{width: 300, marginBottom: 0, marginTop: 5, alignItems: 'center', height: 220 }}>
                   <Carousel
                      ref={(c) => { this._carousel = c; }}
                      data={this.state.images}
                      renderItem={this._renderItem}
                      sliderWidth={350}
                      itemWidth={200}
                      layout= 'default'
                      removeClippedSubviews={false}
                      onSnapToItem= {(index) =>{
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



                 <View style={styles.componentscontainer}>

                    <View style={{flex: 1, height: 40, alignItems: 'center', backgroundColor: '#fff',marginBottom: 5}}>
                     <IOSPicker
                     style= {{width: 300, height:20, borderRadius:8,
                     borderWidth: 1, borderColor: '#365C80'}}
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

                   <View style={styles.multi}>
                       <MultiSelect
                         items={this.state.tags}
                         uniqueKey="id"
                         ref={(component) => { this.multiSelect = component }}
                         onSelectedItemsChange={this.onSelectedItemsChange.bind(this)}
                         selectedItems={this.state.selectedItems}
                         selectText=" Select Tags "
                         searchInputPlaceholderText="Search Tags..."
                         onChangeInput={ (text)=> console.log(text)}
                         tagTextColor="#000"
                         selectedItemTextColor="#365C80"
                         selectedItemIconColor="#365C80"
                         itemTextColor="#c7c4c4"
                         displayKey="val"
                         searchInputStyle={{ color: '#CCC', borderBottomWidth: 1, borderBottomColor: "#365C80", }}
                         submitButtonColor="#89B0D6"
                         submitButtonText="Done"
                         hideSubmitButton ={false}
                         autoFocusInput= {false}
                         tagBorderColor= {'#365C80'}
                         tagRemoveIconColor ={'#365C80'}
                         fixedHeight= {true}
                       />
                       <View style= {{padding:10, height: 10}}>
                       {
                         this.multiselect
                         ?
                         this.multiSelect.getSelectedItemsExt(this.state.selectedItems)
                         :
                         null
                       }
                       </View>
                  </View>


                  <Card>
                  <View style={styles.cardContainerStyle}>
                  <View style= {{flex: 1, flexDirection: 'row', textAlign: 'left', alignItems: 'center'}}>
                  <Text style= {styles.labelstyle,{fontSize: 14}}>
                    Add Note
                  </Text>
                  </View>
                  <View style= {{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',textAlign: 'left'}}>
                        <Text style= {{fontSize: 10,}}>
                          Use for all images
                        </Text>
                    <View style= {{alignSelf: 'flex-end',  marginLeft: 20}}>
                        <Switch
                        onValueChange={ (value) => {
                          this.setState({ toggled: value });
                          notes[this.state.activeSlide] = this.state.note;
                        }}
                        style={{ transform: [{ scaleX: .5 }, { scaleY: .5 }] }}
                        value={ this.state.toggled }
                        thumbColor= '#000'
                        />
                    </View>
                      </View>
                    </View>

                  <View style={{ width: 300,height: 60,
                         borderWidth: 1, borderColor: '#365C80', borderRadius: 8, marginBottom: 10}}>
                      <TextInput
                        multiline = {true}
                        numberOfLines = {4}
                        value = {this.state.note}
                        onChangeText={this.handleTextInput.bind(this)}
                        editable = {true}
                        maxLength = {60}
                        placeholder= "Add your note here"
                        spellCheck={true}
                        placeholderTextColor= {'#365C80'}
                        blurOnSubmit
                        />
                    </View>
                    </Card>
          </View>
          </View>
          </InputScrollView>
          </ScrollView>
      <View style={styles.bb_container}>
        <TouchableOpacity style={styles.pf_left} onPress={this.goBack}>
          <Text style={{color: "#fff", fontSize: 15}}> Start Again </Text>
        </TouchableOpacity>
          {this.renderButton()}
      </View>
      </SafeAreaView>


    );
  }

  handleTextInput= note => {
    //new
    this.setState({note: note,});
    if(!this.state.toggled){
      notes[this.state.activeSlide] = this.state.note;
  }
  }
  change(d, i) {
    this.setState({
      selectedValue: d,
      projectId: projectKeys[i],
    },
   this.loadTags.bind(this)
);

  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  goBack = async () => {
    this.clear();
    this.props.navigation.navigate('Links');
  };

  loadProjects(){
    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    fetch(serverURL+'getProjects_React', {
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
        let keyvalitem = {
          id: projectsObjKey[i].value,
          val: projectsObj[i].value
        }
        projects.push(keyvalitem);
      }
    }
      this.setState({
        selectedItems:[],
      });
    }).catch((error) => {
      console.error(error);
    });
  }
  loadTags(){

    const data = new FormData();
    data.append("user_name",  this.state.email);
    data.append("password",  this.state.password);
    let projID = this.state.projectId;
    if (projectKeys.length ==1){
      projID= projectKeys[0];
    }

    fetch(serverURL+'getTags_React/'+ projID, {
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
      this.setState({
        tags:[],
      });
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
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  uploadImage(){
    this.setState({error: '', loading: true});

    let tagString='';
    let count = this.state.images.length;
    let imagesUploaded = 0;
    for (let tag of this.state.selectedItems) {
      tagString += tag+',';
    }
    tagString= tagString.substring(0, tagString.length - 1);

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
      }
      data.append('image', {
        uri: this.state.images[i].uri,
        type: 'image/jpeg', // or photo.type
        name: 'test'+ new Date().toLocaleString() + '.jpeg'
      });
      fetch(serverURL+'upload_React', {
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
       let tagObjKeys= xml.getElementsByTagName('key');
        let tagObjValues= xml.getElementsByTagName('String');
        if(tagObjValues[0].value == 'success'){
        }
        else{
          this.setState({error: "Error in image "+(i-3)+", " +tagObjValues[1].value+ "\n"});
        }
        imagesUploaded++;
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
    this.timeoutHandle = setTimeout(()=>{
              this.setState({
                loading: false,
              });
         }, 1000);


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
     zIndex: 2
  },
  componentscontainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'space-between',
  },
  cardContainerStyle:  {
    padding: 5,
    backgroundColor :'#fff',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
     maxHeight:200 ,
     zIndex: 6
  },
  //HeaderBanner = hb
  hb_container: {
    height: '8%',
    backgroundColor: '#365C80',
  },
  cardDectionStyle:  {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor :'#fff',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    alignItems: 'center',
     maxHeight:200 ,
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
    backgroundColor: '#fff',
    marginBottom: 5,
    width: 300,
    height: 235,
    maxHeight: 235,
    zIndex: 5,
    paddingTop: 5,
    borderWidth: 1, borderColor: "#365C80",borderRadius:8
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
    alignItems: 'flex-start'
  },
  inputStyle:{
    flex: 1,
    flexDirection:'column',
    color: "#365C80",
    fontSize:18,
    backgroundColor: '#fff',
    width: 300,
    height: 60,
    borderRadius: 8
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
  // Picture Functions= pf
  pf_container: {
    height: '15%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9
  },
  pf_left: {
    height: '70%',
    width: '45%',
    position: 'absolute',
    alignItems: 'center',
    left: '2%',
    backgroundColor: '#365C80',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  pf_right: {
    height: '70%',
    width: '45%',
    position: 'absolute',
    alignItems: 'center',
    right: '2%',
    backgroundColor: '#365C80',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
  },
  bb_container: {
    height: '7%',
    backgroundColor: '#fff',
  },
  bb_left: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    bottom:0,
    left: '5%',
    backgroundColor: '#365C80',
    borderRadius: 25
  },
  bb_right: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '5%',
    bottom: 0,
    right: '5%',
    backgroundColor: '#365C80',
    borderRadius: 10
  },

};
