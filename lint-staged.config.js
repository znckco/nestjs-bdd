module.exports = {
  "**/*.ts": [
    "jest --bail --findRelatedTests",
    "eslint --cache --fix",
    "prettier --write",
  ],
  "**/*.js": ["eslint --cache --fix", "prettier --write"],
  "**/*.{json,prettierrc}": ["prettier --parser json --write"],
  "**/*.{yaml,yml}": ["prettier --parser yaml --write"],
  "**/*.md": ["prettier ---parser markdown --write"],
}
