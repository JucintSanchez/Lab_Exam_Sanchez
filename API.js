import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const API = () => {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchPlaceName(latitude, longitude);
      },
      error => {
        setErrorMsg('Error getting location: ' + error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=6edc76aa2cac4f94a4d8f5ea749f4ca9&q=${latitude},${longitude}&pretty=1`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        setPlaceName(address);
      } else {
        setPlaceName('Place name not found');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setPlaceName('Error fetching place name');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLocation = async () => {
    if (!searchInput) {
      setErrorMsg('Please enter a place name');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=6edc76aa2cac4f94a4d8f5ea749f4ca9&q=${encodeURIComponent(searchInput)}&pretty=1`
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setLocation({ latitude: lat, longitude: lng });
        setPlaceName(response.data.results[0].formatted);
        setErrorMsg(null);
        Keyboard.dismiss();
      } else {
        setErrorMsg('Place not found');
      }
    } catch (error) {
      console.error('Error fetching place coordinates:', error);
      setErrorMsg('Error fetching place coordinates');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    requestLocation();
  };

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <Text style={styles.title}>Location Information</Text>

        {/* Input for place name */}
        <TextInput
          style={styles.input}
          placeholder="Enter place name"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          onSubmitEditing={handleChangeLocation}
        />

        {/* Button to change location */}
        <TouchableOpacity style={styles.button} onPress={handleChangeLocation}>
          <Text style={styles.buttonText}>Change Location</Text>
        </TouchableOpacity>

        {/* Button to refresh current location */}
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh Current Location</Text>
        </TouchableOpacity>

        {/* Loading indicator or error message */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Fetching location...</Text>
          </View>
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
            <Text style={styles.locationText}>Place: {placeName}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#d5f5e3',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  locationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default API;
