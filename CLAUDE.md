# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

- `yarn dev` or `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn test` - Run all Vitest tests
- `yarn test src/path/to/file.spec.tsx` - Run specific test file
- `yarn deploy` - Build, deploy to S3, and invalidate CloudFront

## Code Style Guidelines

- **TypeScript**: Be loose.
- **Component Structure**: React components in `ui/components`, hooks in `ui/hooks`, pages in `ui/pages`.
- **Architecture**: Follow event bus pattern using RxFx.
- **State Management**: Use services (in `services/`) and effects (in `effects/`) for state and side effects.
- **Testing**: Use Vitest with React Testing Library. Mock dependencies with `vi.mock()`.
- **Error Handling**: Implement proper error handling in effects and services.
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes.
