// 把《小红书古风提示词合集.md》转成 src/data/themes.json
// 规则见 ../../数据处理Prompt.md
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../小红书古风提示词合集.md');
const OUT = resolve(__dirname, '../src/data/themes.json');

// —— 主题颜色映射（根据主题名语义判定） —— //
// 这些色用于卡片墙背景渐变的基色，透明度 15-25%
const THEME_COLOR = {
  赤梦流霞: '#C94A4A',
  凤冠霞帔: '#B84545',
  幻紫: '#9B7AB8',
  金色流光: '#C9A96E',
  静夜庭院: '#3E4A66',
  蓝色梦境: '#6A8BB0',
  柿柿如意: '#D97B4A',
  霜雪: '#B8C4CC',
  新年快乐: '#C94A4A',
  雪落深宫: '#A8B5C0',
  雪夜侠女: '#4A6380',
  雪拥长安: '#8FA8B8',
  雪原征战: '#5A6B7A',
  '樱·雪': '#E8A5B8',
  云光拾梦: '#B0C5D4',
  '故宫·雪': '#B5593E',
  '故宫·雪2': '#B5593E',
  红梅冬庭: '#C94A4A',
  护国公主: '#B8763A',
  江南冬雪: '#8FA4B0',
  千里江山: '#4A7A5E',
  山水流光: '#5E8A6E',
  '天坛·雪': '#8FA4B8',
  夜游牡丹: '#7A3A5A',
  战国袍白: '#C0B8A8',
  大唐盛世: '#C9A96E',
  战国袍: '#8B3A3A',
  前朝公主: '#A8536B',
  绿色战国袍: '#4A7A5E',
  北平的秋: '#B8763A',
  粉色的雪: '#E8A5B8',
  秋日银杏: '#D4A24C',
  梦幻星河: '#5A5A8B',
  星夜百合: '#4A5A7A',
  丁香庭院: '#A88FB5',
  枫林晚秋: '#C96A3A',
  金秋新桂: '#C9A96E',
  荷风吟: '#6A9B7A',
  雪地红梅: '#C94A4A',
  竹林清影: '#6A8B5A',
  梨花笑: '#D5D8CC',
  春日宴: '#A8C4B8',
};

// —— poseLabel 关键词识别表（按优先级匹配，先精确后宽泛） —— //
const POSE_RULES = [
  // 超大/纯脸特写类
  [/纯人脸超大特写|超大人脸特写|面部特写|人脸特写|面部超大特写/, '面部特写'],
  // 祈祷
  [/虔诚祈祷|双手合十/, '虔诚祈祷'],
  // 持剑类
  [/剑指镜头/, '剑指镜头'],
  [/剑尖插雪|剑尖抵地|剑尖/, '剑尖入雪'],
  [/双手持剑|手持剑|持剑/, '持剑而立'],
  // 抚琴
  [/抚琴|拨弦/, '抚琴浅吟'],
  // 骑马
  [/骑马|策马/, '策马披甲'],
  // 花瓣/光粒 接取
  [/抬手接花瓣|抬手接光粒|抬手接|接花瓣|接光粒/, '抬手承瓣'],
  // 旋身
  [/轻轻旋身|旋身|转身展袖/, '旋身流霞'],
  // 行走回眸
  [/行走.{0,6}回眸|行走.{0,6}回头|缓步.{0,6}回眸/, '行走回眸'],
  // 回眸类
  [/轻轻回眸|回眸浅笑|回眸瞬间|回眸|回头|回望|回首/, '回眸一瞬'],
  // 背影
  [/背对镜头|背对|背向镜头|背向/, '背影凝望'],
  // 望月/仰头
  [/仰头望月|仰望|仰首|仰头/, '仰首望月'],
  // 半蹲
  [/半蹲|蹲下/, '半蹲拾瓣'],
  // 单膝
  [/单膝/, '单膝轻触'],
  // 坐于/盘膝
  [/盘膝/, '盘膝静坐'],
  [/坐于湖畔|坐于石|坐于书案|坐于栏|坐于/, '静坐凝思'],
  // 倚
  [/倚树|倚柱|倚栏|倚/, '倚物静立'],
  // 扶
  [/扶发饰|扶发|扶栏杆|扶栏|扶石|扶/, '扶栏浅立'],
  // 持扇/团扇
  [/手持团扇|团扇/, '执扇静立'],
  [/手持折扇|折扇/, '执折扇立'],
  // 侧身
  [/侧身回望|侧身剪影|侧身|侧脸/, '侧身凝望'],
  // 广袖展开
  [/广袖展开|广袖.{0,4}展开/, '广袖轻扬'],
  // 正面站立 / 交叠
  [/正面站立|双手交叠|正对镜头/, '正面伫立'],
  // 中景/近景
  [/近景人像/, '近景人像'],
  [/中景构图/, '中景构图'],
  [/全身构图/, '全身构图'],
];

