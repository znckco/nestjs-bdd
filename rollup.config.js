import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import { typescriptPaths } from "rollup-plugin-typescript-paths"
import { dependencies, peerDependencies } from "./package.json"

const external = [
  "path",
  ...Array.from(Object.keys(dependencies)),
  ...Array.from(Object.keys(peerDependencies)),
]

export default [
  {
    input: "src/index.ts",
    output: { format: "cjs", file: "dist/bdd.js", sourcemap: true },
    plugins: [typescript()],
    external,
  },
  {
    input: "src/index.ts",
    output: {
      format: "esm",
      file: "dist/bdd.esm.js",
      sourcemap: true,
    },
    plugins: [typescript()],
    external,
  },
  {
    input: "src/index.ts",
    output: {
      format: "esm",
      file: "dist/bdd.d.ts",
      sourcemap: true,
    },
    plugins: [
      typescriptPaths({
        transform: (path) => path.replace(/\.js$/, ".ts"),
      }),
      dts(),
    ],
  },
]
