# Aditou

响应式练习系统首版，按 `PRD/` 的产品／技术文档和 `UI_Design/atelier-bilingue/` 的界面方向实现。界面支持法语、英语、西班牙文和简体中文切换，题目内容单独支持 fr-CA、en-CA；界面语言与题库语言筛选独立。

## 已部署资源

- 网站：https://entryexam.polluxbao.workers.dev
- Worker：`entryexam`
- D1：`entryexam-db`，ID `68644aee-ac1c-4c46-aaa1-89af71a66c4d`
- 私有 R2：`entryexam-storage`
- 初始管理员：`admin@gmail.com`；初始密码为用户指定值。可在「Mon compte」修改密码；修改后撤销该账户全部会话。

## 已实现

- 成人邮箱／学生学习别名登录，学生与家长注册，管理员创建教师和学生。服务端固定角色，浏览器不能自行成为教师／管理员。
- Web Crypto PBKDF2-SHA256（100,000 次、每账户随机盐）存储密码。随机会话令牌仅向浏览器发送 HttpOnly / Secure / SameSite=Lax Cookie，数据库仅保存令牌摘要；会话有效期 7 天。登录尝试限流、同源写操作校验。
- 独立 learner ID、班级和报名关系。管理员管理全站；教师只管理自己任教班级的名册、作业、课堂与提交。当前部署是一个机构工作空间。
- 原始四册 200 道逻辑题已整理为 400 个可用的英法语版本，按申请进入 1–4 年级分别归类，每个年级每种语言 50 题；另保留 16 个入门练习呈现版本。教师稿、评分标准和旧草稿版本保留。听力关联、独立阅读正文、绘画／操作题及数值评分已适配网页；开放题需人工确认。
- 题库检索、年级／语言／能力／状态筛选、创建、审核、发布、归档。编辑创建新版本，作业、课次和答题快照保留旧版本。
- 选择题、数字、文字、画板／照片、排序、多选、配对、观察与口答记录。数字／选择／排序／配对由服务端判分；开放题待人工确认。人工评分支持 0／1／2 分。
- 学生自主练习、作业、加入课堂、设备本地草稿和持久化答题历史。私人练习不出现在教师／管理员的教学结果接口中。
- 作业选题、选择顺序、发布到指定班级、建议完成日期、进度和人工批改。
- 教师课堂：亲读文本、开答／关答、隐藏学生文字、公布参考答案、新轮次、下一题、结束、投影视图。学生提交和教师看板通过 D1 落盘、2.5 秒轮询更新；同一学生同一轮次唯一提交，重复 request_id 不新增记录。关答／切轮与提交通过数据库条件写入核对。
- 教师按题录音、停止、试听、重录、文件导入、上传 R2、草稿审核发布与撤回。默认不申请学生麦克风、不录制整堂课。录音最长 5 分钟，文件最大 20 MiB；支持浏览器可用的 WebM／MP4／Ogg，支持导入 MP3／WAV。
- Cloudflare AI Gateway TTS 适配器、按脚本／声音／版本缓存、私有 R2 存储与音频发布。学生只访问发布音频。服务端只合成已保存题目的朗读稿，答案不拼入音频。
- 家长专属一次性邀请（7 天有效），机构线下核验后发放；学生身份不重建。家长能查看已绑定孩子的历史并对私人开放题填写明确标注的家长观察。付款不授予监护关系。
- 按场景和语言筛选记录，待评单独显示，导出 JSON。报告只表达练习结果，不预测录取。
- 手机、Pad、桌面端适配；PWA manifest 与 SVG 图标。不缓存离线答案，也不提供离线提交。

## 本地开发

需要 Node.js 22+。依赖通过 `package-lock.json` 锁定。

```sh
npm ci
npx wrangler d1 migrations apply entryexam-db --local
npm run build
npx wrangler dev --port 8787
```

访问 `http://localhost:8787`。修改前端时，另一终端可运行 `npm run dev`，Vite 把 `/api` 代理到 8787。

```sh
npm test
node tests/browser.mjs
npm audit
```

