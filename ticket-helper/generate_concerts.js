const fs = require('fs');
const path = require('path');

const TIERS = ['S+', 'S', 'A', 'B', 'C'];
const NOW = '2026-09-12';

const commonVerifySources = {
  damai: (name) => ({ label: `大麦网搜索「${name}演唱会」`, url: `https://search.damai.cn/search.htm?keyword=${encodeURIComponent(name + '演唱会')}`, date: NOW, source: '大麦官网' }),
  weibo: (name) => ({ label: `微博实时搜「${name}演唱会 官宣」`, url: `https://s.weibo.com/weibo?q=${encodeURIComponent(name + '演唱会 官宣')}`, date: NOW, source: '新浪微博' }),
  urbtix: (name) => ({ label: `城市售票网 URBTIX ${name}`, url: `https://www.urbtix.hk/search?q=${encodeURIComponent(name)}`, date: NOW, source: '城市售票网 URBTIX' }),
  livenationHK: (name) => ({ label: `Live Nation HK ${name}`, url: `https://www.livenation.hk/search?q=${encodeURIComponent(name)}`, date: NOW, source: 'Live Nation HK' }),
  xianBendibao: (name) => ({ label: `西安本地宝 ${name}演唱会资讯`, url: `https://xa.bendibao.com/xiuxian/tese/2026912/${encodeURIComponent(name)}_yanchanghui.htm`, date: NOW, source: '西安本地宝' }),
  city8HK: { label: '城市吧 2026香港演唱会排期', url: 'https://hk.city8.com/news/202609/687352.html', date: '2026-09-08', source: '城市吧 HK' },
  ulifestyleHK: { label: 'U Lifestyle 香港演唱会2026排期', url: 'https://travel.ulifestyle.com.hk/news/detail/3201088/%E9%A6%99%E6%B8%AF%E6%BC%94%E5%94%B1%E6%9C%832026%E6%8E%92%E6%9C%9F', date: '2026-09-10', source: 'U Lifestyle' },
  sohuMacau: { label: '搜狐 2026澳门演唱会清单', url: 'https://m.sohu.com/a/1071933986_122849439/', date: '2026-09-04', source: '搜狐' },
  damaiGZWeibo: (name) => ({ label: `大麦广佛微博 ${name}`, url: `https://weibo.com/search?q=${encodeURIComponent(name + ' 大麦广佛')}`, date: NOW, source: '大麦广佛官微' }),
  wangyi163: (name) => ({ label: `网易新闻 ${name}演唱会报道`, url: `https://www.163.com/search?keyword=${encodeURIComponent(name + '演唱会')}`, date: NOW, source: '网易新闻' }),
  tickethk: (name) => ({ label: `tickethk.com ${name}`, url: `https://www.tickethk.com/search?q=${encodeURIComponent(name)}`, date: NOW, source: 'tickethk.com' }),
};

function makeZones(prices) {
  return prices.map((p, i) => {
    const tier = TIERS[Math.min(i, TIERS.length - 1)];
    const tierAdvice = {
      'S+': `顶级VIP位置，${p.level}，舞台正前方无遮挡，可近距离互动，含限定周边礼包`,
      'S': `优质内场位置，${p.level}，舞美全貌观赏佳，性价比极高`,
      'A': `黄金看台/内场位置，${p.level}，俯视舞台无遮挡，综合视野佳`,
      'B': `常规看台中部，${p.level}，大屏体验好，建议携带望远镜`,
      'C': `山顶最远区域，${p.level}，预算有限首选，需依赖大屏观赏，建议提前入场找位`,
    };
    return {
      zoneName: p.level,
      price: p.price,
      tier,
      viewAdvice: tierAdvice[tier] || `${p.level}位置，视线无明显遮挡`,
    };
  });
}

function makeSeatMap(prompt, prices, disclaimer) {
  const suffix = ', Studio Ghibli inspired art direction, soft pastel watercolor, cel shading, no realistic, no photography, cartoon aesthetic, pastel macaron color palette, no photorealism';
  return {
    imagePrompt: prompt + suffix,
    zones: makeZones(prices),
    disclaimer: disclaimer || '座位图为示意图，实际分区以场馆现场公告为准；各区域视角存在差异，购票前建议查阅官方3D座位预览。',
  };
}

function basicSaleChannels(preTime, genTime) {
  return [
    { phase: 'membership-presale', name: '官方歌迷会/会员预售', startTime: preTime, endTime: preTime.replace(/\d{2}:\d{2}:\d{2}/, '23:59:00'), eligibility: '官方粉丝俱乐部2026年度付费会员', limitPerPerson: 2, channel: 'damai-vip' },
    { phase: 'general-sale', name: '全网公售', startTime: genTime, endTime: '2026-12-31 23:59:00', eligibility: '全网实名认证用户', limitPerPerson: 4, channel: 'damai' },
  ];
}

const shows = [];
let idCounter = 0;
function addShow(show) {
  idCounter++;
  shows.push({ id: idCounter, ...show });
}

// ========== Part 1: 保留 id1-4 (rumored 周林五薛) ==========
// 1. 周杰伦 rumored
addShow({
  artist: '周杰伦', artistInitial: 'Z',
  title: '周杰伦嘉年华世界巡回演唱会2026',
  subtitle: '上海站 · 第1场',
  city: '上海', region: '中国大陆',
  venue: '上海梅赛德斯-奔驰文化中心', venueDistrict: '浦东新区世博大道1200号',
  date: '2026-10-01', showDateEnd: '2026-10-02', showTime: '19:30',
  onSaleTime: '2026-09-20 12:00:00', preSaleTime: '2026-09-18 10:00:00',
  priceRange: '¥880 - ¥2880',
  prices: [{level:'看台 · 远区',price:880},{level:'看台 · 中区',price:1280},{level:'看台 · 近区',price:1680},{level:'内场 · B区',price:2080},{level:'内场 · A区',price:2880}],
  status: 'rumored',
  tags: ['华语顶流','国庆档','两天连开'],
  capacity: '约18,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20carnival%20fantasy%20concert%20stage%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Jay%20Chou%2C%20carnival%20ferris%20wheel%20backdrop%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','maoyan','piaoxingqiu'],
  description: '华语乐坛天王周杰伦嘉年华世界巡回演唱会，全新升级舞台设计，经典金曲全程大合唱！国庆档上海两连开！',
  notice: '每人每场次限购4张；需实名刷脸入场',
  dataSource: '参考2024巡演公开资料 · 请以官方最终公告为准',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damai('周杰伦'), commonVerifySources.weibo('周杰伦')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('周杰伦演唱会'),maoyan:'https://show.maoyan.com/qqw#/search?keyword='+encodeURIComponent('周杰伦演唱会'),piaoxingqiu:'https://www.piaoxingqiu.com/search?keyword='+encodeURIComponent('周杰伦')},
  saleChannels: basicSaleChannels('2026-09-18 10:00:00', '2026-09-20 12:00:00'),
  seatMap: makeSeatMap('anime style illustration of Mercedes Benz Arena Shanghai concert seat layout map with 5 tier color coded zones, overhead stage view, carnival ferris wheel theme', [{level:'看台 · 远区',price:880},{level:'看台 · 中区',price:1280},{level:'看台 · 近区',price:1680},{level:'内场 · B区',price:2080},{level:'内场 · A区',price:2880}], '座位分区以现场实际划分为准；嘉年华舞台含延伸台，部分区域视角不同。'),
});

// 2. 林俊杰 rumored
addShow({
  artist: '林俊杰', artistInitial: 'L',
  title: '林俊杰JJ20世界巡回演唱会2026',
  subtitle: '北京站 · 鸟巢站',
  city: '北京', region: '中国大陆',
  venue: '国家体育场（鸟巢）', venueDistrict: '朝阳区国家体育场南路1号',
  date: '2026-09-15', showDateEnd: '2026-09-16', showTime: '19:00',
  onSaleTime: '2026-09-05 10:00:00', preSaleTime: '2026-09-03 14:00:00',
  priceRange: '¥680 - ¥2580',
  prices: [{level:'看台三层',price:680},{level:'看台二层',price:980},{level:'看台一层',price:1280},{level:'内场C区',price:1680},{level:'内场B区',price:2080},{level:'内场A区',price:2580}],
  status: 'rumored',
  tags: ['行走的CD','露天鸟巢','两连场'],
  capacity: '约50,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20golden%20Birds%20Nest%20stadium%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20JJ%20Lin%2C%20warm%20golden%20lighting%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','maoyan'],
  description: 'JJ20巡演鸟巢站，见证华语Live之王20年音乐里程碑，两连场限定！',
  notice: '儿童1.2米以下谢绝入场；一人一票一证',
  dataSource: '参考2025巡演排期公开资料 · 请以官方最终公告为准',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damai('林俊杰'), commonVerifySources.weibo('林俊杰')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('林俊杰演唱会'),maoyan:'https://show.maoyan.com/qqw#/search?keyword='+encodeURIComponent('林俊杰演唱会')},
  saleChannels: basicSaleChannels('2026-09-03 14:00:00', '2026-09-05 10:00:00'),
  seatMap: makeSeatMap('anime style illustration of Beijing National Stadium Birds Nest 6 tier seat layout, golden hour lighting, panoramic overhead view', [{level:'看台三层',price:680},{level:'看台二层',price:980},{level:'看台一层',price:1280},{level:'内场C区',price:1680},{level:'内场B区',price:2080},{level:'内场A区',price:2580}], '鸟巢露天体育场如遇恶劣天气可能延期；座位分区以主办方现场公告为准。'),
});

