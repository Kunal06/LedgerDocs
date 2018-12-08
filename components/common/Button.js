import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const Button= ({Pressed, children}) => {
  const {buttonStyle,textStyle} = styles;

  return (
    <TouchableOpacity onPress={Pressed} style={buttonStyle}>
      <Text style={textStyle}> {children}</Text>
    </TouchableOpacity>

  );
};
const styles = {
  textStyle: {
alignSelf:'center',
color:'#fff',
fontSize:16,
fontWeight: '600',
paddingTop:10,
paddingBottom:10

  },
  buttonStyle: {
    flex:1,
    alignSelf: 'stretch',
    backgroundColor: '#365C80',
    borderRadius:5,
    borderWidth:1,
    marginLeft:'5%',
    marginRight:'5%',
    justifyContent: 'center',
    height: '50%'
  }
};
export {Button};
{
  /*
  export {Button: Button}; Key is equal to value so^^
export default Button; cant use default when using index
*/
}
