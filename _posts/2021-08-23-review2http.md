---
layout: post
title: 温故知新之HTTP
---

### HTTP与长连接

通常的认知里，http是无状态的，可以看作短连接。可是在http1.1发布之初(1996年6月)即支持长连接（PersistentConnection）和请求的流水线（Pipelining）， 2.0更是直接支持了复用。

短连接有两个比较大的问题：1，创建新连接耗费的时间尤为明显；2，TCP 连接的性能只有在该连接被使用一段时间后(热连接)才能得达到最佳。长连接的出现，解决了这两个问题。长连接会保持一段时间，重复用于发送一系列请求，节省了新建 TCP 连接握手的时间，还可以利用 TCP 的性能增强能力。当然这个连接也不会一直保留着：连接在空闲一段时间后会被关闭。
长连接也还是有缺点的；就算是在空闲状态，它还是会消耗服务器资源，而且在重负载时，还有可能遭受 DoS attacks 攻击。

流水线是复用的前身。流水线是在同一条长连接上发出连续的请求，而不用等待应答返回。这样可以避免连接延迟。理论上讲，性能还会因为两个 HTTP 请求有可能被打包到一个 TCP 消息包中而得到提升。
流水线的缺点是：正确的使用很麻烦，需要了解传输的资源、有效带宽，处理不当的话，重要的消息可能被延迟到不重要的消息后面。另外一个关键的缺点是【队首阻塞】(即HOT)

