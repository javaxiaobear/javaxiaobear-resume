<template>
  <div class="interview-container">
    <a-spin :spinning="loading" class="spin-container" tip="AI正在分析您的简历内容...">
      <!-- Interview Dashboard -->
      <div v-if="!currentSession" class="interview-dashboard">
        <div class="dashboard-header">
          <h1 class="page-title">AI 面试模拟</h1>
          <p class="page-description">基于您的简历内容，AI将生成针对性的面试问题，帮助您准备技术面试</p>
        </div>

        <!-- Resume Analysis Section -->
        <div class="resume-analysis-section">
          <div class="analysis-header">
            <h2>
              <file-text-outlined />
              简历分析
            </h2>
            <a-button v-if="hasResumeData" type="primary" @click="generateInterview" :loading="generatingQuestions">
              <thunderbolt-outlined v-if="!generatingQuestions" />
              开始 AI 面试
            </a-button>
          </div>

          <!-- Resume Data Display -->
          <a-card v-if="hasResumeData" class="resume-card">
            <template #title>
              <div class="resume-card-title">
                <user-outlined />
                <span>{{ resumeData.basic.name || '未命名' }} - {{ resumeData.basic.jobTitle || 'Java开发工程师' }}</span>
              </div>
            </template>
            <div class="resume-stats">
              <div class="stat-item">
                <code-outlined />
                <div class="stat-info">
                  <div class="stat-label">技能</div>
                  <div class="stat-value">{{ resumeData.skills.items ? resumeData.skills.items.length : 0 }}</div>
                </div>
              </div>
              <div class="stat-item">
                <project-outlined />
                <div class="stat-info">
                  <div class="stat-label">工作经验</div>
                  <div class="stat-value">{{ resumeData.experience.items ? resumeData.experience.items.length : 0 }}
                  </div>
                </div>
              </div>
              <div class="stat-item">
                <appstore-outlined />
                <div class="stat-info">
                  <div class="stat-label">项目经验</div>
                  <div class="stat-value">{{ resumeData.projects.items ? resumeData.projects.items.length : 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Skills Tags -->
            <div v-if="resumeData.skills.items && resumeData.skills.items.length > 0" class="resume-skills">
              <h3>技能标签</h3>
              <div class="skills-tags">
                <a-tag v-for="skill in resumeData.skills.items" :key="skill.name" color="blue">
                  {{ skill.name }}
                </a-tag>
              </div>
            </div>
          </a-card>

          <!-- No Resume Data -->
          <a-empty v-else description="未找到简历数据">
            <template #description>
              <span>请先在编辑器中创建并保存您的简历，以便AI生成个性化的面试问题</span>
            </template>
            <a-button type="primary" @click="navigateToEditor">
              前往简历编辑器
            </a-button>
          </a-empty>
        </div>

        <!-- Previous Interviews -->
        <div class="previous-interviews-section">
          <h2>
            <history-outlined />
            历史面试
          </h2>
          <a-empty v-if="pastSessions.length === 0" description="暂无历史面试记录" />
          <div v-else class="past-sessions-list">
            <a-card v-for="(session, index) in pastSessions" :key="index" class="session-card"
              @click="loadPastSession(session)">
              <div class="session-info">
                <div class="session-date">{{ formatDate(session.date) }}</div>
                <div class="session-title">{{ session.title || '面试模拟' }}</div>
                <div class="session-stats">
                  <span>{{ session.questions.length }} 个问题</span>
                </div>
              </div>
              <right-outlined class="session-arrow" />
            </a-card>
          </div>
        </div>

        <!-- Preset Categories -->
        <div class="preset-categories-section">
          <h2>
            <block-outlined />
            预设题库
          </h2>
          <div class="categories-grid">
            <a-card v-for="category in questionCategories" :key="category.id" class="category-card"
              @click="selectPresetCategory(category.id)">
              <component :is="iconComponents[category.icon]" class="category-icon" />
              <div class="category-name">{{ category.name }}</div>
            </a-card>
          </div>
        </div>
      </div>

      <!-- Interview Session -->
      <div v-else class="interview-session">
        <div class="session-header">
          <div class="back-button" @click="endSession">
            <left-outlined />
            <span>返回</span>
          </div>
          <div class="session-progress">
            <div class="progress-text">问题 {{ currentQuestionIndex + 1 }} / {{ currentInterviewQuestions.length }}</div>
            <a-progress :percent="progressPercent" size="small" />
          </div>
          <div class="session-actions">
            <a-button @click="showResults" type="primary" size="small">
              <file-text-outlined />
              查看总结
            </a-button>
            <a-button @click="exportInterview" size="small">
              <download-outlined />
              导出
            </a-button>
          </div>
        </div>

        <div class="question-container">
          <div class="question-content">
            <h2 class="question-text">{{ currentQuestion.question }}</h2>

            <div class="question-meta">
              <a-tag :color="getDifficultyColor(currentQuestion.difficulty)">
                {{ getDifficultyName(currentQuestion.difficulty) }}
              </a-tag>
              <a-tag color="blue">{{ getCategoryName(currentQuestion.category) }}</a-tag>
            </div>
          </div>

          <div class="answer-section">
            <tiptap-editor v-model="userAnswer" placeholder="在此输入您的回答..." class="answer-input" />
            <div class="answer-actions">
              <a-button v-if="!answerVisible" type="primary" @click="showAnswer">
                <eye-outlined />
                查看参考答案
              </a-button>
              <div class="navigation-buttons">
                <a-button :disabled="currentQuestionIndex === 0" @click="previousQuestion">
                  <left-outlined />
                  上一题
                </a-button>
                <a-button type="primary" :disabled="currentQuestionIndex === currentInterviewQuestions.length - 1"
                  @click="nextQuestion">
                  下一题
                  <right-outlined />
                </a-button>
              </div>
            </div>

            <a-collapse v-if="answerVisible" class="expected-answer-collapse">
              <a-collapse-panel key="1">
                <template #header>
                  <span class="answer-header">
                    <check-outlined />
                    参考答案
                  </span>
                </template>
                <div class="expected-answer">
                  <div v-html="formatAnswer(currentQuestion.expectedAnswer)"></div>

                  <template v-if="currentQuestion.tips">
                    <div class="answer-tips">
                      <bulb-outlined />
                      <span>面试提示：{{ currentQuestion.tips }}</span>
                    </div>
                  </template>
                </div>
              </a-collapse-panel>
            </a-collapse>

            <!-- 评分反馈 -->
            <div v-if="answerVisible && userAnswer.length > 10" class="answer-feedback">
              <div class="feedback-header">
                <trophy-outlined />
                <span>AI 评估反馈</span>
              </div>
              <div class="feedback-content">
                <div class="feedback-score">
                  <div class="score-label">完整性</div>
                  <a-progress :percent="getRandomScore()" status="active" :stroke-color="getScoreColor" />
                </div>
                <div class="feedback-score">
                  <div class="score-label">准确性</div>
                  <a-progress :percent="getRandomScore()" status="active" :stroke-color="getScoreColor" />
                </div>
                <div class="feedback-score">
                  <div class="score-label">表达清晰度</div>
                  <a-progress :percent="getRandomScore()" status="active" :stroke-color="getScoreColor" />
                </div>
                <div class="feedback-tips">
                  <check-circle-outlined />
                  <span>优点: 您的回答{{ getRandomAdvantage() }}</span>
                </div>
                <div class="feedback-tips">
                  <info-circle-outlined />
                  <span>改进: 建议您{{ getRandomSuggestion() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- 面试结果模态框 -->
    <a-modal v-model:visible="resultsVisible" title="面试总结" width="800px" :footer="null">
      <div class="results-content" ref="resultsContentRef">
        <h2 class="results-title">{{ currentSession?.title || '面试模拟' }} - 总结报告</h2>

        <div class="results-overview">
          <div class="overview-item">
            <div class="overview-value">{{ currentInterviewQuestions.length }}</div>
            <div class="overview-label">问题总数</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ getAnsweredCount() }}</div>
            <div class="overview-label">已回答</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ getCompletionPercentage() }}%</div>
            <div class="overview-label">完成率</div>
          </div>
        </div>

        <div class="category-stats">
          <h3>技术领域覆盖</h3>
          <div class="categories-chart">
            <div v-for="(count, category) in getCategoryCounts()" :key="category" class="category-bar">
              <div class="category-label">{{ getCategoryName(category) }}</div>
              <div class="category-count-bar"
                :style="{ width: `${Math.min(count * 20, 100)}%`, backgroundColor: getCategoryColor(category) }">
                {{ count }}
              </div>
            </div>
          </div>
        </div>

        <div class="results-questions">
          <h3>问题详情</h3>
          <div v-for="(question, index) in currentInterviewQuestions" :key="index" class="result-question-item">
            <div class="question-header">
              <div class="question-number">问题 {{ index + 1 }}</div>
              <div class="question-meta">
                <a-tag :color="getDifficultyColor(question.difficulty)">
                  {{ getDifficultyName(question.difficulty) }}
                </a-tag>
                <a-tag color="blue">{{ getCategoryName(question.category) }}</a-tag>
              </div>
            </div>
            <div class="question-content">{{ question.question }}</div>

            <div class="answer-comparison">
              <div class="user-answer">
                <div class="answer-label">您的回答:</div>
                <div class="answer-text">{{ getUserAnswer(index) || '(未回答)' }}</div>
              </div>
              <div class="expected-answer">
                <div class="answer-label">参考答案:</div>
                <div class="answer-text" v-html="formatAnswer(question.expectedAnswer)"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="export-actions">
          <a-button type="primary" @click="exportToPDF">
            <file-pdf-outlined />
            导出为PDF
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
import {
  UserOutlined, FileTextOutlined, ProjectOutlined,
  CodeOutlined, AppstoreOutlined, HistoryOutlined,
  ThunderboltOutlined, EyeOutlined, LeftOutlined,
  RightOutlined, CheckOutlined, BlockOutlined,
  BulbOutlined, SolutionOutlined, ApartmentOutlined,
  ContainerOutlined, PartitionOutlined, CloudServerOutlined,
  ApiOutlined, DatabaseOutlined, ClusterOutlined,
  BuildOutlined, FunctionOutlined, TrophyOutlined,
  CheckCircleOutlined, InfoCircleOutlined, FilePdfOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import interviewService, { questionCategories, difficultyLevels } from '../../services/interviewService';
import aiInterviewService from '../../services/aiInterviewService';

// Define icon components
const iconComponents = {
  'user-outlined': UserOutlined,
  'code-outlined': CodeOutlined,
  'apartment-outlined': ApartmentOutlined,
  'container-outlined': ContainerOutlined,
  'partition-outlined': PartitionOutlined,
  'cloud-server-outlined': CloudServerOutlined,
  'api-outlined': ApiOutlined,
  'database-outlined': DatabaseOutlined,
  'cluster-outlined': ClusterOutlined,
  'build-outlined': BuildOutlined,
  'function-outlined': FunctionOutlined
};

const router = useRouter();
const loading = ref(false);
const generatingQuestions = ref(false);
const resumeData = ref({
  basic: { name: '', jobTitle: '' },
  skills: { items: [] },
  experience: { items: [] },
  projects: { items: [] },
  summary: { content: '' }
});
const hasResumeData = computed(() => {
  return resumeData.value.basic.name ||
    (resumeData.value.skills.items && resumeData.value.skills.items.length > 0) ||
    (resumeData.value.experience.items && resumeData.value.experience.items.length > 0);
});

// Interview session state
const currentSession = ref(null);
const currentInterviewQuestions = ref([]);
const pastSessions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswer = ref('');
const answerVisible = ref(false);
const resultsVisible = ref(false);
const resultsContentRef = ref(null);

// Current question computed property
const currentQuestion = computed(() => {
  if (currentInterviewQuestions.value.length === 0) {
    return {};
  }
  return currentInterviewQuestions.value[currentQuestionIndex.value] || {};
});

// Progress percentage
const progressPercent = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / currentInterviewQuestions.value.length) * 100);
});

