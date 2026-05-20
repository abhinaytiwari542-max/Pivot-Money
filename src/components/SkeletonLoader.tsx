import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = RADIUS.sm,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={80} borderRadius={RADIUS.lg} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={80} borderRadius={RADIUS.lg} style={{ marginBottom: 12 }} />
      <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={60} borderRadius={RADIUS.lg} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.skeleton,
  },
  container: {
    padding: 20,
  },
});
