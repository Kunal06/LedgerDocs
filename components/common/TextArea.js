import React from 'react';
import { TextInput,Text, View } from 'react-native';

const TextArea = ({label,value,onChangeText,placeholder,secureTextEntry}) => {
  const {inputStyle, labelstyle,containerStyle} = styles;
return (

  <View style= {containerStyle}>
    <Text style= {labelstyle}>
      {label}
    </Text>
    <TextInput
      multiline = {true}
      numberOfLines = {4}
      spellCheck={true}
      secureTextEntry= {secureTextEntry}
      placeholder= {placeholder}
      autoCorrect={false}
      style= {inputStyle}
      value = {value}
      onChangeText = {onChangeText}
      />
  </View>
  );
};

const styles ={
  inputStyle:{
    color: "#365C80",
    paddingRight:5,
    paddingLeft:5,
    fontSize:18,
    lineHeight:0,
    flex:2,
    borderWidth: 0.5,
    borderColor: "#000",
    alignSelf: "stretch",
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  labelstyle: {
    paddingLeft:0,
    paddingVertical:10,
    fontSize:18,
    flex:1,
    color: "#365C80"
  },
  containerStyle:{
    height: 80,
    flex: 1,
    flexDirection:'column',
    alignItems: 'flex-start'
  }

}

export { TextArea };
/*
flex is like a ration of space allocated in a Component
*/
