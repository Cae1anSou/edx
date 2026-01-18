# NeoEdx 行为覆盖矩阵（Behavior Coverage Matrix）

> 目的：把“端到端行为”映射到“领域边界（Bounded Context）”，并明确关键状态/不变量、跨域依赖与事件，作为第二步（新实现设计）的输入与范围控制工具。  
> 原则：行为优先、边界清晰、避免实现细节与技术选型。

## 1. 使用方式

- 这是“覆盖与对齐”文档：用于检查 PRD 是否遗漏关键行为、Domain Map 是否存在边界冲突，以及 v1 范围是否可交付。
- 每个行为必须归属一个主领域（Owner Domain）；其他领域仅能通过公开能力/公开视图参与（参见 `neoEdx/02_Domain_Map.md`）。
- v1 仅选择最小可闭环（发现→报名→学习→评估→成绩→证书→通知/支持），其余标记 Deferred。

## 2. 角色（Actors）

- 学习者（Learner）
- 课程创作者（Author）
- 教学团队（Instructor/Staff/Grader）
- 运营/管理员（Admin/Operator）
- 客服/治理人员（Support/Trust）
- 外部系统（IdP / Payment / Messaging / Storage / Credit Provider / Proctoring）

## 3. 领域速查（Owner Domains）

以 `neoEdx/02_Domain_Map.md` 为准：

- Identity（用户域）
- Catalog（目录发现域）
- Course（课程域）
- Content（内容域）
- Enrollment（注册域）
- Commerce（商业域）
- Cohorts（分组域）
- Discussion（讨论域）
- Notifications（通知域）
- Teams（团队域）
- Grades（成绩域）
- Certificates（证书域）
- Reporting（报表分析域）
- Integrity（诚信监考域）
- Support（支持治理域）
- Programs（项目路径域）
- Credit（学分域）
- Platform（平台域）

## 4. 端到端旅程（E2E Journeys）

### J1：发现与决策（Discover → Decide）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J1-01 | 学习者在未登录/已登录状态下搜索并筛选课程；结果仅包含对该学习者可见的条目 | Catalog | Course(只读), Commerce(只读), Platform(只读) | 不变量：不可见课程不得出现在结果中；目录条目必须可追溯到来源对象 | CatalogEntryPublished/Updated | P0 | In |
| J1-02 | 学习者查看课程详情与权益说明（价格/证书权益/开始结束等），并理解是否可报名 | Catalog | Course(只读), Commerce(只读), Enrollment(只读) | 不变量：详情展示与实际可报名资格不矛盾（允许提示“资格不足/已结束”） | — | P0 | In |
| J1-03 | 运营配置类目/专题集合页并排序，发布后对学习者可见（按发布规则） | Catalog | Platform(命令) | 状态：草稿/已发布；不变量：变更留痕 | CatalogCollectionPublished | P1 | Deferred |

### J2：账号与身份（Register/Login → Session）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J2-01 | 访客注册账户并完成邮箱验证；账户进入可登录状态 | Identity | Notifications(命令) | 状态：未验证/已验证/停用；不变量：邮箱唯一 | UserRegistered, UserVerified | P0 | In |
| J2-02 | 用户使用本地凭证或第三方身份提供商登录；获得会话并按权限访问资源 | Identity | Platform(只读) | 不变量：未授权资源必须拒绝；会话可撤销/过期（策略待定） | UserAuthenticated | P0 | In |
| J2-03 | 用户发起密码重置并完成更新；旧凭证失效（语义） | Identity | Notifications(命令) | 不变量：重置链路可追溯、防滥用 | PasswordResetRequested/Completed | P0 | In |

