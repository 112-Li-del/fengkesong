# 团队仓库 CI 配置

提交到已有 PR 的分支后，点击 GitHub Desktop 的 Push origin，同一个 PR 会重新检查，无需新建 PR。

## GitHub 托管运行器与构建

Code Quality 使用 GitHub 的 ubuntu-latest 运行器，不依赖 Blacksmith 账号。应用构建超时设为 30 分钟。

Build Changed Packages 在 checkout 时取得完整历史，并关闭持久化 Git 凭据；后续比较基线不再需要未认证的私有仓库 fetch。

Knip 使用 actions/setup-node 安装 Node 24，再安装 pnpm。这样复用 GitHub 的工具缓存，避免 pnpm 为解析 Node 大版本额外获取发布索引；冷缓存或依赖下载仍需要网络。

## 可选 Claude 审查

默认不运行 Claude 自动审查。构建、测试、类型检查及 Knip 不受这个开关影响。

以后启用时：

1. 安装 Claude GitHub App，并授权访问本仓库。
2. 在 Settings → Secrets and variables → Actions → Secrets 配置 CLAUDE_CODE_OAUTH_TOKEN。
3. 在同一页面的 Variables 添加 ENABLE_CLAUDE_REVIEW，值为 true。
4. 更新 PR 分支或重新打开 PR，触发审查。外部分支审查使用 main 上的工作流，所以配置变更需要先合并到 main。

删除该变量或将其设为 false 可关闭审查。如果仓库规则把 Claude 审查列为必需检查，管理员需同步调整对应规则，不能用跳过审查代替必需的人工审核。

## 验证与合并

先确认 PR 的 Checks 全部完成且必要检查通过，再查看 Files changed、完成审核并合并。检查失败时，打开对应任务日志，根据第一处失败步骤修复；不要把环境初始化成功误认为应用构建已经成功。