[![hUykp4.md.png](https://z3.ax1x.com/2021/08/31/hUykp4.md.png)](https://imgtu.com/i/hUykp4)

### 域名分片
如果服务器端想要更快速的响应网站或应用程序的应答，它可以突破浏览器对单一域名的最大连接数限制。例如，不要在同一个域名下获取所有资源，假设有个域名是 `www.example.com`，我们可以把它拆分成好几个域名：`www1.example.com、www2.example.com、www3.example.com`。所有这些域名都指向同一台服务器，浏览器会同时为每个域名建立 6 条连接


### HTTP2与多路复用
1. 二进制分帧,HTTP/2是二进制协议而不是文本协议<br>
2. 这是一个复用协议。并行的请求能在同一个链接中处理，移除了HTTP/1.x中顺序和阻塞的约束。<br>
3. 压缩了headers。因为headers在一系列请求中常常是相似的，其移除了重复和传输重复数据的成本。HTTP/2 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键－值对，对于相同的数据，不再通过每次请求和响应发送<br>
4. 允许服务器在客户端缓存中填充数据，通过一个叫服务器推送的机制来提前请求。某些资源客户端是一定会请求的，这时就可以采取服务端 push 的技术，提前给客户端推送必要的资源，这样就可以相对减少一点延迟时间.<br>

h2的重点概念:
流（stream）：流是连接中的一个虚拟信道，可以承载双向的消息；每个流都有一个唯一的整数标识符（1、2…N）<br>
消息（message）：指逻辑上的 HTTP 消息，比如请求、响应等，由一或多个帧组成<br>
帧（frame）：HTTP/2 通信的最小单位，每个帧包含帧首部，至少也会标识出当前帧所属的流，承载着特定类型的数据，如 HTTP 首部、负荷等<br>


### 队头阻塞问题
HTTP/2解决了HTTP的队头阻塞问题，但是并没有解决TCP队头阻塞问题
HTTP/2因为没有顺序了，所以就不需要阻塞了，就有效的解决了HTTP对队头阻塞的问题。
TCP传输过程中会把数据拆分为一个个按照顺序排列的数据包，这些数据包通过网络传输到了接收端，接收端再按照顺序将这些数据包组合成原始数据，这样就完成了数据传输。但是如果其中的某一个数据包没有按照顺序到达，接收端会一直保持连接等待数据包返回，这时候就会阻塞后续请求。这就发生了TCP队头阻塞。HTTP/1.1的管道化持久连接也是使得同一个TCP链接可以被多个HTTP使用，但是HTTP/1.1中规定一个域名可以有6个TCP连接。而HTTP/2中，同一个域名只是用一个TCP连接。所以，在HTTP/2中，TCP队头阻塞造成的影响会更大，因为HTTP/2的多路复用技术使得多个请求其实是基于同一个TCP连接的，那如果某一个请求造成了TCP队头阻塞，那么多个请求都会受到影响。<br>
HTTP通信时间总和 = TCP连接时间 + HTTP交易时间 = 1.5 RTT + 1 RTT = 2.5 RTT
TCP三次握手的过程客户端和服务器之间需要交互三次，那么也就是说需要消耗1.5 RTT。另外，如果使用的是安全的HTTPS协议，就还需要使用TLS协议进行安全数据传输，这个过程又要消耗一个RTT（TLS不同版本的握手机制不同，这里按照最小的消耗来算）那么也就是说，一个纯HTTP/2的连接，需要消耗1.5个RTT，如果是一个HTTPS连接，就需要消耗3-4个RTT。



### HTTP3与QUIC 协议

HTTP/3 基于 UDP 协议的 QUIC(Quick UDP Internet Connection) 协议.0RTT 建连 无延迟连接
QUIC通过使用类似 TCP 快速打开的技术，缓存当前会话的上下文，在下次恢复会话的时候，只需要将之前的缓存传递给服务端验证通过就可以进行传输了。0RTT 建连可以说是 QUIC 相比 HTTP/2 最大的性能优势.
由于建立在 UDP 的基础上，同时又实现了 0RTT 的安全握手，所以在大部分情况下，只需要 0 个 RTT 就能实现数据发送，在实现前向加密的基础上，并且 0RTT 的成功率相比 TLS 的会话记录单要高很多。
[![hUyx8e.md.png](https://z3.ax1x.com/2021/08/31/hUyx8e.md.png)](https://imgtu.com/i/hUyx8e)

因为 TCP 是基于 IP 和端口去识别连接的，这种方式在多变的移动端网络环境下是很脆弱的。而 QUIC 是通过 ID 的方式去识别一个连接，不管你网络环境如何变化，只要 ID 不变，就能迅速重连上
QUIC 协议有一个非常独特的特性，称为前向纠错（Forward Error Correction，FEC），每个数据包除了它本身的内容之外，还包括了部分其它数据包的数据，因此少量的丢包可以通过其它包的冗余数据直接组装而无需重传。
前向纠错牺牲了每个数据包可以发送数据的上限，但是减少了因为丢包导致的数据重传次数。这会取得更好的效果，因为数据重传将会消耗更多的时间，包括确认数据包丢失、请求重传与等待新数据包等步骤。

> 快手的KCP，谷歌的QUIC，都是基于UDP的。B站 在Web 上大规模铺开了QUIC/HTTP3 ， 使用UDP替代了TCP进行视频传输，期待更快的提高打开时间和降低卡顿。



### url漂流记
1. 在浏览器中输入url地址，回车或者点击转到
2. 浏览器检查输入的URL是否合法
3. 浏览器对URL进行分析和拆解
4. IP地址DNS查询
    查询浏览器缓存->查询系统缓存->向DNS服务器发起查询请求->根域名服务器
5. 调用Socket发送数据
   应用层:客户端在应用层发送HTTP请求
   传输层:在传输层（TCP）加入端口号
   网络层:在网络层（IP）加入IP地址
   数据链路层:在数据链路层加入MAC地址
6. Web Server服务接收到请求报文
   应用服务器：Weblogic、Tomcat 、Web Server：IIS、Apache,可能前置有网关、代理服务器等等
7. 阅读HTTP请求内容/参数信息/cookies
8. 服务进行操作或处理，生成HTTP响应，编码后传输
9. 客户端接收请求并解码，用浏览器渲染引擎将文档进行解析，构建DOM树
10. 浏览器使用CPU、GPU完成网页渲染

### UDP 优点
1. 无需建立连接，因此没有建立连接的时延，比如DNS假如运行在TCP就会慢很多。
2. 无连接状态，不需要像TCP那样维护连接状态
3. 头部开销小，TCP头部有20B，UDP只有8B
4. 没有拥塞控制，网络中的拥塞不会影响主机的发送效率，应用层能更好地控制要发送的数据和发送时间
5. UDP支持1对1，1对多，多对1，多对多的通信。适合一次性传输少量数据的，比如DNS、SNMP；适合对可靠性要求不高的场景，比如多媒体、视频电话等，TCP的拥塞控制会导致延迟很大。


### TCP 特点
1. 每个连接只能有2个端点，故只能1对1，点对点
2. 保证可靠、无差错、不丢失、不重复、有序
3. 全双工，双方都可以发送消息
4. 流量控制：提供基于滑动窗口协议的流量控制机制来消除发送方发送频率太快使接收方缓存区溢出的可能性
5. 拥塞控制：防止过多的数据注入网络，保证网络中路由器或者链路不至于过载，是一个全局性的过程，涉及到主机和路由器等等。方法有：慢开始、拥塞避免、快重传、快恢复。
   

> 《图解HTTP》

> 文档资料:https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP 

> 网络延迟又称为 RTT（Round Trip Time）

> https://www.ianlewis.org/ 此网站使用了h2协议
