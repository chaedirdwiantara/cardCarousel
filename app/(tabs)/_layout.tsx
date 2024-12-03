import Slider from '@/components/Slider';
import dummyData from '@/data/dummyData';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {

  return (
    <View style={styles.container}>
      <Slider data={dummyData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
