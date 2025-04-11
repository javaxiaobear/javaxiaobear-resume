import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// Define theme presets
const themePresets = {
  default: {
    theme: 'light',
    primaryColor: '#1677ff',
    headingColor: '#2b3235',
    textColor: '#4b5563',
    backgroundColor: '#ffffff',
    secondaryBackground: '#f5f9fc',
    accentColor: '#52c41a',
    borderColor: '#e5e7eb',
    hoverColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    borderRadius: '6px',
    layoutSpacing: 'normal', // 'compact', 'normal', 'spacious'
  },
  modern: {
    theme: 'light',
    primaryColor: '#7e57c2',
    headingColor: '#333333',
    textColor: '#555555',
    backgroundColor: '#ffffff',
    secondaryBackground: '#f9f7fc',
    accentColor: '#26a69a',
    borderColor: '#eaeaf0',
    hoverColor: '#f3f0ff',
    fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
    fontSize: '14px',
    borderRadius: '8px',
    layoutSpacing: 'spacious',
  },
  professional: {
    theme: 'light',
    primaryColor: '#003366',
    headingColor: '#1a1a1a',
    textColor: '#333333',
    backgroundColor: '#ffffff',
    secondaryBackground: '#f7fafd',
    accentColor: '#0055a3',
    borderColor: '#d8e2e9',
    hoverColor: '#f0f4f8',
    fontFamily: '"Georgia", serif',
    fontSize: '14px',
    borderRadius: '2px',
    layoutSpacing: 'normal',
  },
  minimal: {
    theme: 'light',
    primaryColor: '#2c3e50',
    headingColor: '#2c3e50',
    textColor: '#34495e',
    backgroundColor: '#ffffff',
    secondaryBackground: '#fafbfc',
    accentColor: '#16a085',
    borderColor: '#eaecef',
    hoverColor: '#f8f9fa',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: '14px',
    borderRadius: '0px',
    layoutSpacing: 'compact',
  },
  dark: {
    theme: 'dark',
    primaryColor: '#3b82f6',
    headingColor: '#e5e7eb',
    textColor: '#d1d5db',
    backgroundColor: '#1f2937',
    secondaryBackground: '#111827',
    accentColor: '#10b981',
    borderColor: '#374151',
    hoverColor: '#374151',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    borderRadius: '6px',
    layoutSpacing: 'normal',
  },
  // 专业Java开发者主题
  javadev: {
    theme: 'light',
    primaryColor: '#f89820', // Java orange
    headingColor: '#2c3e50',
    textColor: '#34495e',
    backgroundColor: '#ffffff',
    secondaryBackground: '#f8f9fa',
    accentColor: '#5382a1', // Java blue
    borderColor: '#e9ecef',
    hoverColor: '#fff8e6',
    fontFamily: '"JetBrains Mono", "SF Mono", "Cascadia Code", monospace',
    fontSize: '14px',
    borderRadius: '4px',
    layoutSpacing: 'normal',
  },
};

