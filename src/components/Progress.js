import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress} from 'react-native-track-player';

export const Progress = () => {
  const progress = useProgress();
  console.log('progress:', progress);
  return (
    <>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {new Date(progress.position * 1000).toISOString().slice(14, 19)}
        </Text>
        <Slider
          style={styles.container}
          value={progress.position}
          minimumValue={0}
          maximumValue={60}
          thumbTintColor="#FFD479"
          minimumTrackTintColor="#FFD479"
          maximumTrackTintColor="#FFFFFF"
          // onSlidingComplete={value => {
          //   TrackPlayer.seekTo(value);
          // }}
        />
        <Text style={styles.labelText}>
          {new Date((60 - progress.position) * 1000)
            .toISOString()
            .slice(14, 19)}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '75%',
    // marginTop: 25,
    flexDirection: 'row',
  },
  labelContainer: {
    width: 370,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems:'center'
  },
  labelText: {
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
});
