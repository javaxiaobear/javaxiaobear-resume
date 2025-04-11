import OpenAI from 'openai';

// Initialize OpenAI client with a mock key
// In a real application, this would be securely stored in environment variables
const openai = new OpenAI({
  apiKey: 'sk-mock-key-for-demonstration',
  dangerouslyAllowBrowser: true // only for demo purposes
});

// Mock AI optimization to avoid actual API calls during development
// In a production app, this would make real API calls
const mockOptimization = {
  'summary': {
    'professional': '资深Java工程师，拥有7年企业级应用开发经验。专注于Spring微服务架构设计和实现，精通JVM性能调优和高并发系统设计。曾主导多个大型项目，包括电商平台和金融系统的开发。具备团队带领经验和解决复杂技术问题的能力。追求代码质量和最佳实践，致力于创建可靠、高效的软件解决方案。',
    'detailed': '拥有7年Java开发经验的资深工程师，专精于Spring Boot、Spring Cloud微服务架构。熟练应用设计模式解决复杂业务场景，精通JVM内存模型及性能调优。具备深厚的数据库设计和优化经验，包括MySQL、Redis、MongoDB等。主导开发过交易量日均百万级电商平台和企业级SaaS解决方案，对DevOps流程和CI/CD有丰富实践。具备4人小组管理经验，善于技术指导和知识分享，注重代码审查和团队协作。',
    'achievement': '具有7年Java开发经验的专业工程师，成功将系统响应时间减少65%，通过微服务重构和Redis缓存优化。设计并实现高可用分布式架构，支持峰值10000+ TPS，保证99.9%系统可用性。主导技术选型和架构设计，为公司节省30%基础设施成本。获得2次年度最佳员工奖和1次技术创新奖。作为技术负责人，成功交付6个大型项目，客户满意度达95%以上。'
  },
  'experience': {
    'professional': '作为后端团队的技术负责人，领导开发团队设计和实现基于Spring Cloud的微服务架构。负责核心业务模块的开发，包括订单管理、支付集成和用户授权系统。优化MySQL数据库查询性能，降低系统响应时间40%。实施代码审查和自动化测试流程，提高代码质量。',
    'detailed': '担任后端开发团队的技术负责人，管理4人小组负责企业级应用平台开发。主导微服务架构设计，将单体应用拆分为15个独立服务，基于Spring Cloud实现服务注册、发现和负载均衡。设计并实现基于OAuth2和JWT的统一认证授权系统，无缝整合多服务鉴权。优化数据库设计和查询，引入分库分表方案，采用Redis缓存热点数据，系统QPS从200提升至2000。规范化代码审查和持续集成流程，引入SonarQube进行代码质量监控，缺陷率降低50%。',
    'achievement': '作为技术负责人，成功带领团队完成交易系统重构，将响应时间从平均2秒降至300ms。设计实现高可用微服务架构，系统可用性从99.5%提升至99.99%。优化数据库索引和查询，处理能力提升5倍，同时存储空间减少40%。推动DevOps实践，将部署时间从数小时缩短至15分钟，发布频率提高300%。主导性能优化项目，降低60%服务器成本，同时提高用户并发承载能力。'
  },
  'projects': {
    'professional': '设计并开发企业级电子商务平台后端服务，基于Spring Boot和MyBatis实现核心业务逻辑。使用Redis实现分布式会话和数据缓存，提高系统性能。采用RabbitMQ处理异步任务，实现订单处理和通知服务。编写单元测试和集成测试，保证代码质量和系统稳定性。',
    'detailed': '主导设计并开发企业级B2B电子商务平台，支持多商户入驻、订单管理和支付处理。采用基于Spring Boot的微服务架构，服务间通过RESTful API和消息队列通信。设计数据库schema优化查询性能，使用分布式事务确保数据一致性。实现商品搜索功能，整合Elasticsearch提供高效全文检索和分面过滤。集成支付宝、微信支付等多种支付方式，设计统一支付接口抽象。实施缓存策略，使用Redis缓存热点数据和会话信息，降低数据库负载。开发后台管理系统，支持商品管理、订单处理和用户管理等功能。',
    'achievement': '主导电商平台核心交易系统重构，将单体应用迁移至微服务架构，系统吞吐量提升400%。优化数据库查询和缓存策略，页面加载时间减少70%，从平均2.5秒降至0.8秒。实现智能库存管理算法，减少30%库存占用成本同时提高订单履行率。设计并实现高可用支付系统，支持峰值每秒1000笔交易，交易成功率从99.5%提升至99.95%。引入A/B测试框架，优化用户转化漏斗，电商转化率提升35%。部署全链路监控系统，问题检测时间从小时级缩短至分钟级，大幅提高系统可靠性。'
  }
};

/**
 * Service for AI-powered resume optimization
 */
