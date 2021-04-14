---
layout: post
title: 算法笔记(六):几种特殊的数据结构
---

### 数据结构与算法
有句老话是程序就是数据结构与算法，即使是操作系统这样复杂的程序。<br>
数据结构是算法的前提，以leetcode之类的刷题网站来说，考察的算法较为朴素，更多的是考察数据结构的运用。而学好数据结构，在日常工作中解决一些棘手问题，往往能起到事半功倍的效果。<br>
除了教材中学到的链表、树、图、哈希、堆栈之类的常见数据结构外，有些高阶的数据结构也值得学习，其设计堪称诡谲、其用途堪称巧妙。
<br>



### 前缀树

前缀树(Trie)又称字典树，是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。使用过solr或者es等倒排索引工具的开发者应该对此比较敏感。[208. 实现 Trie (前缀树)](https://leetcode-cn.com/problems/implement-trie-prefix-tree/) 即是前缀树的设计题目。<br>
前缀树本质是一种树，不过这种树比较特殊，以英文小写字串为例，每个节点有26个子节点，同时每个节点除了存储字母外,附带一个是否结束的标识，如果结束则说明能搜索到结果，否则仅仅是前缀。原理简单，检索的复杂度也极低(O(n))，大道至简。
<br>
首先是初始化:
```
    private final Trie[] children;
    private boolean isEnd;

    public Trie() {
        children = new Trie[26];
        isEnd = false;
    }
```
<br>
接着是插入，这里比较巧妙的一点是利用char -'a'获取下标，实现按下标取值:

```
    private final Trie[] children;
    private boolean isEnd;

    public Trie() {
        children = new Trie[26];
        isEnd = false;
    }
```

<br>
然后就是检索，这里只列举核心的前缀检索，实际结果判断下是否结束即可实现全词匹配搜索和前缀搜索的功能:

```
    private Trie searchPrefix(String prefix) {
        Trie node = this;
        for (int i = 0; i < prefix.length(); i++) {
            char ch = prefix.charAt(i);
            int index = ch - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        return node;
    }

```



