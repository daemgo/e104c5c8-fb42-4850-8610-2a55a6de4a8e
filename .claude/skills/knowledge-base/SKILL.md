---
name: knowledge-base
description: 行业知识中台 - 元模型管理，支持录入、查询、更新行业软件元模型，为方案生成提供专业知识支撑
metadata:
  short-description: 行业元模型知识库管理
  triggers:
    - "添加元模型"
    - "录入元模型"
    - "沉淀元模型"
    - "查询知识库"
    - "知识库"
    - "元模型"
    - "更新元模型"
    - "知识库概览"
  examples:
    - "帮我沉淀一个MES系统的元模型"
    - "我有一份ERP的软件手册，帮我提炼元模型"
    - "查一下知识库里有没有SRM相关的元模型"
    - "看看知识库目前的情况"
    - "更新制造业MES元模型，补充质量管理模块"
---

# SyncMind 行业知识中台 - 元模型管理 Skill

这个 skill 用于管理行业软件元模型知识库。用户提供软件手册、截图、使用总结等材料，AI 辅助提炼结构化元模型，沉淀到知识库中。

## 核心定位

**行业知识中台 = 元模型库**

元模型回答的核心问题：**这类软件应该长什么样？**

| 维度 | 内容 |
|------|------|
| 产品定义 | 这类软件解决什么问题 |
| 核心模块 | 标准功能模块有哪些 |
| 典型角色 | 谁在用 |
| 核心业务流 | 关键流程怎么走 |
| 行业特色 | 区别于通用的地方 |
| 竞品参考 | 市面上主流产品 |
| 差异化点 | 我们能做出的优势 |

## 工作流程位置

```
知识中台（元模型库）
        ↓ 被引用
/plan-writer 生成方案时匹配行业+需求 → 调取元模型 → 融入方案
        ↓
/spec-writer 设计产品时参考模块和流程
```

## 数据目录

```
docs/knowledge-base/
├── index.json                     # 全局索引
├── meta-models/
│   ├── industries/                # 垂直行业
│   │   ├── manufacturing/         # 制造业
│   │   ├── pharma/                # 医药
│   │   ├── retail/                # 零售
│   │   └── {industry}/            # 其他行业...
│   └── common/                    # 通用型（跨行业）
│       ├── erp.json               # 通用ERP元模型（行业共识）
│       ├── erp-vendors/           # ERP厂商具体产品模型
│       │   ├── kingdee-k3.json    # 金蝶云·星空
│       │   └── yonyou-u9.json     # 用友U9（示例）
│       ├── crm.json               # 通用CRM元模型
│       └── crm-vendors/           # CRM厂商产品模型（按需创建）
```

### 两层架构：通用层 + 厂商层

| 层级 | 存储位置 | 内容 | 更新规则 |
|------|---------|------|---------|
| **通用层** | `{type}.json` | 行业共识的模块、角色、流程定义，不绑定任何厂商 | **只增不改** — 新增遗漏的通用能力，不覆盖已有内容 |
| **厂商层** | `{type}-vendors/{vendor}.json` | 某家产品的具体模块划分、特色功能、定价、优劣势 | **可整体覆写** — 每家独立文件，互不影响 |

**通用层原则**：
- 只保留"这类软件应该有什么"的行业共识
- 不包含某厂商特有的功能描述或品牌信息
- `competitors` 字段只做简要列表（名称+定位），详细竞品分析放厂商文件
- 每次调研新厂商后，检查是否有通用能力遗漏，有则增量补充

**厂商层原则**：
- 每个厂商独立一个文件，通过 `parentModelId` 指向通用模型
- 包含 `moduleMapping`：厂商模块与通用模块的映射关系
- 包含 `vendorSpecificFeatures`：厂商特有功能（通用模型没有的）
- 包含详细的优劣势、定价、目标客户、竞品对比

---

## 元模型标准结构

每个元模型是一个 JSON 文件，遵循以下结构：

