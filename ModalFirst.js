import React, {useState, useRef, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  Animated,
  Image,
  Easing,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Pop from './src/assets/resources/Pop.jpg';

function ModalFirst({isVisible, onClose, onOk}) {
  const spinValue = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ).start();
    // } else {
    //   Animated.loop(Animated.timing(spinValue.current)).stop(0);
    //   spinValue.current.setValue(0);
    // }
  }, []);

  const spin = spinValue?.current?.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    // <View
    //   style={{
    //     flex: 1,
    //     backgroundColor: 'white',
    //     position: isVisible ? 'absolute' : 'relative',
    //   }}
    //   onPress={onClose}>
    //   {/* <Button title="Show modal" onPress={onClose} /> */}

      <Modal isVisible={isVisible}>
        <View
          style={{
            backgroundColor: 'white',
            minWidth: 200,
            minHeight: 100,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Animated.Image
            style={[
              {
                width: 100,
                height: 100,
                borderRadius: 50,
                marginTop: -40,
                borderWidth: 2,
                borderColor: 'white',
              },
              {transform: [{rotate: spin}]},
            ]}
            source={Pop}
          />
          <Text>Hello Guys!</Text>
          <Text
            style={{
              paddingBottom: 20,
              paddingHorizontal: 20,
              textAlign: 'center',
              fontSize: 18,
            }}>
            Token mining starts when you preview a new song for 1 minute
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              width: '50%',
              textAlign: 'center',
              padding: 10,
              alignItems: 'center',
              marginBottom: 10,
              borderRadius: 10,
            }}
            onPress={onOk}>
            <Text style={{color: 'white'}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    // </View>
  );
}

export default ModalFirst;