API 测试必须针对本地数据库：会创建专用测试账号、班级和题目。`tests/production-smoke.mjs` 是线上专用冒烟测试，不运行破坏性的题库测试；临时测试音频会明确删除。

## TTS · Cloudflare AI Gateway

按用户选择，使用 Cloudflare AI Gateway，替代原技术文档中推荐的 Azure Speech。无需单独的 Azure / xAI 密钥，也没有在代码中保存 Cloudflare API Token。

`wrangler.jsonc` 使用原生 `AI` 绑定，通过 `AI.run()` 调用 Gateway 多语言 TTS 模型。配置：

```json
{
  "ai": { "binding": "AI" },
  "vars": {
    "TTS_GATEWAY_ID": "default",
    "TTS_MODEL": "xai/grok-tts",
    "TTS_VOICE": "ara"
  }
}
```

- 网关：账户的 `default` AI Gateway，推理通过 Cloudflare 账户结算。
- 模型：`xai/grok-tts`，语音 `ara`，输入语言 `fr` / `en`，输出 MP3 24 kHz / 64 kbps。题目保留 `fr-CA` / `en-CA` 内容标记，但不宣称生成语音已经过加拿大口音认证。
- 仅合成已保存且授权的题目朗读稿，不接收任意儿童输入文本，不发送答题记录或学生姓名。
- Gateway 请求关闭内容日志（`collectLog:false`）；请求元数据只有应用名和题目语言。
- 缓存键包含题目 ID、不可变版本、脚本、模型、声音、语言、输出格式。D1 合成租约避免重复点击产生并发合成；R2 持久缓存避免重复计费。
- 模型结果的临时 HTTPS 音频在服务器验证后复制到私有 `entryexam-storage`。学生播放的是本站受控 API，不是第三方临时链接。
- 音频元数据保存供应商、模型、语音、语言与 SHA-256；生成后是草稿，试听后发布。
- 进入「Studio audio」，选择题目 → 生成 TTS → 试听 → 发布。余额或生成错误明确显示，不静默更换声音。
- 真实 FR / EN 生成与浏览器 MP3 解码检查：`node tests/tts-live.mjs`（会产生少量真实合成调用，保留草稿供教师听审）。

