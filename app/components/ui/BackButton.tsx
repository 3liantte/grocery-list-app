import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BackButton = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === 'dark' ? '#fff' : '#000'; // Auto detect

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.button}>
      <Ionicons name="chevron-back" size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default BackButton;
