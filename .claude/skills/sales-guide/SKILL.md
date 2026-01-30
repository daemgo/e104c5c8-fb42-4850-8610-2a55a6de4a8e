---
name: sales-guide
description: 基于客户档案生成销售进攻指南，包括AI洞察分析、破冰话术、访谈提纲、竞对分析、异议处理等
metadata:
  short-description: 生成销售进攻指南
  triggers:
    - "生成销售指南"
    - "制作销售攻略"
    - "生成进攻指南"
    - "销售话术"
    - "销售策略"
    - "拜访话术"
    - "客户攻略"
    - "分析客户"
    - "客户洞察"
  examples:
    - "生成销售指南"
    - "为这个客户制作销售攻略"
    - "生成针对技术负责人的话术"
    - "更新销售指南的异议处理部分"
    - "分析一下这个客户的成交概率"
  dependencies:
    - profile       # 必须先有客户档案
    - humanizer-zh  # 输出人性化处理（必须）
---

# SyncMind 销售进攻指南生成 Skill

这个 skill 用于基于客户档案、AI 洞察等信息，生成专业的销售进攻指南 `sales-guide.json`。

## 功能

当用户要求生成销售指南或销售攻略时，使用此 skill 来：

1. 读取 `docs/customer/profile.json`（客户档案）
2. 读取 `docs/customer/followups.json`（跟进记录，如果存在）
3. 读取 `docs/customer/tracking.json`（追踪数据，如果存在）
4. **自动生成 AI 洞察分析**（风险、成交概率、机会点）
5. 基于企业信息和 AI 洞察生成销售进攻指南
6. 输出符合 `SalesGuideResponse` 结构的 JSON 文件到 `docs/customer/sales-guide.json`

## 前置条件

- **必须**：`docs/customer/profile.json` 必须存在（使用 `/profile` skill 生成）
- **可选**：`docs/customer/followups.json` 存在（跟进记录，有助于更精准分析）
- **可选**：`docs/customer/tracking.json` 存在（追踪数据，有助于识别信息缺口）

如果 profile.json 不存在，应提示用户先运行 `/profile` skill 初始化客户档案。

## 数据源结构

### ProfileResponse (profile.json)
```typescript
interface ProfileResponse {
  profile: {
    companyName: string
    industry: string
    scale: string
    rating: string
    tags: string[]
    contacts: Contact[]
    requirements: string[]
    painPoints: string[]
    budget: BudgetInfo
  }
}
```

### FollowUpsResponse (followups.json)
```typescript
interface FollowUpsResponse {
  records: FollowUpRecord[]
}

interface FollowUpRecord {
  id: number
  date: string
  type: string                    // 电话/拜访/演示/邮件等
  content: string
  attendees: string[]
  files: string[]
  images: string[]
}
```

### TrackingResponse (tracking.json)
```typescript
interface TrackingResponse {
  tracking: {
    coverageRate: number          // 信息覆盖度 (0-100)
    coveredCount: number
    totalCount: number
    categories: TrackingCategory[]
  }
}

interface TrackingCategory {
  id: string
  name: string                    // 如：需求、预算、决策、竞对
  questions: TrackingQuestion[]
}

interface TrackingQuestion {
  question: string
  answered: boolean
  answer: string
}
```

## SalesGuideResponse 结构

