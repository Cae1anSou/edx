# NeoEdx v1 未决问题与关键假设（Open Questions & Assumptions）

> 目的：集中管理 v1 必须拍板的产品/领域语义问题与关键假设，避免在第二步设计与重写阶段反复返工。  
> 决策人（DRI）：CaelanSou  
> 范围：v1 MVP（见 `neoEdx/06_v1_Scope_and_MVP.md`），并与领域契约/事件/状态机/NFR 对齐（见 `neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`、`neoEdx/10_v1_State_Machines.md`、`neoEdx/12_v1_NFR_and_SLOs.md`）。

## 1. 使用方式

- 所有“影响跨域契约/事件/状态机”的问题必须记录在这里，并在解决后同步更新相关文档。
- 每条问题都要有：决策人（CaelanSou）、截止日期、影响范围、状态（Open/Decided/Deferred）。
- 若问题决定会改变范围（Scope），必须同步更新 `neoEdx/06_v1_Scope_and_MVP.md`。

## 2. v1 关键假设（Assumptions）

| ID | 假设 | 理由 | 风险 | 验证方式 | 状态 | 决策人 |
|----|------|------|------|----------|------|--------|
| A-01 | v1 以“可交付闭环”优先，允许功能简化（题型/运营/治理） | 缩短交付周期 | 需求回流导致范围膨胀 | 评审 v1 非目标清单 | Open | CaelanSou |
| A-02 | v1 允许跨域最终一致（分钟级） | 降低分布式耦合 | 用户对“延迟生效”不接受 | 关键旅程演示 + SLO 验证 | Open | CaelanSou |
| A-03 | v1 讨论只支持发帖/回复，治理/举报流程延期 | MVP 优先 | 社区风险与合规压力 | 运营策略与人工兜底 | Open | CaelanSou |
| A-04 | v1 不做退款闭环（或仅做最小退款语义） | 避免复杂权益回收 | 商业投诉/合规风险 | 业务政策确认 | Open | CaelanSou |

## 3. v1 未决问题（Open Questions）

> 建议在第二步启动前（或 M0 结束前）至少决策 Q-01 ~ Q-10。

| ID | 问题 | 选项（示例） | 建议默认 | 影响文档/域 | 截止日期 | 状态 | 决策人 |
|----|------|--------------|----------|-------------|----------|------|--------|
| Q-01 | v1 支持的评估题型范围？ | 仅客观题 / 客观+主观各一种 | 客观+主观各一种 | PRD、Grades、Content、StateMachines | TBD | Decided | CaelanSou |
| Q-02 | "通过条件"最小口径？ | 百分比阈值 / 必做项 / 组合策略 | 百分比阈值（70分通过） | Grades、Certificates、PolicyRefs | TBD | Decided | CaelanSou |
| Q-03 | 证书生成触发策略？ | 实时同步 / 异步批处理 / 人工触发 | 异步触发（事件驱动） | Certificates、Events、NFR | TBD | Decided | CaelanSou |
| Q-04 | v1 是否必须支持第三方登录？ | 必须 / 可选 / 不做 | 可选（默认不做） | Identity、Platform、API Surface | TBD | Decided | CaelanSou |
| Q-05 | v1 商业模式与报名模式语义？ | audit/paid 两档 / 多档 | 两档（audit/paid） | Commerce、Enrollment、EligibilityInput | TBD | Decided | CaelanSou |
| Q-06 | "可见/可报名/可学习"冲突处理优先级？ | 以 Enrollment 判定为准 / 以 Course 窗口为准 | Catalog 判定可见，Enrollment 判定访问 | Contracts、StateMachines | TBD | Decided | CaelanSou |
| Q-07 | 学习进度口径（什么算完成）？ | 访问即完成 / 完成度阈值 / 题目完成 | 访问记录 + 完成度百分比（课程配置） | Content、Reporting、Grades | TBD | Decided | CaelanSou |
| Q-08 | 导出报表范围与权限？ | 仅课程 staff / 增加组织管理员 | 仅课程 staff | Reporting、Identity、API Surface | TBD | Decided | CaelanSou |
| Q-09 | 通知渠道 v1 最小集合？ | 仅站内 / 站内+邮件 | 仅站内（邮件 v2） | Notifications、NFR、Events | TBD | Decided | CaelanSou |
| Q-10 | 邮箱验证是否强制？ | 强制验证后可登录 / 可登录但限制关键操作 | 强制验证后可登录 | Identity、Enrollment | TBD | Decided | CaelanSou |
| Q-11 | v1 是否需要最小合规路径（导出/删除）？ | 必须 / 不做但预留 | 不做但预留 | Support、Platform、NFR | TBD | Decided | CaelanSou |
| Q-12 | 讨论访问规则（未报名可看/不可发）？ | 未报名可看不可发 / 必须报名才可看 | 必须报名后可见/可发 | Discussion、Enrollment、API Surface | TBD | Decided | CaelanSou |

