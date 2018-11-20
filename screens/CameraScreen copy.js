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
  state = {
    hasCameraPermission: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      flashEnabled: false,
      useFrontCam: false,
      uploadReady: null,
    };
  }
  componentDidUpdate(previmage){
    if (this.state.previmage !== this.state.image) {
      this.props.navigation.navigate('Upload',{Image: 'data:image/jpeg;base64,'+ this.state.image})
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
    if(this.state.image){
      return (
        <View style={styles.container}>
        <Image style={{ flex: 1, width: 300, height: 200 }} source= {{ uri: 'data:image/jpeg;base64,' + this.state.image }} resizeMode="contain" />
        <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ image: null })} >
          <Text>Take another picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ uploadReady: true })}>
          <Text>Upload</Text>
        </TouchableOpacity>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
        <DocumentScanner ref={ref => {
          this.scan = ref;
        }}
          useBase64
          captureMultiple = {true}
          onPictureTaken={(data) => {

            let source = { uri: 'data:image/jpeg;base64,' + data.croppedImage};
            console.log('camera screen = ' + source);
              this.setState({ image: source,
            initialImage: data.initialImage,
            rectangleCoordinates: data.rectangleCoordinates, });
              //this.props.navigation.push({ title: 'Upload Image', screen: "Upload", imageuri: `data:image/jpeg;base64,${this.state.image}`});
            }
          }
          overlayColor="rgba(255,130,0, 0.7)"
          enableTorch={this.state.flashEnabled}
          useFrontCam={this.state.useFrontCam}
          brightness={0.2}
          saturation={0}
          quality={0.5}
          contrast={1.2}
          onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter: 1, lastDetectionType })}
          detectionCountBeforeCapture={10}
          detectionRefreshRateInMS={50}
          style={styles.scanner}
        />
        <TouchableOpacity style={[styles.button, styles.left]} onPress={() => this.setState({ flashEnabled: !this.state.flashEnabled })}>
          <Text>📸 Flash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.right]} onPress={() => this.setState({ useFrontCam: !this.state.useFrontCam })}>
          <Text>📸 Front Cam</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.bottom]} onPress={this.takePicture.bind(this)}>
          <Text> Take Picture </Text>
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
  }
  renderUploadScreen(){
    if(this.state.uploadReady){
      return (
        <View style={styles.container}>
        <TouchableOpacity style={[styles.button, styles.bottom]} >
          <Text> Ready to upload </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newPic} onPress={() => this.setState({ image: null, uploadReady: null })} >
          <Text>Take another picture</Text>
        </TouchableOpacity>
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          {this.renderCamera()}
        </View>
      );
    }
  }


  render() {
    return (
      <View style={styles.container}>
        {this.renderUploadScreen()}
        {console.log(this.state.uploadReady)}
      </View>
    );
  }
  takePicture() {
    this.scan.capture();
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
    bottom: 20,
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
