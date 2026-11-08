# Vendored skill explorer host

## 来源与授权

- 原包：`@linxin666/dsh-client-ui-skill-explorer`，版本 `0.4.8`。
- 上游仓库：<https://github.com/zhu1090093659/dsh-web>。
- `host.js` 为该版本发布包的 `lib/index.js` 原样副本，未修改。
- `client-source.js` 为同一版本发布包的 `lib/client.js` 固定副本，保留原始版权与许可证。构建时由我方适配器移除独立挂载、head 样式注入和遥测入口，替换原列表为统一分类技能视图；原行操作、创建、导入、编辑功能仍来自上游。生产客户端包含这些 BSD-3-Clause 派生代码。
- `LICENSE` 为原发布包的 BSD-3-Clause 许可证原样副本。Copyright (c) 2026, zhu1090093659。所有版权、再分发条件和免责声明均保留；外层项目许可证不取代该许可证。
- 再分发源码或二进制时须随包保留本许可证及声明；不得借原作者或贡献者名义背书。
- host SHA-256：`83cde7ad23ddd3b62dc5ff7b848e952f84ff2a6c693901e53b6f85df3e048b3b`。

## 集成与生命周期

我方入口合并原 host 的 `webServer`、`skills`、`sessions` 依赖，并只调用一次其导出 `apply(ctx, config)`；分类服务仍使用独立的 `skill_categories` storage domain 和原有 schema。原 host 的路由访问校验、全局单实例 guard、`ctx.effect` 清理逻辑均未修改。

部署时必须先禁用原技能中心插件，再激活集成版，避免重复路由与旧界面同时存在。原 host guard 使用原包全局标识，仍然保持跨副本单实例语义；这不代替部署禁用步骤。无需修改原 profile 或已安装包文件。

可选配置 `customSkillDirs`、`dshHome`、`agentsHome` 与 `enabled` 直接传递给原 host（`enabled: false` 只关闭 explorer host，不改变分类存储）。默认路径/可编辑技能文件/用户触发的导入、切换与删除行为仍与原版本相同；provider-file 开关仍是原 host 的面板本地状态，不代表模型全局停用。

## 外联审阅

已检查原 host 完整文件：仅导入 Node 内置模块，未发现遥测、分析 SDK、HTTP 客户端、`fetch` 调用或主动外联。出现的 `http://` 字符串用于请求 Host/URL 解析校验，不发起网络请求。此结论仅针对这里保留的 host，不对未随本目录分发的上游 client 作保证。
