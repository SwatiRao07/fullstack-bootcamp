# TypeScript Technical Reference & Implementation Notes

## 1. Type Narrowing & Control Flow Analysis
- **Discriminated Unions**: Utilizing singleton types (string literals) as discriminators to enable safe property access within branching logic.
- **Exhaustiveness Checking**: Forcing compile-time errors for unhandled union members by assigning the "fall-through" variable to the `never` type.
- **Custom Type Predicates**: Implementing user-defined type guards using the `arg is Type` signature to refine types beyond simple `typeof` or `instanceof` checks.
- **In-Operator Narrowing**: Leveraging structural typing via the `in` operator to identify types based on the existence of unique properties.

## 2. Advanced Type Machinery
- **Conditional Types**: Implementing logic at the type level with `T extends U ? X : Y`. Used `infer` keyword (e.g., `T extends Promise<infer U> ? U : T`) to unwrap nested types.
- **Mapped & Template Literal Types**: 
  - Iterating over keys using `[K in keyof T]`.
  - Dynamic string type generation via template literals (e.g., `on${Capitalize<Events>}`) for event-driven systems.
- **Indexed Access Types**: Extracting deep property types using `T[K]` syntax (e.g., `User["profile"]["address"]["city"]`).
- **Recursive Types**: Support for deeply nested structures like `JsonValue` where a type definition refers to itself.

## 3. Asynchronous Pattern Design
- **Concurrency Limiting (Worker Pool)**: Managing resource constraints by spawning a fixed number of "workers" (`const workers = Array.from({ length: limit }, () => worker())`) that consume a shared task queue.
- **Racing & Timeouts**: Using `Promise.race([task, timeoutPromise])` to implement operation-level timeouts.
- **Signal-Based Cancellation**: Integrating `AbortController` and `AbortSignal` to propagate "stop" signals through nested async calls, preventing resource leaks.
- **Backoff Retries**: Recursive implementation of retry logic with `await sleep(delay)` and exponential delay strategies.

## 4. Generic Systems & Abstraction
- **Generic Constraints**: Restricting generics to specific interfaces using `T extends Interface` (e.g., `GenericStorage<T extends HasId>`).
- **Polymorphism in OOP**:
  - `abstract` classes for enforcing core structure while delegating implementation.
  - Interface-based contracts to decouple high-level modules (e.g., `TaskManager`) from low-level details (e.g., `Storage`).
- **Utility Type Composition**: Combining `Partial<T>`, `Omit<T, K>`, and `Pick<T, K>` to derive specialized DTOs (Data Transfer Objects) from core entities.

## 5. Architectural Patterns (Task-CLI)
- **Separation of Concerns (SoC)**:
  - **Logic Layer**: `TaskManager.ts` manages state transitions and fires events.
  - **Data Layer**: `Storage.ts` handles serialization/deserialization to JSON.
  - **Presentation Layer**: `cli.ts` routes command-line arguments to service methods.
- **Dependency Inversion**: High-level modules depend on abstractions (interfaces), allowing for interchangeable storage backends (JSON vs SQLite).
- **Graceful Error Handling**: Implementing a robust `Result<T, E>` pattern (`{ ok: true, data: T } | { ok: false, error: string }`) to handle domain-specific failures without crashing the application.

## 6. Runtime Integrity
- **Boundary Validation with Zod**: bridging the gap between static types and dynamic inputs. Using schema-based parsing (`schema.parse(json)`) to ensure that untrusted data (files/API) conforms to TypeScript interfaces before it enters the application logic.
- **Strict Configuration**: Enforcing `noUncheckedIndexedAccess`, `strictNullChecks`, and `exactOptionalPropertyTypes` in `tsconfig.json` to move potential runtime failures to compile-time.
