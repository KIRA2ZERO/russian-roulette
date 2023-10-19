import { Context, Schema, h} from 'koishi'

import {} from '@koishijs/plugin-adapter-onebot'

export const name = 'russian-roulette'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export const usage: string = `
未给bot设置管理员权限将无法正常使用俄罗斯轮盘赌
`

declare module 'koishi' {
  interface Tables {
    russian_roulette_table: russian_roulette_table
  }
}

export interface russian_roulette_table {
  id: number
  clip:string[]
  channel:string
  time:any
}

export function apply(ctx: Context) {

  ctx.model.extend('russian_roulette_table', {
    id: 'unsigned',
    clip:'list',
    channel:'string',
    time:'string'
  }, {
    autoInc: true,
  })

  ctx.command('roulette','俄罗斯轮盘赌').alias(`俄罗斯轮盘赌`)
    .option('number','-n <number:posint> 设定左轮手枪的载弹量,默认值:6发',{fallback:6})
    .option('time','-t <time:posint> 设定左轮手枪的伤害,默认值:600秒',{fallback:600})
    .usage('使用教程 https://github.com/KIRA2ZERO/russian-roulette')
    .example('俄罗斯轮盘赌 -n 9 -t 1800')
    .action(async({session,options}) => {
      const row = await ctx.database.get('russian_roulette_table',{channel:session.channelId})
      
      if(row.length !== 0){
        session.send(h('quote',{id:session.messageId})+`每个群只能同时拥有一把左轮手枪`)
      }else{
        let number = options.number,
          time = options.time,
          clip = new Array(number).fill(''),
          random = Math.floor(Math.random()*6);
        for(let i = 0;i < clip.length; i++){i == random ? clip[i] = 'bullet':0}
        ctx.database.create('russian_roulette_table',{clip:clip,channel:session.channelId,time:time})
        session.send(h('quote',{id:session.messageId})+`载弹量为${number}发杀伤力为${time}秒的左轮手枪已装填,发送【扣下扳机】开枪`)
      }
    })

  ctx.command('roulette.shoot','扣下扳机').alias(`扣下扳机`)
    .example('扣下扳机')
    .action(async({session}) => {

      let row = await ctx.database.get('russian_roulette_table',{channel:session.channelId})
      if(typeof(row[0]) === "undefined"){
        session.send(h('quote',{id:session.messageId})+'扣下扳机失败,该群还没有启用的俄罗斯轮盘赌')
        return
      }

      let clip = row[0].clip,
          time = row[0].time;
      if(clip[0] == 'bullet'){
        session.send(h('quote',{id:session.messageId})+'你死了');
        session.bot.muteGuildMember(session.guildId,session.userId,time)
        ctx.database.remove('russian_roulette_table',{channel:session.channelId})
      }else{
        clip = clip.slice(1,clip.length)
        session.send(h('quote',{id:session.messageId})+`幸运存活但还剩${clip.length}颗子弹...`)
        ctx.database.set('russian_roulette_table',{channel:session.channelId},{clip:clip})
      }

    })
}
