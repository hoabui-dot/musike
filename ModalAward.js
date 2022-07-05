import React, {useState, useRef, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  Animated,
  Image,
  Easing,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import Pop from './src/assets/resources/Pop.jpg';
import Rock from './src/assets/resources/Rock.jpg';

function ModalFirst({isVisible, onClose, onOk}) {
  const spinValue = useRef(new Animated.Value(0));
  const scaleValue = useRef(new Animated.Value(0));
  const translateValue = useRef(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.timing(spinValue.current, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear, // Easing is an additional import from react-native
          useNativeDriver: true, // To make use of native driver for performance
        }),
      ).start();

      Animated.loop(
        Animated.timing(scaleValue.current, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear, // Easing is an additional import from react-native
          useNativeDriver: true, // To make use of native driver for performance
          delay: 2000,
        }),
        {iterations: 3},
      ).start();
    } else {
      Animated.loop(Animated.timing(spinValue.current)).stop(0);
      spinValue.current.setValue(0);

      Animated.loop(Animated.timing(scaleValue.current)).stop(0);
      scaleValue.current.setValue(0);
    }
  }, [isVisible]);

  const spin = spinValue?.current?.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleXX = scaleValue?.current?.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.8, 1.2, 0.8, 1],
  });

  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          backgroundColor: 'black',
          minWidth: 200,
          minHeight: 150,
          borderRadius: 10,
          alignItems: 'center',
          overflow: 'hidden',
          paddingVertical: 10,
        }}>
        <Animated.Image
          style={[
            {
              width: '100%',
              height: '100%',
              borderRadius: 50,
              //   marginTop: -40,
              borderWidth: 2,
              borderColor: 'white',
              position: 'absolute',
              opacity: 0.6,
            },
            // {transform: [{scale: scaleXX}]},
          ]}
          source={Rock}
        />
        <Animated.Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: '#faa512',
            transform: [{scale: scaleXX}],
            opacity: scaleXX,
          }}>
          Award
        </Animated.Text>
        <Animated.Text
          style={{
            paddingBottom: 20,
            paddingHorizontal: 20,
            textAlign: 'center',
            fontSize: 18,
            color: 'white',
            paddingTop: 10,
            // transform: [{translateX: translateXX}],
          }}>
          Your acquired Musike token by pre-listening is
          <Animated.Text
            style={{
              fontSize: 20,
              color: '#faa512',
              fontWeight: 'bold',
              transform: [{scale: scaleXX}],
              marginLeft: 10,
            }}>
            {` 1.5`}
          </Animated.Text>
        </Animated.Text>
        <TouchableHighlight
          style={{
            backgroundColor: 'black',
            width: '50%',
            textAlign: 'center',
            padding: 10,
            alignItems: 'center',
            marginBottom: -10,
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 1,
          }}
          onPress={onOk}>
          <Text style={{color: 'white'}}>OK</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  );
}

export default ModalFirst;