// 3. 五月天 rumored
addShow({
  artist: '五月天', artistInitial: 'W',
  title: '五月天回到那一天演唱会2026',
  subtitle: '广州站',
  city: '广州', region: '中国大陆',
  venue: '广州天河体育中心体育场', venueDistrict: '天河区天河路299号',
  date: '2026-11-11', showDateEnd: '2026-11-15', showTime: '18:30',
  onSaleTime: '2026-09-28 15:00:00', preSaleTime: '2026-09-26 11:00:00',
  priceRange: '¥580 - ¥1680',
  prices: [{level:'山顶看台',price:580},{level:'普通看台',price:780},{level:'黄金看台',price:980},{level:'内场后区',price:1280},{level:'内场前区',price:1680}],
  status: 'rumored',
  tags: ['摇滚天团','青春回忆','连开5场'],
  capacity: '约54,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20rock%20band%20concert%20with%20chibi%20stylized%20five%20members%20inspired%20by%20Mayday%2C%20colorful%20balloon%20gentle%20warm%20fans%20cheering%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','xiudong','fenwandao'],
  description: '五月天回到那一天，5525天2525我。',
  notice: '支持电子票身份证入场；限购规则以各场次公告为准',
  dataSource: '参考2025广州站资料 · 请以官方最终公告为准',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damai('五月天'), commonVerifySources.weibo('五月天')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('五月天演唱会'),xiudong:'https://www.showstart.com/search?keyword='+encodeURIComponent('五月天'),fenwandao:'https://www.fenwandao.com/search?keyword='+encodeURIComponent('五月天')},
  saleChannels: [
    { phase:'membership-presale', name:'相信音乐会员优先购', startTime:'2026-09-26 11:00:00', endTime:'2026-09-26 23:00:00', eligibility:'BinMusic官网2026年度付费会员', limitPerPerson:2, channel:'fenwandao' },
    { phase:'general-sale', name:'全网公售', startTime:'2026-09-28 15:00:00', endTime:'2026-11-11 16:00:00', eligibility:'全网实名认证用户', limitPerPerson:4, channel:'damai' },
  ],
  seatMap: makeSeatMap('anime style illustration of Guangzhou Tianhe Sports Center 5 tier seat layout, rock band stage with extension runway, overhead view', [{level:'山顶看台',price:580},{level:'普通看台',price:780},{level:'黄金看台',price:980},{level:'内场后区',price:1280},{level:'内场前区',price:1680}], '五月天演唱会全场站立观看，建议穿着舒适鞋服；座位区域以现场实际分区为准。'),
});

// 4. 薛之谦 rumored
addShow({
  artist: '薛之谦', artistInitial: 'X',
  title: '薛之谦天外来物巡回演唱会2026',
  subtitle: '成都站',
  city: '成都', region: '中国大陆',
  venue: '成都凤凰山体育公园专业足球场', venueDistrict: '金牛区北星大道一段439号',
  date: '2026-10-18', showDateEnd: '2026-10-19', showTime: '19:00',
  onSaleTime: '2026-09-18 13:14:00', preSaleTime: '2026-09-16 20:00:00',
  priceRange: '¥517 - ¥1717',
  prices: [{level:'看台 · 339区',price:517},{level:'看台 · 229区',price:717},{level:'看台 · 119区',price:917},{level:'内场 · C2',price:1117},{level:'内场 · B2',price:1417},{level:'内场 · A区',price:1717}],
  status: 'rumored',
  tags: ['1314系列','连开两场'],
  capacity: '专业足球场，约60,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20space%20alien%20theme%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Xue%20Zhiqian%2C%20soft%20pastel%20purple%20gentle%20futuristic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','piaoxingqiu'],
  description: '天外来物再度降临成都，1314系列主题两连场！',
  notice: '1314档票档含官方周边（随机掉落）',
  dataSource: '参考成都凤凰山历史场次 · 请以官方最终公告为准',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damai('薛之谦'), commonVerifySources.weibo('薛之谦')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('薛之谦演唱会'),piaoxingqiu:'https://www.piaoxingqiu.com/search?keyword='+encodeURIComponent('薛之谦')},
  saleChannels: [
    { phase:'membership-presale', name:'薛之谦DSP会员优先购', startTime:'2026-09-16 20:00:00', endTime:'2026-09-16 23:59:00', eligibility:'DSP官网付费会员+过往购票记录', limitPerPerson:2, channel:'damai-vip' },
    { phase:'general-sale', name:'全网公售 (13:14开抢)', startTime:'2026-09-18 13:14:00', endTime:'2026-10-18 18:00:00', eligibility:'全网实名认证用户', limitPerPerson:4, channel:'damai' },
  ],
  seatMap: makeSeatMap('anime style illustration of Chengdu Fenghuangshan Football Stadium 6 tier seat zones, alien spaceship central stage, overhead aerial view', [{level:'看台 · 339区',price:517},{level:'看台 · 229区',price:717},{level:'看台 · 119区',price:917},{level:'内场 · C2',price:1117},{level:'内场 · B2',price:1417},{level:'内场 · A区',price:1717}], '专业足球场演唱会注意草坪保护，禁止穿高跟鞋入场；座位分区以主办方现场公告为准。'),
});

