# koishi-plugin-russian-roulette

[![npm](https://img.shields.io/npm/v/koishi-plugin-russian-roulette?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-russian-roulette)

俄罗斯轮盘赌

# 指令：roulette

+ 基本语法：`roulette`
+ 别名： `俄罗斯轮盘赌`
+ 选项列表：
    + `number -n <number:posint> 设定左轮手枪的载弹量,默认值:6发`  
    + `time -t <time:posint> 设定左轮手枪的伤害,默认值:600秒`
+ 用法：`按照示例输入命令即可获得一把载弹数为9发杀伤力为1800秒的左轮手枪`
+ 注意事项：`未给bot设置管理员权限无法获得左轮手枪且每个群只能同时拥有一把左轮手枪`
+ 示例：`俄罗斯轮盘赌 -n 9 -t 1800`

# 指令：roulette.shoot

+ 基本语法：`roulette.shoot`
+ 别名： `扣下扳机`
+ 用法：`按照示例输入命令即可打出当前群聊中左轮手枪的子弹`
+ 注意事项：`bot管理员无法禁言其他管理员和群主`
+ 示例：`扣下扳机`

