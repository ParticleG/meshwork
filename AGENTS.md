# AGENTS.md

## Stack

Vue 3 + Quasar 2 (beta `@quasar/app-vite` 2.0.0-beta.14) + Pinia + Excalibur.js game engine, built as a **PWA**.

## Commands

```bash
pnpm i                  # install (shamefully-hoist, see .npmrc)
pnpm run dev             # quasar dev -m pwa (opens browser)
pnpm run build           # quasar build -m pwa → dist/pwa
pnpm run lint            # eslint --ext .js,.ts,.vue ./
pnpm run format          # prettier
```

- Package manager is **pnpm** (declared in `packageManager` field and CI). Do not use npm/yarn.
- No tests exist (`test` script is a no-op).

## Path Aliases

Defined in both `tsconfig.json` and `quasar.config.ts`:

| Alias | Path |
|-------|------|
| `css/*` | `src/css/*` |
| `constants/*` | `src/constants/*` |
| `types/*` | `src/types/*` |
| `utils/*` | `src/utils/*` |
| `assets/*` | `src/assets/*` |
| `boot/*` | `src/boot/*` |
| `components/*` | `src/components/*` |
| `layouts/*` | `src/layouts/*` |
| `pages/*` | `src/pages/*` |
| `stores/*` | `src/stores/*` |

Use bare alias imports (e.g., `import x from 'types/Foo'`), not `@/` or `src/`.

## Boot Files

Loaded in order: `axios`, `bus`, `i18n`, `manager` (skin loader for Excalibur).

## Key Directories

- `src/ruleset/` — game rules/logic
- `src/types/` — includes `SkinManager` and game-related types
- `src-pwa/` — PWA service worker config (Workbox GenerateSW mode)

## Build Quirks

- `DEPLOY_GITHUB_PAGE=true` triggers post-build path rewriting for GitHub Pages (relative manifest and sw.js paths).
- Router uses **hash mode**.
- Vite `base` is `/meshwork/` when deploying to GitHub Pages, `/` otherwise.

## Style

- Prettier: single quotes, semicolons.
- ESLint: `plugin:@typescript-eslint/recommended` + `plugin:vue/vue3-essential` + prettier.
- Target: ES2022, browser baseline Chrome/Firefox 115, Safari 14.

---

## 项目详细分析（供后续开发参考）

### 项目用途

Meshwork 是一个**方块堆叠拼图游戏**（Stacking Puzzle），基于 Excalibur.js 引擎在 `<canvas>` 上渲染，外壳为 Quasar PWA。当前处于**早期原型**阶段。

### 完整文件结构

```
src/
├── App.vue                         # 根组件，仅包含 <router-view />
├── env.d.ts                        # NodeJS.ProcessEnv 类型声明
├── shims-vue.d.ts                  # *.vue 模块声明
├── quasar.d.ts                     # Quasar 全局类型增强
│
├── boot/                           # Quasar 启动序列（app 挂载前执行）
│   ├── axios.ts                    # [1] 注册 $axios/$api 全局属性（baseURL: api.example.com 占位）
│   ├── bus.ts                      # [2] 创建 EventBus<{drawer}>，注册 $bus 全局属性
│   ├── i18n.ts                     # [3] vue-i18n Composition API 模式，默认 en-US
│   └── manager.ts                  # [4] 异步加载 crystal 皮肤到 skinManager 单例
│
├── constants/
│   └── common.ts                   # EDGE_LENGTH = 50（画布上每格像素尺寸）
│
├── css/
│   ├── app.scss                    # 全局样式占位（空）
│   └── quasar.variables.scss       # Quasar SCSS 主题变量（primary #1976d2）
│
├── i18n/
│   ├── index.ts                    # 聚合语言包 → { 'en-US': enUS }
│   └── en-US/index.ts              # 当前唯一语言包，键：layouts.drawers.LeftMainDrawer.navigations.dashboard
│
├── router/
│   ├── index.ts                    # Vue Router 工厂（hash 模式）
│   └── routes.ts                   # 路由表：'' → /dashboard，/:catchAll → 404
│
├── stores/
│   ├── index.ts                    # Pinia 工厂 + persistedstate 插件（自动持久化，key 前缀 meshwork.*）
│   ├── store-flag.d.ts             # Quasar 特性标记：声明 store 已启用
│   └── example-store.ts            # 占位 counter store（state/getter/action 示例）
│
├── assets/
│   ├── quasar-logo-vertical.svg    # 框架 logo（未在游戏中使用）
│   └── skin/
│       ├── crystal.png             # 精灵图：8列 × 3行 = 24帧，每帧 30×30px
│       └── crystal.json            # 皮肤元数据：{ column:8, count:24, edgeLength:30 }
│
├── layouts/
│   ├── MainLayout.vue              # 壳层：监听 bus 'drawer' 事件，渲染命名 router-view
│   ├── headers/MainHeader.vue      # q-header 工具栏，汉堡按钮触发 bus 'drawer' 事件
│   └── drawers/LeftMainDrawer.vue  # q-drawer 导航列表（dashboard 链接），使用 i18n
│
├── pages/
│   ├── DashboardPage.vue           # 游戏主页：挂载 Excalibur Engine 到 <canvas>，含缩放滑块和调试按钮
│   └── ErrorNotFound.vue           # 404 页面
│
├── components/
│   └── .gitkeep                    # 空目录，尚无可复用组件
│
├── types/                          # 游戏核心领域模型 + Excalibur Actor 子类
│   ├── common.ts                   # BinaryPosition, TernaryPosition, Direction 枚举; HandlerResult, HandlerBase 基类
│   ├── SkinManager/
│   │   ├── types.ts                # SkinData 接口（src, column, count, edgeLength）
│   │   └── index.ts                # SkinManager 类（Map<name, SpriteSheet>），导出全局单例 skinManager
│   ├── item/
│   │   ├── types.ts                # Cell, FaceData<T>（持有 Excalibur Sprite）, RenderingFaces<T>（附加 BinaryPosition）
│   │   └── index.ts                # FaceGroupActor extends Actor — 可操控棋子，WASD 移动，GraphicsGroup 渲染
│   ├── container/
│   │   ├── types.ts                # ModifyHandlerType 枚举, PositionedFace, ModifyHandler, Field(3D数组), Frame(2D数组)
│   │   └── index.ts                # FrameActor extends Actor — 10×20 游戏面板，insert/extract + handler 管道
│   ├── Player/
│   │   └── index.ts                # Player 类 — 持有 FaceGroupActor[] 和 FrameActor[]（存根，WIP）
│   └── InteractionManager/
│       ├── types.ts                # KeyEventType 枚举（Hold/Press/Release）; 注释中规划了完整交互类型
│       └── index.ts                # InteractionManager — 包装 Excalibur InputHost，路由键盘事件到 KeyHandler 管道
│
├── ruleset/
│   └── stacking/
│       └── interaction.ts          # stacking 模式按键处理器（当前仅 console.log 占位）
│
└── src-pwa/
    ├── manifest.json               # PWA 清单：name="Meshwork", 横屏, entertainment/games 分类
    ├── register-service-worker.ts  # Workbox GenerateSW 注册（回调均为空）
    └── custom-service-worker.ts    # InjectManifest 模板（precache + NavigationRoute 回退）
```