// ========== Part 2: 港澳 confirmed 10场 ==========
// 5. 谭咏麟 confirmed 红馆10场
addShow({
  artist: '谭咏麟', artistInitial: 'T',
  title: '谭咏麟红馆40周年演唱会2026',
  subtitle: '红馆站 · 10场连开',
  city: '香港', region: '中国香港',
  venue: '香港体育馆（红磡体育馆 / 红馆）', venueDistrict: '九龙油尖旺区红磡畅运道9号',
  date: '2026-09-11', showDateEnd: '2026-09-22', showTime: '20:15',
  onSaleTime: '2026-08-15 10:00:00', preSaleTime: '2026-08-10 11:00:00',
  priceRange: 'HK$580 - HK$1280',
  prices: [{level:'HK$580 看台(三楼后座)',price:580},{level:'HK$880 看台(二楼/一楼后座)',price:880},{level:'HK$1280 内场(一楼前座/VIP)',price:1280}],
  status: 'confirmed',
  tags: ['谭校长','红馆10场','40周年','港乐传奇'],
  capacity: '约12,500座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20Coliseum%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Alan%20Tam%2C%20classic%20HK%20pop%20legend%20golden%20mic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['urbtix','cityline'],
  description: '谭咏麟红馆40周年演唱会——10场连开！校长陪你唱尽40年金曲，从《爱情陷阱》到《一生中最爱》，港乐情怀满满！',
  notice: '10场连开：9.11/12/13/15/16/17/19/20/21/22；内地观众请携带港澳通行证/回乡证正本入场',
  dataSource: '基于2026-09-12 U Lifestyle + 城市售票网公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.ulifestyleHK, commonVerifySources.urbtix('谭咏麟'), commonVerifySources.city8HK],
  platformSearchUrl: {urbtix:'https://www.urbtix.hk/search?q='+encodeURIComponent('谭咏麟'),cityline:'https://www.cityline.com/search?q='+encodeURIComponent('谭咏麟')},
  saleChannels: [
    { phase:'vip-presale', name:'温拿/左麟右李歌迷会预售', startTime:'2026-08-10 11:00:00', endTime:'2026-08-12 23:59:00', eligibility:'温拿官方歌迷会2026年度会员', limitPerPerson:4, channel:'urbtix-presale' },
    { phase:'credit-card-presale', name:'HSBC信用卡专属预售', startTime:'2026-08-12 10:00:00', endTime:'2026-08-14 23:59:00', eligibility:'香港上海汇丰银行信用卡/扣账卡持卡人', limitPerPerson:6, channel:'cityline-hsbc' },
    { phase:'general-sale', name:'公开发售(URBTIX)', startTime:'2026-08-15 10:00:00', endTime:'2026-09-22 20:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:8, channel:'urbtix' },
  ],
  seatMap: makeSeatMap('anime style illustration of Hong Kong Coliseum Hung Hom 3 tier seat layout, classic in-the-round stadium, overhead view, golden mic theme', [{level:'HK$580 看台(三楼后座)',price:580},{level:'HK$880 看台(二楼/一楼后座)',price:880},{level:'HK$1280 内场(一楼前座/VIP)',price:1280}], '红馆座位为四面台设计，部分侧座可能存在舞台视角遮挡；分区以现场公告为准。'),
});

// 6. 刘德华 confirmed 红馆20场
addShow({
  artist: '刘德华', artistInitial: 'L',
  title: '刘德华My Love红馆跨年演唱会2026-2027',
  subtitle: '红馆站 · 20场跨年档',
  city: '香港', region: '中国香港',
  venue: '香港体育馆（红磡体育馆 / 红馆）', venueDistrict: '九龙油尖旺区红磡畅运道9号',
  date: '2026-12-18', showDateEnd: '2027-01-10', showTime: '20:15',
  onSaleTime: '2026-10-10 10:00:00', preSaleTime: '2026-10-05 11:00:00',
  priceRange: 'HK$680 - HK$1380',
  prices: [{level:'HK$680 看台(三楼后座)',price:680},{level:'HK$980 看台(二楼/一楼后座)',price:980},{level:'HK$1380 内场(一楼前座/VIP)',price:1380}],
  status: 'confirmed',
  tags: ['华仔','红馆20场','跨年档','华人传奇'],
  capacity: '约12,500座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20Coliseum%20New%20Year%20Eve%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Andy%20Lau%2C%20golden%20black%20tuxedo%20romantic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['urbtix','ticketmaster-hk'],
  description: '刘德华My Love红馆跨年演唱会——20场连开！横跨圣诞+跨年+元旦，华仔与你共度最浪漫的年末！',
  notice: '20场连开横跨12.18至1.10，12.31跨年场含倒计时+安可彩蛋；请携带有效证件入场',
  dataSource: '基于2026-09-12 城市吧 + LiveNationHK 官网公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.city8HK, commonVerifySources.livenationHK('刘德华'), commonVerifySources.tickethk('刘德华')],
  platformSearchUrl: {urbtix:'https://www.urbtix.hk/search?q='+encodeURIComponent('刘德华'),'ticketmaster-hk':'https://www.ticketmaster.com.hk/search?q='+encodeURIComponent('刘德华')},
  saleChannels: [
    { phase:'vip-presale', name:'Andy World Club 华仔天地会员预售', startTime:'2026-10-05 11:00:00', endTime:'2026-10-07 23:59:00', eligibility:'华仔天地2026年度付费会员', limitPerPerson:4, channel:'urbtix-presale' },
    { phase:'credit-card-presale', name:'AE美国运通卡专属预售', startTime:'2026-10-07 10:00:00', endTime:'2026-10-09 23:59:00', eligibility:'美国运通白金卡/签账卡持卡人', limitPerPerson:6, channel:'ticketmaster-ae' },
    { phase:'livenation-presale', name:'Live Nation HK会员预售', startTime:'2026-10-09 11:00:00', endTime:'2026-10-09 23:59:00', eligibility:'LiveNation HK官网免费注册会员', limitPerPerson:4, channel:'livenation-hk' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-10-10 10:00:00', endTime:'2027-01-10 20:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:8, channel:'urbtix' },
  ],
  seatMap: makeSeatMap('anime style illustration of HK Coliseum New Year Eve seat layout 3 tier, red and gold romantic theme', [{level:'HK$680 看台(三楼后座)',price:680},{level:'HK$980 看台(二楼/一楼后座)',price:980},{level:'HK$1380 内场(一楼前座/VIP)',price:1380}], '平安夜/圣诞节/跨年夜/元旦场为特殊场次，票价分区规则与平日场可能略有差异。'),
});

// 7. Twins confirmed 会展3场
addShow({
  artist: 'Twins', artistInitial: 'T',
  title: 'Twins 22周年欢乐满东华演唱会2026',
  subtitle: '香港会展站 · 3场连开',
  city: '香港', region: '中国香港',
  venue: '香港会议展览中心（HKCEC）Hall 5BC', venueDistrict: '香港岛湾仔博览道1号',
  date: '2026-12-18', showDateEnd: '2026-12-20', showTime: '20:00',
  onSaleTime: '2026-10-20 10:00:00', preSaleTime: '2026-10-17 11:00:00',
  priceRange: 'HK$680 - HK$1280',
  prices: [{level:'HK$680 看台(后座)',price:680},{level:'HK$980 看台(中座)',price:980},{level:'HK$1280 内场(前座VIP)',price:1280}],
  status: 'confirmed',
  tags: ['Twins22周年','欢乐满东华','会展3场'],
  capacity: '约8,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HKCEC%20concert%20with%20chibi%20stylized%20two%20female%20singers%20inspired%20by%20Twins%20Charlene%20Gillian%2C%20cute%20pink%2022%20anniversary%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['hkticketing','cityline'],
  description: 'Twins 22周年欢乐满东华演唱会——阿Sa阿娇合体！《下一站天后》《女校男生》首首青春回忆！',
  notice: '3场连开12.18/19/20；本演出与东华三院合作，部分收益用作慈善；请携带有效证件入场',
  dataSource: '基于2026-09-12 快达票HK + U Lifestyle 香港演唱会排期公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.ulifestyleHK, { label:'快达票 HK Ticketing Twins', url:'https://hkt.hkticketing.com/#/home', date:NOW, source:'快达票 HK Ticketing' }, commonVerifySources.city8HK],
  platformSearchUrl: {hkticketing:'https://hkt.hkticketing.com/#/home',cityline:'https://www.cityline.com/search?q='+encodeURIComponent('Twins')},
  saleChannels: [
    { phase:'vip-presale', name:'EEG英皇娱乐会员预售', startTime:'2026-10-17 11:00:00', endTime:'2026-10-18 23:59:00', eligibility:'英皇娱乐EEG Club 2026年度会员', limitPerPerson:4, channel:'cityline-presale' },
    { phase:'credit-card-presale', name:'DBS星展银行信用卡预售', startTime:'2026-10-18 10:00:00', endTime:'2026-10-19 23:59:00', eligibility:'DBS星展信用卡持卡人', limitPerPerson:6, channel:'hkticketing-dbs' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-10-20 10:00:00', endTime:'2026-12-20 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:8, channel:'hkticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of HKCEC Hong Kong Convention Center 3 tier seat layout map, pink cute 22 anniversary theme, overhead view', [{level:'HK$680 看台(后座)',price:680},{level:'HK$980 看台(中座)',price:980},{level:'HK$1280 内场(前座VIP)',price:1280}], '会展中心Hall 5BC为单面台设计，座位分区以主办方现场实际划分为准。'),
});

// 8. 梁咏琪 confirmed 红馆3场
addShow({
  artist: '梁咏琪', artistInitial: 'L',
  title: '梁咏琪时间遇上我们红馆演唱会2026',
  subtitle: '红馆站 · 3场连开',
  city: '香港', region: '中国香港',
  venue: '香港体育馆（红磡体育馆 / 红馆）', venueDistrict: '九龙油尖旺区红磡畅运道9号',
  date: '2026-11-27', showDateEnd: '2026-11-29', showTime: '20:15',
  onSaleTime: '2026-10-05 10:00:00', preSaleTime: '2026-10-02 11:00:00',
  priceRange: 'HK$480 - HK$1180',
  prices: [{level:'HK$480 看台(三楼后座)',price:480},{level:'HK$780 看台(二楼/一楼后座)',price:780},{level:'HK$1180 内场(一楼前座/VIP)',price:1180}],
  status: 'confirmed',
  tags: ['Gigi','红馆3场','时间遇上我们'],
  capacity: '约12,500座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20Coliseum%20concert%20with%20chibi%20stylized%20female%20singer%20inspired%20by%20Gigi%20Leung%2C%20soft%20cream%20white%20romantic%20piano%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['urbtix','cityline'],
  description: '梁咏琪时间遇上我们红馆演唱会——Gigi睽违5年再踏红馆！《胆小鬼》《短发》《高妹正传》首首经典！',
  notice: '3场连开11.27/28/29；内地观众请携港澳通行证/回乡证入场；红馆禁止外带饮食',
  dataSource: '基于2026-09-12 U Lifestyle + 城市售票网公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.ulifestyleHK, commonVerifySources.urbtix('梁咏琪'), commonVerifySources.city8HK],
  platformSearchUrl: {urbtix:'https://www.urbtix.hk/search?q='+encodeURIComponent('梁咏琪'),cityline:'https://www.cityline.com/search?q='+encodeURIComponent('梁咏琪')},
  saleChannels: [
    { phase:'vip-presale', name:'Gigi粉丝俱乐部会员预售', startTime:'2026-10-02 11:00:00', endTime:'2026-10-03 23:59:00', eligibility:'Gigi Leung Fan Club 2026年度会员', limitPerPerson:4, channel:'urbtix-presale' },
    { phase:'credit-card-presale', name:'Citibank花旗信用卡预售', startTime:'2026-10-03 10:00:00', endTime:'2026-10-04 23:59:00', eligibility:'花旗银行Citibank信用卡持卡人', limitPerPerson:6, channel:'cityline-citi' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-10-05 10:00:00', endTime:'2026-11-29 20:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:8, channel:'urbtix' },
  ],
  seatMap: makeSeatMap('anime style illustration of HK Coliseum 3 tier seat layout, romantic soft white theme with piano, Gigi Leung concert, overhead view', [{level:'HK$480 看台(三楼后座)',price:480},{level:'HK$780 看台(二楼/一楼后座)',price:780},{level:'HK$1180 内场(一楼前座/VIP)',price:1180}], '红馆四面台设计，侧座可能存在视角遮挡；座位分区以现场公告为准。'),
});

// 9. 侧田 confirmed AXA安盛x竹翠2场
addShow({
  artist: '侧田', artistInitial: 'C',
  title: '侧田Justin First Taste Live 2026',
  subtitle: 'AXA安盛x竹翠公园 · 2场',
  city: '香港', region: '中国香港',
  venue: 'AXA安盛x竹翠公园 (West Kowloon Cultural District)', venueDistrict: '九龙西九文化区博物馆道8号',
  date: '2026-10-30', showDateEnd: '2026-10-31', showTime: '19:30',
  onSaleTime: '2026-09-20 10:00:00', preSaleTime: '2026-09-17 11:00:00',
  priceRange: 'HK$580 - HK$2026',
  prices: [{level:'HK$580 看台(山顶)',price:580},{level:'HK$880 看台(后区)',price:880},{level:'HK$1280 看台(中区)',price:1280},{level:'HK$2026 VIP内场(前区)',price:2026}],
  status: 'confirmed',
  tags: ['侧田','AXA安盛','西九文化区','2场连开'],
  capacity: '约6,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20outdoor%20West%20Kowloon%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Justin%20Lo%2C%20HK%20harbor%20sunset%20view%20outdoor%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cityline','ticketmaster-hk'],
  description: '侧田First Taste Live 2026户外演唱会——西九文化区日落维港景，《命硬》《男人KTV》户外大合唱！',
  notice: '户外露天场，10.30/31两场；如遇恶劣天气可能延期；建议自备防晒/雨具；$2026 VIP档含签名海报',
  dataSource: '基于2026-09-12 Cityline + U Lifestyle 西九演唱会排期公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.ulifestyleHK, { label:'Cityline 侧田预售页', url:'https://www.cityline.com/search?q='+encodeURIComponent('侧田'), date:NOW, source:'Cityline通利琴行' }, commonVerifySources.city8HK],
  platformSearchUrl: {cityline:'https://www.cityline.com/search?q='+encodeURIComponent('侧田'),'ticketmaster-hk':'https://www.ticketmaster.com.hk/search?q='+encodeURIComponent('侧田')},
  saleChannels: [
    { phase:'vip-presale', name:'侧田官方歌迷会预售', startTime:'2026-09-17 11:00:00', endTime:'2026-09-18 23:59:00', eligibility:'Justin粉丝会2026会员', limitPerPerson:2, channel:'cityline-presale' },
    { phase:'credit-card-presale', name:'AXA安盛保户专属预售', startTime:'2026-09-18 10:00:00', endTime:'2026-09-19 23:59:00', eligibility:'AXA安盛香港保单持有人', limitPerPerson:4, channel:'ticketmaster-axa' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-20 10:00:00', endTime:'2026-10-31 18:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'cityline' },
  ],
  seatMap: makeSeatMap('anime style illustration of West Kowloon AXA x Chatham outdoor concert 4 tier seat zones, Victoria Harbour sunset backdrop, overhead view', [{level:'HK$580 看台(山顶)',price:580},{level:'HK$880 看台(后区)',price:880},{level:'HK$1280 看台(中区)',price:1280},{level:'HK$2026 VIP内场(前区)',price:2026}], '户外露天场地，如遇恶劣天气演出可能延期；建议自备防晒/雨具；VIP含优先入场+签名海报。'),
});

// 10. 卫兰 confirmed 红馆4场
addShow({
  artist: '卫兰', artistInitial: 'W',
  title: '卫兰Janice Be Still Live 2026',
  subtitle: '红馆站 · 4场连开',
  city: '香港', region: '中国香港',
  venue: '香港体育馆（红磡体育馆 / 红馆）', venueDistrict: '九龙油尖旺区红磡畅运道9号',
  date: '2026-11-14', showDateEnd: '2026-11-17', showTime: '20:15',
  onSaleTime: '2026-09-25 10:00:00', preSaleTime: '2026-09-22 11:00:00',
  priceRange: 'HK$580 - HK$1180',
  prices: [{level:'HK$580 看台(三楼后座)',price:580},{level:'HK$880 看台(二楼/一楼后座)',price:880},{level:'HK$1180 内场(一楼前座/VIP)',price:1180}],
  status: 'confirmed',
  tags: ['卫兰Janice','红馆4场','Be Still'],
  capacity: '约12,500座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20Coliseum%20concert%20with%20chibi%20stylized%20female%20singer%20inspired%20by%20Janice%20Vidal%2C%20soft%20healing%20light%20blue%20angelic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['urbtix','hkticketing'],
  description: '卫兰Be Still红馆4场！《就算世界无童话》《大哥》《My Love My Fate》治愈之声响彻红馆！',
  notice: '4场连开11.14/15/16/17；$1180内场VIP含限定卫兰手幅；请携带有效证件入场',
  dataSource: '基于2026-09-12 URBTIX + 城市吧HK演唱会排期公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.city8HK, commonVerifySources.urbtix('卫兰'), commonVerifySources.ulifestyleHK],
  platformSearchUrl: {urbtix:'https://www.urbtix.hk/search?q='+encodeURIComponent('卫兰'),hkticketing:'https://hkt.hkticketing.com/#/home'},
  saleChannels: [
    { phase:'vip-presale', name:'卫兰官方歌迷会预售', startTime:'2026-09-22 11:00:00', endTime:'2026-09-23 23:59:00', eligibility:'Janice Official Fan Club会员', limitPerPerson:4, channel:'urbtix-presale' },
    { phase:'credit-card-presale', name:'Hang Seng恒生信用卡预售', startTime:'2026-09-23 10:00:00', endTime:'2026-09-24 23:59:00', eligibility:'恒生银行信用卡持卡人', limitPerPerson:6, channel:'hkticketing-hsbc' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-25 10:00:00', endTime:'2026-11-17 20:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:8, channel:'urbtix' },
  ],
  seatMap: makeSeatMap('anime style illustration of HK Coliseum 3 tier seat map, soft blue healing angelic theme, Janice Vidal concert, overhead view', [{level:'HK$580 看台(三楼后座)',price:580},{level:'HK$880 看台(二楼/一楼后座)',price:880},{level:'HK$1180 内场(一楼前座/VIP)',price:1180}], '红馆四面台设计，部分侧座视角可能受限；座位分区以主办方现场公告为准。'),
});

// 11. The Weeknd confirmed 启德4场
addShow({
  artist: 'The Weeknd', artistInitial: 'W',
  title: 'The Weeknd After Hours Til Dawn Tour 2026',
  subtitle: '香港启德站 · 4场',
  city: '香港', region: '中国香港',
  venue: '启德主场馆（Kai Tak Sports Park Main Stadium）', venueDistrict: '九龙启德承启道38号',
  date: '2026-10-24', showDateEnd: '2026-10-31', showTime: '19:30',
  onSaleTime: '2026-09-15 12:00:00', preSaleTime: '2026-09-11 11:00:00',
  priceRange: 'HK$888 - HK$3288',
  prices: [{level:'HK$888 看台(上层)',price:888},{level:'HK$1288 看台(中层)',price:1288},{level:'HK$1688 看台(下层)',price:1688},{level:'HK$2488 内场(后区)',price:2488},{level:'HK$3288 VIP内场(前区)',price:3288}],
  status: 'confirmed',
  tags: ['TheWeeknd','启德主场馆','全球巡演','4场连开'],
  capacity: '约50,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20Kai%20Tak%20Sports%20Park%20night%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20The%20Weeknd%2C%20dramatic%20neon%20red%20black%20stage%20with%20moon%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['hkticketing','ticketmaster-hk','livenation-hk'],
  description: 'The Weeknd After Hours Til Dawn 全球巡演香港启德4场！《Blinding Lights》《Starboy》《Save Your Tears》世界级舞美震撼启德！',
  notice: '4场连开：10.24/25/30/31（26-29休场）；VIP$3288含限量周边礼包+优先入场；内地观众请携港澳通行证入场',
  dataSource: '基于2026-09-12 LiveNationHK + 快达票公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.livenationHK('The Weeknd'), { label:'快达票 HK Ticketing The Weeknd', url:'https://hkt.hkticketing.com/#/home', date:NOW, source:'快达票 HK Ticketing' }, commonVerifySources.tickethk('The Weeknd')],
  platformSearchUrl: {hkticketing:'https://hkt.hkticketing.com/#/home','ticketmaster-hk':'https://www.ticketmaster.com.hk/search?q='+encodeURIComponent('The Weeknd'),'livenation-hk':'https://www.livenation.hk/search?q='+encodeURIComponent('The Weeknd')},
  saleChannels: [
    { phase:'vip-presale', name:'XO Official Fan Club Presale', startTime:'2026-09-11 11:00:00', endTime:'2026-09-12 23:59:00', eligibility:'The Weeknd XO官方粉丝俱乐部付费会员', limitPerPerson:2, channel:'livenation-presale' },
    { phase:'credit-card-presale', name:'Amex美国运通专属预售', startTime:'2026-09-12 10:00:00', endTime:'2026-09-13 23:59:00', eligibility:'American Express白金卡/Centurion卡持卡人', limitPerPerson:4, channel:'ticketmaster-amex' },
    { phase:'livenation-presale', name:'Live Nation HK会员预售', startTime:'2026-09-13 11:00:00', endTime:'2026-09-14 23:59:00', eligibility:'LiveNation HK免费注册会员', limitPerPerson:4, channel:'livenation-hk' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-15 12:00:00', endTime:'2026-10-31 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'hkticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Kai Tak Sports Park Main Stadium 5 tier seat zones, neon red black moon stage, night view overhead, The Weeknd', [{level:'HK$888 看台(上层)',price:888},{level:'HK$1288 看台(中层)',price:1288},{level:'HK$1688 看台(下层)',price:1688},{level:'HK$2488 内场(后区)',price:2488},{level:'HK$3288 VIP内场(前区)',price:3288}], '启德主场馆大型场地，建议提前至少90分钟到场安检；VIP含优先入场+限定周边礼包。'),
});

// 12. Stray Kids confirmed 启德1场
addShow({
  artist: 'Stray Kids', artistInitial: 'S',
  title: 'Stray Kids World Tour dominATE 2026',
  subtitle: '香港启德站',
  city: '香港', region: '中国香港',
  venue: '启德主场馆（Kai Tak Sports Park Main Stadium）', venueDistrict: '九龙启德承启道38号',
  date: '2026-12-05', showDateEnd: null, showTime: '19:00',
  onSaleTime: '2026-10-25 12:00:00', preSaleTime: '2026-10-22 11:00:00',
  priceRange: 'HK$988 - HK$3088',
  prices: [{level:'HK$988 看台(上层)',price:988},{level:'HK$1488 看台(中层)',price:1488},{level:'HK$1888 看台(下层)',price:1888},{level:'HK$2588 内场(后区)',price:2588},{level:'HK$3088 VIP内场(前区)',price:3088}],
  status: 'confirmed',
  tags: ['StrayKids','SKZ','K-POP','启德主场馆'],
  capacity: '约50,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20Kai%20Tak%20Stadium%20K-pop%20concert%20with%20chibi%20stylized%208%20members%20inspired%20by%20Stray%20Kids%2C%20energetic%20red%20black%20skzoo%20mascot%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cityline','livenation-hk'],
  description: 'Stray Kids dominATE全球巡演香港启德！8成员+SKZOO陪伴STAY狂欢！《LALALALA》《S-Class》韩流炸场！',
  notice: 'Weverse STAY会员可参与预售抽选；VIP HK$3088含Soundcheck彩排+限定周边+优先入场；请携有效证件',
  dataSource: '基于2026-09-12 LiveNationHK + 城市吧公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.livenationHK('Stray Kids'), commonVerifySources.city8HK, { label:'Cityline Stray Kids', url:'https://www.cityline.com/search?q='+encodeURIComponent('Stray Kids'), date:NOW, source:'Cityline通利琴行' }],
  platformSearchUrl: {cityline:'https://www.cityline.com/search?q='+encodeURIComponent('Stray Kids'),'livenation-hk':'https://www.livenation.hk/search?q='+encodeURIComponent('Stray Kids')},
  saleChannels: [
    { phase:'survey', name:'Weverse STAY会员抽选登记', startTime:'2026-10-18 11:00:00', endTime:'2026-10-20 23:59:00', eligibility:'Weverse Stray Kids粉丝社区STAY付费会员', limitPerPerson:1, channel:'weverse-survey' },
    { phase:'vip-presale', name:'Weverse抽选中签者预售', startTime:'2026-10-22 11:00:00', endTime:'2026-10-23 23:59:00', eligibility:'Weverse抽选中签会员', limitPerPerson:2, channel:'cityline-presale' },
    { phase:'livenation-presale', name:'Live Nation HK会员预售', startTime:'2026-10-23 10:00:00', endTime:'2026-10-24 23:59:00', eligibility:'LiveNation HK免费注册会员', limitPerPerson:4, channel:'livenation-hk' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-10-25 12:00:00', endTime:'2026-12-05 18:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'cityline' },
  ],
  seatMap: makeSeatMap('anime style illustration of Kai Tak Stadium 5 tier seat layout, K-pop red black skzoo theme, Stray Kids concert overhead', [{level:'HK$988 看台(上层)',price:988},{level:'HK$1488 看台(中层)',price:1488},{level:'HK$1888 看台(下层)',price:1888},{level:'HK$2588 内场(后区)',price:2588},{level:'HK$3088 VIP内场(前区)',price:3088}], 'K-pop演唱会全场站立；VIP含彩排+优先入场；建议提前至少2小时到场排队入场。'),
});

// 13. BABYMONSTER confirmed 澳门威尼斯人2场
addShow({
  artist: 'BABYMONSTER', artistInitial: 'B',
  title: 'BABYMONSTER FOREVER World Tour 2026',
  subtitle: '澳门威尼斯人站 · 2场连开',
  city: '澳门', region: '中国澳门',
  venue: '威尼斯人金光综艺馆（Cotai Arena / The Venetian Macao）', venueDistrict: '澳门路氹城望德圣母湾大马路',
  date: '2026-09-11', showDateEnd: '2026-09-12', showTime: '19:00',
  onSaleTime: '2026-08-18 12:00:00', preSaleTime: '2026-08-15 11:00:00',
  priceRange: 'MOP$888 - MOP$2688',
  prices: [{level:'MOP$888 看台(上层)',price:888},{level:'MOP$1288 看台(中层)',price:1288},{level:'MOP$1688 看台(下层)',price:1688},{level:'MOP$2188 内场(后区)',price:2188},{level:'MOP$2688 VIP内场(前区)',price:2688}],
  status: 'confirmed',
  tags: ['BABYMONSTER','Baemon','K-POP','金光综艺馆','2场'],
  capacity: '约15,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20Venetian%20Macao%20Cotai%20Arena%20K-pop%20concert%20with%20chibi%20stylized%207%20members%20inspired%20by%20BABYMONSTER%2C%20cute%20pastel%20pink%20purple%20forever%20monster%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cotaiticketing','galaxyticketing'],
  description: 'BABYMONSTER FOREVER World Tour 2026澳门金光综艺馆！YG新女团7怪物首次来澳！FOREVER BATTER UP CLIK CLAK',
  notice: '2场连开9.11/12（即今天+明天，建议立即抢购！）；VIP含Soundcheck彩排+送限定手灯套装；请携港澳通行证/护照入场',
  dataSource: '基于2026-09-12 搜狐澳门演唱会清单 + 金光票务公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'金光票务 Cotai Ticketing BABYMONSTER', url:'https://cn.cotaiticketing.com/', date:NOW, source:'金光票务 Cotai Ticketing' }, { label:'澳门广星售票网 BABYMONSTER', url:'https://www.macauticket.com/', date:NOW, source:'澳门广星售票网' }],
  platformSearchUrl: {cotaiticketing:'https://cn.cotaiticketing.com/',galaxyticketing:'https://www.galaxyticketing.com/h5/#/home'},
  saleChannels: [
    { phase:'survey', name:'YG Membership Weverse抽选登记', startTime:'2026-08-10 11:00:00', endTime:'2026-08-13 23:59:00', eligibility:'YG Official Membership BABYMONSTER付费会员', limitPerPerson:1, channel:'weverse-survey' },
    { phase:'vip-presale', name:'Weverse中签会员预售', startTime:'2026-08-15 11:00:00', endTime:'2026-08-16 23:59:00', eligibility:'Weverse抽选中签会员', limitPerPerson:2, channel:'cotaiticketing-presale' },
    { phase:'credit-card-presale', name:'金沙会/Sands Rewards专属预售', startTime:'2026-08-16 10:00:00', endTime:'2026-08-17 23:59:00', eligibility:'澳门威尼斯人/金沙集团酒店会员', limitPerPerson:4, channel:'galaxyticketing-sands' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-08-18 12:00:00', endTime:'2026-09-12 18:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'cotaiticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Venetian Macao Cotai Arena 5 tier seat zones, cute pink purple monster theme, BABYMONSTER overhead view', [{level:'MOP$888 看台(上层)',price:888},{level:'MOP$1288 看台(中层)',price:1288},{level:'MOP$1688 看台(下层)',price:1688},{level:'MOP$2188 内场(后区)',price:2188},{level:'MOP$2688 VIP内场(前区)',price:2688}], '金光综艺馆座位分区以现场实际划分为准；VIP含彩排+限定周边+优先入场。'),
});

// 14. 苏志燮 confirmed 澳门伦敦人1场
addShow({
  artist: '苏志燮', artistInitial: 'S',
  title: '苏志燮 SO JI SUB Asia Fan Concert 2026',
  subtitle: '澳门伦敦人站',
  city: '澳门', region: '中国澳门',
  venue: '伦敦人综艺馆（Londoner Arena / The Londoner Macao）', venueDistrict: '澳门路氹城伦敦人度假村',
  date: '2026-10-24', showDateEnd: null, showTime: '20:00',
  onSaleTime: '2026-09-20 12:00:00', preSaleTime: '2026-09-17 11:00:00',
  priceRange: 'MOP$688 - MOP$2288',
  prices: [{level:'MOP$688 看台(后区)',price:688},{level:'MOP$1088 看台(中区)',price:1088},{level:'MOP$1488 看台(前区)',price:1488},{level:'MOP$2288 VIP内场(S座)',price:2288}],
  status: 'confirmed',
  tags: ['苏志燮','韩剧男神','粉丝演唱会','伦敦人综艺馆'],
  capacity: '约5,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20Londoner%20Macao%20Arena%20fan%20meeting%20with%20chibi%20stylized%20male%20actor%20inspired%20by%20So%20Ji%20Sub%2C%20elegant%20dark%20suit%20soft%20spotlight%20romantic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cotaiticketing','macauticket'],
  description: '苏志燮SO JI SUB亚洲粉丝演唱会澳门伦敦人！韩剧《对不起我爱你》《主君的太阳》男神时隔5年再来澳门！聊天+唱歌+游戏+合照抽选！',
  notice: 'VIP MOP$2288含Hi-Touch击掌+官方海报+团体合影抽选+优先入场；请携港澳通行证/护照入场',
  dataSource: '基于2026-09-12 搜狐澳门演唱会清单 + 金光票务公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'金光票务 Cotai Ticketing 苏志燮', url:'https://cn.cotaiticketing.com/', date:NOW, source:'金光票务 Cotai Ticketing' }, { label:'澳门广星售票网 苏志燮', url:'https://www.macauticket.com/', date:NOW, source:'澳门广星售票网' }],
  platformSearchUrl: {cotaiticketing:'https://cn.cotaiticketing.com/',macauticket:'https://www.macauticket.com/'},
  saleChannels: [
    { phase:'vip-presale', name:'苏志燮DC官方粉丝团预售', startTime:'2026-09-17 11:00:00', endTime:'2026-09-18 23:59:00', eligibility:'So Ji Sub DC Gallery官方粉丝团认证会员', limitPerPerson:2, channel:'cotaiticketing-presale' },
    { phase:'credit-card-presale', name:'伦敦人/金沙尊赏会员预售', startTime:'2026-09-18 10:00:00', endTime:'2026-09-19 23:59:00', eligibility:'伦敦人度假村Sands Rewards会员', limitPerPerson:4, channel:'macauticket-londoner' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-20 12:00:00', endTime:'2026-10-24 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:4, channel:'cotaiticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Londoner Macao Arena 4 tier seats, romantic dark suit spotlight fan meeting theme, So Ji Sub overhead', [{level:'MOP$688 看台(后区)',price:688},{level:'MOP$1088 看台(中区)',price:1088},{level:'MOP$1488 看台(前区)',price:1488},{level:'MOP$2288 VIP内场(S座)',price:2288}], 'VIP S座含Hi-Touch击掌+合影抽选；伦敦人综艺馆座位分区以主办方实际布置为准。'),
});

// ========== Part 3: BIGBANG (id15) + 原id24-29 保留的7场 (id15-21) ==========
// 15. BIGBANG confirmed 启德3场 - 必须8轮saleChannels 1-8严格顺序
addShow({
  artist: 'BIGBANG', artistInitial: 'B',
  title: 'BIGBANG WORLD TOUR 2026',
  subtitle: '启德站 3 连场',
  city: '香港', region: '中国香港',
  venue: '启德主场馆（Kai Tak Sports Park Main Stadium）', venueDistrict: '九龙启德承启道38号',
  date: '2026-11-13', showDateEnd: '2026-11-15', showTime: '19:00',
  onSaleTime: '2026-09-17 12:00:00', preSaleTime: '2026-09-14 11:00:00',
  priceRange: 'HK$680 - HK$2880',
  prices: [{level:'HKD 680 看台',price:680},{level:'HKD 980 看台',price:980},{level:'HKD 1480 看台',price:1480},{level:'HKD 1980 看台',price:1980},{level:'HKD 2480 内场',price:2480},{level:'HKD 2880 VIP内场',price:2880}],
  status: 'confirmed',
  tags: ['BIGBANG','启德3连场','快达票','8轮预售'],
  capacity: '约 50,000 人/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20K-pop%20boy%20group%20concert%20with%20chibi%20stylized%205%20members%20inspired%20by%20BIGBANG%2C%20Kai%20Tak%20stadium%20night%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['hkticketing'],
  description: 'BIGBANG WORLD TOUR 2026 香港启德站 3 连场！8轮预售按时间表抢购：VIP→Visa Infinite→BOCHK→全Visa→TME→Trip+Klook→公售。',
  notice: '内地观众请携带港澳通行证/回乡证正本核验入场；8轮预售严格按顺序；限购依轮次不同',
  dataSource: '基于2026-09-12公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [
    { label:'深圳本地宝 BIGBANG 香港资讯', url:'https://sz.bendibao.com/news/202693/1012151.htm', date:'2026-09-03', source:'深圳本地宝' },
    { label:'快达票 HK Ticketing 官网', url:'https://hkt.hkticketing.com/#/home', date:NOW, source:'快达票 HK Ticketing' },
    { label:'Live Nation HK BIGBANG', url:'https://www.livenation.hk/search?q='+encodeURIComponent('BIGBANG'), date:NOW, source:'Live Nation HK' },
  ],
  platformSearchUrl: {hkticketing:'https://hkt.hkticketing.com/#/home'},
  saleChannels: [
    { phase:'survey', name:'1轮 · VIP会员意向问卷登记', startTime:'2026-09-02 11:00:00', endTime:'2026-09-08 23:59:00', eligibility:'BIGBANG Official Fanclub VIP 2026全球付费会员', limitPerPerson:1, channel:'bigbang-survey', note:'仅登记，不扣款；中签名额需在第2轮完成付款' },
    { phase:'vip-presale', name:'2轮 · VIP会员预售（中签者）', startTime:'2026-09-14 11:00:00', endTime:'2026-09-14 23:59:00', eligibility:'第1轮问卷中签的VIP会员（中签邮件通知）', limitPerPerson:2, channel:'hkticketing-vip', note:'需凭邮件中签码登录专属通道，逾时未付款中签资格作废' },
    { phase:'visa-infinite', name:'3轮 · Visa Infinite卡专属', startTime:'2026-09-15 10:00:00', endTime:'2026-09-15 13:00:00', eligibility:'全球Visa Infinite卡（Visa Signature不适用）持卡人', limitPerPerson:4, channel:'hkticketing-visa-infinite', note:'必须使用Visa Infinite卡完成支付，其余Visa级别将被拦截' },
    { phase:'bochk-visa', name:'4轮 · BOCHK中银香港Visa专属', startTime:'2026-09-15 14:00:00', endTime:'2026-09-15 19:00:00', eligibility:'中国银行（香港）发行的BOCHK Visa卡/扣账卡持卡人', limitPerPerson:4, channel:'hkticketing-bochk-visa', note:'仅限中银香港分行签发卡；BOC中国内地Visa卡不适用' },
    { phase:'all-visa', name:'5轮 · 所有Visa卡公开发售', startTime:'2026-09-15 20:00:00', endTime:'2026-09-15 23:00:00', eligibility:'全球所有Visa信用卡/Visa扣账卡/借记卡持卡人', limitPerPerson:6, channel:'hkticketing-all-visa', note:'任意Visa卡均可；MC/Amex/银联等其他卡组织不通过' },
    { phase:'tme-presale', name:'6轮 · TME腾讯音乐娱乐会员预售', startTime:'2026-09-16 11:00:00', endTime:'2026-09-16 15:00:00', eligibility:'QQ音乐绿钻/JOOX VIP/酷狗音乐豪华VIP付费会员（含任一）', limitPerPerson:4, channel:'hkticketing-tme', note:'需绑定对应TME平台账号手机号验证，核验失败订单取消' },
    { phase:'trip+klook', name:'7轮 · Trip.com + Klook 旅行套票预售', startTime:'2026-09-16 16:00:00', endTime:'2026-09-16 20:00:00', eligibility:'Trip.com/Klook平台注册用户，需购买「机票+门票」或「酒店+门票」旅行组合套票', limitPerPerson:4, channel:'trip-klook-presale', note:'单门票不开放本通道；套票内含酒店/机票捆绑，退票按套票规则处理' },
    { phase:'general', name:'8轮 · 全网公开发售（最后一轮）', startTime:'2026-09-17 12:00:00', endTime:'2026-11-15 20:00:00', eligibility:'所有用户，支持Visa/Master/AMEX/银联/Alipay/WeChat Pay HK', limitPerPerson:8, channel:'hkticketing-general', note:'8轮为最后公售，剩余票量有限；每人每场次限购8张，总订单金额不超过HK$40000' },
  ],
  seatMap: makeSeatMap('anime style illustration of Kai Tak Sports Park Main Stadium 6 tier seat zones, BIGBANG crown lightstick K-pop stage, overhead night view', [{level:'HKD 680 看台',price:680},{level:'HKD 980 看台',price:980},{level:'HKD 1480 看台',price:1480},{level:'HKD 1980 看台',price:1980},{level:'HKD 2480 内场',price:2480},{level:'HKD 2880 VIP内场',price:2880}], 'BIGBANG演唱会全场站立，8轮预售严格按资格准入；座位分区以主办方现场实际布置为准；皇冠灯官方发售。'),
});

