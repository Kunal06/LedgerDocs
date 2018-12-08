// import libraries for making a Component
import React from 'react';
import {SafeAreaView, Text, View } from 'react-native';

// Make a Component
const Header= (props) => {
  const {textStyle, viewStyle} = styles;

  return (
  <SafeAreaView style= {viewStyle} >
    <Text style= {textStyle}>   {props.headText}
    </Text>
  </SafeAreaView>
);
};

const styles ={
  viewStyle: {
    backgroundColor:'#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    shadowColor: '#000000',
    shadowOffset: {width:0, height:5},
    shadowOpacity: 0.3,
    elevation: 2,
    position: 'relative',
    alignSelf: 'stretch'
  },
  textStyle:{
    fontSize:20
  }
};


// Make the Component available to other parts of the app
export {Header};
