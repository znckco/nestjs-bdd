import { Injectable, Type } from "@nestjs/common"
import { MetadataScanner, ModuleRef, Reflector } from "@nestjs/core"
import { METADATA_MATCHER } from "../constants"

type MatcherHandler = (...args: any[]) => any
type Matcher = [string | RegExp, MatcherHandler]

@Injectable()
export class MatcherRegistry {
  private readonly matchers: Matcher[] = []
  private readonly matchersByName: Map<string, Matcher> = new Map()

  private readonly scanner = new MetadataScanner()
  private readonly reflector = new Reflector()

  constructor(private readonly moduleRef: ModuleRef) {}

  loadMatchers(types: Array<Type<any>>): void {
    types.forEach((type) => {
      const instance = this.moduleRef.get(type, { strict: false })
      const prototype = Object.getPrototypeOf(instance)
      this.scanner.scanFromPrototype(instance, prototype, (methodName) => {
        const fn = instance[methodName] as (...args: any[]) => any
        const query = this.reflector.get<string | RegExp>(METADATA_MATCHER, fn)

        // istanbul ignore else
        if (query != null) {
          this.matchers.push([query, fn.bind(instance)])
        }
      })
    })
  }

  getMatcherFor(stepTitle: string): Matcher {
    for (const [re, fn] of this.matchers) {
      if (stepTitle.match(re) != null) {
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
