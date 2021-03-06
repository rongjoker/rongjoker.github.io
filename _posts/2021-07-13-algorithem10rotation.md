---
layout: post
title: 算法笔记(十):旋转、跳跃、我闭上眼
---

### 各种旋转
经常有人诟病leetcode为小学奥数，这一指责至少在很多类似脑筋急转弯的题目上是有道理的。利用数据结构和算法解题的题目，往往可以锻炼工程能力以及编码水平。而脑经急转弯类的题目，唯一的用途是让人看完题解后拍大腿。不过这类题目也不是一无是处，在cv之后，的确可以跳出常规思维的圈套。<br>


### 字符串轮转
我愿意把[面试题 01.09. 字符串轮转](https://leetcode-cn.com/problems/string-rotation-lcci/) 拿来做第一个批判和学习的对象。这个题目通常的解法，恐怕要进行n^2的两次循环来暴力解决。可以巧妙的解法则是把字符串1累加，再判断是否包含字符串2:<br>
```
       public boolean isFlipedString(String s1, String s2) {
           int len1 = s1.length(),len2 = s2.length();
           if(len1!=len2)return false;
           s1+=s1;
           return s1.contains(s2);
   
       }
```
### 金风玉露一相逢
其次是 [160. 相交链表 II](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/) ,这个题目的思路更是诡谲。用常规思路也是让人抓狂。跳出常规思路则很简单。根据 `a + all + b = b+ all + a` 的小学数学即可解决：
```
       public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
               ListNode temp1 = headA, temp2 = headB;
               while (temp1 != temp2) {
                   if (temp1 != null) temp1 = temp1.next;//注意这里，要判断temp1,而不是temp1.next，否则可能会死循环
                   else temp1 = headB;
                   if (temp2 != null) temp2 = temp2.next;
                   else temp2 = headA;
               }
               return temp1;
           }
```

### 交接重任
[面试题 04.01. 节点间通路](https://leetcode-cn.com/problems/route-between-nodes-lcci/) ,这个题目的常规解法是回溯法，然后回溯法的一个缺乏是无法提前停止，解题耗时35ms，代码量很大。换成另一种解法，先找终点，找到后，把起点换做终点继续找，直到起点和初始点一致即可。代码量极少，且效率提升到3ms：
```
           public boolean findWhetherExistsPath(int n, int[][] graph, int start, int target) {
               for(int[] g:graph)   
                    if(g[1]==target && g[0]!=target)
                          if(g[0]==start || findWhetherExistsPath(n,graph,start,g[0]))return true;
               return false;
           }
```

