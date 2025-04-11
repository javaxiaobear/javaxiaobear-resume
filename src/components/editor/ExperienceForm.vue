<template>
  <div class="form-container">
    <h2 class="form-title">工作经历</h2>
    <p class="form-description">添加您的工作经验，突出与Java开发相关的职责和成就</p>

    <div class="experience-list">
      <div v-if="!formState.items || formState.items.length === 0" class="empty-list">
        <p>还没有添加任何工作经历，点击"添加工作经历"按钮开始添加</p>
      </div>

      <div v-else class="experience-items">
        <a-card v-for="(job, index) in formState.items" :key="index" class="experience-card">
          <template #extra>
            <div class="card-actions">
              <a-button type="text" @click="editExperience(index)">编辑</a-button>
              <a-button type="text" danger @click="removeExperience(index)">删除</a-button>
            </div>
          </template>
          <a-card-meta :title="job.company" :description="job.title" />
          <div class="experience-period">{{ job.startDate }} - {{ job.endDate || '至今' }}</div>
          <div class="experience-location" v-if="job.location">{{ job.location }}</div>
          <div class="experience-description">{{ job.description }}</div>
        </a-card>
      </div>
    </div>

    <div class="form-actions">
      <a-button type="primary" @click="showAddExperienceModal">
        <template #icon><plus-outlined /></template>
        添加工作经历
      </a-button>
    </div>

    <a-modal v-model:visible="modalVisible" :title="isEditing ? '编辑工作经历' : '添加工作经历'" @ok="saveExperience"
      :okText="isEditing ? '保存' : '添加'" cancelText="取消" width="700px">
      <a-form layout="vertical">
        <a-form-item label="公司名称" required>
          <a-input v-model:value="currentJob.company" placeholder="例如：ABC科技有限公司" />
        </a-form-item>
        <a-form-item label="职位" required>
          <a-input v-model:value="currentJob.title" placeholder="例如：Java高级开发工程师" />
        </a-form-item>
        <a-form-item label="工作地点">
          <a-input v-model:value="currentJob.location" placeholder="例如：北京市" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始时间" required>
              <a-input v-model:value="currentJob.startDate" placeholder="例如：2020-01" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-input v-model:value="currentJob.endDate" placeholder="例如：2023-05，在职则留空" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="工作描述" required>
          <tiptap-editor v-model="currentJob.description" placeholder="描述您的工作职责、成就和使用的技术栈等..." />
        </a-form-item>
        <div class="ai-description-help">
          <h4>Java开发工作描述示例:</h4>
          <div class="example-list">
            <div class="example-item" @click="useDescriptionExample('backend')">
              <p>负责公司核心业务系统的后端开发与维护，使用Spring Boot、MyBatis构建REST API。优化数据库查询性能，将某关键接口响应时间减少40%。参与微服务架构设计，实施服务拆分，提高了系统扩展性。
              </p>
            </div>
            <div class="example-item" @click="useDescriptionExample('full-stack')">
              <p>作为全栈开发工程师，使用Spring Boot开发后端服务，Vue.js构建前端界面。主导电商支付模块重构，引入设计模式优化代码结构，提高系统可维护性。开发自动化测试套件，提高代码覆盖率达到80%以上。
              </p>
            </div>
          </div>
        </div>
      </a-form>
    </a-modal>

    <div class="form-tips">
      <h3>工作经历小贴士</h3>
      <ul>
        <li>按照时间倒序排列，最近的工作经历放在最前面</li>
        <li>使用量化的成就来展示您的贡献，例如"提高系统性能30%"</li>
        <li>突出与Java开发相关的技术栈和项目</li>
        <li>清晰描述您的职责，但避免过于冗长的描述</li>
        <li>使用专业术语，但确保招聘经理能够理解</li>
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
const currentJob = reactive({
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  description: ''
});

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.experience && newVal.experience.items) {
    formState.items = [...newVal.experience.items];
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    experience: { items: [...newVal.items] }
  });
}, { deep: true });

const showAddExperienceModal = () => {
  isEditing.value = false;
  Object.assign(currentJob, {
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  modalVisible.value = true;
};

const editExperience = (index) => {
  isEditing.value = true;
  editingIndex.value = index;

  const job = formState.items[index];
  Object.assign(currentJob, {
    company: job.company,
    title: job.title,
    location: job.location || '',
    startDate: job.startDate,
    endDate: job.endDate || '',
    description: job.description
  });

  modalVisible.value = true;
};

const saveExperience = () => {
  // Validate required fields
  if (!currentJob.company.trim() || !currentJob.title.trim() ||
    !currentJob.startDate.trim() || !currentJob.description.trim()) {
    // Show error message
    // In a real app, you might use a proper notification system
    alert('请填写所有必填字段');
    return;
  }

  const jobData = {
    company: currentJob.company.trim(),
    title: currentJob.title.trim(),
    location: currentJob.location.trim(),
    startDate: currentJob.startDate.trim(),
    endDate: currentJob.endDate.trim(),
    description: currentJob.description.trim()
  };

  if (isEditing.value) {
    // Update existing job
    formState.items[editingIndex.value] = jobData;
  } else {
    // Add new job
    formState.items.push(jobData);
  }

  // Sort jobs by date (most recent first)
  formState.items.sort((a, b) => {
    const dateA = a.endDate || '9999';
    const dateB = b.endDate || '9999';
    return dateB.localeCompare(dateA);
  });

  modalVisible.value = false;
};

const removeExperience = (index) => {
  formState.items.splice(index, 1);
};

const useDescriptionExample = (type) => {
  if (type === 'backend') {
    currentJob.description = '负责公司核心业务系统的后端开发与维护，使用Spring Boot、MyBatis构建REST API。优化数据库查询性能，将某关键接口响应时间减少40%。参与微服务架构设计，实施服务拆分，提高了系统扩展性。';
  } else if (type === 'full-stack') {
    currentJob.description = '作为全栈开发工程师，使用Spring Boot开发后端服务，Vue.js构建前端界面。主导电商支付模块重构，引入设计模式优化代码结构，提高系统可维护性。开发自动化测试套件，提高代码覆盖率达到80%以上。';
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

.experience-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.experience-card {
  border-radius: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.experience-period {
  margin-top: 12px;
  color: #767676;
  font-size: 14px;
}

.experience-location {
  color: #767676;
  font-size: 14px;
  margin-top: 4px;
}

.experience-description {
  margin-top: 12px;
  color: #575757;
  white-space: pre-line;
}

.form-actions {
  margin-bottom: 24px;
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
