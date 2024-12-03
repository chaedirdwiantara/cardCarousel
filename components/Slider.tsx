import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const cardWidth = (width / 3) * 2;
const cardHeight = cardWidth; // Make card a square
const gap = 20;
const snapInterval = cardWidth + gap * 2;

export default function Slider({ data }: { data: Array<{ id: number; image: string; text: string }> }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [expandedCard, setExpandedCard] = useState<number | null>(null); // Track the expanded card

  return (
    <>
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
          <Item
            key={item.id}
            item={item}
            scrollX={scrollX}
            i={i}
            isExpanded={expandedCard === item.id}
            onPress={() => setExpandedCard(item.id)}
          />
        ))}
      </ScrollView>
      {expandedCard !== null && (
        <ExpandedView
          item={data.find((d) => d.id === expandedCard)!}
          onClose={() => setExpandedCard(null)}
        />
      )}
    </>
  );
}

const Item = ({
  i,
  scrollX,
  item,
  isExpanded,
  onPress,
}: {
  i: number;
  scrollX: Animated.Value;
  item: { id: number; image: string; text: string };
  isExpanded: boolean;
  onPress: () => void;
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
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.normalView, { transform: [{ scale }] }]}>
        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          style={{ height: cardHeight, width: cardWidth, borderRadius: 10 }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ExpandedView = ({
  item,
  onClose,
}: {
  item: { id: number; image: string; text: string };
  onClose: () => void;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animate the expansion effect
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[styles.expandedView, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.expandedImage} />
      <View style={{ height: 20 }} />
      <Text style={styles.expandedText}>{item.text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  normalView: {
    marginHorizontal: gap,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  expandedView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: width,
    height: width,
  },
  expandedText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    marginBottom: 10,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    backgroundColor: '#686565',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