实现依据：[Cloudflare TTS 模型](https://developers.cloudflare.com/ai/models/xai/grok-tts/)、[AI Gateway REST API](https://developers.cloudflare.com/ai-gateway/usage/rest-api/)。

## 部署

```sh
npx wrangler whoami
npm run build
npx wrangler d1 migrations apply entryexam-db --remote
npx wrangler deploy
node tests/production-smoke.mjs
```

`migrations/0002_seed.sql` 已应用到正式数据库，不要重新生成后重跑既有迁移。`scripts/seed.py` 仅用于重建全新环境的初始数据；它会随机生成初始管理员盐。后续内容或结构变更使用新的迁移。

## 与完整 PRD 的剩余差异

本次交付是可以运行和试用的核心首版，不代表完整商业化／大班容量验收：

1. Cloudflare AI Gateway 已接入并验证英法语真实合成、R2 存储与缓存；初始合成音频保留为草稿待教师听审。语音使用通用 fr / en，不宣称已认证为加拿大法语／英语口音。教师音频上传／发布链路和正式 R2 上传读取已验证。
2. 共享听力／阅读短文已关联到每道适用题目，但还不是独立 passage 资产。听力题的 TTS 含短文两遍，独立阅读的 TTS 只读组织指令。音素合成题要求真人示范／教师录音；其他 TTS 按需生成，不能替代教师对发音与课堂实施的听审。
3. 当前仅有一个机构工作空间；未实现多机构租户、跨机构身份合并、机构退出／历史许可策略、精细能力角色与离职撤权工作流。教师班级隔离和家庭私人记录隔离已经实现。
4. 课堂采用 D1 条件写入与轮询，未使用技术文档规划的 Durable Objects / WebSocket、音频同步、Queues 发件箱与补偿投影。不承诺大型班级容量与低延迟同步。
5. 尚未接入 Stripe 支付、机构订阅、家庭套餐与权益账本；不显示虚假购买成功或收费入口。已发布入门题目前为免费范围。
6. 认证为应用会话与标准 PBKDF2 密码存储，尚未接入文档建议的托管 OIDC、联系邮箱验证、密码找回、管理员 MFA。家长关系依赖机构人工核验及单独邀请。
7. 录音当前支持重录，不包含服务端转码、自动敏感声音识别、剪辑或格式兼容性真机全覆盖。上传检查大小、允许格式及文件签名，不等于完整媒体内容审查。
8. 作业当前直接向整班发布；未实现草稿／定时发布／指定学生、内容授权到期、提醒、错题变式推荐、完整笔记与学习事件分析。统计是可筛选事实记录和计数，不是能力预测。
9. 浏览器已验证桌面／Pad／手机尺寸；iPhone／iPad 实体设备的麦克风、音频切后台与 PWA 安装尚需设备验收。

界面没有放置没有后端能力的付费按钮或伪造学习记录。相关验证见 `artifacts/VALIDATION.md`。

## 界面国际化（i18n）

界面使用 `i18next` / `react-i18next`，英法资源分别位于 `src/locales/en.json` 和 `src/locales/fr.json`。右上角语言选择在登录、注册和各角色工作区均可用；选择保存到 `entryexam.ui-language`，刷新、重新登录和导航后仍然生效。文档 `lang`、页面描述、日期、复数、辅助标签和服务端错误提示随语言切换。

界面语言与题目内容语言独立。切换界面不重置当前页面、表单、音频状态或学生作答；在练习库、题目编辑、作业和课程的语言筛选中另选 fr-CA / en-CA。题干、教师原稿、用户自定义标题、反馈和学习者姓名保留原内容，不做运行时自动翻译。内置能力分类标签提供英法对应显示，筛选值保持原值。

验证命令：

```sh
node --test tests/i18n.test.mjs
node tests/i18n-browser.mjs
node tests/i18n-roles-browser.mjs
node tests/i18n-production.mjs
```

前两个浏览器集成脚本针对本地 8790 端口（可用 `BASE_URL` 指定本地端口），会创建本地测试数据。正式环境脚本只登录、查看、切换语言和打开表单，不保存或修改生产业务数据。结果记录见 `artifacts/i18n-production.json`。

## Studio 工作区

`/org/main/manage/studio` 使用左右两栏：完整题目清单（关键词、年级、内容语言、状态筛选）与题目文本／音频编辑区。清单默认显示非归档版本，也可查看全部或归档版本。

可编辑标题、学生可见文本、朗读稿和教师备注。保存创建新题目版本；生成或上传前自动保存尚未保存的修改，音频与对应版本关联。未保存内容切题有确认，录音和操作期间锁定选择。

新增 `question_tts_settings`（迁移 `0006`），按题目保存模型与声线。可选 `xai/grok-tts`（Ara、Eve、Rex、Sal、Leo）或 `@cf/myshell-ai/melotts`（标准声线），均经 Cloudflare AI Gateway。服务端验证模型／声线白名单，不接受任意供应商请求。重新生成建立新的音频草稿，跳过 Gateway 缓存；相同 request_id 重试不重复生成，原音频继续保留。

验证：`tests/studio-browser.mjs`（本地编辑、筛选、版本关联、模拟麦克风、上传、真实 UI 合成、双语和三种尺寸）、`tests/studio-api.test.mjs`（设置权限与白名单）、`tests/studio-tts-live.mjs`（真实模型输出、重试、旧音频保留与解码）。实际 iPhone／iPad 麦克风和音频体验仍需设备验证。

## 公共首页与认证路由

- `/`：按 `UI_Design/stitch_entryexam/` 实现的英法营销首页，登录后访问也保持公共首页。
- `/login`：登录页面。
- `/signup`：学生／家长注册页面；`?role=parent` 可预选家长。
- `/learn`、`/family`、`/org/main/manage/*`：受保护工作区，未登录会带 `next` 返回目标跳转登录。角色默认入口分别为学生 `/learn`、家长 `/family`、机构／教师 `/org/main/manage/bank`。

营销、认证和工作区共用 i18n 语言偏好。首页的“试一试”仅在当前浏览器展示数字题反馈，不保存学习记录。首页及登录／注册标题栏的所有入口均指向真实页面／章节。

路由与公开界面验证：`tests/marketing.test.mjs`；浏览器验证：`BASE_URL=http://localhost:8793 node tests/marketing-browser.mjs`。脚本在本地检查注册学生／家长的成功入口；在正式地址运行时不注册账户、不修改题目，只检查公开页、登录、工作区返回与响应式界面。

## Aditou 工作区外壳

产品名称统一为 Aditou；营销、认证、工作区、页面元信息与 PWA 显示同步更新，现有 Worker／数据库／代码目录名称保持技术标识。工作区标题栏桌面 56px、手机 52px，不再显示旧品牌副标题。头像菜单包含 Settings／Logout（法语 Paramètres／Déconnexion），支持键盘、Esc 与外部点击关闭。退出只撤销当前会话。

桌面左侧菜单固定于标题栏下，按可视高度显示，并在必要时独立滚动；右侧仍按文档滚动。窄屏菜单转为标题栏下固定的横向导航。检查：`BASE_URL=http://localhost:8794 node tests/dashboard-shell-browser.mjs`；线上同一脚本可用正式 `BASE_URL` 运行，仅登录／查看／退出，不修改业务内容。


## 学生答题模式（迁移 0007）

`/learn` 的品牌、主导航、语言与账户菜单合并为单一固定标题栏，窄屏主导航用带可访问名称的图标呈现。

- 练习：选择单题进入，逐题 Submit 立即反馈；开放题保留人工确认状态。
- 应试：在练习库筛选后点击 Start exam，使用当前筛选的 1–80 道同一语言题目组成试卷。Next 仅保存草稿；题号及 Previous 可返回修改。最后一题提交整套后才判分、锁定，并提供成绩与只读回看。开放题单独显示待确认，不能算作错误或已评分题。
- 作业：从作业卡片进入一份持久化整套草稿，Next／Previous／题号支持修改。答完全部题目后提交并锁定，所有题型交由教师批改；整套所有题目批改完成前，学生／家长接口均不返回成绩、反馈或参考答案。完成后整套发布成绩。

`assessment_runs` 保存题目版本快照与状态，`assessment_run_answers` 保存草稿；revision 条件写入与 D1 原子批次保护并发保存及最终提交。重复整套提交不新增 attempts。教师通过现有作业批改界面按题批改。账户内历史可继续未提交草稿或回看已提交的试卷与作业。

答案输入框自动聚焦。数字题在输入框按 Enter 提交／下一步；文本题 Enter 继续、Shift + Enter 换行；练习反馈后的 Continue 自动聚焦且与 Submit 同侧。选择、配对、排序题支持标准 Tab／方向键操作，绘画题可用文字代答。

题目右上角耳机按钮提供阅读提示与播放控制。自动播放偏好按账户保存在本机；新题优先使用已发布的教师录制／上传音频，然后使用已发布 TTS，没有可用音频时通过 Cloudflare AI Gateway 按已保存朗读稿生成 TTS 并存入 R2。学生无法指定任意合成文本、模型或声线。Studio 手动生成仍为草稿；学习时按需生成的回退 TTS 自动可播放。浏览器阻止自动播放时，界面提示点击 Listen 开启。

本地验证（隔离数据库，不对正式库运行数据夹具）：

```sh
npx wrangler d1 migrations apply entryexam-db --local --persist-to .wrangler/learning-test
npm run build
npx wrangler dev --port 8795 --persist-to .wrangler/learning-test
BASE_URL=http://localhost:8795 npm test
BASE_URL=http://localhost:8795 node tests/learning-browser.mjs
```

浏览器测试验证 320／390／820／1440 视口、双语、键盘连续练习、教师音频优先与真实 Gateway TTS 回退、试卷草稿回改、整套提交与作业成绩隐藏。真实 iPhone／iPad 自动播放策略仍需实体设备验收。

## Marketing 页登录状态

公开页标题栏通过同源 `/api/auth/me` 恢复现有会话，登录用户显示头像及 Dashboard／Settings／Logout 菜单，隐藏标题栏登录／注册按钮。Dashboard 与 Settings 根据管理员／教师／学生／家长角色进入对应工作区；退出调用服务端撤销会话并恢复访客按钮。页面恢复或重新获得焦点时更新状态，网络临时故障不清除已识别的登录状态。菜单完整支持英法切换及键盘操作。

验证：`tests/marketing-session-browser.mjs`（本地四种角色，线上管理员／教师／学生；不修改业务记录），以及原 `tests/marketing-browser.mjs` 回归。


## 按入学年级导入资料题目（0008）

来源 `Docs/Exam/小学一／二／三／四年级_入学模拟题_英法双语_50题.md`。这里的年级是“申请进入的年级”：一年级卷适用于通常正读幼儿园的孩子，四年级卷适用于通常正读三年级的孩子。每册 50 个逻辑题，英法各一版，共 200 题／400 版。

生成脚本 `python3 scripts/import_exam.py` 产生版本化迁移 `0008_exam_content.sql` 与来源 SHA-256 报告 `artifacts/exam-import-report.json`。新增 `preparation`（给成人的材料准备说明）和 `audio_policy`。不改写旧 seed，不更新历史题目正文；原始草稿有新版本后标为 retired。发现相同逻辑题已有教师创建的新版本时跳过，避免覆盖人工工作。

适配包括：36 个听力题语言版本关联完整短文，42 个独立阅读题版本补正文；行内填空保留，纸质作答横线由网页输入框替代。仅 92 个单一数值题版本自动评分；解释过程、多项答案、绘画、观察与开放题保留人工评分与原始参考标准。两版一年级 Q22 不使用 TTS 发音素，需成人示范或发布教师录音。材料准备在学生题面可展开“给成人”说明，且不加入 TTS。

验证：`python3 tests/exam_import_test.py`；最新本地迁移后 `BASE_URL=http://localhost:8796 npm test`；`BASE_URL=http://localhost:8796 node tests/exam-content-browser.mjs`。后者也可指定正式 BASE_URL，只登录、查看和退出本次会话，不提交答案或创建题目。

## 统一 Skill 分类（0009）

`src/data/skills.json` 定义 23 个教学能力分类与 1 个通用备用分类，英法名称均为短语，不含年级、题号或题目标题。`src/data/question-skills.json` 逐题指定四册 200 个逻辑题及 8 个入门题的主要分类；两种内容语言及各历史版本共用分类 ID。逐题审核表见 `docs/skill-classification.md`。

迁移 `0009_canonical_skills.sql` 只更新题目的 `module` 分类元数据，不改变年级、题干、答案、版本、音频或作答记录。筛选项按分类 ID 去重，标签随界面语言切换；题目编辑器使用统一分类选项，服务端也规范化分类。旧试卷快照的模块名按逻辑题号映射，仍可正确显示新的能力名称。题目语言标签显示 English／French（法语界面为 Anglais／Français），内部内容语种编码仍为 en-CA／fr-CA。

验证：`tests/skills.test.mjs` 检查双语完整、分类唯一、208 个逻辑题覆盖和迁移不改变内容；`tests/skills-browser.mjs` 逐项检查筛选结果、跨语种选择、菜单去重及手机／Pad／桌面布局。复现分类迁移与审核表：`python3 scripts/classify_skills.py`。

## 考试退出、空白题与提交确认

考试草稿提供 Exit exam；返回工作区也进入同一确认流程。可选择 Submit（立即提交并查看成绩）、Save and exit（保存当前答案，保留草稿供以后继续）、Keep working（取消退出）。最后一题的 Submit 及键盘 Enter 都先打开确认框，明确提交后不可修改。

考试允许未访问／未作答题目随整卷提交；弹窗显示空白题数量及零分提醒，空白的开放题也直接记 0 分，不转入人工待评。空白题不阻止末题 Submit。服务端为全部题目创建锁定的提交记录，缺少草稿答案时使用空答案，重复提交仍保持幂等。作业模式继续要求答完全部题目。

英法文案、原生模态焦点限制、Escape 取消和移动布局已实现。检查：`tests/exam-exit-browser.mjs`、`tests/answers.test.mjs` 及 `tests/assessment-api.test.mjs`。

`tests/exam-exit-browser.mjs` 若指定正式 BASE_URL，会创建独立临时 QA 账户和试卷用于真实验收，并生成 `artifacts/exam-exit-production-cleanup.sql`；验收后须通过 `wrangler d1 execute entryexam-db --remote --file artifacts/exam-exit-production-cleanup.sql` 清理本次创建的数据。

## 答题页视口排版与全屏

学生答题工作区按 `100dvh` 占用当前浏览器可用高度，压缩页边距、标题、题目元信息和表单高度，答题时隐藏页脚。考试／作业横屏为左题号、右题目与作答；竖屏题号在上方。小屏或低高度设备默认折叠题号，可展开后跳题；长题号列表在区域内滚动。长阅读、多选项或已提交参考答案在各自内容区域内保留滚动，避免截断正文，输入与上一题／下一题／提交区域保持可见，页面外层不滚动。

学生顶部全屏按钮调用浏览器 Fullscreen API（含 WebKit 兼容分支），并监听全屏状态变化；按钮再次点击退出，浏览器外部退出时同步图标。布局随实际视口方向变化，支持英法提示；不支持该 API 的浏览器会显示说明，不伪造浏览器全屏。

验证：`tests/answer-layout-browser.mjs`，覆盖 80 题试卷、长篇阅读、只读成绩、练习反馈、横竖屏与全屏进入／退出。手机浏览器软键盘与 iPhone／iPad 实机全屏支持仍以实际浏览器能力为准。

正式环境运行布局验收会使用临时 QA 账户，脚本输出 `artifacts/answer-layout-production-cleanup.sql`；完成后用 `wrangler d1 execute entryexam-db --remote --file artifacts/answer-layout-production-cleanup.sql` 清理本次生成的账户、试卷、草稿和作答。

## Exam02 新题库（0010）

来源 `Docs/Exam/Exam02` 四份 Markdown 表格，共 203 道原始模拟题：进入一年级 50 题，进入二／三／四年级各 51 题。按源内容入库，法语 179 题、英语 24 题（各年级英语 6 题），不是每题机械复制为两种语言。入学政策、日期、名额与参考录取分段不作为题目或系统承诺导入。

`python3 scripts/import_exam02.py` 生成 `0010_exam02_questions.sql`、来源哈希／数量报告 `artifacts/exam02-import-report.json` 与逐题审核表 `docs/exam02-classification.md`。固定 source/task IDs 保证重复导入幂等，只新增数据。题目标题带 Exam02 和源题号，可在题库搜索 Exam02 后结合年级、语种、skill 筛选。

数据已适配：76 单选、2 多选、5 排序、56 数值、2 绘画、62 文字／人工评分题；包括完整阅读正文、仅在语音中出现的听力短文、隐藏目标词的听写、选项与答案映射、中文纸卷占位说明转换、成人材料准备及写作评分要点。读听材料不交叉泄露，音素题需成人声音或教师录音。TTS 保持按需生成，未批量消耗 203 次合成。

原稿的 1／4／5 分权重及写作评分要点保留在教师备注，系统仍使用既有 0–2 分制。三年级原稿声明总分 55，但 51 题中两道各 4 分应合计 57；该不一致已列入报告，未当作系统总分。面积／质量／单位转换沿用稳定的 measurement skill ID，其英法名称统一拓宽为 Measurement and units／Mesures et unités。

旧资料已移动至 `Docs/Exam/Exam01`，旧导入与分类脚本兼容该目录。检查命令：`python3 tests/exam02_import_test.py`、`BASE_URL=http://localhost:8798 node --test tests/exam02-api.test.mjs`、`BASE_URL=http://localhost:8798 node tests/exam02-browser.mjs`。浏览器脚本在正式环境仅登录／查看／退出，不提交答案或创建记录。

## 注册验证与 Resend 邮件（2026-11-03）

正式站点为 https://aditou.studyai.now。与 StudyAI.now 共用 Resend 组织及已验证的 `studyai.now` 域名；Aditou 使用独立、限定域名的 sending-only Worker secret `RESEND_API_KEY`，不修改原站密钥。发件人为 `Aditou <aditou@studyai.now>`，回复地址 `studyainow@mail.com`。

- 新邮箱密码注册须先验证邮箱，再登录；验证链接 24 小时有效，重发后旧链接失效。Google 已验证邮箱沿用 OAuth 登录。
- `/verify-email`：点击邮件链接后的显式确认页；打开页面不会自动消耗链接。
- `/resend-verification`：重发尚未完成的注册验证。
- `/forgot-password`、`/reset-password`：找回密码；重置链接 30 分钟有效，用后失效，并撤销所有旧会话和其他重置链接。
- 欢迎邮件在账号激活后发送；密码重置后发送安全通知。原有账户可继续使用，不会因迁移被强制停用。
- 五种模板 × 英语／法语／西班牙语／中文已发布在 Resend Templates：verification、welcome、password-reset、progress、notification。运行时按 `aditou-<type>-<fr|en|es|zh>` alias 使用已发布版本。
- 进度提醒遵照用户决定只备模板，不配置 cron、自动提醒或群发。

邮件模板预览和 Resend ID 清单位于 `artifacts/email-templates/`。修改代码模板后运行 `node scripts/export-email-templates.mjs`；如需同步 Resend，操作人员临时设置 `RESEND_SETUP_API_KEY`，再运行 `node scripts/sync-email-templates.mjs`。管理密钥不用于 Worker；发布模板需要管理权限，生产发信只使用受限密钥。直接在 Resend 修改内容后须发布新版本；保留 `USER_NAME`、`ACTION_URL`、`MESSAGE` 变量，认证链接必须使用 Aditou HTTPS 域名。

数据库迁移为 `0012_email_auth.sql`。验证／重置原始 token 不写入账号数据库、邮件审计或前端存储；URL fragment 在页面载入后移除。发送审计的 `accepted` 表示 Resend 接受，不代表进入主收件箱。匿名请求按 IP 和邮箱限流。

验证：`node --test tests/email-auth.test.mjs tests/google-oauth.test.mjs tests/marketing.test.mjs tests/i18n.test.mjs tests/answers.test.mjs tests/skills.test.mjs`；`node tests/email-auth-browser.mjs` 检查生产页面但通过网络拦截模拟发信，不创建账户。真实收件验收记录见 `artifacts/EMAIL_AUTH_VALIDATION_2026-11-03.md`。旧 API 场景中直接注册即登录的前提已被邮箱激活流程替代。

### 注册流程更新（2026-11-03）

`/signup` 现在只收集姓名、邮箱和 Teacher／Student 角色，不在此页收集密码或选择工作区。验证邮件链接打开双密码设置页；两次密码匹配后才激活账号。Google 注册同步采用角色卡片选择，已有账号角色不改变；既有 Parent 账号仍可登录。

公开注册的教师只管理自己的内容，并可在后台 My account → My organization 创建机构资料。机构资料绑定创建者；此功能不包含机构多人邀请或组织级管理员授权。数据库迁移 `0013_signup_password_setup.sql` 支持新流程。界面与验收记录见 `docs/plans/2026-11-03-signup-password-role-design.md`。历史文档中“注册时填写密码、公开注册 Parent”的描述已被本节替代。

### 四种界面语言（2026-11-03）

语言选择器按顺序使用语言原文名称：English、Français、Español、中文。系统界面支持这四种语言。右上角语言选择实时更新公开页面、注册登录、账号恢复、教师／管理员／学生／家长后台、弹窗和错误提示，并保存偏好供刷新和再次访问使用。新增资源文件为 `src/locales/es.json` 和 `src/locales/zh.json`，与原有资源保持完整键及插值参数一致；中文采用简体，文档语言为 `zh-CN`。

界面语言与题目语种完全独立。学生习题语言单独保存于 `aditou.exercise-language`；切换界面不会重新选择题目语言。题库原有法语／英语标题、正文、脚本、选项、答案、解析及教师笔记均保留原文。邮件模板现已支持同样四种语言，详见下一节。

验证：`node --test tests/i18n.test.mjs tests/marketing.test.mjs`；`BASE_URL=https://aditou.studyai.now node tests/i18n-four-languages-browser.mjs` 在生产静态页面上使用模拟 API 数据检查全部角色、各后台页面、打开中的弹窗、错误、偏好持久化和题目内容隔离，不写入生产数据。`python3 scripts/check-question-content.py` 只读比对 1,019 条生产题目／版本的内容摘要；摘要相同。将来题库有正常编辑后，此历史摘要可能发生变化，应结合实际编辑记录判断。

### 四种邮件语言与原文语言名称（2026-11-03）

五种邮件的 20 个版本均已发布到 Resend，运行时使用已发布 alias。`accounts.preferred_locale` 保存已登录用户的界面语言；历史 `email_locale` 字段保留兼容。迁移 `0014_email_languages.sql` 已应用，注册记录、Google OAuth state 和重置 token 均保留语言。邮件链接附带 `?lang=`，使验证／设置密码／重置密码页面与邮件语言一致。题目内容不变。

验证邮件、激活欢迎邮件、找回密码及密码变更通知按用户所选语言发送。进度提醒仅提供模板，没有 cron 或自动发送。所有语言选择器（含紧凑模式）显示 English、Français、Español、中文，不再显示缩写。

生产版本：`48261dcb-068f-4681-8eec-d57cd4a69c68`。21 项针对性测试通过；浏览器验证包含西班牙文／中文注册、验证、密码找回、语言偏好同步、模板预览及 320／390px 语言选择器布局。真实西班牙文和中文找回密码邮件发送到自有测试邮箱，Resend 均确认 delivered，记录见 `artifacts/email-languages-production-delivery.json`；未做本轮收件箱界面验收，也未完成密码重置。用于模板发布的临时管理密钥已撤销并删除本地临时文件，Worker 继续使用原有限定发送密钥。

### Admin 用户与组织管理（2026-11-03）

Admin 后台增加 Users 与 Organization 入口：服务器分页（每页 25 条），顶部搜索、角色／负责人及账号状态筛选。用户支持编辑姓名、停用／恢复；组织支持编辑名称。停用会撤销用户会话并阻止后续访问；不能停用自身。服务端独立校验管理员角色，不向列表返回密码、盐或 token。四种界面语言均支持。`admin@gmail.com` 已核对为 admin，无需修改角色。

迁移 `0015_admin_directory.sql` 已应用，版本 `f90e3b5a-80a4-4f3f-828b-21cc682198e1` 已部署。构建、22 项针对性测试、四种语言的列表浏览器检查通过；浏览器 API 使用模拟数据，真实匿名请求确认返回 401，未编辑或停用真实用户。详见 `docs/plans/2026-11-03-admin-directory-design.md`、`artifacts/admin-directory-browser-validation.json`。

### 赞助入口（2026-11-03）

公开顶部导航增加赞助入口，四种语言随界面切换；中文弹窗标题为“支持 Aditou ☕ 我会更优秀！”。复用 StudyAI 微信／支付宝二维码和 2／5／10 美元一次性 Stripe 收款。`/api/support/checkout` 服务端调用 StudyAI 现有接口，不复制密钥；支付确认／取消继续使用 StudyAI 现有页面，弹窗已说明。现有 StudyAI 收款归因保持不变，不单独记录 Aditou 来源。不会自动弹出或发起付款。

验证脚本：`node --test tests/support.test.mjs tests/i18n.test.mjs tests/marketing.test.mjs tests/signup-roles.test.mjs`、`node tests/support-browser.mjs`。浏览器测试通过模拟失败响应验证四种语言、四种宽度及二维码加载；真实 checkout 验证仅创建待支付会话，不提交付款。设计记录：`docs/plans/2026-11-03-support-coffee-design.md`。

赞助最终部署版本：`703f436e-2af9-4df4-9b4a-0baa7a927677`。共享收款通过 `STUDYAI` → `studyainow-web` 内部服务连接，正式 Aditou 接口验证记录见 `artifacts/support-production-checkout.json`。
