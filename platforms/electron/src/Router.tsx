/**
 * File: /src/Routes.tsx
 * Project: @platform/electron
 */

import { Layout } from "app/screens/_layout";
import { Screen as HomeScreen } from "app/screens/home";
import { Route, Routes } from "react-router-dom";

export function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Layout>
  );
}
