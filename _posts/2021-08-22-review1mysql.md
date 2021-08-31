---
layout: post
title: 温故知新之Mysql
---

## Mysql如何实现事务

这是一个很大的问题。可以从事务的ACID特性的四个角度来分析。



[![hpWHHA.md.png](https://z3.ax1x.com/2021/08/22/hpWHHA.md.png)](https://imgtu.com/i/hpWHHA)




### undo log && MVCC

> https://database.51cto.com/art/202101/641019.htm
> https://blog.csdn.net/SnailMann/article/details/94724197
> https://www.zhihu.com/question/370950509/answer/1958141987


