import { TestingApp } from "#/TestingApp"

declare global {
  var app: TestingApp

  namespace NodeJS {
    interface Global {
      app: TestingApp
    }
  }
}

export {}
