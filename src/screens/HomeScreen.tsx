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
import {
  TrendingDown,
  Layers,
  Repeat,
  Target,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import {
  PORTFOLIO_TOTAL,
  PORTFOLIO_CHANGE,
  QUICK_STATS,
  GOAL_DATA,
} from '../constants/data';
import { MarketTicker } from '../components/MarketTicker';

interface HomeScreenProps {
  navigation: any;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const QuickStatIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'layers':
      return <Layers size={14} color={COLORS.primary} />;
    case 'repeat':
      return <Repeat size={14} color={COLORS.primary} />;
    case 'target':
      return <Target size={14} color={COLORS.primary} />;
    default:
      return null;
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the banner
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [fadeAnim, slideAnim, pulseAnim]);

  const handleWhispererBanner = () => {
    navigation.navigate('Whisperer');
  };

  const handleGoalWhisperer = () => {
    navigation.navigate('Whisperer', { autoMessage: GOAL_DATA.autoMessage });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MarketTicker />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Greeting */}
          <Text style={styles.greeting}>
            {getGreeting()}, Arjun 👋
          </Text>

          {/* Portfolio Summary Card */}
          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
            <Text style={styles.portfolioValue}>{PORTFOLIO_TOTAL}</Text>
            <View style={styles.changeRow}>
              <TrendingDown size={14} color={COLORS.red} />
              <Text style={styles.changeText}>{PORTFOLIO_CHANGE}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            {QUICK_STATS.map((stat, index) => (
              <View key={index} style={styles.statChip}>
                <QuickStatIcon icon={stat.icon} />
                <Text style={styles.statText}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* What happened today? banner */}
          <TouchableOpacity
            onPress={handleWhispererBanner}
            activeOpacity={0.85}
          >
            <Animated.View
              style={[
                styles.whispererBanner,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.bannerContent}>
                <MessageCircle size={20} color={COLORS.white} />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>What happened today?</Text>
                  <Text style={styles.bannerSubtitle}>
                    Tap to ask Portfolio Whisperer
                  </Text>
                </View>
              </View>
              <View style={styles.bannerDot} />
            </Animated.View>
          </TouchableOpacity>

          {/* Goal Tracker */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Goal Tracker</Text>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Target size={18} color={COLORS.amber} />
              </View>
              <Text style={styles.goalName}>{GOAL_DATA.name}</Text>
            </View>

            <View style={styles.goalDetails}>
              <View style={styles.goalRow}>
                <Text style={styles.goalLabel}>Target</Text>
                <Text style={styles.goalValue}>
                  {GOAL_DATA.target} by {GOAL_DATA.targetYear}
                </Text>
              </View>
              <View style={styles.goalRow}>
                <Text style={styles.goalLabel}>Trajectory</Text>
                <Text style={styles.goalTrajectory}>
                  {GOAL_DATA.currentTrajectory}{' '}
                  <Text style={styles.goalShortfall}>
                    ({GOAL_DATA.shortfall} short)
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.goalStatus}>
              <AlertTriangle size={14} color={COLORS.amber} />
              <Text style={styles.goalStatusText}>{GOAL_DATA.status}</Text>
            </View>

            <TouchableOpacity
              style={styles.goalButton}
              onPress={handleGoalWhisperer}
              activeOpacity={0.8}
            >
              <MessageCircle size={14} color={COLORS.white} />
              <Text style={styles.goalButtonText}>Ask Whisperer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  greeting: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  portfolioCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  portfolioLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  portfolioValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.red,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm,
  },
  statText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  whispererBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.lg,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.amber,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  goalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  goalDetails: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  goalTrajectory: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  goalShortfall: {
    color: COLORS.red,
    fontWeight: '700',
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.amberLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  goalStatusText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.amber,
    fontWeight: '600',
    flex: 1,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  goalButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
