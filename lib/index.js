"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'russian-roulette';
exports.Config = koishi_1.Schema.object({});
function apply(ctx) {
    ctx.model.extend('russian_roulette_table', {
        id: 'unsigned',
        clip: 'list',
        channel: 'string',
        time: 'string'
    }, {
        autoInc: true,
    });
    ctx.command('roulette', '俄罗斯轮盘赌').alias(`俄罗斯轮盘赌`)
        .option('number', '-n <number:posint> 设定左轮手枪的载弹量,默认值:6发', { fallback: 6 })
        .option('time', '-t <time:posint> 设定左轮手枪的伤害,默认值:600秒', { fallback: 600 })
        .usage('使用教程 https://github.com/KIRA2ZERO/russian-roulette')
        .example('俄罗斯轮盘赌 -n 9 -t 1800')
        .action(async ({ session, options }) => {
        await session.onebot.getGroupMemberInfo(session.channelId, session.bot.selfId)
            .then(async (botInfo) => {
            if (botInfo['role'] != 'admin' && botInfo['role'] != 'owner') {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `未给bot设置管理员权限无法启用俄罗斯轮盘赌`);
            }
            else {
                return await ctx.database.get('russian_roulette_table', { channel: session.channelId });
            }
        })
            .then(async (row) => {
            if (row.length !== 0) {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `每个群只能同时拥有一把左轮手枪`);
            }
            else {
                let number = options.number, time = options.time, clip = new Array(number).fill(''), random = Math.floor(Math.random() * 6);
                for (let i = 0; i < clip.length; i++) {
                    i == random ? clip[i] = 'bullet' : 0;
                }
                ctx.database.create('russian_roulette_table', { clip: clip, channel: session.channelId, time: time });
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `载弹量为${number}发杀伤力为${time}秒的左轮手枪已装填,发送【扣下扳机】开枪`);
            }
        });
    });
    ctx.command('roulette.shoot', '扣下扳机').alias(`扣下扳机`)
        .example('扣下扳机')
        .action(async ({ session }) => {
        let row = await ctx.database.get('russian_roulette_table', { channel: session.channelId });
        if (typeof (row[0]) === "undefined") {
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + '扣下扳机失败,该群还没有启用的俄罗斯轮盘赌');
            return;
        }
        let clip = row[0].clip, time = row[0].time;
        if (clip[0] == 'bullet') {
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + '你死了');
            let info = await session.onebot.getGroupMemberInfo(session.channelId, session.userId);
            const botInfo = await session.onebot.getGroupMemberInfo(session.channelId, session.bot.selfId);
            if (botInfo['role'] === 'owner') {
                session.onebot.setGroupBan(session.channelId, session.userId, time);
            }
            else if (botInfo['role'] === 'admin') {
                (info['role'] == 'member') ? session.onebot.setGroupBan(session.channelId, session.userId, time) : session.send('权限不足禁言失败');
            }
            else {
                session.send('权限不足禁言失败');
            }
            ctx.database.remove('russian_roulette_table', { channel: session.channelId });
        }
        else {
            clip = clip.slice(1, clip.length);
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `幸运存活但还剩${clip.length}颗子弹...`);
            ctx.database.set('russian_roulette_table', { channel: session.channelId }, { clip: clip });
        }
    });
}
exports.apply = apply;
