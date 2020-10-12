import { Module } from "@nestjs/common"
import { TestingApp } from "./TestingApp"

@Module({})
class AppModule {}

describe("TestingApp", () => {
  test("no init", () => {
    const app = new TestingApp(AppModule, [])

    expect(() => app.app).toThrow()
  })

  test("with init", async () => {
    const app = new TestingApp(AppModule, [])

    await app.start()

    expect(() => app.app).not.toThrow()
  })
})