export default {
  /**
   * Optimize resume content using AI
   *
   * @param {Object} resumeData - Resume data to optimize
   * @param {Array} sections - Sections to optimize ['summary', 'experience', etc]
   * @param {String} style - Optimization style ('professional', 'detailed', 'achievement')
   * @returns {Promise<Object>} - Optimized resume data
   */
  async optimizeResume(resumeData, sections, style) {
    // In a real application, this would call the OpenAI API
    // For the purpose of this demo, we'll use mock responses

    const optimizedData = { ...resumeData };

    // Process each section that needs optimization
    for (const section of sections) {
      if (section === 'summary' && mockOptimization.summary) {
        optimizedData.summary = {
          ...optimizedData.summary,
          content: mockOptimization.summary[style] || optimizedData.summary.content
        };
      }

      if (section === 'experience' && optimizedData.experience.items.length > 0) {
        // Apply to the first experience item as an example
        const firstItem = { ...optimizedData.experience.items[0] };
        firstItem.description = mockOptimization.experience[style] || firstItem.description;
        optimizedData.experience.items = [
          firstItem,
          ...optimizedData.experience.items.slice(1)
        ];
      }

      if (section === 'projects' && optimizedData.projects.items.length > 0) {
        // Apply to the first project item as an example
        const firstItem = { ...optimizedData.projects.items[0] };
        firstItem.description = mockOptimization.projects[style] || firstItem.description;
        optimizedData.projects.items = [
          firstItem,
          ...optimizedData.projects.items.slice(1)
        ];
      }

      // In a real implementation, we would also optimize skills
      // by suggesting relevant skills based on job description
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return optimizedData;
  },

  /**
   * This would be the real implementation using OpenAI API
   * Commented out as it would require a valid API key
   */
  /*
  async optimizeWithOpenAI(resumeData, sections, style) {
    try {
      // Create prompt based on the resume data and desired style
      const prompt = this._createPrompt(resumeData, sections, style);

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer specialized in technology resumes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      // Process and parse the response
      const completion = response.choices[0].message.content;
      return this._parseResponse(completion, resumeData, sections);

    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw new Error("Failed to optimize resume. Please try again later.");
    }
  },

  _createPrompt(resumeData, sections, style) {
    let prompt = `I want you to optimize the following sections of my Java developer resume: ${sections.join(', ')}.\n\n`;

    prompt += `I want the style to be ${style}. `;

    if (style === 'professional') {
      prompt += "Keep it concise, professional, and focused on my core technical skills and achievements.";
    } else if (style === 'detailed') {
      prompt += "Include specific technical details, frameworks, and methodologies I've used. Be thorough but clear.";
    } else if (style === 'achievement') {
      prompt += "Focus on quantifiable achievements, metrics, and business impact. Use numbers and percentages where possible.";
    }

    prompt += "\n\nHere is my current resume information:\n\n";

    // Add relevant sections of the resume
    if (sections.includes('summary') && resumeData.summary) {
      prompt += `SUMMARY:\n${resumeData.summary.content}\n\n`;
    }

    if (sections.includes('experience') && resumeData.experience.items.length > 0) {
      prompt += "EXPERIENCE:\n";
      resumeData.experience.items.forEach(job => {
        prompt += `${job.title} at ${job.company} (${job.startDate} - ${job.endDate || 'Present'})\n`;
        prompt += `${job.description}\n\n`;
      });
    }

    if (sections.includes('projects') && resumeData.projects.items.length > 0) {
      prompt += "PROJECTS:\n";
      resumeData.projects.items.forEach(project => {
        prompt += `${project.name} - ${project.role}\n`;
        prompt += `Technologies: ${project.technologies.join(', ')}\n`;
        prompt += `${project.description}\n\n`;
      });
    }

    if (sections.includes('skills') && resumeData.skills.items.length > 0) {
      prompt += "SKILLS:\n";
      prompt += resumeData.skills.items.map(skill => skill.name).join(', ');
      prompt += "\n\n";
    }

    prompt += "Please optimize these sections while maintaining accuracy and relevance to Java development. Return the optimized content in a structured format that I can easily copy into my resume.";

    return prompt;
  },

  _parseResponse(completion, resumeData, sections) {
    // In a real implementation, we would parse the AI response
    // and update the resume data accordingly
    // This would require more sophisticated parsing logic

    const optimizedData = { ...resumeData };

    // Simple parsing logic as an example
    const lines = completion.split('\n');

    let currentSection = null;
    let sectionContent = '';

    for (const line of lines) {
      if (line.includes('SUMMARY:')) {
        currentSection = 'summary';
        sectionContent = '';
      } else if (line.includes('EXPERIENCE:')) {
        if (currentSection === 'summary' && sections.includes('summary')) {
          optimizedData.summary.content = sectionContent.trim();
        }
        currentSection = 'experience';
        sectionContent = '';
      } else if (line.includes('PROJECTS:')) {
        // Handle experience parsing here...
        currentSection = 'projects';
        sectionContent = '';
      } else if (line.includes('SKILLS:')) {
        // Handle projects parsing here...
        currentSection = 'skills';
        sectionContent = '';
      } else if (currentSection) {
        sectionContent += line + '\n';
      }
    }

    // Handle the last section
    if (currentSection === 'skills' && sections.includes('skills')) {
      // Parse skills...
    }

    return optimizedData;
  }
  */
};