// Load resume data on component mount
onMounted(() => {
  loadResumeData();
  loadPastInterviews();
});

// Load resume data from localStorage
const loadResumeData = () => {
  loading.value = true;
  try {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      resumeData.value = JSON.parse(savedResume);
    }
  } catch (error) {
    console.error('Error loading resume data:', error);
    window.$message.error('加载简历数据失败');
  } finally {
    loading.value = false;
  }
};

// Load past interview sessions
const loadPastInterviews = () => {
  try {
    const savedSessions = localStorage.getItem('interviewSessions');
    if (savedSessions) {
      pastSessions.value = JSON.parse(savedSessions);
    }
  } catch (error) {
    console.error('Error loading past interviews:', error);
  }
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Navigate to editor
const navigateToEditor = () => {
  router.push('/editor');
};

// Generate personalized interview based on resume
const generateInterview = async () => {
  generatingQuestions.value = true;

  try {
    // Generate personalized questions using AI service
    const questions = await aiInterviewService.generatePersonalizedQuestions(resumeData.value);

    // If we don't have enough personalized questions, add some standard ones
    let finalQuestions = [...questions];
    if (finalQuestions.length < 5) {
      // Extract skills for fallback category detection
      const skills = resumeData.value.skills.items.map(item => item.name);

      // Get basic categories based on skills
      const analysis = aiInterviewService.analyzeResume(resumeData.value);
      const relevantCategories = analysis.categories;

      // Add questions from standard question pool
      relevantCategories.forEach(category => {
        const categoryQuestions = interviewService.getQuestions(category);
        // Add a couple questions per missing category
        const selectedQuestions = categoryQuestions
          .filter(q => !finalQuestions.some(existing => existing.question === q.question))
          .slice(0, 2);
        finalQuestions = [...finalQuestions, ...selectedQuestions];
      });

      // If still not enough, add some general Java questions
      if (finalQuestions.length < 5) {
        const remainingCount = 5 - finalQuestions.length;
        const additionalQuestions = interviewService.getQuestions('java-basics')
          .filter(q => !finalQuestions.some(existing => existing.question === q.question))
          .slice(0, remainingCount);
        finalQuestions = [...finalQuestions, ...additionalQuestions];
      }
    }

    // Limit to 10 questions maximum and shuffle
    finalQuestions = shuffleArray(finalQuestions.slice(0, 10));

    // Add ids if missing
    finalQuestions = finalQuestions.map((q, index) => ({
      id: q.id || (1000 + index),
      ...q
    }));

    // Create new interview session
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: `${resumeData.value.basic.name || '未命名'} 的个性化面试`,
      questions: finalQuestions,
      userAnswers: Array(finalQuestions.length).fill('')
    };

    // Save and start session
    startInterviewSession(newSession);

    // Save to past sessions
    savePastSession(newSession);

  } catch (error) {
    console.error('Error generating interview:', error);
    window.$message.error('生成面试问题失败');
  } finally {
    generatingQuestions.value = false;
  }
};