```typescript
interface MetaModel {
  // ===== 元信息 =====
  meta: {
    id: string;                    // 唯一标识，如 "mfg-mes"
    name: string;                  // 名称，如 "制造执行系统(MES)"
    industry: string;              // 行业，如 "manufacturing"
    type: string;                  // 软件类型，如 "mes"
    scope: "general" | "vertical"; // 通用型 / 垂直型
    version: string;               // 版本号
    updatedAt: string;             // 更新时间

    // 鲜度管理
    freshness: {
      createdAt: string;           // 创建时间
      lastReviewedAt: string;      // 最近审核时间
      nextReviewDate: string;      // 下次审核时间（建议6个月）
      confidence: "high" | "medium" | "low";
    };

    // 成熟度评级
    maturity: {
      level: "L1" | "L2" | "L3" | "L4" | "L5";
      description: string;
      completeness: {
        definition: boolean;       // 产品定义
        modules: boolean;          // 核心模块
        roles: boolean;            // 典型角色
        workflows: boolean;        // 核心业务流
        industrySpecific: boolean; // 行业特色
        competitors: boolean;      // 竞品参考
        differentiators: boolean;  // 差异化能力
      };
    };
  };

  // ===== 产品定义 =====
  definition: {
    whatIs: string;                // 一句话定义
    solves: string[];              // 解决什么问题
    value: string[];               // 核心价值
    positioning: string;           // 在企业IT架构中的位置
  };

  // ===== 核心模块 =====
  modules: {
    id: string;
    name: string;
    description: string;
    priority: "core" | "standard" | "advanced";
    features: string[];
  }[];

  // ===== 典型角色 =====
  roles: {
    name: string;
    description: string;
    keyTasks: string[];
  }[];

  // ===== 核心业务流 =====
  workflows: {
    name: string;
    description: string;
    steps: string[];
  }[];

  // ===== 行业特色（垂直型） =====
  industrySpecific?: {
    regulations: string[];         // 行业法规要求
    specialFeatures: string[];     // 行业特有功能
    certifications: string[];      // 相关认证
  };

  // ===== 竞品参考 =====
  competitors: {
    name: string;
    vendor: string;
    strengths: string[];
    weaknesses: string[];
    priceRange: string;
    targetCustomer: string;
  }[];

  // ===== 差异化能力 =====
  differentiators: {
    feature: string;
    description: string;
    competitiveAdvantage: string;
  }[];

  // ===== 典型客户画像 =====
  idealCustomer: {
    scale: string;                 // 企业规模
    painPoints: string[];          // 典型痛点
    budget: string;                // 预算范围
    decisionFactors: string[];     // 决策因素
  };

  // ===== 匹配信号 =====
  matching: {
    strongSignals: string[];       // 强匹配关键词
    weakSignals: string[];         // 弱匹配关键词
    antiSignals: string[];         // 排斥信号（不匹配）
    confusionWith: {               // 容易混淆的元模型
      modelId: string;
      distinction: string;         // 区分说明
    }[];
  };

  // ===== 元模型关系 =====
  relations: {
    targetModelId: string;
    relationType: "upstream" | "downstream" | "parallel" | "alternative";
    description: string;
    integrationPoints: string[];   // 集成点
  }[];
}
```

### 厂商模型结构（VendorModel）

厂商层文件遵循以下结构：

```typescript
interface VendorModel {
  meta: {
    id: string;                    // 如 "erp-vendor-kingdee-k3"
    name: string;                  // 产品名称
    parentModelId: string;         // 指向通用模型 id，如 "common-erp"
    vendor: string;                // 厂商全称
    product: string;               // 产品全称+版本
    version: string;
    updatedAt: string;
    freshness: {
      createdAt: string;
      lastReviewedAt: string;
      nextReviewDate: string;
      confidence: "high" | "medium" | "low";
      dataSource: string;          // 数据来源说明
    };
  };

  overview: {
    fullName: string;
    latestVersion: string;
    platform: string;
    positioning: string;
    customerBase: string;
    deploymentOptions: string[];
    techStack: Record<string, string>;
  };

  productEditions: {
    name: string;
    target: string;
    modules: string;
    priceRange: string;
  }[];

  // 核心：厂商模块与通用模块的映射
  moduleMapping: {
    description: string;
    mapping: {
      genericModuleId: string;          // 对应通用模型的模块 id
      vendorModuleName: string;         // 厂商叫法
      vendorSubModules: string[];       // 厂商子模块
      vendorSpecificFeatures: string[]; // 厂商特有功能（通用模型没有的）
    }[];
  };

  strengths: string[];
  weaknesses: string[];

  pricing: {
    model: string;
    [key: string]: any;
  };

  targetCustomer: {
    scale: string;
    industries: string[];
    characteristics: string[];
  };

  competitiveComparison: Record<string, {
    advantage: string;
    disadvantage: string;
  }>;
}
```

