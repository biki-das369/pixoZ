import { Pressable, StyleSheet, Text, View } from 'react-native'
//import React from 'react'
import React,{useMemo} from 'react';
import {
    BottomSheetModal,
    BottomSheetView,  
    /** BottomSheetModalProvider,
    snapPoints,
    handleSheetChanges */
  } from '@gorhom/bottom-sheet';
  import { BlurView } from 'expo-blur';
import { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
//import { AnimatedView } from 'react-native-reanimated/lib/typescript/reanimated2/component/View';
import Animated from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';
import { ColorFilter, CommonFilterRow, SectionView } from './filterViews';
import { capitalize } from 'lodash';
import { data } from '../constants/data';
const FiltersModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters
}) => {

    // variables
  const snapPoints = useMemo(() => ['75%'], []);
  return (
    <BottomSheetModal
    ref={modalRef}
    index={0}
    snapPoints={snapPoints}
    enablePanDownToClose = {true}
    backdropComponent={CustomBackrop} 
   // onChange={handleSheetChanges}
    >
        <BottomSheetView style={styles.contentContainer}>
          <View style = {styles.content}>
            <Text style = {styles.filterText}>Filters</Text>
            {
              Object.keys(sections).map((sectionName, index)=>{
                let sectionView = sections[sectionName];
                let sectionData = data.filters[sectionName]
                let title = capitalize(sectionName);
                
                return(
                  <Animated.View
                   entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                   key={sectionName}>
                    <SectionView
                      title = {title}
                      content = {sectionView({
                        data: sectionData,
                        filters,
                        setFilters,
                        filterName: sectionName,

                      })}
                    />

                  </Animated.View>
                )
              })
            }
            {/**actions */}
            <Animated.View
              entering={FadeInDown.delay(500).springify().damping(11)}
              style={styles.buttons}>
              <Pressable style={styles.resetButton} onPress={onReset}>
                  <Text style={[styles.buttonTex,{color:theme.colors.neutral(0.9)}]}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={onApply}>
                  <Text style={[styles.buttonTex,{color:theme.colors.white}]}>Apply</Text>
              </Pressable>
            </Animated.View>
          </View>
        </BottomSheetView>
  </BottomSheetModal>
  )
}

const sections ={
  "order": (props)=><CommonFilterRow {...props}/>,
  "orientation": (props)=><CommonFilterRow {...props}/>,
  "type": (props)=><CommonFilterRow {...props}/>,
  "colors": (props)=><ColorFilter {...props}/>
}




const CustomBackrop = ({animatedIndex, style})=>{

   /* const containerAnimatedStyle = useAnimatedStyle(()=>{
      let opacity = interpolate(
        animatedIndex.value,
        [-1, 0]
        [0,1],
        Extrapolation.CLAMP
      )
      return {
        opacity
      }
    })*/
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
       // containerAnimatedStyle
    ]
    return (
        <View style = {containerStyle}>
          {/**blur background view */}
          <BlurView
            style={StyleSheet.absoluteFill}
            tint="dark"
            intensity={25}
          />
        </View>
    )
}

export default  FiltersModal;

const styles = StyleSheet.create({
   
      contentContainer: {
        flex: 1,
        alignItems: 'center',
      },
      overlay:{
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      content : {
        flex : 1,
      // width :'100%',
        gap: 15,
        paddingVertical : 10,
        paddingHorizontal : 15
      },
      filterText :{
        fontSize: hp(4),
        fontWeight : theme.fontWeights.semibold,
        color : theme.colors.neutral(0.7),
        marginBottom: 5
      },
      buttons:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        gap: 10,
      },
      applyButton:{
        flex:1,
        backgroundColor: theme.colors.neutral(0.9),
        padding:12,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.md,
        borderCurve:'continuous'
      },
      resetButton:{
        flex:1,
        backgroundColor: theme.colors.neutral(0.3),
        padding:12,
        alignItems:'center',
        justifyContent:'center',
       // borderWidth:2,
       // borderColor:theme.colors.neutral(0.5),
        borderRadius:theme.radius.md,
        borderCurve:'continuous'
      },
      buttonTex:{
        fontSize:hp(2.2)
      }
})