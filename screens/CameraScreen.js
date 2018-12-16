import React,{ Component } from 'react';
import {SafeAreaView, Text, View, TouchableOpacity,Image,Dimensions, TouchableHighlight } from 'react-native';
import DocumentScanner from 'react-native-document-scanner';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MultipleImagePicker from 'react-native-image-crop-picker';
import { Header,Input, Button, Spinner, Card, CardSection} from '../components/common';
import Icon from 'react-native-ionicons';


import UploadScreen from './UploadScreen';
export default class CameraScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: {
      visible: false,
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imageTaken:false,
      flashEnabled: false,
      useFrontCam: false,
      uploadReady: null,
      images:[],
      activeSlide: 0,
      good_angle: false,
    };
  }
  componentDidUpdate(previmage){
    if (this.state.previmage !== this.state.image) {
        if(this.state.uploadReady){
          this.setState({ uploadReady: null,  })
          let imageTaken= [];
          imageTaken.push(this.state.image);
      }
    }
  }
//Document Scanner Functions
renderDetectionTypeText() {
  switch (this.state.lastDetectionType) {
    case 0:
      return "Correct rectangle found"
    case 1:
      return "Bad angle found";
    case 2:
      return "Rectangle too far";
    default:
      return "No rectangle detected yet";
  }
}
  renderDetectionTypeGoodAngle() {
    switch (this.state.lastDetectionType) {
      case 0:
        return (
          <View style={styles.cf_right_elements}>
            <Text style={{ fontSize: 14, color:'#35bf2f'}}> Good Angle </Text>
            <Image source={require('../assets/images/Camera_icons/thumbs-up-Active.png')}  />
            </View>
      );
      case 6:
        return (
          <View style={styles.cf_right_elements}>
            <Text style={{ fontSize: 14, color:'#c7c4c4'}}> Good Angle </Text>
            <Image source={require('../assets/images/Camera_icons/thumbs-up-Active.png')}  />
            </View>
      );
      default:
        return (
          <View style={styles.cf_right_elements}>
            <Text style={{ fontSize: 14, color:'#c7c4c4'}}> Good Angle </Text>
            <Image source={require('../assets/images/Camera_icons/thumbs-up.png')}  />
            </View>
      );
    }
  }
  renderDetectionTypeBadAngle() {
    switch (this.state.lastDetectionType) {
      case 0:
        return (
          <View style={styles.cf_right_elements}>
            <Text style={{ fontSize: 14, color:'#c7c4c4' }}> Bad Angle </Text>
            <Image source={require('../assets/images/Camera_icons/thumbs-down.png')}  />
            </View>
        );
        case 6:
          return (
            <View style={styles.cf_right_elements}>
              <Text style={{ fontSize: 14, color:'#c7c4c4' }}> Bad Angle </Text>
              <Image source={require('../assets/images/Camera_icons/thumbs-down.png')}  />
              </View>
          );
      default:
        return (
          <View style={styles.cf_right_elements}>
            <Text style={{ fontSize: 14, color:'#F80000' }}> Bad Angle </Text>
            <Image source={require('../assets/images/Camera_icons/thumbs-down-Active.png')}  />
            </View>
        );
    }
  }
  takePicture() {
    this.scan.capture();
    this.setState({stableCounter:0, lastDetectionType: 6});
  }
  //Document Scanner Functions END
  //Carousel Functions
  _renderItem ({item, index}) {
        return (
          <View style={{flex:1, position: 'relative', width: 60, height: 60, borderWidth: 1, borderColor: '#000'}}>
          <Image style={{width: 60, height: 80 }} source={item} />
      </View>
        );
    }
    get pagination () {
        const { images, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={images.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'rgba(255, 0, 100, 0)', marginLeft: 20}}
              dotStyle={{
                  width: 4,
                  height: 5,
                  borderRadius: 5,
                  marginHorizontal: 1,
                  backgroundColor: 'rgba(255, 0, 0, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.5}
              inactiveDotScale={0.9}
            />
        );
    }
    //Carousel Functions end
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
         for (var i = 0; i < images.length; i++) {
           let source = { uri: 'data:image/jpeg;base64,' + images[i].data };
           images[i]=source;
           this.setState({
             image: null,
             images: [...this.state.images, images[i]],
           });
         }
         this.setState({
           image: null,
         },
       );
       }).catch(e => alert(e));
     }

  render() {
    return (
      <SafeAreaView style={styles.loggedIncontainer}>
      <View style={styles.container}>
        <View style={styles.hb_container}>
          <View style={styles.hb_center}>
            <Text style={{ fontSize: 20, color: '#fff' }}> Take Picture </Text>
          </View>
          <TouchableOpacity style={styles.hb_left} onPress= {() => this.clear()}>
          <Icon name="arrow-round-back" style={{fontSize: 50, color: "#fff"}}></Icon>
          </TouchableOpacity>
        </View>
        <View style={styles.cs_container}>
          <TouchableOpacity style={styles.cs_left} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
          {(this.state.flashEnabled) ?
            <Image source={require('../assets/images/Camera_icons/flash-iconActive.png')}  /> :
            <Image source={require('../assets/images/Camera_icons/flash-icon.png')}  />
          }
          </TouchableOpacity>
          <TouchableOpacity style={styles.cs_right} onPress={() => this.setState({ useFrontCam: !this.state.useFrontCam })}>
            <Image source={require('../assets/images/Camera_icons/switch_camera-icon.png')}  />
          </TouchableOpacity>
        </View>
          {(!this.state.imageTaken) ?
        <View style={styles.c_container}>
          <DocumentScanner ref={ref => {
              this.scan = ref;
            }}
              useBase64
              onPictureTaken={(data) => {
                let source = { uri: 'data:image/jpeg;base64,' + data.croppedImage};
                  this.setState({ image: source,
                initialImage: data.initialImage,
                rectangleCoordinates: data.rectangleCoordinates,
                uploadReady:true,
                lastDetectionType: 6,
                imageTaken:true,
                stableCounter: 0,
              });
                }
              }
              overlayColor="rgba(206,180,180, 0.7)"
              enableTorch={this.state.flashEnabled}
              useFrontCam={this.state.useFrontCam}
              brightness={0.1}
              saturation={0}
              quality={0.8}
              contrast={1.2}
              onRectangleDetect={({ stableCounter, lastDetectionType }) => {
                if(!this.state.imageTaken){
                this.setState({ stableCounter, lastDetectionType })
                }
                else {
                this.setState({ stableCounter :0, lastDetectionType:6 })
                }
            }
            }
              detectionCountBeforeCapture={3}
              detectionRefreshRateInMS={80}
              style={styles.scanner}
        />
        </View> :
        <View style={styles.c_container}>
        <Image style={{width: "100%", height: "100%"}} source={this.state.image} resizeMode= "contain"/>
        <TouchableOpacity style={{position: 'absolute', left:'10%', bottom: '10%', }} onPress= {() => this.deleteImage()}>
            <Image  source={require('../assets/images/Camera_icons/cancel-icon.png')}  />
        </TouchableOpacity>
        <TouchableOpacity style={{position: 'absolute', right:'10%', bottom: '10%', }} onPress= {() => this.acceptImage()}>
            <Image  source={require('../assets/images/Camera_icons/check-icon.png')}  />
        </TouchableOpacity>

        </View>
      }
        <View style={styles.cf_container}>
          <View style={styles.cf_right}>
              {this.renderDetectionTypeGoodAngle()}
              {this.renderDetectionTypeBadAngle()}
          </View>
          <TouchableOpacity style={styles.cf_center} activeOpacity= {0.6} onPress={this.takePicture.bind(this)}>
            <Image style= {{width: '90%', height: '80%'}} source={require('../assets/images/Camera_icons/take_photo-icon.png')}  />
          </TouchableOpacity>
          <View style={styles.cf_left}>
          {
            (this.state.images.length > 0) ?
            <View style={styles.cf_left_imagebox}>
              <View style={styles.cf_left_imagecount}>
                <Text style={{color: "#F80000"}}> {this.state.images.length} </Text>
              </View>
              <View  style={{position: 'absolute',top:0 , justifyContent: 'center'}}>
              <Carousel
                 ref={(c) => { this._carousel = c; }}
                 data={this.state.images}
                 renderItem={this._renderItem}
                 sliderWidth={80}
                 itemWidth={50}
                 layout= 'stack'
                 onSnapToItem= {(index) =>{
                   this.setState({ activeSlide: index });
                 }
                 }
               />
               </View>
            </View> : <View />
        }
        </View>
        </View>
        <View style={styles.pf_container}>
          <TouchableOpacity style={styles.pf_left} onPress={this.pickMultiple.bind(this)}>
            <Text style={{color: "#fff", fontSize: 13}}> Select from Library </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pf_right} onPress={this.completeScanning.bind(this)}>
            <Text style={{color: "#fff"}}> Upload </Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    );
  }
  acceptImage(){
    this.setState({
      images: [...this.state.images, this.state.image],
      lastDetectionType: 2,
      imageTaken:false
});
  }
  deleteImage(){
    this.setState({
      lastDetectionType: 2,
      imageTaken:false
});
  }
  completeScanning(){
    this.props.navigation.navigate('Upload',{Image:this.state.image, Images: this.state.images})
  }
  clear(){
    this.setState({
      image: null,
      flashEnabled: false,
      useFrontCam: false,
      uploadReady: null,
      images:[],
      activeSlide: 0,
      good_angle: false,
    });
    this.props.navigation.navigate('Links');
}
}
const styles =  {
  loggedIncontainer:
      {
        flex: 1,
        backgroundColor:'#fff',
      },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
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
  //Camera Settings = cs
  cs_container: {
    height: '8%',
    backgroundColor: '#fff',
  },
  cs_left: {
    height: '100%',
    width: '20%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cs_right: {
    height: '100%',
    width: '20%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  // Camera = c
  c_container: {
    height: '62%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  c_bottom_left: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
  },
  c_bottom_right: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    bottom: 0,
  },
  scanner: {
    flex: 1,
    borderColor: 'orange',
    borderWidth: 1,
    alignSelf: 'stretch'
  },
  c_main: {},
  //Camera Functions = pf
  cf_container: {
    height: '12%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cf_left: {
    height: '100%',
    width: '30%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cf_left_imagebox: {
    height: '80%',
    width: '75%',
    left: 0,
    top: '10%',
    zIndex: 0
  },
  cf_left_imagecount: {
    postion: 'absolute',
    top: '-10%',
    right: '0%',
    alignSelf: 'flex-end',
    borderColor: '#365C80',
    borderWidth: 2,
    borderRadius: 100,
    zIndex: 1,
    backgroundColor: "#fff"
  },
  cf_center: {
    height: '100%',
    width: '20%',
    position: 'absolute',
    alignItems: 'center',
    bottom: '0%',
    top:'2%',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cf_right: {
    height: '100%',
    width: '30%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cf_right_elements: {
    height: '50%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
  },
  // Picture Functions= pf
  pf_container: {
    height: '10%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pf_left: {
    height: '60%',
    width: '45%',
    position: 'absolute',
    alignItems: 'center',
    left: '2%',
    backgroundColor: '#365C80',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  pf_right: {
    height: '60%',
    width: '45%',
    position: 'absolute',
    alignItems: 'center',
    right: '2%',
    backgroundColor: '#365C80',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 15,
  },
}
