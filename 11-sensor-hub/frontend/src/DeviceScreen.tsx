import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getDevice, listReadings, postReading, deleteDevice } from './api';

export default function DeviceScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [device, setDevice] = useState<any>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getDevice(id).then(setDevice);
    listReadings(id).then((r) => setCount(r.count));
  }, [id]);

  const handlePostReading = async () => {
    await postReading(id, Math.random() * 100);
    const r = await listReadings(id);
    setCount(r.count);
  };

  const handleDelete = async () => {
    await deleteDevice(id);
    navigation.goBack();
  };

  return (
    <View>
      <Text>{device?.name}</Text>
      <Text>Readings: {count}</Text>
      <TouchableOpacity onPress={handlePostReading}>
        <Text>Post Reading</Text>
      </TouchableOpacity>
      <TouchableOpacity onLongPress={handleDelete}>
        <Text>Delete Device</Text>
      </TouchableOpacity>
    </View>
  );
}