## 4. 已决策记录（Decision Log）

> 解决问题后，在这里记录“决策本身”，并把对应 Q 的状态改为 Decided，同时更新受影响文档。

| Decision ID | 关联问题 | 决策 | 决策理由（1-2 句） | 影响范围 | 日期 | 决策人 |
|-------------|----------|------|--------------------|----------|------|--------|
| D-001 | Q-01 | 客观+主观各至少一种（选择题+简答题） | v1 需覆盖评分场景，简化题库管理复杂度 | Grades、Content、StateMachines | 2026-01-18 | CaelanSou |
| D-002 | Q-02 | 百分比阈值（70分为通过线） | 直观易懂，与现有 Open edX 默认行为对齐 | Grades、Certificates、PolicyRefs | 2026-01-18 | CaelanSou |
| D-003 | Q-03 | 同步触发 | 对应领域可以用高性能语言实现，上层调用时使用虚拟线程或者协程 | Certificates、Events、NFR | 2026-01-18 | CaelanSou |
| D-004 | Q-04 | 不做，保留扩展点，写上TODO | 降低 v1 集成复杂度，后续可按需接入 | Identity、Platform、API Surface | 2026-01-18 | CaelanSou |
| D-005 | Q-05 | 两档（audit=旁听/无证，paid=付费/有证） | 简化商业逻辑，语义清晰便于用户理解 | Commerce、Enrollment、EligibilityInput | 2026-01-18 | CaelanSou |
| D-006 | Q-06 | 可见性归属 Catalog，访问权限归属 Enrollment | 职责分离，Catalog 负责展示策略，Enrollment 负责用户-课程关联 | Contracts、StateMachines | 2026-01-18 | CaelanSou |
| D-007 | Q-07 | 访问即记录 + 完成度百分比（课程配置阈值） | 兼顾学习追踪与灵活性，教师可配置"完成"标准 | Content、Reporting、Grades | 2026-01-18 | CaelanSou |
| D-008 | Q-08 | 仅课程 staff（教师/助教/课程管理员） | 权限最小化，避免数据泄露风险 | Reporting、Identity、API Surface | 2026-01-18 | CaelanSou |
| D-009 | Q-09 | 站内通知,邮件放在v2中 | v1 最小覆盖 | Notifications、NFR、Events | 2026-01-18 | CaelanSou |
| D-010 | Q-10 | 强制验证后才可登录（未验证限制关键操作） | 防止垃圾账户，提升平台治理基础 | Identity、Enrollment | 2026-01-18 | CaelanSou |
| D-011 | Q-11 | 不做但预留（数据模型支持后续扩展） | v1 聚焦核心闭环，合规能力后续迭代 | Support、Platform、NFR | 2026-01-18 | CaelanSou |
| D-012 | Q-12 | 必须报名后才可发帖/查看讨论内容 | 简化权限模型，避免未报名用户灌水 | Discussion、Enrollment、API Surface | 2026-01-18 | CaelanSou |

## 5. 变更联动清单（必须同步更新）

当 Q-01 ~ Q-12 有任何一条变为 Decided，至少检查并可能需要更新：

- `neoEdx/06_v1_Scope_and_MVP.md`
- `neoEdx/07_Domain_Contracts_v1.md`
- `neoEdx/08_v1_Data_Ownership_and_Keys.md`
- `neoEdx/09_v1_Event_Schemas.md`
- `neoEdx/10_v1_State_Machines.md`
- `neoEdx/11_v1_API_Surface.md`
- `neoEdx/12_v1_NFR_and_SLOs.md`

---

*文档版本：1.0*
*v1 未决问题与关键假设（DRI：CaelanSou）*