```typescript
interface SalesGuideResponse {
  salesGuide: SalesGuide
}

interface SalesGuide {
  // 基础信息
  customerId: string
  customerName: string
  generatedAt: string
  version: string
  
  // AI 洞察分析（整合自 insights）
  aiInsights: AIInsights
  
  // 时机判断
  timing: TimingAnalysis
  
  // 破冰策略
  iceBreaker: IceBreakerStrategy
  
  // 访谈提纲
  interviewGuide: InterviewGuide
  
  // 竞对分析
  competitorAnalysis: CompetitorAnalysis[]
  
  // 异议处理
  objectionHandling: ObjectionHandling
  
  // 决策链条
  decisionChain: DecisionChain
  
  // 价值主张
  valueProposition: ValueProposition
  
  // 电梯演讲
  elevatorPitch: string
  
  // 下一步行动
  nextActions: ActionItem[]
}

// AI 洞察分析
interface AIInsights {
  risks: RiskItem[]                    // 风险项列表
  probability: {                       // 成交概率分析
    value: number                      // 概率值 (0-100)
    level: string                      // 概率等级 (高/中/低)
    factors: ProbabilityFactor[]       // 影响因素
  }
  opportunities: OpportunityItem[]     // 机会点
}

interface RiskItem {
  type: string                         // 风险类型（预算/时间/竞争/信息/关系）
  description: string                  // 风险描述
  severity: string                     // 严重程度（高/中/低）
  mitigation: string                   // 缓解措施
}

interface ProbabilityFactor {
  type: string                         // 正面/负面
  description: string                  // 因素描述
}

interface OpportunityItem {
  title: string                        // 机会标题
  potentialValue: string               // 潜在价值（高/中/低）
  description: string                  // 机会描述
  action: string                       // 建议行动
}

// 时机分析
interface TimingAnalysis {
  timingStage: string              // 时机阶段（刚融资/扩张期/转型期/稳定期/危机期）
  analysisBasis: string[]         // 判断依据
  entryStrategy: string          // 切入策略
  urgency: string              // 紧急程度（高/中/低）
}

// 破冰策略
interface IceBreakerStrategy {
  primaryHooks: Hook[]         // 主要破冰话术（3-5条）
  situationalHooks: {         // 情景化破冰话术
    firstContact: Hook[]
    followUp: Hook[]
    demo: Hook[]
    negotiation: Hook[]
    closing: Hook[]
  }
  avoidTopics: string[]        // 避免话题
}

interface Hook {
  type: string               // 类型（恭维/好奇/痛点/借势/竞对等）
  content: string            // 话术内容
  rationale: string          // 话术原理
}

// 访谈提纲
interface InterviewGuide {
  quickScreening: Question[]  // 快速筛选问题（3-5个）
  deepDive: Question[]       // 深度访谈问题（5-8个）
  closingQuestions: Question[] // 收尾问题（2-3个）
  customQuestions: Question[] // 针对性问题（根据客户情况定制）
}

interface Question {
  id: string
  category: string          // 类别（需求/预算/决策/竞对/时间等）
  question: string          // 问题内容
  purpose: string          // 问题目的
  followUp: string         // 追问建议
}

// 竞对分析
interface CompetitorAnalysis {
  competitor: string       // 竞对名称
  position: string        // 竞对定位
  strengths: string[]     // 竞对优势
  weaknesses: string[]    // 竞对弱点
  ourAdvantage: string   // 我方优势
  differentiation: string // 差异化策略
  defenseStrategy: string // 防御策略
}

// 异议处理
interface ObjectionHandling {
  commonObjections: Objection[] // 常见异议及应对
  objectionPrevention: string[]  // 异议预防策略
  handlingFramework: string      // 处理框架（如L.A.R.C.）
}

interface Objection {
  type: string               // 异议类型（价格/时间/功能/竞对等）
  objection: string          // 客户异议
  underlyingConcern: string  // 潜在关切
  response: string          // 应对话术
  pivot: string            // 转向技巧
}

// 决策链条
interface DecisionChain {
  decisionMakers: Person[]     // 决策者
  influencers: Person[]        // 影响者
  blockers: Person[]           // 阻碍者
  decisionProcess: string      // 决策流程描述
  approvalPath: string[]       // 审批路径
  timeline: string            // 决策时间线
}

interface Person {
  role: string              // 职位/角色
  name?: string             // 姓名（如有）
  concerns: string[]        // 关注点
  motivations: string[]     // 动机
  approach: string         // 接触策略
}

// 价值主张
interface ValueProposition {
  coreValue: string          // 核心价值
  benefitPoints: string[]    // 利益点（3-5个）
  proofPoints: string[]      // 证明点（案例/数据/资质等）
  riskMitigation: string[]  // 风险缓解
  roi: string              // ROI 说明
}

// 行动项
interface ActionItem {
  id: string
  action: string           // 行动描述
  priority: string         // 优先级（高/中/低）
  deadline: string         // 截止时间
  owner: string           // 责任人
  status: string          // 状态（待开始/进行中/已完成）
}
```

## 工作流程

