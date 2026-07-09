# UiinfoHandler - Documentation

## Overview

The UiinfoHandler is a PlayCanvas script that manages an interactive 3D pyramid interface for a leadership course. It handles content display through iframes, manages navigation between different content types, and provides a seamless user experience across multiple interaction modes.

## Core Functionality

### Content Types Supported

1. **Short Info Pages** (`-kurzinfo`)
   - Quick information pages for each leadership level
   - Direct access without submenus

2. **Submenu Systems** (Levels 1, 4, 5, 6)
   - Interactive menus with multiple tool options
   - Custom HTML files with translation support

3. **Direct Detail Pages** (Levels 2, 3)
   - Comprehensive content pages without submenus
   - Full leadership methodology explanations

4. **Detail Content Pages**
   - Accessible from submenus
   - Individual tool and methodology pages

## Script Attributes

### Core Attributes

```javascript
titleLayer: Entity          // UI layer for hover titles
titleText: Entity           // Text element for titles
disableContent: Entity[]    // Elements to disable during interaction
contentLayer: Entity        // Main content container
contentReferences: JSON[]   // Native PlayCanvas content references
```

### HTML Asset Configuration

```javascript
htmlAssets: JSON[] {
    contentId: string       // Unique identifier (e.g., "wichtigste-zuerst")
    htmlAsset: HTMLAsset    // The HTML file asset
    layer: string          // Layer designation (e.g., "layer-4")
    title: string          // Content title
}

submenuHtmlAssets: JSON[] {
    layerId: string        // Layer identifier (e.g., "layer-4")
    htmlAsset: HTMLAsset   // Submenu HTML file
    title: string          // Submenu title
    color: string          // Primary theme color
    colorDark: string      // Dark theme color
}

shortInfoHtmlAssets: JSON[] {
    layerId: string        // Layer identifier (e.g., "layer-1-kurzinfo")
    htmlAsset: HTMLAsset   // Short info HTML file
    title: string          // Page title
    level: number          // Leadership level (1-6)
    color: string          // Theme color
}

directDetailHtmlAssets: JSON[] {
    layerId: string        // Layer identifier (e.g., "layer-2")
    htmlAsset: HTMLAsset   // Detail page HTML file
    title: string          // Page title
    level: number          // Leadership level
    color: string          // Theme color
}

deepDiveHtmlAssets: JSON[] {
    layerId: string        // Ebenen-Kennung (z.B., "layer-2")
    htmlAsset: HTMLAsset   // Detail-Seiten-HTML-Datei
    title: string          // Seitentitel
    level: number          // Leadership-Ebene
    color: string          // Theme-Farbe
}
```

## Content Routing System

### Automatic Content Detection

The handler automatically detects content types based on identifiers:

```javascript
// Short Info Detection
if (requestedContent.toLowerCase().includes("-kurzinfo")) {
    this.showShortInfoPage(requestedContent);
}

if(requestedContent.toLowerCase().includes("-deepdive")){
    this.showDeepDivePage(requestedContent);
    return;
}

// Submenu Detection
var submenuMappings = {
    "layer-1-details": "layer-1",
    "startklar-details": "layer-1",
    "Layer-2-Implementation": "layer-2",
    "Layer-3-Implementation" : "layer-3",
    "Layer-4-Implementation-SubMenu": "layer-4",
    "selbstfuehrung-details": "layer-4",
    "layer-5-details": "layer-5",
    "andere-fuehren-details": "layer-5",
    "layer-6-details": "layer-6",
    "lead-uebernehmen-details": "layer-6"
};

// Direct Detail Detection
var directDetailMappings = {
    "layer-2-details": "layer-2",
    "werte-details": "layer-2",
    "layer-3-details": "layer-3",
    "kultur-details": "layer-3"
};
```

## Message Handling System

### Supported Message Types

The handler listens for iframe messages and responds accordingly:

```javascript
// Navigation Messages
'close-submenu'          // Close current submenu
'close-content'          // Close any content
'open-content'           // Open detail content (from existing HTML)
'submenu-selection'      // Open detail content (internal)
'back-to-submenu'        // Return to submenu from detail

// Translation Messages
'request-bulk-translations'  // Request multiple translations
'request-translation'        // Request single translation
```

### Message Flow Examples

#### Opening Detail Content from Submenu:
```javascript
// From existing HTML submenu:
function openContent(contentId) {
    window.parent.postMessage({
        type: 'open-content',
        contentId: contentId
    }, '*');
}

// Handler receives and converts to:
{
    type: 'submenu-selection',
    content: contentId,
    submenu: 'layer-4'
}
```

#### Navigation Back to Submenu:
```javascript
// From detail page:
function backToSubmenu() {
    window.parent.postMessage({
        type: 'back-to-submenu',
        submenu: 'layer-4'
    }, '*');
}
```

## HTML File Integration

### Existing HTML Files