### J3：报名与权益（Enroll → Entitle）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J3-01 | 学习者免费报名旁听模式；获得内容访问资格 | Enrollment | Course(只读) | 状态：未报名/已报名/退课；不变量：不可对已关闭课程报名（按课程规则） | EnrollmentChanged | P0 | In |
| J3-02 | 学习者付费购买并获得相应注册模式权益（如可拿证书）；支付成功后报名/升级生效 | Commerce | Enrollment(命令), Course(只读), Identity(只读) | 不变量：权益变化可追溯到订单；支付失败不应产生权益 | OrderPaid, EntitlementGranted, EnrollmentChanged | P0 | In |
| J3-03 | 学习者申请退款；退款成功后权益回收并反映到报名模式/证书资格 | Commerce | Enrollment(命令), Certificates(只读/命令), Support(命令，可选) | 不变量：退款政策可执行且留痕；已发证的处理有明确规则 | RefundApproved/Completed, EntitlementRevoked | P1 | Deferred |
| J3-04 | 管理员批量注册学员；产出批量结果与失败原因 | Enrollment | Identity(只读), Course(只读) | 不变量：批量操作可回放/可追溯 | BulkEnrollmentCompleted | P1 | Deferred |

### J4：学习与进度（Learn → Track）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J4-01 | 已报名学习者进入课程并按结构导航学习内容；系统记录学习进度 | Content | Enrollment(只读), Identity(只读), Course(只读) | 不变量：未报名不可访问受限内容；进度记录与内容版本关联（语义） | ContentAccessed, ProgressUpdated | P0 | In |
| J4-02 | 课程设置先修条件/解锁规则；学习者达到条件后内容自动解锁 | Grades | Content(只读), Enrollment(只读) | 不变量：解锁基于可复现的成绩/完成状态 | PrerequisiteSatisfied | P1 | Deferred |
| J4-03 | 分组开启后，学习者在内容/讨论中体验按 cohort 切分的版本或可见范围 | Cohorts | Content(命令/只读), Discussion(命令/只读) | 不变量：同一学员在同一课程的分组归属明确；切分生效点可追溯 | CohortChanged | P1 | Deferred |

### J5：提交与评分（Submit → Grade）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J5-01 | 学习者提交测验/作业答案；系统记录提交并触发评分 | Grades | Enrollment(只读), Content(只读) | 不变量：提交引用“当时可见内容版本/快照”；提交不可抵赖（审计语义） | SubmissionReceived | P0 | In |
| J5-02 | 系统对客观题自动评分并产出分数；学习者可查看结果 | Grades | Content(只读) | 不变量：同一提交的评分可复现；评分规则可追溯到课程策略版本 | GradeCalculated | P0 | In |
| J5-03 | 教学团队对主观题批改并给出反馈；成绩变更可追溯到批改人 | Grades | Identity(只读), Content(只读) | 不变量：批改权限明确；变更留痕 | GradeOverridden/Adjusted | P0 | In |
| J5-04 | 成绩政策与例外：延期/宽限期/补交/补考等在成绩与资格上生效 | Grades | Course(只读), Enrollment(只读), Support(命令，可选) | 不变量：例外必须有原因与授权人；对证书资格影响可解释 | GradePolicyExceptionGranted | P1 | Deferred |
| J5-05 | 学习者发起成绩申诉；流程跟踪与结论可追溯 | Support | Grades(命令/只读) | 状态：新建/处理中/已结案；不变量：申诉与成绩对象强关联 | SupportTicketUpdated | P1 | Deferred |

### J6：证书（Certify → Verify）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J6-01 | 学员达到通过条件后生成证书；证书进入可下载状态 | Certificates | Grades(只读), Enrollment(只读), Identity(只读) | 状态：待生成/可用/撤销；不变量：证书资格判定可复现且可解释 | CertificateStateChanged | P0 | In |
| J6-02 | 第三方通过唯一标识验证证书真伪；验证结果稳定且可追溯 | Certificates | — | 不变量：证书撤销后验证必须反映撤销状态 | CertificateVerified | P0 | In |
| J6-03 | 管理员撤销/补发证书；原因与操作者可追溯 | Certificates | Support(命令，可选), Identity(只读), Notifications(命令) | 不变量：撤销影响对外验证与学员视图一致 | CertificateRevoked/Reissued | P1 | Deferred |

