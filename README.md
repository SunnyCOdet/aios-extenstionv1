# AIOS Browser

AI-powered browser automation extension that transforms how you interact with the web. AIOS Browser leverages advanced AI agents to automate complex web tasks, extract data, fill forms, and navigate websites with natural language commands. If you find this project useful, please star the repository—your support helps the project grow.

## Overview

AIOS Browser is an open-source Chrome extension that brings intelligent automation to your browser. Built with modern web technologies and powered by leading AI models, it enables users to accomplish web tasks through conversational commands, eliminating the need for manual clicking, typing, and navigation.

## Key Features

### Intelligent Task Automation
- **Natural Language Commands**: Describe what you want to accomplish in plain English
- **Multi-Step Task Execution**: Automatically breaks down complex tasks into actionable steps
- **Context-Aware Navigation**: Understands page structure and adapts to dynamic content
- **Form Filling**: Intelligently fills forms with appropriate data
- **Data Extraction**: Extracts and compiles information from multiple sources
- **Unrestricted Browsing**: No hard-coded guardrails—agents can operate across the full web surface you authorize
- **CAPTCHA Handling**: Attempts to solve presented CAPTCHAs when visual context is available

### Advanced Agent System
- **Planner Agent**: Analyzes tasks and creates strategic execution plans
- **Navigator Agent**: Executes actions with precision and error recovery
- **Multi-Mode Operation**: Choose between Agent mode (full automation), Plan mode (step-by-step visibility), or Ask mode (chat-only assistance)

### User Experience
- **Side Panel Interface**: Clean, modern UI accessible from any tab
- **Real-Time Progress**: Watch tasks execute with live updates and visual feedback
- **Task Control**: Pause, resume, or stop tasks at any time
- **Chat History**: Review and replay previous automation sessions
- **Bookmark Prompts**: Save frequently used tasks for quick access

### Developer Features
- **Multiple LLM Providers**: Support for OpenAI, Anthropic, Google, Groq, DeepSeek, Cerebras, Ollama, and X.AI
- **Customizable Settings**: Fine-tune agent behavior, retry logic, and execution parameters
- **URL Firewall**: Control which websites the extension can access
- **Network Interception**: Agents can inspect and act on browser network traffic for diagnostics and automation
- **Replay System**: Replay historical tasks for testing and debugging

### Internationalization
- **Multi-Language Support**: Available in English, Portuguese (Brazil), and Traditional Chinese
- **Localized Interface**: All UI elements and messages are translated

## Installation

### From Source

1. **Prerequisites**
   - Node.js >= 22.12.0
   - pnpm >= 9.15.1

2. **Clone the Repository**
   ```bash
   git clone https://github.com/aios/aios.git
   cd aios
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Build the Extension**
   ```bash
   pnpm build
   ```

5. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` directory from the project root

### Development Mode

For development with hot module reloading:

```bash
pnpm dev
```

This will watch for changes and automatically rebuild the extension.

## Configuration

### Initial Setup

1. **Open the Side Panel**
   - Click the AIOS Browser icon in your Chrome toolbar
   - Or use the keyboard shortcut (if configured)

2. **Configure API Keys**
   - Navigate to Settings in the side panel
   - Add your API keys for at least one LLM provider
   - Recommended: Configure the Navigator agent (required for automation)

3. **Select Your Mode**
   - **Agent Mode**: Full automation with minimal visibility
   - **Plan Mode**: See planning steps and reasoning
   - **Ask Mode**: Chat-only, no automation

### Supported LLM Providers

- OpenAI (GPT-5, GPT-5.1)
- Anthropic (Claude)
- Google (Gemini)
- Groq
- DeepSeek
- Cerebras
- Ollama (local models)
- X.AI (Grok)

### Advanced Settings

**Agent Configuration**
- Maximum steps per task
- Maximum actions per step
- Maximum consecutive failures
- Retry delay
- Planning interval

**Browser Context**
- Page load timeout
- Network idle timeout
- Viewport expansion
- Display highlights

**Security**
- URL allow list
- URL deny list
- Firewall rules

## Usage

### Basic Task Execution

1. Open the side panel
2. Enter your task in natural language:
   ```
   Navigate to example.com and extract all product prices
   ```
3. Click Send or press Enter
4. Watch the agent execute the task step by step