当用户要求生成销售指南时，按以下步骤执行：

### Step 1: 读取数据源

1. **读取客户档案**（必须）：
   - 使用 `read_file` 读取 `docs/customer/profile.json`
   - 提取企业基本信息、行业、规模、时机、痛点、需求、预算等
   - **如果文件不存在**：提示用户先运行 `/profile` skill

2. **读取跟进记录**（可选）：
   - 使用 `read_file` 读取 `docs/customer/followups.json`
   - 提取沟通历史、客户反馈、已尝试的方法等
   - **如果文件不存在**：继续执行，使用默认策略

3. **读取追踪数据**（可选）：
   - 使用 `read_file` 读取 `docs/customer/tracking.json`
   - 提取信息覆盖度、已回答问题、信息缺口等
   - **如果文件不存在**：继续执行，不生成覆盖度相关分析

### Step 1.5: AI 洞察分析

基于读取的数据，自动生成 AI 洞察分析：

#### 风险分析 (risks)

识别潜在风险点并提供缓解措施：

| 风险类型 | 识别依据 | 缓解措施示例 |
|----------|----------|--------------|
| **预算风险** | 预算范围不明确、意向等级低（<40） | 提供分期方案、强调ROI |
| **时间风险** | 决策周期长、交付时间紧迫 | 分阶段实施、设定里程碑 |
| **竞争风险** | 行业竞争激烈、客户提及竞对 | 突出差异化、准备竞对话术 |
| **信息风险** | 追踪覆盖度低（<50%）、关键问题未回答 | 补充调研、针对性提问 |
| **关系风险** | 跟进频率低、关键联系人未建立 | 增加拜访、发展多线联系人 |

#### 成交概率分析 (probability)

综合评估成交概率（0-100）：

| 概率等级 | 分值范围 | 判断条件 |
|----------|----------|----------|
| **高** | 80-100 | 需求明确且匹配度高 + 预算充足（意向>70）+ 跟进积极 + 覆盖度>80% |
| **中** | 50-79 | 需求基本明确 + 预算中等（意向40-70）+ 跟进正常 + 覆盖度50-80% |
| **低** | 0-49 | 需求不明确 + 预算不足（意向<40）+ 跟进不积极 + 覆盖度<50% |

影响因素分析：
- **正面因素**：需求明确、预算充足、意向高、跟进积极、决策周期合理
- **负面因素**：决策周期长、竞争激烈、信息不足、关键人未接触

#### 机会点识别 (opportunities)

| 机会来源 | 识别方法 | 示例 |
|----------|----------|------|
| **痛点机会** | 从 painPoints 提取未解决痛点 | 报告效率低 → LIMS自动化机会 |
| **扩展机会** | 从行业特点识别增值服务 | 检测机构 → 设备管理、人员培训 |
| **时机机会** | 从企业阶段识别切入点 | 刚融资 → 数字化转型预算充足 |
| **跟进机会** | 从沟通记录识别深度合作点 | 客户提及新业务线 → 新需求机会 |

### Step 2: 时机判断

基于 profile 中的 `strategy.phase` 和 `tracking.status` 进行时机判断：

| 时机类型 | 判断依据 | 紧急程度 | 切入策略 |
|----------|----------|----------|----------|
| **刚融资/刚上市** | profile 显示近期融资/上市 | 高 | 追热点，预算充足，快速切入 |
| **扩张期** | 大量招聘、新业务线 | 高 | 需要管理工具，强调效率 |
| **转型期** | 裁员/业务调整 | 中 | 降本增效，强调ROI |
| **稳定期** | 业务无明显变化 | 低 | 强调长期价值、稳定可靠 |
| **危机期** | 大量负面/司法风险 | 避免进入 | 避免进入，或谨慎观望 |

### Step 3: 破冰策略生成

#### 破冰话术类型

| 类型 | 适用场景 | 示例 |
|------|----------|------|
| **恭维型** | 初次接触，建立好感 | "听说贵公司是专精特新企业，恭喜！" |
| **好奇型** | 激发客户兴趣 | "你们现在检测量大概是多少？报告制作主要靠什么？" |
| **痛点型** | 直接点出痛点 | "很多检测机构都反馈报告制作效率低，你们是不是也有类似困扰？" |
| **借势型** | 借政策/行业之势 | "现在数字化转型政策支持力度很大，有没有考虑升级IT系统？" |
| **竞对型** | 提及竞对 | "XX公司最近在推LIMS，效果怎么样？" |

