# Image URL Shortener

A VS Code extension that automatically shortens image URLs in src attributes using TinyURL.

## Features

- Automatically shortens long image URLs when pasted into src attributes
- Provides a command to manually shorten selected URLs
- Works with HTML, JavaScript, TypeScript, and React files
- Uses TinyURL for reliable URL shortening

## Usage

### Automatic Shortening

Simply paste a long image URL into a src attribute:

```html
<!-- Before -->
<img
  src="https://very-long-domain.com/path/to/some/image-with-long-name-123456.jpg"
/>

<!-- After (automatic) -->
<img src="https://tinyurl.com/abc123" />
```

### Manual Shortening

1. Select any URL in your editor
2. Open the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Run the "Shorten Image URL" command

## Requirements

- VS Code 1.80.0 or higher

## Extension Settings

This extension does not add any VS Code settings.

## Known Issues

None at this time.

## Release Notes

### 0.0.1

Initial release of Image URL Shortener
