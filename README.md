# Certificate Generator

## Overview
This is a multilingual certificate generation web application that allows users to create personalized certificates with customizable element placement.

## Features
- Arabic and English language support
- Dynamic certificate template selection
- Customizable element placement for certificates with and without pictures

## Customization

### Certificate Element Placement
You can customize the placement of elements for certificates with and without pictures using the `updateCertificateConfig()` function.

#### Example Usage
```javascript
// Modify configuration for certificates with pictures
window.updateCertificateConfig({
    withPicture: {
        picture: {
            x: 800,      // Horizontal center position
            y: 800,      // Vertical position
            radius: 250, // Size of circular crop
            scale: 1     // Scale factor for picture size
        },
        name: {
            x: 800,      // Horizontal center position
            y: 1200,     // Vertical position
            fontSize: 64,// Font size
            fontFamily: '"Arial", sans-serif', // Font family
            color: '#ff0000' // Text color
        },
        signature: {
            x: 800,      // Horizontal center position
            y: 1400,     // Vertical position
            fontSize: 48,// Font size
            fontFamily: '"Arial", sans-serif', // Font family
            color: '#00ff00' // Text color
        }
    }
});

// Modify configuration for certificates without pictures
window.updateCertificateConfig({
    withoutPicture: {
        name: {
            x: 800,      // Horizontal center position
            y: 800,      // Vertical position
            fontSize: 72,// Larger font size
            fontFamily: '"Segoe UI", sans-serif', // Font family
            color: '#0000ff' // Text color
        },
        signature: {
            x: 800,      // Horizontal center position
            y: 1000,     // Vertical position
            fontSize: 56,// Slightly larger font size
            fontFamily: '"Segoe UI", sans-serif', // Font family
            color: '#ff00ff' // Text color
        }
    }
});
```

### Configuration Options
#### Certificates with Pictures
- `picture`: Controls profile picture placement
  - `x`: Horizontal position
  - `y`: Vertical position
  - `radius`: Size of circular crop
  - `scale`: Picture size scaling factor

- `name`: Controls full name placement
  - `x`: Horizontal position
  - `y`: Vertical position
  - `fontSize`: Text size
  - `fontFamily`: Font style
  - `color`: Text color

- `signature`: Controls signature placement
  - Same configuration options as `name`

#### Certificates without Pictures
- `name`: Controls full name placement
  - Same configuration options as with-picture name
  - Typically larger font size due to no picture

- `signature`: Controls signature placement
  - Same configuration options as with-picture signature
  - Typically larger font size due to no picture

## Setup
Simply open `index.html` in a modern web browser to use the application.

## Limitations
- Requires a modern web browser with JavaScript enabled
- Template images must be provided in the `templates/` directory