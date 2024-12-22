/**
 * File: /src/App.tsx
 * Project: @platform/electron
 */

import { Layout } from "app/screens/_layout";
import { Screen as HomeScreen } from "app/screens/home";
import { config } from "multiplatform.one";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

console.log("C", config.get());

export function App() {
  useEffect(() => {
    console.log("App mounted");
    // @ts-ignore
    if (window.electronDebug) {
      // @ts-ignore
      window.electronDebug.log("App component initialized");
    }
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Layout>
  );
}
