# Check Missing Tests Action

This GitHub Action checks for missing tests in your project.

## Usage

To use this action, create a workflow file in your repository's `.github/workflows` directory. For example:

```yaml
name: Check Missing Tests

on: [push, pull_request]

jobs:
  check-missing-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Run Check Missing Tests Action
        uses: moataznabil/check-missing-tests-action@v1
        with:
          # Add any required inputs here
          test-directory: 'tests'
```

## Inputs

- `test-directory`: The directory where your tests are located. Default is `tests`.

## Example

Here is an example of how to use the action in a workflow:

```yaml
name: Check Missing Tests

on: [push]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check for missing tests
        uses: moataznabil/check-missing-tests-action@v1
        with:
          test-directory: 'tests'
```
