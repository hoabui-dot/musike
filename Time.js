import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrackPlayer from 'react-native-track-player';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';

import {usePlaybackState, State} from 'react-native-track-player';

import {useCurrentTrack} from './src/hooks';

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(100);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

let intervalCall;

const App = () => {
  const track = useCurrentTrack();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [temp, setTemp] = useState({});

  const [time, setTime] = useState(0);

  const state = usePlaybackState();
  const isPlaying = state === State.Playing;

  useEffect(() => {
    if (isPlaying) {
      intervalCall =
        !intervalCall &&
        setInterval(() => {
          setTime(prevCount => prevCount + 1);
        }, 1000);
      console.log('before intervalCall:', intervalCall);
    } else {
      console.log('after intervalCall:', intervalCall);

      clearInterval(intervalCall);
      intervalCall = null;
      handleData();
    }
  }, [isPlaying]);

  useEffect(() => {
    handleData();
  }, []);

  const handleData = async () => {
    const {
      startTime = 0,
      isPlayTemp,
      pointNow,
      totalPoint,
      tempTime = 0,
    } = (await getData('test')) || {};

    setTemp({
      startTime,
      isPlayTemp,
      pointNow,
      totalPoint,
      tempTime,
    });

    setTime(tempTime);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('test');
      if (value !== null) {
        // value previously stored
        return JSON.parse(value);
      }
      return null;
    } catch (e) {
      // error reading value
    }
  };

  const textTime = () => {
    const minute = Math.floor(time / 60);
    const second = Math.floor(time - minute * 60);
    return `${Math.floor(time / 60)}m ${second}s`;
  };

  return (
    <>
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.title}>Mining Time: </Text>
          <Text style={styles.subTitle}>{textTime()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Earn Today: </Text>
          <Text style={styles.subTitle}>{`${(time * 0.05).toFixed(
            2,
          )} MUSIKE`}</Text>
        </View>
      </View>
      <View
        style={{width: '100%', justifyContent: 'center', marginVertical: 10, alignItems: 'flex-start', marginLeft: 10}}>
        <View
          style={{
            width: '20%',
            height: 2,
            backgroundColor: 'white',
          }}
        />
      </View>

      <View>
        <View
          style={[
            styles.row,
            
          ]}>
          <Text style={[styles.title, {fontSize: 18}]}>Total Earn: </Text>
          <Text style={styles.subTitle}>{`${(time * 0.05).toFixed(
            2,
          )} MUSIKE`}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 3,
    alignItems: 'center',
  },
  topBarContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  actionRowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#aaa',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  column: {
    width: '100%',
    flexDirection: 'column',
  },
});

export default App;
