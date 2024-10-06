import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/api/hello`
      DynamicRoutes: never
      DynamicRouteTemplate: never
      IsTyped: true
    }
  }
}