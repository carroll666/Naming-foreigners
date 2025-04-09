<<<<<<< HEAD
# Naming-foreigners
=======
# 中文名字生成器

这是一个基于英文名生成中文名的Web应用程序。

## 环境变量配置

本应用使用环境变量来存储敏感信息，如API密钥。以下是需要配置的环境变量：

### 本地开发环境

在本地开发环境中，你可以创建一个`.env`文件来存储环境变量：

```
# DeepSeek API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 服务器配置
PORT=3001
```

### Vercel部署环境

在Vercel部署时，你需要在Vercel的项目设置中配置以下环境变量：

1. 登录Vercel账户
2. 进入你的项目
3. 点击「Settings」选项卡
4. 在左侧菜单中选择「Environment Variables」
5. 添加以下环境变量：
   - `DEEPSEEK_API_KEY`: DeepSeek API的密钥
   - `PORT`: 应用程序运行的端口（可选，Vercel通常会自动处理）

## 安装和运行

```bash
# 安装依赖
npm install

# 启动服务器
npm start
```

## 注意事项

- 不要在代码中硬编码任何API密钥或敏感信息
- 确保`.env`文件已添加到`.gitignore`中，避免将敏感信息提交到版本控制系统
- 在生产环境中，始终使用环境变量来存储敏感信息
>>>>>>> master
