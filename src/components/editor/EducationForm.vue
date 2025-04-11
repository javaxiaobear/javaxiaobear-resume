<template>
  <div class="form-container">
    <h2 class="form-title">教育经历</h2>
    <p class="form-description">添加您的学历信息，按照时间倒序排列</p>

    <div class="education-list">
      <div v-if="!formState.items || formState.items.length === 0" class="empty-list">
        <p>还没有添加任何教育经历，点击"添加教育经历"按钮开始添加</p>
      </div>

      <div v-else class="education-items">
        <a-card v-for="(edu, index) in formState.items" :key="index" class="education-card">
          <template #extra>
            <div class="card-actions">
              <a-button type="text" @click="editEducation(index)">编辑</a-button>
              <a-button type="text" danger @click="removeEducation(index)">删除</a-button>
            </div>
          </template>
          <a-card-meta :title="edu.school" :description="`${edu.degree} · ${edu.major}`" />
          <div class="education-period">{{ edu.startDate }} - {{ edu.endDate || '至今' }}</div>
          <div class="education-description">{{ edu.description }}</div>
        </a-card>
      </div>
    </div>

    <div class="form-actions">
      <a-button type="primary" @click="showAddEducationModal">
        <template #icon><plus-outlined /></template>
        添加教育经历
      </a-button>
    </div>

    <a-modal v-model:visible="modalVisible" :title="isEditing ? '编辑教育经历' : '添加教育经历'" @ok="saveEducation"
      :okText="isEditing ? '保存' : '添加'" cancelText="取消">
      <a-form layout="vertical">
        <a-form-item label="学校名称" required>
          <a-input v-model:value="currentEdu.school" placeholder="例如：北京大学" />
        </a-form-item>
        <a-form-item label="学位">
          <a-select v-model:value="currentEdu.degree" placeholder="选择学位">
            <a-select-option value="本科">本科</a-select-option>
            <a-select-option value="硕士">硕士</a-select-option>
            <a-select-option value="博士">博士</a-select-option>
            <a-select-option value="专科">专科</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业" required>
          <a-input v-model:value="currentEdu.major" placeholder="例如：计算机科学与技术" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始时间" required>
              <a-input v-model:value="currentEdu.startDate" placeholder="例如：2018-09" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-input v-model:value="currentEdu.endDate" placeholder="例如：2022-06，未毕业则留空" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="描述">
          <tiptap-editor v-model="currentEdu.description" placeholder="描述您的学习成就、参与的项目、获得的奖项等" />
        </a-form-item>
      </a-form>
    </a-modal>

    <div class="form-tips">
      <h3>教育经历小贴士</h3>
      <ul>
        <li>按照时间顺序排列，最近的教育经历放在最前面</li>
        <li>对于计算机相关专业，可以提及核心课程和学习成就</li>
        <li>如果有与编程相关的获奖经历，建议在描述中提及</li>
        <li>对于非计算机专业但从事Java开发工作的求职者，可以强调自学能力和相关技术背景</li>
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

const currentEdu = reactive({
  school: '',
  degree: '本科',
  major: '',
  startDate: '',
  endDate: '',
  description: ''
});

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.education && newVal.education.items) {
    formState.items = [...newVal.education.items];
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    education: { items: [...newVal.items] }
  });
}, { deep: true });

const showAddEducationModal = () => {
  isEditing.value = false;
  Object.assign(currentEdu, {
    school: '',
    degree: '本科',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  modalVisible.value = true;
};

const editEducation = (index) => {
  isEditing.value = true;
  editingIndex.value = index;

  const edu = formState.items[index];
  Object.assign(currentEdu, {
    school: edu.school,
    degree: edu.degree,
    major: edu.major,
    startDate: edu.startDate,
    endDate: edu.endDate || '',
    description: edu.description || ''
  });

  modalVisible.value = true;
};

const saveEducation = () => {
  // Validate required fields
  if (!currentEdu.school.trim() || !currentEdu.major.trim() || !currentEdu.startDate.trim()) {
    alert('请填写所有必填字段');
    return;
  }

  const eduData = {
    school: currentEdu.school.trim(),
    degree: currentEdu.degree,
    major: currentEdu.major.trim(),
    startDate: currentEdu.startDate.trim(),
    endDate: currentEdu.endDate.trim(),
    description: currentEdu.description.trim()
  };

  if (isEditing.value) {
    // Update existing education
    formState.items[editingIndex.value] = eduData;
  } else {
    // Add new education
    formState.items.push(eduData);
  }

  // Sort education by date (most recent first)
  formState.items.sort((a, b) => {
    const dateA = a.endDate || '9999';
    const dateB = b.endDate || '9999';
    return dateB.localeCompare(dateA);
  });

  modalVisible.value = false;
};

const removeEducation = (index) => {
  formState.items.splice(index, 1);
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

.education-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.education-card {
  border-radius: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.education-period {
  margin-top: 12px;
  color: #767676;
  font-size: 14px;
}

.education-description {
  margin-top: 8px;
  color: #575757;
}

.form-actions {
  margin-bottom: 24px;
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
