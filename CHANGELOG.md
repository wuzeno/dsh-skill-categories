# Changelog

## 0.4.0 — Preview

- 将分类整理与原技能列表合为一个「技能」页，保留创建、导入和按需编辑页签。
- 保留原文件／提供者目录，包括禁用技能及不同路径的同名副本。
- 增加统一分类、标签与原生筛选；隐藏或折叠后的勾选项不参与批量归类。
- 沿用导入后归类、外部新增目录检测和当前会话「分类引用」。
- 保留上游 BSD-3-Clause 归因，补充源码构建、双语文档与图片来源说明。

English summary: one unified skill-management view with categories, tags and native filters; file/provider rows remain authoritative. Import-time classification and session-scoped reference insertion are retained. Documentation includes licensing and explicit verification limits.

Validation: 80 automated tests passed locally during development. Standalone fixture checks and an active host plugin are not a complete authenticated-host acceptance test. See [VALIDATION.md](VALIDATION.md).

This changelog describes the prepared source version, not proof that a remote GitHub release or npm publication exists.
