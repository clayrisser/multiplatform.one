/**
 * File: /src/index.ts
 * Project: @multiplatform.one/use-store
 * File Created: 20-11-2024 04:57:59
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

import type { NavigationProp } from "@react-navigation/native";
import {
  type OneRouter,
  useLinkTo as useOneLinkTo,
  useNavigation as useOneNavigation,
  useParams as useOneParams,
  usePathname as useOnePathname,
  useRouter as useOneRouter,
} from "one";
import type { GestureResponderEvent } from "react-native";
import {
  useLocation,
  useNavigate,
  useParams as useReactParams,
} from "react-router-dom";

const ROUTER_ERROR = "must use one or react-router-dom for router";

export function useRouter(): OneRouter.Router {
  if (
    typeof useLocation === "undefined" ||
    typeof useNavigate === "undefined"
  ) {
    if (typeof useOneRouter === "undefined") {
      throw new Error(ROUTER_ERROR);
    }
    return useOneRouter();
  }
  const location = useLocation();
  const navigate = useNavigate();
  const oneRouter = useOneRouter();
  return {
    onLoadState: oneRouter.onLoadState,
    subscribe: oneRouter.subscribe,
    back() {
      navigate(-1);
    },
    canGoBack() {
      return window.history.length > 1;
    },
    push(href: OneRouter.Href, options?: OneRouter.LinkToOptions) {
      navigate(href.toString(), { replace: false, ...options });
    },
    navigate(href: OneRouter.Href, options?: OneRouter.LinkToOptions) {
      navigate(href.toString(), { replace: false, ...options });
    },
    replace(href: OneRouter.Href, options?: OneRouter.LinkToOptions) {
      navigate(href.toString(), { replace: true, ...options });
    },
    dismiss(count = 1) {
      navigate(-count);
    },
    dismissAll() {
      navigate("/");
    },
    canDismiss() {
      return location.pathname !== "/";
    },
    setParams<T = "">(
      params?: T extends ""
        ? Record<string, string | undefined | null>
        : OneRouter.InputRouteParams<T>,
    ) {
      const searchParams = new URLSearchParams(location.search);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            searchParams.delete(key);
          } else {
            searchParams.set(key, String(value));
          }
        });
      }
      navigate(`${location.pathname}?${searchParams.toString()}`);
    },
  };
}

export function usePathname(): string {
  if (
    typeof useLocation === "undefined" ||
    typeof useNavigate === "undefined"
  ) {
    if (typeof useOnePathname === "undefined") {
      throw new Error(ROUTER_ERROR);
    }
    return useOnePathname();
  }
  return useLocation().pathname;
}

export function useParams<T extends string | undefined = string>(): Record<
  string,
  T
> {
  if (
    typeof useLocation === "undefined" ||
    typeof useNavigate === "undefined"
  ) {
    if (typeof useOneParams === "undefined") {
      throw new Error(ROUTER_ERROR);
    }
    return useOneParams();
  }
  return useReactParams() as Record<string, T>;
}

export function useNavigation<
  T = NavigationProp<ReactNavigation.RootParamList>,
>(parent?: string): T {
  if (
    typeof useLocation === "undefined" ||
    typeof useNavigate === "undefined"
  ) {
    if (typeof useOneNavigation === "undefined") {
      throw new Error(ROUTER_ERROR);
    }
    return useOneNavigation(parent);
  }
  const navigate = useNavigate();
  const location = useLocation();
  return {
    navigate(name: string, params?: Record<string, any>) {
      navigate(name, { state: params });
    },
    goBack() {
      navigate(-1);
    },
    setParams(params: Record<string, any>) {
      navigate(location.pathname, { state: { ...location.state, ...params } });
    },
  } as T;
}

export function useLinkTo(props: { href: string; replace?: boolean }) {
  if (
    typeof useLocation === "undefined" ||
    typeof useNavigate === "undefined"
  ) {
    if (typeof useOneLinkTo === "undefined") {
      throw new Error(ROUTER_ERROR);
    }
    return useOneLinkTo(props);
  }
  const navigate = useNavigate();
  return {
    href: props.href.toString(),
    role: "link",
    onPress: (
      e?:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | GestureResponderEvent,
    ) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      navigate(props.href.toString(), { replace: props.replace });
    },
  };
}
