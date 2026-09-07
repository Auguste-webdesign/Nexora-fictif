import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    /**
     * Vendored raw-WebGL component. Two rules are relaxed here and nowhere else:
     *
     * - `no-explicit-any`: the WebGL1/WebGL2 context is deliberately untyped.
     *   The component switches between the two at runtime and reads extension
     *   objects whose members differ between them, so a single concrete type
     *   would be a lie. Typing it as `any` is the component's own choice.
     *
     * - `react-hooks/refs`: the density dirty-flag is set during render on
     *   purpose. Density is the one prop that changes how many points exist, so
     *   it cannot be a plain live ref read like the others; the flag is consumed
     *   by the rAF loop, which rebuilds buffers and textures in place rather
     *   than tearing down the GL context. Moving it into an effect would rebuild
     *   the field a frame late and, on the first mount, before the loop starts.
     *
     * Scoped to this file so the rules stay enforced across the rest of src/.
     */
    files: ["src/components/background/cursor-ring-field.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
