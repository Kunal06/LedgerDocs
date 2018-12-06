import React,{ Component } from 'react';
import { Text, View, TouchableOpacity,Image,Dimensions, TouchableHighlight } from 'react-native';
import DocumentScanner from 'react-native-document-scanner';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MultipleImagePicker from 'react-native-image-crop-picker';
import { Header,Input, Button, Spinner, Card, CardSection} from '../components/common';

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
      flashEnabled: false,
      useFrontCam: false,
      uploadReady: null,
      images:[],
      activeSlide: 0
    };
  }
  componentDidUpdate(previmage){
    console.log("length of images array - "+ this.state.images.length);
    if (this.state.previmage !== this.state.image) {
        console.log("Enter UploadScreen - - - " + this.state.image);
        if(this.state.uploadReady){
          this.setState({ uploadReady: null })
          let imageTaken= [];
          imageTaken.push(this.state.image);
      }
    }
  }
//Document Scanner Functions
  renderDetectionType() {
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
  takePicture() {
    this.scan.capture();
    this.setState({stableCounter:0});
  }
  //Document Scanner Functions END
  //Carousel Functions
  _renderItem ({item, index}) {
        return (
          <View style={styles.slide, {flex:1, width: 200, height: 200, alignItems: 'center', borderWidth: 1, borderColor: '#000'}}>
          <Image style={{width: 200, height: 200 }} source={item} />
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
         console.log("multiple images - " + images.length);
         for (var i = 0; i < images.length; i++) {
           let source = { uri: 'data:image/jpeg;base64,' + images[i].data };
           console.log("CDU - " + source.uri);
           images[i]=source;
         }
         this.setState({
           image: null,
           images: images,
         },
       );
       }).catch(e => alert(e));
     }
  renderCamera() {
      return (
        <View style={styles.container}>
        <DocumentScanner ref={ref => {
          this.scan = ref;
        }}
          useBase64
          onPictureTaken={(data) => {
            let source = { uri: 'data:image/jpeg;base64,' + data.croppedImage};
            console.log('PICTURE TAKEN FROM DOCUMENT SCANNER');
            //console.log("CameraScreen - " + data.croppedImage);

              this.setState({ image: source,
                images: [...this.state.images, source],
            initialImage: data.initialImage,
            rectangleCoordinates: data.rectangleCoordinates,
            uploadReady:true
          });
              //this.props.navigation.push({ title: 'Upload Image', screen: "Upload", imageuri: `data:image/jpeg;base64,${this.state.image}`});
            }
          }
          overlayColor="rgba(255,130,0, 0.7)"
          enableTorch={this.state.flashEnabled}
          useFrontCam={this.state.useFrontCam}
          brightness={0.1}
          saturation={0}
          quality={0.8}
          contrast={1.2}
          onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
          detectionCountBeforeCapture={5}
          detectionRefreshRateInMS={100}
          captureMultiple= {true}
          style={styles.scanner}
        />
        <Image source={{ uri: `data:image/jpeg;base64,${this.state.image}`}} resizeMode="contain" />
        <TouchableOpacity style={[styles.button, styles.left]} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
          <Text>📸 Flash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.right]} onPress={() => this.setState({ useFrontCam: !this.state.useFrontCam })}>
          <Text>📸 Front Cam</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottom]} onPress={this.takePicture.bind(this)}>
          <Text> Take Picture </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomRight]} onPress={this.completeScanning.bind(this)}>
          <Text> Done </Text>
        </TouchableOpacity>
        <View style={[styles.bottomLeft]} >
        {   this.state.images.length == 0 ?
          <TouchableOpacity style={styles.selectImages} onPress={this.pickMultiple.bind(this)}>
          <Text> Select Images from Library </Text>
          </TouchableOpacity>:
          <View  style={{height: 180, alignItems: 'center', marginBottom:-40 }}>

          <Carousel
             ref={(c) => { this._carousel = c; }}
             data={this.state.images}
             renderItem={this._renderItem}
             sliderWidth={60}
             itemWidth={60}
             layout= 'default'
             onSnapToItem= {(index) =>{
               console.log("Activeslide - "+ index);
               this.setState({ activeSlide: index });
             }
             }
           />
           { this.pagination }
           </View>
        }

        </View>
        <Text style={styles.instructions}>
          ({this.state.stableCounter || 0} correctly formated rectangle detected
        </Text>
        <Text style={styles.instructions}>
          {this.renderDetectionType()}
        </Text>
      </View>
      );
  }
  render() {
    return (
      <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.left]} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
        <Text>📸 Flash</Text>
      </TouchableOpacity>

        {this.renderCamera()}
        {console.log(this.state.uploadReady)}
      </View>
    );
  }
  completeScanning(){
    console.log("length of images array - "+ this.state.images.length);
    this.props.navigation.navigate('Upload',{Image:this.state.image, Images: this.state.images})
  }
}
const styles ={
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 20,
    bottom: 20,
    height: 40,
    width: 120,
    backgroundColor: '#FFF',
  },
  bottom: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 45,
    height: 40,
    width: 120,
    backgroundColor: '#FFF'
  },
  bottomRight: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 45,
    right: 10,
    height: 40,
    width: 80,
    backgroundColor: '#FFF'
  },
  bottomLeft: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 45,
    left: 20,
    height: 100,
    width: 100,
  },
  top: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 30,
    height: 40,
    width: 120,
    backgroundColor: '#FFF'
  },
  topLeft: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 20,
    left: 20,
    height: 100,
    width: 100,
  },
  left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  scanner: {
    flex: 1,
    width: 400,
    height: 200,
    borderColor: 'orange',
    borderWidth: 1
  },
  selectImages: {
    alignSelf:'center',
    textAlign: 'center',
    justifyContent: 'center',
    color:'#007aff',
    fontSize:16,
    fontWeight: '600',
    height : 100,
    width : 100,
    borderRadius:5,
    borderWidth:1,
    borderColor:'#007aff',
    backgroundColor: '#FFF'

  },
}
