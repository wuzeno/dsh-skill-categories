# 参与开发 / Contributing

感谢愿意试用或改进这个预览版。小而可复现的问题报告，比没有上下文的整页日志更有帮助。

## 开始之前 / Before changing code

- 阅读 [README](README.md)、[验证边界](VALIDATION.md) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。
- 不要直接编辑 `client.js`：修改 `src/`、样式或构建适配器，再运行构建。
- `vendor/skill-explorer` 固定上游版本。更新它时保留原许可证，检查上游变更，并更新精确锚点测试。
- 分类元数据与技能文件管理是两层功能。不要为整理分类而搬动或改写技能文件。

Read the README, validation notes and third-party notices first. Edit source files rather than generated `client.js`. Upstream updates require license preservation, an adapter review and regression tests. Category operations must remain separate from skill-file operations.

## 本地验证 / Local checks

```sh
pnpm install --frozen-lockfile --ignore-scripts
npm run build
npm run check
npm test
```

可用 `node scripts/preview.mjs` 生成独立示例。示例数据不能代替已登录宿主的真实导入、编辑和持久化测试。提交时说明实际测试的环境，以及未测试的部分。

Use the standalone fixture for UI checks, but do not describe it as host integration testing. Report the environment you actually tested and any remaining gaps.

## 问题与改动 / Issues and changes

请附 DSH 与插件版本、最短复现步骤、预期和实际结果。截图应遮住登录链接、用户名路径和个人内容。不要上传 profile、令牌或技能正文；安全问题请先看 [SECURITY.md](SECURITY.md)。

Include versions, minimal reproduction steps, expected behavior and actual results. Redact personal content and never attach credentials or user profiles. Prefer focused changes with a regression test.

提交代码表示你有权贡献该代码，并同意原创部分按本项目 MIT 许可分发；现有第三方部分仍适用其原有许可。不要求转移版权。

Contribute only code you have the right to share. Original contributions use this project's MIT license; existing third-party code keeps its original terms. No copyright transfer is required.
