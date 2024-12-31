/**
 * File: /src/Router.tsx
 * Project: @platform/vscode
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
