import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message'; // Import Toast
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { top } = useSafeAreaInsets(); // Get top inset value based on device's safe area
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // Disable header globally
          contentStyle: {
            paddingTop: top, // Ensure top padding for safe area
            flex: 1, // Ensure the content takes up the whole screen
          },
        }}
      >        
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} // Set status bar text color based on theme
        backgroundColor={colorScheme === 'dark' ? '#111827' : '#fff'} // Match the status bar background color
      />
      <Toast />
    </ThemeProvider>
  );
}
