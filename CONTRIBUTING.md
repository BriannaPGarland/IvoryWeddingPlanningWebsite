# Contributing to Ivory Wedding OS

Thank you for your interest in contributing to **Ivory**! We are committed to building the calmest, most refined, and production-grade wedding financial and design operating system.

## Code of Conduct
We are dedicated to providing a welcoming and harassment-free environment for everyone. Please be respectful and constructive in all discussions, issues, and pull requests.

## How to Contribute

### 1. Reporting Bugs
- Search existing issues to ensure the bug hasn't already been reported.
- Create an issue including steps to reproduce, expected behavior, screenshots if applicable, and browser/OS details.

### 2. Suggesting Enhancements
- Clearly explain the use case and why the feature benefits couples or wedding planners.
- Consider existing design conventions (warm editorial aesthetic, zero-pill discipline, serif/sans typographic harmony).

### 3. Submitting Pull Requests
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Install dependencies and verify that everything compiles:
   ```bash
   npm install
   npm run lint
   npm run build
   ```
3. Write clean, modular, and strongly-typed TypeScript code.
4. Ensure Tailwind CSS classes adhere to the palette system (`#faf6eb`, `#ca981d`, `#ebdcc0`, `#2c2419`).
5. Push to your fork and submit a Pull Request describing your changes.

## Development Guidelines
- **Strict TypeScript:** No implicit `any`. Use interfaces and standard enums.
- **Component Modularity:** Keep components scoped and self-contained with explicit Props interfaces.
- **Accessibility:** Ensure high contrast, proper ARIA labels, and keyboard navigation support for all interactive modals.
