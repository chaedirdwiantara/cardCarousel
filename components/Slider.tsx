import React, { useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const cardWidth = (width / 3) * 2;
const gap = 20;
const snapInterval = cardWidth + gap * 2;

export default function Slider({ data }: { data: Array<{ id: number; image: string; text: string }> }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal
      pagingEnabled={false}
      snapToInterval={snapInterval}
      snapToAlignment="center"
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: false,
      })}
      scrollEventThrottle={16}>
      {data.map((item, i) => (
        <Item key={item.id} item={item} scrollX={scrollX} i={i} />
      ))}
    </ScrollView>
  );
}

const Item = ({
  i,
  scrollX,
  item,
}: {
  i: number;
  scrollX: Animated.Value;
  item: { id: number; image: string; text: string };
}) => {
  const scale = scrollX.interpolate({
    inputRange: [
      (i - 1) * (cardWidth + gap * 2),
      i * (cardWidth + gap * 2),
      (i + 1) * (cardWidth + gap * 2),
    ],
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.item, { transform: [{ scale: scale }] }]}>
      <Image source={{ uri: item.image }} resizeMode='cover' height={cardWidth} width={cardWidth} borderRadius={10}/>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  item: {
    backgroundColor: '#fff',
    marginHorizontal: gap,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