### J7：讨论与学习社区（Discuss → Moderate）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J7-01 | 已报名学习者创建讨论/问答帖并回复；按课程规则可见 | Discussion | Enrollment(只读), Identity(只读), Cohorts(只读，可选) | 不变量：未报名不可发帖（按策略）；删除/隐藏有状态可追溯 | ThreadCreated, CommentCreated | P0 | In |
| J7-02 | 教学团队/治理人员对帖子执行置顶、编辑、删除、隐藏等管理动作 | Discussion | Identity(只读), Support(命令，可选) | 不变量：管理动作留痕；治理与申诉策略一致 | ContentModerated | P1 | Deferred |
| J7-03 | 用户举报不当内容并进入治理流程；结论影响可见性与账号处置（若启用） | Support | Discussion(命令/只读), Identity(命令/只读) | 状态：待审/已处置/申诉中；不变量：证据链完整 | ModerationCaseUpdated | P1 | Deferred |

### J8：通知与沟通（Notify → Preference）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J8-01 | 系统/课程触发通知（成绩发布、证书生成、讨论回复等）；按用户偏好投递 | Notifications | Identity(只读), Grades/Certificates/Discussion(事件输入) | 不变量：通知可追溯；投递失败可重试（语义） | NotificationSent | P0 | In |
| J8-02 | 学员配置通知偏好并对通知标记已读 | Notifications | Identity(只读) | 不变量：偏好是用户可控且可审计（平台可能限制） | NotificationPreferenceChanged | P1 | In |
| J8-03 | 教师对课程学员群发邮件/公告并查看发送摘要 | Notifications | Course(只读), Enrollment(只读), Identity(只读) | 不变量：仅对目标人群发送；支持退订/合规策略（语义） | CourseMessageSent | P1 | Deferred |

### J9：创作与发布（Author → Publish）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J9-01 | 创作者创建课程并配置关键参数（时间、能力开关、团队） | Course | Identity(只读), Platform(只读) | 状态：草稿/已发布/归档；不变量：关键配置变更留痕 | CourseCreated/Updated | P0 | In |
| J9-02 | 创作者编辑课程结构与内容块并发布内容版本 | Content | Course(只读), Identity(只读) | 不变量：发布版本可追溯；已发布版本用于学习与成绩可复现 | ContentPublished | P0 | In |
| J9-03 | 课程发布后进入目录与可报名状态（按可见性与政策） | Course | Catalog(命令), Enrollment(只读) | 不变量：课程“对外可见”与“可报名”是不同概念 | CoursePublished | P0 | In |
| J9-04 | 课程重跑：基于源课程创建新 run，并继承/调整配置与内容 | Course | Content(命令/只读), Catalog(命令) | 不变量：run 间数据隔离（成绩/报名等） | CourseRerunCreated | P1 | Deferred |

### J10：团队协作（Team Up → Collaborate）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J10-01 | 学员在课程内创建/加入团队；团队可配置公开/私密 | Teams | Enrollment(只读), Identity(只读) | 不变量：成员资格与课程绑定；团队权限与可见性可追溯 | TeamCreated, TeamMemberJoined | P1 | Deferred |
| J10-02 | 团队拥有独立讨论区（或讨论空间）用于协作交流 | Teams | Discussion(命令/只读) | 不变量：团队讨论与课程讨论隔离（语义） | TeamDiscussionEnabled | P2 | Deferred |

