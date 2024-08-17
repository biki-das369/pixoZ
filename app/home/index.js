import { Pressable, StyleSheet, Text, TextInput, View,ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import { theme, neutral } from '../../constants/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common'; //../../../helpers/common
import Categories from '../../components/categories'; //../../../components/categories
import { apiCall } from '../../api/index';  // ../../../api
import axios from 'axios';
import ImageGrid from '../../components/ImageGrid'; //../../../components/ImageGrid
import {debounce} from 'lodash'
import FiltersModal from '../../components/filtersModal';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';

//import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
var page = 1;

const index = () => {
    //this for safe area view ..notch Display
    const {top} = useSafeAreaInsets();
    const paddingTop = top>0? top+10 :30;
    //need to add it in View {paddingTop} for iphone

    //close button in sarch Button
    const[search,setSesrch] = useState('')
    //for clearing the searchfeald
    const searchInputRrf = useRef(null);

    //images
    const [images,setImages]=useState([])

    //for filter 
    const [filters , setFilters] = useState(null);

    //filer models 
    const modalRef = useRef(null);
    //for unlimited Scroll
    const scrollRef = useRef(null);
    const [isEndReached, setIsEndReached] = useState(false);
    //for 
    const router = useRouter()
    //for api
    useEffect(()=>{
        fetchImages();
    },[])



    const fetchImages =async(params={page:1},append=true)=>{
        console.log('params :',params,append)
        let res = await apiCall(params);
        if(res.success &&res?.data?.hits){
            if(append)
            setImages([...images,...res.data.hits])
            else
            setImages([...res.data.hits])
        }
        
    }

    //for filter icon open

    const openFiltersModel = ()=>{
        modalRef.current?.present();
    }
    //for filter icon close
    const closeFiltersModel = ()=>{
        modalRef.current?.close();
    }

    //filter catagory

    const applyFilters = ()=>{
        if(filters){
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filters
            }
            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search;
            fetchImages(params, false)
        }
        console.log("applying Filters")
        closeFiltersModel()
    }
    //resate filter
    const resetFilters = ()=>{
        console.log("reset Filters")
        if(filters){
            page = 1;
            setFilters(null);
            setImages([]);
            let params = {
                page,
            }
            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search;
            fetchImages(params, false)
        }
        setFilters(null)
        closeFiltersModel()
    }
    // clearFilter home screen
    const clearThisFilter = (filterName)=>{
        let filterz = {...filters}
        delete filterz [filterName];
        setFilters({...filterz});
        page = 1,
        setImages ([]);
        let params = {
            page,
            ...filterz
        }
        if(activeCategory) params.category = activeCategory;
        if(search) params.q = search;
        fetchImages(params, false)

    }

    //Active catagory hover like selected category
    const[activeCategory,setActiveCategory] = useState(null);

    //functionality to fetch image after clicking the caragory button 
    const handleChangeCategory = async (cat) => {
        console.log('Selected Category:', cat);
        setActiveCategory(cat);
        clearSearch();
        setImages([]);
        page = 1;
    
        let params = {
            page, 
            ...filters
        };
    
        if (cat) params.category = cat; // Adjust key if needed
        console.log('Params before API call:', params);
    /**debuggin code */
        try {
            await fetchImages(params, false);
            console.log('Images fetched successfully');
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
//********* */    
    console.log('activeCategory',activeCategory);


    //search value trigger function 

    const handleSearch =(text)=>{
        setSesrch(text)
        if(text.length>2){
            //if text is more than two letter then it will search
            page =1;
            setImages([]);
            setActiveCategory(null); // clear the category while searching 
            fetchImages({page,...filters, q:text}, false)
        }
        if(text ==""){
            //reset and show default image
             page =1;
            setImages([]);
            setActiveCategory(null);
            fetchImages({page,...filters}, false)
            searchInputRrf.current?.clear();
        }
        console.log('searching for: ',text)
    }

    console.log('filters', filters);
    //scrolling unlimited
    const handleScroll =(event)=>{
       // console.log("scroll event fired");
       const contentHeight = event.nativeEvent.contentSize.height;
       const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
       const scrollViewOffset = event.nativeEvent.contentOffset.y;
       const bottomPosition = contentHeight - scrollViewHeight;

       if(scrollViewOffset>=bottomPosition-1){
            if(!isEndReached){
                setIsEndReached(true);
                console.log("reach the bottom of scroll view");
                //fetch more images
                ++page;
                let params = {
                    page,
                    ...filters
                }
                if(activeCategory) params.category = activeCategory;
                if(search) params.q = search;
                fetchImages(params)
            }
       }else if(isEndReached){
        setIsEndReached(false);

       }
    }

    //handle scroll up after click pixo icon
    const handleScrollUp =()=>{
        scrollRef?.current.scrollTo({
            y:0,
            Animated:true
        })
    }
    //loadash function
    const handleTextDebounce = useCallback(debounce(handleSearch, 400),[]);

    //clear search 
    const clearSearch =() =>{
        setSesrch("");
       // searchInputRrf.current?.clear() //this line can get ommit 
    }



  return (
    <View style={[styles.container]}>
      
      {/**header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
            <Text style={styles.title}>Pixo</Text>
        </Pressable>
        <Pressable  onPress={openFiltersModel}>
            <FontAwesome6 name="bars-staggered" size={24} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>
       {/**Body section */}

       <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5} //how often scroll event will fire while scrolling in mili second
        ref={scrollRef}
        contentContainerStyle={{gap:15}}
        >
        {/**Search view*/}

        <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
            </View>
            <TextInput
            placeholder='Search for picture...'
            //value ={search}
            ref={searchInputRrf}
            onChangeText = {handleTextDebounce}
            style={styles.searchInput}
            >  
            </TextInput>
            {/**logic for after having text the close button appare */}
            {
                search && (
                    <Pressable onPress={()=>handleSearch("")} style={styles.closeIcon} >
                    <Ionicons name="close-outline" size={24} color={theme.colors.neutral(0.4)} />
               </Pressable>
                )
            }
        </View>

        {/**categories */}
        <View style={styles.categories}>
            <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory}/>
        </View>

        {/**filters */}

        {
            filters && (
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator ={false} contentContainerStyle ={styles.filters}>
                        {
                            Object.keys(filters).map((key,index)=>{
                                return(
                                    <View key={key} style={styles.filterItem}>
                                        {
                                            key =='colors'?(
                                                <View style={{
                                                    height:20,
                                                    width:30,
                                                    borderRadius:7,
                                                    backgroundColor:filters[key]
                                                }}></View>
                                            ):(
                                                <Text  style={styles.filterItemText}>{filters[key]}</Text>
                                            )
                                        }
                                
                                        <Pressable style={styles.filterCloseIcon} onPress={()=>clearThisFilter(key)}>
                                             <Ionicons name="close-outline" size={14} color={theme.colors.neutral(0.9)} />
                                        </Pressable>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            )
        }

        {/**images messinary grid*/}
        <View>
            {
                images.length>0 && <ImageGrid images={images} router={router}/>
            }
        </View>

         {/**loading while image fetch */}

         <View style={{merginBottom:70, merginTop: images.length>0?10:70}}>
            <ActivityIndicator size='large'/>
        </View>    
        
        </ScrollView>
        {/**filters Model */}
        <FiltersModal
         modalRef = {modalRef}
         filters = {filters}
         setFilters = {setFilters}
         onClose = {closeFiltersModel}
         onApply = {applyFilters}
         onReset = {resetFilters}
        />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
container:{
    flex:1,
    gap:15
},
header:{
marginHorizontal: wp(4),
marginTop: hp(3),
justifyContent:'space-between',
flexDirection:'row',
alignItems:'center'
},
title:{
    fontSize:hp(4),
    fontWeight:theme.fontWeights.semibold,
    color:theme.colors.neutral(0.8)
},
searchBar:{
    marginHorizontal:wp(4),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderWidth:1,
    borderColor:theme.colors.grayBG,
    backgroundColor:theme.colors.white,
    padding:6,
    paddingLeft:15,
    borderRadius:theme.radius.lg
},
searchIcon :{
    padding:8
},
searchInput:{
    flex:1,
    borderRadius:theme.radius.sm,
    paddingVertical:10,
    fontSize:hp(1.8)
},
closeIcon:{
    backgroundColor:theme.colors.neutral(0.2),
    padding:8,
    borderRadius:theme.radius.sm
},
filters:{
    paddingHorizontal: wp(4),
    gap : 10,
},
filterItem:{
    backgroundColor:theme.colors.grayBG,
    alignItems:'center',
    padding: 3 ,
    flexDirection: 'row',
    borderRadius: theme.radius.xs,
    padding: 8,
    gap:10,
    paddingHorizontal:10
},
filterItemText:{
    fontSize:hp(1.8)
},
filterCloseIcon:{
    backgroundColor:theme.colors.neutral(0.2),
    padding:4,
    borderRadius:7
}
})