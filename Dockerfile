# 使用较小的 Node.js 镜像（Debian slim 基础镜像）
FROM node:22-slim

# 设置容器内的工作目录
WORKDIR /usr/src/app/webshot

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装 Node.js 依赖
RUN npm install

# 复制应用程序源代码到工作目录
COPY . .

# Expose 命令用于声明容器将监听的网络端口
EXPOSE 3030

# 更新包列表、安装 Chromium 和字体，并清理缓存
RUN apt-get update && \
    apt-get install -y chromium fonts-noto fonts-wqy-zenhei && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置环境变量
ENV LANG=zh_CN.UTF-8
ENV LC_ALL=zh_CN.UTF-8

# 启动 Node.js 应用
CMD ["node", "app.js"]
