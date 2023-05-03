import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScalePercent = (size) => (width / guidelineBaseWidth) * (guidelineBaseWidth * size / 100);
const verticalScalePercent = (size) => (height / guidelineBaseHeight) * (guidelineBaseHeight * size / 100);
const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale };