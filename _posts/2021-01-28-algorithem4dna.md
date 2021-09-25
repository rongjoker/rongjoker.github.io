---
layout: post
title: 算法笔记(四):编辑距离与DNA
---

### DNA
自上个世纪DNA"发明"以来，生物界发生了翻天覆地的变化。DNA打破了非常多的人类固有认知，让"滴血认亲"不再是封建迷信、破解几十年的悬案、解决无数的人伦纠纷。DNA所有的魔法般的应用，归根结底都来源于一种朴素的道理:事物A可以以很少的变化步骤变成事物B，则A和B相似度最高，甚至就是B。<br>
经典的dp题目`编辑距离`即是对这一道理的实践。



### 编辑距离

 [72. 编辑距离](https://leetcode-cn.com/problems/edit-distance/) 是leetcode上的一个`编辑距离`类型的题目，其实这类题目有多种变形，leetcode的题目是其中最简单的一种，虽然难度是hard，但它只考虑单个字母的有限的操作(插入、删除、替换)，不考虑内部的字母交换位置和双字母的替换位置等情况。编辑距离属于典型的"有思路就非常简单，没思路则无从下手"的题目，如果你理解了这种题目，会觉得只能算
 easy难度;不过这个理解的过程，就很hard。<br>
此类题目一般有2种解法。第一种是递归，也是最为直观的解法，代码本身的阅读过程就是对这类题目的理解过程。可以利用记忆化搜索来优化性能。<br>
```
              public int minDistance(String word1, String word2) {
                      int max1 = word1.length(),max2 = word2.length();
                      if(max1==0) return max2;
                      if(max2==0) return max1;
                      dp = new int[max1+1][max2+1];
                      for (int i = 0; i <= max1; i++) {
                          for (int j = 0; j <= max2; j++) {
                              dp[i][j] = -1;
              
                          }
                      }
                      return distance(word1,word2,max1,max2,0,0);
                  }
              
                  int[][] dp;
              
              
                  public int distance(String word1, String word2,int max1,int max2,int index1,int index2){
                      if(dp[index1][index2]!=-1) return dp[index1][index2];
                      int step;
                      if(index1==max1) step =  max2 - index2;//递归基:插入字段
                      else if(index2==max2) step = max1 - index1;//递归基:删除多余的字段
                      else if(word1.charAt(index1)== word2.charAt(index2)){
                          step =  distance(word1,word2,max1,max2,index1+1,index2+1);
                      }else
                          step =  Math.min(Math.min(1+ distance(word1,word2,max1,max2,index1+1,index2),//删除word1的index1
                                  1+ distance(word1,word2,max1,max2,index1,index2+1)//插入word1的index1
                          ),1+ distance(word1,word2,max1,max2,index1+1,index2+1));//替换掉word1的index1
                      dp[index1][index2] = step;
                      return step;
                  }
```
<br/>
第二种方法为典型的动态规划的方法，也就是状态转移，其实就是递归方法（自顶向下）的反向方程转移版本（自下向上）。状态转移方程为：如果当前位置两个char相同，则需要的步骤不变，即不做任何操作，前进到下一个char；否则在插入(相当于x[i]加一个y[j],即x[i+1]=y[j],ans=x[i]y[j-1])、删除(相当于x[i]删除一个,即x[i]=y[j-1],ans=x[i-1]y[j])、替换(x[i-1]y[j-1]+1)种选择一个需要步骤最少的操作。代码如下:

```
            int max1 = word1.length(),max2 = word2.length();
                   if(max1==0) return max2;
                   if(max2==0) return max1;
                   dp = new int[max1+1][max2+1];
           
                   //注意这里要进1制，别忘了等号
                   for (int i = 0; i <= max2; i++) {
                       dp[0][i] = i;
                   }
           
                   //注意这里要进1制，别忘了等号
                   for (int i = 0; i <= max1; i++) {
                       dp[i][0] = i;
                   }
           
           
                   for (int i = 0; i < max1; i++) {
                       for (int j = 0; j < max2; j++) {
                           if(word1.charAt(i) == word2.charAt(j))
                               dp[i+1][j+1] = dp[i][j];
                           else{
                               dp[i+1][j+1] = 1 + Math.min(Math.min(dp[i+1][j],dp[i][j+1]),dp[i][j]);
                           }
                       }
                   }
           
                   return dp[max1][max2];   
```

### 简版编辑距离
编辑距离代码少，理解了很直观，可是不理解的话，很难做。 [583. 两个字符串的删除操作](https://leetcode-cn.com/problems/delete-operation-for-two-strings/) 是编辑距离的简化版本，难度为meduim，可以尝试，dp的代码几乎和72题完全一样加深理解:

```
public int minDistance(String word1, String word2) {

        int max1 = word1.length(),max2 = word2.length();
        if(max1==0) return max2;
        if(max2==0) return max1;
        int[][] dp = new int[max1+1][max2+1];

        //注意这里要进1制，别忘了等号
        for (int i = 0; i <= max2; i++) {
            dp[0][i] = i;
        }

        //注意这里要进1制，别忘了等号
        for (int i = 0; i <= max1; i++) {
            dp[i][0] = i;
        }

        for (int i = 0; i < max1; i++) {
            for (int j = 0; j < max2; j++) {
                if(word1.charAt(i) == word2.charAt(j))
                    dp[i+1][j+1] = dp[i][j];
                else{
                    dp[i+1][j+1] = Math.min(Math.min(dp[i+1][j],dp[i][j+1])+1,dp[i][j]+2);//同时删2个
                }

            }
        }

        return dp[max1][max2];


    }

```


> 这个题目在未修改代码的情况下，提交了两次，一次10%，一次46%，特意翻了下题解，和90+%的代码复杂度一致，leetcode的判定真的很诡异。 
