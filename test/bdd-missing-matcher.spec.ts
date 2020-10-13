import { TestingApp } from "#/index"
import { AppModule } from "./app/AppModule"
import { ExampleMatcher } from "./app/ExampleMatcher"

const app = new TestingApp(AppModule, [ExampleMatcher])

beforeAll(async () => await app.start())
afterAll(async () => await app.stop())

let fn: jest.SpyInstance
beforeEach(() => {
  fn = jest.spyOn(console, "warn").mockImplementation(() => {})
})

app.findInDir("./features-missing-matcher")

afterEach(() => {
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(
    'No @Match() defined for "product of a and b should be 15"',
  )
  fn.mockReset()
})
