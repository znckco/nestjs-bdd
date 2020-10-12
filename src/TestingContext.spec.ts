import { createContext } from "./TestingContext"

describe("createContext", () => {
  test("request", () => {
    const context = createContext(null as any, null as any)

    const request = { method: "GET" } as const

    context.setRequest(request)
    expect(context.getRequest()).toBe(request)
  })

  test("response", () => {
    const context = createContext(null as any, null as any)

    const response = {} as any
    context.setResponse(response)
    expect(context.getResponse()).toEqual(response)
  })

  test("state", () => {
    const context = createContext(null as any, null as any)

    context.setState("foo", 1)
    context.setState("bar", "bar")

    expect(context.getState("foo")).toEqual(1)
    expect(context.getState("bar")).toEqual("bar")
    expect(context.getState()).toEqual({ foo: 1, bar: "bar" })
  })
})
