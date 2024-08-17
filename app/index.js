import React from 'react';
import { Image, Pressable, StatusBar, StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated'; // Ensure you're importing Animated from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInDown } from 'react-native-reanimated';
import { theme, neutral } from '../constants/theme';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helpers/common';

const Index = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/welcome.png')}
        style={styles.bgImage}
        resizeMode='cover'
      />

      {/** Linear gradient */}
      {/** Adding the animation to the gradient only */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.gradientContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.9 }}
        />
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.duration(600).delay(100).springify()}
            style={styles.text}>
            Pixo
          </Animated.Text>
          <Animated.Text 
           entering={FadeInDown.delay(200).springify()}
          style={styles.impactLine}>
            Experience The Pixo Story
          </Animated.Text>
          <Pressable
            onPress={() => router.push('home')}
            style={styles.startButton}>
            <Text style={styles.startText}>Start Explore</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  gradientContainer: {
    flex: 1,
  },
  gradient: {
    height: hp(65),
    width: wp(100),
    bottom: 0,
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  text: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  impactLine: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
    marginBottom: 10,
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(3),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});
