<template>
  <div class="form-container">
    <h2 class="form-title">项目经验</h2>
    <p class="form-description">添加您参与的Java项目，展示您的技术能力和解决问题的能力</p>

    <div class="projects-list">
      <div v-if="!formState.items || formState.items.length === 0" class="empty-list">
        <p>还没有添加任何项目经验，点击"添加项目"按钮开始添加</p>
      </div>

      <div v-else class="project-items">
        <a-card v-for="(project, index) in formState.items" :key="index" class="project-card">
          <template #extra>
            <div class="card-actions">
              <a-button type="text" @click="editProject(index)">编辑</a-button>
              <a-button type="text" danger @click="removeProject(index)">删除</a-button>
            </div>
          </template>
          <a-card-meta :title="project.name" :description="project.role" />
          <div class="project-period">{{ project.date }}</div>
          <div class="project-tech">
            <a-tag v-for="tech in project.technologies" :key="tech" color="green">{{ tech }}</a-tag>
          </div>
          <div class="project-description">{{ project.description }}</div>
        </a-card>
      </div>
    </div>

    <div class="form-actions">
      <a-button type="primary" @click="showAddProjectModal">
        <template #icon><plus-outlined /></template>
        添加项目
      </a-button>
    </div>

    <a-modal v-model:visible="modalVisible" :title="isEditing ? '编辑项目' : '添加项目'" @ok="saveProject"
      :okText="isEditing ? '保存' : '添加'" cancelText="取消" width="700px">
      <a-form layout="vertical">
        <a-form-item label="项目名称" required>
          <a-input v-model:value="currentProject.name" placeholder="例如：电商平台后台管理系统" />
        </a-form-item>
        <a-form-item label="您的角色" required>
          <a-input v-model:value="currentProject.role" placeholder="例如：后端开发工程师" />
        </a-form-item>
        <a-form-item label="项目时间" required>
          <a-input v-model:value="currentProject.date" placeholder="例如：2021-03至2022-05" />
        </a-form-item>
        <a-form-item label="技术栈" class="tech-stack-field">
          <div class="tech-input-container">
            <a-input v-model:value="techInput" placeholder="输入技术名称后按Enter添加，例如：Spring Boot"
              @keypress.enter.prevent="addTechItem" />
            <a-button @click="addTechItem">添加</a-button>
          </div>
          <div class="tech-tags">
            <a-tag v-for="(tech, idx) in currentProject.technologies" :key="idx" closable color="green"
              @close="removeTechItem(idx)">
              {{ tech }}
            </a-tag>
          </div>
          <div class="suggested-techs">
            <span>常用技术栈：</span>
            <a-tag v-for="tech in suggestedTechs" :key="tech" color="blue" class="suggested-tech"
              @click="quickAddTech(tech)">
              + {{ tech }}
            </a-tag>
          </div>
        </a-form-item>
        <a-form-item label="项目描述" required>
          <tiptap-editor v-model="currentProject.description" placeholder="描述项目背景、您的职责、解决的技术挑战和取得的成果..." />
        </a-form-item>
        <div class="ai-description-help">
          <h4>Java项目描述示例:</h4>
          <div class="example-list">
            <div class="example-item" @click="useDescriptionExample('ecommerce')">
              <p>开发基于Spring
                Boot的电商平台订单系统，实现了订单创建、支付、配送等核心功能。使用RabbitMQ处理订单异步任务，解决高并发下订单处理瓶颈。通过Redis缓存热点数据，优化查询性能提升65%。引入Elasticsearch实现商品搜索功能，提升用户体验。
              </p>
            </div>
            <div class="example-item" @click="useDescriptionExample('management')">
              <p>负责企业内部管理系统的开发，使用Spring
                Cloud微服务架构设计实现。基于RBAC模型开发权限管理模块，支持灵活的角色权限配置。设计并实现基于JWT的单点登录系统，解决多服务间认证问题。通过Docker+Jenkins实现CI/CD流程，缩短部署时间80%。
              </p>
            </div>
          </div>
        </div>
      </a-form>
    </a-modal>

    <div class="form-tips">
      <h3>项目经验小贴士</h3>
      <ul>
        <li>按照重要性排序，将最能体现您技术能力的项目放在前面</li>
        <li>清晰列出项目中使用的Java相关技术栈和框架</li>
        <li>描述您在项目中解决的具体技术挑战</li>
        <li>尽量量化您的贡献和项目成果</li>
        <li>对于团队项目，明确说明您负责的部分</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import TiptapEditor from './TiptapEditor.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:data']);

const formState = reactive({
  items: []
});

