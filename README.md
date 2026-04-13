# Magic of Thought

个人技术博客仓库，基于 `Jekyll` 构建并部署在 GitHub Pages。

线上地址：<https://rongjoker.github.io/>

## 项目简介

这个仓库用于维护博客文章与页面模板，内容主要包括：

- 算法与数据结构笔记
- 后端与中间件学习记录
- 工作与成长总结

> 评价一个作家的水平，不光要看他出版了多少书，更要看他纸篓里扔了多少草稿；同样评价一个程序员的水平，不光要看他写了多少项目，更要看他删除了多少代码。  
> 永远相信理性的力量：真理是不言而喻的，真理是经得起推敲的，真理是可以和它的提出者解绑的。

## 技术栈

- `Jekyll 3.8.x`
- `Liquid` 模板
- `Sass` + `Bourbon`
- GitHub Pages（仓库名为 `username.github.io`）

## 目录结构

```text
.
├── _config.yml        # 站点配置
├── _posts/            # 博客文章（YYYY-MM-DD-title.md）
├── _layouts/          # 页面布局模板
├── _includes/         # 可复用页面片段
├── assets/            # 样式、图标等静态资源
├── about.md           # About 页面
├── index.html         # 首页
└── feed.xml           # RSS
```

## 本地开发

### 1) 环境准备

- 安装 Ruby（建议 `2.7+`）
- 安装 Bundler

```bash
gem install bundler
```

### 2) 安装依赖

在仓库根目录执行：

```bash
bundle install
```

### 3) 启动预览

```bash
bundle exec jekyll serve
```

浏览器访问：<http://127.0.0.1:4000/>

## 写作与发布

### 新增文章

1. 在 `_posts/` 下新建文件：`YYYY-MM-DD-your-title.md`
2. 添加 Front Matter，例如：

```yaml
---
layout: post
title: 你的文章标题
---
```

3. 写正文并本地预览

### 发布方式

- 推送到 `master` 分支后，GitHub Pages 会自动构建并发布（通常需要几十秒到几分钟）

## 常见问题

### `bundle` 命令不可用

请确认 Ruby 与 Bundler 已正确安装，并且可执行文件路径已加入系统 `PATH`。

### 本地启动失败（依赖冲突）

可尝试：

```bash
bundle update
```

若仍失败，建议根据本机 Ruby 版本重新生成 `Gemfile.lock`。
