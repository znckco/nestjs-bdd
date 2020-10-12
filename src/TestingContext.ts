import { ParsedFeature } from "jest-cucumber/dist/src/models"
import { InjectOptions, Response } from "light-my-request"

export interface TestingContext<T extends object = any> {
  feature: ParsedFeature

  getRequest: () => InjectOptions
  setRequest: (options: InjectOptions) => void

  getResponse: () => Response
  setResponse: (response: Response) => void

  getState: <K extends keyof T>(key?: K) => K extends undefined ? T : T[K]
  setState: <K extends keyof T>(key: K, value: T[K]) => void
}

export function createContext<T extends object = any>(
  feature: ParsedFeature,
): TestingContext<T> {
  let request: InjectOptions = {}
  let response: Response
  const context: T = {} as any

  return {
    feature,

    getRequest: () => request,
    setRequest(options) {
      request = options
    },

    getResponse: () => response,
    setResponse(options) {
      response = options
    },

    getState(key) {
      return (key != null ? context[key] : context) as any
    },

    setState(key, value) {
      context[key] = value
    },
  }
}