#### 情景化破冰话术

| 场景 | 话术特点 |
|------|----------|
| **首次接触** | 开放式提问，建立信任 |
| **跟进** | 承接上一次沟通，提出新价值 |
| **方案演示** | 聚焦客户关注点，展示效果 |
| **谈判** | 强调差异化价值，处理异议 |
| **收尾** | 明确下一步，推动决策 |

#### 避免话题

基于企业特征，生成需要避免的话题：
- **家族企业**：避免直接质疑管理方式
- **国企**：避免谈及敏感话题
- **危机期企业**：避免谈及财务困境
- **技术导向企业**：避免贬低现有技术

### Step 4: 访谈提纲设计

#### 快速筛选问题（3-5个）

用于初次接触或早期沟通，快速判断：
1. 业务现状（规模、样品量、流程）
2. 痛点确认（最困扰的问题）
3. 预算意向（是否有预算、预算范围）
4. 决策信息（谁决策、决策周期）
5. 竞对情况（是否用过其他系统）

#### 深度访谈问题（5-8个）

用于中期沟通，深入挖掘需求：
1. 业务流程细节（每个环节如何操作）
2. 效率问题（哪里最浪费时间）
3. 质量要求（有哪些合规要求）
4. 集成需求（需要对接哪些系统）
5. 扩展需求（未来1-2年计划）
6. 技术偏好（自研还是采购、云端还是本地）
7. 风险担忧（最担心的问题）
8. 成功标准（如何判断项目成功）

#### 收尾问题（2-3个）

用于谈判收尾或推动决策：
1. 还有哪些疑虑？
2. 下一步是什么？
3. 决策时间线是什么？

#### 针对性问题

基于客户特征定制的问题：
- **扩张期企业**：新业务如何支持、员工如何培训
- **转型期企业**：降本需求、ROI验证
- **技术导向企业**：技术架构、API能力
- **成本导向企业**：价格细节、分期付款

### Step 5: 竞对分析

#### 竞对类型

| 竞对类型 | 分析重点 |
|----------|----------|
| **传统大厂**（如赛默飞、岛津） | 优势：品牌/成熟；弱点：贵/复杂/定制难 |
| **国内厂商**（如北京三维、上海英格尔） | 优势：本土化；弱点：老旧/体验差 |
| **Excel+简单工具** | 优势：零成本；弱点：分散/效率低/不安全 |
| **自研系统** | 优势：完全定制；弱点：维护成本高/不专业 |

#### 差异化策略

基于我方优势设计差异化：
- **价格优势**：强调性价比
- **易用优势**：强调快速上手
- **本土优势**：强调服务响应
- **技术优势**：强调现代化架构
- **灵活优势**：强调快速迭代

### Step 6: 异议处理

#### 常见异议类型

| 异议类型 | 潜在关切 | 应对策略 |
|----------|----------|----------|
| **价格异议** | "太贵了" | 价值对比、分期付款、ROI分析 |
| **时间异议** | "现在没时间" | 时机判断、分阶段实施 |
| **功能异议** | "功能不够" | 需求确认、定制承诺 |
| **竞对异议** | "XX公司更便宜" | 差异化、竞对弱点 |
| **决策异议** | "需要再考虑" | 确认疑虑、设定期限 |
| **风险异议** | "风险太大" | 成功案例、试用保障 |

#### 异议处理框架

推荐使用 **L.A.R.C.** 框架：
1. **L**isten（倾听）：完整理解异议
2. **A**cknowledge（认同）：认同客户感受
3. **R**espond（回应）：提供有说服力的回应
4. **C**onfirm（确认）：确认疑虑是否消除

### Step 7: 决策链条分析

基于 profile 中的 `decision.makers`、`decision.influencers` 和 `organization` 信息：

