---
layout: post
title: 算法笔记(三):算法与股票
---

### 股票风云
leetcode热衷于探讨股票的买入和卖出时机，一共有6个相关题目(算上剑指offer一共7个),除一个题目外全部都可以归属到dp范畴。可见理财本质就是规划<br>



### 一锤子买卖

 [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/) 是股票买卖时机的入门题目。可以利用 [53题线段和](https://leetcode-cn.com/problems/maximum-subarray/) 的思想来做，也就是先差分，再求最大和:
```
              public int maxProfit(int[] prices) {
                      int len = prices.length;
                      if(len<2)return 0;
              
                      int max = 0,temp=0;
                      for(int i=1;i<len;++i){
                          if(temp<0)temp = (prices[i] - prices[i-1]);
                          else temp+=(prices[i] - prices[i-1]);
                          max = Math.max(temp,max);
                      }
                      return max;
                  }
```
<br/>
这个题目很简单，也透露着朴素的道理:如果只能做一次选择，那就不需要纠结。

### 散户的理想

 [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/) 是股票买卖时机的第二个题目。这个题目比第一个还简单,有dp和greedy两种方法。它大概描述了一个散户的终极理想:永远可以在低点买入高点卖出。没有任何手续费和次数限制，哪怕高点和低点只差一毛钱，也可以进行一次买卖:
```
              public int maxProfit(int[] prices) {
                  int len = prices.length;
                      if(len<2)return 0;
              
                      int max = 0,temp=0;
                      for(int i=1;i<len;++i){
                          temp = prices[i] - prices[i-1];
                          if(temp>0) max+=temp;
                      }
                      return max;
          
              }
```
<br/>
现实中我们无法没有这种理想的情景，所以这个题目反向说明一个道理：散户七赔二平一赚，主要原因在于短时。频繁的交易往往是带来巨额赔损以及心态崩溃。无怪乎赚钱的往往是忘记交易密码的玩家。


### 最佳散户
[123. 买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/) 是股票买卖时机的第三个题目，这个题目，难度陡增，有两种dp解法。它大概描述了一个佛系且明智的散户的状态:在合适的价格买入，然后长期持有，在合适的价格卖出，然后等待下次合适的买入时机。<br>
方法一,切分2块，分块dp
```
              public int maxProfit(int[] prices) {
                  int len = prices.length;
                      if(len<2)return 0;
              
                      int max = 0,temp=0;
                      for(int i=1;i<len;++i){
                          temp = prices[i] - prices[i-1];
                          if(temp>0) max+=temp;
                      }
                      return max;
          
              }
```
<br/>
