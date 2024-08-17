import { Button, StyleSheet, Text, View, Image, Platform, ActivityIndicator, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '../../helpers/common';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../../constants/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather, Octicons, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState('loading');

  const uri = item?.webformatURL;
  const fileName = item?.previewURL?.split('/').pop();
  const imageUrl = uri;

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
      }
    })();
  }, []);

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == 'web' ? wp(40) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) { // portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight
    };
  };

  const handleDownloadImage = async () => {
    try {
      setStatus('downloading');
      const { uri } = await FileSystem.downloadAsync(imageUrl, FileSystem.cacheDirectory + fileName);

      if (uri) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Downloaded Images');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Downloaded Images', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        console.log('Image downloaded successfully');
        showToast('Image downloaded')
        setStatus('');
      }
    } catch (error) {
      console.error('Download error:', error.message);
      setStatus('');
      Alert.alert('Download Error', error.message);
    }
  };

  const handleShareImage = async () => {
    try {
      setStatus('sharing');
      const { uri } = await FileSystem.downloadAsync(imageUrl, FileSystem.cacheDirectory + fileName);

      if (uri) {
        await Sharing.shareAsync(uri);
        setStatus('');
      }
    } catch (error) {
      console.error('Sharing error:', error.message);
      setStatus('');
      Alert.alert('Sharing Error', error.message);
    }
  };

  const onLoad = () => {
    setStatus('');
  };

  const onError = () => {
    setStatus('Failed to load image');
  };
  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
     // text2: 'Hire me pls',
     position:'top'
    });
  }
  return (
    <BlurView
      style={styles.container}
      tint='dark'
      intensity={60}
    >
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === 'loading' && <ActivityIndicator size='large' color='white' />}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={{ uri: uri }}
          onLoad={onLoad}
          onError={onError}
        />
        {status ? <Text style={styles.errorText}>{status}</Text> : null}
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" color="white" size={24} />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size='small' color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" color="white" size={24} />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'sharing' ? (
            <View style={styles.button}>
              <ActivityIndicator size='small' color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" color="white" size={22} />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast/>
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous'
  }
});
