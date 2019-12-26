## Tomcat 是如何实现keep-alive

http无状态，又是基于tcp，所以每次请求都要握手分手，在频繁的请求来说，很是浪费，且没有必要。
于是就有了大家都知道的keep-alive。关于keep-alive的概念，网上一大堆，我就不重复了，盗一张图，描述一下：
<p align="center">
  <img src="https://github.com/rongjoker/rongjoker.github.io/blob/joker_dev/blog/tomcat2keepalive/1.png?raw=true" alt="keepAlive">
</p>

<p>keep-alive主要靠服务器实现,那么问题来了，作为java程序的主流服务容器，tomcat 是如何实现keep-alive的呢？</p>

<p>先看tomcat,以主流的nio实现为例</p>

<p>在NioEndpoint.SocketProcessor#doRun的方法中会处理三次握手:</p>


```

                if (handshake == 0) {
                    log.info("开启三次握手验证");
                    SocketState state = SocketState.OPEN;
                    // Process the request from this socket
                    if (event == null) {
                        log.info("state = getHandler().process(socketWrapper, SocketEvent.OPEN_READ);");
                        state = getHandler().process(socketWrapper, SocketEvent.OPEN_READ);
                    } else {
                        log.info("state = getHandler().process(socketWrapper, event);");
                        state = getHandler().process(socketWrapper, event);
                    }
                    if (state == SocketState.CLOSED) {
                        poller.cancelledKey(key, socketWrapper);
                    }
                } else if (handshake == -1 ) {
                    getHandler().process(socketWrapper, SocketEvent.CONNECT_FAIL);
                    poller.cancelledKey(key, socketWrapper);
                } else if (handshake == SelectionKey.OP_READ){
                    socketWrapper.registerReadInterest();
                } else if (handshake == SelectionKey.OP_WRITE){
                    socketWrapper.registerWriteInterest();
                }

```

处理后的finally会将当前的SocketProcessor加入到缓存中

```
                if (running && !paused && processorCache != null) {
                    processorCache.push(this);
                }
```



下次Poller在执行processSocket 中会先判断processorCache是否为空，不为空则拿出来直接使用，跳过三次握手

<p>就这么简单吗？</p>
仔细想想，好像不对，tomcat是怎么判断两次请求是应该复用同一个processSocket的呢？除非，第一次创建socketChannel没有关闭。
那就意味着，这个socketChannel一直阻塞在work threadPool里？！太可怕，所以tomcat 对keep-alive有很苛刻的要求，线程池容量不够的情况下也不支持。

> 这篇文章写完大半年后，看到了H大的文章，不禁眼泪掉下来。我将这篇文章大部分内容删掉，只保留了自己的思考和线索。以后这类文章少写，或者放在自己的备忘录就好了。
> H大的文章地址：[tomcat对keep-alive的实现逻辑](http://hongjiang.info/how-tomcat-implements-keep-alive/)