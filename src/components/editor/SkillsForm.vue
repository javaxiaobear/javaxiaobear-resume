<template>
  <div class="form-container">
    <h2 class="form-title">技能与专长</h2>
    <p class="form-description">添加您掌握的技术技能和专长，突出与Java开发相关的技能</p>

    <div class="skills-form">
      <div class="skills-header">
        <h3>我的技能列表</h3>
        <a-button type="primary" @click="showAddSkillModal">
          <template #icon><plus-outlined /></template>
          添加技能
        </a-button>
      </div>

      <div v-if="!formState.items || formState.items.length === 0" class="empty-skills">
        <p>还没有添加任何技能，点击"添加技能"按钮开始添加</p>
      </div>

      <div v-else class="skills-list">
        <a-tag
          v-for="(skill, index) in formState.items"
          :key="index"
          :color="skillColors[index % skillColors.length]"
          class="skill-tag"
          closable
          @close="removeSkill(index)"
        >
          {{ skill.name }}
          <template v-if="skill.level">
            <span class="skill-level">{{ getLevelText(skill.level) }}</span>
          </template>
        </a-tag>
      </div>
    </div>

    <div class="form-tips">
      <h3>Java开发推荐技能</h3>
      <div class="recommended-skills">
        <a-tag
          v-for="skill in recommendedSkills"
          :key="skill"
          color="blue"
          class="recommended-skill"
          @click="quickAddSkill(skill)"
        >
          + {{ skill }}
        </a-tag>
      </div>
    </div>

    <a-modal
      v-model:visible="modalVisible"
      title="添加技能"
      @ok="addSkill"
      okText="添加"
      cancelText="取消"
    >
      <a-form layout="vertical">
        <a-form-item label="技能名称" required>
          <a-input v-model:value="newSkill.name" placeholder="例如：Java" />
        </a-form-item>
        <a-form-item label="掌握程度">
          <a-select v-model:value="newSkill.level" placeholder="选择掌握程度">
            <a-select-option value="beginner">入门</a-select-option>
            <a-select-option value="intermediate">熟练</a-select-option>
            <a-select-option value="advanced">精通</a-select-option>
            <a-select-option value="expert">专家</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, watch, defineProps, defineEmits } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

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
const newSkill = reactive({
  name: '',
  level: 'intermediate'
});

const skillColors = [
  'blue', 'cyan', 'geekblue', 'purple', 'magenta'
];

const recommendedSkills = [
  'Java', 'Spring Boot', 'Spring MVC', 'Spring Cloud', 'Hibernate', 'JPA',
  'MyBatis', 'MySQL', 'PostgreSQL', 'Oracle', 'Redis', 'MongoDB',
  'Docker', 'Kubernetes', 'Maven', 'Gradle', 'Git', 'Jenkins',
  'JUnit', 'Mockito', 'JVM调优', 'RESTful API', 'Microservices',
  'RabbitMQ', 'Kafka', 'ElasticSearch', 'AWS', 'Azure', 'Linux'
];

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.skills && newVal.skills.items) {
    formState.items = [...newVal.skills.items];
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    skills: { items: [...newVal.items] }
  });
}, { deep: true });

const showAddSkillModal = () => {
  newSkill.name = '';
  newSkill.level = 'intermediate';
  modalVisible.value = true;
};

const addSkill = () => {
  if (!newSkill.name.trim()) {
    window.$message.error('技能名称不能为空');
    return;
  }

  // Check for duplicates
  const isDuplicate = formState.items.some(
    item => item.name.toLowerCase() === newSkill.name.trim().toLowerCase()
  );

  if (isDuplicate) {
    window.$message.warning('该技能已存在');
    return;
  }

  formState.items.push({
    name: newSkill.name.trim(),
    level: newSkill.level
  });

  modalVisible.value = false;
};

const removeSkill = (index) => {
  formState.items.splice(index, 1);
};

const quickAddSkill = (skillName) => {
  // Check for duplicates
  const isDuplicate = formState.items.some(
    item => item.name.toLowerCase() === skillName.toLowerCase()
  );

  if (isDuplicate) {
    window.$message.warning('该技能已存在');
    return;
  }

  formState.items.push({
    name: skillName,
    level: 'intermediate'
  });
};

const getLevelText = (level) => {
  const levelMap = {
    'beginner': '入门',
    'intermediate': '熟练',
    'advanced': '精通',
    'expert': '专家'
  };
  return levelMap[level] || '';
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

.skills-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skills-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2f4e57;
  margin: 0;
}

.empty-skills {
  padding: 24px;
  background-color: #f9f9fa;
  border-radius: 8px;
  text-align: center;
  color: #a0a0a0;
  margin-bottom: 24px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.skill-tag {
  font-size: 14px;
  padding: 4px 8px;
}

.skill-level {
  font-size: 12px;
  opacity: 0.8;
  margin-left: 4px;
}

.form-tips {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9fa;
  border-radius: 8px;
}

.form-tips h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2f4e57;
  margin-bottom: 16px;
}

.recommended-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommended-skill {
  cursor: pointer;
  transition: transform 0.2s;
}

.recommended-skill:hover {
  transform: scale(1.05);
}
</style>
