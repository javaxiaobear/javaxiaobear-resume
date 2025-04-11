<template>
  <div class="form-container">
    <h2 class="form-title">基本信息</h2>
    <p class="form-description">填写您的个人基本信息，这些信息将显示在简历顶部</p>

    <a-form layout="vertical" :model="formState">
      <a-form-item label="姓名" name="name" required>
        <a-input v-model:value="formState.name" placeholder="例如：张三" />
      </a-form-item>

      <a-form-item label="求职意向" name="jobTitle" required>
        <a-input v-model:value="formState.jobTitle" placeholder="例如：Java高级工程师" />
      </a-form-item>

      <a-form-item label="电话" name="phone">
        <a-input v-model:value="formState.phone" placeholder="您的联系电话" />
      </a-form-item>

      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="您的电子邮箱" />
      </a-form-item>

      <a-form-item label="所在地" name="location">
        <a-input v-model:value="formState.location" placeholder="例如：北京市" />
      </a-form-item>

      <a-form-item label="GitHub" name="github">
        <a-input v-model:value="formState.github" placeholder="您的GitHub主页" />
      </a-form-item>

      <a-form-item label="个人网站" name="website">
        <a-input v-model:value="formState.website" placeholder="您的个人网站或博客" />
      </a-form-item>
    </a-form>

    <div class="form-tips">
      <h3>小贴士</h3>
      <ul>
        <li>确保您的联系方式是正确的，这样招聘方才能联系到您</li>
        <li>对于Java开发岗位，建议添加GitHub链接展示您的代码能力</li>
        <li>保持信息简洁明了，突出重点</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:data']);

const formState = reactive({
  name: '',
  jobTitle: '',
  phone: '',
  email: '',
  location: '',
  github: '',
  website: ''
});

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.basic) {
    Object.assign(formState, newVal.basic);
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    basic: { ...newVal }
  });
}, { deep: true });
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
