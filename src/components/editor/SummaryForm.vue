<template>
  <div class="form-container">
    <h2 class="form-title">个人总结</h2>
    <p class="form-description">用简洁的语言描述您的专业背景、技能和目标，这是简历的重要部分</p>

    <a-form layout="vertical" :model="formState">
      <a-form-item name="content">
        <tiptap-editor v-model="formState.content" placeholder="描述您的专业技能、经验和职业目标..." />
        <div class="word-count">
          {{ formState.content.length }} / 300 字符
        </div>
      </a-form-item>
    </a-form>

    <div class="summary-examples">
      <h3>示例模板</h3>
      <p>点击以下示例将其添加到您的个人总结中：</p>

      <div class="example-list">
        <div class="example-item" @click="useExample('junior')">
          <h4>初级Java开发工程师模板</h4>
          <p>
            作为一名Java开发工程师，我拥有扎实的Java编程基础及Spring框架使用经验。熟练掌握面向对象编程、数据库操作、RESTful
            API开发。善于学习新技术，注重代码质量，具有较强的团队协作精神。寻求能够发挥我Java开发技能并提供专业成长机会的职位。
          </p>
        </div>

        <div class="example-item" @click="useExample('mid')">
          <h4>中级Java开发工程师模板</h4>
          <p>
            具有3年Java开发经验的工程师，擅长Spring
            Boot、MyBatis等主流框架的应用开发。深入理解JVM性能调优，具备微服务架构设计经验。参与过多个中大型项目的全生命周期开发，熟悉敏捷开发流程。追求编写高质量、可维护的代码，善于解决复杂技术问题。
          </p>
        </div>

        <div class="example-item" @click="useExample('senior')">
          <h4>高级Java开发工程师模板</h4>
          <p>
            资深Java开发工程师，拥有5年以上Java企业级应用开发经验。精通Spring
            Cloud微服务架构，具有丰富的分布式系统设计经验。擅长高并发、高可用系统的设计与优化，熟悉DevOps流程及工具链。具备技术团队管理经验，能够指导初中级开发人员，推动项目高质量交付。
          </p>
        </div>
      </div>
    </div>

    <div class="form-tips">
      <h3>编写个人总结小贴士</h3>
      <ul>
        <li>控制在150-300字符之间，简洁有力</li>
        <li>突出与Java开发相关的核心技能和经验</li>
        <li>可以提及您的技术专长领域（如微服务、高并发等）</li>
        <li>适当体现您的职业目标和价值观</li>
        <li>使用AI优化功能可以帮助您完善个人总结</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue';
import TiptapEditor from './TiptapEditor.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:data']);

const formState = reactive({
  content: ''
});

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.summary) {
    formState.content = newVal.summary.content || '';
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    summary: { content: newVal.content }
  });
}, { deep: true });

const useExample = (type) => {
  let content = '';

  switch (type) {
    case 'junior':
      content = '作为一名Java开发工程师，我拥有扎实的Java编程基础及Spring框架使用经验。熟练掌握面向对象编程、数据库操作、RESTful API开发。善于学习新技术，注重代码质量，具有较强的团队协作精神。寻求能够发挥我Java开发技能并提供专业成长机会的职位。';
      break;
    case 'mid':
      content = '具有3年Java开发经验的工程师，擅长Spring Boot、MyBatis等主流框架的应用开发。深入理解JVM性能调优，具备微服务架构设计经验。参与过多个中大型项目的全生命周期开发，熟悉敏捷开发流程。追求编写高质量、可维护的代码，善于解决复杂技术问题。';
      break;
    case 'senior':
      content = '资深Java开发工程师，拥有5年以上Java企业级应用开发经验。精通Spring Cloud微服务架构，具有丰富的分布式系统设计经验。擅长高并发、高可用系统的设计与优化，熟悉DevOps流程及工具链。具备技术团队管理经验，能够指导初中级开发人员，推动项目高质量交付。';
      break;
  }

  formState.content = content;
};
</script>

<style scoped>
.form-container {
  max-width: 100%;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2f4e57;
}

.form-description {
  color: #576b74;
  margin-bottom: 24px;
}

.word-count {
  text-align: right;
  color: #a0a0a0;
  font-size: 12px;
  margin-top: 4px;
}

.summary-examples {
  margin-top: 32px;
  margin-bottom: 32px;
}

.summary-examples h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2f4e57;
  margin-bottom: 12px;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example-item {
  background-color: #f9f9fa;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.example-item:hover {
  background-color: #f0f7ff;
}

.example-item h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 8px;
}

.example-item p {
  font-size: 0.9rem;
  color: #576b74;
  line-height: 1.6;
  margin: 0;
}

.form-tips {
  margin-top: 32px;
  padding: 16px;
  background-color: #f9f9fa;
  border-radius: 8px;
}

.form-tips h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2f4e57;
  margin-bottom: 12px;
}

.form-tips ul {
  padding-left: 20px;
  margin: 0;
}

.form-tips li {
  color: #576b74;
  margin-bottom: 8px;
}
</style>