function matchPose(text) {
  for (const [re, label] of POSE_RULES) {
    if (re.test(text)) return label;
  }
  return '意境画面';
}

// 取 "去掉共享前缀之后的那段独有文字"，作为差异描述的来源
function stripSharedPrefix(variantText, sharedPrefix) {
  if (sharedPrefix && variantText.startsWith(sharedPrefix)) {
    return variantText.slice(sharedPrefix.length).trim();
  }
  return variantText.trim();
}

// 求多个字符串的最长公共前缀
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}

// 抽取 20 字以内的差异描述：从 prompt 尾部（变体独有内容常驻位置）找动作/构图描述
// 优先命中 动作/镜头关键词 邻近的短句
const DESC_KEYWORDS = [
  '回眸','回头','回望','回首','旋身','转身',
  '抬手接','抬手','半蹲','单膝','盘膝','坐于','倚',
  '扶栏','扶发','扶石',
  '持剑','剑指','剑尖',
  '抚琴','祈祷','骑马','策马',
  '仰头','仰望','仰首',
  '侧身','侧脸','背对','背向',
  '正面站立','正对镜头','双手交叠','广袖',
  '近景人像','中景构图','全身','面部特写','超大','纯人脸','特写',
  '手持团扇','团扇','手持折扇','折扇',
];

function buildDescription(fullPrompt, poseLabel) {
  const text = fullPrompt.replace(/\s+/g, '');
  const isMood = poseLabel === '意境画面';
  // "意境画面"类：差异在场景（开头）→ 直接取开头第一句
  if (isMood) {
    const opening = text.replace(/^古风女子|^女子/, '').slice(0, 60);
    const m = opening.match(/[^，。；、]{6,20}/);
    if (m) return m[0].length > 20 ? m[0].slice(0, 20) : m[0];
    return poseLabel;
  }
  // 其它：动作差异在尾段
  const tail = text.slice(Math.floor(text.length * 0.45));

  // 找包含关键词的最近句子
  for (const kw of DESC_KEYWORDS) {
    const idx = tail.indexOf(kw);
    if (idx === -1) continue;
    // 往前找上一个句/逗号
    let start = idx;
    while (start > 0 && !'，。；、'.includes(tail[start - 1])) start--;
    // 往后找下一个句/逗号
    let end = idx + kw.length;
    while (end < tail.length && !'，。；、'.includes(tail[end])) end++;
    let seg = tail.slice(start, end);
    if (seg.length > 20) {
      // 以关键词居中裁剪
      const kwMid = idx - start + Math.floor(kw.length / 2);
      const left = Math.max(0, kwMid - 10);
      seg = seg.slice(left, left + 20);
    }
    if (seg.length >= 4) return seg;
  }

  // 兜底：后半段的第一个 8-20 字短句
  const m = tail.match(/[^，。；、]{6,20}/);
  if (m) return m[0].length > 20 ? m[0].slice(0, 20) : m[0];
  return poseLabel;
}

