import React from 'react';
import F1Inline from './components/F1Inline';
import F2LocalFn from './components/F2LocalFn';
import F3ModuleFn from './components/F3ModuleFn';
import F4ClassMethod from './components/F4ClassMethod';
import F5Hook from './components/F5Hook';
import F6WrapperDynamic from './components/F6WrapperDynamic';
import F7Backend from './components/F7Backend';
import F8Backend from './components/F8Backend';
import F9Backend from './components/F9Backend';
import VehicleManager from './components/VehicleManager';
import TripManager from './components/TripManager';
import DriverList from './components/DriverList';

export default function App() {
  return (
    <div>
      <h1>DeepFleet — Dispatch Rung Matrix</h1>
      <F1Inline />
      <F2LocalFn />
      <F3ModuleFn />
      <F4ClassMethod />
      <F5Hook />
      <F6WrapperDynamic />
      <F7Backend />
      <F8Backend />
      <F9Backend />
      <VehicleManager />
      <TripManager />
      <DriverList />
    </div>
  );
}
