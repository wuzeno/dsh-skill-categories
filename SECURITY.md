# 安全说明 / Security

本项目目前为预览版，没有承诺长期支持或响应时限。请使用最新预览版本，重要数据先备份。

This is preview software, without a guaranteed support or response window. Use the latest preview and back up important data.

## 报告问题 / Reporting

不要在公开 Issue 中贴出可利用细节、认证链接、令牌、个人 profile 或未脱敏日志。

如果仓库的 **Security → Report a vulnerability** 可用，请优先使用该私密渠道。若不可用，先发一个不含敏感细节的 Issue 请求建立私密联系方式；不要把秘密附在首条消息里。本项目尚未配置专用安全邮箱。

Do not publish exploit details, authentication links, tokens, profiles or unredacted logs in public issues. Prefer GitHub's private vulnerability reporting if it is enabled. Otherwise open a non-sensitive issue requesting a private contact channel. No dedicated security mailbox is configured yet.

## 边界 / Boundaries

分类与标签只写插件元数据，不替代宿主访问控制，也不限制模型可调用的技能。原技能中心的创建、编辑、导入和删除属于文件操作，应仅对可信技能执行。不要把分类当成执行沙箱或安全许可列表。

Categories are organizational metadata, not an execution sandbox or an allowlist. They do not replace host access controls or restrict model invocation. Native skill management can change files; use it only with trusted content.

分类 API 与原管理路由采用不同的校验路径；上游路由的安全模型被保留，不应把本插件的分类 API 校验宣传成整个技能中心的独立安全审计。

The category API and upstream management routes use distinct admission paths. Retained upstream behavior has not been independently security-audited as a whole.
