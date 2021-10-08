---
layout: post
title: 算法笔记(八):双指针与编程的直觉
---

### 排序算法与直觉
一般来说，我们首先学到的算法就是排序。排序是很典型的场景具化的需求，即现实中我们需要排序，编程时就进行对应的排序，简称模拟。比如学生早操排队、分数成绩排名，都是最简单的排序。也因来源于生活场景，所以将生活的直觉转化为代码操作，也就有了最初的排序算法。起泡排序，来源于最无脑的一一比较排列；选择or插入排序，来源于我们打扑克的洗牌以及变形；归并排序，很像小组先排序，然后班内排序，之后年级排序，最后全校排序。这些排序算法，都很符合生活的直觉，因此，这些算法对初学者来说很容易理解和掌握。<br>
另一类排序算法则反生活直觉，如快速排序、堆排序。快速排序要求两个指针向中间不停移动，堆排序需要构建大(小)顶堆，这些操作，与上一段提到的几种排序相反，你很难向一般的非编程人员描述清楚并指望他们理解。仔细想想，为何上一段的几种算法，他们会容易理解？无非是他们建立了生活常识，若对无生活常识的人，比如一个未入学的孩童，他未必能理解很简单的起泡排序。对于软件工程师来说，双指针、树(堆)也就是常识，也就是编程的常识。有了这些常识，遇到问题才会产生编程的直觉。<br>
我们不断的学习知识，就是为了培养我们的直觉。




### 三数之和
 [15. 三数之和](https://leetcode-cn.com/problems/3sum/) 是一个较能反应编程直觉的题目，有经验的工程师应当能反应出用双指针可以快速解决；同理，他应当反应出双指针处理这类问题的基础是数据有序，这样可以固定一侧然后推动左右两个指针夹逼的同时，亦可进行剪枝。<br>
```
public List<List<Integer>> threeSumsOptimize(int[] nums) {

      List<List<Integer>> lists = new ArrayList<>();
      if (nums.length < 3) return lists;
      Arrays.sort(nums);
      if (nums[0] > 0) return lists;//最小值肯定要小于等于=0
      int n = nums.length, left, right;
      for (int i = 0; i < n - 1; i++) {
          if (i > 0 && nums[i] == nums[i - 1]) continue;//排序+比较来去重复

          left = i + 1;
          right = n - 1;
          while (right > left) {

              if (nums[i] + nums[left] + nums[right] == 0) {
                  List<Integer> integers = new ArrayList<>();
                  integers.add(nums[i]);
                  integers.add(nums[left]);
                  integers.add(nums[right]);
                  lists.add(integers);
                  while (right > left && nums[left] == nums[left + 1]) left++;
                  while (right > left && nums[right] == nums[right - 1]) right--;

                  left++;
                  right--;
              } else if (nums[i] + nums[left] + nums[right] > 0) right--;
              else left++;
          }


      }

      return lists;

  }
```

### 四数之和
 [18. 四数之和](https://leetcode-cn.com/problems/4sum/) 是上一个题目的升级版本。做过上一个题目，产生的直觉进行加强，左右两端固定，中间两个指针推动，推动结束再移动右侧，右侧移动结束，再移动左侧，实现四轴运转：<br>
```
  class Solution:
      def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
          lists = []
          lens = len(nums)
          if lens < 4:
              return lists
          nums.sort()
          for i in range(0, lens - 3):
              if nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target:
                  break
              if i > 0 and nums[i] == nums[i - 1]:
                  continue
              j = lens - 1
              while j > 2:
                  if j < lens - 1 and nums[j] == nums[j + 1]:
                      j = j - 1
                      continue
                  left = i + 1
                  right = j - 1
                  while left < right:
                      sum = nums[i] + nums[j] + nums[left] + nums[right]
                      if sum == target:
                          lists.append([nums[i], nums[j], nums[left], nums[right]])
                          while nums[left] == nums[left + 1] and left < right:
                              left = left + 1
                          left = left + 1
                          while nums[right] == nums[right - 1] and left < right:
                              right = right - 1
                          right = right - 1
                      elif sum < target:
                          left = left + 1
                      else:
                          right = right - 1
                  j = j - 1
          return lists
```
> 这类题目用python做有天然优势, lists.append([nums[i], nums[j], nums[left], nums[right]]) 这行代码用java需要写得极为繁琐

### 番外篇之最接近的三数之和
 [16. 最接近的三数之和](https://leetcode-cn.com/problems/3sum-closest/) 是三数之和的变形，融合了dp的思想。<br>
```
  class Solution {
      public int threeSumClosest(int[] nums, int target) {
          int len = nums.length;
          int min = Integer.MAX_VALUE;
          Arrays.sort(nums);
           int sum,left,right,temp,current = Integer.MAX_VALUE;
          for(int i=0;i<len;++i){
              if(i>0 && nums[i]==nums[i-1])continue;
  
              left = i+1;right = len-1;
              while(left<right){
                  sum = nums[i] + nums[left] + nums[right];
                  if(sum==target)return target;
                  temp = Math.abs(sum - target);
                  if(temp< current){
                      current = temp;
                      min = sum;
                  }
                  if(sum <target){
                         while(left<right &&nums[left+1]==nums[left])left++;
                  left++;
                  } else{
                      while(left<right &&nums[right-1]==nums[right])right--;
                      right--;
                  }
              }
          }
          return min;
  
      }
  }
```

### 番外篇之存在重复元素 III
 [220. 存在重复元素 III](https://leetcode-cn.com/problems/contains-duplicate-iii/) 这个题目反而更像两数之和，不过对数据结构更加依赖，Treemap满足了可以快速查找到高于目标值(set.floor)和低于目标值(set.ceiling)的最近的数据,而set本身也是比较好的维护滑动窗口的数据结构<br>
```
 public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
     TreeSet<Long> set = new TreeSet<>();
     int len = nums.length;
     for (int i = 0; i < len; i++) {

         Long  floor = set.floor((long)nums[i] + (long)t);//防止溢出

         if(floor!=null &&  floor >= ((long)nums[i] - (long)t))
             return true;

         set.add((long)nums[i]);

         if(i>=k){//用这种下标方式删除来维护滑动窗口的效果更好
             set.remove((long)nums[i-k]);
         }


     }

     return false;


 }
```