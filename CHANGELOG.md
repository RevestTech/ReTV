# Changelog

All notable changes to Adajoon will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-04-05

### Added
- **Smart TV Support**: Full optimization for Samsung Tizen, LG webOS, and other TV browsers
  - Automatic device detection for TV platforms
  - 10-foot UI with larger text (24px base) and buttons (60px min height)
  - D-pad navigation support for TV remote controls
  - Samsung/LG back button handling
  - Enhanced focus indicators (4px white outline with glow)
  - TV-safe zones (5% padding from screen edges)
  - TV Mode debug indicator badge
- Device detection utilities (`deviceDetection.js`)
- TV-specific React hooks (`useDevice`, `useTVNavigation`)
- TV-optimized CSS styles (`tv.css`, `tv-debug.css`)
- Comprehensive TV optimization documentation (`docs/TV_OPTIMIZATION.md`)

### Changed
- Updated Vite build target to ES2015 for TV browser compatibility
- Set CSS target to Chrome 61 for older smart TV browsers
- Improved browser compatibility for Samsung Tizen 2.4+ (2017+ models)

### Fixed
- Blank screen issue on Samsung Internet browser (JavaScript compatibility)
- Remote control navigation not working on TV devices

## [2.4.0] - 2026-04-04

### Added
- Enhanced voting system for TV channels and radio stations
- Recently played history tracking
- Guest mode with local favorites
- Improved authentication flow

### Changed
- Modernized UI with updated color scheme
- Improved mobile responsiveness
- Enhanced video player controls

### Fixed
- Various bug fixes and performance improvements

## [2.3.0] - 2026-03-15

### Added
- Radio station streaming support
- Category and country filtering
- Quality indicators for streams
- Favorites synchronization

### Changed
- Improved search functionality
- Enhanced sidebar navigation
- Better error handling

## [2.2.0] - 2026-02-20

### Added
- OAuth authentication (Google, Apple)
- Passkey/WebAuthn support
- User profile management
- CSRF protection

### Changed
- Updated security headers
- Improved cookie handling
- Enhanced CORS configuration

## [2.1.0] - 2026-01-15

### Added
- Initial public release
- Live TV channel streaming
- HLS video player
- Basic search and filtering

---

## Version Numbering

- **Major version** (X.0.0): Breaking changes, major feature overhauls
- **Minor version** (0.X.0): New features, backward compatible
- **Patch version** (0.0.X): Bug fixes, minor improvements

## Links

- [GitHub Repository](https://github.com/yourusername/adajoon)
- [Documentation](./docs/)
- [TV Optimization Guide](./docs/TV_OPTIMIZATION.md)
