import React from 'react';
import { TextInput,Text, View } from 'react-native';

const Input = ({label,value,onChangeText,placeholder,secureTextEntry}) => {
  const {inputStyle, labelstyle,containerStyle} = styles;
return(
  <View style= {containerStyle}>
    <Text style= {labelstyle}>
      {label}
    </Text>
    <TextInput
      secureTextEntry= {secureTextEntry}
      placeholder= {placeholder}
      autoCorrect={false}
      autoCapitalize = 'none'
      style= {inputStyle}
      value = {value}
      onChangeText = {onChangeText}
      />

  </View>
  );
};

const styles ={
  inputStyle:{
    color:'#000',
    paddingRight:5,
    paddingLeft:5,
    fontSize:18,
    lineHeight:23,
    flex:2
  },
  labelstyle: {
    paddingLeft:20,
    fontSize:18,
    flex:1
  },
  containerStyle:{
    height: 40,
    flex: 1,
    flexDirection:'row',
    alignItems: 'center'
  }

}

export { Input };
/*
flex is like a ration of space allocated in a Component
*/
