import React, { useRef, useState } from 'react';
import { ScrollView, Animated, StyleSheet } from 'react-native';
import ImageCard from './ImageCard';
import ExpandedCard from './ExpandedCard';
import { Dimensions } from 'react-native';

const CARD_WIDTH = (Dimensions.get('window').width / 3) * 2;
const SNAP_INTERVAL = CARD_WIDTH + 20 * 2;

const SliderMain = ({ data }: { data: Array<{ id: number; image: string; text: string }> }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [layoutProps, setLayoutProps] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleCardPress = (
    layout: { x: number; y: number; width: number; height: number },
    cardId: number
  ) => {
    setLayoutProps(layout);
    setExpandedCard(cardId);
  };

  const handleCloseExpandedView = () => {
    setExpandedCard(null);
    setLayoutProps(null);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <ImageCard
            key={item.id}
            item={item}
            scrollX={scrollX}
            index={index}
            onCardPress={handleCardPress}
          />
        ))}
      </ScrollView>
      {expandedCard !== null && layoutProps && (
        <ExpandedCard
          item={data.find((d) => d.id === expandedCard)!}
          layoutProps={layoutProps}
          onClose={handleCloseExpandedView}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SliderMain;
