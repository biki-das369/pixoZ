import { Dimensions } from 'react-native';

// Get the current screen size (width and height)
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// Convert a given width percentage to the corresponding pixel value
export const wp = (percentage) => {
    return (percentage * deviceWidth) / 100;
};

// Convert a given height percentage to the corresponding pixel value
export const hp = (percentage) => {
    return (percentage * deviceHeight) / 100;
};

// Determine the number of columns based on screen width
export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        // Desktop
        return 4;
    } else if (deviceWidth >= 768) {
        // Tablet
        return 3;
    } else {
        // Mobile
        return 2;
    }
};

// Get image size based on width and height
export const getImageSize = (height, width) => {
    if (width > height) {
        // Landscape
        return 250;
    } else if (width < height) {
        // Portrait
        return 300;
    } else {
        // Square
        return 200;
    }
};

export const capitalize = str =>{
    return str.replace(/\b\w/g, l => l.toUpperCase())
}