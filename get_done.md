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