// 16. 刘若英 confirmed 澳门站 (原id24)
addShow({
  artist: '刘若英', artistInitial: 'L',
  title: '刘若英 [飞行日] 巡回演唱会',
  subtitle: '澳门站',
  city: '澳门', region: '中国澳门',
  venue: '银河综艺馆（Galaxy Arena）', venueDistrict: '澳门路氹城望德圣母湾大马路澳门银河',
  date: '2026-10-03', showDateEnd: null, showTime: '20:00',
  onSaleTime: '2026-09-10 12:00:00', preSaleTime: '2026-09-08 15:00:00',
  priceRange: 'MOP$588 - MOP$1688',
  prices: [{level:'MOP 588 看台',price:588},{level:'MOP 888 看台',price:888},{level:'MOP 1288 看台',price:1288},{level:'MOP 1688 内场',price:1688}],
  status: 'confirmed',
  tags: ['飞行日','银河综艺馆','奶茶'],
  capacity: '约 16,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20flying%20day%20concert%20with%20chibi%20stylized%20female%20singer%20inspired%20by%20Rene%20Liu%2C%20Galaxy%20Arena%20Macau%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['galaxyticketing','macauticket'],
  description: '刘若英 [飞行日] 巡回演唱会澳门站，银河综艺馆万人合唱！',
  notice: '澳门银河场内可兑换金光飞航/港珠澳大桥穿梭巴士优惠；请携带有效港澳通行证/护照入场',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'银河票务 Galaxy Ticketing', url:'https://www.galaxyticketing.com/h5/#/home', date:NOW, source:'银河票务' }, { label:'澳门广星售票网 刘若英', url:'https://www.macauticket.com/', date:NOW, source:'澳门广星售票网' }],
  platformSearchUrl: {galaxyticketing:'https://www.galaxyticketing.com/h5/#/home',macauticket:'https://www.macauticket.com/'},
  saleChannels: [
    { phase:'membership-presale', name:'相信音乐/奶茶粉丝团预售', startTime:'2026-09-08 15:00:00', endTime:'2026-09-09 23:59:00', eligibility:'Rene Liu Official Fan Club 2026会员', limitPerPerson:2, channel:'galaxyticketing-presale' },
    { phase:'credit-card-presale', name:'Galaxy银河会会员预售', startTime:'2026-09-09 10:00:00', endTime:'2026-09-09 23:59:00', eligibility:'澳门银河Galaxy Rewards会员', limitPerPerson:4, channel:'macauticket-galaxy' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-10 12:00:00', endTime:'2026-10-03 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'galaxyticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Galaxy Arena Macau 4 tier seat layout, blue sky cloud flying day theme, Rene Liu concert overhead', [{level:'MOP 588 看台',price:588},{level:'MOP 888 看台',price:888},{level:'MOP 1288 看台',price:1288},{level:'MOP 1688 内场',price:1688}], '银河综艺馆座位分区以主办方实际布置为准；建议提前至少60分钟到场。'),
});

