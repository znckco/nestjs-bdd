import { Injectable, Type } from "@nestjs/common"
import { MetadataScanner, ModuleRef, Reflector } from "@nestjs/core"
import { METADATA_MATCHER } from "../constants"

type MatcherHandler = (...args: any[]) => any
type Matcher = [string | RegExp, MatcherHandler]

@Injectable()
export class MatcherRegistry {
  private readonly matchers: Array<
    [string | RegExp, string, MatcherHandler]
  > = []
  private readonly matchersByName: Map<string, Matcher> = new Map()

  private readonly stepNameToMatcherName: Record<string, string> = {}
  private readonly scanner = new MetadataScanner()
  private readonly reflector = new Reflector()

  constructor(private readonly moduleRef: ModuleRef) {}

  loadMatchers(types: Array<Type<any>>): void {
    types.forEach((type) => {
      const className = type.name
      const instance = this.moduleRef.get(type, { strict: false })
      const prototype = Object.getPrototypeOf(instance)
      this.scanner.scanFromPrototype(instance, prototype, (methodName) => {
        const fn = instance[methodName] as (...args: any[]) => any
        const query = this.reflector.get<string | RegExp>(METADATA_MATCHER, fn)

        // istanbul ignore else
        if (query != null) {
          const name = `${className}.${methodName}`
          this.matchers.push([query, name, fn.bind(instance)])
          this.matchersByName.set(name, [query, fn.bind(instance)])
        }
      })
    })
  }

  getMatcherFor(stepTitle: string): Matcher {
    const matcherName = this.stepNameToMatcherName[stepTitle]

    if (matcherName != null) {
      const matcher = this.matchersByName.get(matcherName)
      // istanbul ignore else
      if (matcher != null) return matcher
    }

    for (const [re, name, fn] of this.matchers) {
      if (stepTitle.match(re) != null) {
        this.stepNameToMatcherName[stepTitle] = name

        return [re, fn]
      }
    }

    return [
      stepTitle,
      () => {
        console.warn(`No @Match() defined for "${stepTitle}"`)
      },
    ]
  }
}
