## lambda改善你的代码


java8开始的lambda接触到现在差不多三年了，fp用起来真的是越用越舒服。最近做的一个项目，需要对excel内容做校验，
这次尝试使用`optional`和`Collectors.groupingBy`来做，干掉那些让人看着就想吐的`if...else`
### Collectors.groupingBy


```
//重复数据校验
        Map<DecorationFeatureRule, Long> result =
                list.stream().collect(
                        Collectors.groupingBy(e->new DecorationFeatureRule()
                                        .setChnl_cd(e.getChnl_cd())
                                        .setGeo_id(e.getGeo_id())
                                        .setStore_decorat_fetru(e.getStore_decorat_fetru())
                                        .setCeiling_decoration(e.getCeiling_decoration()).setAisle(e.getAisle()).setShelf(e.getShelf()).setHygiene(e.getHygiene())
                                ,Collectors.counting()
                        )
                );

        List<DecorationFeatureRule> collect = result.entrySet().stream().filter(e -> e.getValue() > 1).map(Map.Entry::getKey).collect(Collectors.toList());

        if(CollectionUtils.isNotEmpty(collect))
            throw new IllegalArgumentException("数据重复:"+collect.get(0).toString());

```
其实上面的语法还是再精简一些，不过为了方面debug和其他同事review，暂时保留目前的形态


### Optional

```
         //格式校验
         list.forEach(e -> {
 
             e.setCeiling_decoration(Optional.ofNullable(ceiling_decoration.get(e.getCeiling_decoration())).orElseThrow(() -> new IllegalArgumentException("天花板装修格式错误")));
             e.setAisle(Optional.ofNullable(aisle.get(e.getAisle())).orElseThrow(() -> new IllegalArgumentException("过道情况格式错误")));
             e.setShelf(Optional.ofNullable(shelf_quality.get(e.getShelf())).orElseThrow(() -> new IllegalArgumentException("货架质量格式错误")));
             e.setHygiene(Optional.ofNullable(hygiene.get(e.getHygiene())).orElseThrow(() -> new IllegalArgumentException("店内卫生情况格式错误")));
             e.setStore_decorat_fetru(Optional.ofNullable(decoration.get(e.getStore_decorat_fetru())).orElseThrow(() -> new IllegalArgumentException("门店装潢格式错误")));
             Optional.ofNullable(gdtDimChanlFromCache.get(e.getChnl_cd())).orElseThrow(() -> new IllegalArgumentException("渠道错误" + e.getChnl_cd()));
 
         });
```

我是对`NPE`无比厌倦和恐怖的人，但是为了程序的健壮，被迫写了太多的`if...else`来处理`NPE`,Optional真的是我的救星，太棒了！

### 其他

再看`lombok`的代码风格：
```
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Log4j2
public class DecorationFeatureRule

```
懂的程序员，自然知道这几行代码省了代码量。<br>

java历来为人诟病的一大缺点是代码过于冗长，曾经有前端同事吐槽：`多次想转java，但是每次看到java那么垃圾那么长的代码，就立刻放弃，我还想留着发际线！`<br>
`lombok` 和`lambda`真的是降低java代码冗余的两大甜品。从事java的朋友,多多使用这两大利器，加上链式编程，让你的代码质量更上一层楼。

### 多说一句
最近在烟台出差，见识了北方的雪，真的开心。马上周末，准备在一个挺出名的开源项目上加点功能，大家等我的消息！

[![lhqG5D.md.png](https://s2.ax1x.com/2020/01/10/lhqG5D.md.png)](https://github.com/rongjoker/quarantineJ)