### 设计理念

#### 1. 中间件管道模式（Handler Pipeline）

核心抽象位于 `types/common.ts` 的 `HandlerBase`：

- 每个 Handler 有 `priority` 字段，按优先级排序执行
- 返回 `HandlerResult`（枚举）控制链式流转：继续 / 中断 / 跳过
- **输入管道**：`InteractionManager` 将键盘事件分发到 `KeyHandler[]` 链
- **面板操作管道**：`FrameActor` 的 insert/extract 通过 `ModifyHandler[]` 链处理

这一设计允许不同游戏模式（`ruleset/`）以插件方式注入规则，无需修改引擎核心。

#### 2. 皮肤系统（SkinManager）

- `SkinManager` 是全局单例，在 boot 阶段异步预加载
- 皮肤 = Excalibur `ImageSource` → `SpriteSheet.fromImageSource`
- `FaceData` 构造时通过 `(skinName, spriteIndex)` 获取精灵引用
- 当前只有 `crystal` 一套皮肤，架构已支持多皮肤扩展

#### 3. Excalibur 嵌入方式

- `DashboardPage.vue` 的 `onMounted` 中创建 `Engine`，绑定到 `<canvas>` 元素
- 使用 `DisplayMode.FillContainer` 自适应容器
- `fixedUpdateFps: 1000`（高频更新，适合精确输入响应）
- Actor 的 `update()` 中每帧重建 `GraphicsGroup`（当前无优化）
- Quasar `q-slider` 控制缩放比例（25%–100%），直接设置 Actor 的 `scale` 属性

#### 4. 规划中的交互体系

`InteractionManager/types.ts` 注释中透露了完整操作设计：

| 操作类型 | 说明 |
|---------|------|
| Move | 移动棋子 |
| Rotate CW/CCW/Half | 顺时针/逆时针/180度旋转 |
| Flip H/V | 水平/垂直翻转 |
| Merge / Split | 合并/拆分棋子 |
| Swap / Switch | 交换/切换 |
| Aim / UseProp | 瞄准/使用道具 |

这远超经典俄罗斯方块的操作复杂度，暗示游戏目标是一个**高自由度的方块操控玩法**。

#### 5. 数据流总览

```
Boot 序列（顺序执行）
  axios → bus(EventBus) → i18n(vue-i18n) → manager(异步加载皮肤)
                                              ↓
路由                                    skinManager 就绪
  / → MainLayout                              ↓
    └── /dashboard → DashboardPage      onMounted: new Engine()
                                          ├── FrameActor（面板，10×20 格）
                                          ├── FaceGroupActor（棋子）
                                          └── InteractionManager（输入）
UI 通信
  MainHeader ──bus.emit('drawer')──→ MainLayout ──prop──→ LeftMainDrawer

Store
  Pinia + persistedstate → localStorage (meshwork.*)
  当前仅 example-store（占位），游戏状态尚未接入 store
```

### 当前开发状态

| 模块 | 状态 |
|------|------|
| 皮肤系统 | ✅ 可用（crystal 皮肤） |
| 面板渲染（FrameActor） | ✅ 可用（10×20，支持 insert/extract） |
| 棋子渲染（FaceGroupActor） | ✅ 可用（硬编码 S/Z 形状，WASD 移动） |
| 输入管理（InteractionManager） | ⚠️ 框架就绪，handler 为占位 |
| 游戏规则（ruleset/stacking） | ⚠️ 仅有 console.log 占位 |
| Player 系统 | ⚠️ 存根，无实际逻辑 |
| 多皮肤 | 🔲 架构支持，未实现 |
| Store 持久化游戏状态 | 🔲 插件就绪，未接入游戏数据 |
| i18n 多语言 | 🔲 仅 en-US |
| 可复用组件 | 🔲 components/ 为空 |
