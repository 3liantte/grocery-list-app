// components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Link } from 'expo-router';  // Assuming you're using expo-router for navigation (adapt accordingly)

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  to?: string; // Add navigation target
  children?: React.ReactNode; // Allow icons or other elements as children
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  color = '#007BFF', 
  textColor = '#fff', 
  style, 
  textStyle, 
  to, 
  children 
}) => {
  const renderButtonContent = () => {
    if (children) {
      return <>{children}</>;
    }
    return <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>;
  };

  if (to) {
    // If `to` is passed, it will be treated as a navigation link
    return (
      <Link href={to as any} asChild>
        <TouchableOpacity style={[styles.button, { backgroundColor: color }, style]}>
          {renderButtonContent()}
        </TouchableOpacity>
      </Link>
    );
  }

  // Regular button without navigation
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }, style]}>
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
