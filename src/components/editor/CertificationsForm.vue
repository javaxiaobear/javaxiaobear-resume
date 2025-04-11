<template>
  <div class="form-container">
    <h2 class="form-title">证书与认证</h2>
    <p class="form-description">添加您获得的Java相关证书、培训认证或其他专业资质</p>

    <div class="certifications-list">
      <div v-if="!formState.items || formState.items.length === 0" class="empty-list">
        <p>还没有添加任何证书，点击"添加证书"按钮开始添加</p>
      </div>

      <div v-else class="certification-items">
        <a-card v-for="(cert, index) in formState.items" :key="index" class="certification-card">
          <template #extra>
            <div class="card-actions">
              <a-button type="text" @click="editCertification(index)">编辑</a-button>
              <a-button type="text" danger @click="removeCertification(index)">删除</a-button>
            </div>
          </template>
          <a-card-meta :title="cert.name" :description="cert.issuer" />
          <div class="certification-date">{{ cert.date }}</div>
          <div class="certification-description" v-if="cert.description">{{ cert.description }}</div>
        </a-card>
      </div>
    </div>

    <div class="form-actions">
      <a-button type="primary" @click="showAddCertificationModal">
        <template #icon><plus-outlined /></template>
        添加证书
      </a-button>
    </div>

    <a-modal v-model:visible="modalVisible" :title="isEditing ? '编辑证书' : '添加证书'" @ok="saveCertification"
      :okText="isEditing ? '保存' : '添加'" cancelText="取消">
      <a-form layout="vertical">
        <a-form-item label="证书名称" required>
          <a-input v-model:value="currentCert.name" placeholder="例如：Oracle认证Java工程师" />
        </a-form-item>
        <a-form-item label="颁发机构" required>
          <a-input v-model:value="currentCert.issuer" placeholder="例如：Oracle" />
        </a-form-item>
        <a-form-item label="获得日期" required>
          <a-input v-model:value="currentCert.date" placeholder="例如：2022-06" />
        </a-form-item>
        <a-form-item label="证书描述">
          <tiptap-editor v-model="currentCert.description" placeholder="可选：描述证书的含金量、考核内容等信息" />
        </a-form-item>
      </a-form>
    </a-modal>

    <div class="recommended-certs">
      <h3>Java开发相关推荐证书</h3>
      <div class="cert-suggestions">
        <a-card v-for="cert in recommendedCerts" :key="cert.name" class="cert-suggestion-card" hoverable
          @click="useSuggestedCert(cert)">
          <a-card-meta :title="cert.name" :description="cert.issuer" />
          <div class="cert-suggestion-desc">{{ cert.description }}</div>
        </a-card>
      </div>
    </div>

    <div class="form-tips">
      <h3>证书与认证小贴士</h3>
      <ul>
        <li>优先列出与Java开发相关的技术认证</li>
        <li>包括正式认证证书、培训证书和相关课程结业证明</li>
        <li>对于国际认证，请标明原文名称，如"Oracle Certified Professional, Java SE 11 Developer"</li>
        <li>如果证书有效期有限，请注明有效期</li>
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
const currentCert = reactive({
  name: '',
  issuer: '',
  date: '',
  description: ''
});

const recommendedCerts = [
  {
    name: 'Oracle认证Java专业工程师(OCPJP)',
    issuer: 'Oracle',
    date: '',
    description: '国际公认的Java认证，证明您拥有扎实的Java SE编程技能'
  },
  {
    name: 'Spring Professional认证',
    issuer: 'VMware',
    date: '',
    description: '验证您在Spring Framework方面的核心知识和专业技能'
  },
  {
    name: 'AWS认证开发人员',
    issuer: 'Amazon Web Services',
    date: '',
    description: '证明您在AWS上开发和维护应用程序的能力'
  },
  {
    name: 'Docker认证工程师(DCA)',
    issuer: 'Docker',
    date: '',
    description: '验证您使用Docker技术开发和维护应用程序的能力'
  },
  {
    name: '阿里云认证开发工程师',
    issuer: '阿里云',
    date: '',
    description: '证明您在阿里云平台上开发应用的专业能力'
  }
];

// Initialize form with props data
watch(() => props.data, (newVal) => {
  if (newVal && newVal.certifications && newVal.certifications.items) {
    formState.items = [...newVal.certifications.items];
  }
}, { immediate: true });

// Update parent data when form changes
watch(formState, (newVal) => {
  emit('update:data', {
    ...props.data,
    certifications: { items: [...newVal.items] }
  });
}, { deep: true });

const showAddCertificationModal = () => {
  isEditing.value = false;
  Object.assign(currentCert, {
    name: '',
    issuer: '',
    date: '',
    description: ''
  });
  modalVisible.value = true;
};

const editCertification = (index) => {
  isEditing.value = true;
  editingIndex.value = index;

  const cert = formState.items[index];
  Object.assign(currentCert, {
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    description: cert.description || ''
  });

  modalVisible.value = true;
};

const saveCertification = () => {
  // Validate required fields
  if (!currentCert.name.trim() || !currentCert.issuer.trim() || !currentCert.date.trim()) {
    alert('请填写所有必填字段');
    return;
  }

  const certData = {
    name: currentCert.name.trim(),
    issuer: currentCert.issuer.trim(),
    date: currentCert.date.trim(),
    description: currentCert.description.trim()
  };

  if (isEditing.value) {
    // Update existing certification
    formState.items[editingIndex.value] = certData;
  } else {
    // Add new certification
    formState.items.push(certData);
  }

  // Sort by date (most recent first)
  formState.items.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  modalVisible.value = false;
};

const removeCertification = (index) => {
  formState.items.splice(index, 1);
};

const useSuggestedCert = (cert) => {
  Object.assign(currentCert, {
    name: cert.name,
    issuer: cert.issuer,
    date: '',
    description: cert.description
  });

  modalVisible.value = true;
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

.certification-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.certification-card {
  border-radius: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.certification-date {
  margin-top: 12px;
  color: #767676;
  font-size: 14px;
}

.certification-description {
  margin-top: 8px;
  color: #575757;
}

.form-actions {
  margin-bottom: 24px;
}

.recommended-certs {
  margin-top: 32px;
  margin-bottom: 32px;
}

.recommended-certs h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2f4e57;
  margin-bottom: 16px;
}

.cert-suggestions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.cert-suggestion-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.cert-suggestion-card:hover {
  transform: translateY(-5px);
}

.cert-suggestion-desc {
  margin-top: 12px;
  color: #575757;
  font-size: 13px;
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