### Task Control

- **Pause**: Temporarily halt task execution
- **Resume**: Continue from where the task was paused
- **Stop**: Cancel the current task entirely

### Example Tasks

**Data Extraction**
```
Find all job listings on LinkedIn for "Software Engineer" in San Francisco
```

**Form Filling**
```
Fill out the contact form on example.com with my information
```

**Research**
```
Research the top 5 AI companies and summarize their main products
```

**Navigation**
```
Navigate to my Gmail inbox and check for unread messages
```

**Multi-Step Operations**
```
Search for "TypeScript tutorials" on YouTube, open the first 3 results in new tabs, and extract their titles
```

### Chat History

- View all previous automation sessions
- Replay historical tasks
- Bookmark frequently used prompts
- Export conversation history

## Architecture

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build System**: Vite, Turbo (monorepo)
- **Browser APIs**: Chrome Extension Manifest V3
- **AI Integration**: LangChain
- **State Management**: Custom storage system with IndexedDB

### Project Structure

```
aios-extenstionv1/
├── chrome-extension/     # Core extension code
│   ├── src/
│   │   ├── background/   # Service worker and agents
│   │   └── browser/      # Browser automation layer
│   └── public/           # Static assets
├── pages/                # UI pages
│   ├── side-panel/       # Main side panel interface
│   ├── options/          # Settings page
│   └── content/         # Content scripts
├── packages/             # Shared packages
│   ├── i18n/            # Internationalization
│   ├── storage/         # Data persistence
│   ├── shared/          # Shared utilities
│   └── ui/              # UI components
└── dist/                 # Build output
```

### Agent Architecture

The extension uses a multi-agent system:

1. **Planner Agent**: Analyzes tasks, determines if web navigation is needed, and creates execution plans
2. **Navigator Agent**: Executes actions on web pages, handles errors, and manages state

Both agents communicate through an event system and maintain context throughout task execution.

## Development

### Prerequisites

- Node.js >= 22.12.0
- pnpm >= 9.15.1

### Available Scripts

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Development mode with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm prettier

# Clean build artifacts
pnpm clean

# Create distribution zip
pnpm zip
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all tests pass and code is linted
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## Security

### Privacy

- All API keys are stored locally in your browser
- No data is sent to external servers except to your configured LLM providers
- Task history is stored locally in IndexedDB
- Network requests are only made to your configured LLM endpoints

### URL Firewall

The extension includes a firewall system to control which websites can be accessed:
- **Allow List**: Only specified domains are accessible
- **Deny List**: Blocked domains cannot be accessed
- **Default**: All domains allowed if both lists are empty

### Best Practices

- Use the URL firewall to restrict access to sensitive domains
- Review task history regularly
- Use strong, unique API keys
- Keep the extension updated
- Remember that agents can browse any site you permit—define allow/deny lists that match your security posture

## Troubleshooting

### Common Issues

**Extension Not Loading**
- Ensure you're using Chrome or a Chromium-based browser
- Check that Developer mode is enabled
- Verify the `dist` directory exists after building

**Tasks Not Executing**
- Verify API keys are configured correctly
- Check that at least one LLM provider is set up
- Review browser console for error messages

**Slow Performance**
- Reduce maximum steps or actions per step
- Use a faster LLM provider
- Disable visual highlights if not needed

**Network Errors**
- Verify API key permissions
- Check network connectivity
- Review firewall settings

### Debug Mode

Enable debug logging:
1. Open Chrome DevTools
2. Go to the Console tab
3. Look for messages prefixed with `[Executor]`, `[Navigator]`, or `[Planner]`

## License

Licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with:
- [LangChain](https://github.com/langchain-ai/langchain) for LLM integration
- [React](https://react.dev/) for the user interface
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vite](https://vitejs.dev/) for build tooling
- [Turbo](https://turbo.build/) for monorepo management

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Review existing documentation
- Check the codebase for examples
- Star the repository to show your support and help others discover AIOS Browser

## Roadmap

Future enhancements may include:
- Additional LLM provider integrations
- Enhanced error recovery mechanisms
- Visual task builder
- Task templates and workflows
- Team collaboration features
- Advanced analytics and reporting

---

**Note**: This extension requires API keys from supported LLM providers. Ensure you have appropriate API access before use.
