---
layout: post
title: 算法笔记(五):并查集与朋友圈
---

### 并查集
我们往往说弗洛伊德算法很巧妙，几行代码就可以解决APSP(All Pairs Shortest Paths，多源最短路径)问题;其实并查集也很巧妙，检测无向图是否有环，核心代码只有一行:<br>

```
             int find(int index) {
                     return parent[index] == index ? index : find(parent[index]);
                 }
```

即使进行rank优化来压缩路径，并查集的代码量依然很少。不过并查集类型的题目往往可以用dfs/bfs解决，故算法题目中很少直接使用。而有一些题目，可以用dfs解决，但用并查集更符合人的直觉，比如省份类型、岛屿类型的问题，又比如朋友圈类型的问题。
<br>



### 朋友圈

 [547. 省份数量](https://leetcode-cn.com/problems/number-of-provinces/) 原本就是朋友圈问题，大约是为了规避腾讯的法务部，改成了省份数量，算法思路没有变化。利用并查集的思想最好解决这个问题，遍历完所有数据后，父亲的总数(所谓父亲，就是只有孩子没有parent的节点)就是朋友圈的总数。更直观来说，就像家庭图谱，但凡两个人追根溯源能找到一个老祖宗的，两个人就算亲戚，而老祖宗不是一个，那么就形成了不同的两个亲戚圈。<br>
 代码实现:<br>
 1.按rank进行并查集的构造和初始化
 
```
             int[] parent;
                int[] rank;
            
            
                void initialize(int n) {
                    parent = new int[n];
                    rank = new int[n];
                    for (int i = 0; i < n; i++) {
                        parent[i] = i;
                    }
                }
            
                int find(int index) {
                    return parent[index] == index ? index : find(parent[index]);
                }
            
                void union(int x, int y) {
                    int root_x = find(x);
                    int root_y = find(y);
                    if (root_x == root_y) return;
                    if (rank[root_x] > rank[root_y]) {
                        parent[root_y] = root_x;
                    } else if (rank[root_x] < rank[root_y]) {
                        parent[root_x] = root_y;
                    } else {
                        parent[root_x] = root_y;
                        rank[root_y]++;
                    }
                }
```

2.迭代所有数据
```
                     for (int i = 0; i < n; i++) {
                         for (int j = i+1; j < n; j++) {
                             if(isConnected[i][j]==1){
                                 union(i,j);
                             }
                         }
                     }
```

3.统计所有无父亲节点(父亲节点是自己)的节点
```
        for (int i = 0; i < n; i++) {
            if(parent[i]==i)++provinces;

        }
```

<br/>


### 课程表

图论的问题普遍比较棘手，倒并不是题目难，而是无从下手。比如课程表类问题，属于拓扑排序的问题，也算是图论里重要的一块。这类问题与动态规划相反，想出解法很容易，代码实现非常难，甚至无从下手。<br>
以 [210. 课程表 II](https://leetcode-cn.com/problems/course-schedule-ii/) 为例。
```
现在你总共有 n 门课需要选，记为0到n-1。

在选修某些课程之前需要一些先修课程。例如，想要学习课程 0 ，你需要先完成课程1 ，我们用一个匹配来表示他们: [0,1]

给定课程总量以及它们的先决条件，返回你为了学完所有课程所安排的学习顺序。

可能会有多个正确的顺序，你只要返回一种就可以了。如果不可能完成所有课程，返回一个空数组。


```

<br>
拓扑排序通常可以用dfs/bfs实现，在运算中构建有向图并判断是否有环，同时借助栈记录其中一个顺序。下面以dfs为例子:

```
class Solution {
    // 存储有向图
    List<List<Integer>> edges;
    // 标记每个节点的状态：0=未搜索，1=搜索中，2=已完成
    int[] visited;
    // 用数组来模拟栈，下标 n-1 为栈底，0 为栈顶
    int[] result;
    // 判断有向图中是否有环
    boolean valid = true;
    // 栈下标
    int index;

    public int[] findOrder(int numCourses, int[][] prerequisites) {
        edges = new ArrayList<List<Integer>>();
        for (int i = 0; i < numCourses; ++i) {
            edges.add(new ArrayList<Integer>());
        }
        visited = new int[numCourses];
        result = new int[numCourses];
        index = numCourses - 1;
        for (int[] info : prerequisites) {
            edges.get(info[1]).add(info[0]);
        }
        // 每次挑选一个「未搜索」的节点，开始进行深度优先搜索
        for (int i = 0; i < numCourses && valid; ++i) {
            if (visited[i] == 0) {
                dfs(i);
            }
        }
        if (!valid) {
            return new int[0];
        }
        // 如果没有环，那么就有拓扑排序
        return result;
    }

    public void dfs(int u) {
        // 将节点标记为「搜索中」
        visited[u] = 1;
        // 搜索其相邻节点
        // 只要发现有环，立刻停止搜索
        for (int v: edges.get(u)) {
            // 如果「未搜索」那么搜索相邻节点
            if (visited[v] == 0) {
                dfs(v);
                if (!valid) {
                    return;
                }
            }
            // 如果「搜索中」说明找到了环
            else if (visited[v] == 1) {
                valid = false;
                return;
            }
        }
        // 将节点标记为「已完成」
        visited[u] = 2;
        // 将节点入栈
        result[index--] = u;
    }
}

```




