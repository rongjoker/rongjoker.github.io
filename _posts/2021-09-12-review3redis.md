---
layout: post
title: 温故知新之Redis
---

## 为什么要用Redis

1. Redis 可以做缓存，减轻数据库的压力,哪怕一个简单的String类型，也可以通过将复杂对象json化进行缓存来实现快速存取
2. Redis计数器可以分配自定义ID，比如订单ID之类;hash之类也可以快速进行计数
3. Redis做分布式锁
4. 一些比较简单的场景，Redis可以做队列使用


## 基础数据结构
1. string,由simple dynamic string实现，内部结构有点像ArrayList
2. list,类似LinkedList，双向链表，经常用来做异步队列或者栈，底层是用ziplist实现的quicklist，多个ziplist通过双向指针串起来使用
3. hash，类似hashmap，不同在rehash，渐进式rehash会在rehash的同时，保留新旧两个hash结构，查询时会同时查询两个hash结构，然后在后续的定时任务以及hash操作指令中，循环渐进地将旧hash的内容一点点地迁到新的hash结构中。当搬迁完成了，就会使用新的hash结构取而代之。当hash移除最后一个元素后，该数据结构自动删除，内存被回收。
4. zset类似sortedSet和HashMap的结合，能保证value唯一，又赋予每个value一个score，作为排序的权重，内部用skiplist实现
5.  位图 setbin命令实现，bitcount计算范围，bitpos查找指定范围的第一个0或者1，比如可以用bitcount统计用户一共签了多少天，通过bitpos指令用户从哪一天开始第一次签到


## Redis 和DB 双写一致性



## 布隆过滤器 vs guava
bf.add/bf.madd 增加一个/多个 或者bf.exists/bf.mexists 判断一个/多个
布隆过滤器可以检查值是 “可能在集合中” 还是 “绝对不在集合中”，提供 K 个不同的哈希函数，并将结果位置上对应位的值置为 “1”
传统的布隆过滤器并不支持删除操作。但是名为 Counting Bloom filter 的变种可以用来测试元素计数个数是否绝对小于某个阈值，它支持元素删除。
案例:垃圾邮件过滤，爬虫判断已经爬过的网站等等

## 限流
利用zset可以做滑动窗口进行限流，value填毫秒时间戳,利用pipeline进行批量计算，配合过期时间。同一个用户的同一种行为放在一个zset里。<br>
高级限流：漏斗限流,4.0开始，通过Redis-Cell实现了漏斗算法

## GeoHash 与ES的 geohash
geohash 将二维的经纬度数据映射到一维的证书，这样所有的元素都挂在一条线上，距离靠近的二维坐标映射到一维后点与点的距离也更近。内部利用zset实现，本质是skiplist<br>
es 提供了两种类型的地理数据，分别是基于经纬度的geo_point数据类型 和 基于GeoJson的geo_shape数据类型，并且geo_shape数据类型支持点、线、圆、多边形、多多边形等复杂的地理形状。geo_shape有点过于复杂，它支持很多较复杂的地理形状。距离查询:
```
GET location/_search
{
  "query": {
    "geo_distance": {
      "distance": "5km",
      "locationStr": "40.174697,116.5864"
    }
  },
  "sort": [
    {
      "_geo_distance": {
        "locationStr": "40.174697,116.5864",
        "order": "asc",
        "unit": "km",
        "distance_type": "plane"
      }
    }
  ]
}

```





## 热Key和大Key
1. 缓存穿透:数据库没有,缓存没有<br>
Spring-boot最新默认cache即支持空对象,为空则保存org.springframework.cache.support.NullValue
2. 缓存击穿:数据库有,缓存没有(并发情况下恶劣影响)
3. 缓存雪崩:大量缓存同时失效,db面临同时大量请求涌入
4.热key:<br>
其实热key问题说来也很简单，就是瞬间有几十万的请求去访问redis上某个固定的key，从而压垮缓存服务的情情况。 其实生活中也是有不少这样的例子。比如XX明星结婚。那么关于XX明星的Key就会瞬间增大，就会出现热数据问题。
以xy苹果助手为例子，热词有三种，像"微信"，"微博"，"QQ"，"支付宝"之类，是可以预知的热点数据；第二种是xy苹果助手引流推广的APP或者关键词，比如有段时间一元夺宝类app很火，公司快速制作了xy夺宝，首页重点推荐xy,再比如公司15年上市后大力推广全民奇迹，一度很火爆，这类主动引流的数据通常都是热点数据，qps很高；第三类是不可预知，但是可以通过类似日志分析统计出来的热词，用时间滑动窗口的的方式计算出最近一段时间最热的搜索词。这三类热点数据都会放入本地cache，并有轮询线程定时更新，避免了经过redis。
登录 redis-cli 命令行，输入monitor，即可进入到 redis 监控模式。


## 队列与ACK以及kafka的优势
Redis做队列，不具备ack，不适合对数据具有极高要求的场景

## 分布式锁的方案
Redis分布式锁通过setnx(set if not exists)来占位，使用完调用del释放，利用过期避免del未被调用出现锁不释放的情况,redis新版本通过设置set指令扩展参数，使得setnx和expir可以一起执行，彻底解决了非原子性引发的各种问题。<br>
但是随之有另外一个问题，任务没有在过期时间内执行完，锁被其他线程占用。解决方案有2：<br>
1. 避免分布式锁用于长任务
2.  添加随机数进行验证，删除必须同样的随机数才可以，否则只能等待系统过期时间。查询和删除通过Lua脚本来保证原子性


## Redis 分布式性能的设计

## 一致性Hash


>http://bos.itdks.com/b2c20ce5c11940b6b0a4e98547f67664.pdf

> https://database.51cto.com/art/202101/641019.htm
> https://blog.csdn.net/SnailMann/article/details/94724197
> https://www.zhihu.com/question/370950509/answer/1958141987


