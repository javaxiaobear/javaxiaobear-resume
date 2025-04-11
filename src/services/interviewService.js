/**
 * Service for interview simulation
 */

// Categories of questions
export const questionCategories = [
  { id: 'java-basics', name: 'Java基础', icon: 'code-outlined' },
  { id: 'oop', name: '面向对象', icon: 'apartment-outlined' },
  { id: 'collections', name: '集合框架', icon: 'container-outlined' },
  { id: 'concurrency', name: '多线程与并发', icon: 'partition-outlined' },
  { id: 'jvm', name: 'JVM', icon: 'cloud-server-outlined' },
  { id: 'spring', name: 'Spring框架', icon: 'api-outlined' },
  { id: 'database', name: '数据库', icon: 'database-outlined' },
  { id: 'microservices', name: '微服务', icon: 'cluster-outlined' },
  { id: 'design-patterns', name: '设计模式', icon: 'build-outlined' },
  { id: 'algorithms', name: '算法与数据结构', icon: 'function-outlined' }
];

// Difficulty levels
export const difficultyLevels = [
  { id: 'junior', name: '初级', color: 'green' },
  { id: 'intermediate', name: '中级', color: 'blue' },
  { id: 'senior', name: '高级', color: 'orange' },
  { id: 'expert', name: '专家', color: 'red' }
];

