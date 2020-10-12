import { Type } from "@nestjs/common"
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing"
import { NestApplication } from "@nestjs/core"
import glob from "fast-glob"
import { defineFeature, loadFeature } from "jest-cucumber"
import type { ParsedFeature } from "jest-cucumber/dist/src/models"
import Path from "path"
import { MatcherRegistry } from "./services/MatcherRegistry"
import { createContext } from "./TestingContext"
import callsites from "callsites"

export class TestingApp {
  private app?: NestApplication
  private container?: TestingModule

  constructor(
    private readonly AppModule: Type<any>,
    private readonly matchers: Array<Type<any>>,
    private readonly options: {
      beforeCompile?: (builder: TestingModuleBuilder) => void
      createApp?: (testing: TestingModule) => NestApplication
    } = {},
  ) {}

  async start(): Promise<void> {
    const builder = Test.createTestingModule({
      imports: [this.AppModule],
      providers: [MatcherRegistry, ...this.matchers],
    })

    if (this.options.beforeCompile != null) {
      this.options.beforeCompile(builder)
    }

    const container = await builder.compile()

    const createApp =
      this.options.createApp ?? (() => container.createNestApplication())

    const app = createApp(container)

    await app.init()

    container.get(MatcherRegistry).loadMatchers(this.matchers)

    this.container = container
    this.app = app
  }

  async stop(): Promise<void> {
    // istanbul ignore else
    if (this.app != null) {
      await this.app.close()
    }
  }

  findInDir(featureDir: string): void {
    if (featureDir.startsWith(".")) {
      const callSite = callsites()[1]
      let fileName: string | null

      // istanbul ignore else
      if (callSite != null && (fileName = callSite.getFileName()) != null) {
        featureDir = Path.resolve(Path.dirname(fileName), featureDir)
      }
    }

    this.findInFiles(
      glob.sync("**/*.feature", { cwd: featureDir, absolute: true }),
    )
  }

  findInFiles(fileNames: string[]): void {
    this.forFeatures(fileNames.map((fileName) => loadFeature(fileName)))
  }

  forFeatures(features: ParsedFeature[]): void {
    features.forEach((feature) => {
      defineFeature(feature, (test) => {
        feature.scenarios.forEach((scenario) => {
          test(scenario.title, (keywords) => {
            const context = createContext(feature)
            scenario.steps.forEach((step) => {
              const keyword = keywords[step.keyword as keyof typeof keywords]
              keyword(step.stepText, () => {
                // istanbul ignore if
                if (this.container == null) {
                  throw new Error(
                    "TestingApp not initialized. Make sure you call init() method in beforeAll() hook.",
                  )
                }

                const [re, fn] = this.container
                  .get(MatcherRegistry)
                  .getMatcherFor(step.stepText)

                if (typeof re === "string") {
                  fn(context)
                } else {
                  const args = re.exec(step.stepText)! // eslint-disable-line @typescript-eslint/no-non-null-assertion
                  fn(context, ...args.slice(1))
                }
              })
            })
          })
        })
      })
    })
  }
}
