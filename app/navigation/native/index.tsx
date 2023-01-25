import React from 'react';
import { HomeScreen } from 'app/screens/home';
import { UserScreen } from 'app/screens/user';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<{
  home: undefined;
  user: {
    id: string;
  };
}>();

export function NativeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="user"
        component={UserScreen}
        options={{
          title: 'User',
        }}
      />
    </Stack.Navigator>
  );
}

export const routeMaps = {
  home: '',
  user: 'user/:id',
};
