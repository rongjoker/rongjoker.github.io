## 我们为什么要造轮子


程序员都喜欢造轮子，我身边的程序员，无论他们用什么语言，java、android、ios、python、go,
甚至是js，都热衷于造轮子。其实用go程序员造轮子我倒是能理解，毕竟很多java转go的朋友经常
吐槽：怎么这个没有，怎么那个没有。但是java程序员为什么要造轮子呢？但凡你能想到的功能，都有足够多
足够成熟的类库给你用，maven在手，天下我有呀。但偏偏java程序员似乎特别喜欢造轮子。比如你在github
搜`netty` ,能搜到无数多的repository，各种基于netty做的小工具，`rpc`,`聊天室`,`ftp服务器`
甚至`servlet服务器`，而且据我观察，相当多的repository已经做到了超越demo、可用的水平。可是，它们是
那么的高度重复，它们在市面上的各种主流中间件面前都无疑是弟中弟。如果只是demo练手就算了，可偏偏
很多repository的时间线一直断断续续延续几个月甚至几年。我们这么多的人，把这么多的精力，消耗在
这些没有实际价值的事情上，是否是一种比不关水龙头、彻夜开空调更可怕的浪费？我的答案是：不是的。
对于一个有追求的程序员，造轮子不但有意义，而且有必要。
### 我的轮子们
--


- 基于netty的一个基于netty的实现了IOC、router的reactor模式的server：[https://github.com/rongjoker/quarantineJ](https://github.com/rongjoker/quarantineJ)
- lucene,solr均可使用的相似度算法plugin：[https://github.com/rongjoker/lucene-similarity-kn](https://github.com/rongjoker/lucene-similarity-kn)
- 可视化的程序员辅助工具：[https://github.com/rongjoker/mazda.atenza](https://github.com/rongjoker/mazda.atenza)
- 切换中文简体和繁体的工具：[https://github.com/rongjoker/civic-switch](https://github.com/rongjoker/civic-switch)

还有其他的一些，我都给删掉了，或者标记为private，我觉得那些是我的纸篓里的草稿:)

