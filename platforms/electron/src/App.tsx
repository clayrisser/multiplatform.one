/**
 * File: /src/App.tsx
 * Project: @platform/electron
 */

import { Layout } from "app/screens/_layout";
import { Screen as HomeScreen } from "app/screens/home";
import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
      </Route>
    </Routes>
  );
}
