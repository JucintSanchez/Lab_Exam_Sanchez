import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import API from './API'; // Update the path if necessary

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <API />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
