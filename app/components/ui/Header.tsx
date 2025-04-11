import { View, Text, StyleSheet } from 'react-native';
import BackButton from './BackButton';

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.headerContainer}>
      <BackButton />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
