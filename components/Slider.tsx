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
const cardHeight = cardWidth;
const gap = 20;
const snapInterval = cardWidth + gap * 2;

export default function Slider({ data }: { data: Array<{ id: number; image: string; text: string }> }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [expandedCard, setExpandedCard] = useState<number | null>(null); 
  const [xPositions, setXPositions] = useState<number>();
  const [yPositions, setYPositions] = useState<number>();
  const [cardWidth, setCardWidth] = useState<number>();
  const [cardHeight, setCardHeight] = useState<number>();

  const handleImagePress = (layout: { x: number; y: number; width: number; height: number }, item: { id: number; image: string; text: string }) => {
    setExpandedCard(item.id);
    setXPositions(layout.x);
    setYPositions(layout.y);
    setCardWidth(layout.width);
    setCardHeight(layout.height);
  };

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
          <ImageCard
            key={item.id}
            item={item}
            scrollX={scrollX}
            i={i}
            isExpanded={expandedCard === item.id}
            onPress={handleImagePress}
          />
        ))}
      </ScrollView>
      {expandedCard !== null && xPositions !== undefined && yPositions !== undefined && cardWidth !== undefined && cardHeight !== undefined && (
        <ExpandedView
          item={data.find((d) => d.id === expandedCard)!}
          onClose={() => setExpandedCard(null)}
          xPositions={xPositions}
          yPositions={yPositions}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
        />
      )}
    </>
  );
}

const ImageCard = ({
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
    onPress: (layout: { x: number; y: number; width: number; height: number }, item: { id: number; image: string; text: string }) => void;
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
  
    const imageRef = useRef<Image>(null);
  
    const handlePress = () => {
      if (imageRef.current) {
        imageRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          onPress({
            x: pageX,
            y: pageY,
            width,
            height,
          }, item);
        });
      }
    };
  
    return (
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[styles.normalView, { transform: [{ scale }] }]}>
          <Image
            ref={imageRef}
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
    xPositions,
    yPositions,
    cardWidth,
    cardHeight,
  }: {
    item: { id: number; image: string; text: string };
    onClose: () => void;
    xPositions: number;
    yPositions: number;
    cardWidth: number;
    cardHeight: number;
  }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
  
    const [imagePosition, setImagePosition] = useState({
      x: xPositions,
      y: yPositions,
      width: cardWidth,
      height: cardHeight,
    });
  
    // Animate the expansion effect
    React.useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 10,
        tension: 100,
        useNativeDriver: false,
      }).start();
    }, []);
  
    const handleClose = () => {
      Animated.timing(animatedValue, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false,
      }).start(() => onClose());
    };
  
    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [imagePosition.x + imagePosition.width / 2 - width / 2, 0],
    });
  
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [imagePosition.y + imagePosition.height / 2 - height / 2, 0],
    });
  
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [imagePosition.width / width, 1],
    });
  
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  
    return (
      <Animated.View
        style={[
          styles.expandedView,
          { opacity, transform: [{ translateX }, { translateY }, { scale }] },
        ]}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <Animated.Image
          source={{ uri: item.image }}
          style={[
            styles.expandedImage,
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