| 角色 | 关注点 | 接触策略 |
|------|----------|----------|
| **决策者**（创始人/CEO/CTO） | ROI、战略价值、风险 | 强调战略价值、长期收益 |
| **影响者**（技术负责人/实验室主任） | 功能、易用性、集成 | 强调功能完善、操作便捷 |
| **执行者**（操作人员） | 学习成本、工作效率 | 强调易上手、提升效率 |
| **阻碍者**（财务/采购） | 成本、合规性 | 强调节省成本、符合规范 |

### Step 8: 价值主张设计

#### 价值主张公式

```
核心价值 = 我们解决的痛点 × 带来的收益 / 客户付出的成本
```

#### 利益点设计（3-5个）

从以下维度设计利益点：
1. **效率提升**：节省多少时间、提升多少效率
2. **成本降低**：节省多少人力、降低多少成本
3. **质量提升**：减少多少错误、提升多少准确率
4. **风险降低**：降低什么风险、符合什么规范
5. **战略价值**：支撑什么战略、带来什么竞争优势

#### 证明点设计

从以下维度设计证明点：
1. **成功案例**：同行业客户的成功案例
2. **数据支撑**：量化的效果数据（效率提升50%等）
3. **资质认证**：ISO认证、CNAS认可等
4. **团队实力**：专业团队、行业经验
5. **技术优势**：专利技术、核心算法

#### ROI 说明

```
ROI = (收益 - 成本) / 成本 × 100%

示例：系统投入20万，每年节省人力成本50万
ROI = (50 - 20) / 20 × 100% = 150%
投资回收期 = 20 / 50 = 0.4年 ≈ 5个月
```

### Step 9: 下一步行动

基于 `insights.actions` 和当前销售阶段生成行动项：

| 阶段 | 典型行动 |
|------|----------|
| **初步接触** | 首次拜访、需求调研、方案预约 |
| **方案展示** | 方案演示、POC测试、问题收集 |
| **谈判阶段** | 价格谈判、合同准备、异议处理 |
| **收尾阶段** | 合同签订、实施启动、项目规划 |

### Step 10: 生成销售指南文件

使用 `write` 工具生成 `docs/customer/sales-guide.json`：
- 使用 UTF-8 编码
- JSON 格式，缩进 2 个空格
- 确保所有字段完整且格式正确
- 如果文件已存在，询问用户是否覆盖

## 错误处理

### 数据源缺失处理

| 场景 | 处理方式 |
|------|----------|
| `profile.json` 不存在 | **停止执行**，提示用户先运行 `/profile` skill 初始化客户档案 |
| `followups.json` 不存在 | 继续执行，使用默认策略模板，AI洞察基于profile生成 |
| `tracking.json` 不存在 | 继续执行，跳过覆盖度相关分析 |
| 文件格式错误 | 报告错误位置，提示用户修复或重新生成 |

### 数据不完整处理

| 场景 | 处理方式 |
|------|----------|
| profile 缺少行业信息 | 使用 "通用" 行业模板 |
| profile 缺少痛点信息 | 基于行业特征推断常见痛点 |
| profile 缺少联系人 | 使用通用决策链模板 |
| profile 缺少预算信息 | 成交概率评估为中等，标注"预算待确认" |
| tracking 覆盖度为空 | 跳过覆盖度因素，基于其他数据评估概率 |

### 生成失败处理

- 如果生成过程中出错，保留已生成的部分内容
- 输出明确的错误信息和建议修复方案
- 不要覆盖已存在的有效文件

## 销售策略模板库

### 按企业类型分类

| 企业类型 | 核心策略 | 话术风格 |
|----------|----------|----------|
| **扩张期企业** | 强调支持扩张、规模化 | 激进、主动 |
| **转型期企业** | 强调降本增效、ROI | 务实、数据化 |
| **稳定期企业** | 强调长期价值、稳定性 | 稳健、可信赖 |
| **危机期企业** | 强调救急、快速见效 | 紧迫、果断 |
| **技术导向企业** | 强调技术先进性、可扩展 | 专业、技术化 |
| **成本导向企业** | 强调节省成本、高性价比 | 经济、实惠 |

### 按行业分类

