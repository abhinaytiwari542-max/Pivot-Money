import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Only apply frame on web with wide screens
  if (Platform.OS !== 'web' || windowWidth < 500) {
    return <>{children}</>;
  }

  const phoneHeight = Math.min(windowHeight - 80, 844);
  const phoneWidth = Math.min(390, phoneHeight * 0.462);

  return (
    <View style={styles.outerContainer}>
      {/* Background gradient panels */}
      <View style={styles.backgroundLeft}>
        <Text style={styles.brandTitle}>Pivot Money</Text>
        <Text style={styles.brandSubtitle}>
          Your AI-powered{'\n'}portfolio companion
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.featureText}>Real-time portfolio tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: '#534AB7' }]} />
            <Text style={styles.featureText}>AI Whisperer for insights</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.featureText}>Goal drift detection</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.featureText}>Panic guard system</Text>
          </View>
        </View>
      </View>

      {/* Phone frame */}
      <View style={[styles.phoneContainer, { height: phoneHeight, width: phoneWidth }]}>
        {/* Notch */}
        <View style={styles.notch}>
          <View style={styles.notchInner}>
            <View style={styles.camera} />
          </View>
        </View>

        {/* App content */}
        <View style={styles.screenContent}>
          {children}
        </View>

        {/* Bottom bar indicator */}
        <View style={styles.bottomBar}>
          <View style={styles.homeIndicator} />
        </View>
      </View>

      {/* Right side info */}
      <View style={styles.backgroundRight}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹5,84,230</Text>
          <Text style={styles.statLabel}>Portfolio Value</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#EF4444', fontSize: 20 }]}>−2.1%</Text>
          <Text style={styles.statLabel}>Today's Change</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#10B981', fontSize: 20 }]}>4 Funds</Text>
          <Text style={styles.statLabel}>Active Holdings</Text>
        </View>
        <Text style={styles.scanText}>
          📱 Scan QR in terminal{'\n'}to open on your phone
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F1A',
    gap: 60,
  },
  backgroundLeft: {
    width: 280,
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 24,
    marginBottom: 40,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  phoneContainer: {
    backgroundColor: '#000000',
    borderRadius: 48,
    padding: 8,
    // Phone shadow
    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  notch: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#000000',
    zIndex: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  notchInner: {
    width: 120,
    height: 28,
    backgroundColor: '#000000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  camera: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#2A2A3E',
  },
  screenContent: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F8F9FC',
  },
  bottomBar: {
    height: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3A3A4E',
  },
  backgroundRight: {
    width: 200,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scanText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