### J11：监考与诚信（Proctor → Adjudicate）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J11-01 | 对指定考试启用监考；学员开始监考会话并完成身份/环境检查 | Integrity | Enrollment(只读), Identity(只读), Content(只读) | 状态：会话进行中/结束；不变量：证据引用可追溯 | ProctoringSessionStarted/Ended | P1 | Deferred |
| J11-02 | 教师/管理员基于证据做出违规判定；处置通过拥有域执行（成绩无效/禁考等） | Integrity | Grades(命令), Support(命令，可选) | 不变量：判定与处置分离；处置有原因与授权链路 | IntegrityViolationAdjudicated | P1 | Deferred |

### J12：支持、治理与合规（Support → Comply）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J12-01 | 学员提交支持工单（访问/支付/成绩等）；客服跟踪并结案 | Support | Identity(只读), Enrollment/Commerce/Grades(只读/命令) | 状态：新建/处理中/已结案；不变量：工单与对象关联明确 | SupportTicketCreated/Updated | P1 | Deferred |
| J12-02 | 用户发起数据导出/删除/匿名化等合规请求；系统执行并留痕 | Support | Identity(命令/只读), Platform(只读) | 不变量：合规请求可审计；执行结果可证明 | ComplianceRequestCompleted | P1 | Deferred |

### J13：报表与分析（Report → Export）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J13-01 | 教师查看课程进度看板（按时间/分组切分） | Reporting | Enrollment(只读), Grades(只读), Cohorts(只读) | 不变量：报表不回写业务真值；口径版本化 | — | P0 | In |
| J13-02 | 教师导出成绩/提交报表；任务可追踪并生成导出结果 | Reporting | Grades(只读), Enrollment(只读), Notifications(命令，可选) | 状态：排队/生成中/完成/失败；不变量：权限范围正确 | ExportJobCreated/Completed | P0 | In |
| J13-03 | 管理员查询审计视图（成绩覆盖、证书撤销、退款、封禁等） | Reporting | Platform(只读), 各域(只读) | 不变量：审计记录不可篡改（语义） | — | P1 | Deferred |

### J14：项目/路径与学分（Program → Credit）

| ID | 行为（Actor/Precondition/Action/Outcome） | Owner Domain | 依赖域（只读/命令） | 关键状态与不变量 | 关键事件 | 优先级 | v1 |
|----|------------------------------------------|--------------|---------------------|------------------|----------|--------|----|
| J14-01 | 运营创建学习项目/路径并绑定课程；对外展示 | Programs | Catalog(命令/只读), Course(只读) | 不变量：项目完成条件可解释 | ProgramPublished | P2 | Deferred |
| J14-02 | 学员满足条件后发起学分申请；生成并投递成绩单到学分提供商 | Credit | Grades(只读), Enrollment(只读), Notifications(命令) | 不变量：申请与资格判定可追溯；投递状态可查 | CreditRequested/Completed | P1 | Deferred |

## 5. v1 最小闭环（建议）

v1 建议覆盖的最小闭环（In）：

- J1（发现 P0）、J2（身份 P0）、J3（免费报名 + 付费购买 P0）、J4（学习/进度 P0）
- J5（提交/评分 P0）、J6（证书 P0）、J7（讨论 P0）、J8（通知 P0）
- J9（创作/发布 P0）、J13（教学看板/导出 P0）

## 6. 关键边界风险清单（在第二步必须显式处理）

- “课程可见” vs “可报名” vs “可学习”：三者语义不同，归属不同域（Catalog/Course/Enrollment/Content），需定义优先级与冲突处理。
- Cohort：分组归属分组域；实验归属实验域；内容/讨论/报表只消费分组结果，避免在各域重复实现“分组逻辑”。
- 报表真值：Reporting 永远不回写成绩真值；成绩变更必须回到 Grades 并留痕。
- 成绩可复现：提交与评分必须引用内容快照/版本，满足申诉与审计需要（参见 `neoEdx/04_ADR.md`）。
- 治理动作：Support 负责编排与留痕，具体业务动作通过拥有域公开能力执行，避免“治理绕过边界”。

---

*文档版本：1.0*
*用于第二步（新实现设计）的范围与边界对齐输入*
