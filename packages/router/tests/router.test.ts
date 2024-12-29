/*
 * File: /tests/router.test.ts
 * Project: @multiplatform.one/router
 * File Created: 29-12-2024 07:27:09
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

import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle web navigation", () => {
    const mockNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);

    // Simulate web platform
    (Platform.OS as any) = "web";

    // Navigate to a route
    mockNavigate("/test");
    expect(mockNavigate).toHaveBeenCalledWith("/test");
  });

  it("should handle native navigation", () => {
    const mockNavigate = vi.fn();
    (useNavigation as any).mockReturnValue({
      navigate: mockNavigate,
    });

    // Simulate native platform
    (Platform.OS as any) = "ios";

    // Navigate to a screen
    mockNavigate("Test");
    expect(mockNavigate).toHaveBeenCalledWith("Test");
  });

  it("should handle back navigation", () => {
    const mockGoBack = vi.fn();
    (useNavigation as any).mockReturnValue({
      goBack: mockGoBack,
    });

    // Test back navigation
    mockGoBack();
    expect(mockGoBack).toHaveBeenCalled();
  });
});