### 成熟度等级定义

| 等级 | 名称 | 内容要求 | plan-writer 引用方式 |
|------|------|----------|---------------------|
| L1 | 概念级 | 仅有定义和模块名称 | 仅作为参考方向，标注"概要参考" |
| L2 | 框架级 | 定义 + 核心模块 + 角色 | 可引用模块设计框架 |
| L3 | 标准级 | 上述 + 流程 + 行业特色 | 可深度引用到方案设计 |
| L4 | 专业级 | 上述 + 竞品 + 差异化 | 可支撑竞争策略和定位 |
| L5 | 验证级 | 上述 + 经过实际项目验证 | 可作为标杆方案直接套用 |

---

## 功能模式

### 模式一：录入元模型

用户提供材料（软件手册、截图、使用总结等），AI 辅助提炼结构化元模型。

#### 触发方式

- "帮我沉淀一个 MES 的元模型"
- "我有一份 ERP 手册，帮我提炼"
- "添加一个制造业 WMS 元模型"

#### 工作流程

##### Step 1: 确认基本信息

询问用户：

| 问题 | 示例回答 |
|------|----------|
| 软件类型是什么？ | MES（制造执行系统） |
| 属于哪个行业？ | 制造业 / 通用 |
| 是通用型还是垂直型？ | 垂直-制造业 |
| 你有什么材料？ | 软件手册 / 截图 / 使用总结 / 口述 |

##### Step 2: 接收材料

接收用户提供的材料：
- 软件手册文档
- 系统截图
- 使用总结/笔记
- 口头描述
- 竞品对比信息

##### Step 3: AI 提炼元模型

基于材料提炼结构化内容，按以下顺序：

1. **产品定义**：提取软件定位、解决的问题、核心价值
2. **核心模块**：识别功能模块，标记优先级（core/standard/advanced）
3. **典型角色**：识别使用角色和关键任务
4. **核心业务流**：提取主要业务流程和步骤
5. **行业特色**（垂直型）：提取法规要求、特有功能、相关认证
6. **竞品参考**：提取竞品信息（如有）
7. **差异化能力**：提取或建议差异化点
8. **客户画像**：提取典型客户特征
9. **匹配信号**：生成检索匹配的关键词
10. **关系网络**：识别与其他元模型的关系

##### Step 4: 评估成熟度

根据提炼结果自动评估成熟度等级：

```
检查每个板块是否完成：
- definition ✓ → 有
- modules ✓ → 有
- roles ✗ → 无
- workflows ✗ → 无
...

完成 2/7 → L1
完成 3/7 → L2
完成 5/7 → L3
完成 6/7 → L4
全部完成 + 实际验证 → L5
```

##### Step 5: 输出审核

将提炼结果以可读格式展示给用户审核：

```markdown
## 元模型提炼结果

**名称**：制造执行系统(MES)
**行业**：制造业（垂直）
**成熟度**：L2（框架级）

### 产品定义
{whatIs}

### 核心模块（已识别 {n} 个）
| 模块 | 优先级 | 说明 |
|------|--------|------|
| ... | ... | ... |

### 典型角色（已识别 {n} 个）
...

### 缺失部分
- [ ] 核心业务流（未提供材料）
- [ ] 竞品参考（未提供材料）

---
确认无误后我将保存到知识库。
如有修改请直接告诉我。
```

##### Step 6: 保存

1. 生成元模型 JSON 文件，保存到对应目录
2. 更新 `index.json`，添加索引条目
3. 输出保存确认

```markdown
## 已保存

- 文件：`docs/knowledge-base/meta-models/industries/manufacturing/mes.json`
- 索引已更新
- 成熟度：L2
- 下次建议审核时间：{6个月后}

如有新材料可以随时说"更新 MES 元模型"来补充。
```

---

### 模式二：查询知识库

根据行业、软件类型或关键词查询元模型。

#### 触发方式

- "查一下知识库里有没有 SRM 相关的"
- "制造业有哪些元模型"
- "查询知识库"

#### 工作流程

##### Step 1: 解析查询意图

从用户输入中提取：
- 行业关键词
- 软件类型关键词
- 场景描述

##### Step 2: 匹配检索

