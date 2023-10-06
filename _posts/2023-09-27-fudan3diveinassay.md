---
layout: post
title: 读书在复旦(三):开题之前、重新出发
---

###  难开的开题
6月和9月的窗口依然没有开题。一切没有方向，盲目开题总觉得是浪费机会浪费时间浪费精力。23年8月之前，是相当荒废的半年。<br>
6月配了4070+4k显示器的电脑，成本不菲，可是自此沉迷于游戏3个月，到9月猛然顿悟，卸载游戏，开始学习。<br>
荒芜的几个月，一无所成，思来想去，好像唯一完成的成就居然是看完了`gone with the wind`，50多万字，坚持看完，也算是一项成果吧。<br>
AI的学习上，重新开始后，也算是有些突破，从paddlepaddle到回去pytroch，对cnn网络、rnn的模型原理都有了新的理解。目前再次进展到transformer。在这个十一，准备将ai的实战工作全部完成，这样才能确定一个方向，争取十月里与导师确定论文方向，在开提前完成主要工作，尽量缩短时间。


###  玩心与专注
时间越紧迫，往往越难以专心。<br>
专心，是最重要的。无论是写代码时候听歌，还是边看教程视频边玩魔方，甚至边跑模型，边看电影，都是非常影响专心投入的。做事需要长时间的专注，而非碎片化的上浮下潜。<br>
李沐在`动手学深度学习v2`完结篇的QA里回答时间管理，很受启发，收录如下：
```markdown
    Q: 请问老师平时要在亚马逊工作，业余还要讲课，还要带娃，请问是如何进行时间管理的？
    W: 我就不睡觉。我每天大概睡6个小时、7个小时。不要有别的时间，就是说，娱乐时间不要有了，每天上班8个小时，
    带娃8个小时，2个小时做slide。不要干别的事情了。我有个b站账号，我从来不看视频。我也不看电影，我很多年没
    看过电影了。我听歌都很少。最近在居家，以前开车还能听听歌，现在连歌都不用听了。就是说，你就不要干别的事情，
    你还是可以的。

```


### 实战胜于理论
未来的三个月学习期内，会大量实战AI，在看完`斯坦福21秋季：实用机器学习`之后，进行各种基础的网络任务练习。之后是天池等平台的比赛任务。


### 删减和增加
`gone with the wind`之后，会继续看书，养成看书的习惯是很重要的，因此决定，至少每个月一本原版书。电子的也好，纸质的也罢。<br>
目前在9月底和10月初计划的是看`the shortest history of europe`， 算是对欧洲历史做一个outline的了解。读`gone with the wind`的经验，读故事小说太费时间了，对英语水平和阅读能力效率提升不高。因此会保持看时政经济类的书籍。欧洲史之后会看美国内战历史相关的一本书，在11月完成。同时保持`economist`的阅读。<br>
抄一段`gone with the wind`的句子：
```markdown
    He never really existed at all, except in my imagination.I loved something I made up, something that's just as dead as Melly is. 
    I made a pretty suit of clothes and fell in love with it. And when Ashley came riding along, so handsome, so different, I put that
    suit on hime and made him wear it whether it fitted him or not. And I wouldn't see what he really was. I kept on loving the pretty
    clothes -- and not him at all.

```

### 9月26日
晚上看了`爆裂鼓手`(Whiplash), 封闭叙事，热烈的表达。


### 9月28日
- 用resnet和vit训练fashion-nmset并测试批量infer，单个图片灰阶后shape是`torch.Size([1, 1, 96, 96])` , batch(256)是`torch.Size([256, 1, 96, 96])`
- 用lstm和cnn做imdb的情感分析影评的正负，IMDb评论数据集不是很大，使用在大规模语料库上预训练的文本表示可以减少模型的过拟合。使用预训练的GloVe模型来表示每个词元，并将这些词元表示送入多层双向循环神经网络以获得文本序列表示。然后，通过一个具有两个输出（“积极”和“消极”）的全连接层（self.decoder），将此单一文本表示转换为输出类别。
- cnn做情感分析。我们探讨了使用二维卷积神经网络处理二维图像数据的机制，并将其应用于局部特征，如相邻像素。虽然卷积神经网络最初是为计算机视觉设计的，但它也被广泛用于自然语言处理。简单地说，只要将任何文本序列想象成一维图像即可。图片是三维（rgb三层*行列两维数组），只取灰阶则是两维。文本则相当于只有一行的灰阶图片。通过这种方式，一维卷积神经网络可以处理文本中的局部特征。使用汇聚层从序列表示中提取最大值，作为跨时间步的最重要特征。textCNN中使用的最大时间汇聚层的工作原理类似于一维全局汇聚。输出为self.decoder = nn.Linear(sum(num_channels), 2)两极全连接。


### 9月29日

`Lars Von Trier is never backward in trying out new technique`
<br>
fine tuning bert-small并实现预推理。


### 10月4日
入门hugging-face, 跑通2个模型。

### 10月6日
十一在舟山玩了2天，回来后一直无法投入学习状态。直到6日才进入状态，开始kaggle比赛。<br>
用jupyter写树叶分类，遇到重要难题：<br>

```markdown

RuntimeError: CUDA error: device-side assert triggered Compile with `TORCH_USE_CUDA_DSA` to enable

```

<br>
其实可以通过把代码放进pycharm来快速解决。jupyter debug的能力很差。后续应该用pycharm跑通代码，然后用jupyter来进行正式训练和推理。<br>

[知乎案例](https://zhuanlan.zhihu.com/p/469910533) , 一个比较from scratch的案例，分割数据，复制数据，创建数据集。<br>
[更好的案例](https://developer.aliyun.com/article/1036530) , 一个比较concise的案例。非常好的解析了源文件，创建新的数据集<br>