// —— 手工撰写 tagline —— //
const TAGLINE = {
  赤梦流霞: '红霞花雾中',
  凤冠霞帔: '丹陛雪中仪',
  幻紫: '紫雾梦初醒',
  金色流光: '金雾花林间',
  静夜庭院: '夜阑人未眠',
  蓝色梦境: '冰蓝花海雪',
  柿柿如意: '暖橘小团圆',
  霜雪: '霜色入素衣',
  新年快乐: '瑞雪贺新岁',
  雪落深宫: '雪打朱墙静',
  雪夜侠女: '月下银锋冷',
  雪拥长安: '长安夜微雪',
  雪原征战: '荒原战袍风',
  '樱·雪': '粉樱逢初雪',
  云光拾梦: '云端拾星月',
  '故宫·雪': '朱墙金瓦雪',
  '故宫·雪2': '御道雪无声',
  红梅冬庭: '梅枝一点红',
  护国公主: '盛唐剑戟风',
  江南冬雪: '烟雨江南雪',
  千里江山: '青绿千里开',
  山水流光: '山河光中行',
  '天坛·雪': '祭坛云雪净',
  夜游牡丹: '牡丹夜未央',
  战国袍白: '素袍立风雪',
  大唐盛世: '盛唐金冠华',
  战国袍: '战国血色袍',
  前朝公主: '朱墙前朝梦',
  绿色战国袍: '碧袍战国风',
  北平的秋: '秋色满故都',
  粉色的雪: '粉雪落樱枝',
  秋日银杏: '银杏满阶黄',
  梦幻星河: '星河入袖底',
  星夜百合: '夜幕百合开',
  丁香庭院: '丁香满庭香',
  枫林晚秋: '枫叶落长秋',
  金秋新桂: '桂华金秋月',
  荷风吟: '荷风轻拂面',
  雪地红梅: '雪地一枝梅',
  竹林清影: '竹影风中立',
  梨花笑: '梨花照春雪',
  春日宴: '春日花下宴',
};

function buildTagline(themeName) {
  return TAGLINE[themeName] || '';
}

// —— 主解析 —— //
const raw = readFileSync(SRC, 'utf-8');
const lines = raw.split(/\r?\n/);

const themes = [];
let cur = null;
let curVariantBuf = null;
let curVariantIdx = 0;

function flushVariant() {
  if (cur && curVariantBuf !== null) {
    const promptText = curVariantBuf.trim();
    if (promptText) {
      cur.variants.push({ id: `v${curVariantIdx}`, prompt: promptText });
    }
  }
  curVariantBuf = null;
}

for (const line of lines) {
  if (/^#\s+/.test(line)) {
    // 新主题
    flushVariant();
    if (cur) themes.push(cur);
    const name = line.replace(/^#\s+/, '').trim();
    cur = { name, variants: [] };
    curVariantIdx = 0;
  } else if (/^##\s+/.test(line)) {
    flushVariant();
    curVariantIdx += 1;
    curVariantBuf = '';
  } else if (curVariantBuf !== null) {
    curVariantBuf += (curVariantBuf ? '\n' : '') + line;
  }
}
flushVariant();
if (cur) themes.push(cur);

// —— 为每个主题/变体补齐字段 —— //
let totalVariants = 0;
let longPrompts = [];

const themesOut = themes.map((t, idx) => {
  const themeId = `t${String(idx + 1).padStart(2, '0')}`;
  const variantPrompts = t.variants.map(v => v.prompt);
  const shared = longestCommonPrefix(variantPrompts);

  const variants = t.variants.map(v => {
    const diff = stripSharedPrefix(v.prompt, shared);
    const searchText = diff || v.prompt;
    const poseLabel = matchPose(searchText);
    const description = buildDescription(v.prompt, poseLabel);
    totalVariants += 1;
    if (v.prompt.length > 800) longPrompts.push(`${t.name} · ${v.id}（${v.prompt.length} 字）`);
    return {
      id: v.id,
      poseLabel,
      description,
      prompt: v.prompt,
    };
  });

  const color = THEME_COLOR[t.name] || '#6B7A74';
  const tagline = buildTagline(t.name);

  return {
    id: themeId,
    name: t.name,
    tagline,
    color,
    variants,
  };
});

// —— 输出 —— //
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ themes: themesOut }, null, 2), 'utf-8');

console.log(`✓ 写入 ${OUT}`);
console.log(`  主题数：${themesOut.length}`);
console.log(`  变体数：${totalVariants}`);
if (longPrompts.length) {
  console.log(`  过长 prompt（>800 字）：${longPrompts.length} 条`);
  longPrompts.slice(0, 5).forEach(s => console.log(`    - ${s}`));
}