```
1. 读取 index.json
2. 按以下优先级匹配：
   a. id / type 精确匹配
   b. tags 匹配
   c. keywords 匹配
   d. applicableScenarios 语义匹配
3. 排除 antiSignals 命中的结果
4. 按匹配度排序
```

##### Step 3: 输出结果

```markdown
## 查询结果

找到 {n} 个相关元模型：

| 元模型 | 行业 | 类型 | 成熟度 | 匹配度 |
|--------|------|------|--------|--------|
| MES | 制造业 | 垂直 | L3 | 强匹配 |
| ERP | 通用 | 通用 | L2 | 弱匹配 |

需要查看某个元模型的详细内容吗？
```

---

### 模式三：更新元模型

对已有元模型补充新内容。分为两种场景：**补充通用模型** 和 **新增/更新厂商模型**。

#### 触发方式

- "更新 MES 元模型"
- "补充制造业 ERP 的竞品信息"
- "我有新的 WMS 材料要补充"
- "帮我调研用友 ERP，更新知识库" → 新增厂商模型

#### 场景判断

| 用户意图 | 操作 |
|---------|------|
| "补充 ERP 的生产管理模块" | 更新通用模型（增量补充） |
| "调研用友 ERP" | 新增厂商模型 + 检查通用模型是否需要补充 |
| "更新金蝶 ERP 到最新版本" | 覆写厂商模型 |
| "ERP 加一个新流程" | 更新通用模型（增量补充） |

#### 工作流程 A：更新通用模型

##### Step 1: 定位元模型

读取 index.json，找到对应元模型文件。

##### Step 2: 读取现有内容

读取元模型 JSON，展示当前状态：

```markdown
## 当前状态

**MES 元模型** - 制造业（垂直）
**成熟度**：L2（框架级）

### 已有内容
- [x] 产品定义
- [x] 核心模块（8个）
- [x] 典型角色（5个）
- [ ] 核心业务流
- [ ] 行业特色
- [ ] 竞品参考
- [ ] 差异化能力

请提供要补充的内容或材料。
```

##### Step 3: 接收新材料

接收用户提供的补充材料。

##### Step 4: 增量合并

**关键规则：只增不改**
- 新增遗漏的模块/角色/流程 → 追加到数组
- 已有模块发现遗漏的 features → 追加到该模块的 features 数组
- **不修改**已有内容的描述文本
- **不删除**任何已有内容
- 重新评估成熟度等级
- 更新 version（minor 版本号 +1）和 updatedAt

##### Step 5: 输出审核并保存

同模式一的 Step 5-6。

#### 工作流程 B：新增/更新厂商模型

当用户要求调研某个具体厂商产品时：

##### Step 1: 确认厂商信息

| 问题 | 示例 |
|------|------|
| 哪个厂商的产品？ | 用友 U9 Cloud |
| 属于哪个通用模型？ | ERP |
| 有什么材料？ | 官网资料 / 手册 / 口述 |

##### Step 2: 调研/接收材料

通过搜索或用户提供的材料收集厂商产品信息。

##### Step 3: 生成厂商模型

按 VendorModel 结构生成 JSON 文件，重点完成：
1. `overview` — 产品基本信息
2. `moduleMapping` — **与通用模型的模块映射**（核心）
3. `vendorSpecificFeatures` — 厂商特有功能
4. `strengths / weaknesses` — 优劣势
5. `pricing` — 定价信息
6. `competitiveComparison` — 与其他厂商的对比

##### Step 4: 检查通用模型是否需要补充

对比厂商产品与通用模型：
```
遍历厂商的模块列表：
  如果某个模块在通用模型中不存在 → 判断是否是行业通用能力
    是行业通用 → 增量补充到通用模型
    是厂商特有 → 仅保留在厂商模型的 vendorSpecificFeatures 中
```

##### Step 5: 输出审核

```markdown
## 厂商模型生成结果

**产品**：用友 U9 Cloud
**关联通用模型**：ERP（common-erp）
**模块映射**：14/14 个通用模块已映射

### 厂商特有功能（3项）
- xxx
- xxx
- xxx

### 通用模型需要补充（2项）
- [ ] 新增模块：xxx（用友和金蝶都有，属于行业通用）
- [ ] 补充流程：xxx

---
确认后我将：
1. 保存厂商模型到 erp-vendors/yonyou-u9.json
2. 增量更新通用 ERP 模型
3. 更新 index.json
```

