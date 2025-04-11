<template>
  <a-modal
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :title="$t('主题设置')"
    width="800px"
    :footer="null"
    class="theme-selector-modal"
  >
    <!-- Rest of the component remains unchanged -->
    <div class="theme-selector">
      <a-tabs>
        <a-tab-pane key="presets" :tab="$t('主题预设')">
          <div class="presets-container">
            <div
              v-for="(preset, name) in themeStore.themePresets"
              :key="name"
              class="preset-item"
              :class="{ active: currentTheme === name }"
              @click="selectTheme(name)"
            >
              <div
                class="preset-preview"
                :style="{
                  backgroundColor: preset.backgroundColor,
                  borderRadius: preset.borderRadius,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }"
              >
                <div
                  class="preset-header"
                  :style="{
                    backgroundColor: preset.primaryColor,
                    height: '24px'
                  }"
                ></div>
                <div
                  class="preset-body"
                  :style="{
                    padding: '12px',
                    fontFamily: preset.fontFamily
                  }"
                >
                  <div
                    class="preset-heading"
                    :style="{
                      color: preset.headingColor,
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }"
                  >Aa</div>
                  <div
                    class="preset-text"
                    :style="{
                      color: preset.textColor,
                      fontSize: '14px',
                      marginBottom: '8px'
                    }"
                  >文本内容</div>
                  <div
                    class="preset-accent"
                    :style="{
                      backgroundColor: preset.accentColor,
                      height: '6px',
                      width: '60%',
                      borderRadius: '3px'
                    }"
                  ></div>
                </div>
              </div>
              <div class="preset-name">{{ getPresetDisplayName(name) }}</div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="custom" :tab="$t('自定义设置')">
          <div class="customizer-container">
            <div class="customizer-section">
              <h3>基础设置</h3>

              <div class="theme-mode-selector">
                <div class="option-label">主题模式</div>
                <a-radio-group v-model:value="themeStore.theme" button-style="solid" @change="updateThemeSetting('theme', $event.target.value)">
                  <a-radio-button value="light">
                    <template #icon><bulb-outlined /></template>
                    亮色
                  </a-radio-button>
                  <a-radio-button value="dark">
                    <template #icon><bulb-filled /></template>
                    暗色
                  </a-radio-button>
                </a-radio-group>
              </div>
            </div>

            <div class="customizer-section">
              <h3>颜色设置</h3>

              <div class="color-grid">
                <div class="color-option">
                  <div class="option-label">主色调</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.primaryColor"
                    @change="updateTheme('primaryColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">标题颜色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.headingColor"
                    @change="updateTheme('headingColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">文本颜色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.textColor"
                    @change="updateTheme('textColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">背景颜色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.backgroundColor"
                    @change="updateTheme('backgroundColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">次级背景</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.secondaryBackground"
                    @change="updateTheme('secondaryBackground', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">强调色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.accentColor"
                    @change="updateTheme('accentColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">边框颜色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.borderColor"
                    @change="updateTheme('borderColor', $event.target.value)"
                  />
                </div>

                <div class="color-option">
                  <div class="option-label">悬停颜色</div>
                  <a-input
                    type="color"
                    v-model:value="themeStore.hoverColor"
                    @change="updateTheme('hoverColor', $event.target.value)"
                  />
                </div>
              </div>
            </div>

            <div class="customizer-section">
              <h3>排版设置</h3>

              <div class="typography-settings">
                <div class="typography-option">
                  <div class="option-label">字体</div>
                  <a-select
                    v-model:value="themeStore.fontFamily"
                    style="width: 240px"
                    @change="updateTheme('fontFamily', $event)"
                  >
                    <a-select-option
                      v-for="font in availableFonts"
                      :key="font.value"
                      :value="font.value"
                    >
                      <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
                    </a-select-option>
                  </a-select>
                </div>

                <div class="typography-option">
                  <div class="option-label">字体大小: {{ themeStore.fontSize }}</div>
                  <div class="slider-with-value">
                    <a-slider
                      v-model:value="fontSizeValue"
                      :min="10"
                      :max="18"
                      :step="1"
                      style="width: 180px"
                      @change="updateFontSize"
                    />
                    <a-input-number
                      v-model:value="fontSizeValue"
                      :min="10"
                      :max="18"
                      :step="1"
                      style="width: 60px"
                      @change="updateFontSize"
                    />
                  </div>
                </div>

                <div class="typography-option">
                  <div class="option-label">圆角: {{ themeStore.borderRadius }}</div>
                  <div class="slider-with-value">
                    <a-slider
                      v-model:value="borderRadiusValue"
                      :min="0"
                      :max="16"
                      :step="1"
                      style="width: 180px"
                      @change="updateBorderRadius"
                    />
                    <a-input-number
                      v-model:value="borderRadiusValue"
                      :min="0"
                      :max="16"
                      :step="1"
                      style="width: 60px"
                      @change="updateBorderRadius"
                    />
                  </div>
                </div>

                <div class="typography-option">
                  <div class="option-label">布局间距</div>
                  <a-radio-group
                    v-model:value="themeStore.layoutSpacing"
                    button-style="solid"
                    @change="updateTheme('layoutSpacing', $event.target.value)"
                  >
                    <a-radio-button
                      v-for="option in layoutSpacingOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>
            </div>

            <div class="customizer-actions">
              <a-button @click="resetToDefaults">重置为默认</a-button>
              <a-button type="primary" @click="closeModal">完成</a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons-vue';
