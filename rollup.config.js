import pc from "picocolors"

import { defineConfig } from "rollup"
import swc from "@rollup/plugin-swc"
import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import { visualizer } from "rollup-plugin-visualizer"
import obfuscator from "rollup-plugin-obfuscator"

import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { copyFileSync, mkdirSync, existsSync, readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC_DIR = join(__dirname, "src")
const DIST_DIR = join(__dirname, "dist")
const TEMPLATES_DIR = join(SRC_DIR, "templates")
const DIST_TEMPLATES_DIR = join(DIST_DIR, "templates")

const TEMPLATE_FILES = ["swc-config.json", "ts-config.json", "eslint-config.json", "prettier-config.json"]

/**
 * copyTemplatesPlugin
 * @plugin
 * @desc 템플릿 파일들을 dist/templates 폴더로 복사
 */
function copyTemplatesPlugin() {
  return {
    name: "copy-templates",
    buildStart() {
      try {
        if (!existsSync(DIST_TEMPLATES_DIR)) {
          mkdirSync(DIST_TEMPLATES_DIR, { recursive: true })
        }

        console.log(pc.cyan(pc.bold("\n🔄 Copying templates...\n")))

        TEMPLATE_FILES.forEach((template) => {
          try {
            const source = join(TEMPLATES_DIR, template)
            const target = join(DIST_TEMPLATES_DIR, template)

            if (existsSync(source)) {
              copyFileSync(source, target)
              console.log(`${pc.green("✓")} ${template} ${pc.dim("→")} ${pc.yellow("dist/templates")}`)
            } else {
              console.warn(`${pc.red("✗")} ${pc.yellow(template)} ${pc.red("file not found")}`)
            }
          } catch (err) {
            console.error(`${pc.red("✗")} ${pc.yellow(template)} ${pc.red("error")}: ${pc.red(err.message)}`)
          }
        })
        console.log("")
      } catch (error) {
        console.error(pc.red(`\n❌ Error occurred while copying templates: ${error.message}\n`))
      }
    },
  }
}

/**
 * shebangPlugin
 * @plugin
 * @desc 실행 파일에 #!/usr/bin/env node 추가
 */
function shebangPlugin() {
  return {
    name: "shebang",
    renderChunk(code, chunk, outputOptions) {
      if (code.startsWith("#!/usr/bin/env node")) {
        return { code, map: null }
      }

      return {
        code: "#!/usr/bin/env node\n" + code,
        map: outputOptions.sourcemap ? null : null,
      }
    },
  }
}

/**
 * jsExtensionAdapterPlugin
 * @plugin
 * @desc TypeScript 파일이 .js 확장자로 import될 때 매핑
 */
function jsExtensionAdapterPlugin() {
  return {
    name: "js-extension-adapter",
    resolveId(source, importer) {
      // .js로 끝나는 임포트만 처리 (JSON 파일 제외)
      if (source.endsWith(".js") && importer) {
        // .js를 .ts로 변경
        const tsSource = source.replace(/\.js$/, ".ts")

        // .ts 파일이 존재하는지 확인하기 위해 resolve 시도
        return this.resolve(tsSource, importer, { skipSelf: true }).catch(() => null)
      }

      // 경로 별칭 처리 (#으로 시작하는 경로)
      if (source.startsWith("#") && source.endsWith(".js") && !source.endsWith(".json.js") && importer) {
        // #으로 시작하는 경로에서 .js 확장자를 .ts로 변환 시도
        const tsSource = source.replace(/\.js$/, ".ts")
        return this.resolve(tsSource, importer, { skipSelf: true }).catch(() => null)
      }

      return null
    },
  }
}

/**
 * jsonImportPlugin
 * @plugin
 * @desc JSON 파일 임포트를 처리하고 `with { type: 'json' }` 구문을 지원
 */
function jsonImportPlugin() {
  return {
    name: "json-import",
    resolveId(source, importer) {
      // #으로 시작하는 경로 별칭 + .json 확장자 처리
      if (source.startsWith("#") && source.endsWith(".json")) {
        const resolved = this.resolve(source, importer, { skipSelf: true })
        return resolved
      }

      // 일반 .json 파일
      if (source.endsWith(".json")) {
        return { id: source, external: false }
      }

      return null
    },
    load(id) {
      if (id.endsWith(".json")) {
        try {
          const json = JSON.parse(readFileSync(id, "utf8"))
          const code = `export default ${JSON.stringify(json)};`
          return {
            code,
            map: { mappings: "" }, // 빈 소스맵 생성
          }
        } catch (e) {
          console.error(`Error loading JSON file: ${id}`, e)
          return null
        }
      }
      return null
    },
    transform(code, id) {
      // import assertions의 `with { type: 'json' }` 구문을 처리
      if (code.includes("with { type: 'json' }") && id.endsWith(".ts")) {
        // 단순히 구문을 제거하는 방식으로 처리
        const result = code.replace(/with\s*\{\s*type\s*:\s*['"]json['"]\s*\}/g, "")
        return {
          code: result,
          map: { mappings: "" }, // 빈 소스맵 생성
        }
      }
      return null
    },
  }
}

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
      compact: true,
      hoistTransitiveImports: true,
    },
  ],
  treeshake: {
    preset: "smallest",
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false,
  },
  plugins: [
    jsExtensionAdapterPlugin(),
    jsonImportPlugin(),
    swc({
      $schema: "https://swc.rs/schema.json",
      include: ["**/*.ts"],
      exclude: [],
      jsc: {
        baseUrl: "./",
        paths: {
          "#commands/*": ["src/commands/*"],
          "#factories/*": ["src/factories/*"],
          "#libs/*": ["src/libs/*"],
          "#common/*": ["src/common/*"],
          "#creators/*": ["src/creators/*"],
          "#templates/*": ["src/templates/*"],
          "#errors/*": ["src/errors/*"],
          "#interfaces/*": ["src/interfaces/*"],
        },
        parser: {
          syntax: "typescript",
          tsx: false,
          decorators: false,
          dynamicImport: true,
          importAssertions: true,
          resolveJsonModule: true,
        },
        minify: {
          compress: {
            unused: true,
          },
          mangle: true,
        },
        target: "es2022",
        loose: false,
        keepClassNames: true,
        externalHelpers: false,
      },
      module: {
        type: "es6",
      },
      minify: true,
      isModule: true,
      sourceMaps: true,
    }),
    nodeResolve({
      extensions: [".ts", ".js", ".json"],
      preferBuiltins: true,
    }),
    commonjs({
      extensions: [".js"], // Only process JS files
      transformMixedEsModules: true,
    }),
    obfuscator({
      fileOptions: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ["base64"],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersType: "function",
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
      },
    }),
    shebangPlugin(),
    copyTemplatesPlugin(),
    visualizer({
      filename: "./reports/rollup-report.html",
      title: "Rollup Report",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ].filter(Boolean), // filter(Boolean)으로 falsy 값 제거
  external: [
    "fs",
    "ora",
    "url",
    "path",
    "axios",
    "execa",
    "date-fns",
    "commander",
    "es-toolkit",
    "picocolors",
    "cli-progress",
    "child_process",
    "@clack/prompts",
  ],
})
