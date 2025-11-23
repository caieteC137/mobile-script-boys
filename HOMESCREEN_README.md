# HomeScreen Implementation

## Overview
The HomeScreen is the main dashboard that appears after successful login, featuring a museum discovery interface with your custom color palette and typography.

## Features Implemented

### 🎨 Design Elements
- **Bronze Header** (#8B6F47) with logo and avatar
- **Color Palette Integration**:
  - Bronze: #8B6F47 (primary)
  - Amber: #C17E3A (accent)
  - Parchment: #F5F0E8 (background)
  - Moss Green: #4A7C59 (success/ratings)
  - Terracotta: #A8402E (error/categories)

### 🏛️ Components
1. **MuseumCard Component** (`components/MuseumCard.js`)
   - Horizontal card layout with image, rating, and details
   - Touch interactions for navigation
   - Consistent styling with color palette

2. **HomeScreen** (`screens/HomeScreen.js`)
   - Bronze header with logo and user avatar
   - Horizontal museum carousel
   - Category grid with icons
   - Recent visits section
   - Bottom tab navigation

### 🧭 Navigation
- **React Navigation** integration
- Stack navigator: LoginScreen → HomeScreen
- Tab navigation within HomeScreen
- Smooth transitions and proper navigation flow

### 📱 User Experience
- **Responsive Design**: Adapts to different screen sizes
- **Touch Interactions**: Proper feedback and navigation
- **Visual Hierarchy**: Clear typography and spacing
- **Accessibility**: Proper contrast and touch targets

## Typography
- **Playfair Display**: Used for headings and titles (serif)
- **Montserrat**: Used for body text and UI elements (sans-serif)
- Fallback fonts provided for cross-platform compatibility

## Usage
1. User logs in successfully on LoginScreen
2. Navigation automatically redirects to HomeScreen
3. User can browse featured museums in horizontal carousel
4. Categories provide quick access to different museum types
5. Bottom tabs allow navigation between different sections

## Customization
The HomeScreen is fully customizable through:
- Color palette in `utils/fonts.js`
- Museum data in the `museums` array
- Category items and icons
- Tab bar configuration

## Dependencies
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- @expo/vector-icons
- react-native-screens
- react-native-safe-area-context
