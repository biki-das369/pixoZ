import React from 'react';
import { Pressable, StyleSheet, Image ,push} from 'react-native';
import { getImageSize } from '../helpers/common';  // Ensure this path is correct
import { theme } from '../constants/theme';
import {wp} from '../helpers/common'

const ImageCard = ({ item,index,columns ,router}) => {

    const isLastInRow = ()=>{
        return(index+1) % columns === 0;
    }

    // Get the image dimensions
    const getImageHeight = () => {
        const { imageHeight :height, imageWidth:width} = item;
        return { height: getImageSize(height, width) };
    };

    // Get image URL or default to a placeholder if unavailable
    const imageUrl = item?.webformatURL || 'https://via.placeholder.com/150';

    return (
        <Pressable onPress={()=> router.push({pathname:'home/image',params: {...item}})} style={[styles.container , !isLastInRow()&& styles.spacing]}>
            <Image
                style={[styles.image, getImageHeight()]}
                source={{ uri: imageUrl }}
               // resizeMode="cover" // Optional: adjust as needed
               transition={100}
            />
        </Pressable>
    );
};

export default ImageCard;

const styles = StyleSheet.create({
    container: {
       // marginBottom: 10, // Adjust spacing as needed
       backgroundColor:theme.colors.grayBG,
       borderRadius:theme.radius.xs,
       borderCurve:'continuous',
       overflow:'hidden',
       marginBottom:wp(2),

    },
    image: {
        width: '100%',
        // Height will be dynamically set by getImageHeight()
    },
    spacing:{
        marginRight:wp(2)
    }
});
