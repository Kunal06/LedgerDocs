/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Image, Text, View, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentScanner from 'react-native-document-scanner';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      image: null,
      images: null,
      flashEnabled: false,
      useFrontCam: false,
      uploadReady: null,
    };
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
            console.log("CameraScreen - " + data.croppedImage);
              this.setState({ image: source,
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
          quality={0.5}
          contrast={1.2}
          onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })
        }
          detectionCountBeforeCapture={5}
          detectionRefreshRateInMS={50}
          style={styles.scanner}
        />
        <Image source={{ uri: `data:image/jpeg;base64,${this.state.image}`}} resizeMode="contain" />
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
  pickSingleWithCamera(cropping) {
   ImagePicker.openCamera({
     cropping: cropping,
     width: 500,
     height: 500,
     multiple: true,
     includeExif: true,
     includeBase64: true
   }).then(image => {
     console.log('received image', image);
     this.setState({
       image: {uri: image.path, width: image.width, height: image.height},
       images: null
     });
   }).catch(e => alert(e));
 }
 pickMultiple() {
    ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(images => {
      this.setState({
        image: null,
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        })
      });
    }).catch(e => alert(e));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => this.pickSingleWithCamera(true)}>
            <Text style={styles.textStyle}>Select Single</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={this.pickMultiple.bind(this)}>
            <Text style={styles.textStyle}>Select Multiple</Text>
        </TouchableOpacity>
        <View style={styles.container}>
        {this.renderCamera()}
      </View>
      </View>
    );
  }
  takePicture() {
    this.scan.capture();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
      backgroundColor: '#fff',
      borderRadius:5,
      borderWidth:1,
      borderColor:'#007aff',
      marginTop: 10,
    },
    left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  scanner: {
  flex: 1,
  width: 400,
  height: 200,
  borderColor: 'orange',
  borderWidth: 1
}
});
