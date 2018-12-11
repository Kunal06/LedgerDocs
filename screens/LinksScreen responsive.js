import React from 'react';
import { SafeAreaView, Alert,AsyncStorage, TouchableOpacity,ScrollView, StyleSheet, Text, View, Image, PixelRatio } from 'react-native';
import {Header, Button, Spinner, Card, CardSection} from '../components/common';
import Icon from 'react-native-ionicons';

import UploadScreen from './UploadScreen';
import ImagePicker from 'react-native-image-picker';
import MultipleImagePicker from 'react-native-image-crop-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
    header: null,
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
        //console.log("CDU - " + source.uri);
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
     }).catch(e => console.log(e));
   }
  render() {
    return (
      <SafeAreaView style={styles.loggedIncontainer}>
      <View style={styles.container}>
        <View style={styles.hb_container}>
          <View style={styles.hb_center}>
            <Text style={{ fontSize: 23, color: '#fff' }}> Take Picture </Text>
          </View>
          <TouchableOpacity style={styles.hb_left} onPress= {() => this.props.navigation.navigate('Links')}>
          <Icon name="arrow-round-back" style={{fontSize: 50, color: "#fff"}}></Icon>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.si_container} onPress={this.selectPhotoTapped.bind(this)}>
        <Image source={require('../assets/images/Camera_icons/cam.png')} style= {{position: 'absolute',
        top: hp('3%'),width: wp("19%"), height: hp('8%')}} />
        <View style={styles.si_text_container}>
        <Text style= {{fontSize: 23, color: '#365C80'}}> Take Single Photo </Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cs_container} onPress={() => this.props.navigation.navigate('Camera',{Image: this.state.imageSource})}>
        <Image source={require('../assets/images/Camera_icons/camera-borders.png')} style= {{position: 'absolute',
        top: '10%',width: '18%', height: '50%'}} />
        <View style={styles.cs_text_container}>
        <Text style= {{fontSize: 23, color: '#365C80'}}> Scan Documents </Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.c_container} onPress={this.pickMultiple.bind(this)}>
        <Image source={require('../assets/images/Camera_icons/select_images.png')} style= {{position: 'absolute',
        top: '10%',width: '18%', height: '32%'}} />
        <View style={styles.c_text_container}>
        <Text style= {{fontSize: 23, color: '#365C80'}}> Select Images </Text>
        </View>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  loggedIncontainer:
      {
        flex: 1,
        backgroundColor:'#fff',
      },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  //HeaderBanner = hb
  hb_container: {
    height: hp('8%'),
    backgroundColor: '#365C80',
  },
  hb_left: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: wp('5%'),
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
  //Single Image = si
  si_container: {
     height: hp('18%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  si_text_container: {
    height: hp('5%'),
    position: 'absolute',
    bottom: hp('0%')
  },
  //Camera Settings = cs
  cs_container: {
    height: hp('20%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    },
  cs_text_container: {
    height: hp('10%'),
    position: 'absolute',
  },
  // Camera = c
  c_container: {
    height: hp('30%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  c_text_container: {
    height: hp('20%'),
    position: 'absolute',
    bottom: hp('20%')
  }
});