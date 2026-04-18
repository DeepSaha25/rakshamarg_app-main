import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import { WebView } from 'react-native-webview';

import { AppTheme } from '@/constants/app-theme';
import { getWebAppUrl } from '@/constants/web-app';

type WebAppFrameProps = {
  path: string;
};

export function WebAppFrame({ path }: WebAppFrameProps) {
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const uri = useMemo(() => getWebAppUrl(path), [path]);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Could not load RakshaMarg web app</Text>
        <Text style={styles.errorBody}>Check your internet connection and web app URL configuration.</Text>

        <Pressable style={styles.primaryButton} onPress={() => { setHasError(false); setReloadKey((value) => value + 1); }}>
          <Text style={styles.primaryText}>Retry</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL(uri)}>
          <Text style={styles.secondaryText}>Open in browser</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WebView
      key={reloadKey}
      source={{ uri }}
      startInLoadingState
      onError={() => setHasError(true)}
      javaScriptEnabled
      domStorageEnabled
      geolocationEnabled
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={AppTheme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading RakshaMarg...</Text>
        </View>
      )}
      style={styles.webView}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: '#050505',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#050505',
  },
  loadingText: {
    color: '#C2CAD5',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#0A0F1F',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  errorBody: {
    color: '#C2CAD5',
    lineHeight: 20,
    marginBottom: 8,
  },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: AppTheme.colors.primary,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4D5D7A',
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryText: {
    color: '#D2DEEF',
    fontWeight: '700',
  },
});
