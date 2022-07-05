import React, {useRef, useEffect} from 'react';
import {Image, StyleSheet, Text, View, Animated, Easing} from 'react-native';
import {usePlaybackState, State} from 'react-native-track-player';

import Pop from '../../src/assets/resources/Pop.jpg';
import Hiphop from '../../src/assets/resources/hiphop.jpg';
import Rock from '../../src/assets/resources/Rock.jpg';
import Rhythm from '../../src/assets/resources/R_B.jpg';
import Reggae from '../../src/assets/resources/Reggae.png';
import Country from '../../src/assets/resources/country.jpg';
import Funk from '../../src/assets/resources/Funk.jpg';

const OBJ = {
  'Hunter master': Pop,
  Kiaxon: Hiphop,
  'What Cha Got There(GTR Added)': Rock,
  '견애차이 Duet ver 3': Rhythm,
  넌내게어려워AR: Reggae,
  '바람이었다 1절': Country,
  '어나더유니버스 Orchestra Arr Monitor': Funk,
};

export const TrackInfo = ({track}) => {
  const spinValue = useRef(new Animated.Value(0));

  const state = usePlaybackState();
  const isPlaying = state === State.Playing;
  // First set up animation

  useEffect(() => {
    if (!spinValue.current) {
      return;
    }
    console.log('sssss');
    if (isPlaying) {
      console.log('spinValue.current: ', spinValue.current);
      Animated.loop(
        Animated.timing(spinValue.current, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear, // Easing is an additional import from react-native
          useNativeDriver: true, // To make use of native driver for performance
        }),
      ).start();
    } else {
      Animated.loop(Animated.timing(spinValue.current)).stop(0);
      spinValue.current.setValue(0);
    }
  }, [state]);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue?.current?.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.artwork, {transform: [{rotate: spin}]}]}
        source={
          OBJ[track?.title] || Pop
          // {uri: `${track?.artwork}`}
        }
      />
      <Text style={styles.titleText}>{track?.title}</Text>
      <Text style={styles.artistText}>{track?.artist}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  artwork: {
    width: 240,
    height: 240,
    marginTop: 30,
    backgroundColor: '#aaa',
    borderRadius: 120,
    borderWidth: 2,
    padding: 5,
    borderColor: '#aaa',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginTop: 30,
    marginBottom: 10,
  },
  artistText: {
    fontSize: 16,
    fontWeight: '200',
    color: 'white',
  },
});