// Sample interview questions
const interviewQuestions = [
  // Java基础
  {
    id: 1,
    category: 'java-basics',
    difficulty: 'junior',
    question: '请解释Java中的基本数据类型有哪些，以及它们的大小和范围。',
    expectedAnswer: 'Java中有8种基本数据类型：\n- byte(1字节): -128到127\n- short(2字节): -32,768到32,767\n- int(4字节): -2^31到2^31-1\n- long(8字节): -2^63到2^63-1\n- float(4字节): 单精度浮点数\n- double(8字节): 双精度浮点数\n- char(2字节): 单个Unicode字符\n- boolean(大小取决于JVM): true或false',
    tips: '重点关注基本类型之间的转换规则和自动装箱/拆箱机制。'
  },
  {
    id: 2,
    category: 'java-basics',
    difficulty: 'junior',
    question: '请说明==和equals()的区别。',
    expectedAnswer: '- == 运算符比较的是对象的引用（内存地址），用于判断两个对象是否是同一个对象。\n- equals()方法比较的是对象的内容，默认情况下等同于==，但很多类（如String、Integer等）重写了equals()方法，使其比较对象的值而非引用。',
    tips: '在面试中可以举例说明，比如String对象的比较，和讨论hashCode()方法与equals()的关系。'
  },
  {
    id: 3,
    category: 'java-basics',
    difficulty: 'intermediate',
    question: '解释Java中的final, finally和finalize关键字的区别。',
    expectedAnswer: '- final: 用于声明一个不可变的变量、不可继承的类或不可重写的方法。\n- finally: 用于try-catch语句块中，包含无论异常是否发生都会执行的代码。\n- finalize(): 是Object类的一个方法，在对象被垃圾回收前调用，但不推荐使用，因为执行时间不确定。',
    tips: '可以提及finalize()已在Java 9中被废弃，以及为什么它不是一个可靠的资源清理方式。'
  },

  // 面向对象
  {
    id: 4,
    category: 'oop',
    difficulty: 'junior',
    question: '解释Java中的封装、继承和多态原则。',
    expectedAnswer: '- 封装: 将数据和操作数据的方法绑定在一起，对外隐藏实现细节，只暴露必要的接口。通过访问修饰符（private、protected、public）实现。\n- 继承: 允许一个类（子类）获取另一个类（父类）的属性和方法。Java使用extends关键字实现单继承。\n- 多态: 允许不同的对象对同一消息作出响应。Java通过方法重写和接口实现多态。',
    tips: '可以讨论为什么Java只支持单继承但允许实现多个接口，以及如何通过组合实现代码复用。'
  },
  {
    id: 5,
    category: 'oop',
    difficulty: 'intermediate',
    question: '抽象类和接口有什么区别？什么时候使用抽象类，什么时候使用接口？',
    expectedAnswer: '区别：\n- 抽象类可以有构造方法，接口不能。\n- 抽象类可以有非抽象方法，接口在Java 8之前只能有抽象方法。\n- 抽象类可以有实例变量，接口只能有常量。\n- 一个类只能继承一个抽象类，但可以实现多个接口。\n\n使用场景：\n- 当需要定义一个模板且与子类有很多共同特性时，使用抽象类。\n- 当需要定义多个不相关类的共同行为时，使用接口。',
    tips: '可以提及Java 8引入的默认方法和静态方法，以及Java 9引入的私有方法对接口的影响。'
  },

  // 集合框架
  {
    id: 6,
    category: 'collections',
    difficulty: 'intermediate',
    question: '比较ArrayList和LinkedList的区别，以及它们的适用场景。',
    expectedAnswer: 'ArrayList:\n- 基于动态数组实现\n- 随机访问元素效率高(O(1))\n- 插入和删除操作可能需要移动元素，效率较低\n- 内存占用较少\n\nLinkedList:\n- 基于双向链表实现\n- 随机访问元素效率低(O(n))\n- 插入和删除操作效率高，无需移动其他元素\n- 每个元素占用更多内存\n\n适用场景:\n- 如果需要频繁随机访问，选择ArrayList\n- 如果需要频繁插入和删除，尤其是在集合中间位置，选择LinkedList',
    tips: '可以讨论它们的线程安全性，以及如何使用Collections.synchronizedList()使它们线程安全。'
  },
  {
    id: 7,
    category: 'collections',
    difficulty: 'senior',
    question: '描述HashMap的内部实现原理，以及它在Java 8中的改进。',
    expectedAnswer: 'HashMap内部实现：\n- 基于哈希表实现，使用数组+链表/红黑树存储键值对\n- 通过hashCode()和equals()方法处理冲突\n- 负载因子默认为0.75，当元素数量超过容量*负载因子时会进行扩容\n\nJava 8的改进：\n- 引入红黑树结构：当链表长度超过8时，链表会转换为红黑树，提高查询效率\n- 优化了hash算法\n- 引入了统一的hash计算方式',
    tips: '可以讨论HashMap并发问题，以及与ConcurrentHashMap的比较。'
  },

  // 多线程与并发
  {
    id: 8,
    category: 'concurrency',
    difficulty: 'intermediate',
    question: '解释Java中的线程安全性，以及如何实现线程安全。',
    expectedAnswer: '线程安全性指的是在多线程环境下，代码能够正确地处理共享资源，避免出现数据不一致、死锁等问题。\n\n实现线程安全的方法：\n1. 使用同步方法(synchronized)\n2. 使用同步代码块\n3. 使用java.util.concurrent包中的类，如ReentrantLock\n4. 使用原子类（Atomic类）\n5. 使用volatile关键字确保变量的可见性\n6. 使用线程安全的集合类，如ConcurrentHashMap\n7. 使用ThreadLocal类',
    tips: '可以讨论不同同步方式的性能影响，以及synchronized与Lock的区别。'
  },
  {
    id: 9,
    category: 'concurrency',
    difficulty: 'senior',
    question: '什么是线程池？如何创建一个线程池？线程池的优势是什么？',
    expectedAnswer: '线程池是一种管理和复用线程的机制，可以减少线程创建和销毁的开销。\n\n创建线程池的方法：\n1. 使用Executors工厂方法：\n   - newFixedThreadPool(int nThreads)\n   - newCachedThreadPool()\n   - newSingleThreadExecutor()\n   - newScheduledThreadPool(int corePoolSize)\n\n2. 直接创建ThreadPoolExecutor：\n```java\nnew ThreadPoolExecutor(\n    corePoolSize, maxPoolSize, keepAliveTime, \n    timeUnit, workQueue, threadFactory, handler\n);\n```\n\n线程池的优势：\n- 减少线程创建和销毁的开销\n- 控制并发线程数，避免系统资源耗尽\n- 提供任务管理功能，如定时执行、任务排队等',
    tips: '可以讨论Executors工厂方法的局限性，以及为什么在生产环境中应该直接使用ThreadPoolExecutor。'
  },

  // JVM
  {
    id: 10,
    category: 'jvm',
    difficulty: 'senior',
    question: '描述Java的内存模型和垃圾回收机制。',
    expectedAnswer: 'Java内存模型(JMM)：\n- 程序计数器：记录当前线程执行的字节码位置\n- Java虚拟机栈：存储局部变量、操作数栈、动态链接等\n- 本地方法栈：为Native方法服务\n- 堆：存储对象实例，是垃圾回收的主要区域\n- 方法区：存储类结构、常量、静态变量等\n\n垃圾回收机制：\n1. 垃圾识别算法：\n   - 引用计数法\n   - 可达性分析（主流）\n\n2. 垃圾回收算法：\n   - 标记-清除\n   - 复制\n   - 标记-整理\n   - 分代收集（年轻代、老年代）\n\n3. 常见垃圾收集器：\n   - Serial\n   - ParNew\n   - Parallel Scavenge\n   - CMS（并发标记清除）\n   - G1（Garbage-First）\n   - ZGC（低延迟垃圾收集器）',
    tips: '可以讨论JVM调优参数、内存泄漏的排查方法以及各种垃圾收集器的适用场景。'
  },

  // Spring框架
  {
    id: 11,
    category: 'spring',
    difficulty: 'intermediate',
    question: '解释Spring框架中的IoC（控制反转）和DI（依赖注入）。',
    expectedAnswer: 'IoC(控制反转)：\n- 是一种设计原则，将程序的控制权从程序代码转移到外部容器\n- 对象的创建和依赖关系由外部容器负责，而不是由对象自己负责\n\nDI(依赖注入)：\n- 是IoC的一种实现方式\n- 容器在运行期间，动态地将依赖注入到对象中\n\nSpring中实现DI的方式：\n1. 构造器注入：通过构造函数注入依赖\n2. Setter注入：通过setter方法注入依赖\n3. 字段注入：直接在字段上使用@Autowired注解\n\n优点：\n- 降低组件之间的耦合度\n- 提高代码的可测试性\n- 提高代码的可维护性和可扩展性',
    tips: '可以讨论constructor注入vs. setter注入的优缺点，以及@Autowired、@Resource和@Inject注解的区别。'
  },
  {
    id: 12,
    category: 'spring',
    difficulty: 'senior',
    question: '解释Spring Bean的生命周期。',
    expectedAnswer: 'Spring Bean的生命周期：\n\n1. 实例化：创建Bean实例\n2. 属性赋值：为Bean的属性设置值和对其他Bean的引用\n3. 初始化前：调用BeanPostProcessor的postProcessBeforeInitialization方法\n4. 初始化：\n   - 如果Bean实现了InitializingBean接口，调用afterPropertiesSet()\n   - 如果Bean定义了init-method，调用指定的初始化方法\n5. 初始化后：调用BeanPostProcessor的postProcessAfterInitialization方法\n6. 使用Bean\n7. 销毁前：如果Bean实现了DisposableBean接口，调用destroy()\n8. 销毁：如果Bean定义了destroy-method，调用指定的销毁方法',
    tips: '可以讨论@PostConstruct和@PreDestroy注解，以及如何使用BeanPostProcessor和BeanFactoryPostProcessor进行自定义处理。'
  },

  // 数据库
  {
    id: 13,
    category: 'database',
    difficulty: 'intermediate',
    question: '解释数据库事务的ACID属性和不同的隔离级别。',
    expectedAnswer: 'ACID属性：\n- 原子性(Atomicity)：事务是不可分割的工作单位，要么全部执行，要么全部不执行\n- 一致性(Consistency)：事务执行前后，数据库从一个一致性状态变换到另一个一致性状态\n- 隔离性(Isolation)：一个事务的执行不应该被其他事务干扰\n- 持久性(Durability)：事务一旦提交，其结果就是永久性的\n\n隔离级别：\n1. 读未提交(Read Uncommitted)：允许读取未提交的数据，可能出现脏读、不可重复读和幻读\n2. 读已提交(Read Committed)：只允许读取已提交的数据，可以避免脏读，但可能出现不可重复读和幻读\n3. 可重复读(Repeatable Read)：确保同一事务多次读取同一数据结果一致，可以避免脏读和不可重复读，但可能出现幻读\n4. 串行化(Serializable)：最高隔离级别，完全串行执行，避免所有并发问题，但性能最差',
    tips: '可以讨论不同数据库默认的隔离级别，以及如何在Java中设置事务隔离级别。'
  },

  // 微服务
  {
    id: 14,
    category: 'microservices',
    difficulty: 'senior',
    question: '解释微服务架构的优缺点，以及如何解决微服务架构中的常见问题。',
    expectedAnswer: '微服务架构优点：\n- 独立部署：服务可以独立开发、测试和部署\n- 技术多样性：不同服务可以使用不同的技术栈\n- 弹性扩展：可以根据需求单独扩展某些服务\n- 团队自治：不同团队可以负责不同的服务\n\n缺点：\n- 分布式系统复杂性：需要处理网络延迟、分布式事务等问题\n- 运维复杂性：需要管理多个服务和环境\n- 接口版本管理：服务间接口变更需要谨慎管理\n\n解决方案：\n1. 服务发现：使用Eureka、Consul等实现服务注册与发现\n2. API网关：使用Zuul、Spring Cloud Gateway集中管理API\n3. 断路器模式：使用Hystrix、Resilience4j处理故障\n4. 配置中心：使用Config Server集中管理配置\n5. 分布式追踪：使用Zipkin、Jaeger实现请求追踪\n6. 消息队列：使用Kafka、RabbitMQ实现异步通信',
    tips: '可以讨论微服务与单体架构的比较，以及何时选择微服务架构。'
  },

  // 设计模式
  {
    id: 15,
    category: 'design-patterns',
    difficulty: 'intermediate',
    question: '描述单例设计模式的实现方式以及应用场景。',
    expectedAnswer: '单例模式实现方式：\n\n1. 饿汉式（线程安全）：\n```java\npublic class Singleton {\n    private static final Singleton instance = new Singleton();\n    private Singleton() {}\n    public static Singleton getInstance() {\n        return instance;\n    }\n}\n```\n\n2. 懒汉式（线程不安全）：\n```java\npublic class Singleton {\n    private static Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            instance = new Singleton();\n        }\n        return instance;\n    }\n}\n```\n\n3. 双重检查锁（线程安全）：\n```java\npublic class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null) {\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}\n```\n\n4. 静态内部类（线程安全）：\n```java\npublic class Singleton {\n    private Singleton() {}\n    private static class SingletonHolder {\n        private static final Singleton INSTANCE = new Singleton();\n    }\n    public static Singleton getInstance() {\n        return SingletonHolder.INSTANCE;\n    }\n}\n```\n\n5. 枚举（最简洁线程安全）：\n```java\npublic enum Singleton {\n    INSTANCE;\n    public void doSomething() {\n        // 方法实现\n    }\n}\n```\n\n应用场景：\n- 数据库连接池\n- 线程池\n- 缓存\n- 日志记录器\n- 配置管理\n- Spring框架中的Bean（默认单例）',
    tips: '可以讨论反射和序列化对单例模式的破坏，以及如何防止这种破坏。'
  },

  // 算法与数据结构
  {
    id: 16,
    category: 'algorithms',
    difficulty: 'intermediate',
    question: '描述快速排序算法的原理及其时间复杂度分析。',
    expectedAnswer: '快速排序原理：\n1. 选择一个元素作为"基准"（pivot）\n2. 将数组分区，使得所有小于基准的元素都在基准之前，所有大于基准的元素都在基准之后\n3. 递归地对基准前后的子数组应用相同的排序过程\n\n示例Java实现：\n```java\npublic void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pivotIndex = partition(arr, low, high);\n        quickSort(arr, low, pivotIndex - 1);\n        quickSort(arr, pivotIndex + 1, high);\n    }\n}\n\nprivate int partition(int[] arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            // 交换arr[i]和arr[j]\n            int temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n    // 交换arr[i+1]和arr[high]\n    int temp = arr[i + 1];\n    arr[i + 1] = arr[high];\n    arr[high] = temp;\n    return i + 1;\n}\n```\n\n时间复杂度：\n- 最佳情况：O(n log n) - 每次都能平均分割数组\n- 平均情况：O(n log n)\n- 最坏情况：O(n²) - 当数组已经有序或逆序时',
    tips: '可以讨论如何优化快速排序，例如三数取中法选择基准，以及快速排序与其他排序算法的比较。'
  }
];

