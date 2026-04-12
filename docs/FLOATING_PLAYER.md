# Floating Player Feature

## Overview

The Floating Player allows desktop users to pop out the video or radio player into a draggable, resizable window that stays on top of other content. This enables multitasking - users can watch TV channels or listen to radio stations while browsing other parts of the site or working on other tasks.

## Features

### ✨ Core Functionality
- **Pop-out Mode**: Click the "Pop Out" button in the player controls to detach the player
- **Draggable**: Click and drag the header to move the window anywhere on screen
- **Resizable**: Drag the bottom-right corner to resize (280x160 to 800x600 pixels)
- **Always on Top**: Floating window stays above other content for easy viewing
- **Dock Back**: Click the dock icon to return to the main modal player
- **Persistent State**: Window position and size are saved to localStorage

### 🎮 Controls
- **Play/Pause**: Control playback without docking
- **Country Info**: View channel/station country in the header
- **Dock Button**: Return to full modal view
- **Close Button**: Stop playback and close the floating window
- **Keyboard**: Press `Escape` to close the floating player

### 🎨 Visual Design
- Dark themed with glassmorphic effects
- Purple accent color for pop-out/dock actions (distinguishes from minimize)
- Smooth transitions and hover effects
- Semi-transparent when dragging/resizing
- Minimal header with essential controls

### 📱 Device Support
- **Desktop Only**: Feature is only available on desktop devices
- **Hidden on Mobile**: Automatically disabled on mobile and TV devices
- **Browser Support**: Works on all modern desktop browsers

## Usage

### For TV Channels

1. Open any TV channel
2. Click the **"Pop Out"** button (purple icon with diagonal arrow) in the top-right controls
3. The video player becomes a floating window
4. Drag to reposition, resize from the corner
5. Continue browsing channels while watching in the floating window
6. Click **"Dock"** to return to normal view, or **×** to close

### For Radio Stations

1. Open any radio station
2. Click the **"Pop Out"** button in the top-right controls
3. The radio player becomes a floating window with album art and equalizer
4. Audio continues playing in the background
5. Use the same drag/resize/dock controls as TV

## Technical Implementation

### Components
- **`FloatingPlayer.jsx`**: Main floating player component
- Supports both TV (`variant="tv"`) and Radio (`variant="radio"`) modes
- Shares video/audio refs with modal players for seamless transitions

### State Management
- `floatingTv` / `floatingRadio` state in `App.jsx`
- Position saved to `localStorage` as `adajoon_floating_position`
- Size saved to `localStorage` as `adajoon_floating_size`

### Integration Points
```javascript
// VideoPlayer integration
<VideoPlayer
  onPopOut={device.isDesktop ? handlePopOutTv : undefined}
  // ... other props
/>

// FloatingPlayer rendering
{selectedChannel && floatingTv && (
  <FloatingPlayer
    variant="tv"
    channel={selectedChannel}
    videoRef={videoRef}
    onClose={closeTvPlayer}
    onDock={handleDockTv}
  />
)}
```

### CSS Classes
- `.floating-player`: Main container (fixed position, high z-index)
- `.floating-player-header`: Draggable title bar with controls
- `.floating-player-body`: Video/audio content area
- `.floating-player-resize-handle`: Bottom-right resize handle
- `.floating-player.dragging`: Visual feedback during drag
- `.floating-player.resizing`: Visual feedback during resize

## Constraints

### Size Limits
- **Minimum**: 280px width × 160px height
- **Maximum**: 800px width × 600px height

### Position Limits
- Cannot be dragged off-screen (100px bottom margin for footer)
- Automatically constrained to viewport boundaries

### Device Restrictions
- Desktop only (hidden via CSS `@media (max-width: 768px)`)
- Not available on touch devices (`@media (hover: none)`)
- Not available on TV platforms

## Future Enhancements

Potential improvements for future versions:

1. **Picture-in-Picture API**: Use native browser PiP when available
2. **Multiple Floating Players**: Allow multiple channels/stations simultaneously
3. **Snap to Edges**: Magnetic snapping to screen edges
4. **Opacity Control**: Adjustable transparency slider
5. **Keyboard Shortcuts**: Dedicated hotkeys for pop-out/dock
6. **Remember Last Channel**: Auto-restore floating player on page load
7. **Floating Controls**: Mini control bar when hovering over floating video

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- `role="dialog"` for screen readers
- Focus management when popping out/docking
- Clear visual feedback for drag/resize operations

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+ (desktop)
- ✅ Firefox 88+ (desktop)
- ✅ Safari 14+ (macOS)
- ✅ Edge 90+ (desktop)

## Known Issues

None currently. Report issues at [GitHub Issues](https://github.com/yourusername/adajoon/issues).

---

**Version**: Added in v2.6.0 (Unreleased)  
**Last Updated**: 2026-04-12