| 行业 | 核心痛点 | 关键话术 |
|------|----------|----------|
| **第三方检测** | LIMS、报告自动化、样品管理 | "报告制作还是靠Word？" |
| **制造业** | MES、质量控制、库存管理 | "排产还靠Excel？" |
| **贸易批发** | ERP、CRM、应收管理 | "客户信息在销售手机里？" |
| **服务业** | 预约系统、会员管理 | "预约还靠电话？" |
| **互联网** | 产品管理、知识管理 | "需求还在飞书文档？" |

### 按联系人角色分类

| 角色 | 关注点 | 推荐话术 |
|------|----------|----------|
| **创始人/CEO** | ROI、战略、风险 | "这个项目可以让您公司效率提升50%，半年就能收回成本" |
| **CTO/技术负责人** | 技术架构、API能力 | "我们提供完整的API文档，可以和您现有系统无缝集成" |
| **实验室主任** | 功能、易用性 | "系统设计时就考虑了实验室的工作流程，操作非常直观" |
| **采购经理** | 价格、合规 | "我们的价格在同行业中处于中下水平，完全符合采购要求" |
| **财务总监** | 成本、ROI | "系统投入20万，第一年就能节省人力成本50万" |

## 电梯演讲生成指南

电梯演讲（Elevator Pitch）是30秒内向客户传达核心价值的精简话术。

### 电梯演讲公式

```
[客户痛点] + [我们的解决方案] + [核心价值/数据] + [行动号召]
```

### 生成要素

| 要素 | 说明 | 来源 |
|------|------|------|
| **客户痛点** | 从 profile.painPoints 提取最核心痛点 | profile.json |
| **解决方案** | 简洁描述产品/服务如何解决 | 产品定位 |
| **核心价值** | 量化的收益（效率提升50%、节省30%成本） | insights.json |
| **行动号召** | 下一步邀约 | 当前阶段 |

### 电梯演讲模板

**通用模板**：
> "我们发现很多[行业]企业都在[痛点]上花费大量时间和精力。[产品名]通过[解决方案]，帮助客户[核心价值]。[某知名客户]使用后[具体效果]。您这边方便花15分钟了解一下吗？"

**按阶段调整**：
- **初次接触**：侧重痛点共鸣，激发兴趣
- **方案展示**：侧重解决方案和效果
- **谈判阶段**：侧重差异化价值和ROI
- **收尾阶段**：侧重紧迫感和行动号召

### 电梯演讲示例

**检测行业示例**：
> "很多检测机构的报告制作还在用Word手工填写，一份报告要花2小时。我们的LIMS系统可以自动生成报告，把时间缩短到10分钟。像XX检测中心用了3个月，报告产能提升了80%。您这边方便安排个演示吗？"

## 输出示例

### 示例 1：基础生成
用户说："生成销售指南" 或 "制作销售攻略"

1. 读取 profile.json
2. 读取 insights.json（如存在）
3. 生成完整的 sales-guide.json
4. 输出销售指南摘要

### 示例 2：针对性生成
用户说："针对技术负责人生成话术" 或 "优化一下谈判阶段的话术"

1. 读取现有数据
2. 针对特定角色/阶段优化对应部分
3. 更新 sales-guide.json
4. 输出更新内容

### 示例 3：结合反馈优化
用户说："上次拜访客户反馈XX问题，更新销售指南"

1. 读取现有 sales-guide.json
2. 结合客户反馈调整策略
3. 更新 sales-guide.json
4. 输出优化内容

## 完整输出示例

以下是一个完整的 `sales-guide.json` 输出示例：

