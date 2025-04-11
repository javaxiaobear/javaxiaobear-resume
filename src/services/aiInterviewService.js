/**
 * AI Interview Service
 * This service analyzes resume data and generates personalized interview questions.
 */

import { questionCategories } from './interviewService';

// Mock AI analysis to avoid API calls during development
// In a production app, this would use actual AI service calls
const mockSkillToQuestionMap = {
  'Java': [
    {
      question: '请详细描述一下你在Java项目中使用的设计模式及其应用场景',
      expectedAnswer: '应该提及常用设计模式如工厂模式、单例模式、观察者模式、策略模式等，并解释在实际项目中的具体应用场景，例如如何解决了特定的问题。',
      tips: '可以结合您简历中提到的项目具体说明，例如在订单系统中如何使用工厂模式创建不同支付处理器等。',
      category: 'design-patterns',
      difficulty: 'intermediate'
    },
    {
      question: '在你的Java开发经历中，你是如何处理并发和多线程问题的？',
      expectedAnswer: '回答应该包括线程安全性考虑、synchronized关键字的使用、Lock接口、线程池、原子类、并发集合等内容，并结合实际案例说明处理方法。',
      tips: '提及您在高并发系统中遇到的实际问题和解决方案，以及如何进行性能优化。',
      category: 'concurrency',
      difficulty: 'senior'
    }
  ],
  'Spring': [
    {
      question: '请详细讲解你在项目中如何使用Spring框架实现依赖注入和AOP',
      expectedAnswer: '回答应包括依赖注入的不同方式（构造器注入、Setter注入、字段注入）的使用场景，以及如何使用AOP实现横切关注点（如日志、事务管理、权限控制等）。',
      tips: '结合您简历中提到的Spring项目具体说明您的实践经验和遇到的挑战。',
      category: 'spring',
      difficulty: 'intermediate'
    },
    {
      question: '你如何在Spring项目中实现和管理事务？遇到过哪些事务相关的问题？',
      expectedAnswer: '回答应该包括声明式事务和编程式事务的使用，事务传播行为的设置，隔离级别的选择，以及如何处理分布式事务等内容。',
      tips: '可以讨论您在实际项目中遇到的事务回滚问题、长事务问题或分布式事务一致性问题及其解决方案。',
      category: 'spring',
      difficulty: 'senior'
    }
  ],
  'MySQL': [
    {
      question: '在你的项目中，你是如何进行MySQL性能优化的？请给出具体的例子。',
      expectedAnswer: '回答应包括索引优化、查询优化、表结构优化、配置优化等方面，并结合具体的性能指标改进例子。',
      tips: '可以讨论您如何使用EXPLAIN分析查询计划，以及实际项目中通过优化使查询性能提升的案例。',
      category: 'database',
      difficulty: 'senior'
    }
  ],
  '微服务': [
    {
      question: '请描述你在微服务架构项目中的角色和贡献，以及你是如何解决微服务间通信和数据一致性问题的。',
      expectedAnswer: '回答应包括微服务拆分策略、服务发现、API网关、负载均衡、断路器、分布式事务等内容，并结合实际项目经验。',
      tips: '可以讨论您在微服务迁移过程中遇到的挑战，以及如何实现服务的无状态设计和弹性扩展。',
      category: 'microservices',
      difficulty: 'senior'
    }
  ],
  '算法': [
    {
      question: '请描述一个你在实际项目中解决的复杂算法问题，以及你的解决思路和优化过程。',
      expectedAnswer: '回答应包括问题背景、算法选择依据、实现过程和性能分析，以及如何从初始方案逐步优化到最终方案。',
      tips: '可以讨论时间复杂度和空间复杂度的权衡，以及如何针对特定业务场景进行算法定制。',
      category: 'algorithms',
      difficulty: 'senior'
    }
  ]
};

// Skill to category mapping for generating relevant questions
const skillToCategoryMap = {
  'Java': ['java-basics', 'oop'],
  'Spring': ['spring'],
  'Spring Boot': ['spring'],
  'Spring Cloud': ['spring', 'microservices'],
  'MySQL': ['database'],
  'Oracle': ['database'],
  'SQL': ['database'],
  'Redis': ['database'],
  'MongoDB': ['database'],
  '多线程': ['concurrency'],
  '并发': ['concurrency'],
  '线程': ['concurrency'],
  'JVM': ['jvm'],
  '虚拟机': ['jvm'],
  '内存': ['jvm'],
  'GC': ['jvm'],
  '垃圾回收': ['jvm'],
  '设计模式': ['design-patterns'],
  '架构': ['design-patterns'],
  '微服务': ['microservices'],
  'Cloud': ['microservices'],
  '云原生': ['microservices'],
  'Dubbo': ['microservices'],
  '数据结构': ['algorithms'],
  '算法': ['algorithms'],
  'MVC': ['spring'],
  'ORM': ['database'],
  'MyBatis': ['database'],
  'Hibernate': ['database'],
  'JPA': ['database'],
  'REST': ['spring'],
  'RESTful': ['spring'],
  'API': ['spring'],
  'Docker': ['microservices'],
  'Kubernetes': ['microservices'],
  'K8s': ['microservices'],
  '容器': ['microservices'],
  '分布式': ['microservices'],
  '消息队列': ['microservices'],
  'MQ': ['microservices'],
  'Kafka': ['microservices'],
  'RabbitMQ': ['microservices'],
  'RocketMQ': ['microservices']
};

