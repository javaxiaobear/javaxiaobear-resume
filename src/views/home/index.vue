<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="ai-badge">
          <thunderbolt-outlined />
          <span>AI</span>
        </div>
        <h1 class="hero-title">专为Java开发者<br />打造的简历工具</h1>
        <p class="hero-description">
          一站式解决Java工程师求职简历与面试准备的全流程，AI辅助生成专业内容，精准展示您的专业技能
        </p>
        <div class="hero-actions">
          <router-link to="/editor">
            <a-button type="primary" class="hero-button" size="large">
              开始制作简历
              <template #icon><arrow-right-outlined /></template>
            </a-button>
          </router-link>
          <router-link to="/interview">
            <a-button class="hero-button-secondary" size="large">
              面试模拟
              <template #icon><solution-outlined /></template>
            </a-button>
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://ext.same-assets.com/3127409675/937404902.png" alt="Resume Editor Preview" />
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="features-section">
      <h2 class="section-title">核心功能</h2>
      <p class="section-description">
        小熊学Java简历提供了一系列专业功能，帮助您打造出色的Java开发者简历
      </p>

      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon">
            <div class="icon-ai">AI</div>
          </div>
          <h3 class="feature-title">AI优化助手</h3>
          <p class="feature-description">
            利用先进的AI技术，优化您的简历内容，使其更专业、更有吸引力
          </p>
          <ul class="feature-list">
            <li>智能生成专业的Java技能描述</li>
            <li>根据不同职位优化简历内容</li>
            <li>改进项目经验的表述方式</li>
          </ul>
        </div>

        <div class="arrow-connector">
          <arrow-right-outlined />
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <div class="icon-template">模</div>
          </div>
          <h3 class="feature-title">专业模板</h3>
          <p class="feature-description">
            为Java开发者精心设计的简历模板，突出技术特长和项目经验
          </p>
          <ul class="feature-list">
            <li>多种专业设计风格</li>
            <li>突出技术栈和关键能力</li>
            <li>自定义主题和布局</li>
          </ul>
        </div>

        <div class="arrow-connector">
          <arrow-right-outlined />
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <code-outlined style="font-size: 24px; color: #1677ff" />
          </div>
          <h3 class="feature-title">面试模拟</h3>
          <p class="feature-description">
            模拟真实Java面试场景，提前做好充分准备
          </p>
          <ul class="feature-list">
            <li>涵盖常见Java面试题</li>
            <li>按难度和领域分类</li>
            <li>提供详细参考答案</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="steps-section">
      <h2 class="section-title">使用流程</h2>
      <p class="section-description">
        三个简单步骤，轻松创建专业Java开发者简历
      </p>

      <div class="steps-container">
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>选择模板</h3>
            <p>从多种专业设计的Java开发者简历模板中选择一个适合您的</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>填写信息</h3>
            <p>按照引导填写您的个人信息、技能、工作经历和项目经验</p>
          </div>
        </div>

        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>AI优化与导出</h3>
            <p>使用AI助手优化内容，然后导出为PDF或其他格式</p>
          </div>
        </div>
      </div>

      <div class="get-started-button">
        <router-link to="/editor">
          <a-button type="primary" size="large">
            立即开始
            <template #icon><right-outlined /></template>
          </a-button>
        </router-link>
      </div>
    </section>

    <!-- Interview Feature Section -->
    <section class="interview-feature-section">
      <div class="interview-feature-content">
        <h2 class="section-title">Java面试模拟</h2>
        <p class="feature-description">
          不仅仅是简历工具，更是您的面试准备助手。模拟真实面试场景，提供专业的Java技术问题和建议。
        </p>
        <ul class="feature-list">
          <li>涵盖Java核心、Spring框架、微服务等多个领域</li>
          <li>从初级到专家级别的问题梯度</li>
          <li>提供详细参考答案和面试官提示</li>
          <li>实时反馈和评估系统</li>
        </ul>
        <router-link to="/interview">
          <a-button type="primary" class="hero-button" size="large">
            开始面试模拟
            <template #icon><solution-outlined /></template>
          </a-button>
        </router-link>
      </div>
      <div class="interview-feature-image">
        <img src="https://ext.same-assets.com/3127409675/937404902.png" alt="Interview Simulation Preview" />
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  ThunderboltOutlined,
  ArrowRightOutlined,
  RightOutlined,
  SolutionOutlined,
  CodeOutlined
} from '@ant-design/icons-vue';
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  display: flex;
  padding: 60px 0;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e6f7ff, #f0f5ff);
  border-radius: 16px;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 16px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
}

