const CUSTOM_THEME_COLOR_CONFIG = {
  colors: {
    primary: 'rgb(0, 60, 143)', // Dark Blue
    onPrimary: 'rgb(255, 255, 255)', // White
    primaryContainer: 'rgb(0, 42, 92)', // Darker Shade of Dark Blue
    onPrimaryContainer: 'rgb(178, 235, 242)', // Light Blue

    secondary: 'rgb(255, 123, 0)', // Orange
    onSecondary: 'rgb(255, 255, 255)', // White
    secondaryContainer: 'rgb(255, 183, 77)', // Light Orange
    onSecondaryContainer: 'rgb(191, 54, 12)', // Darker Orange

    tertiary: 'rgb(32, 44, 89)', // Dark Blue (Accent Color)
    onTertiary: 'rgb(255, 255, 255)', // White
    tertiaryContainer: 'rgb(120, 140, 255)', // Light Blue for Tertiary
    onTertiaryContainer: 'rgb(50, 16, 23)', // Darker Tertiary

    error: 'rgb(186, 26, 26)', // Error Red
    onError: 'rgb(255, 255, 255)', // White for error text
    errorContainer: 'rgb(255, 218, 214)', // Light error background
    onErrorContainer: 'rgb(65, 0, 2)', // Darker error text

    background: 'rgb(255, 255, 255)', // White
    onBackground: 'rgb(29, 27, 30)', // Dark Gray
    surface: 'rgb(255, 255, 255)', // White
    onSurface: 'rgb(29, 27, 30)', // Dark Gray

    surfaceVariant: 'rgb(230, 230, 230)', // Light surface variant
    onSurfaceVariant: 'rgb(74, 69, 78)', // Dark text on surface variant

    outline: 'rgb(124, 117, 126)', // Outline color
    outlineVariant: 'rgb(204, 196, 206)', // Outline variant color

    shadow: 'rgb(0, 0, 0)', // Shadow color
    scrim: 'rgb(0, 0, 0)', // Scrim color

    inverseSurface: 'rgb(50, 47, 51)', // Inverse surface
    inverseOnSurface: 'rgb(245, 239, 244)', // Inverse text color
    inversePrimary: 'rgb(178, 235, 242)', // Light Blue for inverse primary

    elevation: {
      level0: 'transparent',
      level1: 'rgb(248, 242, 251)', // Elevation level 1
      level2: 'rgb(244, 236, 248)', // Elevation level 2
      level3: 'rgb(240, 231, 246)', // Elevation level 3
      level4: 'rgb(239, 229, 245)', // Elevation level 4
      level5: 'rgb(236, 226, 243)', // Elevation level 5
    },

    surfaceDisabled: 'rgba(29, 27, 30, 0.12)', // Disabled surface
    onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)', // Disabled text color
    backdrop: 'rgba(51, 47, 55, 0.4)', // Backdrop color
  },
};

export default CUSTOM_THEME_COLOR_CONFIG;