// Start interview session
const startInterviewSession = (session) => {
  currentSession.value = session;
  currentInterviewQuestions.value = session.questions;
  currentQuestionIndex.value = 0;
  userAnswer.value = '';
  answerVisible.value = false;
};

// Save session to local storage
const savePastSession = (session) => {
  pastSessions.value = [session, ...pastSessions.value];
  localStorage.setItem('interviewSessions', JSON.stringify(pastSessions.value));
};

// Load a past interview session
const loadPastSession = (session) => {
  startInterviewSession(session);

  // Load saved user answers if available
  if (session.userAnswers && session.userAnswers[currentQuestionIndex.value]) {
    userAnswer.value = session.userAnswers[currentQuestionIndex.value];
  }
};

// End current session
const endSession = () => {
  // Save current answers
  if (currentSession.value) {
    currentSession.value.userAnswers[currentQuestionIndex.value] = userAnswer.value;
    savePastSession(currentSession.value);
  }

  currentSession.value = null;
  currentInterviewQuestions.value = [];
};

// Select preset category
const selectPresetCategory = (categoryId) => {
  generatingQuestions.value = true;

  try {
    // Get questions from selected category
    const questions = interviewService.getQuestions(categoryId);

    // Create new session with preset questions (max 10)
    const selectedQuestions = shuffleArray(questions).slice(0, 10);

    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: `${getCategoryName(categoryId)} 专项面试`,
      questions: selectedQuestions,
      userAnswers: Array(selectedQuestions.length).fill('')
    };

    // Start session
    startInterviewSession(newSession);

    // Save to past sessions
    savePastSession(newSession);

  } catch (error) {
    console.error('Error selecting preset category:', error);
    window.$message.error('加载预设题库失败');
  } finally {
    generatingQuestions.value = false;
  }
};

