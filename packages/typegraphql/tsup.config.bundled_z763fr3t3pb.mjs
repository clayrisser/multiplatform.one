// tsup.config.ts
import { lookupTranspileModules } from "@multiplatform.one/utils/dev";
import { defineConfig } from "tsup";
const __injected_dirname__ = "/workspace/development/packages/typegraphql";
const tsup_config_default = defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: ["src/**/*.ts?(x)"],
  entryPoints: ["src/index.ts"],
  format: ["esm"],
  minify: false,
  outDir: "lib",
  skipNodeModulesBundle: true,
  noExternal: lookupTranspileModules([__injected_dirname__]),
  splitting: true,
  target: "es2022",
});
export { tsup_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL3dvcmtzcGFjZS9kZXZlbG9wbWVudC9wYWNrYWdlcy90eXBlZ3JhcGhxbC90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvd29ya3NwYWNlL2RldmVsb3BtZW50L3BhY2thZ2VzL3R5cGVncmFwaHFsXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy93b3Jrc3BhY2UvZGV2ZWxvcG1lbnQvcGFja2FnZXMvdHlwZWdyYXBocWwvdHN1cC5jb25maWcudHNcIjsvKlxuICogRmlsZTogL3RzdXAuY29uZmlnLnRzXG4gKiBQcm9qZWN0OiBAbXVsdGlwbGF0Zm9ybS5vbmUvdHlwZWdyYXBocWxcbiAqIEZpbGUgQ3JlYXRlZDogMDQtMDQtMjAyNCAxNTo1MDozOVxuICogQXV0aG9yOiBDbGF5IFJpc3NlclxuICogLS0tLS1cbiAqIEJpdFNwdXIgKGMpIENvcHlyaWdodCAyMDIxIC0gMjAyNFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBsb29rdXBUcmFuc3BpbGVNb2R1bGVzIH0gZnJvbSBcIkBtdWx0aXBsYXRmb3JtLm9uZS91dGlscy9kZXZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ0c3VwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1bmRsZTogdHJ1ZSxcbiAgY2xlYW46IHRydWUsXG4gIGR0czogdHJ1ZSxcbiAgZW50cnk6IFtcInNyYy8qKi8qLnRzPyh4KVwiXSxcbiAgZW50cnlQb2ludHM6IFtcInNyYy9pbmRleC50c1wiXSxcbiAgZm9ybWF0OiBbXCJlc21cIl0sXG4gIG1pbmlmeTogZmFsc2UsXG4gIG91dERpcjogXCJsaWJcIixcbiAgc2tpcE5vZGVNb2R1bGVzQnVuZGxlOiB0cnVlLFxuICBub0V4dGVybmFsOiBsb29rdXBUcmFuc3BpbGVNb2R1bGVzKFtfX2Rpcm5hbWVdKSxcbiAgc3BsaXR0aW5nOiB0cnVlLFxuICB0YXJnZXQ6IFwiZXMyMDIyXCIsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFxQkEsU0FBUyw4QkFBOEI7QUFDdkMsU0FBUyxvQkFBb0I7QUF0QjhELElBQU0sdUJBQXVCO0FBd0J4SCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsRUFDUixPQUFPO0FBQUEsRUFDUCxLQUFLO0FBQUEsRUFDTCxPQUFPLENBQUMsaUJBQWlCO0FBQUEsRUFDekIsYUFBYSxDQUFDLGNBQWM7QUFBQSxFQUM1QixRQUFRLENBQUMsS0FBSztBQUFBLEVBQ2QsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBQ1IsdUJBQXVCO0FBQUEsRUFDdkIsWUFBWSx1QkFBdUIsQ0FBQyxvQkFBUyxDQUFDO0FBQUEsRUFDOUMsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUNWLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
