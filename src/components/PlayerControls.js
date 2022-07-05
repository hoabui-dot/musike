import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import TrackPlayer from 'react-native-track-player';

import {Button} from './Button';
import {PlayPauseButton} from './PlayPauseButton';

import Icon from 'react-native-vector-icons/FontAwesome';

export const PlayerControls = ({refToast, showReward}) => {
  return (
    <View style={{width: '100%'}}>
      <View style={styles.row}>
        <TouchableOpacity
          // title="Prev"
          onPress={() => TrackPlayer.skipToPrevious()}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="fast-backward" size={20} color="#fff" />
        </TouchableOpacity>
        <PlayPauseButton refToast={refToast} showReward={showReward} />
        <TouchableOpacity
          // title="Next"
          onPress={() => TrackPlayer.skipToNext()}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="fast-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