// Export service methods
export default {
  /**
   * Get all question categories
   */
  getCategories() {
    return questionCategories;
  },

  /**
   * Get all difficulty levels
   */
  getDifficultyLevels() {
    return difficultyLevels;
  },

  /**
   * Get questions by category and difficulty
   *
   * @param {String} category - Category ID
   * @param {String} difficulty - Difficulty level ID
   * @returns {Array} Filtered questions
   */
  getQuestions(category = null, difficulty = null) {
    let filteredQuestions = [...interviewQuestions];

    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    return filteredQuestions;
  },

  /**
   * Get a specific question by ID
   *
   * @param {Number} id - Question ID
   * @returns {Object} Question object
   */
  getQuestionById(id) {
    return interviewQuestions.find(q => q.id === id);
  },

  /**
   * Generate a mock interview session with n questions
   *
   * @param {Number} count - Number of questions to include
   * @param {String} category - Optional category filter
   * @param {String} difficulty - Optional difficulty filter
   * @returns {Array} Array of questions for the interview
   */
  generateMockInterview(count = 5, category = null, difficulty = null) {
    const questions = this.getQuestions(category, difficulty);

    // Shuffle and pick 'count' questions
    return this._shuffleArray(questions).slice(0, count);
  },

  /**
   * Helper method to shuffle an array
   *
   * @private
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  _shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};