// Experience level mapping based on years
const experienceLevelMap = {
  0: 'junior',      // 0-2 years
  2: 'intermediate', // 2-5 years
  5: 'senior',       // 5-8 years
  8: 'expert'        // 8+ years
};

/**
 * AI Interview Service methods
 */
export default {
  /**
   * Analyze resume data and determine focus areas for interview
   *
   * @param {Object} resumeData - Resume data object
   * @returns {Object} Analysis results with recommended question categories and difficulty
   */
  analyzeResume(resumeData) {
    // In a real application, this would call an AI service
    // For demo purposes, we'll use simple rule-based analysis

    const skills = resumeData.skills.items ? resumeData.skills.items.map(skill => skill.name) : [];
    const experienceItems = resumeData.experience.items || [];
    const projects = resumeData.projects.items || [];

    // Calculate total years of experience (rough estimate)
    let totalMonths = 0;
    experienceItems.forEach(job => {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      totalMonths += months > 0 ? months : 0;
    });

    const yearsOfExperience = Math.floor(totalMonths / 12);

    // Determine difficulty level based on experience
    let difficulty = 'junior';
    for (const [years, level] of Object.entries(experienceLevelMap)) {
      if (yearsOfExperience >= parseInt(years)) {
        difficulty = level;
      }
    }

    // Find relevant categories based on skills
    const categories = new Set();
    skills.forEach(skill => {
      Object.keys(skillToCategoryMap).forEach(key => {
        if (skill.includes(key)) {
          skillToCategoryMap[key].forEach(category => categories.add(category));
        }
      });
    });

    // Ensure we have at least some core categories
    const coreCategories = ['java-basics', 'oop'];
    coreCategories.forEach(cat => categories.add(cat));

    return {
      skills,
      categories: Array.from(categories),
      difficulty,
      yearsOfExperience
    };
  },

  /**
   * Generate personalized interview questions based on resume
   *
   * @param {Object} resumeData - Resume data object
   * @returns {Array} Array of personalized interview questions
   */
  generatePersonalizedQuestions(resumeData) {
    // Analyze resume
    const analysis = this.analyzeResume(resumeData);

    // In a real application, this would use NLP/AI to generate questions
    // For demo purposes, we'll use pre-defined questions based on skills

    let personalizedQuestions = [];

    // Add skill-specific questions
    analysis.skills.forEach(skill => {
      Object.keys(mockSkillToQuestionMap).forEach(key => {
        if (skill.toLowerCase().includes(key.toLowerCase()) && mockSkillToQuestionMap[key]) {
          const questions = mockSkillToQuestionMap[key];
          personalizedQuestions = [...personalizedQuestions, ...questions];
        }
      });
    });

    // Add personalized context to standard questions
    for (let i = 0; i < personalizedQuestions.length; i++) {
      if (resumeData.projects.items && resumeData.projects.items.length > 0) {
        const randomProject = resumeData.projects.items[Math.floor(Math.random() * resumeData.projects.items.length)];
        if (randomProject && randomProject.name) {
          personalizedQuestions[i].tips = personalizedQuestions[i].tips.replace(
            '您简历中提到的项目',
            `您简历中提到的${randomProject.name}项目`
          );
        }
      }

      // Add experience-based customization
      if (resumeData.experience.items && resumeData.experience.items.length > 0) {
        const randomJob = resumeData.experience.items[Math.floor(Math.random() * resumeData.experience.items.length)];
        if (randomJob && randomJob.company) {
          personalizedQuestions[i].tips = personalizedQuestions[i].tips.replace(
            '在实际项目中',
            `在${randomJob.company}的实际项目中`
          );
        }
      }
    }

    // 根据经验水平调整问题难度
    if (analysis.difficulty && personalizedQuestions.length > 3) {
      // 确保至少有一些与用户经验水平匹配的问题
      const matchingDifficultyQuestions = personalizedQuestions.filter(q => q.difficulty === analysis.difficulty);

      // 如果匹配的问题太少，保留所有问题
      if (matchingDifficultyQuestions.length >= 3) {
        // 优先保留与用户经验匹配的问题，但也要保留一些其他难度的问题以提供全面评估
        const otherQuestions = personalizedQuestions.filter(q => q.difficulty !== analysis.difficulty)
          .slice(0, Math.min(3, personalizedQuestions.length - matchingDifficultyQuestions.length));

        personalizedQuestions = [...matchingDifficultyQuestions, ...otherQuestions];
      }
    }

    // 确保问题不重复
    const uniqueQuestions = [];
    const questionSet = new Set();

    for (const q of personalizedQuestions) {
      if (!questionSet.has(q.question)) {
        questionSet.add(q.question);
        uniqueQuestions.push(q);
      }
    }

    return uniqueQuestions;
  },

  /**
   * Get category icon by category ID
   *
   * @param {String} categoryId - Category ID
   * @returns {String} Icon name
   */
  getCategoryIcon(categoryId) {
    const category = questionCategories.find(c => c.id === categoryId);
    return category ? category.icon : 'code-outlined';
  }
};
