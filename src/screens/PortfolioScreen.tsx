import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { FUNDS, Fund } from '../constants/data';
import { MarketTicker } from '../components/MarketTicker';

interface PortfolioScreenProps {
  navigation: any;
}

const RiskBar: React.FC = () => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [widthAnim]);

  return (
    <View style={riskStyles.container}>
      <Text style={riskStyles.title}>Risk Breakdown</Text>
      <View style={riskStyles.barContainer}>
        <Animated.View
          style={[
            riskStyles.barSegment,
            {
              backgroundColor: COLORS.green,
              flex: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 40],
              }),
            },
          ]}
        >
          <Text style={riskStyles.barLabel}>40%</Text>
        </Animated.View>
        <Animated.View
          style={[
            riskStyles.barSegment,
            {
              backgroundColor: COLORS.amber,
              flex: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 35],
              }),
            },
          ]}
        >
          <Text style={riskStyles.barLabel}>35%</Text>
        </Animated.View>
        <Animated.View
          style={[
            riskStyles.barSegment,
            {
              backgroundColor: COLORS.red,
              flex: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 25],
              }),
            },
          ]}
        >
          <Text style={riskStyles.barLabel}>25%</Text>
        </Animated.View>
      </View>
      <View style={riskStyles.legendRow}>
        <View style={riskStyles.legendItem}>
          <View style={[riskStyles.legendDot, { backgroundColor: COLORS.green }]} />
          <Text style={riskStyles.legendText}>Stable</Text>
        </View>
        <View style={riskStyles.legendItem}>
          <View style={[riskStyles.legendDot, { backgroundColor: COLORS.amber }]} />
          <Text style={riskStyles.legendText}>Growth</Text>
        </View>
        <View style={riskStyles.legendItem}>
          <View style={[riskStyles.legendDot, { backgroundColor: COLORS.red }]} />
          <Text style={riskStyles.legendText}>Volatile</Text>
        </View>
      </View>
    </View>
  );
};

const FundCard: React.FC<{ fund: Fund; index: number; onPress: () => void }> = ({
  fund,
  index,
  onPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const isPositive = fund.todayChange > 0;
  const changeColor = isPositive ? COLORS.green : COLORS.red;
  const changeBg = isPositive ? COLORS.greenLight : COLORS.redLight;

  const categoryColor =
    fund.category === 'stable'
      ? COLORS.green
      : fund.category === 'growth'
      ? COLORS.amber
      : COLORS.red;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View
        style={[
          cardStyles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={cardStyles.header}>
          <View style={cardStyles.nameRow}>
            <View style={[cardStyles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={cardStyles.name} numberOfLines={1}>
              {fund.name}
            </Text>
          </View>
          <View style={[cardStyles.cagrBadge]}>
            <BarChart3 size={10} color={COLORS.primary} />
            <Text style={cardStyles.cagrText}>{fund.cagrFormatted}</Text>
          </View>
        </View>

        <View style={cardStyles.footer}>
          <Text style={cardStyles.invested}>{fund.investedFormatted}</Text>
          <View style={[cardStyles.changeBadge, { backgroundColor: changeBg }]}>
            {isPositive ? (
              <TrendingUp size={12} color={changeColor} />
            ) : (
              <TrendingDown size={12} color={changeColor} />
            )}
            <Text style={[cardStyles.changeText, { color: changeColor }]}>
              {fund.todayChangeFormatted} today
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ navigation }) => {
  const handleFundPress = (fund: Fund) => {
    navigation.navigate('Whisperer', {
      autoMessage: `Tell me more about my ${fund.name} holding`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MarketTicker />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>Your mutual fund holdings</Text>
        </View>

        <RiskBar />

        <View style={styles.fundsSection}>
          <Text style={styles.fundsTitle}>Holdings</Text>
          {FUNDS.map((fund, index) => (
            <FundCard
              key={fund.id}
              fund={fund}
              index={index}
              onPress={() => handleFundPress(fund)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fundsSection: {
    paddingHorizontal: SPACING.xl,
  },
  fundsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
});

const riskStyles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  barContainer: {
    flexDirection: 'row',
    height: 28,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  barSegment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.white,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  cagrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  cagrText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invested: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  changeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
});