.ai-badge span {
  margin-left: 6px;
}

.hero-title {
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: 20px;
  font-weight: bold;
  color: var(--heading-color);
  letter-spacing: -0.5px;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 32px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-button {
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.hero-button-secondary {
  background: #f5f7fa;
  color: var(--heading-color);
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
}

.hero-image {
  flex: 1;
  max-width: 50%;
  box-shadow: var(--card-shadow);
  border-radius: 8px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  display: block;
  border-radius: 8px;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  text-align: center;
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: 16px;
  color: var(--heading-color);
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-color);
  max-width: 700px;
  margin: 0 auto 50px;
}

.feature-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.feature-card {
  flex: 1;
  max-width: 320px;
  background: var(--background-color);
  border-radius: 12px;
  padding: 30px;
  text-align: left;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.arrow-connector {
  font-size: 24px;
  color: var(--primary-color);
}

.feature-icon {
  margin-bottom: 20px;
}

.icon-ai, .icon-template {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
}

.icon-ai {
  background: linear-gradient(135deg, #1677ff, #69b4ff);
}

.icon-template {
  background: linear-gradient(135deg, #52c41a, #95de64);
}

.feature-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: var(--heading-color);
}

.feature-description {
  color: var(--text-color);
  margin-bottom: 20px;
}

.feature-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  color: var(--text-color);
  position: relative;
  padding-left: 24px;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

/* Steps Section */
.steps-section {
  padding: 80px 0;
  text-align: center;
  background-color: var(--secondary-background);
  border-radius: 16px;
  margin-bottom: 80px;
}

.steps-container {
  display: flex;
  justify-content: space-around;
  max-width: 900px;
  margin: 60px auto 0;
}

.step-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 250px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.step-content h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: var(--heading-color);
}

.step-content p {
  color: var(--text-color);
  line-height: 1.6;
}

.get-started-button {
  margin-top: 60px;
}

/* Interview Feature Section */
.interview-feature-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 80px;
  background-color: var(--background-color);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
}

.interview-feature-content {
  flex: 1;
}

.interview-feature-content .section-title {
  text-align: left;
  margin-bottom: 20px;
}

.interview-feature-content .feature-description {
  text-align: left;
  margin-bottom: 24px;
}

.interview-feature-content .feature-list {
  margin-bottom: 32px;
}

.interview-feature-image {
  flex: 1;
  max-width: 40%;
}

.interview-feature-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .hero-section {
    padding: 40px 0;
  }

  .hero-title {
    font-size: 2.4rem;
  }

  .feature-cards {
    gap: 15px;
  }

  .feature-card {
    padding: 20px;
  }

  .interview-feature-section {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 30px 0;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 40px;
  }

  .hero-image {
    max-width: 100%;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .feature-cards {
    flex-direction: column;
  }

  .arrow-connector {
    transform: rotate(90deg);
    margin: 10px 0;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .steps-container {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  .interview-feature-section {
    flex-direction: column;
    gap: 30px;
  }

  .interview-feature-image {
    max-width: 100%;
    order: -1;
  }
}

@media (max-width: 576px) {
  .home-container {
    padding: 0 15px;
  }

  .hero-section {
    padding: 20px 0;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 10px;
  }

  .feature-card {
    padding: 20px;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .steps-section {
    padding: 50px 0;
  }

  .interview-feature-section {
    padding: 20px;
  }
}
</style>
