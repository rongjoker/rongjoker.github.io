---
layout: post
title: 算法笔记(十一):双塔奇兵
---

###  旧瓶装新酒
[300. 最长递增子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/) 是一个经典n^2复杂度的dp题目。`673.最长递增子序列的个数` 在此基础上加大难度。解题思路也变难。<br>


### 双数组dp
[673. 最长递增子序列的个数](https://leetcode-cn.com/problems/string-rotation-lcci/) 解题需要在普通dp数组基础上再加一个计数数组cnt，可算作双数组dp类题目。一般来说，dp分类里并无此类题目，不过这个题目很有发散性，故加以强调，可做板子题:<br>
```
       public boolean isFlipedString(String s1, String s2) {
class Solution {
    public int findNumberOfLIS(int[] nums) {
        int len = nums.length;
        int[] dp = new int[len]; //最长上升子序列
        int[] cnt = new int[len+1];//最长上生子序列数量
        int max = 1;
        int ans = 1;

        dp[0]=1;
        cnt[0]=1;
        for(int i=1;i<len;i++){
            dp[i]=1;
            cnt[i]=1;
            for(int j=0;j<i;j++){
                if(nums[i]>nums[j]){
                    if(dp[i]<dp[j]+1){//这里不是判断dp[i]与max的关系，只考虑dp[i]的情况
                        dp[i] = dp[j]+1;
                        cnt[i] = cnt[j];//重制,关键，这里不是重制为1，而是从j继承
                    }else if (dp[i]==dp[j]+1){
                        cnt[i] += cnt[j];
                    }
                }
            }
            if(dp[i]>max){
                max=dp[i];
                ans = cnt[i];//与上面同理
            }else if (dp[i]==max) ans+= cnt[i];
        }

        return ans;

    }
}
```

<br> python版本语法要更加简单：

```
class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        length, ans, max_val = len(nums), 0, 0
        dp = [0] * length
        cnt = [0] * length
        for i, x in enumerate(nums):
            dp[i] = 1
            cnt[i] = 1
            for j in range(i):
                if x > nums[j]:
                    if dp[j] + 1 > dp[i]:
                        dp[i] = dp[j] + 1
                        cnt[i] = cnt[j]
                    elif dp[j] + 1 == dp[i]:
                        cnt[i] += cnt[j]
            if dp[i] > max_val:
                max_val = dp[i]
                ans = cnt[i]
            elif dp[i] == max_val:
                ans += cnt[i]
        return ans

```


### 贪食蛇
[792. 匹配子序列的单词数](https://leetcode-cn.com/problems/number-of-matching-subsequences/) 这个题目的官方解法非常精巧，先根据首字母构建索引，然后每一次遍历字符串都重建一次索引，索引指向的数据被消耗完，说明子序列匹配结束，ans++;另一巧妙点为每一轮先把命中这一个数组拿出来，重新处理这一索引。 反复处理的过程，很像贪食蛇的感觉。Java版本:<br>
```
      class Solution {

    public int numMatchingSubseq(String s, String[] words) {
        int ans = 0;

        List<Node>[] dict = new ArrayList[26];
        for (int i = 0; i < 26; i++) {
            dict[i] = new ArrayList<>();
        }
        for (String word : words) {
            int index = word.charAt(0) - 'a';
            dict[index].add(new Node(word,word.length(),0));
        }
        char[] chars = s.toCharArray();
        for (char aChar : chars) {
            int index = aChar - 'a';
            List<Node> available = dict[index];//每一轮先把命中这一个数组拿出来，重新处理这一索引
            dict[index] = new ArrayList<>();

            for (Node obj : available) {
                obj.index++;
                if(obj.index==obj.len){
                    ans++;
                }else {
                    dict[obj.str.charAt(obj.index)-'a'].add(obj);
                }
            }
        }

        return ans;

    }

    static class Node{
        Node(String s,int l,int i){
            str = s;
            index = i;
            len = l;

        }
        String str;
        int index;
        int len;

    }
    
}
```

用Python则更加简单，用迭代iter充当Node对象:
```


class Solution:
    def numMatchingSubseq(self, s: str, words: List[str]) -> int:
        ans = 0
        dictionary = [[] for _ in range(26)]
        for w in words:
            it = iter(w)
            dictionary[ord(next(it)) - ord('a')].append(it)
        for le in s:
            cur = ord(le) - ord('a')
            old = dictionary[cur]
            dictionary[cur] = []
            for it in old:
                nex = next(it, None)
                if nex:
                    dictionary[ord(nex) - ord('a')].append(it)
                else:
                    ans += 1
        return ans



```