// Navigation methods
const nextQuestion = () => {
  if (currentQuestionIndex.value < currentInterviewQuestions.value.length - 1) {
    // Save current answer
    if (currentSession.value) {
      currentSession.value.userAnswers[currentQuestionIndex.value] = userAnswer.value;
    }

    currentQuestionIndex.value++;

    // Load saved answer for next question if available
    if (currentSession.value &&
      currentSession.value.userAnswers &&
      currentSession.value.userAnswers[currentQuestionIndex.value]) {
      userAnswer.value = currentSession.value.userAnswers[currentQuestionIndex.value];
    } else {
      userAnswer.value = '';
    }

    answerVisible.value = false;
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    // Save current answer
    if (currentSession.value) {
      currentSession.value.userAnswers[currentQuestionIndex.value] = userAnswer.value;
    }

    currentQuestionIndex.value--;

    // Load saved answer for previous question if available
    if (currentSession.value &&
      currentSession.value.userAnswers &&
      currentSession.value.userAnswers[currentQuestionIndex.value]) {
      userAnswer.value = currentSession.value.userAnswers[currentQuestionIndex.value];
    } else {
      userAnswer.value = '';
    }

    answerVisible.value = false;
  }
};

const showAnswer = () => {
  answerVisible.value = true;
};

// Utility methods
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getCategoryName = (categoryId) => {
  const category = questionCategories.find(c => c.id === categoryId);
  return category ? category.name : '未知分类';
};

