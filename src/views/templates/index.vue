<template>
  <div class="templates-container">
    <div class="templates-header">
      <h1 class="page-title">简历模板</h1>
      <p class="page-description">选择适合Java工程师的专业简历模板，突出你的技术栈和项目经验</p>
    </div>

    <div class="templates-filter">
      <a-radio-group v-model:value="selectedCategory" button-style="solid" class="category-filter">
        <a-radio-button value="all">全部模板</a-radio-button>
        <a-radio-button value="junior">初级开发</a-radio-button>
        <a-radio-button value="mid">中级开发</a-radio-button>
        <a-radio-button value="senior">高级/架构师</a-radio-button>
      </a-radio-group>
    </div>

    <div class="templates-grid">
      <a-card v-for="template in filteredTemplates" :key="template.id" class="template-card" hoverable>
        <template #cover>
          <div class="template-preview">
            <img :src="template.previewUrl" :alt="template.name" />
            <div class="template-overlay">
              <a-button type="primary" @click="useTemplate(template)">使用此模板</a-button>
            </div>
          </div>
        </template>
        <a-card-meta :title="template.name">
          <template #description>
            <div class="template-meta">
              <span class="template-category">{{ template.categoryLabel }}</span>
              <div class="template-tags">
                <span v-for="tag in template.tags" :key="tag" class="template-tag">{{ tag }}</span>
              </div>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedCategory = ref('all');

// Template data
const templates = [
  {
    id: 1,
    name: 'Java初级开发模板',
    category: 'junior',
    categoryLabel: '初级开发',
    tags: ['简洁', '专业'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  },
  {
    id: 2,
    name: 'Spring Boot专家',
    category: 'mid',
    categoryLabel: '中级开发',
    tags: ['技术栈', '项目导向'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  },
  {
    id: 3,
    name: 'Java架构师模板',
    category: 'senior',
    categoryLabel: '高级/架构师',
    tags: ['系统设计', '领导力'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  },
  {
    id: 4,
    name: 'Java全栈开发',
    category: 'mid',
    categoryLabel: '中级开发',
    tags: ['全栈', '现代化'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  },
  {
    id: 5,
    name: 'Java微服务专家',
    category: 'senior',
    categoryLabel: '高级/架构师',
    tags: ['微服务', '云原生'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  },
  {
    id: 6,
    name: 'Java入门模板',
    category: 'junior',
    categoryLabel: '初级开发',
    tags: ['清晰', '学习导向'],
    previewUrl: 'https://ext.same-assets.com/3127409675/937404902.png',
  }
];

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return templates;
  }
  return templates.filter(template => template.category === selectedCategory.value);
});

const useTemplate = (template) => {
  // Store the selected template in localStorage or state management
  localStorage.setItem('selectedTemplate', JSON.stringify(template));
  // Navigate to the editor
  router.push('/editor');
};
</script>

<style scoped>
.templates-container {
  max-width: 1200px;
  margin: 0 auto;
}

.templates-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  color: #2f4e57;
  margin-bottom: 16px;
}

.page-description {
  font-size: 1.1rem;
  color: #475b63;
  max-width: 700px;
  margin: 0 auto;
}

.templates-filter {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.category-filter {
  margin-bottom: 20px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.template-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.template-preview {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.template-card:hover .template-preview img {
  transform: scale(1.05);
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.template-meta {
  margin-top: 8px;
}

.template-category {
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1677ff;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.template-tag {
  padding: 2px 8px;
  background: #f9f9fa;
  color: #2f4e57;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
