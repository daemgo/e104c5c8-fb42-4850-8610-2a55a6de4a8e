---
name: profile
description: 基于客户名称初始化 SyncMind 项目，生成客户档案 profile.json
metadata:
  short-description: 初始化 SyncMind 项目并生成客户档案
  dependencies:
    - humanizer-zh  # 输出人性化处理（必须）
---

# SyncMind 项目初始化 Skill

这个 skill 用于初始化 SyncMind 项目，基于客户名称自动生成客户档案文件 `docs/customer/profile.json`。

## 功能

当用户提供客户名称时，使用此 skill 来：

1. 创建 `docs/customer/` 目录（如果不存在）
2. 基于客户名称生成符合 `ProfileResponse` 结构的客户档案
3. 生成包含完整字段的 profile.json 文件

## ProfileResponse 结构

```typescript
interface ProfileResponse {
  profile: CustomerProfile
}

interface CustomerProfile {
  companyName: string        // 公司名称
  industry: string           // 行业
  scale: string              // 规模
  rating: string             // 评级
  tags: string[]             // 标签
  contacts: Contact[]        // 联系人列表
  requirements: string[]     // 需求列表
  painPoints: string[]       // 痛点列表
  budget: BudgetInfo         // 预算信息
}

interface Contact {
  name: string               // 姓名
  role: string               // 职位
  phone: string              // 电话
  email: string              // 邮箱
  influence: string          // 影响力
}

interface BudgetInfo {
  range: string              // 预算范围
  deliveryTime: string       // 交付时间
  decisionCycle: string     // 决策周期
  intentionLevel: number     // 意向等级 (0-100)
}
```

## 工作流程

当用户提供客户名称时，按以下步骤执行：

1. **接收客户名称**：从用户输入中获取客户名称

2. **网络搜索收集信息**：
   - 使用 `web_search` 工具搜索客户公司信息
   - 搜索关键词应包括：公司名称、行业、规模、业务范围等
   - 收集以下信息：
     - 公司基本信息（成立时间、所在地、主营业务）
     - 行业分类
     - 公司规模（员工数量、营收规模等）
     - 业务特点和产品服务
     - 公开的联系方式（如有）
     - 行业地位和影响力
   - 进行多次搜索以获取更全面的信息

3. **整合和分析信息**：
   - 整理搜索到的信息
   - 根据收集的信息推断：
     - 行业分类（科技、金融、医疗、教育、零售、制造等）
     - 公司规模（小型、中型、大型）
     - 评级（根据规模和行业地位）
     - 相关标签
   - 如果信息不足，使用合理的默认值

4. **创建目录结构**：
   - 确保 `docs/customer/` 目录存在
   - 如果不存在，创建该目录

5. **生成客户档案**：
   - 使用 `write` 工具创建 `docs/customer/profile.json` 文件
   - 生成符合 `ProfileResponse` 结构的 JSON 内容
   - 尽可能使用搜索到的真实信息填充字段

6. **生成策略**：
   - **companyName**: 使用用户提供的客户名称（或搜索到的官方名称）
   - **industry**: 
     - 优先使用搜索到的行业信息
     - 如果搜索不到，根据公司名称和业务推断（科技、金融、医疗、教育、零售、制造等）
     - 如果无法推断则使用 "其他"
   - **scale**: 
     - 根据搜索到的员工数量、营收等信息判断（小型、中型、大型）
     - 如果信息不足，默认 "中型"
   - **rating**: 
     - 根据公司规模、行业地位等信息评估（A、B、C）
     - 如果信息不足，默认 "B"
   - **tags**: 
     - 基于搜索到的信息生成相关标签
     - 至少包含行业和 "潜在客户"
     - 可添加业务特点、技术领域等相关标签
   - **contacts**: 
     - 如果搜索到公开的联系方式，可以填入
     - 否则生成一个默认联系人对象，字段值为 "待补充" 或空字符串
   - **requirements**: 生成空数组 `[]`（待后续补充）
   - **painPoints**: 生成空数组 `[]`（待后续补充）
   - **budget**: 
     - `range`: "待评估"
     - `deliveryTime`: "待评估"
     - `decisionCycle`: "待评估"
     - `intentionLevel`: 50

5. **文件格式**：
   - 使用 UTF-8 编码
   - JSON 格式，缩进 2 个空格
   - 确保 JSON 格式正确且符合 TypeScript 类型定义

## 示例

当用户说："初始化一个客户叫阿里巴巴" 或 "为腾讯创建客户档案" 时：

1. **识别客户名称**：提取 "阿里巴巴" 或 "腾讯"

2. **网络搜索**：
   - 搜索 "阿里巴巴 公司信息"
   - 搜索 "阿里巴巴 行业 规模"
   - 搜索 "阿里巴巴 业务范围"
   - 收集公司基本信息

3. **整合信息**：
   - 从搜索结果中提取：行业（科技/零售）、规模（大型）、业务特点等
   - 分析并整理为结构化信息

4. **生成档案**：
   - 使用收集到的真实信息填充字段
   - 生成完整的 profile.json 文件
   - 保存到 `docs/customer/profile.json`

5. **输出结果**：
   - 告知用户已生成客户档案
   - 简要说明收集到的主要信息

## 注意事项

- **搜索策略**：
  - 进行多次搜索以获取全面信息
  - 优先使用官方或权威来源的信息
  - 如果搜索不到信息，使用合理的推断和默认值
  - 不要编造不存在的信息

- **信息准确性**：
  - 尽可能使用搜索到的真实信息
  - 对于不确定的信息，使用 "待评估" 或 "待补充"
  - 不要猜测或编造联系人的具体信息

- **文件处理**：
  - 确保生成的 JSON 格式正确且符合 TypeScript 类型定义
  - 如果文件已存在，询问用户是否覆盖
  - 所有中文字段使用中文，确保可读性

- **后续补充**：
  - 生成的档案是初始模板，基于公开信息
  - 联系信息、需求、痛点等需要后续根据实际接触补充
