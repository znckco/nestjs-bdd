import { Match, TestingContext } from "#/index"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ExampleMatcher {
  @Match(/^(.*) is (.*)$/)
  defineNumber(context: TestingContext, name: string, value: string): void {
    context.setState(name, Number(value))
  }

  @Match(/^sum of (.*) and (.*) should be (.*)$/)
  assertSum(context: TestingContext, a: string, b: string, sum: string): void {
    expect(Number(context.getState(a)) + Number(context.getState(b))).toBe(
      Number(sum),
    )
  }

  @Match("it should not fail")
  assertTrue(): void {}
}
