import { TestingApp } from "#/index"
import { loadFeature } from "jest-cucumber"
import { AppModule } from "./app/AppModule"
import { ExampleMatcher } from "./app/ExampleMatcher"

const app = new TestingApp(AppModule, [ExampleMatcher], {
  beforeCompile: (builder) => {
    expect(builder).toBeTruthy()
  },
  createApp: (builder) => builder.createNestApplication(),
})

beforeAll(async () => await app.start())
afterAll(async () => await app.stop())

app.forFeatures([loadFeature(`${__dirname}/features/simple.feature`)])
