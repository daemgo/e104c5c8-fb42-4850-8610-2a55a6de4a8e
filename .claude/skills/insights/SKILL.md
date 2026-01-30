---
name: insights
description: 基于客户档案、跟进记录、追踪数据等上下文生成 AI 洞察 insights.json
metadata:
  short-description: 生成客户洞察分析报告
  dependencies:
    - humanizer-zh  # 输出人性化处理（必须）
---

# SyncMind 生成洞察 Skill

这个 skill 用于基于客户档案、跟进记录、追踪数据等信息，生成 AI 洞察分析报告 `docs/customer/insights.json`。

## 功能

当用户要求生成洞察或分析客户情况时，使用此 skill 来：

1. 读取 `docs/customer/` 目录下的相关文件（profile.json, followups.json, tracking.json）
2. 分析客户档案、跟进记录、追踪数据等信息
3. 结合用户提供的额外要求或上下文
4. 生成符合 `InsightsResponse` 结构的 AI 洞察报告

## InsightsResponse 结构

```typescript
interface InsightsResponse {
  insights: AIInsights
}

interface AIInsights {
  risks: RiskItem[]                    // 风险项列表
  probability: {                       // 成交概率分析
    value: number                      // 概率值 (0-100)
    level: string                      // 概率等级 (高/中/低)
    factors: ProbabilityFactor[]       // 影响因素
  }
  actions: ActionSuggestion[]          // 行动建议
  opportunities: OpportunityItem[]     // 机会点
}

interface RiskItem {
  type: string                         // 风险类型
  description: string                  // 风险描述
}

interface ProbabilityFactor {
  description: string                  // 因素描述
}

interface ActionSuggestion {
  title: string                        // 行动标题
  description: string                  // 行动描述
  timeEstimate: string                 // 时间估算
  priority: string                     // 优先级 (高/中/低)
}

interface OpportunityItem {
  title: string                        // 机会标题
  potentialValue: string               // 潜在价值
  description: string                  // 机会描述
}
```

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
  type: string
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
    coverageRate: number
    coveredCount: number
    totalCount: number
    categories: TrackingCategory[]
  }
}

interface TrackingCategory {
  id: string
  name: string
  icon: string
  color: string
  questions: TrackingQuestion[]
}

