import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { listDevices, registerDevice } from './api';

export default function DeviceListScreen({ navigation }: any) {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    listDevices().then((d) => setDevices(d.devices));
  }, []);

  const handleAdd = async () => {
    await registerDevice('sensor-' + Date.now(), 'lab');
    const d = await listDevices();
    setDevices(d.devices);
  };

  const handleOpen = (id: number) => {
    navigation.navigate('Device', { id });
  };

  return (
    <View>
      <TouchableOpacity onPress={handleAdd}>
        <Text>Register Device</Text>
      </TouchableOpacity>
      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpen(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
