import { useState, useEffect } from "react";

export const useQibla = (latitude?: number, longitude?: number) => {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const dLng = (KAABA_LNG - lng) * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lat2 = KAABA_LAT * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  useEffect(() => {
    if (latitude && longitude) {
      const qibla = calculateQiblaDirection(latitude, longitude);
      setQiblaDirection(qibla);
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Device orientation handling
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(360 - event.alpha);
      }
    };

    // Request permission for iOS 13+
    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (error) {
          console.error('Permission denied for device orientation');
        }
      } else {
        // For non-iOS devices
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  const relativeQibla = (qiblaDirection - deviceHeading + 360) % 360;

  return {
    qiblaDirection,
    deviceHeading,
    relativeQibla,
    loading
  };
};