// Define available fonts
export const availableFonts = [
  { label: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { label: '宋体', value: '"宋体", SimSun, serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { label: '黑体', value: '"黑体", SimHei, sans-serif' },
  { label: 'Georgia', value: '"Georgia", serif' },
  { label: 'Helvetica', value: '"Helvetica Neue", sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
];

// Define available layout spacing
export const layoutSpacingOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '标准', value: 'normal' },
  { label: '宽松', value: 'spacious' },
];

// Define the theme store
export const useThemeStore = defineStore('theme', () => {
  // Get stored theme or use default
  const storedTheme = localStorage.getItem('theme-settings');
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : themePresets.default;

  // State
  const theme = ref(initialTheme.theme || 'light');
  const primaryColor = ref(initialTheme.primaryColor);
  const headingColor = ref(initialTheme.headingColor);
  const textColor = ref(initialTheme.textColor);
  const backgroundColor = ref(initialTheme.backgroundColor);
  const secondaryBackground = ref(initialTheme.secondaryBackground);
  const accentColor = ref(initialTheme.accentColor);
  const borderColor = ref(initialTheme.borderColor);
  const hoverColor = ref(initialTheme.hoverColor);
  const fontFamily = ref(initialTheme.fontFamily);
  const fontSize = ref(initialTheme.fontSize);
  const borderRadius = ref(initialTheme.borderRadius);
  const layoutSpacing = ref(initialTheme.layoutSpacing);

  // Getters
  const getCssVars = computed(() => {
    return {
      '--primary-color': primaryColor.value,
      '--heading-color': headingColor.value,
      '--text-color': textColor.value,
      '--background-color': backgroundColor.value,
      '--secondary-background': secondaryBackground.value,
      '--accent-color': accentColor.value,
      '--border-color': borderColor.value,
      '--hover-color': hoverColor.value,
      '--font-family': fontFamily.value,
      '--font-size': fontSize.value,
      '--border-radius': borderRadius.value,
    };
  });

  // Get current theme preset name
  const getCurrentTheme = computed(() => {
    for (const [name, preset] of Object.entries(themePresets)) {
      if (
        preset.theme === theme.value &&
        preset.primaryColor === primaryColor.value &&
        preset.headingColor === headingColor.value &&
        preset.textColor === textColor.value &&
        preset.backgroundColor === backgroundColor.value &&
        preset.secondaryBackground === secondaryBackground.value &&
        preset.accentColor === accentColor.value &&
        preset.borderColor === borderColor.value &&
        preset.hoverColor === hoverColor.value &&
        preset.fontFamily === fontFamily.value &&
        preset.fontSize === fontSize.value &&
        preset.borderRadius === borderRadius.value &&
        preset.layoutSpacing === layoutSpacing.value
      ) {
        return name;
      }
    }
    return 'custom';
  });

  // Actions
  function setTheme(presetName) {
    const preset = themePresets[presetName];
    if (preset) {
      theme.value = preset.theme;
      primaryColor.value = preset.primaryColor;
      headingColor.value = preset.headingColor;
      textColor.value = preset.textColor;
      backgroundColor.value = preset.backgroundColor;
      secondaryBackground.value = preset.secondaryBackground;
      accentColor.value = preset.accentColor;
      borderColor.value = preset.borderColor;
      hoverColor.value = preset.hoverColor;
      fontFamily.value = preset.fontFamily;
      fontSize.value = preset.fontSize;
      borderRadius.value = preset.borderRadius;
      layoutSpacing.value = preset.layoutSpacing;

      saveThemeToLocalStorage();
    }
  }

  function updateThemeSetting(setting, value) {
    if (setting === 'theme') {
      theme.value = value;
    } else if (setting === 'primaryColor') {
      primaryColor.value = value;
    } else if (setting === 'headingColor') {
      headingColor.value = value;
    } else if (setting === 'textColor') {
      textColor.value = value;
    } else if (setting === 'backgroundColor') {
      backgroundColor.value = value;
    } else if (setting === 'secondaryBackground') {
      secondaryBackground.value = value;
    } else if (setting === 'accentColor') {
      accentColor.value = value;
    } else if (setting === 'borderColor') {
      borderColor.value = value;
    } else if (setting === 'hoverColor') {
      hoverColor.value = value;
    } else if (setting === 'fontFamily') {
      fontFamily.value = value;
    } else if (setting === 'fontSize') {
      fontSize.value = value;
    } else if (setting === 'borderRadius') {
      borderRadius.value = value;
    } else if (setting === 'layoutSpacing') {
      layoutSpacing.value = value;
    }

    saveThemeToLocalStorage();
  }

  function saveThemeToLocalStorage() {
    const themeSettings = {
      theme: theme.value,
      primaryColor: primaryColor.value,
      headingColor: headingColor.value,
      textColor: textColor.value,
      backgroundColor: backgroundColor.value,
      secondaryBackground: secondaryBackground.value,
      accentColor: accentColor.value,
      borderColor: borderColor.value,
      hoverColor: hoverColor.value,
      fontFamily: fontFamily.value,
      fontSize: fontSize.value,
      borderRadius: borderRadius.value,
      layoutSpacing: layoutSpacing.value,
    };

    localStorage.setItem('theme-settings', JSON.stringify(themeSettings));
  }

  // Automatically save theme changes to localStorage
  watch(
    [
      theme,
      primaryColor,
      headingColor,
      textColor,
      backgroundColor,
      secondaryBackground,
      accentColor,
      borderColor,
      hoverColor,
      fontFamily,
      fontSize,
      borderRadius,
      layoutSpacing
    ],
    () => saveThemeToLocalStorage(),
    { deep: true }
  );

  return {
    // State
    theme,
    primaryColor,
    headingColor,
    textColor,
    backgroundColor,
    secondaryBackground,
    accentColor,
    borderColor,
    hoverColor,
    fontFamily,
    fontSize,
    borderRadius,
    layoutSpacing,

    // Getters
    getCssVars,
    getCurrentTheme,

    // Actions
    setTheme,
    updateThemeSetting,
    saveThemeToLocalStorage,

    // Other exports
    themePresets,
  };
});
