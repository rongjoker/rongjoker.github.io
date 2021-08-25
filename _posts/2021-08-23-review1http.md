---
layout: post
title: 温故知新之HTTP
---


### HTTP与复用

通常的认知里，http是无状态的，可以看作短连接。可是在http1.1发布之初(1996年6月)即支持长连接（PersistentConnection）和请求的流水线（Pipelining），
2.0更是直接支持了复用。

> https://www.ianlewis.org/ 此网站使用了h2协议


> 《图解HTTP》


