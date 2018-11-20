import React,{ Component } from 'react';
import { Text, View, TouchableOpacity,Image,Dimensions, TouchableHighlight } from 'react-native';
import DocumentScanner from 'react-native-document-scanner';

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
    };
  }
  componentDidUpdate(previmage){
    console.log("length of images array - "+ this.state.images.length);
    if (this.state.previmage !== this.state.image) {
        console.log("Enter UploadScreen - - - " + this.state.image);
        if(this.state.uploadReady){
          this.setState({ uploadReady: null })
          //console.log(" Before UploadScreen Update UploadReady " + this.state.uploadReady);
          let imageTaken= [];
          imageTaken.push(this.state.image);
          //this.props.navigation.navigate('Upload',{Image:this.state.image, Images: imageTaken})
      }
    }
  }

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
          brightness={0.2}
          saturation={0}
          quality={0.2}
          contrast={1.2}
          onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
          detectionCountBeforeCapture={5}
          detectionRefreshRateInMS={50}
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
        {this.renderCamera()}
        {console.log(this.state.uploadReady)}
      </View>
    );
  }
  takePicture() {
    this.scan.capture();
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
  newPic: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
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
  left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
  }
}