const getDifficultyName = (difficultyId) => {
  const difficulty = difficultyLevels.find(d => d.id === difficultyId);
  return difficulty ? difficulty.name : '未知级别';
};

const getDifficultyColor = (difficultyId) => {
  const difficulty = difficultyLevels.find(d => d.id === difficultyId);
  return difficulty ? difficulty.color : 'default';
};

const formatAnswer = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br />');
};

// 面试结果相关功能
const showResults = () => {
  // 保存当前答案
  if (currentSession.value) {
    currentSession.value.userAnswers[currentQuestionIndex.value] = userAnswer.value;
    savePastSession(currentSession.value);
  }

  resultsVisible.value = true;
};

// 导出面试
const exportInterview = () => {
  // 保存当前答案
  if (currentSession.value) {
    currentSession.value.userAnswers[currentQuestionIndex.value] = userAnswer.value;
    savePastSession(currentSession.value);
  }

  exportToPDF();
};

// 导出为PDF
const exportToPDF = () => {
  // 显示结果视图以便导出
  if (!resultsVisible.value) {
    resultsVisible.value = true;
    // 等待DOM更新后再导出
    setTimeout(() => {
      performPDFExport();
    }, 500);
  } else {
    performPDFExport();
  }
};

// 执行PDF导出
const performPDFExport = () => {
  if (!resultsContentRef.value) return;

  window.$message.loading('正在生成PDF文件...');

  // 获取结果内容区域
  const element = resultsContentRef.value;

  // 创建一个克隆以避免修改原始DOM
  const clone = element.cloneNode(true);

  // 设置样式以匹配A4纸
  clone.style.width = '210mm';
  clone.style.padding = '20mm';
  clone.style.backgroundColor = 'white';

  // 临时添加到body以让html2pdf正确渲染
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  document.body.appendChild(clone);

  // 使用html2pdf
  const opt = {
    margin: 10,
    filename: `面试总结_${new Date().toLocaleDateString()}.pdf`,
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
};

// 获取已回答问题数量
const getAnsweredCount = () => {
  if (!currentSession.value || !currentSession.value.userAnswers) return 0;

  return currentSession.value.userAnswers.filter(answer => answer && answer.trim().length > 0).length;
};

// 获取完成百分比
const getCompletionPercentage = () => {
  if (!currentInterviewQuestions.value.length) return 0;

  return Math.round((getAnsweredCount() / currentInterviewQuestions.value.length) * 100);
};

// 获取分类统计
const getCategoryCounts = () => {
  const counts = {};

  currentInterviewQuestions.value.forEach(question => {
    if (question.category) {
      counts[question.category] = (counts[question.category] || 0) + 1;
    }
  });

  return counts;
};

// 获取分类颜色
const getCategoryColor = (category) => {
  const colorMap = {
    'java-basics': '#1677ff',
    'oop': '#52c41a',
    'collections': '#722ed1',
    'concurrency': '#eb2f96',
    'jvm': '#fa8c16',
    'spring': '#13c2c2',
    'database': '#faad14',
    'microservices': '#1890ff',
    'design-patterns': '#52c41a',
    'algorithms': '#f5222d'
  };

  return colorMap[category] || '#1677ff';
};

// 获取用户答案
const getUserAnswer = (index) => {
  if (!currentSession.value || !currentSession.value.userAnswers) return '';

  return currentSession.value.userAnswers[index] || '';
};

// AI评估反馈相关函数
const getRandomScore = () => {
  // 生成60-95之间的随机分数
  return Math.floor(Math.random() * 36) + 60;
};

// 根据分数获取颜色
const getScoreColor = computed(() => {
  return { '0%': '#ff4d4f', '50%': '#faad14', '100%': '#52c41a' };
});

// 随机优点反馈
const getRandomAdvantage = () => {
  const advantages = [
    '包含了关键知识点和技术细节',
    '逻辑清晰，结构完整',
    '举例恰当，说明了实际应用场景',
    '概念解释准确，专业术语使用得当',
    '分析了问题的多个维度'
  ];

  return advantages[Math.floor(Math.random() * advantages.length)];
};

// 随机改进建议
const getRandomSuggestion = () => {
  const suggestions = [
    '可以增加更多实际项目中的案例',
    '进一步解释一些技术实现细节',
    '提供更多性能优化的具体方法',
    '谈谈您是如何解决相关技术难题的',
    '可以结合您的项目经验进行更深入的分析'
  ];

  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
</script>

<style scoped>
.interview-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.spin-container {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  color: var(--heading-color);
  margin-bottom: 12px;
}

.page-description {
  font-size: 16px;
  color: var(--text-color);
  max-width: 600px;
  margin: 0 auto;
}

.resume-analysis-section,
.previous-interviews-section,
.preset-categories-section {
  margin-bottom: 40px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

.analysis-header,
.previous-interviews-section h2,
.preset-categories-section h2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 20px;
  color: var(--heading-color);
}

.analysis-header h2,
.previous-interviews-section h2,
.preset-categories-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.resume-card {
  margin-bottom: 16px;
}

.resume-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resume-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: var(--text-color);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
}

.resume-skills h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--heading-color);
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.past-sessions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.session-card {
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-card:hover {
  transform: translateY(-2px);
}

.session-date {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.session-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--heading-color);
  margin-bottom: 8px;
}

