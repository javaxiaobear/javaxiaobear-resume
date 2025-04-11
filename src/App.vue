<template>
  <div class="app-layout" :style="cssVars" :data-spacing="themeStore.layoutSpacing" :data-theme="themeStore.theme">
    <header class="header">
      <div class="header-container">
        <div class="logo-container">
          <router-link to="/" class="logo">
            <code-outlined class="logo-icon" />
            <span class="logo-text">小熊学Java简历</span>
          </router-link>
        </div>

        <nav class="nav" :class="{ 'nav-mobile-visible': mobileMenuOpen }">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link" :class="{ active: currentRoute === 'home' }">
                <home-outlined class="nav-icon" />
                <span>首页</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/editor" class="nav-link" :class="{ active: currentRoute === 'editor' }">
                <edit-outlined class="nav-icon" />
                <span>编辑器</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/templates" class="nav-link" :class="{ active: currentRoute === 'templates' }">
                <appstore-outlined class="nav-icon" />
                <span>模板</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/interview" class="nav-link" :class="{ active: currentRoute === 'interview' }">
                <solution-outlined class="nav-icon" />
                <span>面试模拟</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="header-actions">
          <a-button
            class="theme-button"
            shape="circle"
            @click="showThemeSelector = true"
          >
            <bg-colors-outlined />
          </a-button>

          <a-dropdown v-model:visible="userMenuOpen" placement="bottomRight">
            <a-avatar class="user-avatar" :style="{ backgroundColor: '#1677ff' }">
              <template #icon><user-outlined /></template>
            </a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <cloud-upload-outlined /> 云端备份
                </a-menu-item>
                <a-menu-item key="2">
                  <cloud-download-outlined /> 恢复备份
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="3">
                  <github-outlined /> 开源代码
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <button class="mobile-menu-button" @click="toggleMobileMenu">
            <menu-outlined v-if="!mobileMenuOpen" />
            <close-outlined v-else />
          </button>
        </div>
      </div>
    </header>

    <main class="main-content content-spacing">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3 class="footer-heading">小熊学Java简历</h3>
          <p class="footer-description">
            专为Java开发者打造的简历制作工具和面试模拟平台，帮助您脱颖而出
          </p>
        </div>

        <div class="footer-section">
          <h3 class="footer-heading">功能</h3>
          <ul class="footer-links">
            <li><router-link to="/editor">简历编辑器</router-link></li>
            <li><router-link to="/templates">简历模板</router-link></li>
            <li><router-link to="/interview">面试模拟</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-heading">链接</h3>
          <ul class="footer-links">
            <li><a href="https://github.com/xiaoxiong-java-resume" target="_blank">GitHub</a></li>
            <li><a href="#" @click.prevent="showThemeSelector = true">自定义主题</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} 小熊学Java简历. 版权所有</p>
      </div>
    </footer>

    <theme-selector :visible="showThemeSelector" @update:visible="showThemeSelector = $event" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  CodeOutlined, HomeOutlined, EditOutlined, AppstoreOutlined,
  SolutionOutlined, BgColorsOutlined, MenuOutlined, CloseOutlined,
  UserOutlined, GithubOutlined, CloudUploadOutlined, CloudDownloadOutlined
} from '@ant-design/icons-vue';
import { useThemeStore } from './store/themeStore';
import ThemeSelector from './components/common/ThemeSelector.vue';

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

// State variables
const showThemeSelector = ref(false);
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

// Apply CSS variables from theme store
const cssVars = computed(() => themeStore.getCssVars);

// Get current route for active link highlighting
const currentRoute = computed(() => {
  const path = route.path;
  if (path === '/') return 'home';
  if (path.startsWith('/editor')) return 'editor';
  if (path.startsWith('/templates')) return 'templates';
  if (path.startsWith('/interview')) return 'interview';
  return '';
});

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Close mobile menu on route change
watch(route, () => {
  mobileMenuOpen.value = false;
});

// Close mobile menu on window resize
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen.value) {
      mobileMenuOpen.value = false;
    }
  });
});

// Navigation
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style>
:root {
  /* Theme color variables with default values */
  --primary-color: #1677ff;
  --heading-color: #2b3235;
  --text-color: #4b5563;
  --background-color: #ffffff;
  --accent-color: #52c41a;
  --secondary-background: #f5f9fc;
  --border-color: #e5e7eb;
  --hover-color: #f3f4f6;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-base: 14px;
  --border-radius: 6px;

  /* Spacing variables */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Transition */
  --transition-speed: 0.3s;
}

[data-theme="dark"] {
  --heading-color: #e5e7eb;
  --text-color: #d1d5db;
  --background-color: #1f2937;
  --secondary-background: #111827;
  --border-color: #374151;
  --hover-color: #374151;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.logo-container {
  margin-right: 48px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: var(--heading-color);
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
  color: var(--primary-color);
}

.nav {
  flex: 1;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
}

.nav-link:hover {
  background-color: var(--hover-color);
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 500;
}

.nav-icon {
  margin-right: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  cursor: pointer;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 20px;
  cursor: pointer;
}

.main-content {
  margin-top: 64px;
  flex: 1;
  padding: 32px 16px;
  background-color: var(--secondary-background);
}

.footer {
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  padding: 40px 16px 20px;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}

.footer-heading {
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--heading-color);
}

.footer-description {
  max-width: 300px;
  color: var(--text-color);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color var(--transition-speed);
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  max-width: 1280px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-color);
  font-size: 14px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive styles */
@media (max-width: 768px) {
  .nav {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px);
    background-color: var(--background-color);
    z-index: 999;
    transform: translateX(-100%);
    transition: transform var(--transition-speed);
    padding: 20px;
  }

  .nav-mobile-visible {
    transform: translateX(0);
  }

  .nav-list {
    flex-direction: column;
  }

  .nav-item {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .nav-link {
    padding: 12px 16px;
  }

  .mobile-menu-button {
    display: block;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .header {
    height: 60px;
  }

  .header-container {
    padding: 0 12px;
  }

  .logo-text {
    font-size: 16px;
  }

  .logo-icon {
    font-size: 20px;
  }

  .main-content {
    margin-top: 60px;
    padding: 24px 12px;
  }

  .nav {
    top: 60px;
    height: calc(100vh - 60px);
  }
}

/* Layout spacing based on theme setting */
[data-spacing="compact"] .content-spacing {
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);
}

[data-spacing="normal"] .content-spacing {
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}

[data-spacing="spacious"] .content-spacing {
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}
</style>
