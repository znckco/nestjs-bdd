<p align="center">
  <img alt="NestJS BDD" src="https://raw.githubusercontent.com/znckco/nestjs-bdd/master/.assets/cover.png"/>
</p>

<p align="center">

[![NPM](https://img.shields.io/npm/v/nestjs-bdd)](https://www.npmjs.com/package/nestjs-bdd)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![CI](https://github.com/znckco/nestjs-bdd/workflows/CI/badge.svg)](https://github.com/znckco/nestjs-bdd/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/znckco/nestjs-bdd/branch/master/graph/badge.svg)](https://codecov.io/gh/znckco/nestjs-bdd)

</p>

## Description

Behaviour driven testing for NestJS using jest and jest-cucumber.

## Installation

```bash
$ npm install --save nestjs-bdd
```

## Quick Start

1. Create matchers

```ts
import { Match, TestingContext } from "nestjs-bdd"
import { Injectable } from "@nestjs/common"

@Injectable()
export class SumMatcher {
  @Match(/^(.*) is (.*)$/)
  defineNumber(context: TestingContext, name: string, value: string) {
    context.setState(name, Number(value))
  }

  @Match(/^sum of (.*) and (.*) should be (.*)$/)
  assertSum(context: TestingContext, a: string, b: string, sum: string) {
    expect(context.getState(a) + context.getState(b)).toBe(Number(sum))
  }
}
```

2. Write features

```feature
Feature: Number Operations

  Scenario: sum of two numbers
    Given a is 5
    And b is 10
    Then sum of a and b should be 15
```

3. Create BDD spec file

```ts
import { AppModule } from "./AppModule" // Your app module.
import { SumMatcher } from "./test/SumMatcher" // defined in step 1.
import { TestingApp } from "nestjs-bdd"

const app = new TestingApp(AppModule, [SumMatcher])

beforeAll(() => app.start())

app.findInDir("./features") // Scan recursively for *.feature files. (e.g. defined in step 2.)

afterAll(() => app.stop())
```

## Stay in touch

- Author - [Rahul Kadyan](https://znck.me)
- Twitter - [@znck0](https://twitter.com/znck0)

## License

NestJS BDD is [MIT licensed](LICENSE).
