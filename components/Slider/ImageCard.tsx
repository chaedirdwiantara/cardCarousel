import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const CARD_WIDTH = (Dimensions.get('window').width / 3) * 2;
const CARD_HEIGHT = CARD_WIDTH;
const GAP = 20;

const ImageCard = ({
  item,
  scrollX,
  index,
  onCardPress,
}: {
  item: { id: number; image: string; text: string };
  scrollX: Animated.Value;
  index: number;
  onCardPress: (layout: { x: number; y: number; width: number; height: number }, cardId: number) => void;
}) => {
  const scale = scrollX.interpolate({
    inputRange: [
      (index - 1) * (CARD_WIDTH + GAP * 2),
      index * (CARD_WIDTH + GAP * 2),
      (index + 1) * (CARD_WIDTH + GAP * 2),
    ],
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  const imageRef = useRef<Image>(null);

  const handlePress = () => {
    imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onCardPress({ x: pageX, y: pageY, width, height }, item.id);
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image
          ref={imageRef}
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 10,
  },
});

export default ImageCard;
