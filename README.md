# AI 社交媒体内容生成器

一个基于 Next.js 和 DeepSeek API 的智能社交媒体内容生成工具，支持多平台内容创作、AI 协同优化和工作流可视化。

## 功能特性

### 核心功能

- **多平台支持**：小红书、抖音、微博、知乎
- **双模式生成**：
  - 普通模式：快速生成单次内容
  - Agentic 模式：多阶段智能规划与迭代优化
- **多版本生成**：可一次生成 1-5 个变体版本
- **智能评分**：AI 自动评估内容质量（0-100分）

### 内容配置

- **输入方式**：文字输入或文档上传（支持 .txt, .pdf, .docx）
- **语气风格**：20+ 种预设语气（专业、幽默、温暖等）
- **字数控制**：根据平台自动调整字数范围
- **高级选项**：
  - 创意度（保守/平衡/创新）
  - 目标受众定位
  - 必须包含/避免的关键词

### 编辑优化

- **AI 协同优化**：基于反馈进行多轮迭代优化
- **快捷建议**：一键应用优化方向
- **对话历史**：记录完整优化过程
- **版本对比**：查看每次优化的结果变化

### 历史记录

- 本地持久化存储（localStorage）
- 展示 Agent 5 阶段输出详情
- 一键复制内容
- 批量删除管理

## 技术架构

### 前端框架

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS** 样式

### 后端 API

- `/api/generate` - 普通内容生成
- `/api/agent-generate` - Agentic 智能工作流
- `/api/optimize` - 内容优化

### AI 模型

- **DeepSeek Chat** API
- 多阶段提示词工程
- 自动评分与迭代优化

### 文件解析

- pdf-parse (PDF)
- mammoth (Word 文档)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
DEEPSEEK_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 打开应用

访问 [http://localhost:3000](http://localhost:3000)

## Agentic 工作流

启用 Agentic 模式后，内容生成将经过 5 个智能阶段：

| 阶段 | 功能 | 说明 |
|------|------|------|
| 需求分析 | 🔍 | 从素材提取关键信息、受众洞察与平台适配要点 |
| 内容规划 | 📋 | 将需求分析转为写作大纲、卖点清单与元素约束 |
| 初稿生成 | ✍️ | 根据规划生成初稿正文 |
| 扩展优化 | 🎨 | 扩写、增强表达，补全结构要点 |
| 最终润色 | ✨ | 语言与节奏统一，并进行评分收敛 |

## 平台特性

| 平台 | 字数范围 | 特点 |
|------|----------|------|
| 小红书 | 100-1000字 | 种草、真实、生活化 |
| 抖音 | 50字以内 | 简短有力、悬念引导 |
| 微博 | 100字左右 | 简洁有趣、话题标签 |
| 知乎 | 500-2000字 | 专业分析、深度论证 |

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts       # 普通生成 API
│   │   ├── agent-generate/route.ts # Agent 生成 API
│   │   └── optimize/route.ts        # 优化 API
│   ├── history/page.tsx            # 历史记录页面
│   ├── layout.tsx                  # 布局组件
│   └── page.tsx                    # 主页面
└── components/
    ├── FormPanel.tsx               # 表单配置面板
    ├── ResultDisplay.tsx           # 结果展示
    ├── FeedbackPanel.tsx           # AI 协同优化
    ├── HistoryPanel.tsx            # 历史记录面板
    ├── WorkflowVisualizer.tsx      # 工作流可视化
    ├── ToastNotification.tsx       # 通知提示
    ├── ErrorBoundary.tsx           # 错误边界
    └── LoadingSkeleton.tsx         # 加载骨架屏
```

## 开发说明

- 使用 pnpm 作为包管理器
- 代码遵循 ESLint 规范
- 组件采用函数式 + Hooks 风格

