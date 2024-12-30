/**
 * File: /test/Card.test.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 07:41:38
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

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../src";

describe("Card", () => {
  it("should render card with content", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>,
    );
    expect(screen.getByText("Card Content")).toBeDefined();
  });
});
