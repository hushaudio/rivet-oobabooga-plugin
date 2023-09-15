import * as esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "neutral",
  target: "es2020",
  outfile: "dist/oobabooga-rivet-v1_02.js",
  format: "esm",
});
