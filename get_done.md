# Windows 使用 Docker 部署 DeerFlow 步骤

> 适用场景：你在 Windows 上，不走本机 `make dev`，而是直接用 Docker 跑 DeerFlow。

## 1. 准备配置

先执行：
```bash
make config
```

然后编辑项目根目录下的：
- `config.yaml`：配置模型与服务参数
- `.env`：配置 API Key、代理、其他环境变量

## 2. 配置模型

在 `config.yaml` 里配置你的 OpenAI 兼容模型，例如：
- `use: langchain_openai:ChatOpenAI`
- `model: claude-opus-4-8`
- `base_url: https://api.chaiquan.cc/v1`
- `api_key: $OPENAI_API_KEY`

## 3. 配置 API Key

在 `.env` 里写入对应的环境变量，例如：
```bash
OPENAI_API_KEY=your-api-key-here
```

> 建议把真实 key 放在本地 `.env`，不要直接写死到代码仓库里。

## 4. 启动 Docker Desktop

确认 Windows 已安装并启动 **Docker Desktop**。

如果你网络访问 Docker Hub / GHCR 较慢或失败，先在 Docker Desktop 里配置：
- 镜像加速器 / registry mirrors
- 或代理（如果你本机本来就走代理）

否则 `make docker-start` 可能会因为拉取基础镜像失败而中断。

## 5. 预拉取 sandbox 镜像（可选）

如果你需要 Docker / Container sandbox，可以先执行：
```bash
make docker-init
```

说明：
- 这个命令主要是预拉取 sandbox 镜像
- 如果本地已经有对应镜像，会直接跳过拉取
- 如果你当前是 local sandbox，它可能只做环境提示，不会强制拉镜像

## 6. 启动 Docker 服务

执行：
```bash
make docker-start
```

成功后会看到类似输出：
- Application: `http://localhost:2026`
- API Gateway: `http://localhost:2026/api/*`
- Runtime: Gateway embedded

## 7. 访问网站

浏览器打开：
```text
http://localhost:2026
```

如果你想让局域网其他人访问，通常可以用：
```text
http://你的局域网IP:2026
```
或者：
```text
http://你的域名:2026
```

前提是：
- 你的域名已经解析到这台 Windows 机器
- Windows 防火墙放行了 `2026` 端口
- Docker 已经正常启动并监听该端口

## 8. 常用命令

查看日志：
```bash
make docker-logs
```

停止服务：
```bash
make docker-stop
```

## 9. 不需要做的事

如果你只使用 Docker 模式：
- 不需要执行 `make dev`
- 不需要执行 `make install`
- `make check` 里的 nginx 缺失不影响 Docker 模式启动

## 10. 本次部署的结论

在 Windows 上用 Docker 跑 DeerFlow，核心流程是：

```bash
make config
# 编辑 config.yaml 和 .env
make docker-init
make docker-start
```

然后访问：
```text
http://localhost:2026
```

看日志：make docker-logs
停服务：make docker-stop

如需关闭，执行
```bash
make docker-stop
```
如需重启，执行
```bash
make docker-start
```

## 11. Ubuntu 上使用 Docker 部署 DeerFlow

如果你是在 **Ubuntu / Linux** 上部署，并且希望像上面的 Windows Docker 方案一样直接用 Docker 跑 DeerFlow，可以按下面的方式操作。

### 11.1 准备系统环境

先确保 Ubuntu 已安装并启动 Docker：
- 安装 **Docker Engine** 和 **Docker Compose**
- 确认 Docker 服务已启动
- 当前用户已加入 `docker` 组，避免执行 `docker` / `make docker-start` 时出现权限错误

如果提示无法连接 Docker Daemon，可以执行一次：
```bash
sudo usermod -aG docker $USER
```
然后重新登录当前用户会话。

### 11.2 准备项目配置

进入项目根目录后执行：
```bash
make config
```

然后编辑：
- `config.yaml`：配置模型、sandbox、运行参数
- `.env`：配置 API Key、代理、其他环境变量

如果你打算直接编辑完整模板，也可以参考 `config.example.yaml`。

### 11.3 配置模型与 API Key

和 Windows 一样，推荐使用 OpenAI 兼容接口或你自己的模型服务。例如在 `config.yaml` 里配置：
- `use: langchain_openai:ChatOpenAI`
- `model: 你的模型名`
- `base_url: https://你的兼容接口/v1`
- `api_key: $OPENAI_API_KEY`

并在 `.env` 里写入：
```bash
OPENAI_API_KEY=your-api-key-here
```

如果还需要搜索能力，也可以按 README 的配置补充 `TAVILY_API_KEY` 或其他搜索服务 Key。

### 11.4 启动 Docker 模式

如果你是开发/调试用途，推荐先执行：
```bash
make docker-init
make docker-start
```

说明：
- `make docker-init` 会预拉取 sandbox 镜像，适合第一次启动前执行
- `make docker-start` 会启动 DeerFlow 的 Docker 服务
- 如果 `config.yaml` 里使用的是 provisioner sandbox 模式，`make docker-start` 会按需启动 provisioner

如果你希望以更接近生产的方式运行，则使用：
```bash
make up
```

停止服务使用：
```bash
make down
```

### 11.5 Ubuntu 部署时的补充建议

- Linux + Docker 是官方更推荐的持续运行环境
- 如果网络访问 Docker Hub / GHCR 较慢，可以在启动前设置镜像源或代理
- 如果想加速 Python / Node 依赖下载，可以先导出：
  ```bash
  export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
  export NPM_REGISTRY=https://registry.npmmirror.com
  ```
- 若需要局域网访问，可以像 Windows 一样使用 `http://Ubuntu机器IP:2026`
- 如使用防火墙，请放行 `2026` 端口

### 11.6 Ubuntu 版最简流程

```bash
make config
# 编辑 config.yaml 和 .env
make docker-init
make docker-start
```

访问：
```text
http://localhost:2026
```

如果要停止：
```bash
make docker-stop
```

如果要以生产方式启动：
```bash
make up
```
如需重启，执行
```bash
make docker-start
```
后面不构建执行
```bash
docker compose -p deer-flow-dev -f docker-compose-dev.yaml up -d --no-build
```
# 记录用法更新

已完成这次“模板可选项兜底”改造：把现有两个 agent 模板固化成前端本地模板文件，并让新建页优先从本地模板加载，找不到时再回退后端 agent 查询。这样即使前端暂时看不到模板选择按钮，用户仍可通过 `?template=local-table-processor` 或 `?template=msg-input-logger` 直接按指定模板创建新智能体。

# 命令记录
🚀 最推荐你的方案（稳定）

你刚才的思路其实是对的 👍

👉 直接复用 Windows 构建好的最终镜像

而不是折腾基础镜像 + 构建

✅ 最优方案（强烈建议）
在 Windows：
docker save -o deerflow-final.tar \
  deer-flow-dev-gateway:latest \
  deer-flow-dev-frontend:latest \
  nginx:alpine
在 Ubuntu：
docker load -i deerflow-final.tar

然后跳过 build：

cd docker

docker compose -p deer-flow-dev \
  -f docker-compose-dev.yaml \
  up -d --no-build
❗总结一句话

👉 你说的是对的，但要补一句：

docker-init 不生成镜像
docker-start 第一次才 build 最终镜像（并依赖一堆基础镜像 + 中间镜像）
