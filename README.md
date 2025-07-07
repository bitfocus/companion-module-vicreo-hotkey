# companion-module-vicreo-hotkey

A Companion module for VICREO Hotkey Listener integration.

## For Users

**This module requires the VICREO Listener application.** Download it from: https://vicreo-listener.com

For detailed usage instructions, configuration help, and supported actions, see the built-in help in Companion or check `companion/HELP.md`.

## For Developers

This module enables Companion to send keyboard commands, hotkey combinations, and mouse actions to remote computers running VICREO Listener software.

### Architecture

- **Main module**: `hotkey.js` - Core TCP connection and command handling
- **Actions**: `actions.js` - Defines available actions (single keys, combinations, mouse, etc.)
- **Presets**: `presets.js` - Pre-configured button setups for common operations
- **Upgrades**: `upgrades.js` - Config migration scripts

### Key Features

- TCP connection with automatic reconnection
- Bonjour/mDNS device discovery
- Keep-alive mechanism for connection monitoring
- Support for single keys, key combinations, mouse actions, and shell commands
- Password protection support

### Development Setup

```bash
# Install dependencies
yarn install

# Package for distribution
yarn package

# Lint code
yarn lint

# Format code
yarn format
```

### Dependencies

- `@companion-module/base` - Core Companion module framework
- Built-in Node.js modules for TCP and crypto operations

### Support

For issues and feature requests: https://github.com/bitfocus/companion-module-vicreo-hotkey/issues
