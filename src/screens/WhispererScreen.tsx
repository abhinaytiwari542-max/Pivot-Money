import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Zap } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import {
  INITIAL_MESSAGES,
  QUICK_REPLIES,
  SYSTEM_PROMPT,
  PANIC_MESSAGE,
  getLocalResponse,
} from '../constants/data';
import { MarketTicker } from '../components/MarketTicker';
import { TypingIndicator } from '../components/TypingIndicator';
import { SkeletonLoader } from '../components/SkeletonLoader';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'purple' | 'teal' | 'panic' | 'user';
}

interface WhispererScreenProps {
  navigation: any;
  route: any;
}

// Global counter to persist across tab switches
let globalVisitCount = 0;

export const WhispererScreen: React.FC<WhispererScreenProps> = ({
  navigation,
  route,
}) => {
  const [messages, setMessages] = useState<Message[]>([...INITIAL_MESSAGES]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [panicShown, setPanicShown] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const liveDotAnim = useRef(new Animated.Value(0.4)).current;

  // Skeleton loading on first open
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 800);
    return () => clearTimeout(timer);
  }, [fadeAnim]);

  // Live dot pulse
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [liveDotAnim]);

  // Panic detection — track visits
  useEffect(() => {
    globalVisitCount++;
    if (globalVisitCount >= 3 && !panicShown) {
      setPanicShown(true);
      setMessages((prev) => [
        { ...PANIC_MESSAGE, id: `panic-${Date.now()}` },
        ...prev,
      ]);
    }
  }, [panicShown]);

  // Handle auto-message from navigation params
  useEffect(() => {
    const autoMessage = route?.params?.autoMessage;
    if (autoMessage) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        sendMessage(autoMessage);
      }, 500);
      // Clear the param so it doesn't re-trigger
      navigation.setParams({ autoMessage: undefined });
      return () => clearTimeout(timer);
    }
  }, [route?.params?.autoMessage]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      type: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    const hasApiKey = apiKey && apiKey !== 'your_anthropic_api_key_here';

    // Try Claude API first, fall back to local chatbot
    if (hasApiKey) {
      try {
        const conversationHistory = messages
          .filter((m) => m.role === 'assistant' || m.role === 'user')
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        conversationHistory.push({
          role: 'user',
          content: text.trim(),
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            system: SYSTEM_PROMPT,
            messages: conversationHistory,
          }),
        });

        const data = await response.json();
        const aiContent = data?.content?.[0]?.text;

        if (aiContent) {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: aiContent,
            type: 'purple',
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
          scrollToBottom();
          return;
        }
      } catch (_error) {
        // API failed — fall through to local chatbot
      }
    }

    // Local chatbot fallback with a realistic typing delay
    const localReply = getLocalResponse(text.trim());
    const typingDelay = Math.min(800 + localReply.length * 5, 2000);

    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: localReply,
        type: 'purple',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      scrollToBottom();
    }, typingDelay);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  if (showSkeleton) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MarketTicker />
        <View style={styles.skeletonHeader}>
          <Text style={styles.headerTitle}>Portfolio Whisperer</Text>
        </View>
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MarketTicker />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <Animated.View style={[styles.flex, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Portfolio Whisperer</Text>
              <View style={styles.liveIndicator}>
                <Animated.View
                  style={[styles.liveDot, { opacity: liveDotAnim }]}
                />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToBottom()}
          >
            {messages.map((message) => (
              <View key={message.id}>
                {message.type === 'panic' && (
                  <View style={styles.panicLabel}>
                    <Zap size={12} color={COLORS.amber} />
                    <Text style={styles.panicLabelText}>
                      Whisperer detected
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user'
                      ? styles.userBubble
                      : message.type === 'teal'
                      ? styles.tealBubble
                      : message.type === 'panic'
                      ? styles.panicBubble
                      : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' && styles.userMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}
            {isLoading && <TypingIndicator />}
          </ScrollView>

          {/* Quick Replies */}
          {!isLoading && messages.length <= 4 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesContainer}
            >
              {QUICK_REPLIES.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyPill}
                  onPress={() => handleQuickReply(reply)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask about your portfolio..."
                placeholderTextColor={COLORS.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                multiline={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.7}
              >
                <Send size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  skeletonHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  liveText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.green,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  panicLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: SPACING.lg,
    marginBottom: 4,
  },
  panicLabelText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.amber,
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 18,
    marginBottom: SPACING.md,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderTopLeftRadius: 4,
  },
  tealBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.tealLight,
    borderTopLeftRadius: 4,
  },
  panicBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.amberLight,
    borderTopLeftRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.amber,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  quickRepliesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  quickReplyPill: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  quickReplyText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
