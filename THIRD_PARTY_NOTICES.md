# 第三方代码与授权

## @linxin666/dsh-client-ui-skill-explorer 0.4.8

来源：https://github.com/zhu1090093659/dsh-web

版权：Copyright (c) 2026, zhu1090093659。

许可证：BSD-3-Clause。完整条款随 [原许可证](vendor/skill-explorer/LICENSE) 保留；本项目根 MIT 许可证不替代这些条款，也不表示上游作者或贡献者背书。

包含内容：原发布包 lib/index.js 的固定副本 [host.js](vendor/skill-explorer/host.js)，以及 lib/client.js 的固定副本 [client-source.js](vendor/skill-explorer/client-source.js)。原 Host 未修改。

构建期改造：[适配器](scripts/adapt-explorer.mjs) 不执行原客户端遥测/独立挂载代码；样式改由 React 生命周期拥有；保留原技能行、创建/导入/编辑功能，替换列表视图为本项目的分类与技能统一视图，增加分类行和旧分类标签别名。生成的生产客户端含 BSD 派生代码，因此源码、安装包和后续二进制分发都须携带该版权声明、完整许可证与免责声明。

本项目原创分类后端、元数据持久化、统一视图、会话分类引用、适配与测试代码采用根 [MIT 许可证](LICENSE)。

### English summary

This project includes fixed copies of `lib/index.js` and `lib/client.js` from **@linxin666/dsh-client-ui-skill-explorer 0.4.8**, copyright (c) 2026, **zhu1090093659**, under **BSD-3-Clause**. Source: https://github.com/zhu1090093659/dsh-web. The full upstream [license](vendor/skill-explorer/LICENSE), redistribution conditions and disclaimer are retained. The host copy is unmodified. The build-time client adapter replaces the list with the unified view, adds category hooks, owns style lifetime, and excludes upstream telemetry and standalone mounting code. Generated `client.js` contains derived BSD-licensed code.

Original category storage, unified-view, session-reference, adapter and test code uses the root MIT license. MIT does not supersede the upstream license. Distribution of source or generated packages must retain the upstream notice, conditions and disclaimer. No upstream or DeepSeek endorsement is implied. Screenshot provenance and artwork rights are described separately in [docs/IMAGES.md](docs/IMAGES.md).

## 依赖

zod 为运行依赖；React、React DOM 为开发测试与独立预览依赖，生产界面使用宿主提供的 React，不附带独立 React 运行时。依赖由包管理器按各自许可证安装，发布前应按锁文件检查其许可证；不能用本声明替代依赖自身的版权和许可文件。
