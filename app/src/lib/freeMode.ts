import type { FreeDimension } from './types';

export const FREE_DIMENSIONS: FreeDimension[] = [
  {
    id: 'scene',
    name: '场景氛围',
    connector: '立于',
    keywords: [
      '红色花林薄雾','淡紫浓雾花海','金色晨雾花林','冰蓝花海雪地',
      '粉樱雪林','桃花树下','梨花树下','竹林深处','荷塘池畔',
      '枫林秋色','银杏林','丁香庭院','梅林雪地',
      '故宫宫殿','故宫御花园','宫殿内景','殿前丹陛',
      '唐宫高阶','江南冬雪','千里江山','天坛雪景',
      '夜景庭院','月下窗前','廊桥雪景','星夜草原',
      '暴雪荒野雪原','战国沙场'
    ],
  },
  {
    id: 'costume',
    name: '服饰',
    connector: '身着',
    keywords: [
      '正红色纱质广袖长裙','雾紫色广袖长裙','浅金黄纱裙','浅蓝色广袖长裙',
      '粉色繁绣广袖长裙','白色斗篷毛领','橙色半身斗篷','大红色盛唐斗篷',
      '明制凤冠霞帔翟衣','明制立领对襟短袄马面裙','墨绿色明制冬装',
      '盛唐红金襦裙','战国黑色战袍','深红色古风长袍','绿色战国袍',
      '粉蓝汉服长裙','素白长衣','浅青色古装'
    ],
  },
  {
    id: 'hair',
    name: '发型发饰',
    connector: '头梳',
    keywords: [
      '高雅繁复盘发','明制高盘发','明制双环髻','盛唐高耸发髻',
      '高马尾古铜发冠','半束半披长发','半披发','长发披散',
      '赤金流苏发饰','金色流苏珠翠','银蓝珠翠冷光金饰',
      '浅紫玉银珍珠','鎏金发簪点翠','凤冠珍珠帘',
      '玉簪步摇','金步摇宝石钗','白色梨花发饰','玉竹叶簪'
    ],
  },
  {
    id: 'makeup',
    name: '妆容神情',
    connector: '',
    keywords: [
      '清透明艳','清透淡雅','澄净明亮','端庄肃静',
      '盛唐浓妆花钿','红唇低饱和正红','浅粉唇色','暖橘红唇色',
      '眉目温柔','神情宁静','神情安静含蓄','沉静坚毅',
      '冷静克制','威严自持','温柔含笑','灵动含笑',
      '回眸浅笑','专注抚琴','仰头祈祷'
    ],
  },
  {
    id: 'pose',
    name: '姿势动作',
    connector: '',
    keywords: [
      '正面站立双手交叠','行走中回眸','轻轻旋身广袖展开',
      '扶发饰抬手','抬手接花瓣','抬手接光粒',
      '半蹲轻触花瓣','单膝轻触地面','倚树而立',
      '坐于湖畔石上','坐于书案前','盘膝而坐',
      '背对回首','侧身回望','仰头望月',
      '双手持剑身前','剑尖插雪','剑指镜头',
      '手扶栏杆','手持团扇','手持折扇',
      '骑马披甲','虔诚祈祷双手合十'
    ],
  },
  {
    id: 'camera',
    name: '镜头构图',
    connector: '画面为',
    keywords: [
      '中景构图','近景人像','半身特写',
      '面部特写','超大人脸特写',
      '全身构图','中远景构图',
      '低角度仰拍','轻微俯视','侧身剪影',
      '背对镜头','正对镜头','45度侧脸',
      '逆光剪影','侧逆光','前景虚化'
    ],
  },
  {
    id: 'light',
    name: '光线质感',
    connector: '',
    keywords: [
      '柔和晨光','暖色宫灯','月色冷光',
      '逆光光晕','电影级光影','冷暖对比',
      '浓雾折射光','光粒漂浮','柔焦效果',
      '高对比度','古风写实摄影质感',
      '高级古风人像摄影风格','仙气梦幻氛围',
      '肃穆庄重氛围','宁静空灵氛围'
    ],
  },
];

export type Selection = Record<string, string[]>;

export function buildFreePrompt(selection: Selection): string {
  const get = (id: string) => selection[id] || [];
  const scene = get('scene');
  const light = get('light');
  const costume = get('costume');
  const hair = get('hair');
  const makeup = get('makeup');
  const pose = get('pose');
  const camera = get('camera');

  const join = (arr: string[]) => arr.join('、');
  const s1parts: string[] = [];
  if (scene.length) s1parts.push(`古风女子立于${join(scene)}之中`);
  else s1parts.push('古风女子');
  if (light.length) s1parts.push(`${join(light)}环绕`);
  const sentence1 = s1parts.join('，') + '。';

  const s2parts: string[] = [];
  if (costume.length) s2parts.push(`她身着${join(costume)}`);
  if (hair.length) s2parts.push(`头梳${join(hair)}`);
  if (makeup.length) s2parts.push(join(makeup));
  const sentence2 = s2parts.length ? s2parts.join('，') + '。' : '';

  const s3parts: string[] = [];
  if (pose.length) s3parts.push(join(pose));
  if (camera.length) s3parts.push(`画面为${join(camera)}`);
  const sentence3 = s3parts.length ? s3parts.join('，') + '。' : '';

  const tail = '整体画面细腻、华丽、富有古风写真质感。';

  return [sentence1, sentence2, sentence3, tail].filter(Boolean).join('\n');
}

export function totalSelected(selection: Selection): number {
  return Object.values(selection).reduce((acc, arr) => acc + arr.length, 0);
}
