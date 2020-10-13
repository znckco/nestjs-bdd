import { TestingApp } from "#/index"
import { AppModule } from "./app/AppModule"
import { ExampleMatcher } from "./app/ExampleMatcher"

const app = new TestingApp(AppModule, [ExampleMatcher])

beforeAll(async () => await app.start())
afterAll(async () => await app.stop())

app.findInDir("./features-skip")
