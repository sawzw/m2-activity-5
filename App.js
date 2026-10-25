import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, GeoJSONSource, Layer, Map, UserLocation, ViewAnnotation } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import './tasks/geofenceTask'; // loading this file defines the background task
import { FENCES, GEOFENCE_TASK } from './lib/fences';

const HOME_COORDINATE = [100.300455, 5.410035];
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const circleFeature = ({ identifier, latitude, longitude, radius }) => {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const coordinates = Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * 2 * Math.PI;
    const lat = latitude + (radius / 111320) * Math.cos(angle);
    const lng = longitude + (radius / (111320 * Math.cos(latitudeRadians))) * Math.sin(angle);
    return [lng, lat];
  });

  return {
    type: 'Feature',
    properties: { identifier },
    geometry: { type: 'Polygon', coordinates: [coordinates] },
  };
};

const fenceShape = {
  type: 'FeatureCollection',
  features: FENCES.map(circleFeature),
};

// Show alerts even if the app happens to be open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

// TODO 2: Ask for what the alerts need, in the right order.
//
// Outcome: askPermissions() asks for foreground location, then background location, then
//          notification permission, stopping at the first one the user refuses. It returns
//          { ok: true } when all three are granted, or { ok: false, reason } with a plain
//          sentence saying what is missing. enableAlerts below already shows the explanation first.
// Verify:  deny background location: the panel shows your sentence and the app still works.
// Reflect (in your Notes doc): why must the two location prompts come in this order?
//
// Your code below ↓
async function askPermissions() {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    return { ok: false, reason: 'Foreground location permission is needed to set up place alerts.' };
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== 'granted') {
    return { ok: false, reason: 'Background location permission is needed to alert you when the app is closed.' };
  }

  const notifications = await Notifications.requestPermissionsAsync();
  if (notifications.status !== 'granted') {
    return { ok: false, reason: 'Notification permission is needed to show place alerts.' };
  }

  return { ok: true };
}

// TODO 3: Hand the two circles in lib/fences.js to the operating system.
//
// Outcome: both fences are being watched, for entering and for leaving, using the task from
//          tasks/geofenceTask.js, so the status line reads "Watching 2 places" after the button.
// Verify:  with a simulated location inside UM Library, your task logs ENTER (TODO 1).
// Reflect (in your Notes doc): how many fences can iOS keep active, and what does that limit?
//
// Your code below ↓
async function registerFences() {
  if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK)) {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
  }

  await Location.startGeofencingAsync(
    GEOFENCE_TASK,
    FENCES.map(({ name, ...region }) => ({
      ...region,
      notifyOnEnter: true,
      notifyOnExit: true,
    }))
  );
}

export default function App() {
  const [watching, setWatching] = useState(false);
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    Location.hasStartedGeofencingAsync(GEOFENCE_TASK)
      .then(setWatching)
      .catch(() => setWatching(false));
  }, []);

  const enableAlerts = () => {
    // Provided: the explanation comes before any system prompt.
    Alert.alert(
      'Place alerts',
      'We use your location, even when the app is closed, only to tell you when you arrive home. Nothing leaves your phone.',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            const result = await askPermissions();
            if (!result.ok) {
              setProblem(result.reason);
              return;
            }
            setProblem(null);
            await registerFences();
            setWatching(true);
          },
        },
      ]
    );
  };

  // Provided: stopping is already wired so you can switch the fences off between tests.
  const disableAlerts = async () => {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
    setWatching(false);
  };

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
      >
        <Camera initialViewState={{ center: HOME_COORDINATE, zoom: 16.5 }} />
        <UserLocation animated accuracy />
        <GeoJSONSource id="home-fences" data={fenceShape}>
          <Layer
            id="home-fences-fill"
            type="fill"
            paint={{ 'fill-color': '#1a73e8', 'fill-opacity': 0.15 }}
          />
          <Layer
            id="home-fences-outline"
            type="line"
            paint={{ 'line-color': '#1a73e8', 'line-width': 2 }}
          />
        </GeoJSONSource>
        <ViewAnnotation lngLat={HOME_COORDINATE} anchor="bottom" offset={[0, -8]}>
          <View style={styles.homeMarker}>
            <Text style={styles.homeMarkerText}>Home</Text>
          </View>
        </ViewAnnotation>
      </Map>

      <View style={styles.panel}>
        <Text style={styles.status}>{watching ? 'Watching 2 places' : 'Alerts are off'}</Text>
        {problem ? <Text style={styles.problem}>{problem}</Text> : null}
        <Pressable style={[styles.button, watching && styles.buttonOff]} onPress={watching ? disableAlerts : enableAlerts}>
          <Text style={styles.buttonText}>{watching ? 'Turn alerts off' : 'Turn alerts on'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  homeMarker: { backgroundColor: '#1a73e8', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  homeMarkerText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  panel: { position: 'absolute', left: 16, right: 16, bottom: 32, backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 6 },
  status: { fontSize: 17, fontWeight: '600', marginBottom: 6 },
  problem: { color: '#b3261e', marginBottom: 8 },
  button: { backgroundColor: '#188038', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonOff: { backgroundColor: '#5f6368' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
