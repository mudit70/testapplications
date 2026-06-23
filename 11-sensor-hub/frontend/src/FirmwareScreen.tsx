import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { listFirmware, uploadFirmware } from './api';

export default function FirmwareScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    listFirmware().then((r) => setCount(r.count));
  }, []);

  const handleUpload = async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])]);
    await uploadFirmware(blob);
    const r = await listFirmware();
    setCount(r.count);
  };

  return (
    <View>
      <Text>Firmware images: {count}</Text>
      <TouchableOpacity onPress={handleUpload}>
        <Text>Upload Firmware</Text>
      </TouchableOpacity>
    </View>
  );
}
