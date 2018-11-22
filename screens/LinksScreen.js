import React from 'react';
import { Alert,AsyncStorage, TouchableOpacity,ScrollView, StyleSheet, Text, View, Image, PixelRatio } from 'react-native';
import {Header, Button, Spinner, Card, CardSection} from '../components/common';
import Icon from 'react-native-ionicons';

import UploadScreen from './UploadScreen';
import ImagePicker from 'react-native-image-picker';
import MultipleImagePicker from 'react-native-image-crop-picker';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a Photo',
  chooseFromLibraryButtonTitle: 'Select from Library',
  quality:1,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class LinksScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
    this.state = {
      images : [],
      status:''
    };
  }
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('UploadReady');
    console.log(userToken);
}
  static navigationOptions = {
    header: <Header headText="Take Picture"> </Header>,
  };
state = {
    imageSource: null,
    videoSource: null,

  };
  selectPhotoTapped() {
    const options = {
      quality: 10.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        //let source = { uri: response.uri };

        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("imagePicker image - "+ source.uri);
        let imagechosen=[];
        imagechosen.push(response);
        this.setState({
          imageSource: source,
          images: imagechosen
        });
      }
    });
  }
  componentDidUpdate(previmages){
    if (this.state.previmages !== this.state.images) {
      let imagesUri=[];
      for (var i = 0; i < this.state.images.length; i++) {
        let source = { uri: 'data:image/jpeg;base64,' + this.state.images[i].data };
        console.log("CDU - " + source.uri);
        imagesUri.push(source);
      }
      this.props.navigation.navigate('Upload',{Image: this.state.imageSource, Images: imagesUri})
    }
  }
  pickMultiple() {
     MultipleImagePicker.openPicker({
       cropping: true,
       includeBase64: true,
       multiple: true,
       waitAnimationEnd: false,
       forceJpg: true,
       smartAlbums: ['RecentlyAdded','Screenshots',],
       showsSelectedCount: true

     }).then(images => {
       console.log("multiple images - " + images.length);
       this.setState({
         image: null,
         images: images,
       });
     }).catch(e => alert(e));
   }
  render() {
    return (
      <View style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
           <View>
           <TouchableOpacity style={styles.content} onPress={this.selectPhotoTapped.bind(this)} >
             <Icon name="md-camera" size={300} color="black" />
           </TouchableOpacity>
           </View>
           <View style= {{top:0, bottom:0, marginBottom:70}}>
            <Text> or </Text>
           </View>
           <View style={styles.buttonStyle} >
           <TouchableOpacity style={{ alignItems:'stretch',}} onPress={() => this.props.navigation.navigate('Camera',{Image: this.state.imageSource})}>
           <Text style={styles.textStyle}> Scan Multiple Documents </Text>
       </TouchableOpacity>
       </View>
       <View style= {{top:0, bottom:0, marginBottom:70}}>
        <Text> or </Text>
       </View>
       <View style={styles.buttonStyle} >
       <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
           <Text style={styles.textStyle}>Select Multiple Images</Text>
       </TouchableOpacity>
       </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    // justifyContent: 'center',
  },
  heading: {
    //flex: 2,
    fontSize: 20,
  },
  content: {
    //flex: 8,
    fontSize: 20,
  },
  vi: {
  //  height: 15,
  },
  submitButton: {
    //flex: 3,
    height: 5,
    flexDirection: 'row',
    justifyContent:'flex-end',
    bottom: 0,
},
buttonImagePicker: {
  width: 250,
  height: 50,
  backgroundColor: '#330066',
},
image: {
  width:200,
  height:200,
  marginTop: 30,
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
    bottom:60,
    backgroundColor: '#fff',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#007aff',
  }

});
