import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MARKET_TICKER } from '../constants/data';

export const MarketTicker: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{MARKET_TICKER}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.text,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
});
