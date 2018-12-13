import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import {Header, Button, Spinner, Card, CardSection} from '../components/common';


import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';
import UploadScreen from '../screens/UploadScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: ' ',
  tabBarIcon: ({ focused }) => (
    focused ? <Image
          source={require('../assets/images/Camera_icons/bell-notification-white.png')}
          style={{flex:1}}
        />
        :
        <Image
          source={require('../assets/images/Camera_icons/bell-notification.png')}
          style={{flex:1}}
        />
  ),
};

const LinksStack = createStackNavigator({
  Links: {
    screen: LinksScreen,
    navigationOptions: { tabBarLabel: ' '},
},
  Camera: CameraScreen,
  Upload: UploadScreen,
},
{
  initialRouteName: 'Links',
});

LinksStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {tabBarLabel: ' ', tabBarIcon: ({ focused }) => (
    focused ? <Image
          source={require('../assets/images/Camera_icons/camera-white.png')}
          style={{flex:1}}
        />
        :
        <Image
          source={require('../assets/images/Camera_icons/camera.png')}
          style={{flex:1}}
        />
  ),};

  if (routeName === 'Camera') {
    navigationOptions.tabBarVisible = false;
  }
  if (routeName === 'Upload') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: ' ',
  tabBarIcon: ({ focused }) => (
    focused ? <Image
          source={require('../assets/images/Camera_icons/setting-icon-white.png')}
          style={{flex:1}}
        />
        :
        <Image
          source={require('../assets/images/Camera_icons/setting-icon.png')}
          style={{flex:1}}
        />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
},
{
  initialRouteName: 'LinksStack',
  tabBarOptions: {style: {backgroundColor: '#365C80', paddingTop:'2%'}},
}
);
