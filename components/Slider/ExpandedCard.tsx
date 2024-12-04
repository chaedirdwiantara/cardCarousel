import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ExpandedCard = ({
  item,
  layoutProps,
  onClose,
}: {
  item: { id: number; image: string; text: string };
  layoutProps: { x: number; y: number; width: number; height: number };
  onClose: () => void;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 10,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      layoutProps.x + layoutProps.width / 2 - width / 2,
      0,
    ],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      layoutProps.y + layoutProps.height / 2 - height / 2,
      0,
    ],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [layoutProps.width / width, 1],
  });

  const handleCloseExpandedView = () => {
    Animated.timing(animatedValue, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX }, { translateY }, { scale }] },
      ]}
    >
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={handleCloseExpandedView} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <Animated.Image
          source={{ uri: item.image }}
          style={[
            styles.image,
            {
              transform: [
                { translateX },
                { translateY },
                { scale },
            ],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width,
    height: width,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    backgroundColor: '#686565',
    borderRadius: 50,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExpandedCard;