interface TrackingQuestion {
  question: string
  answered: boolean
  answer: string
}
```

## 工作流程

当用户要求生成洞察时，按以下步骤执行：

1. **读取数据源**：
   - 使用 `read_file` 工具读取 `docs/customer/profile.json`
   - 使用 `read_file` 工具读取 `docs/customer/followups.json`（如果存在）
   - 使用 `read_file` 工具读取 `docs/customer/tracking.json`（如果存在）
   - 如果文件不存在或为空，记录并继续

2. **分析客户档案 (profile.json)**：
   - 提取公司基本信息（名称、行业、规模、评级）
   - 分析需求列表和痛点
   - 评估预算信息和意向等级
   - 分析联系人信息

3. **分析跟进记录 (followups.json)**：
   - 分析跟进频率和趋势
   - 提取关键沟通内容
   - 识别参与人员和互动情况
   - 分析跟进类型和效果

4. **分析追踪数据 (tracking.json)**：
   - 评估信息覆盖度（coverageRate）
   - 分析已回答和未回答的问题
   - 识别信息缺口
   - 评估各分类的完成情况

5. **结合用户上下文**：
   - 如果用户提供了额外要求，纳入分析
   - 如果用户提供了特定关注点，重点分析
   - 如果用户提供了时间限制或其他约束，在建议中体现

6. **生成洞察分析**：
   - **风险分析 (risks)**：
     - 识别潜在风险点（如预算不足、决策周期长、竞争激烈等）
     - 基于跟进记录识别沟通风险
     - 基于追踪数据识别信息缺口风险
     - 每个风险包含类型和详细描述
   
   - **成交概率分析 (probability)**：
     - 综合评估成交概率（0-100）
     - 确定概率等级（高：80-100，中：50-79，低：0-49）
     - 列出影响概率的关键因素：
       - 正面因素（需求明确、预算充足、意向高、跟进积极等）
       - 负面因素（决策周期长、竞争激烈、信息不足等）
   
   - **行动建议 (actions)**：
     - 基于分析结果生成具体可执行的行动建议
     - 每个建议包含：
       - 标题（清晰明确）
       - 描述（具体操作步骤）
       - 时间估算（如"1周内"、"2-3天"等）
       - 优先级（高/中/低）
     - 建议应针对性强，可操作
   
   - **机会点 (opportunities)**：
     - 识别潜在的业务机会
     - 每个机会包含：
       - 标题
       - 潜在价值（如"高价值"、"中等价值"等）
       - 描述（机会的详细说明）

7. **创建目录结构**：
   - 确保 `docs/customer/` 目录存在
   - 如果不存在，创建该目录

8. **生成 insights.json**：
   - 使用 `write` 工具创建 `docs/customer/insights.json` 文件
   - 生成符合 `InsightsResponse` 结构的 JSON 内容
   - 确保所有字段完整且格式正确

9. **文件格式**：
   - 使用 UTF-8 编码
   - JSON 格式，缩进 2 个空格
   - 确保 JSON 格式正确且符合 TypeScript 类型定义

## 分析策略

### 风险识别策略
- **预算风险**：预算范围不明确、意向等级低
- **时间风险**：决策周期长、交付时间紧迫
- **竞争风险**：行业竞争激烈、替代方案多
- **信息风险**：追踪覆盖度低、关键问题未回答
- **关系风险**：跟进频率低、关键联系人未建立

### 概率评估策略
- **高概率 (80-100)**：
  - 需求明确且匹配度高
  - 预算充足且意向等级高（>70）
  - 跟进积极且沟通顺畅
  - 追踪覆盖度高（>80%）
  - 决策周期合理
  
- **中概率 (50-79)**：
  - 需求基本明确但需进一步确认
  - 预算和意向等级中等（40-70）
  - 跟进正常但需加强
  - 追踪覆盖度中等（50-80%）
  - 存在一些不确定因素
  
- **低概率 (0-49)**：
  - 需求不明确或匹配度低
  - 预算不足或意向等级低（<40）
  - 跟进不积极或沟通不畅
  - 追踪覆盖度低（<50%）
  - 存在重大风险因素

### 行动建议策略
- **高优先级**：针对关键风险、高价值机会、紧急事项
- **中优先级**：常规跟进、信息补充、关系维护
- **低优先级**：长期规划、非紧急优化

### 机会识别策略
- 基于客户痛点和需求识别解决方案机会
- 基于行业特点识别扩展服务机会
- 基于跟进记录识别深度合作机会
- 基于追踪数据识别信息补充后的新机会

## 示例

### 示例 1：基础生成
用户说："生成这个客户的洞察" 或 "分析一下客户情况"

1. 读取 profile.json, followups.json, tracking.json
2. 综合分析所有数据
3. 生成完整的 insights.json
4. 输出分析结果摘要

### 示例 2：带特定要求
用户说："重点关注成交概率和风险" 或 "分析一下跟进效果"

1. 读取相关数据文件
2. 重点分析用户关注的方向
3. 在对应字段中提供更详细的分析
4. 生成 insights.json

### 示例 3：带额外上下文
用户说："客户最近有新的需求，生成新的洞察" 或 "竞争对手是XX公司，重新分析"

1. 读取现有数据
2. 结合用户提供的新信息
3. 更新分析结果
4. 生成新的 insights.json

## 注意事项

- **数据完整性**：
  - 如果某些文件不存在或为空，基于已有数据进行分析
  - 在分析中说明数据不足的情况
  - 不要编造不存在的数据

- **分析深度**：
  - 根据数据丰富程度调整分析深度
  - 数据充足时提供详细分析
  - 数据不足时提供基础分析和建议

- **准确性**：
  - 基于实际数据进行分析，不要过度推断
  - 对于不确定的信息，在描述中使用"可能"、"需要进一步确认"等表述
  - 概率评估要客观，不要过于乐观或悲观

- **可操作性**：
  - 行动建议要具体可执行
  - 时间估算要合理
  - 优先级要准确反映重要性

- **文件处理**：
  - 如果 insights.json 已存在，询问用户是否覆盖
  - 确保生成的 JSON 格式正确
  - 所有中文字段使用中文

- **用户上下文**：
  - 充分理解用户提供的额外要求
  - 在分析中体现用户的关注点
  - 如果用户要求与数据矛盾，说明情况
