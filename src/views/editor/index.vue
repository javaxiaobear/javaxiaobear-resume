<template>
  <div class="editor-container">
    <div class="editor-sidebar" :class="{ 'mobile-collapsed': isMobileCollapsed }">
      <div class="editor-sections">
        <a-menu class="editor-menu" mode="inline" v-model:selectedKeys="activeSection">
          <a-menu-item key="basic">
            <template #icon><user-outlined /></template>
            基本信息
          </a-menu-item>
          <a-menu-item key="education">
            <template #icon><read-outlined /></template>
            教育经历
          </a-menu-item>
          <a-menu-item key="skills">
            <template #icon><code-outlined /></template>
            技能与专长
          </a-menu-item>
          <a-menu-item key="experience">
            <template #icon><project-outlined /></template>
            工作经历
          </a-menu-item>
          <a-menu-item key="projects">
            <template #icon><appstore-outlined /></template>
            项目经验
          </a-menu-item>
          <a-menu-item key="certifications">
            <template #icon><safety-certificate-outlined /></template>
            证书与认证
          </a-menu-item>
          <a-menu-item key="summary">
            <template #icon><profile-outlined /></template>
            个人总结
          </a-menu-item>
        </a-menu>
      </div>

      <div class="editor-actions">
        <a-button type="primary" class="action-button" block @click="saveResume">
          保存
        </a-button>
        <a-button class="action-button" block @click="previewResume">
          预览
        </a-button>
        <a-dropdown :trigger="['click']" class="export-dropdown">
          <a-button class="action-button" block>
            导出 <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="pdf" @click="exportPDF">
                <file-pdf-outlined /> 导出为 PDF
              </a-menu-item>
              <a-menu-item key="word" @click="exportWord">
                <file-word-outlined /> 导出为 Word
              </a-menu-item>
              <a-menu-item key="json" @click="exportJSON">
                <code-outlined /> 导出为 JSON
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button type="dashed" class="action-button ai-button" block @click="openAIHelper">
          <thunderbolt-outlined v-if="!aiOptimizing" /> AI 优化助手
        </a-button>
      </div>
    </div>

    <div class="mobile-sidebar-toggle" @click="toggleMobileSidebar">
      <menu-outlined v-if="isMobileCollapsed" />
      <close-outlined v-else />
    </div>

    <div class="editor-content">
      <div class="editor-form" :class="{ 'form-hidden': isFormHidden }">
        <div class="form-toggle" @click="toggleForm">
          <left-outlined v-if="isFormHidden" />
          <right-outlined v-else />
        </div>
        <component :is="currentSectionComponent" v-model:data="resumeData"></component>
      </div>

      <div class="editor-preview">
        <div class="resume-preview">
          <div class="resume-header">
            <h1>{{ resumeData.basic.name || '姓名' }}</h1>
            <div class="resume-contact">
              <span v-if="resumeData.basic.phone">
                <mobile-outlined /> {{ resumeData.basic.phone }}
              </span>
              <span v-if="resumeData.basic.email">
                <mail-outlined /> {{ resumeData.basic.email }}
              </span>
              <span v-if="resumeData.basic.github">
                <github-outlined /> {{ resumeData.basic.github }}
              </span>
            </div>
            <div class="resume-job-title">{{ resumeData.basic.jobTitle || 'Java开发工程师' }}</div>
            <p class="resume-summary">{{ resumeData.summary.content || '请添加个人总结...' }}</p>
          </div>

          <div v-if="resumeData.skills.items && resumeData.skills.items.length > 0" class="resume-section">
            <h2>技能与专长</h2>
            <div class="skills-container">
              <a-tag v-for="skill in resumeData.skills.items" :key="skill.name" color="blue">
                {{ skill.name }}
              </a-tag>
            </div>
          </div>

          <div v-if="resumeData.experience.items && resumeData.experience.items.length > 0" class="resume-section">
            <h2>工作经历</h2>
            <div v-for="job in resumeData.experience.items" :key="job.company" class="experience-item">
              <div class="item-header">
                <h3>{{ job.company }}</h3>
                <span>{{ job.startDate }} - {{ job.endDate || '至今' }}</span>
              </div>
              <div class="item-title">{{ job.title }}</div>
              <div class="item-description">{{ job.description }}</div>
            </div>
          </div>

          <div v-if="resumeData.projects.items && resumeData.projects.items.length > 0" class="resume-section">
            <h2>项目经验</h2>
            <div v-for="project in resumeData.projects.items" :key="project.name" class="project-item">
              <div class="item-header">
                <h3>{{ project.name }}</h3>
                <span>{{ project.date }}</span>
              </div>
              <div class="item-title">{{ project.role }}</div>
              <div class="project-tech">
                <a-tag v-for="tech in project.technologies" :key="tech" color="green">
                  {{ tech }}
                </a-tag>
              </div>
              <div class="item-description">{{ project.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="aiHelperVisible" title="AI 优化助手" width="700px" :footer="null">
      <div class="ai-helper-content">
        <h3>选择需要优化的部分</h3>
        <a-checkbox-group v-model:value="aiSections">
          <a-checkbox value="summary">个人总结</a-checkbox>
          <a-checkbox value="experience">工作经历描述</a-checkbox>
          <a-checkbox value="projects">项目经验描述</a-checkbox>
          <a-checkbox value="skills">技能优化</a-checkbox>
        </a-checkbox-group>

        <h3>优化方向</h3>
        <a-radio-group v-model:value="aiStyle">
          <a-radio value="professional">专业简洁</a-radio>
          <a-radio value="detailed">详细全面</a-radio>
          <a-radio value="achievement">成就导向</a-radio>
        </a-radio-group>

        <div class="ai-actions">
          <a-button type="primary" @click="runAIOptimization" :loading="aiOptimizing">
            <thunderbolt-outlined v-if="!aiOptimizing" /> 开始优化
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, markRaw, defineAsyncComponent } from 'vue';
import {
  UserOutlined, ReadOutlined, CodeOutlined, ProjectOutlined,
  AppstoreOutlined, ProfileOutlined, SafetyCertificateOutlined,
  ThunderboltOutlined, MobileOutlined, MailOutlined, GithubOutlined,
  DownOutlined, MenuOutlined, CloseOutlined,
  FilePdfOutlined, FileWordOutlined, LeftOutlined, RightOutlined
} from '@ant-design/icons-vue';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import aiService from '../../services/aiService';

const BasicInfoForm = defineAsyncComponent(() =>
  import('../../components/editor/BasicInfoForm.vue')
);
const EducationForm = defineAsyncComponent(() =>
  import('../../components/editor/EducationForm.vue')
);
const SkillsForm = defineAsyncComponent(() =>
  import('../../components/editor/SkillsForm.vue')
);
const ExperienceForm = defineAsyncComponent(() =>
  import('../../components/editor/ExperienceForm.vue')
);
const ProjectsForm = defineAsyncComponent(() =>
  import('../../components/editor/ProjectsForm.vue')
);
const CertificationsForm = defineAsyncComponent(() =>
  import('../../components/editor/CertificationsForm.vue')
);
const SummaryForm = defineAsyncComponent(() =>
  import('../../components/editor/SummaryForm.vue')
);

// Active section in the sidebar
const activeSection = ref(['basic']);

// Resume data structure
const resumeData = reactive({
  basic: {
    name: '',
    jobTitle: '',
    phone: '',
    email: '',
    location: '',
    github: '',
    website: ''
  },
  education: {
    items: []
  },
  skills: {
    items: []
  },
  experience: {
    items: []
  },
  projects: {
    items: []
  },
  certifications: {
    items: []
  },
  summary: {
    content: ''
  }
});

// AI helper modal
const aiHelperVisible = ref(false);
const aiSections = ref(['summary']);
const aiStyle = ref('professional');
const aiOptimizing = ref(false);

// Add state for mobile sidebar toggle and form visibility
const isMobileCollapsed = ref(window.innerWidth <= 768);
const isFormHidden = ref(false);

// Toggle form visibility
const toggleForm = () => {
  isFormHidden.value = !isFormHidden.value;
};

// Add a method to toggle mobile sidebar
const toggleMobileSidebar = () => {
  isMobileCollapsed.value = !isMobileCollapsed.value;
};

// Add a listener for window resize events
onMounted(() => {
  const savedResume = localStorage.getItem('resume');
  if (savedResume) {
    const parsedResume = JSON.parse(savedResume);
    Object.assign(resumeData, parsedResume);
  }

  // Check if a template was selected
  const selectedTemplate = localStorage.getItem('selectedTemplate');
  if (selectedTemplate) {
    console.log('Template selected:', JSON.parse(selectedTemplate));
  }

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

// Handle window resize
const handleResize = () => {
  if (window.innerWidth <= 768) {
    isMobileCollapsed.value = true;
  }
};

// Compute the current section component to display
const currentSectionComponent = computed(() => {
  const section = activeSection.value[0];

  switch (section) {
    case 'basic':
      return markRaw(BasicInfoForm);
    case 'education':
      return markRaw(EducationForm);
    case 'skills':
      return markRaw(SkillsForm);
    case 'experience':
      return markRaw(ExperienceForm);
    case 'projects':
      return markRaw(ProjectsForm);
    case 'certifications':
      return markRaw(CertificationsForm);
    case 'summary':
      return markRaw(SummaryForm);
    default:
      return markRaw(BasicInfoForm);
  }
});

// Methods
const saveResume = () => {
  localStorage.setItem('resume', JSON.stringify(resumeData));
  window.$message.success('简历已保存');
};

const previewResume = () => {
  console.log('Preview resume');
};

const exportPDF = () => {
  window.$message.loading('正在生成PDF文件...');

  // 获取简历预览区域
  const element = document.querySelector('.resume-preview');

  if (!element) {
    window.$message.error('找不到简历预览内容');
    return;
  }

  // 创建一个克隆以避免修改原始DOM
  const clone = element.cloneNode(true);

  // 设置固定宽度以匹配A4纸
  clone.style.width = '210mm';
  clone.style.padding = '20mm';
  clone.style.backgroundColor = 'white';

  // 临时添加到body以让html2pdf正确渲染
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  document.body.appendChild(clone);

  // 使用html2pdf
  import('html2pdf.js').then((html2pdfModule) => {
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: 10,
      filename: `${resumeData.basic.name || '简历'}_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(clone).set(opt).save().then(() => {
      document.body.removeChild(clone);
      window.$message.success('PDF已生成并下载');
    }).catch((error) => {
      console.error('PDF generation error:', error);
      document.body.removeChild(clone);
      window.$message.error('PDF生成失败');
    });
  }).catch(error => {
    console.error('Failed to load html2pdf:', error);
    document.body.removeChild(clone);
    window.$message.error('加载PDF生成工具失败');
  });
};

const exportWord = async () => {
  window.$message.loading('正在生成Word文档...');

  try {
    // 创建新文档
    const doc = new Document();

    // 添加标题部分 - 姓名和职位
    const name = resumeData.basic.name || '姓名';
    const jobTitle = resumeData.basic.jobTitle || 'Java开发工程师';

    // 添加标题和子标题
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          text: name,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: jobTitle,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: "",
        }),
      ],
    });

    // 添加联系信息
    const contactInfo = [];

    if (resumeData.basic.phone) {
      contactInfo.push(`电话: ${resumeData.basic.phone}`);
    }

    if (resumeData.basic.email) {
      contactInfo.push(`邮箱: ${resumeData.basic.email}`);
    }

    if (resumeData.basic.github) {
      contactInfo.push(`GitHub: ${resumeData.basic.github}`);
    }

    doc.addSection({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun(contactInfo.join(" | ")),
          ],
        }),
        new Paragraph({
          text: "",
        }),
      ],
    });

    // 添加个人总结
    if (resumeData.summary && resumeData.summary.content) {
      doc.addSection({
        children: [
          new Paragraph({
            text: "个人总结",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: resumeData.summary.content,
          }),
          new Paragraph({
            text: "",
          }),
        ],
      });
    }

    // 添加技能
    if (resumeData.skills && resumeData.skills.items && resumeData.skills.items.length > 0) {
      const skillsSection = {
        children: [
          new Paragraph({
            text: "技能与专长",
            heading: HeadingLevel.HEADING_2,
          }),
        ],
      };

      // 添加每个技能
      resumeData.skills.items.forEach(skill => {
        skillsSection.children.push(
          new Paragraph({
            bullet: {
              level: 0,
            },
            text: `${skill.name}${skill.level ? ` - ${skill.level}` : ''}`,
          })
        );
      });

      // 添加空行
      skillsSection.children.push(
        new Paragraph({
          text: "",
        })
      );

      doc.addSection(skillsSection);
    }

    // 添加教育经历
    if (resumeData.education && resumeData.education.items && resumeData.education.items.length > 0) {
      const eduSection = {
        children: [
          new Paragraph({
            text: "教育经历",
            heading: HeadingLevel.HEADING_2,
          }),
        ],
      };

      // 添加每个教育经历
      resumeData.education.items.forEach(edu => {
        eduSection.children.push(
          new Paragraph({
            text: `${edu.institution} - ${edu.degree}`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: `${edu.startDate} - ${edu.endDate || '至今'}`,
          }),
          new Paragraph({
            text: edu.description || '',
          }),
          new Paragraph({
            text: "",
          })
        );
      });

      doc.addSection(eduSection);
    }

    // 添加工作经历
    if (resumeData.experience && resumeData.experience.items && resumeData.experience.items.length > 0) {
      const expSection = {
        children: [
          new Paragraph({
            text: "工作经历",
            heading: HeadingLevel.HEADING_2,
          }),
        ],
      };

      // 添加每个工作经历
      resumeData.experience.items.forEach(exp => {
        expSection.children.push(
          new Paragraph({
            text: `${exp.company} - ${exp.position}`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: `${exp.startDate} - ${exp.endDate || '至今'}`,
          }),
          new Paragraph({
            text: exp.description || '',
          }),
          new Paragraph({
            text: "",
          })
        );
      });

      doc.addSection(expSection);
    }

    // 添加项目经验
    if (resumeData.projects && resumeData.projects.items && resumeData.projects.items.length > 0) {
      const projSection = {
        children: [
          new Paragraph({
            text: "项目经验",
            heading: HeadingLevel.HEADING_2,
          }),
        ],
      };

      // 添加每个项目
      resumeData.projects.items.forEach(proj => {
        projSection.children.push(
          new Paragraph({
            text: proj.name,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: `${proj.startDate} - ${proj.endDate || '至今'}`,
          }),
          new Paragraph({
            text: proj.description || '',
          }),
          new Paragraph({
            text: proj.technologies ? `使用技术: ${proj.technologies}` : '',
          }),
          new Paragraph({
            text: "",
          })
        );
      });

      doc.addSection(projSection);
    }

    // 添加证书
    if (resumeData.certifications && resumeData.certifications.items && resumeData.certifications.items.length > 0) {
      const certSection = {
        children: [
          new Paragraph({
            text: "证书与认证",
            heading: HeadingLevel.HEADING_2,
          }),
        ],
      };

      // 添加每个证书
      resumeData.certifications.items.forEach(cert => {
        certSection.children.push(
          new Paragraph({
            bullet: {
              level: 0,
            },
            text: `${cert.name}${cert.date ? ` (${cert.date})` : ''}${cert.issuer ? ` - ${cert.issuer}` : ''}`,
          })
        );
      });

      doc.addSection(certSection);
    }

    // 生成和保存文档
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${resumeData.basic.name || '简历'}_${new Date().toLocaleDateString()}.docx`);

    window.$message.success('Word文档已生成并下载');
  } catch (error) {
    console.error('Word generation error:', error);
    window.$message.error('Word文档生成失败');
  }
};

const exportJSON = () => {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'resume.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

const openAIHelper = () => {
  aiHelperVisible.value = true;
};

const runAIOptimization = async () => {
  if (aiSections.value.length === 0) {
    window.$message.warning('请至少选择一个需要优化的部分');
    return;
  }

  aiOptimizing.value = true;

  try {
    const optimizedData = await aiService.optimizeResume(
      resumeData,
      aiSections.value,
      aiStyle.value
    );

    Object.assign(resumeData, optimizedData);
    window.$message.success('AI优化完成！');
  } catch (error) {
    console.error('AI optimization error:', error);
    window.$message.error('AI优化失败，请稍后再试');
  } finally {
    aiOptimizing.value = false;
    aiHelperVisible.value = false;
  }
};
</script>

<style scoped>
.editor-container {
  display: flex;
  height: calc(100vh - 84px);
  position: relative;
}

.editor-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  z-index: 100;
}

.editor-sections {
  flex: 1;
  overflow-y: auto;
}

.editor-menu {
  border-right: none;
}

.editor-actions {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-button {
  margin-bottom: 8px;
}

.ai-button {
  margin-top: 8px;
  border-color: #1677ff;
  color: #1677ff;
}

.editor-content {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
}

.editor-form {
  width: 45%;
  padding: 20px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
  transition: all 0.3s ease;
}

.form-hidden {
  width: 0;
  padding: 0;
  border: none;
}

.form-toggle {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-toggle:hover {
  background: #4096ff;
  width: 28px;
  right: -28px;
}

.editor-preview {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f5f5;
  transition: all 0.3s ease;
}



.resume-preview {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 40px;
  min-height: 100%;
  border-radius: 4px;
}

.resume-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
}

.resume-header h1 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #2f4e57;
}

.resume-job-title {
  font-size: 18px;
  color: #1677ff;
  margin-bottom: 12px;
}

.resume-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  color: #575757;
}

.resume-summary {
  color: #575757;
  line-height: 1.6;
}

.resume-section {
  margin-bottom: 30px;
}

.resume-section h2 {
  font-size: 18px;
  color: #2f4e57;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.experience-item,
.project-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-header h3 {
  font-size: 16px;
  font-weight: bold;
  color: #2f4e57;
  margin: 0;
}

.item-header span {
  color: #767676;
  font-size: 14px;
}

.item-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #1677ff;
}

.item-description {
  color: #575757;
  line-height: 1.6;
}

.project-tech {
  margin-bottom: 8px;
}

.ai-helper-content {
  padding: 16px 0;
}

.ai-helper-content h3 {
  margin-bottom: 16px;
  color: #2f4e57;
}

.ai-actions {
  margin-top: 24px;
  text-align: right;
}

/* Mobile sidebar toggle button */
.mobile-sidebar-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #1677ff;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 200;
}

/* Responsive styles */
@media (max-width: 1200px) {

  .editor-form,
  .editor-preview {
    padding: 15px;
  }

  .resume-preview {
    padding: 25px;
  }
}

@media (max-width: 992px) {
  .editor-content {
    flex-direction: column;
  }

  .editor-form,
  .editor-preview {
    width: 100%;
    height: 50%;
  }

  .editor-form {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
}

@media (max-width: 768px) {
  .mobile-sidebar-toggle {
    display: flex;
  }

  .editor-sidebar {
    position: fixed;
    left: 0;
    top: 84px;
    bottom: 0;
    height: calc(100vh - 84px);
    transition: transform 0.3s ease;
  }

  .mobile-collapsed {
    transform: translateX(-100%);
  }

  .editor-content {
    margin-left: 0;
  }

  .resume-preview {
    padding: 20px;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-header h3 {
    margin-bottom: 4px;
  }
}

@media (max-width: 576px) {
  .editor-container {
    height: calc(100vh - 140px);
  }

  .editor-sidebar {
    top: 140px;
    height: calc(100vh - 140px);
    width: 100%;
  }

  .resume-preview {
    padding: 15px;
  }

  .resume-header h1 {
    font-size: 22px;
  }

  .resume-job-title {
    font-size: 16px;
  }

  .resume-contact {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
