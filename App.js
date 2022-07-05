import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrackPlayer, {usePlaybackState, State} from 'react-native-track-player';
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
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
  Animated,
  Easing,
} from 'react-native';
import Toast from '@rimiti/react-native-toastify';

import ModalSecond from './ModalAward';

import RNBootSplash from 'react-native-bootsplash';

import Carousel from 'react-native-snap-carousel';

import {PlayerControls, Progress, TrackInfo} from './src/components';
import {SetupService, QueueInitalTracksService} from './src/services';
import {useCurrentTrack} from './src/hooks';

import ModalFirst from './ModalFirst';

import ModalCategory from './Modal';

import Icon from 'react-native-vector-icons/FontAwesome';

import Time from './Time';

import bootSplashLogo from './src/assets/bootsplash_logo.png';

const IMAGE = [
  'https://raw.githubusercontent.com/Hoang21099/mar-asset/master/a.jpg',
  'https://raw.githubusercontent.com/Hoang21099/mar-asset/master/b.jpg',
  'https://raw.githubusercontent.com/Hoang21099/mar-asset/master/c.jpg',
];

const LINK = [
  'https://bingo.family/',
  'https://creaturehunters.world/',
  'https://nftmarble.games/',
];

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

const App = () => {
  const track = useCurrentTrack();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [temp, setTemp] = useState({});

  const [isShowAward, setShowAward] = useState(false);

  const [isShowFirstModal, setModalFirst] = useState(false);
  let [refT, setRefT] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);

  const toggleModal = () => {
    setVisibleModal(!visibleModal);
  };

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
  };

  const _carousel = useRef(null);

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('isFirst', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const getData = async name => {
    try {
      const value = await AsyncStorage.getItem(name || 'test');
      if (value !== null) {
        // value previously stored
        return JSON.parse(value);
      }
      return null;
    } catch (e) {
      // error reading value
    }
  };

  const [bootSplashIsVisible, setBootSplashIsVisible] = React.useState(true);
  const [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] =
    React.useState(false);
  const opacity = React.useRef(new Animated.Value(1));
  const translateY = React.useRef(new Animated.Value(0));

  const scaleValue = useRef(new Animated.Value(0));

  const scaleXX = scaleValue?.current?.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.95, 1.5, 1, 0.8, 1],
  });

  const opacityXX = opacity?.current?.interpolate({
    inputRange: [0, 0.25, 0.5, 0.6, 0.75, 1],
    outputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
  });

  const init = async () => {
    // You can uncomment this line to add a delay on app startup
    // await fakeApiCallWithoutBadNetwork(3000);

    try {
      // Animated.timing(scaleValue.current, {
      //   useNativeDriver: true,
      //   toValue: 1,
      //   // toValue: Dimensions.get('window').height,
      //   duration: 3000,
      // }).start();

      Animated.timing(opacity.current, {
        useNativeDriver: true,
        toValue: 0,
        duration: 3000,
        easing: Easing.linear,
      }).start(() => {
        setBootSplashIsVisible(false);
      });
    } catch (error) {
      setBootSplashIsVisible(false);
    }

    await RNBootSplash.hide();
  };

  useEffect(() => {
    // SplashScreen.show();
    handleData();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    async function run() {
      const isSetup = await SetupService();
      setIsPlayerReady(isSetup);

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await QueueInitalTracksService();
      }
    }

    run();
    showAlert();

    init();
    // RNBootSplash.hide();

    return () => backHandler.remove();

    // SplashScreen.hide();
  }, []);

  const showAlert = async () => {
    const value = await AsyncStorage.getItem('isFirst');
    if (!value) {
      setModalFirst(true);
    } else {
      storeData('ok');
    }
  };

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        {/* <ActivityIndicator /> */}
        {bootSplashIsVisible && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.bootsplash,
              // {opacity: opacityXX},
            ]}>
            <Animated.Image
              source={bootSplashLogo}
              fadeDuration={2}
              resizeMode="contain"
              onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
              style={[
                styles.logo,
                {
                  // transform: [
                  //   {
                  //     // translateY: translateY.current
                  //     // scale: scaleXX,
                  //   },
                  // ],
                  opacity: opacityXX,
                },
              ]}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    );
  }

  const onLink = async index => {
    console.log(LINK[index % 3]);
    await Linking.openURL(LINK[index % 3]);
  };

  const renderItem = data => {
    return (
      <TouchableOpacity
        style={{width: '100%', height: 100}}
        onPress={() => onLink(data.index)}>
        <Image
          onPress={() => onLink(data.index)}
          source={{uri: data.item}}
          style={{width: '100%', height: 100}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar barStyle={'light-content'} />
      <Toast
        ref={c => setRefT(c)}
        style={{
          backgroundColor: '#ffffffcf',
          paddingVertical: 25,
          fontSize: 14,
          paddingHorizontal: 25,
          textAlign: 'center',
          borderRadius: 15,
        }}
        textStyle={{
          textAlign: 'center',
          color: '#FF344A',
          fontSize: 18,
        }}
        position="top"
      />
      <Image
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          bottom: 0,
        }}
        source={{uri: `${track?.artwork || 'https://raw.githubusercontent.com/Hoang21099/mar-asset/master/Mar_diffuse.png'}`}}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          bottom: 0,
          backgroundColor: '#000000ab',
        }}
      />

      <ScrollView
        style={{width: '100%', height: '100%'}}
        contentContainerStyle={{}}>
        <View style={{flex: 1}}>
          <View style={styles.contentContainer}>
            <TrackInfo track={track} />
            <Progress />
          </View>
          <View style={styles.actionRowContainer}>
            <PlayerControls
              refToast={refT}
              showReward={() => setShowAward(true)}
            />
          </View>
          <Time />
        </View>
      </ScrollView>
      <View style={{width: '100%'}}>
        <Carousel
          ref={_carousel}
          data={IMAGE}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          autoplay={true}
          loop={true}
        />
      </View>
      <TouchableOpacity
        onPress={toggleModal}
        style={{
          width: 100,
          height: 100,
          position: 'absolute',
          top: 20,
          right: -50,
          borderRadius: 5,
          zIndex: 100,
        }}>
        <Icon name={'music'} size={30} color="#FF344A" />
      </TouchableOpacity>
      <ModalCategory isVisible={visibleModal} toggle={toggleModal} />
      <ModalFirst
        isVisible={isShowFirstModal}
        onClose={() => {
          setModalFirst(false);
          storeData('ok');
        }}
        onOk={() => {
          setModalFirst(false);
          TrackPlayer.play();
          storeData('ok');
        }}
      />

      {bootSplashIsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.bootsplash,
            // {opacity: opacityXX},
          ]}>
          <Animated.Image
            source={bootSplashLogo}
            fadeDuration={2}
            resizeMode="contain"
            onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
            style={[
              styles.logo,
              {
                transform: [
                  {
                    // translateY: translateY.current
                    // scale: scaleXX,
                  },
                ],
                opacity: opacityXX,
              },
            ]}
          />
        </Animated.View>
      )}

      <ModalSecond isVisible={isShowAward} onOk={() => setShowAward(false)} />
    </SafeAreaView>
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
  bootsplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  logo: {
    height: 190,
    width: 190,
    marginTop: 15,
  },
});

export default App;
