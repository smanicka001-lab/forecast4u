# Testing Documentation

## Overview

This project uses Vitest and React Testing Library for comprehensive unit testing. Tests run automatically on every push and pull request via GitHub Actions.

## Quick Start

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm vitest
```

### Run Tests with Coverage
```bash
pnpm vitest run --coverage
```

### Run Specific Test File
```bash
pnpm vitest run path/to/test-file.test.tsx
```

## Test Structure

### Test Files Location
- Unit tests are located next to the files they test
- Test files use `.test.tsx` or `.spec.ts` extensions
- Example: `Index.tsx` → `Index.test.tsx`

### Current Test Coverage

#### Component Tests
- **`client/pages/Index.test.tsx`** - Comprehensive tests for the weather forecast page
  - Initial render tests
  - Dark mode toggle functionality
  - Form validation (zip code input)
  - Weather forecast fetching
  - API error handling
  - Forecast display

#### Utility Tests
- **`client/lib/utils.spec.ts`** - Tests for utility functions
  - `cn()` function for class name merging

### Test Configuration

#### `vitest.config.ts`
- Configured for React component testing
- Uses jsdom environment
- Includes code coverage reporting
- Path aliases configured (`@/` for client, `@shared/` for shared)

#### `client/test/setup.ts`
- Global test setup file
- Extends Vitest with jest-dom matchers
- Automatic cleanup after each test
- Mock environment variables

## Writing Tests

### Example Component Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    render(<MyComponent />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.getByText("Clicked!")).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test User Behavior** - Focus on what users see and do, not implementation details
2. **Use Accessible Queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock External Dependencies** - Mock API calls, browser APIs, etc.
4. **Keep Tests Isolated** - Each test should be independent
5. **Use Descriptive Names** - Test names should clearly describe what they test

### Common Testing Patterns

#### Testing Async Operations
```typescript
it("should fetch data", async () => {
  render(<MyComponent />);
  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});
```

#### Testing User Events
```typescript
it("should handle form submission", async () => {
  render(<MyForm />);
  const input = screen.getByLabelText("Email");
  await userEvent.type(input, "test@example.com");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(screen.getByText("Success!")).toBeInTheDocument();
});
```

#### Mocking API Calls
```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

it("should call API", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: "test" }),
  });
  
  render(<MyComponent />);
  // ... test logic
});
```

## Continuous Integration

### GitHub Actions Workflow

The project includes automated testing via GitHub Actions (`.github/workflows/test.yml`):

- **Triggers**: Runs on push and pull requests to `main` and `develop` branches
- **Node Version**: Tests run on Node.js 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js and pnpm
  3. Install dependencies
  4. Run type checking
  5. Run unit tests
  6. Generate coverage report
  7. Upload coverage artifacts

### Viewing Test Results

- Test results are visible in GitHub Actions tab
- Coverage reports are uploaded as artifacts
- Failed tests will block PR merges (if branch protection is enabled)

## Coverage Reports

### Generating Coverage
```bash
pnpm vitest run --coverage
```

### Viewing Coverage
- HTML report: Open `coverage/index.html` in browser
- Terminal: Coverage summary displays after test run
- CI: Coverage reports uploaded as artifacts in GitHub Actions

### Coverage Goals
- Aim for >80% code coverage
- Focus on critical paths and user flows
- Don't sacrifice test quality for coverage percentage

## Debugging Tests

### Run Tests in Debug Mode
```bash
pnpm vitest --inspect
```

### Run Single Test
```typescript
it.only("should test this specific case", () => {
  // This test will run alone
});
```

### Skip Tests Temporarily
```typescript
it.skip("should test this later", () => {
  // This test will be skipped
});
```

### View Rendered Output
```typescript
import { screen } from "@testing-library/react";
render(<MyComponent />);
screen.debug(); // Prints the current DOM
```

## Adding New Tests

1. Create a test file next to the component/utility: `MyComponent.test.tsx`
2. Import necessary testing utilities
3. Write describe blocks to group related tests
4. Write individual test cases with `it()` or `test()`
5. Run tests to verify they pass
6. Push to trigger CI tests

## Troubleshooting

### Tests Fail Locally But Pass in CI
- Check Node.js version compatibility
- Verify all dependencies are installed
- Clear node_modules and reinstall

### Tests Are Slow
- Use `vi.mock()` to mock heavy dependencies
- Avoid unnecessary `waitFor()` with long timeouts
- Run specific test files instead of all tests

### Coverage Not Generating
- Ensure `@vitest/coverage-v8` is installed
- Check `vitest.config.ts` coverage configuration
- Run with `--coverage` flag explicitly

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest UI](https://vitest.dev/guide/ui.html) - Visual test runner
