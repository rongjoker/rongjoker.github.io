---
layout: post
title: 算法笔记(九):回溯入门
---

### 七种兵器之回溯
回溯与动态规划是一对孪生兄弟，或者可以这么说，dp是找出最优的成本与收益的方案，回溯是执行这个方案。换句话说，dp是项目经理，backtrack是程序员。很多较为困难的题目也可以用回溯法去笨拙地解决。现以最基本的排列组合和子集为例，列举回溯法的基本使用方法。



### 子集

[78. 子集](https://leetcode-cn.com/problems/subsets/) 是最基本的回溯法入门题目，不需要考虑任何意外情况，直接运算计算：<br>
```
 public List<List<Integer>> subsets3(int[] nums) {
        ans3 = new ArrayList<>();

        if(nums.length==0)
            return ans3;

        backtrack3(0,nums.length,nums);

        return ans3;
    }


    List<List<Integer>> ans3;
    Deque<Integer> queue3 = new ArrayDeque<>();


    public void backtrack3(int start,int len,int[] nums){
        ans3.add(new ArrayList<>(queue3));

        for(int i=start;i<len;++i){
            queue3.addLast(nums[i]);    
            backtrack3(i+1,len,nums);
            queue3.removeLast();

        }
    }
```
<br>
虽然是入门，但是已经体现出了回溯的精髓。这个写法是最典型的极简写法，直接在递归开始添加子集，将[]这种子集包含在内，也让回溯核心代码更好理解:

```
      queue3.addLast(nums[i]);    
             backtrack3(i+1,len,nums);
             queue3.removeLast();
```


[90. 子集 II](https://leetcode-cn.com/problems/subsets-ii/) 是子集1的进阶题目，即使掌握了回溯法，处理这个题目依然头疼。以下列出与`子集1`有区别的核心代码:

```

   for(int i=start;i<len;++i){
            //去重,在[这一轮循环]里，不能重复,如果是这一轮的第一个，与前面的重复，不是这一轮的重复
            if (i != start && nums[i] == nums[i - 1])continue;
            queue4.addLast(nums[i]);
            backtrack4(i+1,len,nums);
            queue4.removeLast();
        }

```
这个判断是否跳过很关键，具体描述在注释里，可以说是最精华之处。



### 全排列
[46. 全排列](https://leetcode-cn.com/problems/permutations/) 是回溯法最常见的板子题之一。这类题目关键是跳出传统思维，虽然求排列，但是解法的着眼点却在替换上。这一技巧的原理很简单：一个数组中两个下标交换，则产生新的排列：<br>

```
   List<List<Integer>> permute = new ArrayList<>();
   
       int len, temp;
   
       public List<List<Integer>> permute(int[] nums) {
           len = nums.length;
           permute(nums, 0);
           return permute;
       }
   
       public void swap(int[] nums, int x, int y) {
   
           if (x == y) return;
   
           temp = nums[x];
           nums[x] = nums[y];
           nums[y] = temp;
   
       }
   
       public void permute(int[] nums, int start) {
   
           if (start == len - 1) {//关键的一步可以把start看作指针，指针每一轮指到最右则，说明找到了一种排序,也就是阶乘
               List<Integer> ints = new ArrayList<>();
               for (int num : nums) {
                   ints.add(num);
               }
               permute.add(ints);
               return;//相当于只有1个数字做全排列
           }
   
           for (int i = start; i < len; i++) {
               swap(nums, i, start);
               permute(nums, start + 1);
               swap(nums, i, start);//这一行即所谓的[回溯]
           }
   
       }
```


[47. 全排列 II](https://leetcode-cn.com/problems/permutations-ii/) 是全排列的进阶题目，与子集一样，全排列也有各种变形。此题需要用set维护一个使用过的下标值来避免重复替换。以下列出与`全排列`有区别的核心代码:

```

Set<Integer> set = new HashSet<>();

        for (int i = start; i < len; i++) {
            if(set.contains(nums[i])){
                continue;
            }
            set.add(nums[i]);
            swap(nums, i, start);
            permute(nums, start + 1);
            swap(nums, i, start);//这一行即所谓的[回溯]

        }


```