The handler preserves existing HTML files completely:
- **No script injection** into existing files
- **No style modifications**
- **Full preservation** of translation systems
- **Maintains** original navigation functionality

### HTML File Requirements

For submenu HTML files:
```html
<!-- Navigation functions expected -->
<script>
function openContent(contentId) {
    window.parent.postMessage({
        type: 'open-content',
        contentId: contentId
    }, '*');
}

function closeSubmenu() {
    window.parent.postMessage({
        type: 'close-submenu'
    }, '*');
}
</script>
```

For detail content HTML files:
```html
<!-- Navigation functions expected -->
<script>
function backToSubmenu() {
    // Current layer determined automatically
    window.parent.postMessage({
        type: 'back-to-submenu',
        submenu: getCurrentLayer()
    }, '*');
}

function closeContent() {
    window.parent.postMessage({
        type: 'close-content'
    }, '*');
}
</script>
```

## Translation System Integration

### Translation Request Forwarding

```javascript
UiinfoHandler.prototype.forwardTranslationRequest = function(event) {
    if (window.TranslationHandler && window.TranslationHandler.handleIframeTranslationRequest) {
        window.TranslationHandler.handleIframeTranslationRequest(event.data, event.source);
    } else {
        this.app.fire('iframe-translation-request', {
            data: event.data,
            source: event.source
        });
    }
};
```

### Expected Translation Keys

HTML files should use `data-translate` attributes:
```html
<h1 data-translate="txt_Layer_1_Sinn_Content_SubMenu_1_1">STARTKLAR FÜR LEADERSHIP</h1>
<p data-translate="txt_Layer_1_Sinn_Content_SubMenu_1_4">Leadership content...</p>
```

## Responsive Layout System

### Dynamic Layout Calculation

```javascript
UiinfoHandler.prototype.calculateIframeLayout = function () {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const aspectRatio = viewportWidth / viewportHeight;
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    const isFullscreen = /* fullscreen detection */;

    // Platform-specific margin calculations
    // Returns: { marginTop, footerHeight, availableHeight }
};
```

### Supported Platforms
- Desktop (various resolutions)
- Mobile (iPhone optimized)
- Tablet orientations
- Fullscreen modes

## Implementation Guide

### 1. Asset Setup

1. **Upload HTML files** as assets in PlayCanvas
2. **Configure attributes** with proper asset references
3. **Set layer IDs** to match content routing

### 2. Content ID Mapping

Ensure content IDs in HTML match handler expectations:
```javascript
// Example for Selbstführung tools
'im-gleichgewicht-sein'
'organisiert-unterwegs'
'neue-gewohnheiten'
'endergebnis-vor-augen'
'wichtigste-zuerst'
```

### 3. Translation Integration

Connect with existing translation system:
```javascript
// In translation handler
this.app.on('iframe-translation-request', (data) => {
    this.handleIframeRequest(data.data, data.source);
});
```

## Error Handling

### Fallback Content Generation

When HTML assets are not found:
```javascript
UiinfoHandler.prototype.generateFallbackShortInfo = function (layerId) {
    return this.generateFromTemplate('shortInfo', {
        layerId: layerId,
        title: this.getLayerTitle(layerId),
        level: this.getLayerNumber(layerId),
        color: this.getLayerColor(layerId),
        content: `Information about ${layerId.replace('-kurzinfo', '')} leadership aspect.`
    });
};
```

### Content Not Found

```javascript
if (htmlAsset) {
    this.loadAssetContent(htmlAsset.htmlAsset, contentId, submenu, 'detail');
} else {
    alert('Content not found: ' + contentId);
}
```

## Performance Considerations

### Iframe Management
- **Single iframe** approach prevents memory leaks
- **Proper cleanup** on content switching
- **Efficient DOM manipulation**

### Asset Loading
- **On-demand loading** of content
- **Asset caching** through PlayCanvas system
- **Minimal DOM modifications**

## Best Practices

### HTML File Development
1. **Include complete navigation** functions
2. **Use consistent** message types
3. **Implement translation** system integration
4. **Test responsive** design

### Asset Configuration
1. **Use descriptive** content IDs
2. **Maintain consistent** layer naming
3. **Set appropriate** color themes
4. **Document** content relationships

### Testing
1. **Test all navigation** paths
2. **Verify translation** integration
3. **Check responsive** behavior
4. **Validate fallback** content

## Troubleshooting

### Common Issues

**Submenu not loading:**
- Check `layerId` in `submenuHtmlAssets`
- Verify HTML asset is properly uploaded
- Confirm content routing mapping

**Navigation not working:**
- Ensure HTML has required navigation functions
- Check message types match expectations
- Verify iframe communication setup

**Translations not working:**
- Confirm translation system integration
- Check `data-translate` attributes
- Verify message forwarding setup

**Layout issues:**
- Review `calculateIframeLayout()` function
- Check platform-specific settings
- Verify CSS viewport settings