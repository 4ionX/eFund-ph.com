# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

🧾 Conventional Commit Types

This project follows the Conventional Commits specification to maintain consistent and readable commit history.

✨ feat

New feature

Adds new functionality or feature
Includes new screens, APIs, or user-facing capabilities
🐛 fix

Bug fix

Fixes errors or unexpected behavior
Resolves UI or logic issues
🧹 chore

Maintenance / housekeeping

Non-feature changes
Dependency updates, config changes, cleanup tasks
📚 docs

Documentation only

Changes to README or documentation files
No production code changes
🎨 style

Code style / formatting

White-space, formatting, linting
No logic changes
♻️ refactor

Code restructuring

Improves code structure without changing behavior
Enhances readability or maintainability
⚡ perf

Performance improvements

Optimizes speed or resource usage
Improves query or rendering efficiency
🧪 test

Testing

Adds or updates tests
Unit, integration, or e2e tests
🏗️ build

Build system changes

Changes affecting build process or dependencies
Expo, bundler, or native build configs
🔄 ci

Continuous Integration

Updates CI/CD workflows
GitHub Actions, pipelines, deployment scripts
⏪ revert

Revert changes

Reverts a previous commit
📌 Example Commit Format
feat: add loan application form
fix: resolve login crash on invalid token
chore: update dependencies
refactor: simplify authentication flow
