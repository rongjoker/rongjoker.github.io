---
layout: post
title: 算法笔记(五):人伦纲常检测仪--并查集
---

### 并查集
leetcode热衷于通过探讨股票的买入和卖出时机，来教我们炒股，一共有6个相关题目(算上剑指offer一共7个),全部都可以用dp解决。可见理财本质就是规划。<br>



### 一锤子买卖

 [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/) 是股票买卖时机的入门题目，与[剑指 Offer 63. 股票的最大利润](https://leetcode-cn.com/problems/gu-piao-de-zui-da-li-run-lcof/) 是同一题。可以利用 [53题线段和](https://leetcode-cn.com/problems/maximum-subarray/) 的思想来做，也就是先差分，再求最大和:
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
[123. 买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/) 是股票买卖时机的第三个题目，难度陡增。它大概描述了一个佛系且明智的散户的状态:在合适的价格买入，然后长期持有，在合适的价格卖出，然后等待下次合适的买入时机。<br>
这个题目，容易无从下手。实际有2种dp方法。<br>
方法一,相对容易理解和想到。从中间分割为2笔交易，左边的找到最小值，当前值减去最小值即当前点的最大收益；右边从右向左运行，找到最大值，减去当前值即为右边的最大值；然后左边两边遍历结果，求每个的和，比较每个和的最大值:
```
      public int maxProfit(int[] prices){
        int len = prices.length;
        if (len<2)
            return 0;


        int[] dp_left = new int[len],dp_right = new int[len];

        int min=prices[0];
        for (int i = 1; i <len; i++) {
            dp_left[i] = Math.max(dp_left[i-1],prices[i] - min );
            min = Math.min(min,prices[i]);
        }

        int  max = prices[len-1];
        for (int i = len-2; i >0; i--) {
            dp_right[i] = Math.max(dp_right[i+1],max - prices[i]);
            max = Math.max(max,prices[i]);
        }

        max = 0;
        for (int i = 1; i < len; i++) {
            max = Math.max(max,dp_left[i] + dp_right[i]);
        }

        return max;
        
    }
```
<br/>
方法二,较难想出，更难理解，也更难实现;但更有通用性(能适用于分割成2、3.。。。k笔交易)，也是更高阶的状态dp。思路如下:<br>
第一笔的买入卖出是正常操作，第二笔的买入基于第一笔卖出的最大收益，第二笔的卖出在第二笔买入的基础上继续计算，整个是个累加递进的状态的过程。<br>
四种状态可以简化为四个int变量，为了更好的体现思路，用二维数组替代

```
      public int maxProfit(int[] prices){
                int len = prices.length;
        if (len<2)
            return 0;

        int[][] dp = new int[len][4];
        dp[0][0] = -prices[0];
        dp[0][2] = -prices[0];


        //记录前缀状态
        for (int i = 1; i < len; i++) {
            dp[i][0] = Math.max(-prices[i],dp[i-1][0]);//持有第一笔股票的最好值
            dp[i][1] = Math.max(dp[i-1][1],prices[i] + dp[i-1][0]);//卖出第一笔股票的最好值
            dp[i][2] = Math.max(dp[i-1][2],dp[i-1][1]-prices[i]);//持有第二笔股票的最好值
            dp[i][3] = Math.max(dp[i-1][3],prices[i] + dp[i-1][2]);//卖出第二笔股票的最好值


            }


        return dp[len-1][3];//返回第二笔收益，因为第二笔会继承第一笔的收益
        
    }
```

### 庄家行为
[188. 买卖股票的最佳时机 IV](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/) 是股票买卖时机的第四个题目，算是第三个题目的渐进版本。它描述了一个佛系典型的操盘手的状态:在合适的价格买入，然后长期持有，在合适的价格卖出，然后等待下次合适的买入时机。与[最佳散户]不同的是，操盘手可以有多次屯货和高位卖出的机会<br>
从dp的角度来说，这个题目即第三个题目的第二种方法的通用版本。代码如下:
```
       public int maxProfit(int k, int[] prices) {
        int len = prices.length;
        if (len < 2)
            return 0;

        int[][][] dp = new int[len][k][2];
        for (int i = 0; i < k; i++) {
            dp[0][i][0] = -prices[0];
        }

        //记录前缀状态
        for (int i = 1; i < len; i++) {

            for (int j = 0; j < k; j++) {
                if (j > 0)
                    dp[i][j][0] = Math.max(dp[i - 1][j][0], dp[i - 1][j - 1][1] - prices[i]);//持有第j笔股票的最好值=j-1笔收益-购买当前股票
                else dp[i][j][0] = Math.max(dp[i - 1][j][0], -prices[i]);//持有第j笔股票的最好值=j-1笔收益-购买当前股票

                dp[i][j][1] = Math.max(dp[i - 1][j][1], prices[i] + dp[i - 1][j][0]);//卖出第j笔股票的最好值
            }

        }

        return dp[len - 1][k - 1][1];
    }
```
<br>
和第三个题目相同，三维数组可以优化到二维，为了更清晰的表示含义，保留了空间占用更大的三维。

### 回到现实
[714. 买卖股票的最佳时机含手续费](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) 是股票买卖时机的第五个题目，也算是番外篇1。它描述了一个现实中的股票交易场景:每次卖出，是要收手续费的。这也是股票乃至于基金交易的必须考虑的问题：频繁的交易，往往是给证券公司或者基金公司打工。<br>
从dp的角度来说，每一天有2个状态:第一种是买入，两种种情况:1,不操作，从上一步的买入的收益延续下来;2，买入，从上步的卖出的收益延续。第二种是卖出,两种情况比较：1，不操作，还是从上一步卖出的收益延续下来；2，卖出，从上一步的买入延续下来。代码如下:
```
       public int maxProfit(int k, int[] prices) {
        int len = prices.length;
        if (len < 2)
            return 0;

        int[][] dp = new int[len][2];//0为买入，1为卖出
        dp[0][0] = - prices[0];//持有股票的情况，第一天只有买入这一种情况，无法从之前买入的持有下去
        dp[1][0] = Math.max(dp[0][0],-prices[1]);//持有股票的情况
        dp[1][1] = Math.max(prices[1]-prices[0]- fee,0);
        for (int i = 2; i < len; i++) {
            //卖出,两种情况比较：1，不操作，还是从上一步卖出的收益延续下来；2，卖出，从上一步的买入延续下来 ++
            dp[i][1] = Math.max(dp[i-1][1],dp[i-1][0] + prices[i]-fee);
            //买入，两种种情况:1,不操作，从上一步的买入的收益延续下来;2，买入，从上步的卖出的收益延续 --
            dp[i][0] = Math.max(dp[i-1][0],dp[i-1][1]-prices[i]);
        }

        return Math.max(dp[len-1][1],0);
    }
```
这个题目暗示了散户理财的归宿:给理财公司当韭菜。

### 股东行为

[309. 最佳买卖股票时机含冷冻期](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) 是股票买卖时机的第六个题目，也算是番外篇2。它描述了一个现实中的股东股票交易场景:每次卖出，是含冷冻期的。。<br>
从dp的角度来说，每一天有2个状态:第一种是买入，两种种情况:1,不操作，从上一步的买入的收益延续下来;2，买入，从上步的卖出的收益延续。第二种是卖出,两种情况比较：1，不操作，还是从上一步卖出的收益延续下来；2，卖出，从上上步的买入延续下来。代码如下:
```
       public int maxProfit(int k, int[] prices) {
        int len = prices.length;
        if (len < 2)
            return 0;

        int[][] dp = new int[len][2];//0为买入，1为卖出
        dp[0][0] = - prices[0];//持有股票的情况，第一天只有买入这一种情况，无法从之前买入的持有下去
        dp[1][0] = Math.max(dp[0][0],-prices[1]);//持有股票的情况
        dp[1][1] = Math.max(prices[1]-prices[0],0);
        for (int i = 2; i < len; i++) {
            //卖出,两种情况比较：1，不操作，还是从上一步卖出的收益延续下来；2，卖出，从上一步的买入延续下来 ++
            dp[i][1] = Math.max(dp[i-1][1],dp[i-1][0] + prices[i]);
            //买入，两种种情况:1,不操作，从上一步的买入的收益延续下来;2，买入，从上上步的卖出种延续 --
            dp[i][0] = Math.max(dp[i-1][0],dp[i-2][1]-prices[i]);
        }

        return Math.max(dp[len-1][1],0);
    }
```

<br>
至此，leetcode已经教完我们炒股，是时候到股市里为城市绿化做贡献了。<br>

> 相关资料:  [股票问题系列通解](https://leetcode-cn.com/circle/article/qiAgHn/) 


