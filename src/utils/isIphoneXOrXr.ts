import {Platform, Dimensions} from 'react-native'

const IPHONE_X_WIDTH = 375
const IPHONE_X_HEIGHT = 812
const IPHONE_XR_WIDTH = 414
const IPHONE_XR_HEIGHT = 896

const {width: screenWidth, height: screenHeight} = Dimensions.get('window')

export const isIphoneXOrXr = () =>
  (Platform.OS === 'ios' &&
    ((screenHeight === IPHONE_X_HEIGHT && screenWidth === IPHONE_X_WIDTH) ||
      (screenHeight === IPHONE_X_WIDTH && screenWidth === IPHONE_X_HEIGHT))) ||
  ((screenHeight === IPHONE_XR_HEIGHT && screenWidth === IPHONE_XR_WIDTH) ||
    (screenHeight === IPHONE_XR_WIDTH && screenWidth === IPHONE_XR_HEIGHT))