```json
{
  "salesGuide": {
    "customerId": "cust-001",
    "customerName": "华测检测技术股份有限公司",
    "generatedAt": "2025-01-22T10:30:00Z",
    "version": "1.0.0",
    
    "aiInsights": {
      "risks": [
        {
          "type": "竞争风险",
          "description": "客户曾提及赛默飞LIMS，可能正在对比评估",
          "severity": "中",
          "mitigation": "准备竞对分析资料，强调性价比和本地化服务优势"
        },
        {
          "type": "信息风险",
          "description": "决策流程和审批路径尚未明确",
          "severity": "中",
          "mitigation": "下次拜访时重点了解决策链条"
        }
      ],
      "probability": {
        "value": 72,
        "level": "中",
        "factors": [
          {
            "type": "正面",
            "description": "需求明确，报告自动化是核心痛点"
          },
          {
            "type": "正面",
            "description": "刚完成B轮融资，预算充足"
          },
          {
            "type": "正面",
            "description": "已有2次有效沟通，关系建立良好"
          },
          {
            "type": "负面",
            "description": "决策链条尚未完全明确"
          },
          {
            "type": "负面",
            "description": "存在竞对对比情况"
          }
        ]
      },
      "opportunities": [
        {
          "title": "多分支协同需求",
          "potentialValue": "高",
          "description": "客户新开3个区域分公司，有跨分支数据协同需求",
          "action": "演示多分支管理功能，准备分支协同案例"
        },
        {
          "title": "设备管理增值",
          "potentialValue": "中",
          "description": "检测机构通常有设备管理需求，可作为增值模块",
          "action": "在方案中加入设备管理模块介绍"
        }
      ]
    },
    
    "timing": {
      "timingStage": "扩张期",
      "analysisBasis": [
        "近期完成B轮融资5000万",
        "招聘信息显示大量招聘检测工程师",
        "新开设3个区域分公司"
      ],
      "entryStrategy": "强调系统支持多分支、规模化管理能力",
      "urgency": "高"
    },
    
    "iceBreaker": {
      "primaryHooks": [
        {
          "type": "恭维型",
          "content": "恭喜贵公司完成B轮融资，看来业务发展很快！",
          "rationale": "融资是企业重大利好，恭喜可快速拉近距离"
        },
        {
          "type": "痛点型",
          "content": "现在检测报告还是用Word做吗？一份报告大概要多久？",
          "rationale": "直击检测行业核心痛点，引发共鸣"
        },
        {
          "type": "借势型",
          "content": "最近很多检测机构都在做数字化转型，你们有什么计划吗？",
          "rationale": "借行业趋势之势，降低推销感"
        }
      ],
      "situationalHooks": {
        "firstContact": [
          {
            "type": "好奇型",
            "content": "你们现在样品量大概多少？报告怎么管理的？",
            "rationale": "开放式提问了解现状"
          }
        ],
        "followUp": [
          {
            "type": "价值型",
            "content": "上次聊到报告效率问题，我们整理了一个方案，您看方便花15分钟过一下吗？",
            "rationale": "承接上次沟通，提供新价值"
          }
        ],
        "demo": [],
        "negotiation": [],
        "closing": []
      },
      "avoidTopics": [
        "避免直接询问预算具体数字",
        "避免贬低客户现有流程",
        "避免提及竞对负面信息"
      ]
    },
    
    "interviewGuide": {
      "quickScreening": [
        {
          "id": "q1",
          "category": "需求",
          "question": "目前报告制作的流程是怎样的？",
          "purpose": "了解现状和痛点程度",
          "followUp": "每份报告大概需要多长时间？"
        },
        {
          "id": "q2",
          "category": "预算",
          "question": "今年有数字化方面的预算规划吗？",
          "purpose": "判断预算意向",
          "followUp": "大概在什么范围？"
        },
        {
          "id": "q3",
          "category": "决策",
          "question": "这类采购一般谁来决策？",
          "purpose": "识别决策链",
          "followUp": "需要经过哪些审批流程？"
        }
      ],
      "deepDive": [
        {
          "id": "d1",
          "category": "流程",
          "question": "从样品接收到报告出具，整个流程是怎样的？",
          "purpose": "深入理解业务流程",
          "followUp": "哪个环节最耗时？"
        }
      ],
      "closingQuestions": [
        {
          "id": "c1",
          "category": "确认",
          "question": "还有什么疑虑吗？",
          "purpose": "挖掘潜在异议",
          "followUp": "我来帮您解答"
        }
      ],
      "customQuestions": [
        {
          "id": "cq1",
          "category": "扩张",
          "question": "新开的分公司在IT系统上有什么规划？",
          "purpose": "挖掘扩张带来的新需求",
          "followUp": "希望总部和分部数据打通吗？"
        }
      ]
    },
    
    "competitorAnalysis": [
      {
        "competitor": "赛默飞 LIMS",
        "position": "国际大厂高端产品",
        "strengths": ["品牌知名度高", "功能全面"],
        "weaknesses": ["价格昂贵", "本地化服务弱", "定制困难"],
        "ourAdvantage": "价格仅为其1/3，本地化服务响应快",
        "differentiation": "强调性价比和服务响应速度",
        "defenseStrategy": "客户提到赛默飞时，强调总拥有成本和服务"
      }
    ],
    
    "objectionHandling": {
      "commonObjections": [
        {
          "type": "价格异议",
          "objection": "你们报价比预算高",
          "underlyingConcern": "担心投入产出不成正比",
          "response": "理解您的顾虑。我们可以算一笔账：系统上线后每月节省人力成本约3万，6个月就能收回成本。",
          "pivot": "您看这样，我们可以先做一个小范围试点，验证效果后再扩展"
        }
      ],
      "objectionPrevention": [
        "在演示时主动提供ROI分析",
        "提前准备同行业成功案例",
        "报价时同步提供分期方案"
      ],
      "handlingFramework": "L.A.R.C. 框架：Listen(倾听) - Acknowledge(认同) - Respond(回应) - Confirm(确认)"
    },
    
    "decisionChain": {
      "decisionMakers": [
        {
          "role": "总经理",
          "name": "张三",
          "concerns": ["ROI", "战略价值", "风险控制"],
          "motivations": ["提升公司效率", "支撑业务扩张"],
          "approach": "强调战略价值和行业地位提升"
        }
      ],
      "influencers": [
        {
          "role": "技术总监",
          "concerns": ["技术架构", "集成能力", "维护成本"],
          "motivations": ["技术先进性", "减少维护工作"],
          "approach": "强调现代化架构和开放API"
        }
      ],
      "blockers": [],
      "decisionProcess": "技术评估 → 商务谈判 → 总经理审批",
      "approvalPath": ["技术总监", "财务总监", "总经理"],
      "timeline": "预计2-3个月"
    },
    
    "valueProposition": {
      "coreValue": "让检测机构报告产能提升3倍，人力成本降低50%",
      "benefitPoints": [
        "报告制作时间从2小时缩短到10分钟",
        "样品流转全程可追溯，0遗漏",
        "支持多分支协同，数据实时同步",
        "符合CNAS认可要求"
      ],
      "proofPoints": [
        "已服务200+检测机构",
        "客户平均效率提升80%",
        "ISO27001信息安全认证"
      ],
      "riskMitigation": [
        "提供3个月免费试用",
        "数据本地化部署可选",
        "7×24小时技术支持"
      ],
      "roi": "投入20万，年节省人力成本50万，投资回收期约5个月，首年ROI 150%"
    },
    
    "elevatorPitch": "很多检测机构的报告还在用Word手工做，一份报告要花2小时。我们的LIMS系统可以自动生成报告，10分钟搞定。像华测检测用了3个月，报告产能提升了80%。您这边方便安排个15分钟演示吗？",
    
    "nextActions": [
      {
        "id": "a1",
        "action": "发送产品介绍资料和案例",
        "priority": "高",
        "deadline": "今天",
        "owner": "销售",
        "status": "待开始"
      },
      {
        "id": "a2",
        "action": "预约产品演示",
        "priority": "高",
        "deadline": "本周内",
        "owner": "销售",
        "status": "待开始"
      },
      {
        "id": "a3",
        "action": "准备针对性方案",
        "priority": "中",
        "deadline": "演示前",
        "owner": "售前",
        "status": "待开始"
      }
    ]
  }
}
```

## 注意事项

- **数据依赖**：
  - 必须基于 profile.json 生成
  - 有 insights.json 时应结合分析
  - 有跟进记录时应考虑沟通历史

- **个性化**：
  - 话术应针对企业特征定制
  - 问题应基于痛点设计
  - 策略应考虑时机因素

- **可操作性**：
  - 话术要自然、不生硬
  - 问题要开放、不封闭
  - 行动要具体、可执行

- **迭代优化**：
  - 根据客户反馈持续优化
  - 根据行业经验积累话术库
  - 根据成功案例更新策略

- **文件处理**：
  - 如果 sales-guide.json 已存在，询问是否覆盖
  - 确保生成的 JSON 格式正确
  - 所有中文字段使用中文
