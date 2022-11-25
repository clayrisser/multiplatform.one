/**
 * File: /src/multiplatformBase.ts
 * Project: multiplatform.one
 * File Created: 09-11-2022 09:50:38
 * Author: Clay Risser
 * -----
 * Last Modified: 25-11-2022 10:11:16
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

export enum MultiPlatformOS {
  ExpoAndroid = "ExpoAndroid",
  ExpoIos = "ExpoIos",
  ExpoWeb = "ExpoWeb",
  Next = "Next",
  NextSsr = "NextSsr",
  StorybookExpoAndroid = "StorybookExpoAndroid",
  StorybookExpoIos = "StorybookExpoIos",
  StorybookExpoWeb = "StorybookExpoWeb",
  StorybookWeb = "StorybookWeb",
  Unknown = "Unknown",
}

export class MultiPlatformBase {
  static OS = MultiPlatformOS.Unknown;

  static isExpo() {
    return false;
  }

  static isNative() {
    return false;
  }

  static isWeb() {
    return false;
  }

  static isStorybook() {
    return typeof window.__STORYBOOK_ADDONS === "object";
  }

  static isSsr() {
    return typeof window === "undefined";
  }

  static isNext() {
    return false;
  }
}
