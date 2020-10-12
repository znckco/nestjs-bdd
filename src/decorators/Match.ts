import { SetMetadata } from "@nestjs/common"
import { METADATA_MATCHER } from "../constants"

export function Match(matcher: string | RegExp): MethodDecorator {
  return SetMetadata(METADATA_MATCHER, matcher)
}