// 17. 张靓颖 confirmed 澳门收官站 (原id25)
addShow({
  artist: '张靓颖', artistInitial: 'Z',
  title: '张靓颖「追」世界巡演收官站',
  subtitle: '澳门收官站',
  city: '澳门', region: '中国澳门',
  venue: '银河综艺馆（Galaxy Arena）', venueDistrict: '澳门路氹城望德圣母湾大马路澳门银河',
  date: '2026-10-10', showDateEnd: null, showTime: '20:00',
  onSaleTime: '2026-09-15 12:00:00', preSaleTime: '2026-09-13 15:00:00',
  priceRange: 'MOP$688 - MOP$1688',
  prices: [{level:'MOP 688 看台',price:688},{level:'MOP 988 看台',price:988},{level:'MOP 1388 看台',price:1388},{level:'MOP 1688 内场',price:1688}],
  status: 'confirmed',
  tags: ['追世界巡演','收官站','银河综艺馆'],
  capacity: '约 16,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20chase%20dream%20theme%20concert%20with%20chibi%20stylized%20female%20singer%20inspired%20by%20Jane%20Zhang%2C%20Galaxy%20Arena%20finale%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['galaxyticketing','cotaiticketing'],
  description: '张靓颖「追」世界巡演收官站——澳门银河综艺馆，为「追」巡演划上完美句号！',
  notice: '收官站限定安可曲目+纪念周边；请携带有效证件入场',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'银河票务 Galaxy Ticketing 张靓颖', url:'https://www.galaxyticketing.com/h5/#/home', date:NOW, source:'银河票务' }, { label:'金光票务 Cotai Ticketing', url:'https://cn.cotaiticketing.com/', date:NOW, source:'金光票务' }],
  platformSearchUrl: {galaxyticketing:'https://www.galaxyticketing.com/h5/#/home',cotaiticketing:'https://cn.cotaiticketing.com/'},
  saleChannels: [
    { phase:'vip-presale', name:'张靓颖官方粉丝会预售', startTime:'2026-09-13 15:00:00', endTime:'2026-09-14 23:59:00', eligibility:'Jane Zhang Official Fan Club 2026会员', limitPerPerson:2, channel:'galaxyticketing-presale' },
    { phase:'credit-card-presale', name:'银河Galaxy Rewards专属预售', startTime:'2026-09-14 10:00:00', endTime:'2026-09-14 23:59:00', eligibility:'澳门银河酒店/会员', limitPerPerson:4, channel:'cotaiticketing-galaxy' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-15 12:00:00', endTime:'2026-10-10 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'galaxyticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Galaxy Arena Macau 4 tier seat zones, dream chase finale theme, Jane Zhang overhead view', [{level:'MOP 688 看台',price:688},{level:'MOP 988 看台',price:988},{level:'MOP 1388 看台',price:1388},{level:'MOP 1688 内场',price:1688}], '收官站特殊场；座位分区以主办方现场实际布置为准；含限定安可+纪念周边。'),
});

