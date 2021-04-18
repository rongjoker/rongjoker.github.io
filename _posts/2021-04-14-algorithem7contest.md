---
layout: post
title: 算法笔记(七):周赛启示录(持续更新)
---

### 周赛与双周赛
ACMer往往看不上leetcode的竞赛。题目文字描述简短且是中文(狗头)因而不需要做阅读理解、题目量少且前两题往往是送分，周末起个大早或者熬夜换来索然无味的commit，的确让ACMer提不起兴趣。对于普通刷题爱好者来说，leetcode的竞赛又因为间或包含一些数学题目而令人烦躁，吾辈刷题，无非是练练白板和初级算法，连图论都不想碰，何况数论？考研前对数学情深意切，考研完谁还不是一键删除记忆？<br>
不过leetcode的周赛和双周赛，的确满足了一般的刷题者pvp的刚性需求，也让刷穿了经典题库的老刷题人有了返场的理由。线上限时加上可模拟复盘重做，也的确把竞赛的门栏拉到最低，而每周题目中往往有设计类的应用题，确实也增加了比赛的实用性。<br>
以下记录诸次比赛中值得温习的题目。
<br>


### 周赛237
早上被叫去打疫苗，9点触发，11多赶回来，只来得及做了第一题。尴尬

### 周赛237
早上被叫去打疫苗，9点触发，11多赶回来，只来得及做了第一题。尴尬

### 双周赛50
晚上小孩吵得厉害，必须关闭亮光她才睡得着，同时老婆抱怨青轴又太吵，刷两题后索性停止。其中一个题目是几何题，基本画图后即可解决。两道未做的题目中，有一个是位运算的题目，最近竞赛位运算的题目越来越多，必须得专门学习一下。


[1824. 最少侧跳次数](https://leetcode-cn.com/problems/minimum-sideway-jumps/) 是dp里比较令人纠结的题目，它很容易想到状态的转移，但是很难想出准确的转移方程<br>
往往dp的递推是从n-1递推n，而这个题目是在n的内部互相递推。另外一点这个题目和其他dp题目类似，可以利用降维的方式，大幅度降低计算复杂度:

```
         long[] dp = new long[4];
    
            dp[1]=dp[3]=1;
    
            for(int i=1;i<len;++i){
    
                if(obstacles[i]==1)
                    dp[1] = Integer.MAX_VALUE;
                if(obstacles[i]==2)
                     dp[2] = Integer.MAX_VALUE;
                if(obstacles[i]==3)
                    dp[3] = Integer.MAX_VALUE;
    
    
                if(obstacles[i]!=1)
                    dp[1] = Math.min(Math.min(dp[2],dp[3])+1,dp[1]);
                if(obstacles[i]!=2)
                    dp[2] = Math.min(Math.min(dp[1],dp[3])+1,dp[2]);
                if(obstacles[i]!=3)
                    dp[3] = Math.min(Math.min(dp[1],dp[2])+1,dp[3]);
    
            }
```

实际上dp仅有一维，甚至可以看作没有dp数组，就是三个数字，不停的替换即可。类似的，01背包和完全背包也可以在一维数组上运算。


### 周赛235

[1818. 绝对差值和](https://leetcode-cn.com/contest/weekly-contest-235/problems/minimum-absolute-sum-difference/) 是一道利用二分查找优化蛮力算法的典型题目。蛮力算法往往能简单粗暴地解决问题，只是题目往往卡时间，所以利用一些特殊方法进行优化，比如之前计算容器的单调栈，比如这个题目的二分查找。<br>
这个题目关键在于从nums1中找到与nums2[i]差值最小的数字，蛮力的话，就是n^2两次迭代，利用二分查找可以优化到nlogn。需要注意的是，查找相近的数据而不是相同的数据，故要考虑左右，而且要注意边界，以下列出核心的查找相近数字的程序代码:

```
    int middle,left_val,right_val;
    public int calculate(int[] nums11,int target,int left,int right){
        left_val = nums11[left];right_val=nums11[right];
        while(left<=right){

            middle = left + ((right - left)>>1);

            if(nums11[middle]>target){
                right_val = nums11[middle];
                right=middle-1;
            }
            else if(nums11[middle]<target){
                left_val = nums11[middle];
                left=middle+1;
            }
            else return 0;
        }

        return Math.min(Math.abs(left_val - target),Math.abs(right_val - target));


    }
```

### 双周赛49
[1814. 统计一个数组中好对子的数目](https://leetcode-cn.com/contest/biweekly-contest-49/problems/count-nice-pairs-in-an-array/) ，这个题目属于数学题的范畴。比较巧妙的利用加减法交换律：`nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])`，推算出`nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`。也就是统计`nums[i] - rev(nums[i])`各值的出现次数，进行`k*(k-1)/2`求组合即可。放在数学上其实是很简单的题目，不过放在算法题目里就很费解。还好做题时候可以百度组合数公式。



### 周赛233

这次周赛很尴尬，只做了2个题目，算是提前退赛。leetcode的数学题目实在不想做，在编程里费劲，在数学里无用。实属鸡肋。[1802. 有界数组中指定下标处的最大值](https://leetcode-cn.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/) 是一道不错的题目。首先想到的是等差数列，做起来挺费劲的，边界条件一塌糊涂。后来看题解有个作者采用叠罗汉塔的方式来完成，属实把等差数列玩出花了。以下为java复刻版本:

```
    //叠罗汉塔的方式，铺满后剩下的做地基
        //第一个就是从index位置叠1个，下面不停的左右扩散1-3-5，某一边撞墙则那边停止
        //   1
        //  111
        // 111111
        public int maxValue(int n, int index, int maxSum) {
    
            int left = index, right = index;
            int result = 1;
            // 整个数组一开始全部填充为1，
            // rest记录先全部填充1后，剩下1的个数
            int rest = maxSum - n;
            while (left > 0 || right < n - 1) {
                int len = right - left + 1;
                if (rest >= len) {
                    // 当前[l,r]范围全部+1
                    rest -= len;
                    result++;
                    // 往左右两边扩
                    left = Math.max(0, left - 1);//撞墙停止
                    right = Math.min(n - 1, right + 1);//撞墙停止
                } else {
                    break;
                }
            }
            // 从小向大叠罗汉塔，剩余的可以用来铺地基，能铺多少是多少
            result += rest / n;
            return result;
    
    
        }
```