const modalVisible = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const techInput = ref('');

const currentProject = reactive({
  name: '',
  role: '',
  date: '',
  technologies: [],
  description: ''
});

const suggestedTechs = [
  'Java', 'Spring Boot', 'Spring MVC', 'Spring Cloud', 'MyBatis', 'Hibernate',
  'MySQL', 'Redis', 'RabbitMQ', 'Kafka', 'Docker', 'Kubernetes',
  'Maven', 'Git', 'Jenkins', 'JUnit', 'Microservices', 'AWS',
  'RESTful API', 'Vue.js', 'React', 'Angular', 'Elasticsearch'
];

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.projects && newVal.projects.items) {
    formState.items = [...newVal.projects.items];
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    projects: { items: [...newVal.items] }
  });
}, { deep: true });

const showAddProjectModal = () => {
  isEditing.value = false;
  Object.assign(currentProject, {
    name: '',
    role: '',
    date: '',
    technologies: [],
    description: ''
  });
  modalVisible.value = true;
};

const editProject = (index) => {
  isEditing.value = true;
  editingIndex.value = index;

  const project = formState.items[index];
  Object.assign(currentProject, {
    name: project.name,
    role: project.role,
    date: project.date,
    technologies: [...project.technologies],
    description: project.description
  });

  modalVisible.value = true;
};

const saveProject = () => {
  // Validate required fields
  if (!currentProject.name.trim() || !currentProject.role.trim() ||
    !currentProject.date.trim() || !currentProject.description.trim()) {
    alert('请填写所有必填字段');
    return;
  }

  const projectData = {
    name: currentProject.name.trim(),
    role: currentProject.role.trim(),
    date: currentProject.date.trim(),
    technologies: [...currentProject.technologies],
    description: currentProject.description.trim()
  };

  if (isEditing.value) {
    // Update existing project
    formState.items[editingIndex.value] = projectData;
  } else {
    // Add new project
    formState.items.push(projectData);
  }

  modalVisible.value = false;
};

const removeProject = (index) => {
  formState.items.splice(index, 1);
};

const addTechItem = () => {
  if (!techInput.value.trim()) return;

  const tech = techInput.value.trim();
  if (!currentProject.technologies.includes(tech)) {
    currentProject.technologies.push(tech);
  }

  techInput.value = '';
};

const removeTechItem = (index) => {
  currentProject.technologies.splice(index, 1);
};

const quickAddTech = (tech) => {
  if (!currentProject.technologies.includes(tech)) {
    currentProject.technologies.push(tech);
  }
};

const useDescriptionExample = (type) => {
  if (type === 'ecommerce') {
    currentProject.description = '开发基于Spring Boot的电商平台订单系统，实现了订单创建、支付、配送等核心功能。使用RabbitMQ处理订单异步任务，解决高并发下订单处理瓶颈。通过Redis缓存热点数据，优化查询性能提升65%。引入Elasticsearch实现商品搜索功能，提升用户体验。';
  } else if (type === 'management') {
    currentProject.description = '负责企业内部管理系统的开发，使用Spring Cloud微服务架构设计实现。基于RBAC模型开发权限管理模块，支持灵活的角色权限配置。设计并实现基于JWT的单点登录系统，解决多服务间认证问题。通过Docker+Jenkins实现CI/CD流程，缩短部署时间80%。';
  }
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

.empty-list {
  padding: 24px;
  background-color: #f9f9fa;
  border-radius: 8px;
  text-align: center;
  color: #a0a0a0;
  margin-bottom: 24px;
}

.project-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.project-card {
  border-radius: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.project-period {
  margin-top: 12px;
  color: #767676;
  font-size: 14px;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.project-description {
  margin-top: 12px;
  color: #575757;
  white-space: pre-line;
}

.form-actions {
  margin-bottom: 24px;
}

.tech-stack-field {
  margin-bottom: 16px;
}

.tech-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.suggested-techs {
  margin-top: 12px;
  font-size: 14px;
  color: #767676;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.suggested-tech {
  cursor: pointer;
  transition: transform 0.2s;
}

.suggested-tech:hover {
  transform: scale(1.05);
}

.ai-description-help {
  margin-top: 16px;
  background-color: #f9f9fa;
  padding: 12px;
  border-radius: 8px;
}

.ai-description-help h4 {
  font-size: 14px;
  font-weight: 600;
  color: #2f4e57;
  margin-bottom: 8px;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.example-item:hover {
  background-color: #f0f7ff;
}

.example-item p {
  margin: 0;
  font-size: 13px;
  color: #575757;
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