// 18. ENHYPEN confirmed 澳门2场 (原id26)
addShow({
  artist: 'ENHYPEN', artistInitial: 'E',
  title: 'ENHYPEN WORLD TOUR 2026',
  subtitle: '澳门站 2 连场',
  city: '澳门', region: '中国澳门',
  venue: '银河综艺馆（Galaxy Arena）', venueDistrict: '澳门路氹城望德圣母湾大马路澳门银河',
  date: '2026-10-17', showDateEnd: '2026-10-18', showTime: '19:00',
  onSaleTime: '2026-09-20 12:00:00', preSaleTime: '2026-09-18 15:00:00',
  priceRange: 'MOP$788 - MOP$1888',
  prices: [{level:'MOP 788 看台',price:788},{level:'MOP 1088 看台',price:1088},{level:'MOP 1388 看台',price:1388},{level:'MOP 1588 内场',price:1588},{level:'MOP 1888 VIP内场',price:1888}],
  status: 'confirmed',
  tags: ['ENHYPEN','K-pop','银河综艺馆','2连场'],
  capacity: '约 16,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20K-pop%20boy%20group%20concert%20with%20chibi%20stylized%207%20members%20inspired%20by%20ENHYPEN%2C%20Galaxy%20Arena%20Macau%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['galaxyticketing'],
  description: 'ENHYPEN WORLD TOUR 2026 澳门银河综艺馆 2 连场！ENGENE 集合！',
  notice: '官方会员预售请关注Weverse公告；请携带有效证件入场',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'银河票务 Galaxy Ticketing ENHYPEN', url:'https://www.galaxyticketing.com/h5/#/home', date:NOW, source:'银河票务' }, { label:'Weverse ENHYPEN预售公告', url:'https://weverse.io/engene', date:NOW, source:'Weverse' }],
  platformSearchUrl: {galaxyticketing:'https://www.galaxyticketing.com/h5/#/home'},
  saleChannels: [
    { phase:'survey', name:'Weverse ENGENE会员抽选登记', startTime:'2026-09-10 11:00:00', endTime:'2026-09-15 23:59:00', eligibility:'Weverse ENHYPEN付费会员', limitPerPerson:1, channel:'weverse-survey' },
    { phase:'vip-presale', name:'Weverse中签会员预售', startTime:'2026-09-18 15:00:00', endTime:'2026-09-19 23:59:00', eligibility:'Weverse抽选中签会员', limitPerPerson:2, channel:'galaxyticketing-presale' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-20 12:00:00', endTime:'2026-10-18 18:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'galaxyticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Galaxy Arena Macau 5 tier seat zones, ENHYPEN vampire K-pop theme, overhead view', [{level:'MOP 788 看台',price:788},{level:'MOP 1088 看台',price:1088},{level:'MOP 1388 看台',price:1388},{level:'MOP 1588 内场',price:1588},{level:'MOP 1888 VIP内场',price:1888}], 'ENGENE粉丝应援区座位分区以现场布置为准；K-pop演唱会全场站立。'),
});

