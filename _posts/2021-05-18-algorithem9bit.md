---
layout: post
title: 算法笔记(九):位运算与状态压缩
---

### 位运算
位运算算是leetcode各类算法里最奇妙的一种，它能解决的问题，一般来说，用其他方法也能解决，只是两种方法对比效率，位运算会优秀极多。同时，位运算的解题也折射出高中数学以及部分高等数学的思想。<br>


### 位运算判断重复
位运算的一个最直接的应用就是高效地判断重复。原理很简单，或运算进行位数上的改变，与运行判断位数是否有改变。以[面试题 01.01. 判定字符是否唯一](https://leetcode-cn.com/problems/is-unique-lcci/) 为例。这个题目算是位运算判断重复的最简单的板子题。解法可以形成套路：

```
        public boolean isUnique(String astr) {
        char[] cs = astr.toCharArray();
        int mask = 0;
        for(char c:cs){
            int temp = (mask >> (c-'a')) & 1;//与运算判断指定位置是否已经存在
            if(temp == 1)return false;
            mask |=(1 << (c-'a'));//或运算将制定位置设置为1
        }

        return true;
    }

```

<br>

这个套路可以继续拓展应用。leetcode有很多系列题目，有些很热门，比如打家劫舍系列，有些则较为冷僻，期中以`只出现一次的数字`系列最鲜为人知。这类题目基本都可以用hashset解决，所以即使题目暗示、明示了用位运算，实际解题者也都以set简单跳过。原因无他，只是位运算在面试中出现的可能性极小。系列三个题目均可以用位运算解决，第一题最简单，数组依次亦或运算即可。第二题较难，利用了位运算解题常见的一种思路：把一个数字放在定长（往往是32）的二进制树上进行逐个位子的运算，最终得到结果。 第三题 [260. 只出现一次的数字 III ](https://leetcode-cn.com/problems/single-number-iii/) 难度要高出不少。前两题仅要求解出一个数字，这个题目要求解出2个数字。其实思路反而和第一个题目一致，即把数组分为2部分，分别亦或运算即可得到2个数字。不过能识别出两个数字的特征是难点。大部分位运算用到的是亦或。这一步却用到与运算。利用与运算找到第一个不同的位数(亦或运算完为1则说明不同，只要找到与1与运算不为0的那个位数即是亦或结果为1也就是2个数字不同的地方)。随后将整个数组依次进行与运算，得到0和1的即是两个子数组部分，逐位亦或即可。<br>

```
                    int[] ans = new int[2];

        int k = 0;
        for (int num:nums)
            k ^= num;
        int div = 1;
        while ((div & k) == 0)
            div <<= 1;
        for(int num:nums){
            if ((num & div) == 0)
                ans[0] ^= num;
            else
                ans[1] ^= num;
        }

        return ans;
```

### 状态压缩
位运算的另外一大用途是状态压缩。<br>
前缀和类的题目，以前缀和来解决，往往需要n^2的复杂度，在数据量比较大的情况下会超时，此时可以用位运算进行状态压缩进行优化。
[318. 最大单词长度乘积](https://leetcode-cn.com/problems/maximum-product-of-word-lengths/) 难度要高出不少。<br>

```
public int maxProduct(String[] words) {
        int len = words.length;
        int[][] available = new int[len][26];
        for(int i=0;i<len;++i){
            char[] cs=words[i].toCharArray();
            for(char c:cs){
                available[i][c-'a']++;
            }
        }

        int ans = 0;

        for(int i=0;i<len-1;++i){
            char[] cs=words[i].toCharArray();
            loop:for(int j=i+1;j<len;++j){
                for(char c:cs){
                    if(available[j][c-'a']>0)continue loop;
                }
                ans = Math.max(words[i].length() * words[j].length(),ans);
            }
        }
        return ans;
    }
```

这个解法已经是常规优化的版本，数组的效率已经是常规情况下最高的。<br>
用位运算则快很多：

```
   public int mask(String word){
        int ans = 0;
        char[] cs=word.toCharArray();
        for(char c:cs){
            ans |=(1 << (c-'a'));//或运算回避了重复添加的问题
        }

        return ans;

    }


    public int maxProductBit(String[] words) {
        int len = words.length;
        int[] available = new int[len];
        for(int i=0;i<len;++i)available[i] = mask(words[i]);

        int ans = 0;

        for(int i=0;i<len-1;++i){
            for(int j=i+1;j<len;++j){
                if((available[i] & available[j]) >0) continue;//与运算判断重复
                ans = Math.max(words[i].length() * words[j].length(),ans);
            }
        }
        return ans;
    }

```

[1915. 最美子字符串的数目](https://leetcode-cn.com/problems/number-of-wonderful-substrings/) 则是状态压缩的更好运用。这个题目用传统的前缀和会超时，必须进行位运算优化:<br>

```
 public long wonderfulSubstringsZip(String word) {
         int len = word.length();
         if(len==1)return 1;
         long ans = 0;
         int mask = 0;
 
         long[] freq = new long[1 << 10];
         freq[0] = 1;//相当于偶数初始化有1个
 
         char[] chars = word.toCharArray();
         for (int i = 0; i < len; i++) {
             mask ^= (1<<(chars[i]-'a'));//之前如果是奇数则现在变偶数
             ans += freq[mask];//之前的奇偶性完全一样的数量，即偶数（奇数-奇数=偶数；偶数-偶数=偶数）,偶数为0
             for (int j = 0; j < 10; j++) {
                 ans += freq[mask ^ (1 << j)];//之前奇偶性差距一个的数量，允许差距1个
             }
             freq[mask]++;
 
         }
         return ans;
     }

```

同样的题目也有: [1542. 找出最长的超赞子字符串](https://leetcode-cn.com/problems/find-longest-awesome-substring/)