/*
 * File: /tests/setup.ts
 * Project: @multiplatform.one/router
 * File Created: 29-12-2024 07:27:00
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "@testing-library/react";
import { vi } from "vitest";

// Mock react-native
vi.mock("react-native", () => ({
  Platform: {
    OS: "web",
    select: (obj: any) => obj.web,
  },
}));

// Mock react-navigation
vi.mock("@react-navigation/native", () => ({
  useNavigation: vi.fn(() => ({
    navigate: vi.fn(),
    push: vi.fn(),
    goBack: vi.fn(),
  })),
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: "/" })),
}));

// Mock one package
vi.mock("one", () => ({
  default: {
    head: {
      title: vi.fn(),
    },
  },
}));