##### Step 6: 保存

1. 保存厂商模型文件到 `{type}-vendors/` 目录
2. 更新通用模型的 `meta.vendorModels.vendors` 数组
3. 如有通用模型补充，执行增量更新
4. 更新 `index.json`

---

### 模式四：知识库概览

查看知识库整体覆盖情况。

#### 触发方式

- "知识库概览"
- "看看知识库目前的情况"

#### 输出格式

```markdown
## 知识库概览

**总计**：{n} 个元模型

### 按行业分布

| 行业 | 元模型数 | 平均成熟度 |
|------|----------|-----------|
| 制造业 | 3 | L2.3 |
| 医药 | 1 | L1.0 |
| 通用 | 2 | L2.5 |

### 按成熟度分布

| 等级 | 数量 | 占比 |
|------|------|------|
| L1 | 2 | 33% |
| L2 | 3 | 50% |
| L3 | 1 | 17% |

### 需要审核的元模型

| 元模型 | 上次审核 | 建议审核时间 |
|--------|----------|-------------|
| MES | 2026-01-27 | 2026-07-27 |

### 覆盖缺口

以下行业/类型暂无元模型：
- 金融行业
- 教育行业
- 物流行业
```

---

## plan-writer 调用接口

plan-writer 生成方案时，调用知识库的逻辑：

### 匹配流程

```
1. 读取 requirements.json，提取：
   - 客户行业
   - 业务场景关键词
   - 功能需求关键词

2. 读取 index.json，遍历 catalog：
   - 匹配 industry
   - 匹配 tags / keywords
   - 匹配 applicableScenarios
   - 排除 antiSignals

3. 对命中的元模型：
   - 按匹配度排序
   - 读取 top N 个元模型完整内容
   - 检查成熟度等级，标注引用可信度

4. 融入方案生成：
   - L1-L2：作为参考方向，不深度引用
   - L3+：可深度引用模块设计、流程设计
   - L4+：可引用竞品分析和差异化策略
```

### 引用标注

方案中引用元模型时需标注来源：

```markdown
> 参考元模型：MES（制造执行系统）| 成熟度 L3 | 最近审核 2026-01-27
```

---

## index.json 索引结构

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-01-27",
  "description": "SyncMind 行业知识中台 - 元模型索引",
  "structure": {
    "metaModels": "meta-models/",
    "industries": "meta-models/industries/",
    "common": "meta-models/common/"
  },
  "industries": [
    {
      "id": "manufacturing",
      "name": "制造业",
      "path": "meta-models/industries/manufacturing/",
      "models": ["mfg-erp", "mfg-mes", "mfg-wms"]
    }
  ],
  "common": {
    "path": "meta-models/common/",
    "models": ["common-crm", "common-srm"]
  },
  "catalog": [
    {
      "id": "mfg-mes",
      "name": "制造执行系统(MES)",
      "industry": "manufacturing",
      "type": "mes",
      "scope": "vertical",
      "path": "meta-models/industries/manufacturing/mes.json",
      "maturity": "L3",
      "tags": ["生产管理", "车间管控", "质量追溯", "设备管理", "工单"],
      "keywords": ["排产", "报工", "SPC", "OEE", "工艺路线", "工序"],
      "applicableScenarios": [
        "客户需要车间级生产管控",
        "客户提到排产、报工、质检",
        "客户现有ERP但缺少车间执行层"
      ],
      "antiSignals": ["纯贸易企业", "无生产环节"],
      "summary": "制造执行系统，连接ERP计划层和车间执行层，核心解决生产过程透明化管控"
    }
  ]
}
```

---

## 错误处理

| 场景 | 处理 |
|------|------|
| 用户未提供材料 | 引导提供材料或基于口述创建 L1 级元模型 |
| 元模型已存在 | 提示已存在，询问是更新还是新建 |
| index.json 不存在 | 自动创建初始 index.json |
| 查询无结果 | 提示无匹配，建议创建新元模型 |
| 元模型过期 | 标注过期警告，建议审核更新 |

## 与其他 Skill 的关系

| Skill | 关系 |
|-------|------|
| `/plan-writer` | 下游消费者，生成方案时引用元模型 |
| `/spec-writer` | 下游消费者，设计产品时参考模块和流程 |
| `/requirements` | 并行，需求分析时可参考元模型判断需求合理性 |