import { useThemeStore, availableFonts, layoutSpacingOptions } from '../../store/themeStore';

// Props and emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);

// Close modal
const closeModal = () => {
  emit('update:visible', false);
};

// Theme store
const themeStore = useThemeStore();

// Get current theme
const currentTheme = computed(() => themeStore.getCurrentTheme);

// Font size and border radius values for sliders
const fontSizeValue = ref(parseInt(themeStore.fontSize));
const borderRadiusValue = ref(parseInt(themeStore.borderRadius));

// Theme preset translations
const themePresetNames = {
  'default': '默认',
  'modern': '现代',
  'professional': '专业',
  'minimal': '简约',
  'dark': '暗色',
  'javadev': 'Java开发者',
  'custom': '自定义'
};

// Select a theme preset
const selectTheme = (presetName) => {
  themeStore.setTheme(presetName);
  updateSliderValues();
};

// Update theme settings
const updateTheme = (setting, value) => {
  themeStore.updateThemeSetting(setting, value);
};

// Update font size
const updateFontSize = (value) => {
  themeStore.updateThemeSetting('fontSize', `${value}px`);
  fontSizeValue.value = value;
};

// Update border radius
const updateBorderRadius = (value) => {
  themeStore.updateThemeSetting('borderRadius', `${value}px`);
  borderRadiusValue.value = value;
};

// Reset to default theme
const resetToDefaults = () => {
  themeStore.setTheme('default');
  updateSliderValues();
};

// Update slider values when theme changes
const updateSliderValues = () => {
  fontSizeValue.value = parseInt(themeStore.fontSize);
  borderRadiusValue.value = parseInt(themeStore.borderRadius);
};

// Get display name for a preset
const getPresetDisplayName = (name) => {
  return themePresetNames[name] || name;
};

// Watch for theme changes to update sliders
watch(
  () => themeStore.getCurrentTheme,
  () => updateSliderValues()
);

// For i18n translation
const $t = (text) => text; // Placeholder for i18n
</script>

<style scoped>
.theme-selector {
  width: 100%;
}

.presets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.preset-item {
  width: 140px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: var(--border-radius);
  padding: 8px;
}

.preset-item:hover, .preset-item.active {
  background-color: var(--hover-color);
}

.preset-item.active {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.preset-preview {
  height: 140px;
  margin-bottom: 8px;
}

.preset-name {
  text-align: center;
  font-size: 14px;
  color: var(--text-color);
  margin-top: 8px;
}

.customizer-container {
  max-width: 100%;
}

.customizer-section {
  margin-bottom: 24px;
}

.customizer-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--heading-color);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.theme-mode-selector {
  margin-bottom: 16px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.color-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.typography-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.typography-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-with-value {
  display: flex;
  align-items: center;
  gap: 16px;
}

.customizer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .color-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (max-width: 576px) {
  .presets-container {
    justify-content: center;
  }

  .color-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