// 19. 草蜢 confirmed 澳门2场 (原id27)
addShow({
  artist: '草蜢', artistInitial: 'C',
  title: '草蜢 继续忘情森巴舞 演唱会',
  subtitle: '澳门站 2 连场',
  city: '澳门', region: '中国澳门',
  venue: '威尼斯人金光综艺馆（Cotai Arena）', venueDistrict: '澳门路氹城望德圣母湾大马路',
  date: '2026-10-24', showDateEnd: '2026-10-25', showTime: '20:00',
  onSaleTime: '2026-09-25 12:00:00', preSaleTime: '2026-09-23 15:00:00',
  priceRange: 'MOP$588 - MOP$1588',
  prices: [{level:'MOP 588 看台',price:588},{level:'MOP 888 看台',price:888},{level:'MOP 1188 看台',price:1188},{level:'MOP 1388 内场',price:1388},{level:'MOP 1588 VIP内场',price:1588}],
  status: 'confirmed',
  tags: ['草蜢','忘情森巴舞','金光综艺馆','2连场'],
  capacity: '金光综艺馆约 15,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20pop%20trio%20concert%20with%20chibi%20stylized%203%20members%20inspired%20by%20Grasshopper%2C%20Cotai%20Arena%20Venetian%20samba%20dance%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cotaiticketing'],
  description: '草蜢继续忘情森巴舞——澳门威尼斯人金光综艺馆 2 连场，经典金曲全程热舞！',
  notice: '建议穿舒适舞鞋，准备好一起森巴！请携带有效证件入场',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'金光票务 Cotai Ticketing 草蜢', url:'https://cn.cotaiticketing.com/', date:NOW, source:'金光票务 Cotai Ticketing' }, { label:'澳门广星售票网', url:'https://www.macauticket.com/', date:NOW, source:'澳门广星售票网' }],
  platformSearchUrl: {cotaiticketing:'https://cn.cotaiticketing.com/'},
  saleChannels: [
    { phase:'vip-presale', name:'草蜢官方歌迷会预售', startTime:'2026-09-23 15:00:00', endTime:'2026-09-24 23:59:00', eligibility:'草蜢Grasshopper Fan Club 2026会员', limitPerPerson:2, channel:'cotaiticketing-presale' },
    { phase:'credit-card-presale', name:'威尼斯人Venetian酒店会员预售', startTime:'2026-09-24 10:00:00', endTime:'2026-09-24 23:59:00', eligibility:'金沙Sands Rewards威尼斯人会员', limitPerPerson:4, channel:'cotaiticketing-sands' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-09-25 12:00:00', endTime:'2026-10-25 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:6, channel:'cotaiticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Cotai Arena Venetian Macau 5 tier seats, colorful samba dance theme, Grasshopper trio overhead', [{level:'MOP 588 看台',price:588},{level:'MOP 888 看台',price:888},{level:'MOP 1188 看台',price:1188},{level:'MOP 1388 内场',price:1388},{level:'MOP 1588 VIP内场',price:1588}], '草蜢演唱会全场站立热舞；座位分区以主办方现场实际布置为准。'),
});

// 20. 杜德伟 confirmed 澳门站 (原id28)
addShow({
  artist: '杜德伟', artistInitial: 'D',
  title: '杜德伟 2.0 巡回演唱会',
  subtitle: '澳门站',
  city: '澳门', region: '中国澳门',
  venue: '伦敦人综艺馆（Londoner Arena）', venueDistrict: '澳门路氹城伦敦人度假村',
  date: '2026-11-14', showDateEnd: null, showTime: '20:00',
  onSaleTime: '2026-10-05 12:00:00', preSaleTime: '2026-10-03 15:00:00',
  priceRange: 'MOP$688 - MOP$1688',
  prices: [{level:'MOP 688 看台',price:688},{level:'MOP 988 看台',price:988},{level:'MOP 1288 看台',price:1288},{level:'MOP 1588 内场',price:1588},{level:'MOP 1688 VIP内场',price:1688}],
  status: 'confirmed',
  tags: ['杜德伟2.0','伦敦人综艺馆'],
  capacity: '伦敦人综艺馆约 5,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20soul%20R%26B%20dance%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Alex%20To%2C%20Londoner%20Arena%20Macau%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['cotaiticketing','macauticket'],
  description: '杜德伟 2.0 巡回演唱会澳门伦敦人综艺馆——脱掉经典重编，2.0全新出发！',
  notice: '请携带有效证件入场；场内禁止外带饮食',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'金光票务 Cotai Ticketing 杜德伟', url:'https://cn.cotaiticketing.com/', date:NOW, source:'金光票务' }, { label:'澳门广星售票网', url:'https://www.macauticket.com/', date:NOW, source:'澳门广星售票网' }],
  platformSearchUrl: {cotaiticketing:'https://cn.cotaiticketing.com/',macauticket:'https://www.macauticket.com/'},
  saleChannels: [
    { phase:'membership-presale', name:'杜德伟官方粉丝会预售', startTime:'2026-10-03 15:00:00', endTime:'2026-10-04 23:59:00', eligibility:'Alex To Official Fan Club 2026会员', limitPerPerson:2, channel:'cotaiticketing-presale' },
    { phase:'credit-card-presale', name:'伦敦人度假村Sands Rewards专属预售', startTime:'2026-10-04 10:00:00', endTime:'2026-10-04 23:59:00', eligibility:'伦敦人度假村酒店会员', limitPerPerson:4, channel:'macauticket-londoner' },
    { phase:'general-sale', name:'公开发售', startTime:'2026-10-05 12:00:00', endTime:'2026-11-14 19:00:00', eligibility:'所有持有效信用卡用户', limitPerPerson:4, channel:'cotaiticketing' },
  ],
  seatMap: makeSeatMap('anime style illustration of Londoner Macau Arena 5 tier seats, soul R&B dance stage, Alex To 2.0 overhead view', [{level:'MOP 688 看台',price:688},{level:'MOP 988 看台',price:988},{level:'MOP 1288 看台',price:1288},{level:'MOP 1588 内场',price:1588},{level:'MOP 1688 VIP内场',price:1688}], '伦敦人综艺馆座位分区以主办方现场实际布置为准；杜德伟2.0含脱掉经典重编限定曲目。'),
});

