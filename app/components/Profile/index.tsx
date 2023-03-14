import React from 'react';
import { create } from 'zustand';

export const useStore = create(() => ({
  name: 'John',
  age: 30,
}));

export function Profile1() {
  const { name, age } = useStore();
  return (
    <div>
      <h1>Name: {name}</h1>
      <h2>Age: {age}</h2>
    </div>
  );
}