.session-stats {
  font-size: 14px;
  color: var(--primary-color);
}

.session-arrow {
  color: var(--primary-color);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.category-card {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
}

.category-icon {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.category-name {
  font-size: 16px;
  color: var(--heading-color);
  text-align: center;
}

/* Interview session styles */
.interview-session {
  max-width: 900px;
  margin: 0 auto;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--primary-color);
}

.session-progress {
  max-width: 300px;
  width: 100%;
}

.progress-text {
  font-size: 14px;
  margin-bottom: 4px;
  text-align: right;
}

.question-container {
  background: white;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.question-content {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.question-text {
  font-size: 18px;
  color: var(--heading-color);
  margin-bottom: 16px;
  line-height: 1.6;
}

.question-meta {
  display: flex;
  gap: 8px;
}

.answer-section {
  padding: 24px;
}

.answer-input {
  margin-bottom: 16px;
}

.answer-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.navigation-buttons {
  display: flex;
  gap: 8px;
}

.expected-answer-collapse {
  margin-bottom: 16px;
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
}

.expected-answer {
  line-height: 1.8;
  white-space: pre-line;
}

.answer-tips {
  margin-top: 16px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #faad14;
}

.answer-feedback {
  margin-top: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: bold;
  color: #1677ff;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-score {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-label {
  width: 90px;
  flex-shrink: 0;
}

.feedback-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.feedback-tips :deep(.anticon-check-circle) {
  color: #52c41a;
}

.feedback-tips :deep(.anticon-info-circle) {
  color: #faad14;
}

/* 面试结果模态框样式 */
.results-content {
  padding: 16px;
}

.results-title {
  text-align: center;
  margin-bottom: 24px;
  color: var(--heading-color);
}

.results-overview {
  display: flex;
  justify-content: space-around;
  margin-bottom: 36px;
  text-align: center;
}

.overview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.overview-label {
  color: var(--text-color);
  margin-top: 4px;
}

.category-stats {
  margin-bottom: 36px;
}

.category-stats h3 {
  margin-bottom: 16px;
  color: var(--heading-color);
}

.categories-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-bar {
  display: flex;
  align-items: center;
}

.category-label {
  width: 120px;
  flex-shrink: 0;
}

.category-count-bar {
  height: 24px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  border-radius: 4px;
  min-width: 24px;
  transition: width 0.3s;
}

.results-questions {
  margin-bottom: 24px;
}

.results-questions h3 {
  margin-bottom: 16px;
  color: var(--heading-color);
}

.result-question-item {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number {
  font-weight: bold;
  color: var(--primary-color);
}

.question-content {
  margin-bottom: 16px;
  font-weight: 500;
}

.answer-comparison {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-answer,
.expected-answer {
  padding: 12px;
  background-color: white;
  border-radius: 4px;
  border-left: 4px solid;
}

.user-answer {
  border-left-color: #faad14;
}

.expected-answer {
  border-left-color: #52c41a;
}

.answer-label {
  font-weight: bold;
  margin-bottom: 8px;
}

.answer-text {
  white-space: pre-line;
  line-height: 1.6;
}

.export-actions {
  margin-top: 24px;
  text-align: center;
}

.session-actions {
  display: flex;
  gap: 8px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .interview-container {
    padding: 16px;
  }

  .resume-stats {
    flex-direction: column;
    gap: 16px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .answer-actions {
    flex-direction: column;
    gap: 16px;
  }

  .navigation-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .session-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .session-progress {
    width: 100%;
    max-width: unset;
  }

  .session-actions {
    width: 100%;
    justify-content: space-between;
  }

  .answer-comparison {
    flex-direction: column;
  }

  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