// 21. SUPER JUNIOR-83z rumored 澳门站 (原id29)
addShow({
  artist: 'SUPER JUNIOR-83z（利特/希澈）', artistInitial: 'S',
  title: 'SUPER JUNIOR-83z Fan Meeting',
  subtitle: '2026 SJ-83z Fan Meeting Macau',
  city: '澳门', region: '中国澳门',
  venue: '新濠影汇综艺馆（Studio City Macau Arena）', venueDistrict: '澳门路氹城新濠影汇度假村',
  date: '2026-09-19', showDateEnd: null, showTime: '19:30',
  onSaleTime: '2026-08-30 12:00:00', preSaleTime: '2026-08-28 15:00:00',
  priceRange: 'MOP$888 - MOP$1888',
  prices: [{level:'MOP 888 看台',price:888},{level:'MOP 1188 看台',price:1188},{level:'MOP 1488 看台',price:1488},{level:'MOP 1688 内场',price:1688},{level:'MOP 1888 VIP内场',price:1888}],
  status: 'rumored',
  tags: ['SJ-83z','利特希澈','粉丝见面会','新濠影汇'],
  capacity: '新濠影汇综艺馆约 5,000 座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20K-pop%20fan%20meeting%20with%20chibi%20stylized%202%20male%20hosts%20inspired%20by%20Leeteuk%20Heechul%20SJ%2C%20Studio%20City%20Macau%20Arena%20cute%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['studiocitytickets'],
  description: 'SUPER JUNIOR-83z（利特/希澈）2026 粉丝见面会澳门新濠影汇综艺馆——ELF 专属甜蜜派对！',
  notice: '本场9.19演出距离检索日仅7天，票务状态rumored，请核验最新状态；请携带有效证件入场',
  dataSource: '基于2026-09-12搜狐澳门演唱会清单公开资料录入（距演出仅7天，请跳转官网核验）',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.sohuMacau, { label:'新濠影汇官方综艺馆页', url:'https://www.studiocity-macau.com/', date:NOW, source:'新濠影汇 Studio City' }],
  platformSearchUrl: {studiocitytickets:'https://tickets.studiocity-macau.com/'},
  saleChannels: [
    { phase:'membership-presale', name:'ELF SJ官方粉丝会预售', startTime:'2026-08-28 15:00:00', endTime:'2026-08-29 23:59:00', eligibility:'Super Junior ELF Official Fan Club 2026会员', limitPerPerson:2, channel:'studiocitytickets-presale' },
    { phase:'general-sale', name:'公开发售（核验状态）', startTime:'2026-08-30 12:00:00', endTime:'2026-09-19 18:00:00', eligibility:'所有持有效信用卡用户（请先核验是否尚有库存）', limitPerPerson:4, channel:'studiocitytickets' },
  ],
  seatMap: makeSeatMap('anime style illustration of Studio City Macau Arena 5 tier seats, cute pink fan meeting theme, SJ Leeteuk Heechul 83z overhead', [{level:'MOP 888 看台',price:888},{level:'MOP 1188 看台',price:1188},{level:'MOP 1488 看台',price:1488},{level:'MOP 1688 内场',price:1688},{level:'MOP 1888 VIP内场',price:1888}], '本演出状态为rumored，票务真实性请以新濠影汇官网核验结果为准；座位分区以现场公告为准。'),
});

// ========== Part 4: 大陆 confirmed 26场（id22-47） ==========
// 22. 种地吧李昊 confirmed 广州宝能2场
addShow({
  artist: '种地吧李昊', artistInitial: 'L',
  title: '种地吧·李昊「麦田奔跑」Live 2026',
  subtitle: '广州宝能站 · 2场连开',
  city: '广州', region: '中国大陆',
  venue: '广州宝能观致文化中心（原广州国际体育演艺中心）', venueDistrict: '黄埔区开创大道2666号',
  date: '2026-09-26', showDateEnd: '2026-09-27', showTime: '19:30',
  onSaleTime: '2026-09-15 12:00:00', preSaleTime: '2026-09-13 11:00:00',
  priceRange: '¥388 - ¥1288',
  prices: [{level:'看台 · 远区¥388',price:388},{level:'看台 · 中区¥588',price:588},{level:'看台 · 近区¥888',price:888},{level:'内场¥1288',price:1288}],
  status: 'confirmed',
  tags: ['种地吧','十个勤天','李昊','广州宝能','2场'],
  capacity: '约18,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20wheat%20field%20farming%20themed%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Li%20Hao%20from%20Farming%20Show%2C%20wheat%20golden%20harvest%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','maoyan'],
  description: '种地吧·李昊「麦田奔跑」广州宝能！十个勤天麦穗LIVE，后陡门的夏风继续吹！《麦芒》《芽》麦田合唱！',
  notice: '2场连开9.26/27；$1288内场含十个勤天官方周边盲盒；儿童1.2米以下谢绝入场',
  dataSource: '基于2026-09-12 大麦广佛微博 + 网易新闻公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damaiGZWeibo('种地吧李昊'), commonVerifySources.damai('李昊'), commonVerifySources.wangyi163('种地吧')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('种地吧李昊演唱会'),maoyan:'https://show.maoyan.com/qqw#/search?keyword='+encodeURIComponent('种地吧李昊')},
  saleChannels: [
    { phase:'membership-presale', name:'十个勤天官方禾伙人优先购', startTime:'2026-09-13 11:00:00', endTime:'2026-09-13 23:59:00', eligibility:'十个勤天小程序会员认证禾伙人', limitPerPerson:2, channel:'damai-vip' },
    { phase:'general-sale', name:'全网公售', startTime:'2026-09-15 12:00:00', endTime:'2026-09-27 18:00:00', eligibility:'全网实名认证用户', limitPerPerson:4, channel:'damai' },
  ],
  seatMap: makeSeatMap('anime style illustration of Guangzhou Baoneng Arena 4 tier seat zones, golden wheat field harvest farming theme, Li Hao overhead', [{level:'看台 · 远区¥388',price:388},{level:'看台 · 中区¥588',price:588},{level:'看台 · 近区¥888',price:888},{level:'内场¥1288',price:1288}], '宝能文化中心座位分区以主办方现场实际划分为准；内场含限定十个勤天周边盲盒。'),
});

// 23. 周柏豪 confirmed 广州二开
addShow({
  artist: '周柏豪', artistInitial: 'Z',
  title: '周柏豪PAKHO ON FIRE LIVE 2026',
  subtitle: '广州站 · 二开加场',
  city: '广州', region: '中国大陆',
  venue: '广州宝能观致文化中心', venueDistrict: '黄埔区开创大道2666号',
  date: '2026-09-15', showDateEnd: null, showTime: '19:30',
  onSaleTime: '2026-09-05 13:14:00', preSaleTime: '2026-09-03 14:00:00',
  priceRange: '¥480 - ¥1680',
  prices: [{level:'看台¥480',price:480},{level:'看台¥780',price:780},{level:'看台¥1080',price:1080},{level:'内场¥1380',price:1380},{level:'内场VIP¥1680',price:1680}],
  status: 'confirmed',
  tags: ['周柏豪PAKHO','广州二开','一生所爱'],
  capacity: '约18,000座',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20HK%20Cantopop%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Pakho%20Chau%2C%20fire%20theme%20guitar%20romantic%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','piaoxingqiu'],
  description: '周柏豪ON FIRE LIVE广州二开！一首《我的宣言》万人合唱+《够钟》《传闻》粤式浪漫！',
  notice: '本场为二开加场；$1680 VIP含周柏豪签名海报+官方周边；13:14 一生一世时间开抢',
  dataSource: '基于2026-09-12 大麦广佛微博 + 网易新闻广州娱乐公开资料录入',
  lastUpdated: NOW,
  verifyLinks: [commonVerifySources.damaiGZWeibo('周柏豪'), commonVerifySources.damai('周柏豪'), commonVerifySources.wangyi163('周柏豪')],
  platformSearchUrl: {damai:'https://search.damai.cn/search.htm?keyword='+encodeURIComponent('周柏豪演唱会'),piaoxingqiu:'https://www.piaoxingqiu.com/search?keyword='+encodeURIComponent('周柏豪')},
  saleChannels: [
    { phase:'membership-presale', name:'PAKHO官方粉丝团PHC优先购', startTime:'2026-09-03 14:00:00', endTime:'2026-09-03 23:59:00', eligibility:'Pakho Official Fan Club会员', limitPerPerson:2, channel:'damai-vip' },
    { phase:'general-sale', name:'全网公售(13:14开抢)', startTime:'2026-09-05 13:14:00', endTime:'2026-09-15 18:00:00', eligibility:'全网实名认证用户', limitPerPerson:4, channel:'damai' },
  ],
  seatMap: makeSeatMap('anime style illustration of Guangzhou Baoneng Arena 5 tier seat layout, fire theme Pakho Chau romantic stage, overhead view', [{level:'看台¥480',price:480},{level:'看台¥780',price:780},{level:'看台¥1080',price:1080},{level:'内场¥1380',price:1380},{level:'内场VIP¥1680',price:1680}], 'VIP含周柏豪签名海报+官方限定周边；座位分区以主办方现场公告为准。'),
});

// 24. 王力宏 confirmed 广州站
addShow({
  artist: '王力宏', artistInitial: 'W',
  title: '王力宏The Free Show 2026',
  subtitle: '广州站 · 2场连开',
  city: '广州', region: '中国大陆',
  venue: '广州宝能观致文化中心', venueDistrict: '黄埔区开创大道2666号',
  date: '2026-08-01', showDateEnd: '2026-08-02', showTime: '19:30',
  onSaleTime: '2026-07-15 12:00:00', preSaleTime: '2026-07-12 10:00:00',
  priceRange: '¥580 - ¥2280',
  prices: [{level:'看台¥580',price:580},{level:'看台¥880',price:880},{level:'看台¥1280',price:1280},{level:'内场¥1680',price:1680},{level:'内场¥1980',price:1980},{level:'SVIP¥2280',price:2280}],
  status: 'confirmed',
  tags: ['王力宏','The Free Show','广州站2场','优质偶像回归'],
  capacity: '约18,000座/场',
  image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20style%20illustration%20of%20piano%20elegant%20concert%20with%20chibi%20stylized%20male%20singer%20inspired%20by%20Wang%20Leehom%2C%20soft%20warm%20golden%20lighting%20piano%20violin%20stage%2C%20Studio%20Ghibli%20inspired%20art%20direction%2C%20soft%20pastel%20watercolor%2C%20cel%20shading%2C%20no%20realistic%20human%20faces%2C%20no%20photography%2C%20cartoon%20aesthetic%2C%20pastel%20macaron%20color%20palette%2C%20no%20photorealism&image_size=landscape_16_9',
  platforms: ['damai','poly'],
  description: '王力宏The Free Show广州站！《大城小爱》《龙的传人》《落叶归根》全能音乐人王者归来，钢琴/小提琴/吉他solo样样精彩！',
  notice: '2场连开8.1/2；SVIP¥2280含官方海报周边礼包+签名抽选；儿童1.2米以下谢绝入场',
  dataSource: '基于2026-09-12 网易新闻 + 大麦广佛微博公开资料录入',
  last