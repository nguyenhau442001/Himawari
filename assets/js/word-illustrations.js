/**
 * word-illustrations.js
 * Visual Mnemonic, Conceptual Illustration & Part of Speech (POS) Engine for HSK Flashcards.
 * Supports vector SVGs, curated mnemonic stories, remote URLs, and POS classification.
 */

const POS_TYPES = {
  adj: { code: 'adj', label: 'Tính từ', en: 'Adjective', full: 'Tính từ / Adjective' },
  verb: { code: 'verb', label: 'Động từ', en: 'Verb', full: 'Động từ / Verb' },
  noun: { code: 'noun', label: 'Danh từ', en: 'Noun', full: 'Danh từ / Noun' },
  adv: { code: 'adv', label: 'Phó từ', en: 'Adverb', full: 'Phó từ / Adverb' },
  measure: { code: 'measure', label: 'Lượng từ', en: 'Measure Word', full: 'Lượng từ / Measure Word' },
  pron: { code: 'pron', label: 'Đại từ', en: 'Pronoun', full: 'Đại từ / Pronoun' },
  prep: { code: 'prep', label: 'Giới từ', en: 'Preposition', full: 'Giới từ / Preposition' },
  conj: { code: 'conj', label: 'Liên từ', en: 'Conjunction', full: 'Liên từ / Conjunction' },
  num: { code: 'num', label: 'Số từ', en: 'Numeral', full: 'Số từ / Numeral' },
  particle: { code: 'particle', label: 'Trợ từ', en: 'Particle', full: 'Trợ từ / Particle' },
  interj: { code: 'interj', label: 'Thán từ', en: 'Interjection', full: 'Thán từ / Interjection' },
  phrase: { code: 'phrase', label: 'Cụm từ', en: 'Phrase', full: 'Cụm từ / Phrase' },
  idiom: { code: 'idiom', label: 'Thành ngữ', en: 'Idiom', full: 'Thành ngữ / Idiom' }
};

// Comprehensive HSK 1-6 Part of Speech lookup dictionary
const HSK_POS_DB = {"爱": "verb", "八": "num", "爸爸": "noun", "杯子": "noun", "北京": "noun", "本": "measure", "不客气": "phrase", "不": "adv", "菜": "noun", "茶": "noun", "吃": "verb", "出租车": "noun", "打电话": "verb", "大": "adj", "的": "particle", "点": "measure", "电脑": "noun", "电视": "noun", "电影": "noun", "东西": "noun", "都": "adv", "读": "verb", "对不起": "verb", "多": "adj", "多少": "pron", "儿子": "noun", "二": "num", "饭店": "noun", "飞机": "noun", "分钟": "measure", "高兴": "adj", "个": "measure", "工作": "verb", "狗": "noun", "汉语": "noun", "好": "adj", "号": "noun", "喝": "verb", "和": "prep", "很": "adv", "后面": "noun", "回": "verb", "会": "verb", "几": "pron", "家": "noun", "叫": "verb", "今天": "noun", "九": "num", "开": "verb", "看": "verb", "看见": "verb", "块": "measure", "来": "verb", "老师": "noun", "了": "particle", "冷": "adj", "里": "noun", "六": "num", "吗": "particle", "妈妈": "noun", "买": "verb", "猫": "noun", "没关系": "phrase", "没有": "verb", "米饭": "noun", "名字": "noun", "明天": "noun", "哪": "pron", "哪儿": "pron", "那": "pron", "呢": "particle", "能": "verb", "你": "pron", "年": "noun", "女儿": "noun", "朋友": "noun", "漂亮": "adj", "苹果": "noun", "七": "num", "前面": "noun", "钱": "noun", "请": "verb", "去": "verb", "热": "adj", "人": "noun", "认识": "verb", "三": "num", "商店": "noun", "上": "noun", "上午": "noun", "少": "adj", "谁": "pron", "什么": "pron", "十": "num", "时候": "noun", "是": "verb", "书": "noun", "水": "noun", "水果": "noun", "睡觉": "verb", "说": "verb", "四": "num", "岁": "measure", "他": "pron", "她": "pron", "太": "adv", "天气": "noun", "听": "verb", "同学": "noun", "喂": "interj", "我": "pron", "我们": "pron", "五": "num", "喜欢": "verb", "下": "noun", "下午": "noun", "下雨": "verb", "先生": "noun", "现在": "noun", "想": "verb", "小": "adj", "小姐": "noun", "些": "measure", "写": "verb", "谢谢": "verb", "星期": "noun", "学生": "noun", "学习": "verb", "学校": "noun", "一": "num", "一点儿": "noun", "医生": "noun", "医院": "noun", "衣服": "noun", "椅子": "noun", "有": "verb", "月": "noun", "再见": "verb", "在": "verb", "怎么": "pron", "怎么样": "pron", "这": "pron", "中国": "noun", "中午": "noun", "住": "verb", "桌子": "noun", "字": "noun", "昨天": "noun", "做": "verb", "坐": "verb", "吧": "particle", "白": "adj", "百": "num", "帮助": "verb", "报纸": "noun", "比": "verb", "别": "adv", "宾馆": "noun", "长": "adj", "唱歌": "verb", "出": "verb", "穿": "verb", "次": "measure", "从": "prep", "错": "adj", "打篮球": "verb", "大家": "pron", "到": "verb", "得": "particle", "等": "verb", "弟弟": "noun", "第一": "num", "懂": "verb", "对": "adj", "房间": "noun", "非常": "adv", "服务员": "noun", "高": "adj", "告诉": "verb", "哥哥": "noun", "给": "verb", "公共汽车": "noun", "公司": "noun", "贵": "adj", "过": "verb", "孩子": "noun", "还": "adv", "好吃": "adj", "黑": "adj", "红": "adj", "火车站": "noun", "机场": "noun", "鸡蛋": "noun", "件": "measure", "教室": "noun", "姐姐": "noun", "介绍": "verb", "近": "adj", "进": "verb", "就": "adv", "觉得": "verb", "咖啡": "noun", "开始": "verb", "考试": "verb", "可能": "adj", "可以": "verb", "课": "noun", "快": "adj", "快乐": "adj", "累": "adj", "离": "verb", "两": "num", "零": "num", "路": "noun", "旅游": "verb", "卖": "verb", "慢": "adj", "忙": "adj", "每": "pron", "妹妹": "noun", "门": "noun", "面条": "noun", "男": "adj", "您": "pron", "牛奶": "noun", "女": "adj", "旁边": "noun", "跑步": "verb", "便宜": "adj", "票": "noun", "妻子": "noun", "起床": "verb", "千": "num", "铅笔": "noun", "晴": "adj", "去年": "noun", "让": "verb", "日": "measure", "上班": "verb", "身体": "noun", "生病": "verb", "生日": "noun", "时间": "noun", "事情": "noun", "手表": "noun", "手机": "noun", "说话": "verb", "送": "verb", "虽然…但是…": "conj", "它": "pron", "踢足球": "noun", "题": "noun", "跳舞": "verb", "外": "noun", "完": "verb", "玩": "verb", "晚上": "noun", "往": "verb", "为什么": "noun", "问": "verb", "问题": "noun", "希望": "verb", "西瓜": "noun", "洗": "verb", "小时": "noun", "笑": "verb", "新": "adj", "姓": "noun", "休息": "verb", "雪": "noun", "颜色": "noun", "眼睛": "noun", "羊肉": "noun", "药": "noun", "要": "verb", "也": "adv", "一下": "adv", "已经": "adv", "一起": "adv", "意思": "noun", "因为…所以…": "noun", "阴": "adj", "游泳": "verb", "右边": "noun", "鱼": "noun", "远": "adj", "运动": "verb", "再": "adv", "早上": "noun", "丈夫": "noun", "找": "verb", "着": "particle", "真": "adv", "正在": "adv", "知道": "verb", "准备": "verb", "走": "verb", "最": "adv", "左边": "noun", "阿姨": "noun", "啊": "particle", "矮": "adj", "爱好": "verb", "安静": "adj", "把": "measure", "班": "noun", "搬": "verb", "半": "num", "办法": "noun", "办公室": "noun", "帮忙": "verb", "包": "verb", "饱": "adj", "北方": "noun", "被": "prep", "鼻子": "noun", "比较": "verb", "比赛": "verb", "笔记本": "noun", "必须": "adv", "变化": "verb", "别人": "pron", "冰箱": "noun", "菜单": "noun", "参加": "verb", "草": "noun", "层": "measure", "差": "adj", "超市": "noun", "衬衫": "noun", "成绩": "noun", "城市": "noun", "迟到": "verb", "除了": "prep", "船": "noun", "春": "noun", "词典": "noun", "聪明": "adj", "打扫": "verb", "打算": "verb", "带": "verb", "担心": "verb", "蛋糕": "noun", "当然": "adv", "地": "particle", "灯": "noun", "地方": "noun", "地铁": "noun", "地图": "noun", "电梯": "noun", "电子邮件": "noun", "东": "noun", "冬": "noun", "动物": "noun", "短": "adj", "段": "measure", "锻炼": "verb", "多么": "adv", "饿": "adj", "不但…而且…": "conj", "耳朵": "noun", "发": "verb", "发烧": "verb", "发现": "verb", "方便": "adj", "放": "verb", "放心": "verb", "分": "measure", "附近": "noun", "复习": "verb", "干净": "adj", "感兴趣": "verb", "感冒": "noun", "刚才": "noun", "个子": "noun", "跟": "prep", "根据": "verb", "更": "adv", "公斤": "measure", "公园": "noun", "故事": "noun", "刮风": "verb", "关": "verb", "关系": "noun", "关心": "verb", "关于": "prep", "国家": "noun", "过去": "verb", "过（动词）": "verb", "还是": "adv", "害怕": "verb", "黑板": "noun", "后来": "noun", "护照": "noun", "花（动词）": "verb", "花（名词）": "verb", "画": "verb", "坏": "adj", "欢迎": "verb", "还（动词）": "adv", "环境": "noun", "换": "verb", "黄河": "noun", "回答": "verb", "会议": "noun", "或者": "conj", "几乎": "adv", "机会": "noun", "极": "adv", "记得": "verb", "季节": "noun", "检查": "verb", "简单": "adj", "健康": "adj", "见面": "verb", "讲": "verb", "教": "verb", "角": "measure", "脚": "noun", "接": "verb", "街道": "noun", "结婚": "verb", "结束": "verb", "节目": "noun", "节日": "noun", "解决": "verb", "借": "verb", "经常": "adv", "经过": "verb", "经理": "noun", "久": "adj", "旧": "adj", "句子": "noun", "决定": "verb", "渴": "adj", "可爱": "adj", "刻": "measure", "客人": "noun", "空调": "noun", "口": "noun", "哭": "verb", "裤子": "noun", "筷子": "noun", "蓝": "adj", "老": "adj", "离开": "verb", "礼物": "noun", "历史": "noun", "脸": "noun", "聊天": "verb", "练习": "verb", "辆": "measure", "了解": "verb", "邻居": "noun", "留学": "verb", "楼": "noun", "绿": "noun", "马": "noun", "马上": "adv", "满意": "verb", "帽子": "noun", "米": "measure", "面包": "noun", "明白": "adj", "拿": "verb", "奶奶": "noun", "南": "noun", "难": "adj", "难过": "adj", "年级": "noun", "年轻": "adj", "鸟": "noun", "努力": "verb", "爬山": "noun", "盘子": "noun", "胖": "adj", "啤酒": "noun", "皮鞋": "noun", "瓶子": "noun", "其实": "adv", "其他": "pron", "骑": "verb", "奇怪": "adj", "起来": "verb", "起飞": "verb", "清楚": "adj", "请假": "verb", "秋": "noun", "裙子": "noun", "然后": "conj", "热情": "adj", "认为": "verb", "认真": "adj", "容易": "adj", "如果": "conj", "伞": "noun", "上网": "verb", "生气": "verb", "声音": "noun", "试": "verb", "世界": "noun", "瘦": "adj", "舒服": "adj", "叔叔": "noun", "树": "noun", "数学": "noun", "刷牙": "noun", "双": "measure", "水平": "noun", "司机": "noun", "太阳": "noun", "特别": "adj", "疼": "adj", "提高": "verb", "体育": "noun", "甜": "adj", "条": "measure", "同事": "noun", "同意": "verb", "头发": "noun", "突然": "adj", "图书馆": "noun", "腿": "noun", "完成": "verb", "碗": "noun", "万": "num", "忘记": "verb", "为": "prep", "为了": "prep", "位": "measure", "文化": "noun", "西": "noun", "习惯": "verb", "洗手间": "noun", "洗澡": "verb", "夏": "noun", "先": "adv", "香蕉": "noun", "相信": "verb", "向": "verb", "像": "verb", "小心": "verb", "校长": "noun", "新闻": "noun", "新鲜": "adj", "信用卡": "noun", "行李箱": "noun", "熊猫": "noun", "需要": "verb", "选择": "verb", "要求": "verb", "爷爷": "noun", "一定": "adj", "一共": "adv", "一会儿": "adv", "一样": "adj", "以前": "noun", "一般": "adj", "一边": "adv", "一直": "adv", "音乐": "noun", "银行": "noun", "饮料": "noun", "应该": "verb", "影响": "verb", "用": "verb", "游戏": "noun", "有名": "adj", "又": "adv", "遇到": "verb", "元": "measure", "愿意": "verb", "月亮": "noun", "越": "adv", "站": "noun", "张": "verb", "长（动词）": "adj", "着急": "adj", "照顾": "verb", "照片": "noun", "照相机": "noun", "只（量词）": "measure", "只（副词）": "measure", "只有…才…": "noun", "中文": "noun", "中间": "noun", "终于": "adv", "种": "measure", "重要": "adj", "周末": "noun", "主要": "adj", "注意": "verb", "自己": "pron", "自行车": "noun", "总是": "adv", "嘴": "noun", "最后": "noun", "最近": "noun", "作业": "noun", "爱情": "noun", "安排": "verb", "安全": "adj", "按时": "adv", "按照": "prep", "百分之": "num", "棒": "adj", "包子": "noun", "保护": "verb", "保证": "verb", "抱": "verb", "抱歉": "adj", "报名": "verb", "倍": "measure", "本来": "adj", "笨": "adj", "比如": "verb", "毕业": "verb", "遍": "measure", "标准": "noun", "表格": "noun", "表示": "verb", "表演": "verb", "表扬": "verb", "饼干": "noun", "并且": "conj", "博士": "noun", "不过": "conj", "不得不": "adv", "不管": "conj", "不仅": "conj", "部分": "noun", "擦": "verb", "猜": "verb", "材料": "noun", "参观": "verb", "餐厅": "noun", "差不多": "adj", "尝": "verb", "长城": "noun", "长江": "noun", "场": "measure", "超过": "verb", "厕所": "noun", "成功": "verb", "成为": "verb", "诚实": "adj", "乘坐": "verb", "吃惊": "verb", "重新": "adv", "抽烟": "verb", "出差": "verb", "出发": "verb", "出生": "verb", "出现": "verb", "厨房": "noun", "传真": "noun", "窗户": "noun", "词语": "noun", "从来": "adv", "粗心": "adj", "存": "verb", "错误": "adj", "答案": "noun", "打招呼": "verb", "打扮": "verb", "打扰": "verb", "打印": "verb", "打折": "verb", "打针": "verb", "大概": "adj", "大使馆": "noun", "大约": "adv", "戴": "verb", "大夫": "noun", "当": "verb", "当时": "noun", "刀": "noun", "导游": "verb", "倒": "verb", "到处": "adv", "到底": "adv", "道歉": "verb", "得意": "adj", "地点": "noun", "得（助动词）": "particle", "登机牌": "noun", "等（动）": "verb", "低": "adj", "底": "noun", "地球": "noun", "地址": "noun", "掉": "verb", "调查": "verb", "丢": "verb", "动作": "noun", "堵车": "verb", "肚子": "noun", "短信": "noun", "对于": "prep", "对话": "verb", "对面": "noun", "而": "conj", "儿童": "noun", "发生": "verb", "发展": "verb", "法律": "noun", "翻译": "verb", "烦恼": "adj", "反对": "verb", "方法": "noun", "方面": "noun", "方向": "noun", "房东": "noun", "放弃": "verb", "放暑假": "verb", "放松": "verb", "份": "measure", "丰富": "adj", "否则": "conj", "符合": "verb", "富": "adj", "付款": "noun", "父亲": "noun", "复印": "verb", "复杂": "adj", "负责": "verb", "改变": "verb", "干杯": "verb", "赶": "verb", "敢": "verb", "感动": "adj", "感觉": "noun", "感情": "noun", "感谢": "verb", "干": "verb", "刚": "adv", "高速公路": "noun", "胳膊": "noun", "各": "pron", "公里": "measure", "工资": "noun", "功夫": "noun", "共同": "adj", "够": "verb", "购物": "verb", "估计": "verb", "鼓励": "verb", "顾客": "noun", "故意": "adv", "挂": "verb", "关键": "noun", "观众": "noun", "管理": "verb", "光": "noun", "广播": "verb", "广告": "noun", "逛": "verb", "规定": "verb", "国际": "adj", "国籍": "noun", "果汁": "noun", "过程": "noun", "海洋": "noun", "害羞": "adj", "寒假": "noun", "汗": "noun", "航班": "noun", "好处": "noun", "好像": "verb", "号码": "noun", "合格": "adj", "合适": "adj", "盒子": "noun", "厚": "adj", "后悔": "verb", "护士": "noun", "互联网": "noun", "互相": "adv", "怀疑": "verb", "回忆": "verb", "活动": "verb", "活泼": "adj", "火": "noun", "获得": "verb", "基础": "noun", "激动": "adj", "积极": "adj", "积累": "verb", "及时": "adj", "即使": "conj", "寄": "verb", "记者": "noun", "计划": "noun", "既然": "conj", "技术": "noun", "继续": "verb", "家具": "noun", "加班": "verb", "加油站": "noun", "假": "adj", "价格": "noun", "坚持": "verb", "减肥": "verb", "减少": "verb", "建议": "verb", "将来": "noun", "奖金": "noun", "降低": "verb", "降落": "verb", "交": "verb", "交流": "verb", "交通": "noun", "郊区": "noun", "骄傲": "adj", "饺子": "noun", "教授": "noun", "教育": "noun", "接受": "verb", "接着": "verb", "结果": "noun", "节": "measure", "节约": "verb", "解释": "verb", "尽管": "adv", "紧张": "adj", "进行": "verb", "禁止": "verb", "精彩": "adj", "经济": "noun", "经历": "verb", "经验": "noun", "京剧": "noun", "警察": "noun", "景色": "noun", "竟然": "adv", "竞争": "verb", "镜子": "noun", "究竟": "adv", "举": "verb", "举办": "verb", "举行": "verb", "拒绝": "verb", "距离": "verb", "聚会": "verb", "开玩笑": "noun", "开心": "adj", "看法": "noun", "考虑": "verb", "烤鸭": "noun", "棵": "measure", "科学": "noun", "咳嗽": "verb", "可怜": "adj", "可是": "conj", "可惜": "adj", "客厅": "noun", "肯定": "verb", "空": "adj", "空气": "noun", "恐怕": "verb", "苦": "adj", "矿泉水": "noun", "困": "adj", "困难": "adj", "拉": "verb", "垃圾桶": "noun", "辣": "adj", "来自": "verb", "来不及": "verb", "来得及": "verb", "懒": "adj", "浪费": "verb", "浪漫": "adj", "老虎": "noun", "冷静": "adj", "理发": "verb", "理解": "verb", "理想": "noun", "礼貌": "noun", "礼拜天": "noun", "厉害": "adj", "力气": "noun", "例如": "verb", "俩": "noun", "连": "prep", "联系": "verb", "凉快": "adj", "零钱": "noun", "另外": "pron", "留": "verb", "流利": "adj", "流行": "verb", "乱": "adj", "旅行": "verb", "律师": "noun", "麻烦": "adj", "马虎": "adj", "满": "adj", "毛": "measure", "毛巾": "noun", "美丽": "adj", "梦": "noun", "迷路": "verb", "密码": "noun", "免费": "verb", "秒": "measure", "民族": "noun", "母亲": "noun", "目的": "noun", "耐心": "adj", "难道": "adv", "难受": "adj", "内": "noun", "内容": "noun", "能力": "noun", "年龄": "noun", "弄": "verb", "暖和": "adj", "偶尔": "adv", "排队": "verb", "排列": "verb", "判断": "verb", "陪": "verb", "批评": "verb", "皮肤": "noun", "脾气": "noun", "篇": "noun", "骗": "verb", "乒乓球": "noun", "平时": "noun", "破": "verb", "葡萄": "noun", "普遍": "adj", "普通话": "noun", "其次": "pron", "其中": "noun", "气候": "noun", "千万": "adv", "签证": "verb", "敲": "verb", "桥": "noun", "巧克力": "noun", "亲戚": "noun", "轻": "adj", "轻松": "adj", "情况": "noun", "穷": "adj", "区别": "verb", "取": "verb", "全部": "noun", "缺点": "noun", "缺少": "verb", "却": "adv", "确实": "adv", "然而": "conj", "热闹": "adj", "任何": "pron", "任务": "noun", "扔": "verb", "仍然": "adv", "日记": "noun", "入口": "noun", "散步": "verb", "森林": "noun", "沙发": "noun", "商量": "verb", "伤心": "adj", "稍微": "adv", "勺子": "noun", "社会": "noun", "深": "adj", "申请": "verb", "甚至": "conj", "生活": "noun", "生命": "noun", "生意": "noun", "省": "noun", "剩": "verb", "失败": "verb", "失望": "verb", "师傅": "noun", "十分": "adv", "实际": "noun", "实在": "adj", "使": "verb", "使用": "verb", "是否": "adv", "适合": "verb", "适应": "verb", "世纪": "noun", "收": "verb", "收入": "verb", "收拾": "verb", "首都": "noun", "首先": "adv", "受不了": "verb", "受到": "verb", "售货员": "noun", "输": "verb", "熟悉": "verb", "数量": "noun", "数字": "noun", "帅": "adj", "顺便": "adv", "顺利": "adj", "顺序": "noun", "说明": "verb", "硕士": "noun", "死": "verb", "速度": "noun", "塑料袋": "noun", "酸": "adj", "随便": "verb", "随着": "prep", "孙子": "noun", "所有": "adj", "台": "measure", "抬": "verb", "态度": "noun", "谈": "verb", "弹钢琴": "noun", "汤": "noun", "糖": "noun", "躺": "verb", "趟": "measure", "讨论": "verb", "讨厌": "adj", "特点": "noun", "提": "verb", "提供": "verb", "提前": "verb", "提醒": "verb", "填空": "noun", "条件": "noun", "停": "verb", "挺": "adv", "通过": "verb", "通知": "verb", "同时": "noun", "同情": "verb", "推": "verb", "推迟": "verb", "脱": "verb", "袜子": "noun", "完全": "adj", "往往": "adv", "网球": "noun", "网站": "noun", "危险": "adj", "味道": "noun", "卫生间": "noun", "温度": "noun", "文章": "noun", "污染": "verb", "无": "verb", "无聊": "adj", "无论": "conj", "误会": "verb", "西红柿": "noun", "吸引": "verb", "咸": "adj", "现金": "noun", "羡慕": "verb", "香": "adj", "相反": "adj", "相同": "adj", "详细": "adj", "响": "verb", "橡皮": "noun", "消息": "noun", "小吃": "noun", "小伙子": "noun", "小说": "noun", "笑话": "noun", "效果": "noun", "辛苦": "adj", "心情": "noun", "信封": "noun", "信息": "noun", "信心": "noun", "兴奋": "adj", "行": "verb", "醒": "verb", "性别": "noun", "性格": "noun", "幸福": "noun", "修理": "verb", "许多": "num", "学期": "noun", "压力": "noun", "牙膏": "noun", "亚洲": "noun", "呀": "interj", "盐": "noun", "严格": "adj", "严重": "adj", "研究": "verb", "演出": "verb", "演员": "noun", "眼镜": "noun", "阳光": "noun", "养成": "verb", "样子": "noun", "邀请": "verb", "要是": "conj", "钥匙": "noun", "也许": "adv", "页": "measure", "叶子": "noun", "一切": "pron", "以": "prep", "以为": "verb", "意见": "noun", "艺术": "noun", "因此": "conj", "引起": "verb", "印象": "noun", "应聘": "verb", "赢": "verb", "勇敢": "adj", "永远": "adv", "优点": "noun", "优秀": "adj", "幽默": "adj", "由": "prep", "由于": "prep", "邮局": "noun", "尤其": "adv", "有趣": "adj", "友好": "adj", "友谊": "noun", "愉快": "adj", "于是": "conj", "与": "prep", "语法": "noun", "语言": "noun", "羽毛球": "noun", "预习": "verb", "原来": "noun", "原谅": "verb", "原因": "noun", "约会": "verb", "阅读": "verb", "云": "noun", "允许": "verb", "杂志": "noun", "咱们": "pron", "暂时": "adj", "脏": "adj", "责任": "noun", "增加": "verb", "占线": "verb", "招聘": "verb", "照": "verb", "真正": "adj", "整理": "verb", "正常": "adj", "正好": "adj", "正确": "adj", "正式": "adj", "证明": "verb", "之": "particle", "支持": "verb", "知识": "noun", "值得": "verb", "直接": "adj", "植物": "noun", "职业": "noun", "指": "verb", "只好": "adv", "只要": "conj", "质量": "noun", "至少": "adv", "重": "adv", "重点": "noun", "重视": "verb", "周围": "noun", "主意": "noun", "祝贺": "verb", "著名": "adj", "专门": "adv", "专业": "noun", "转": "verb", "赚": "verb", "准确": "adj", "准时": "adj", "仔细": "adj", "自然": "noun", "自信": "verb", "总结": "verb", "租": "verb", "最好": "adv", "尊重": "verb", "左右": "noun", "座": "noun", "作家": "noun", "座位": "noun", "作用": "noun", "作者": "noun", "唉": "interj", "爱心": "noun", "安慰": "verb", "岸": "noun", "熬夜": "verb", "包含": "verb", "宝贵": "adj", "保存": "verb", "保留": "verb", "报到": "verb", "报告": "verb", "悲观": "adj", "背景": "noun", "被子": "noun", "本科": "noun", "本领": "noun", "比例": "noun", "必然": "adj", "必要": "adj", "鞭炮": "noun", "辩论": "verb", "标志": "noun", "表达": "verb", "表面": "noun", "表情": "noun", "表现": "verb", "冰激凌": "noun", "玻璃": "noun", "博物馆": "noun", "不断": "verb", "不见得": "adv", "不耐烦": "noun", "补充": "verb", "不然": "conj", "不足": "verb", "部门": "noun", "财产": "noun", "踩": "verb", "采取": "verb", "参考": "verb", "操场": "noun", "插": "verb", "叉子": "noun", "拆": "verb", "产生": "verb", "常识": "noun", "潮湿": "adj", "吵": "adj", "车库": "noun", "彻底": "adj", "趁": "prep", "称": "verb", "称赞": "verb", "承担": "verb", "承受": "verb", "程序": "noun", "成立": "verb", "成人": "verb", "成语": "noun", "诚恳": "adj", "持续": "verb", "尺子": "noun", "冲": "verb", "充分": "adj", "重复": "verb", "宠物": "noun", "抽象": "adj", "丑": "adj", "出口": "noun", "出示": "verb", "出席": "verb", "除非": "conj", "除夕": "noun", "处理": "verb", "传染": "verb", "传统": "noun", "闯": "verb", "吹": "verb", "此外": "conj", "次要": "adj", "匆忙": "adj", "从而": "conj", "从前": "noun", "粗糙": "adj", "醋": "noun", "促使": "verb", "措施": "noun", "打工": "verb", "大厦": "noun", "大象": "noun", "代表": "noun", "待遇": "noun", "单调": "adj", "单位": "noun", "担任": "verb", "耽误": "verb", "淡": "adj", "倒霉": "adj", "道理": "noun", "登记": "verb", "等于": "verb", "滴": "verb", "敌人": "noun", "递": "verb", "地毯": "noun", "地震": "verb", "电池": "noun", "顶": "noun", "冻": "verb", "动画片": "noun", "逗": "verb", "独特": "adj", "度过": "noun", "对比": "verb", "对待": "verb", "对手": "noun", "吨": "measure", "顿": "measure", "多亏": "verb", "朵": "measure", "发表": "verb", "发达": "adj", "发挥": "verb", "发票": "noun", "发言": "verb", "罚款": "verb", "法院": "noun", "繁荣": "adj", "反而": "adv", "反应": "verb", "反正": "adv", "范围": "noun", "方案": "noun", "方式": "noun", "妨碍": "verb", "肥皂": "noun", "分布": "verb", "分手": "verb", "风景": "noun", "风险": "noun", "讽刺": "verb", "否认": "verb", "扶": "verb", "复制": "verb", "改进": "verb", "改正": "verb", "概括": "verb", "感想": "noun", "赶快": "adv", "干活儿": "verb", "高级": "adj", "告别": "verb", "隔壁": "noun", "个人": "noun", "各自": "pron", "根本": "noun", "公开": "adj", "公平": "adj", "公寓": "noun", "工厂": "noun", "工具": "noun", "工业": "noun", "功能": "noun", "沟通": "verb", "姑娘": "noun", "古代": "noun", "鼓掌": "verb", "骨头": "noun", "乖": "adj", "怪不得": "verb", "观察": "verb", "观念": "noun", "冠军": "noun", "光滑": "adj", "光明": "noun", "广大": "adj", "规律": "noun", "规则": "noun", "滚": "verb", "国庆节": "noun", "果实": "noun", "过敏": "verb", "海鲜": "noun", "豪华": "adj", "好奇": "adj", "何必": "adv", "合法": "adj", "合理": "adj", "合同": "noun", "合作": "verb", "恨": "verb", "猴子": "noun", "后背": "noun", "忽视": "verb", "壶": "noun", "胡说": "verb", "糊涂": "adj", "花生": "noun", "划": "verb", "话题": "noun", "怀念": "verb", "怀孕": "verb", "慌张": "adj", "黄金": "noun", "灰": "noun", "灰心": "adj", "婚礼": "noun", "活跃": "adj", "伙伴": "noun", "或许": "adv", "基本": "adj", "机器": "noun", "及格": "verb", "集合": "verb", "集中": "verb", "急诊": "verb", "记忆": "verb", "纪录": "noun", "纪念": "verb", "家务": "noun", "嘉宾": "noun", "甲": "noun", "假如": "conj", "假装": "verb", "驾驶": "verb", "坚强": "adj", "艰苦": "adj", "捡": "verb", "简直": "adv", "健身": "verb", "建设": "verb", "建筑": "verb", "键盘": "noun", "讲座": "noun", "酱油": "noun", "浇": "verb", "交换": "verb", "交往": "verb", "角度": "noun", "教材": "noun", "教训": "verb", "接待": "verb", "结实": "adj", "节省": "verb", "结构": "noun", "结合": "verb", "结论": "noun", "结账": "verb", "届": "measure", "借口": "noun", "戒": "verb", "紧急": "adj", "尽快": "adv", "谨慎": "adj", "进步": "verb", "近代": "noun", "尽量": "adv", "精神": "noun", "经典": "noun", "救": "verb", "舅舅": "noun", "桔子": "noun", "具备": "verb", "巨大": "adj", "决赛": "verb", "绝对": "adj", "军事": "noun", "开放": "verb", "开水": "noun", "砍": "verb", "看不起": "verb", "可见": "conj", "可怕": "adj", "克": "measure", "客观": "adj", "控制": "verb", "口味": "noun", "夸": "verb", "扩大": "verb", "辣椒": "noun", "烂": "adj", "劳动": "noun", "老板": "noun", "老鼠": "noun", "姥姥": "noun", "理论": "noun", "理由": "noun", "立刻": "adv", "力量": "noun", "利息": "noun", "利用": "verb", "连忙": "adv", "联合": "verb", "了不起": "adj", "列车": "noun", "临时": "adv", "灵活": "adj", "领域": "noun", "流传": "verb", "浏览": "verb", "龙": "noun", "漏": "verb", "陆地": "noun", "录取": "verb", "论文": "noun", "落后": "verb", "骂": "verb", "麦克风": "noun", "满足": "verb", "冒险": "verb", "眉毛": "noun", "美术": "noun", "秘密": "adj", "面对": "verb", "面临": "verb", "苗条": "adj", "明确": "adj", "明显": "adj", "名牌": "noun", "名胜古迹": "noun", "命令": "verb", "摸": "verb", "模糊": "adj", "摩托车": "noun", "某": "pron", "目标": "noun", "目录": "noun", "木头": "noun", "哪怕": "conj", "难免": "adj", "脑袋": "noun", "内科": "noun", "嫩": "adj", "能干": "adj", "能源": "noun", "年代": "noun", "年纪": "noun", "宁可": "adv", "牛仔裤": "noun", "农村": "noun", "农业": "noun", "女士": "noun", "派": "verb", "赔偿": "verb", "培养": "verb", "配合": "verb", "披": "verb", "片面": "adj", "拼音": "verb", "平": "adj", "平常": "adj", "平方": "noun", "平静": "adj", "评价": "verb", "破坏": "verb", "期待": "verb", "奇迹": "noun", "启发": "verb", "气氛": "noun", "汽油": "noun", "谦虚": "adj", "签": "verb", "浅": "adj", "枪": "noun", "强调": "verb", "抢": "verb", "悄悄": "adv", "瞧": "verb", "巧妙": "adj", "亲爱": "adj", "亲切": "adj", "勤奋": "adj", "青春": "noun", "轻视": "verb", "请求": "verb", "球迷": "noun", "趋势": "noun", "去世": "verb", "权力": "noun", "劝": "verb", "缺乏": "verb", "确认": "verb", "群": "measure", "燃烧": "verb", "绕": "verb", "热爱": "verb", "热心": "adj", "人才": "noun", "人类": "noun", "人生": "noun", "人物": "noun", "忍不住": "noun", "日程": "noun", "日历": "noun", "日用品": "noun", "如何": "pron", "软件": "noun", "洒": "verb", "嗓子": "noun", "沙滩": "noun", "晒": "verb", "闪电": "noun", "善于": "verb", "商品": "noun", "商务": "noun", "伤害": "verb", "舍不得": "verb", "设计": "verb", "摄影": "verb", "伸": "verb", "深刻": "adj", "身份": "noun", "神秘": "adj", "生动": "adj", "生长": "verb", "诗": "noun", "失眠": "verb", "狮子": "noun", "时代": "noun", "时髦": "adj", "时尚": "noun", "实习": "verb", "实验": "verb", "石头": "noun", "使劲儿": "noun", "始终": "noun", "试卷": "noun", "市场": "noun", "事物": "noun", "收据": "noun", "手工": "noun", "手术": "noun", "手续": "noun", "首": "measure", "受伤": "verb", "寿命": "noun", "书架": "noun", "输入": "verb", "熟练": "adj", "鼠标": "noun", "数据": "noun", "数码": "adj", "摔倒": "noun", "双方": "noun", "税": "noun", "说服": "verb", "丝绸": "noun", "思想": "noun", "似乎": "adv", "随身": "adj", "碎": "verb", "损失": "verb", "锁": "noun", "台阶": "noun", "太极拳": "noun", "逃": "verb", "淘气": "adj", "讨价还价": "noun", "套": "noun", "特色": "noun", "提倡": "verb", "题目": "noun", "体贴": "verb", "体验": "verb", "天空": "noun", "天真": "adj", "调整": "verb", "通常": "adj", "统一": "verb", "痛快": "adj", "偷": "verb", "投资": "verb", "突出": "verb", "土豆": "noun", "兔子": "noun", "推辞": "verb", "推荐": "verb", "退": "verb", "退休": "verb", "外公": "noun", "完整": "adj", "玩具": "noun", "万一": "noun", "威胁": "verb", "维修": "verb", "围绕": "verb", "尾巴": "noun", "委屈": "adj", "胃": "noun", "位于": "verb", "未必": "adv", "温柔": "adj", "文具": "noun", "文学": "noun", "稳定": "adj", "问候": "verb", "卧室": "noun", "无数": "adj", "勿": "adv", "物质": "noun", "吸取": "verb", "系统": "noun", "戏剧": "noun", "吓": "verb", "夏令营": "noun", "下载": "verb", "显然": "adj", "县": "noun", "现象": "noun", "香肠": "noun", "相当": "verb", "相似": "adj", "想念": "verb", "享受": "verb", "项链": "noun", "象征": "verb", "消极": "adj", "消失": "verb", "小气": "adj", "孝顺": "verb", "斜": "adj", "写作": "verb", "心理": "noun", "心脏": "noun", "信任": "verb", "行为": "noun", "形容": "verb", "形势": "noun", "形状": "noun", "幸运": "noun", "兄弟": "noun", "虚心": "adj", "宣布": "verb", "学术": "noun", "询问": "verb", "训练": "verb", "押金": "noun", "牙齿": "noun", "宴会": "noun", "痒": "adj", "样式": "noun", "腰": "noun", "咬": "verb", "夜": "noun", "业余": "adj", "依然": "adv", "一旦": "adv", "一致": "adj", "一再": "adv", "移民": "verb", "疑问": "noun", "以来": "noun", "意外": "adj", "议论": "verb", "义务": "noun", "因素": "noun", "英俊": "adj", "营养": "noun", "硬": "adj", "应付": "verb", "应用": "verb", "拥挤": "verb", "勇气": "noun", "用功": "verb", "优惠": "adj", "优势": "noun", "悠久": "adj", "油炸": "noun", "有利": "adj", "娱乐": "verb", "预报": "verb", "预防": "verb", "圆": "noun", "元旦": "noun", "员工": "noun", "愿望": "noun", "晕": "adj", "运气": "noun", "运用": "verb", "灾害": "noun", "在乎": "verb", "再三": "adv", "赞成": "verb", "糟糕": "adj", "造成": "verb", "责备": "verb", "窄": "adj", "展开": "verb", "掌握": "verb", "账户": "noun", "珍惜": "verb", "阵": "measure", "睁": "verb", "争取": "verb", "整个": "adj", "整齐": "adj", "正": "adv", "政府": "noun", "证件": "noun", "支": "measure", "支票": "noun", "指导": "verb", "制定": "verb", "制造": "verb", "智慧": "noun", "秩序": "noun", "中介": "noun", "中旬": "noun", "周到": "adj", "逐步": "adv", "竹子": "noun", "主持": "verb", "主观": "adj", "主题": "noun", "主任": "noun", "抓": "verb", "专家": "noun", "专心": "adj", "转告": "verb", "装": "verb", "装修": "verb", "状况": "noun", "追": "verb", "资格": "noun", "资料": "noun", "姿势": "noun", "紫": "adj", "字幕": "noun", "自动": "adv", "自由": "adj", "综合": "verb", "总共": "adv", "总理": "noun", "总算": "adv", "总之": "conj", "组成": "verb", "组织": "verb", "作文": "verb", "哎": "interj", "爱护": "verb", "爱惜": "verb", "安装": "verb", "暗": "adj", "把握": "verb", "摆": "verb", "办理": "verb", "傍晚": "noun", "包裹": "verb", "包括": "verb", "薄": "adj", "宝贝": "noun", "保持": "verb", "保险": "noun", "抱怨": "verb", "报道": "verb", "报社": "noun", "背": "verb", "本质": "noun", "彼此": "pron", "毕竟": "adv", "避免": "verb", "编辑": "verb", "便": "adv", "标点": "noun", "表明": "verb", "病毒": "noun", "播放": "verb", "脖子": "noun", "不要紧": "adj", "布": "noun", "不安": "adj", "不得了": "adj", "不如": "verb", "步骤": "noun", "采访": "verb", "彩虹": "noun", "参与": "verb", "惭愧": "adj", "操心": "verb", "册": "measure", "测验": "verb", "曾经": "adv", "差距": "noun", "产品": "noun", "长途": "adj", "抄": "verb", "超级": "adj", "朝": "verb", "炒": "verb", "吵架": "verb", "车厢": "noun", "沉默": "verb", "称呼": "verb", "承认": "verb", "程度": "noun", "成分": "noun", "成果": "noun", "成就": "noun", "成熟": "verb", "成长": "verb", "吃亏": "verb", "迟早": "adv", "池塘": "noun", "翅膀": "noun", "充电器": "noun", "充满": "verb", "抽屉": "noun", "臭": "adj", "出版": "verb", "出色": "adj", "初级": "adj", "传播": "verb", "传说": "verb", "窗帘": "noun", "创造": "verb", "词汇": "noun", "辞职": "verb", "刺激": "verb", "从此": "adv", "从事": "verb", "促进": "verb", "催": "verb", "存在": "verb", "答应": "verb", "达到": "verb", "打交道": "noun", "打喷嚏": "noun", "打听": "verb", "大方": "adj", "大型": "adj", "呆": "adj", "代替": "verb", "贷款": "verb", "单纯": "adj", "单独": "adv", "单元": "noun", "胆小鬼": "noun", "当地": "noun", "当心": "verb", "挡": "verb", "岛屿": "noun", "导演": "verb", "导致": "verb", "到达": "verb", "道德": "noun", "等待": "verb", "的确": "adv", "地道": "adj", "地理": "noun", "地区": "noun", "地位": "noun", "点心": "noun", "电台": "noun", "钓": "noun", "洞": "noun", "豆腐": "noun", "独立": "verb", "断": "verb", "堆": "verb", "对方": "noun", "对象": "noun", "兑换": "verb", "蹲": "verb", "多余": "verb", "躲藏": "noun", "恶劣": "adj", "耳环": "noun", "发愁": "verb", "发抖": "verb", "发明": "verb", "翻": "verb", "反复": "adv", "反映": "verb", "方": "adj", "仿佛": "adv", "非": "verb", "废话": "noun", "分别": "verb", "分配": "verb", "分析": "verb", "纷纷": "adj", "奋斗": "verb", "风格": "noun", "风俗": "noun", "疯狂": "adj", "否定": "verb", "幅": "measure", "服装": "noun", "辅导": "verb", "妇女": "noun", "改革": "verb", "改善": "verb", "盖": "noun", "概念": "noun", "干脆": "adj", "干燥": "adj", "感激": "verb", "感受": "verb", "赶紧": "adv", "钢铁": "noun", "高档": "adj", "搞": "verb", "格外": "adv", "个别": "adv", "个性": "noun", "根": "noun", "公布": "verb", "公元": "noun", "公主": "noun", "工程师": "noun", "工人": "noun", "恭喜": "verb", "贡献": "verb", "构成": "verb", "姑姑": "noun", "古典": "adj", "鼓舞": "verb", "股票": "noun", "固定": "verb", "挂号": "verb", "拐弯": "verb", "官": "noun", "关闭": "verb", "观点": "noun", "管子": "noun", "光临": "verb", "光盘": "noun", "广场": "noun", "广泛": "adj", "规矩": "noun", "规模": "noun", "归纳": "verb", "柜台": "noun", "锅": "noun", "国王": "noun", "果然": "adv", "过分": "adj", "过期": "verb", "哈": "interj", "海关": "noun", "喊": "verb", "行业": "noun", "好客": "adj", "和平": "noun", "何况": "conj", "合影": "verb", "核心": "noun", "后果": "noun", "忽然": "adv", "呼吸": "verb", "蝴蝶": "noun", "胡同": "noun", "华裔": "noun", "滑": "adj", "化学": "noun", "缓解": "verb", "幻想": "verb", "挥": "verb", "灰尘": "noun", "恢复": "verb", "汇率": "noun", "婚姻": "noun", "火柴": "noun", "激烈": "adj", "肌肉": "noun", "极其": "adv", "集体": "noun", "急忙": "adv", "记录": "verb", "计算": "verb", "系领带": "noun", "纪律": "noun", "寂寞": "adj", "家庭": "noun", "家乡": "noun", "夹子": "noun", "假设": "verb", "嫁": "verb", "价值": "noun", "肩膀": "noun", "坚决": "adj", "艰巨": "adj", "兼职": "verb", "简历": "noun", "剪刀": "noun", "建立": "verb", "讲究": "verb", "交际": "verb", "胶水": "noun", "狡猾": "adj", "教练": "noun", "接触": "verb", "接近": "verb", "阶段": "noun", "戒指": "noun", "金属": "noun", "进口": "verb", "尽力": "verb", "精力": "noun", "经商": "verb", "经营": "verb", "酒吧": "noun", "救护车": "noun", "居然": "adv", "具体": "adj", "俱乐部": "noun", "据说": "verb", "捐": "verb", "决心": "noun", "角色": "noun", "均匀": "adj", "卡车": "noun", "开发": "verb", "开幕式": "noun", "看望": "verb", "靠": "verb", "颗": "measure", "可靠": "adj", "课程": "noun", "克服": "verb", "刻苦": "adj", "空间": "noun", "空闲": "adj", "夸张": "adj", "会计": "noun", "宽": "adj", "昆虫": "noun", "拦": "verb", "朗读": "verb", "劳驾": "verb", "老百姓": "noun", "老实": "adj", "老婆": "noun", "乐观": "adj", "雷": "noun", "类型": "noun", "冷淡": "adj", "梨": "noun", "离婚": "verb", "厘米": "measure", "立即": "adv", "利润": "noun", "利益": "noun", "连续": "verb", "恋爱": "verb", "良好": "adj", "粮食": "noun", "亮": "adj", "铃": "noun", "零件": "noun", "零食": "noun", "领导": "verb", "流泪": "noun", "陆续": "adv", "录音": "verb", "轮流": "verb", "逻辑": "noun", "馒头": "noun", "毛病": "noun", "矛盾": "noun", "贸易": "noun", "媒体": "noun", "煤炭": "noun", "魅力": "noun", "梦想": "verb", "蜜蜂": "noun", "密切": "adj", "秘书": "noun", "面积": "noun", "描写": "verb", "敏感": "adj", "明星": "noun", "名片": "noun", "命运": "noun", "模仿": "verb", "模特": "noun", "陌生": "adj", "目前": "noun", "难怪": "verb", "内部": "noun", "嗯": "interj", "念": "verb", "浓": "adj", "农民": "noun", "欧洲": "noun", "偶然": "adj", "拍": "verb", "盼望": "verb", "培训": "verb", "佩服": "verb", "盆": "noun", "碰": "verb", "批": "measure", "批准": "verb", "疲劳": "adj", "匹": "measure", "片": "noun", "飘": "verb", "频道": "noun", "凭": "verb", "平安": "adj", "平等": "adj", "平衡": "adj", "平均": "verb", "破产": "verb", "迫切": "adj", "期间": "noun", "其余": "pron", "企业": "noun", "前途": "noun", "欠": "verb", "墙": "noun", "强烈": "adj", "切": "verb", "亲自": "adv", "青": "adj", "青少年": "noun", "轻易": "adj", "清淡": "adj", "情景": "noun", "情绪": "noun", "庆祝": "verb", "娶": "verb", "取消": "verb", "圈": "noun", "全面": "adj", "权利": "noun", "确定": "adj", "热烈": "adj", "人口": "noun", "人民币": "noun", "人事": "noun", "人员": "noun", "日常": "adj", "日期": "noun", "日子": "noun", "如今": "noun", "软": "adj", "弱": "adj", "色彩": "noun", "杀": "verb", "沙漠": "noun", "傻": "adj", "删除": "verb", "善良": "adj", "扇子": "noun", "商业": "noun", "上当": "verb", "蛇": "noun", "设备": "noun", "设施": "noun", "射击": "verb", "身材": "noun", "神话": "noun", "升": "verb", "生产": "verb", "声调": "noun", "绳子": "noun", "省略": "verb", "胜利": "verb", "失去": "verb", "失业": "verb", "湿润": "adj", "时差": "noun", "时刻": "noun", "时期": "noun", "实话": "noun", "实践": "verb", "实现": "verb", "实用": "adj", "食物": "noun", "士兵": "noun", "似的": "particle", "事实": "noun", "事先": "noun", "收获": "verb", "手套": "noun", "手指": "noun", "蔬菜": "noun", "舒适": "adj", "梳子": "noun", "属于": "verb", "数": "noun", "甩": "verb", "说不定": "verb", "撕": "verb", "丝毫": "adj", "思考": "verb", "私人": "noun", "搜索": "verb", "宿舍": "noun", "随时": "adv", "随手": "adv", "缩短": "verb", "所": "measure", "太太": "noun", "谈判": "verb", "坦率": "adj", "烫": "verb", "桃": "noun", "逃避": "verb", "特殊": "adj", "特征": "noun", "疼爱": "verb", "提纲": "noun", "提问": "verb", "体会": "verb", "体现": "verb", "调皮": "adj", "挑战": "verb", "痛苦": "adj", "投入": "verb", "透明": "adj", "土地": "noun", "吐": "verb", "团": "verb", "推广": "verb", "退步": "verb", "歪": "adj", "外交": "noun", "完美": "adj", "完善": "adj", "王子": "noun", "往返": "verb", "网络": "noun", "危害": "verb", "微笑": "verb", "违反": "verb", "围巾": "noun", "唯一": "adj", "伟大": "adj", "胃口": "noun", "位置": "noun", "未来": "adj", "温暖": "adj", "闻": "verb", "文件": "noun", "文明": "noun", "文字": "noun", "吻": "verb", "握手": "verb", "屋子": "noun", "无奈": "verb", "无所谓": "verb", "武术": "noun", "雾": "noun", "物理": "noun", "吸收": "verb", "系": "verb", "细节": "noun", "瞎": "verb", "鲜艳": "adj", "显得": "verb", "显示": "verb", "现代": "noun", "现实": "noun", "限制": "verb", "相处": "verb", "相对": "verb", "相关": "verb", "想象": "verb", "项": "measure", "项目": "noun", "象棋": "noun", "消费": "verb", "消化": "verb", "销售": "verb", "小麦": "noun", "效率": "noun", "歇": "verb", "欣赏": "verb", "信号": "noun", "行动": "verb", "行人": "noun", "形成": "verb", "形式": "noun", "形象": "noun", "性质": "noun", "幸亏": "adv", "胸": "noun", "修改": "verb", "休闲": "verb", "叙述": "verb", "宣传": "verb", "学历": "noun", "学问": "noun", "血": "noun", "寻找": "verb", "迅速": "adj", "延长": "verb", "严肃": "adj", "演讲": "verb", "阳台": "noun", "摇": "verb", "要不": "conj", "业务": "noun", "一辈子": "noun", "一律": "adv", "移动": "verb", "遗憾": "noun", "乙": "noun", "以及": "conj", "亿": "num", "意义": "noun", "因而": "conj", "银": "noun", "印刷": "verb", "英雄": "noun", "迎接": "verb", "营业": "verb", "影子": "noun", "硬件": "noun", "拥抱": "verb", "用途": "noun", "优美": "adj", "游览": "verb", "犹豫": "adj", "幼儿园": "noun", "与其": "conj", "语气": "noun", "预订": "verb", "玉米": "noun", "原料": "noun", "原则": "noun", "乐器": "noun", "运输": "verb", "在于": "verb", "赞美": "verb", "则": "conj", "摘": "verb", "粘贴": "verb", "展览": "verb", "占": "verb", "战争": "noun", "长辈": "noun", "涨": "verb", "招待": "verb", "着火": "verb", "着凉": "verb", "召开": "verb", "照常": "adv", "哲学": "noun", "真实": "adj", "针对": "verb", "诊断": "verb", "振动": "verb", "争论": "verb", "征求": "verb", "整体": "noun", "政治": "noun", "证据": "noun", "挣": "verb", "直": "adj", "执照": "noun", "指挥": "verb", "制度": "noun", "制作": "verb", "至今": "adv", "至于": "verb", "治疗": "verb", "志愿者": "noun", "中心": "noun", "种类": "noun", "重大": "adj", "重量": "noun", "猪": "noun", "逐渐": "adv", "煮": "verb", "主动": "adj", "主人": "noun", "主席": "noun", "主张": "verb", "祝福": "verb", "注册": "verb", "抓紧": "verb", "转变": "verb", "装饰": "verb", "撞": "verb", "状态": "noun", "追求": "verb", "资金": "noun", "资源": "noun", "咨询": "verb", "字母": "noun", "自从": "prep", "自豪": "adj", "自觉": "verb", "自私": "adj", "自愿": "verb", "总裁": "noun", "总统": "noun", "组": "noun", "组合": "verb", "阻止": "verb", "醉": "verb", "最初": "noun", "尊敬": "verb", "遵守": "verb", "作品": "noun", "作为": "verb", "挨": "verb", "癌症": "noun", "爱不释手": "noun", "爱戴": "verb", "暧昧": "adj", "安居乐业": "noun", "安宁": "adj", "安详": "adj", "安置": "verb", "暗示": "verb", "案件": "noun", "案例": "noun", "按摩": "verb", "昂贵": "adj", "凹凸": "noun", "熬": "verb", "奥秘": "noun", "巴不得": "verb", "巴结": "verb", "拔苗助长": "noun", "把关": "verb", "把戏": "noun", "霸道": "adj", "罢工": "verb", "掰": "verb", "百分点": "noun", "摆脱": "verb", "拜访": "verb", "败坏": "verb", "拜年": "verb", "拜托": "verb", "颁布": "verb", "颁发": "verb", "斑纹": "noun", "班主任": "noun", "版本": "noun", "半途而废": "noun", "扮演": "verb", "绑架": "verb", "榜样": "noun", "磅": "measure", "包庇": "verb", "包袱": "noun", "包围": "verb", "保管": "verb", "饱和": "verb", "饱经沧桑": "noun", "保密": "verb", "保姆": "noun", "保守": "verb", "保卫": "verb", "保养": "verb", "保障": "verb", "保重": "verb", "报仇": "verb", "报酬": "noun", "报答": "verb", "爆发": "verb", "报复": "verb", "抱负": "noun", "曝光": "verb", "暴力": "noun", "暴露": "verb", "报销": "verb", "爆炸": "verb", "悲哀": "adj", "卑鄙": "adj", "悲惨": "adj", "北极": "noun", "被动": "adj", "备份": "noun", "被告": "noun", "背叛": "verb", "背诵": "verb", "奔波": "verb", "奔驰": "verb", "本能": "noun", "本钱": "noun", "本人": "pron", "本身": "pron", "本事": "noun", "本着": "prep", "笨拙": "adj", "崩溃": "verb", "甭": "noun", "蹦": "verb", "迸发": "verb", "逼迫": "verb", "鼻涕": "noun", "比方": "verb", "比喻": "verb", "比重": "noun", "臂": "noun", "弊病": "noun", "必定": "adv", "弊端": "noun", "闭塞": "noun", "必需": "verb", "鞭策": "verb", "边疆": "noun", "边界": "noun", "边境": "noun", "边缘": "noun", "编织": "verb", "扁": "adj", "贬低": "verb", "贬义": "noun", "遍布": "verb", "变故": "noun", "辩护": "verb", "辩解": "verb", "便利": "adj", "变迁": "verb", "辨认": "verb", "便条": "noun", "便于": "verb", "辩证": "verb", "变质": "verb", "辫子": "noun", "标本": "noun", "标记": "verb", "飙升": "verb", "标题": "noun", "表决": "verb", "表态": "verb", "表彰": "verb", "憋": "verb", "别墅": "noun", "别致": "adj", "别扭": "adj", "濒临": "verb", "冰雹": "noun", "并存": "noun", "并非": "verb", "并列": "verb", "拨打": "verb", "波浪": "noun", "波涛汹涌": "noun", "剥削": "verb", "播种": "verb", "博大精深": "noun", "搏斗": "verb", "博览会": "noun", "薄弱": "adj", "补偿": "verb", "补救": "verb", "哺乳": "verb", "补贴": "verb", "捕捉": "verb", "不必": "adv", "不得已": "adj", "步伐": "noun", "不妨": "adv", "不敢当": "verb", "布告": "noun", "不顾": "verb", "不好意思": "noun", "不禁": "adv", "布局": "verb", "不堪": "verb", "不可思议": "noun", "不愧": "adv", "不料": "conj", "部位": "noun", "不惜": "verb", "不相上下": "noun", "不像话": "adj", "不屑一顾": "noun", "不言而喻": "noun", "不由得": "verb", "不择手段": "noun", "不止": "verb", "布置": "verb", "裁缝": "noun", "财富": "noun", "才干": "noun", "裁判": "verb", "财务": "noun", "裁员": "verb", "财政": "noun", "采购": "verb", "采集": "verb", "采纳": "verb", "彩票": "noun", "参谋": "noun", "参照": "verb", "残疾": "noun", "残酷": "adj", "残留": "verb", "残忍": "adj", "灿烂": "adj", "舱": "noun", "仓促": "adj", "仓库": "noun", "操劳": "verb", "操练": "verb", "操纵": "verb", "操作": "verb", "嘈杂": "adj", "草案": "noun", "草率": "adj", "策划": "verb", "测量": "verb", "策略": "noun", "侧面": "noun", "层次": "noun", "层出不穷": "noun", "差别": "noun", "查获": "verb", "岔": "noun", "刹那": "noun", "诧异": "adj", "柴油": "noun", "搀": "verb", "缠绕": "verb", "阐述": "verb", "产业": "noun", "颤抖": "verb", "猖狂": "adj", "昌盛": "adj", "偿还": "verb", "常年": "adv", "尝试": "verb", "常务": "noun", "场合": "noun", "敞开": "verb", "场面": "noun", "场所": "noun", "倡导": "verb", "畅通": "adj", "畅销": "verb", "倡议": "verb", "钞票": "noun", "超越": "verb", "朝代": "noun", "潮流": "noun", "嘲笑": "verb", "撤退": "verb", "撤销": "verb", "沉淀": "verb", "陈旧": "adj", "陈列": "verb", "沉闷": "adj", "陈述": "verb", "沉思": "verb", "沉重": "adj", "沉着": "adj", "称心如意": "noun", "称号": "noun", "橙": "noun", "盛": "verb", "承办": "verb", "承包": "verb", "城堡": "noun", "成本": "noun", "惩罚": "verb", "成交": "verb", "承诺": "verb", "澄清": "adj", "成天": "adv", "乘务员": "noun", "呈现": "verb", "成效": "noun", "成心": "adv", "成员": "noun", "诚挚": "adj", "秤": "noun", "吃苦": "verb", "吃力": "adj", "迟缓": "adj", "持久": "adj", "迟疑": "adj", "赤道": "noun", "赤字": "noun", "充当": "verb", "冲动": "noun", "冲击": "verb", "充沛": "adj", "充实": "adj", "冲突": "verb", "充足": "adj", "崇拜": "verb", "重叠": "verb", "崇高": "adj", "崇敬": "verb", "抽空": "noun", "筹备": "verb", "踌躇": "noun", "稠密": "adj", "丑恶": "adj", "初步": "adj", "出路": "noun", "出卖": "verb", "出身": "verb", "出神": "verb", "出息": "noun", "出洋相": "noun", "储备": "verb", "储存": "verb", "处分": "verb", "处境": "noun", "储蓄": "verb", "处置": "verb", "触犯": "verb", "穿越": "verb", "川流不息": "noun", "船舶": "noun", "传达": "verb", "传单": "noun", "传递": "verb", "传授": "verb", "喘气": "noun", "串": "noun", "床单": "noun", "创立": "verb", "创新": "verb", "创业": "verb", "创作": "verb", "吹牛": "verb", "吹捧": "verb", "锤": "noun", "垂直": "verb", "纯粹": "adj", "纯洁": "adj", "磁带": "noun", "慈祥": "adj", "刺": "verb", "伺候": "verb", "次品": "noun", "次序": "noun", "从容不迫": "noun", "凑合": "verb", "粗鲁": "adj", "篡改": "noun", "摧残": "verb", "脆弱": "adj", "搓": "verb", "磋商": "verb", "挫折": "verb", "搭": "verb", "搭档": "verb", "搭配": "verb", "答辩": "verb", "达成": "verb", "答复": "verb", "打包": "verb", "打官司": "noun", "打击": "verb", "打架": "verb", "打量": "verb", "打猎": "verb", "打仗": "verb", "大不了": "adj", "大臣": "noun", "大肆": "adv", "大体": "noun", "大意": "adj", "大致": "adj", "歹徒": "noun", "逮捕": "verb", "代价": "noun", "代理": "verb", "带领": "verb", "怠慢": "verb", "担保": "verb", "胆怯": "adj", "蛋白质": "noun", "诞辰": "noun", "淡季": "noun", "诞生": "verb", "当场": "adv", "当初": "noun", "当代": "noun", "当面": "adv", "当前": "verb", "当事人": "noun", "当务之急": "noun", "当选": "verb", "党": "noun", "档案": "noun", "档次": "noun", "岛": "noun", "倒闭": "verb", "导弹": "noun", "导航": "verb", "捣乱": "verb", "导向": "verb", "稻谷": "noun", "盗窃": "verb", "得不偿失": "noun", "得力": "adj", "得天独厚": "noun", "得罪": "verb", "灯笼": "noun", "蹬": "verb", "登陆": "verb", "登录": "verb", "等候": "verb", "等级": "noun", "瞪": "verb", "堤坝": "noun", "敌视": "verb", "抵达": "verb", "抵抗": "verb", "抵制": "verb", "地步": "noun", "地势": "noun", "递增": "verb", "地质": "noun", "颠簸": "verb", "颠倒": "verb", "典礼": "noun", "点头": "verb", "典型": "noun", "点缀": "verb", "垫": "verb", "奠定": "verb", "惦记": "verb", "电源": "noun", "叼": "verb", "雕刻": "verb", "雕塑": "verb", "吊": "verb", "调动": "verb", "跌": "verb", "丁": "noun", "盯": "verb", "叮嘱": "verb", "定期": "verb", "定义": "noun", "丢人": "verb", "丢三落四": "noun", "东道主": "noun", "东张西望": "noun", "董事长": "noun", "栋": "measure", "动荡": "verb", "动机": "noun", "冻结": "verb", "动静": "noun", "动力": "noun", "动脉": "noun", "动身": "verb", "动手": "verb", "动态": "noun", "洞穴": "noun", "动员": "verb", "兜": "noun", "陡峭": "adj", "斗争": "verb", "督促": "verb", "都市": "noun", "独裁": "noun", "毒品": "noun", "赌博": "verb", "堵塞": "verb", "杜绝": "verb", "端": "verb", "端午节": "noun", "端正": "adj", "短促": "noun", "断定": "verb", "断断续续": "adj", "断绝": "verb", "堆积": "verb", "对策": "noun", "对称": "adj", "对付": "verb", "对抗": "verb", "对立": "verb", "对联": "noun", "队伍": "noun", "兑现": "verb", "对应": "verb", "对照": "verb", "顿时": "adv", "哆嗦": "verb", "多元化": "noun", "堕落": "verb", "额": "noun", "额外": "adj", "恶心": "adj", "恶化": "verb", "遏制": "verb", "恩怨": "noun", "而已": "particle", "二氧化碳": "noun", "发布": "verb", "发财": "verb", "发呆": "verb", "发动": "verb", "发火": "verb", "发掘": "verb", "发射": "verb", "发誓": "verb", "发行": "verb", "发炎": "verb", "发扬": "verb", "发育": "verb", "法人": "noun", "番": "measure", "繁华": "adj", "繁忙": "adj", "凡是": "adv", "繁体字": "noun", "繁殖": "verb", "反驳": "verb", "反常": "adj", "反倒": "adv", "反动": "noun", "反感": "noun", "反抗": "verb", "反馈": "verb", "反面": "noun", "反射": "verb", "反思": "verb", "反问": "verb", "反之": "conj", "范畴": "noun", "饭馆": "noun", "泛滥": "verb", "贩卖": "verb", "方位": "noun", "方言": "noun", "方针": "noun", "防守": "verb", "防疫": "verb", "防御": "verb", "防止": "verb", "防治": "verb", "访问": "verb", "纺织": "verb", "放大": "verb", "放射": "verb", "放手": "noun", "非法": "adj", "飞禽走兽": "noun", "飞翔": "verb", "飞跃": "verb", "肥沃": "adj", "诽谤": "verb", "匪徒": "noun", "肺": "noun", "废除": "verb", "沸腾": "verb", "废墟": "noun", "费用": "noun", "分辨": "verb", "分寸": "noun", "吩咐": "verb", "分红": "verb", "分解": "verb", "分裂": "verb", "分泌": "verb", "分明": "adj", "分歧": "adj", "分散": "adj", "坟墓": "noun", "粉末": "noun", "愤怒": "adj", "风暴": "noun", "风貌": "noun", "风气": "noun", "风味": "noun", "风筝": "noun", "缝": "verb", "逢": "verb", "奉献": "verb", "佛": "noun", "夫妇": "noun", "肤浅": "adj", "俯视": "verb", "腐烂": "verb", "腐蚀": "verb", "抚摸": "verb", "俯": "noun", "抚养": "verb", "辅助": "verb", "复活": "verb", "复仇": "noun", "付出": "verb", "副": "measure", "富裕": "adj", "负担": "verb", "附和": "verb", "复合": "verb", "附件": "noun", "复述": "noun", "附属": "adj", "富翁": "noun", "复兴": "verb", "富有": "adj", "附着": "noun", "改良": "verb", "概率": "noun", "干旱": "adj", "干扰": "verb", "干涉": "verb", "尴尬": "adj", "感慨": "verb", "感染": "verb", "干劲": "noun", "纲领": "noun", "岗位": "noun", "港口": "noun", "高超": "adj", "高潮": "noun", "高峰": "noun", "高明": "adj", "高尚": "adj", "高涨": "verb", "告辞": "verb", "告诫": "verb", "隔阂": "noun", "格局": "noun", "隔离": "verb", "革命": "verb", "跟前": "noun", "更新": "verb", "耕地": "verb", "工程": "noun", "工夫": "noun", "工艺": "noun", "公安局": "noun", "公道": "adj", "公积金": "noun", "公民": "noun", "公认": "verb", "公式": "noun", "公正": "adj", "攻击": "verb", "攻克": "verb", "功劳": "noun", "功效": "noun", "恭维": "verb", "供给": "verb", "供应": "verb", "宫殿": "noun", "巩固": "adj", "共和国": "noun", "共计": "verb", "勾结": "verb", "钩子": "noun", "构思": "verb", "构造": "verb", "孤独": "adj", "孤立": "adj", "辜负": "verb", "古板": "noun", "古怪": "adj", "古迹": "noun", "谷物": "noun", "股东": "noun", "骨干": "noun", "股份": "noun", "故乡": "noun", "雇佣": "verb", "故障": "noun", "关怀": "verb", "关照": "verb", "观光": "verb", "官方": "noun", "归": "verb", "规范": "noun", "归宿": "noun", "规章": "noun", "鬼": "noun", "轨迹": "noun", "轨道": "noun", "棍子": "noun", "国民": "noun", "过滤": "verb", "过于": "adv", "海岸": "noun", "海外": "noun", "含蓄": "verb", "含义": "noun", "含糊": "adj", "罕见": "adj", "行列": "noun", "毫不": "noun", "毫米": "measure", "耗费": "verb", "喝彩": "verb", "和谐": "adj", "合资": "verb", "和睦": "adj", "黑暗": "adj", "痕迹": "noun", "恒心": "noun", "衡量": "verb", "轰动": "verb", "轰炸": "verb", "宏伟": "adj", "洪水": "noun", "哄": "verb", "喉咙": "noun", "后辈": "noun", "后代": "noun", "后退": "verb", "糊": "verb", "狐狸": "noun", "胡乱": "adv", "互助": "verb", "花白": "noun", "花费": "verb", "花样": "noun", "滑翔": "noun", "化妆": "verb", "化肥": "noun", "化石": "noun", "化验": "verb", "化妆品": "noun", "环节": "noun", "环绕": "verb", "环保": "noun", "缓和": "adj", "幻觉": "noun", "慌忙": "adj", "荒诞": "adj", "荒凉": "adj", "荒谬": "adj", "荒野": "noun", "皇后": "noun", "皇帝": "noun", "辉煌": "adj", "汇报": "verb", "汇集": "verb", "汇款": "verb", "贿赂": "verb", "昏迷": "verb", "货币": "noun", "获取": "verb", "基层": "noun", "基地": "noun", "机动": "adj", "饥饿": "adj", "激发": "verb", "机关": "noun", "基金": "noun", "机密": "adj", "激素": "noun", "集团": "noun", "机械": "noun", "基因": "noun", "基于": "prep", "机制": "noun", "级别": "noun", "极端": "noun", "急切": "adj", "极限": "noun", "急性": "adj", "急于": "verb", "脊梁": "noun", "计量": "noun", "记性": "noun", "记载": "verb", "寄托": "verb", "忌讳": "verb", "季度": "noun", "继承": "verb", "加工": "verb", "加快": "verb", "假若": "noun", "监测": "verb", "监督": "verb", "艰难": "adj", "尖锐": "adj", "监视": "verb", "监狱": "noun", "减弱": "verb", "简体字": "noun", "检讨": "verb", "健全": "adj", "见识": "verb", "见效": "verb", "鉴于": "prep", "见证": "verb", "将军": "noun", "将近": "adv", "僵硬": "adj", "降温": "verb", "交代": "verb", "交纳": "verb", "交替": "verb", "焦虑": "adj", "焦点": "noun", "侥幸": "adj", "狡诈": "noun", "教养": "verb", "接见": "verb", "接连": "verb", "杰出": "adj", "结局": "noun", "竭力": "adv", "截止": "verb", "节奏": "noun", "解体": "verb", "解脱": "verb", "戒备": "verb", "界限": "noun", "借鉴": "verb", "借助": "verb", "金融": "noun", "仅仅": "adv", "进展": "verb", "近来": "noun", "浸泡": "verb", "茎": "noun", "经费": "noun", "惊奇": "adj", "精打细算": "noun", "精华": "noun", "精简": "verb", "精密": "adj", "精确": "adj", "精通": "verb", "精益求精": "noun", "鲸鱼": "noun", "惊讶": "adj", "颈": "noun", "警告": "verb", "竞赛": "verb", "敬佩": "verb", "敬重": "verb", "敬仰": "noun", "境界": "noun", "竞选": "verb", "纠纷": "noun", "纠正": "verb", "酒精": "noun", "救济": "verb", "救援": "verb", "就业": "verb", "就职": "verb", "拘留": "verb", "居民": "noun", "居住": "verb", "局部": "noun", "局面": "noun", "局势": "noun", "局限": "verb", "沮丧": "adj", "举动": "noun", "举世闻名": "noun", "据悉": "verb", "锯": "noun", "聚精会神": "noun", "卷": "verb", "决策": "verb", "绝望": "verb", "觉悟": "verb", "军队": "noun", "均衡": "adj", "君子": "noun", "俊秀": "noun", "卡通": "noun", "开采": "verb", "开除": "verb", "开阔": "adj", "开朗": "adj", "开拓": "verb", "开展": "verb", "慷慨": "adj", "扛": "verb", "抗议": "verb", "考核": "verb", "考察": "verb", "考古": "verb", "烤": "verb", "靠拢": "verb", "坑": "noun", "科目": "noun", "可观": "adj", "可恶": "adj", "可行": "adj", "渴望": "verb", "克制": "verb", "空白": "noun", "恐怖": "adj", "恐吓": "verb", "口气": "noun", "口腔": "noun", "口头": "noun", "枯萎": "adj", "夸夸其谈": "noun", "跨": "verb", "宽敞": "adj", "宽容": "verb", "矿物": "noun", "矿石": "noun", "亏": "verb", "亏损": "verb", "捆": "verb", "困惑": "adj", "扩充": "verb", "扩散": "verb", "扩张": "verb", "喇叭": "noun", "来回": "verb", "来历": "noun", "来往": "verb", "来源": "noun", "懒惰": "adj", "滥用": "verb", "捞": "verb", "劳累": "adj", "劳务": "noun", "乐意": "verb", "乐园": "noun", "雷达": "noun", "类别": "noun", "类似": "verb", "冷却": "verb", "黎明": "noun", "离奇": "adj", "理睬": "verb", "理会": "verb", "理事": "verb", "理所当然": "noun", "理直气壮": "noun", "理智": "noun", "力求": "verb", "力图": "noun", "历代": "noun", "历来": "adv", "利害": "noun", "立场": "noun", "立交桥": "noun", "立体": "adj", "立足": "verb", "利率": "noun", "利落": "noun", "例外": "verb", "隶属": "noun", "联欢": "verb", "联络": "verb", "联盟": "noun", "联想": "verb", "连年": "verb", "连锁": "adj", "连同": "conj", "廉洁": "adj", "帘子": "noun", "怜悯": "noun", "良心": "noun", "晾": "verb", "谅解": "verb", "辽阔": "adj", "列举": "verb", "裂缝": "verb", "临床": "verb", "吝啬": "adj", "灵感": "noun", "灵魂": "noun", "凌晨": "noun", "零星": "adj", "领会": "verb", "领事馆": "noun", "领土": "noun", "领悟": "verb", "领先": "verb", "领袖": "noun", "溜": "verb", "流浪": "verb", "流露": "verb", "流氓": "noun", "流通": "verb", "留念": "verb", "留神": "verb", "流域": "noun", "漏洞": "noun", "露面": "verb", "炉灶": "noun", "录用": "verb", "轮船": "noun", "轮廓": "noun", "轮胎": "noun", "论坛": "noun", "论证": "verb", "啰唆": "adj", "落成": "verb", "落实": "verb", "络绎不绝": "noun", "屡次": "adv", "履行": "verb", "掠夺": "verb", "麻痹": "verb", "麻木": "adj", "麻醉": "verb", "码头": "noun", "蚂蚁": "noun", "嘛": "particle", "埋伏": "verb", "埋没": "verb", "埋葬": "verb", "迈": "verb", "脉搏": "noun", "埋怨": "verb", "慢性": "adj", "漫长": "adj", "漫画": "noun", "蔓延": "verb", "忙碌": "adj", "茫茫": "adj", "茫然": "adj", "盲目": "adj", "冒充": "verb", "冒犯": "verb", "茂盛": "adj", "枚": "measure", "媒介": "noun", "美观": "adj", "美满": "adj", "美妙": "adj", "萌芽": "verb", "猛烈": "adj", "眯": "verb", "弥补": "verb", "弥漫": "verb", "迷惑": "adj", "迷人": "adj", "迷信": "verb", "谜语": "noun", "密度": "noun", "密封": "verb", "棉花": "noun", "免得": "conj", "免疫": "verb", "勉励": "verb", "勉强": "adj", "面貌": "noun", "面子": "noun", "描绘": "verb", "瞄准": "verb", "渺小": "adj", "藐视": "verb", "蔑视": "verb", "灭亡": "verb", "民间": "noun", "民主": "noun", "敏捷": "adj", "敏锐": "adj", "明明": "adv", "明智": "adj", "名次": "noun", "名额": "noun", "名副其实": "noun", "名誉": "noun", "命名": "verb", "摸索": "verb", "膜": "noun", "摩擦": "verb", "磨合": "verb", "模范": "noun", "模式": "noun", "模型": "noun", "魔鬼": "noun", "魔术": "noun", "抹杀": "verb", "莫名其妙": "noun", "默默": "adv", "墨水儿": "noun", "谋求": "verb", "模样": "noun", "母语": "noun", "目睹": "verb", "目光": "noun", "沐浴": "verb", "拿手": "adj", "纳闷儿": "verb", "耐用": "adj", "南辕北辙": "noun", "难得": "adj", "难堪": "verb", "难能可贵": "noun", "恼火": "adj", "内涵": "noun", "内幕": "noun", "内在": "adj", "能量": "noun", "拟定": "verb", "逆行": "verb", "年度": "noun", "捏": "verb", "拧": "verb", "凝固": "verb", "凝聚": "verb", "凝视": "verb", "宁肯": "noun", "宁愿": "adv", "纽扣儿": "noun", "扭转": "verb", "浓厚": "adj", "农历": "noun", "奴隶": "noun", "挪": "verb", "虐待": "verb", "哦": "interj", "殴打": "verb", "偶像": "noun", "呕吐": "verb", "趴": "verb", "排斥": "verb", "排除": "verb", "排练": "verb", "排放": "verb", "徘徊": "verb", "派别": "noun", "派遣": "verb", "攀登": "verb", "盘旋": "verb", "畔": "noun", "判决": "verb", "庞大": "adj", "抛弃": "verb", "泡沫": "noun", "培育": "verb", "配备": "verb", "配偶": "noun", "配套": "verb", "盆地": "noun", "烹饪": "verb", "捧": "verb", "劈": "verb", "批发": "verb", "批判": "verb", "疲惫": "adj", "疲倦": "adj", "皮革": "noun", "屁股": "noun", "譬如": "verb", "偏差": "noun", "偏见": "noun", "偏僻": "adj", "偏偏": "adv", "片断": "noun", "片刻": "noun", "飘扬": "verb", "漂浮": "verb", "撇": "verb", "拼搏": "verb", "拼命": "verb", "频繁": "adj", "频率": "noun", "贫乏": "adj", "贫困": "adj", "品尝": "verb", "品德": "noun", "品质": "noun", "品种": "noun", "平凡": "adj", "平面": "noun", "平坦": "adj", "平行": "adj", "平原": "noun", "平庸": "adj", "评估": "verb", "评论": "verb", "屏障": "noun", "屏幕": "noun", "坡": "noun", "泼": "verb", "颇": "adv", "破例": "verb", "迫不及待": "noun", "迫害": "verb", "魄力": "noun", "扑": "verb", "铺": "verb", "普及": "verb", "朴实": "adj", "朴素": "adj", "瀑布": "noun", "期望": "verb", "期限": "noun", "欺负": "verb", "欺骗": "verb", "凄凉": "adj", "奇妙": "adj", "旗袍": "noun", "旗帜": "noun", "齐全": "adj", "齐心协力": "noun", "歧视": "verb", "起草": "verb", "起初": "noun", "起伏": "verb", "起哄": "verb", "起码": "adj", "起源": "verb", "启程": "verb", "启示": "verb", "启事": "noun", "启蒙": "verb", "乞丐": "noun", "企图": "verb", "岂有此理": "noun", "器材": "noun", "器官": "noun", "气概": "noun", "气功": "noun", "气魄": "noun", "气色": "noun", "气势": "noun", "气味": "noun", "气象": "noun", "气压": "noun", "气质": "noun", "迄今为止": "noun", "掐": "verb", "恰当": "adj", "恰到好处": "noun", "恰巧": "adv", "洽谈": "verb", "牵": "verb", "牵扯": "verb", "牵制": "verb", "千方百计": "noun", "签署": "verb", "迁就": "verb", "迁徙": "verb", "谦逊": "adj", "前景": "noun", "前提": "noun", "潜力": "noun", "潜水": "verb", "潜移默化": "noun", "谴责": "verb", "强制": "verb", "抢劫": "verb", "抢救": "verb", "强迫": "verb", "桥梁": "noun", "翘": "verb", "窍门": "noun", "锲而不舍": "noun", "切实": "adj", "亲密": "adj", "亲热": "adj", "侵犯": "verb", "侵略": "verb", "钦佩": "verb", "勤俭": "adj", "勤劳": "adj", "清澈": "adj", "清晨": "noun", "清除": "verb", "清洁": "adj", "清理": "verb", "清晰": "adj", "清醒": "adj", "清真": "noun", "倾听": "verb", "倾向": "verb", "倾斜": "verb", "晴朗": "adj", "情报": "noun", "情节": "noun", "情理": "noun", "情形": "noun", "请柬": "noun", "请教": "verb", "请示": "verb", "请帖": "noun", "丘陵": "noun", "区分": "verb", "区域": "noun", "屈服": "verb", "曲折": "adj", "驱逐": "verb", "渠道": "noun", "取缔": "verb", "曲子": "noun", "趣味": "noun", "圈套": "noun", "全局": "noun", "全力以赴": "noun", "权衡": "verb", "权威": "noun", "拳头": "noun", "犬": "noun", "缺口": "noun", "缺席": "verb", "缺陷": "noun", "瘸": "verb", "确保": "verb", "确立": "verb", "确切": "adj", "确信": "verb", "群众": "noun", "染": "verb", "嚷": "verb", "让步": "verb", "饶恕": "verb", "扰乱": "verb", "惹祸": "noun", "热泪盈眶": "noun", "热门": "noun", "人道": "noun", "人格": "noun", "人工": "adj", "人家": "pron", "人间": "noun", "人士": "noun", "人为": "adj", "人性": "noun", "人质": "noun", "仁慈": "adj", "忍耐": "verb", "忍受": "verb", "认定": "verb", "认可": "verb", "任命": "verb", "任性": "adj", "任意": "adv", "任重道远": "noun", "仍旧": "adv", "日新月异": "noun", "日益": "adv", "融化": "verb", "融洽": "adj", "溶解": "verb", "容貌": "noun", "容纳": "verb", "容器": "noun", "容忍": "verb", "荣幸": "adj", "荣誉": "noun", "揉": "verb", "柔和": "adj", "儒家": "noun", "弱点": "noun", "若干": "pron", "撒谎": "verb", "散文": "noun", "散布": "verb", "散发": "verb", "丧失": "verb", "骚扰": "verb", "嫂子": "noun", "刹车": "verb", "啥": "noun", "筛选": "verb", "山脉": "noun", "闪烁": "verb", "擅长": "verb", "擅自": "adv", "商标": "noun", "伤脑筋": "noun", "上级": "noun", "上进": "verb", "上任": "verb", "上瘾": "verb", "上游": "noun", "尚且": "conj", "捎": "verb", "梢": "noun", "哨": "noun", "奢侈": "adj", "舌头": "noun", "设立": "verb", "设想": "verb", "设置": "verb", "社区": "noun", "涉及": "verb", "摄氏度": "measure", "深奥": "adj", "深沉": "adj", "深情厚谊": "noun", "申报": "verb", "绅士": "noun", "呻吟": "verb", "神经": "noun", "神奇": "adj", "神气": "noun", "神圣": "adj", "神态": "noun", "神仙": "noun", "审查": "verb", "审理": "verb", "审美": "verb", "审判": "verb", "渗透": "verb", "慎重": "adj", "生存": "verb", "生机": "noun", "生理": "noun", "生疏": "adj", "生态": "noun", "生物": "noun", "生肖": "noun", "生效": "verb", "生锈": "noun", "生育": "verb", "牲畜": "noun", "声明": "verb", "声势": "noun", "声誉": "noun", "省会": "noun", "盛产": "verb", "盛开": "verb", "盛情": "noun", "盛行": "verb", "胜负": "noun", "失事": "verb", "失误": "verb", "失踪": "verb", "师范": "noun", "施加": "verb", "施展": "verb", "尸体": "noun", "拾": "verb", "十足": "adj", "识别": "verb", "时常": "adv", "时而": "adv", "时光": "noun", "时机": "noun", "时事": "noun", "实惠": "noun", "实力": "noun", "实施": "verb", "实事求是": "noun", "实行": "verb", "实质": "noun", "石油": "noun", "使命": "noun", "是非": "noun", "试图": "verb", "试验": "verb", "势必": "adv", "势力": "noun", "世代": "noun", "示范": "verb", "示威": "verb", "示意": "verb", "释放": "verb", "事故": "noun", "事迹": "noun", "事件": "noun", "事态": "noun", "事务": "noun", "事项": "noun", "事业": "noun", "适宜": "adj", "视力": "noun", "视频": "noun", "视线": "noun", "视野": "noun", "逝世": "verb", "收藏": "verb", "收缩": "verb", "收益": "noun", "收音机": "noun", "手法": "noun", "手势": "noun", "手艺": "noun", "首要": "adj", "首饰": "noun", "守护": "verb", "受罪": "verb", "授予": "verb", "书法": "noun", "书籍": "noun", "书记": "noun", "书面": "adj", "舒畅": "adj", "疏忽": "verb", "疏远": "adj", "竖": "adj", "束": "measure", "束缚": "verb", "树立": "verb", "数额": "noun", "耍": "verb", "衰老": "adj", "衰退": "verb", "率领": "verb", "涮火锅": "noun", "双胞胎": "noun", "爽快": "adj", "水利": "noun", "水龙头": "noun", "水泥": "noun", "瞬间": "noun", "司法": "verb", "司令": "noun", "思念": "verb", "思索": "verb", "思维": "noun", "私自": "adv", "斯文": "noun", "死亡": "verb", "四肢": "noun", "寺庙": "noun", "肆无忌惮": "noun", "饲养": "verb", "耸": "verb", "艘": "measure", "苏醒": "verb", "俗话": "noun", "塑造": "verb", "素食": "noun", "素质": "noun", "诉讼": "verb", "算数": "verb", "随即": "adv", "随意": "adj", "岁月": "noun", "隧道": "noun", "损坏": "verb", "索性": "adv", "索取": "verb", "塌": "verb", "踏实": "adj", "塔": "noun", "台风": "noun", "太空": "noun", "泰斗": "noun", "瘫痪": "verb", "贪婪": "adj", "贪污": "verb", "摊": "verb", "弹性": "noun", "坦白": "adj", "探测": "verb", "探索": "verb", "探讨": "verb", "探望": "verb", "叹气": "verb", "倘若": "conj", "掏": "verb", "滔滔不绝": "noun", "陶瓷": "noun", "陶醉": "verb", "淘汰": "verb", "讨好": "verb", "特长": "noun", "特定": "adj", "特意": "adv", "提拔": "verb", "提炼": "verb", "提示": "verb", "提议": "verb", "题材": "noun", "体裁": "noun", "体积": "noun", "体谅": "verb", "体面": "noun", "体系": "noun", "天才": "noun", "天伦之乐": "noun", "天然气": "noun", "天生": "adj", "天堂": "noun", "天赋": "verb", "天文": "noun", "田径": "noun", "田野": "noun", "舔": "verb", "挑剔": "verb", "条款": "noun", "条理": "noun", "条约": "noun", "调和": "adj", "调剂": "verb", "调节": "verb", "调解": "verb", "调料": "noun", "挑拨": "verb", "挑衅": "verb", "跳跃": "verb", "停泊": "verb", "停顿": "verb", "停滞": "verb", "亭子": "noun", "挺拔": "adj", "通货膨胀": "noun", "通俗": "adj", "通讯": "noun", "通用": "verb", "通缉": "verb", "铜": "noun", "同胞": "noun", "同志": "noun", "童话": "noun", "统筹兼顾": "noun", "统计": "verb", "统统": "adv", "统治": "verb", "投机": "adj", "投票": "verb", "投诉": "verb", "投降": "verb", "投掷": "verb", "透露": "verb", "秃": "adj", "突破": "verb", "图案": "noun", "徒弟": "noun", "途径": "noun", "涂抹": "noun", "土壤": "noun", "吞吞吐吐": "adj", "团结": "verb", "团体": "noun", "团圆": "verb", "推测": "verb", "推翻": "verb", "推理": "verb", "推论": "verb", "推销": "verb", "脱离": "verb", "拖延": "verb", "托运": "verb", "妥当": "adj", "妥善": "adj", "妥协": "verb", "椭圆": "noun", "唾弃": "verb", "挖掘": "verb", "娃娃": "noun", "瓦解": "verb", "哇": "noun", "歪曲": "verb", "外表": "noun", "外行": "adj", "外界": "noun", "外向": "adj", "丸": "noun", "完备": "adj", "完毕": "verb", "玩弄": "verb", "玩意儿": "noun", "顽固": "adj", "顽强": "adj", "挽回": "verb", "挽救": "verb", "惋惜": "adj", "万分": "adv", "往常": "noun", "往事": "noun", "妄想": "verb", "微不足道": "noun", "微观": "adj", "威风": "noun", "威力": "noun", "威望": "noun", "威信": "noun", "危机": "noun", "违背": "verb", "维持": "verb", "维护": "verb", "维生素": "noun", "唯独": "adv", "为难": "adj", "为期": "verb", "委托": "verb", "委员": "noun", "伪造": "verb", "未免": "adv", "畏惧": "verb", "卫星": "noun", "慰问": "verb", "蔚蓝": "adj", "温带": "noun", "温和": "adj", "文凭": "noun", "文物": "noun", "文献": "noun", "文雅": "adj", "文艺": "noun", "问世": "verb", "窝": "noun", "乌黑": "noun", "污蔑": "verb", "诬陷": "verb", "无比": "verb", "无偿": "adj", "无耻": "adj", "无动于衷": "noun", "无非": "adv", "无精打采": "noun", "无赖": "adj", "无理取闹": "noun", "无能为力": "noun", "无辜": "adj", "无穷无尽": "noun", "无微不至": "noun", "无忧无虑": "noun", "无知": "adj", "舞蹈": "noun", "武器": "noun", "武侠": "noun", "武装": "noun", "侮辱": "verb", "务必": "adv", "误差": "noun", "误解": "verb", "物业": "noun", "物美价廉": "noun", "物资": "noun", "溪": "noun", "膝盖": "noun", "熄灭": "verb", "昔日": "noun", "牺牲": "verb", "夕阳": "noun", "媳妇": "noun", "习俗": "noun", "袭击": "verb", "喜闻乐见": "noun", "喜悦": "adj", "系列": "noun", "细胞": "noun", "细菌": "noun", "细致": "adj", "霞": "noun", "狭隘": "adj", "狭窄": "adj", "峡谷": "noun", "下属": "noun", "先进": "adj", "先前": "noun", "鲜明": "adj", "掀起": "verb", "纤维": "noun", "弦": "noun", "嫌": "verb", "嫌疑": "noun", "闲话": "noun", "贤惠": "noun", "衔接": "verb", "显著": "adj", "现场": "noun", "现成": "adj", "现状": "noun", "宪法": "noun", "陷害": "verb", "陷入": "verb", "陷阱": "noun", "馅儿": "noun", "线索": "noun", "相差": "verb", "相等": "verb", "相辅相成": "noun", "相应": "verb", "镶嵌": "verb", "乡镇": "noun", "想方设法": "noun", "响亮": "adj", "响应": "verb", "巷": "noun", "向导": "noun", "向来": "adv", "向往": "verb", "相声": "noun", "消除": "verb", "消毒": "verb", "消防": "verb", "消耗": "verb", "消灭": "verb", "销毁": "verb", "小心翼翼": "noun", "效益": "noun", "肖像": "noun", "潇洒": "adj", "携带": "verb", "协会": "noun", "协商": "verb", "协调": "adj", "协议": "verb", "协助": "verb", "屑": "noun", "谢绝": "verb", "泄露": "verb", "泄气": "verb", "新陈代谢": "noun", "新郎": "noun", "新娘": "noun", "新颖": "adj", "心得": "noun", "心灵": "noun", "心态": "noun", "心疼": "verb", "心血": "noun", "心眼儿": "noun", "心甘情愿": "noun", "辛勤": "adj", "欣慰": "adj", "欣欣向荣": "noun", "薪水": "noun", "信赖": "verb", "信念": "noun", "信仰": "verb", "信誉": "noun", "腥": "adj", "兴隆": "adj", "兴旺": "adj", "行政": "verb", "形态": "noun", "刑事": "adj", "性感": "adj", "性命": "noun", "性能": "noun", "兴高采烈": "noun", "兴致勃勃": "noun", "胸怀": "verb", "胸膛": "noun", "汹涌": "verb", "凶恶": "adj", "凶手": "noun", "雄厚": "adj", "雄伟": "adj", "修复": "verb", "修建": "verb", "修养": "noun", "羞耻": "adj", "绣": "verb", "嗅觉": "noun", "虚假": "adj", "虚荣": "noun", "虚伪": "adj", "需求": "noun", "须知": "noun", "许可": "verb", "酗酒": "verb", "畜牧": "noun", "序言": "noun", "喧哗": "adj", "宣誓": "verb", "宣扬": "verb", "悬挂": "verb", "悬念": "noun", "悬殊": "adj", "悬崖峭壁": "noun", "旋律": "noun", "旋转": "verb", "选拔": "verb", "选举": "verb", "选手": "noun", "炫耀": "verb", "削": "verb", "削弱": "verb", "学说": "noun", "学位": "noun", "雪上加霜": "noun", "血压": "noun", "熏陶": "verb", "循环": "verb", "循序渐进": "noun", "巡逻": "verb", "寻觅": "verb", "压迫": "verb", "压岁钱": "noun", "压缩": "verb", "压抑": "verb", "压榨": "verb", "压制": "verb", "亚军": "noun", "鸦雀无声": "noun", "烟花爆竹": "noun", "淹没": "verb", "延期": "verb", "延伸": "verb", "延续": "verb", "严寒": "adj", "严禁": "verb", "严峻": "adj", "严厉": "adj", "严密": "adj", "沿海": "noun", "言论": "noun", "炎热": "adj", "岩石": "noun", "演变": "verb", "演习": "verb", "演绎": "verb", "演奏": "verb", "掩盖": "verb", "掩护": "verb", "掩饰": "verb", "眼光": "noun", "眼色": "noun", "眼神": "noun", "验收": "verb", "验证": "verb", "厌恶": "verb", "氧气": "noun", "样品": "noun", "摇摆": "verb", "摇滚": "noun", "遥控": "verb", "遥远": "adj", "谣言": "noun", "要点": "noun", "要命": "verb", "要素": "noun", "耀眼": "adj", "野蛮": "adj", "野心": "noun", "液体": "noun", "一流": "adj", "依旧": "verb", "依据": "noun", "依靠": "verb", "依赖": "verb", "依托": "verb", "衣裳": "noun", "一度": "adv", "一贯": "adj", "一目了然": "noun", "一向": "adv", "遗产": "noun", "遗传": "verb", "遗留": "verb", "遗失": "verb", "疑惑": "verb", "仪器": "noun", "仪式": "noun", "以便": "conj", "以免": "conj", "以往": "noun", "以至": "noun", "以致": "conj", "亦": "adv", "翼": "noun", "一帆风顺": "noun", "一举两得": "noun", "一如既往": "noun", "一丝不苟": "noun", "异常": "adj", "意料": "verb", "意识": "verb", "意图": "verb", "意味着": "verb", "意向": "noun", "意志": "noun", "毅力": "noun", "毅然": "adv", "阴谋": "verb", "音响": "noun", "隐蔽": "verb", "隐患": "noun", "隐瞒": "verb", "隐私": "noun", "隐约": "adj", "引导": "verb", "引擎": "noun", "引用": "verb", "饮食": "noun", "婴儿": "noun", "英明": "adj", "英勇": "adj", "迎面": "adv", "盈利": "noun", "应酬": "verb", "应邀": "verb", "拥护": "verb", "拥有": "verb", "庸俗": "adj", "勇于": "verb", "永恒": "adj", "涌现": "verb", "踊跃": "verb", "用户": "noun", "优胜劣汰": "noun", "优先": "verb", "优异": "adj", "优越": "adj", "忧郁": "adj", "油腻": "adj", "油漆": "noun", "犹如": "verb", "有条不紊": "noun", "幼稚": "adj", "诱惑": "verb", "愚蠢": "adj", "愚昧": "adj", "舆论": "noun", "渔民": "noun", "与日俱增": "noun", "羽绒服": "noun", "宇宙": "noun", "愈": "adv", "预料": "verb", "预期": "verb", "预算": "noun", "预先": "adv", "预言": "verb", "预兆": "noun", "玉": "noun", "欲望": "noun", "寓言": "noun", "冤枉": "adj", "元首": "noun", "元素": "noun", "元宵节": "noun", "圆满": "adj", "原告": "noun", "原理": "noun", "原始": "adj", "原先": "noun", "缘故": "noun", "园林": "noun", "源泉": "noun", "约束": "verb", "乐谱": "noun", "岳母": "noun", "熨": "verb", "蕴藏": "verb", "运算": "verb", "运行": "verb", "酝酿": "verb", "孕育": "verb", "砸": "verb", "咋": "noun", "栽培": "verb", "灾难": "noun", "宰": "verb", "再接再厉": "noun", "在意": "verb", "攒": "verb", "暂且": "adv", "赞叹": "verb", "赞助": "verb", "糟蹋": "verb", "遭受": "verb", "遭殃": "verb", "遭遇": "verb", "噪音": "noun", "造型": "verb", "责怪": "verb"};

/**
 * Returns normalized Part of Speech metadata for any vocabulary word.
 * Fallback to intelligent semantic analysis of Vietnamese definition if not in DB.
 */
function getWordPartOfSpeech(word) {
  if (!word) return null;
  // 1. Explicit POS field on word object
  if (word.pos) {
    if (typeof word.pos === 'object') return word.pos;
    if (POS_TYPES[word.pos]) return POS_TYPES[word.pos];
    return { code: 'noun', label: word.pos, en: word.pos, full: word.pos };
  }

  const hanzi = (word.hanzi || word.word || '').trim();
  const cleanHanzi = hanzi.replace(/[（\(].*?[）\)]/g, '').trim();

  // 2. Lookup in official HSK_POS_DB
  const code = (typeof HSK_POS_DB !== 'undefined' && (HSK_POS_DB[hanzi] || HSK_POS_DB[cleanHanzi])) || null;
  if (code && POS_TYPES[code]) {
    return POS_TYPES[code];
  }

  // 3. Intelligent heuristic fallback based on Vietnamese meaning
  const m = (word.meaning || '').toLowerCase().trim();
  if (!m) return POS_TYPES.noun;

  if (/\b(thán từ|ôi|chà|a|ha)\b/.test(m) || m.includes('(thán từ)')) return POS_TYPES.interj;
  if (/^(lượng từ|chiếc|cái|con|quyển|cuốn|bức|tấm|cây|bộ|đôi|ly|tách|bát|lần|chuyến|ngụm)\b/.test(m) || m.includes('lượng từ')) return POS_TYPES.measure;
  if (/^(đại từ|tôi|bạn|anh ấy|cô ấy|chúng tôi|chúng ta|mọi người|ai|gì|đây|đó|kia|mình|bản thân)\b/.test(m) || m.includes('đại từ')) return POS_TYPES.pron;
  if (/^(và|hơn nữa|nhưng|tuy nhiên|hoặc|nếu|bởi vì|cho nên|bất kể|mặc dù|cho dù|chỉ cần|thà rằng|ví như|chẳng hạn)\b/.test(m) || m.includes('liên từ')) return POS_TYPES.conj;
  if (/^(theo|dựa theo|đối với|hướng về|từ|đến|căn cứ vào|bởi|do|nhờ)\b/.test(m) || m.includes('giới từ')) return POS_TYPES.prep;
  if (/^(rất|quá|vô cùng|đều|luôn|thường|thường xuyên|lại|vừa|đang|đã|sẽ|chưa|không|chẳng|thực ra|đột nhiên|tự nhiên|nhất định|hầu như|đặc biệt|ban đầu|vốn dĩ|càng|buộc phải|lập tức|ngay)\b/.test(m) || m.includes('phó từ')) return POS_TYPES.adv;
  if (/^(phù hợp|thích hợp|đẹp|xấu|vui|buồn|tốt|khó|dễ|nhanh|chậm|lớn|to|nhỏ|mới|cũ|rẻ|đắt|an toàn|nguy hiểm|sạch|bẩn|thông minh|ngu ngốc|ấm|lạnh|nóng|ngon|ngọt|cay|đắng|mặn|dài|ngắn|cao|thấp|giàu|nghèo|rộng|hẹp|nổi tiếng|quan trọng|phức tạp|chính xác|nghiêm trọng|rõ ràng|đơn giản|tuyệt vời|nghiêm túc|cẩn thận|tự hào|tự tin|bận rộn|rảnh rỗi|gần|xa|khác biệt|thân thiết|nhiệt tình|kiên nhẫn|gầy|béo|sâu|nông|chắc chắn|vui vẻ|hạnh phúc|cô đơn|yên tĩnh|ồn ào)\b/.test(m) || m.includes('tính từ')) return POS_TYPES.adj;
  if (/^(làm|đi|nói|ăn|uống|xem|mua|bán|học|chạy|bay|đến|rời|giúp|tổ chức|chuẩn bị|phát hiện|tham gia|quyết định|giải quyết|sử dụng|cung cấp|tìm|gặp|nhớ|hiểu|yêu|ghét|thích|lo|nghĩ|biết|mặc|đeo|viết|đọc|nghe|sắp xếp|bố trí|ôm|xin lỗi|đăng ký|tốt nghiệp|biểu thị|thể hiện|biểu diễn|khen ngợi|bảo vệ|đảm bảo|thực hiện|hoàn thành|phát triển|mở rộng|thay đổi|tổng kết|du lịch|trao đổi|kết hôn|kinh doanh|nghiên cứu|chiến đấu|chúc mừng|cảm ơn|kính trọng|mời|chờ|đợi|hy vọng|ước|tin|nghi ngờ|chú ý|quan tâm|giảng|dạy|vẽ|hát|múa|bơi|chơi|sửa|chữa|chọn|chọn lựa)\b/.test(m) || m.includes('động từ')) return POS_TYPES.verb;

  return POS_TYPES.noun;
}

const WORD_ILLUSTRATIONS_DB = {
  // 合适 (héshì - thích hợp, phù hợp): Hai mảnh ghép ăn khớp hoàn hảo với ánh sáng kết nối và tick xác nhận
  '合适': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="puzzleLeftGrad" x1="42" y1="55" x2="100" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fb923c" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>
        <linearGradient id="puzzleRightGrad" x1="100" y1="55" x2="158" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>

      <!-- Ambient glow & alignment grid -->
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <circle cx="100" cy="100" r="78" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5" stroke-dasharray="4 4" />

      <!-- Left Puzzle Piece (Coral/Amber - with knob tab) -->
      <path d="M 44 64 C 44 58 48 54 54 54 L 98 54 C 101 54 103 56 103 59 L 103 84 C 103 86 105 87 107 88 C 115 91 119 95 119 100 C 119 105 115 109 107 112 C 105 113 103 114 103 116 L 103 141 C 103 144 101 146 98 146 L 54 146 C 48 146 44 142 44 136 Z" fill="url(#puzzleLeftGrad)" stroke="#1e293b" stroke-width="2" />

      <!-- Right Puzzle Piece (Emerald - with matching socket receiving the tab) -->
      <path d="M 103 59 C 103 56 105 54 108 54 L 152 54 C 158 54 162 58 162 64 L 162 136 C 162 142 158 146 152 146 L 108 146 C 105 146 103 144 103 141 L 103 116 C 103 114 105 113 107 112 C 115 109 119 105 119 100 C 119 95 115 91 107 88 C 105 87 103 86 103 84 Z" fill="url(#puzzleRightGrad)" stroke="#1e293b" stroke-width="2" />

      <!-- Seam Highlight Line -->
      <path d="M 103 59 L 103 84 C 103 86 105 87 107 88 C 115 91 119 95 119 100 C 119 105 115 109 107 112 C 105 113 103 114 103 116 L 103 141" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" />

      <!-- Radiant Starburst at Interlocking Center -->
      <circle cx="111" cy="100" r="14" fill="#fef08a" fill-opacity="0.2" />
      <path d="M 111 88 L 113 97 L 122 100 L 113 103 L 111 112 L 109 103 L 100 100 L 109 97 Z" fill="#fef08a" />
      <circle cx="111" cy="100" r="3" fill="#ffffff" />

      <!-- Success Checkmark Badge (Vừa vặn - Đạt chuẩn) -->
      <circle cx="152" cy="52" r="14" fill="#10b981" stroke="#0f172a" stroke-width="2.5" />
      <path d="M 146 52 L 150 56 L 158 48" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Sparkle accents -->
      <path d="M 46 42 L 48 47 L 53 48 L 48 49 L 46 54 L 44 49 L 39 48 L 44 47 Z" fill="#fbbf24" opacity="0.9" />
      <path d="M 166 128 L 167 131 L 170 132 L 167 133 L 166 136 L 165 133 L 162 132 L 165 131 Z" fill="#38bdf8" opacity="0.85" />
    </svg>`,
    caption: '✨ Vừa vặn · Ăn khớp hoàn hảo'
  },

  // 总结 (zǒngjié - tổng kết): Người thuyết trình bên bục và bảng tổng kết gạch đầu dòng
  '总结': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="4 4" />
      <rect x="36" y="38" width="86" height="108" rx="8" fill="#1e2230" stroke="#38bdf8" stroke-width="3" />
      <rect x="65" y="30" width="28" height="12" rx="4" fill="#38bdf8" />
      <circle cx="52" cy="58" r="4" fill="#38bdf8" />
      <line x1="64" y1="58" x2="104" y2="58" stroke="#f1f5f9" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="52" cy="76" r="4" fill="#10b981" />
      <line x1="64" y1="76" x2="108" y2="76" stroke="#f1f5f9" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="52" cy="94" r="4" fill="#f59e0b" />
      <line x1="64" y1="94" x2="96" y2="94" stroke="#f1f5f9" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="102" cy="126" r="14" fill="#10b981" />
      <path d="M96 126L100 130L108 122" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="146" cy="62" r="16" fill="#fb923c" />
      <path d="M124 116C124 96 134 86 146 86C158 86 168 96 168 116" fill="#f97316" />
      <path d="M132 94L110 84" stroke="#fb923c" stroke-width="4.5" stroke-linecap="round" />
      <path d="M116 112L120 162H174L178 112H116Z" fill="#334155" stroke="#64748b" stroke-width="2.5" />
      <line x1="126" y1="124" x2="168" y2="124" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
      <path d="M136 112L134 100" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
      <ellipse cx="133" cy="97" rx="3" ry="4" fill="#e2e8f0" />
      <line x1="22" y1="168" x2="178" y2="168" stroke="currentColor" stroke-opacity="0.2" stroke-width="3" stroke-linecap="round" />
    </svg>`,
    caption: 'Thuyết trình tổng kết nội dung'
  },

  // 休 (xiū - nghỉ ngơi): Người tựa gốc cây
  '休': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M128 165V90M128 90C128 58 100 40 135 30C165 40 160 70 128 90Z" fill="#15803d" />
      <path d="M128 165V85M128 120L108 105M128 105L145 95" stroke="#854d0e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M110 55C125 35 155 40 165 60C170 80 150 95 128 90" fill="#22c55e" fill-opacity="0.8" />
      <circle cx="82" cy="105" r="14" fill="#fb923c" />
      <path d="M72 155C72 135 84 125 96 122L120 128" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M72 155L60 165" stroke="#f97316" stroke-width="6" stroke-linecap="round" />
      <text x="76" y="80" fill="#38bdf8" font-size="16" font-family="sans-serif" font-weight="bold">Z</text>
      <text x="88" y="70" fill="#38bdf8" font-size="20" font-family="sans-serif" font-weight="bold">z</text>
      <line x1="30" y1="168" x2="170" y2="168" stroke="currentColor" stroke-opacity="0.2" stroke-width="3" stroke-linecap="round" />
    </svg>`,
    caption: 'Người tựa gốc cây nghỉ ngơi'
  },

  // 明 (míng - sáng sủa, thông minh): Mặt trời + Mặt trăng
  '明': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <circle cx="68" cy="98" r="32" fill="#f59e0b" />
      <path d="M68 54V60M68 136V142M24 98H30M106 98H112M37 67L42 72M94 124L99 129M37 129L42 124M94 72L99 67" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
      <path d="M125 65C105 75 105 120 135 135C110 135 95 105 110 75C114 68 120 65 125 65Z" fill="#38bdf8" />
      <circle cx="150" cy="72" r="3" fill="#e0f2fe" />
      <circle cx="162" cy="95" r="2" fill="#e0f2fe" />
      <circle cx="142" cy="115" r="2.5" fill="#e0f2fe" />
    </svg>`,
    caption: 'Mặt trời & Mặt trăng hội tụ ánh sáng'
  },

  // 衣服 (yīfu - quần áo): Móc treo và áo thời trang
  '衣服': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M100 42C94 42 90 46 90 52C90 58 98 62 100 66L62 82C58 84 58 90 62 90H138C142 90 142 84 138 82L100 66" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M62 88L42 115L60 128L72 108V155C72 159 76 162 80 162H120C124 162 128 159 128 155V108L140 128L158 115L138 88H62Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3" stroke-linejoin="round" />
      <path d="M88 88L100 112L112 88" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="100" cy="124" r="3" fill="#fbbf24" />
      <circle cx="100" cy="138" r="3" fill="#fbbf24" />
      <circle cx="100" cy="152" r="3" fill="#fbbf24" />
    </svg>`,
    caption: 'Trang phục thường ngày'
  },

  // 穿 (chuān - mặc): Mặc trang phục vừa vặn
  '穿': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <circle cx="100" cy="52" r="16" fill="#fdba74" />
      <path d="M74 76C82 72 118 72 126 76L138 120L118 124L114 162H86L82 124L62 120L74 76Z" fill="#6366f1" stroke="#4338ca" stroke-width="3" />
      <line x1="100" y1="80" x2="100" y2="160" stroke="#fbbf24" stroke-width="3.5" stroke-dasharray="4 3" />
      <path d="M52 105L44 112M148 105L156 112" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
    </svg>`,
    caption: 'Mặc trang phục vừa vặn'
  },

  // 准备 (zhǔnbèi - chuẩn bị): Ba lô du lịch và sổ checklist sẵn sàng
  '准备': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <rect x="44" y="62" width="58" height="82" rx="14" fill="#f97316" stroke="#c2410c" stroke-width="3" />
      <path d="M58 62V48C58 44 62 40 66 40H80C84 40 88 44 88 48V62" stroke="#c2410c" stroke-width="4" stroke-linecap="round" />
      <rect x="54" y="92" width="38" height="36" rx="6" fill="#fb923c" />
      <rect x="112" y="55" width="56" height="84" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
      <line x1="128" y1="76" x2="154" y2="76" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      <path d="M120 76L123 79L127 74" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="128" y1="94" x2="154" y2="94" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      <path d="M120 94L123 97L127 92" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="128" y1="112" x2="154" y2="112" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      <path d="M120 112L123 115L127 110" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
    caption: 'Sẵn sàng trước mọi việc'
  },

  // 高兴 (gāoxìng - vui vẻ): Nụ cười rạng rỡ và ánh sao
  '高兴': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <circle cx="100" cy="100" r="54" fill="#fbbf24" />
      <path d="M78 88C80 82 88 82 90 88" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" />
      <path d="M110 88C112 82 120 82 122 88" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" />
      <path d="M76 106C76 126 124 126 124 106" fill="#ef4444" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
      <path d="M84 106C88 116 112 116 116 106" fill="#ffffff" />
      <path d="M38 68L40 73L45 75L40 77L38 82L36 77L31 75L36 73Z" fill="#f59e0b" />
      <path d="M162 68L164 73L169 75L164 77L162 82L160 77L155 75L160 73Z" fill="#f59e0b" />
    </svg>`,
    caption: 'Tâm trạng hân hoan, vui mừng'
  },

  // 难过 (nánguò - buồn bã): Đám mây nhỏ và giọt mưa
  '难过': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M65 110H140C152 110 162 100 162 88C162 76 152 66 140 66C138 52 124 42 108 42C94 42 82 50 78 62C64 64 54 75 54 88C54 100 62 110 65 110Z" fill="#64748b" />
      <path d="M80 126C80 132 75 137 75 137C75 137 70 132 70 126C70 122 72 120 75 120C78 120 80 122 80 126Z" fill="#38bdf8" />
      <path d="M105 132C105 138 100 143 100 143C100 143 95 138 95 132C95 128 97 126 100 126C103 126 105 128 105 132Z" fill="#38bdf8" />
      <path d="M130 126C130 132 125 137 125 137C125 137 120 132 120 126C120 122 122 120 125 120C128 120 130 122 130 126Z" fill="#38bdf8" />
    </svg>`,
    caption: 'Tâm trạng buồn bã'
  },

  // 成功 (chénggōng - thành công): Cúp vàng chiến thắng và ngôi sao
  '成功': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M68 54H132V92C132 110 118 124 100 124C82 124 68 110 68 92V54Z" fill="#eab308" stroke="#ca8a04" stroke-width="3" />
      <path d="M68 64H52C46 64 42 70 46 78L54 94C58 100 64 104 70 102" stroke="#ca8a04" stroke-width="4" stroke-linecap="round" fill="none" />
      <path d="M132 64H148C154 64 158 70 154 78L146 94C142 100 136 104 130 102" stroke="#ca8a04" stroke-width="4" stroke-linecap="round" fill="none" />
      <rect x="94" y="124" width="12" height="22" fill="#ca8a04" />
      <path d="M72 146H128L134 162H66L72 146Z" fill="#78350f" stroke="#ca8a04" stroke-width="2" />
      <path d="M100 70L103 78L111 79L105 84L107 92L100 87L93 92L95 84L89 79L97 78Z" fill="#ffffff" />
    </svg>`,
    caption: 'Đạt được thắng lợi viên mãn'
  },

  // 保护 (bǎohù - bảo vệ): Chiếc khiên bảo vệ mầm cây xanh
  '保护': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M100 38L152 56V104C152 136 128 158 100 168C72 158 48 136 48 104V56L100 38Z" fill="#059669" fill-opacity="0.15" stroke="#10b981" stroke-width="4" stroke-linejoin="round" />
      <path d="M100 138V100" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
      <path d="M100 114C92 106 82 108 78 114C78 124 92 122 100 120" fill="#34d399" />
      <path d="M100 106C108 96 120 98 124 106C124 116 108 114 100 112" fill="#34d399" />
      <circle cx="100" cy="92" r="5" fill="#fbbf24" />
    </svg>`,
    caption: 'Che chở và gìn giữ an toàn'
  },

  // 时间 (shíjiān - thời gian): Đồng hồ cát tinh tế
  '时间': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <line x1="62" y1="44" x2="138" y2="44" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
      <line x1="62" y1="156" x2="138" y2="156" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
      <path d="M74 48H126L104 96C102 98 102 102 104 104L126 152H74L96 104C98 102 98 98 96 96L74 48Z" stroke="#38bdf8" stroke-width="3" fill="rgba(56, 189, 248, 0.08)" stroke-linejoin="round" />
      <path d="M82 66H118L100 96L82 66Z" fill="#fbbf24" />
      <line x1="100" y1="96" x2="100" y2="138" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3 3" />
      <path d="M78 152H122L108 134C104 130 96 130 92 134L78 152Z" fill="#fbbf24" />
    </svg>`,
    caption: 'Dòng chảy của khoảnh khắc'
  },

  // 爱情 (àiqíng - tình yêu): Hai trái tim gắn kết
  '爱情': {
    type: 'svg',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="82" fill="currentColor" fill-opacity="0.04" />
      <path d="M88 72C74 58 52 64 48 84C42 110 88 142 88 142C88 142 106 128 116 114C108 108 98 94 92 82C90 78 89 74 88 72Z" fill="#f43f5e" />
      <path d="M118 64C106 52 88 56 82 70C74 88 94 116 118 136C142 116 162 88 154 70C148 56 130 52 118 64Z" fill="#fb7185" fill-opacity="0.9" stroke="#1e293b" stroke-width="2.5" />
      <path d="M154 48L156 52L160 53L156 54L154 58L152 54L148 53L152 52Z" fill="#fbbf24" />
    </svg>`,
    caption: 'Tình cảm chân thành lứa đôi'
  }
};

// Pre-generated static illustration assets stored in assets/images/illustrations/
const STATIC_ILLUSTRATIONS_INDEX = {
  "爱": {
    "file": "爱.svg",
    "src": "images/HSK_2.0/level1/爱.svg",
    "caption": "yêu, thích"
  },
  "八": {
    "file": "八.svg",
    "src": "images/HSK_2.0/level1/八.svg",
    "caption": "tám"
  },
  "爸爸": {
    "file": "爸爸.svg",
    "src": "images/HSK_2.0/level1/爸爸.svg",
    "caption": "ba, bố"
  },
  "杯子": {
    "file": "杯子.svg",
    "src": "images/HSK_2.0/level1/杯子.svg",
    "caption": "cái cốc"
  },
  "北京": {
    "file": "北京.svg",
    "src": "images/HSK_2.0/level1/北京.svg",
    "caption": "Bắc Kinh"
  },
  "本": {
    "file": "本.svg",
    "src": "images/HSK_2.0/level1/本.svg",
    "caption": "cuốn (lượng từ)"
  },
  "不客气": {
    "file": "不客气.svg",
    "src": "images/HSK_2.0/level1/不客气.svg",
    "caption": "không có gì (đáp lời cảm ơn)"
  },
  "不": {
    "file": "不.svg",
    "src": "images/HSK_2.0/level1/不.svg",
    "caption": "không"
  },
  "菜": {
    "file": "菜.svg",
    "src": "images/HSK_2.0/level1/菜.svg",
    "caption": "món ăn, rau"
  },
  "茶": {
    "file": "茶.svg",
    "src": "images/HSK_2.0/level1/茶.svg",
    "caption": "trà"
  },
  "吃": {
    "file": "吃.svg",
    "src": "images/HSK_2.0/level1/吃.svg",
    "caption": "ăn"
  },
  "出租车": {
    "file": "出租车.svg",
    "src": "images/HSK_2.0/level1/出租车.svg",
    "caption": "xe taxi"
  },
  "打电话": {
    "file": "打电话.svg",
    "src": "images/HSK_2.0/level1/打电话.svg",
    "caption": "gọi điện thoại"
  },
  "大": {
    "file": "大.svg",
    "src": "images/HSK_2.0/level1/大.svg",
    "caption": "to, lớn"
  },
  "的": {
    "file": "的.svg",
    "src": "images/HSK_2.0/level1/的.svg",
    "caption": "của (trợ từ)"
  },
  "点": {
    "file": "点.svg",
    "src": "images/HSK_2.0/level1/点.svg",
    "caption": "giờ, điểm"
  },
  "电脑": {
    "file": "电脑.svg",
    "src": "images/HSK_2.0/level1/电脑.svg",
    "caption": "máy tính"
  },
  "电视": {
    "file": "电视.svg",
    "src": "images/HSK_2.0/level1/电视.svg",
    "caption": "tivi"
  },
  "电影": {
    "file": "电影.svg",
    "src": "images/HSK_2.0/level1/电影.svg",
    "caption": "phim"
  },
  "东西": {
    "file": "东西.svg",
    "src": "images/HSK_2.0/level1/东西.svg",
    "caption": "đồ vật"
  },
  "都": {
    "file": "都.svg",
    "src": "images/HSK_2.0/level1/都.svg",
    "caption": "đều"
  },
  "读": {
    "file": "读.svg",
    "src": "images/HSK_2.0/level1/读.svg",
    "caption": "đọc"
  },
  "对不起": {
    "file": "对不起.svg",
    "src": "images/HSK_2.0/level1/对不起.svg",
    "caption": "xin lỗi"
  },
  "多": {
    "file": "多.svg",
    "src": "images/HSK_2.0/level1/多.svg",
    "caption": "nhiều"
  },
  "多少": {
    "file": "多少.svg",
    "src": "images/HSK_2.0/level1/多少.svg",
    "caption": "bao nhiêu"
  },
  "儿子": {
    "file": "儿子.svg",
    "src": "images/HSK_2.0/level1/儿子.svg",
    "caption": "con trai"
  },
  "二": {
    "file": "二.svg",
    "src": "images/HSK_2.0/level1/二.svg",
    "caption": "hai"
  },
  "饭店": {
    "file": "饭店.svg",
    "src": "images/HSK_2.0/level1/饭店.svg",
    "caption": "nhà hàng, khách sạn"
  },
  "飞机": {
    "file": "飞机.svg",
    "src": "images/HSK_2.0/level1/飞机.svg",
    "caption": "máy bay"
  },
  "分钟": {
    "file": "分钟.svg",
    "src": "images/HSK_2.0/level1/分钟.svg",
    "caption": "phút"
  },
  "高兴": {
    "file": "高兴.svg",
    "src": "images/HSK_2.0/level1/高兴.svg",
    "caption": "vui, vui mừng"
  },
  "个": {
    "file": "个.svg",
    "src": "images/HSK_2.0/level1/个.svg",
    "caption": "cái (lượng từ)"
  },
  "工作": {
    "file": "工作.svg",
    "src": "images/HSK_2.0/level1/工作.svg",
    "caption": "công việc, làm việc"
  },
  "狗": {
    "file": "狗.svg",
    "src": "images/HSK_2.0/level1/狗.svg",
    "caption": "con chó"
  },
  "汉语": {
    "file": "汉语.svg",
    "src": "images/HSK_2.0/level1/汉语.svg",
    "caption": "tiếng Hán, tiếng Trung"
  },
  "好": {
    "file": "好.svg",
    "src": "images/HSK_2.0/level1/好.svg",
    "caption": "tốt, được"
  },
  "号": {
    "file": "号.svg",
    "src": "images/HSK_2.0/level1/号.svg",
    "caption": "ngày, số"
  },
  "喝": {
    "file": "喝.svg",
    "src": "images/HSK_2.0/level1/喝.svg",
    "caption": "uống"
  },
  "和": {
    "file": "和.svg",
    "src": "images/HSK_2.0/level1/和.svg",
    "caption": "và"
  },
  "很": {
    "file": "很.svg",
    "src": "images/HSK_2.0/level1/很.svg",
    "caption": "rất"
  },
  "后面": {
    "file": "后面.svg",
    "src": "images/HSK_2.0/level1/后面.svg",
    "caption": "phía sau"
  },
  "回": {
    "file": "回.svg",
    "src": "images/HSK_2.0/level1/回.svg",
    "caption": "trở về"
  },
  "会": {
    "file": "会.svg",
    "src": "images/HSK_2.0/level1/会.svg",
    "caption": "biết, sẽ"
  },
  "几": {
    "file": "几.svg",
    "src": "images/HSK_2.0/level1/几.svg",
    "caption": "mấy, bao nhiêu"
  },
  "家": {
    "file": "家.svg",
    "src": "images/HSK_2.0/level1/家.svg",
    "caption": "nhà"
  },
  "叫": {
    "file": "叫.svg",
    "src": "images/HSK_2.0/level1/叫.svg",
    "caption": "gọi là, tên là"
  },
  "今天": {
    "file": "今天.svg",
    "src": "images/HSK_2.0/level1/今天.svg",
    "caption": "hôm nay"
  },
  "九": {
    "file": "九.svg",
    "src": "images/HSK_2.0/level1/九.svg",
    "caption": "chín"
  },
  "开": {
    "file": "开.svg",
    "src": "images/HSK_2.0/level1/开.svg",
    "caption": "mở, lái (xe)"
  },
  "看": {
    "file": "看.svg",
    "src": "images/HSK_2.0/level1/看.svg",
    "caption": "nhìn, xem"
  },
  "看见": {
    "file": "看见.svg",
    "src": "images/HSK_2.0/level1/看见.svg",
    "caption": "nhìn thấy"
  },
  "块": {
    "file": "块.svg",
    "src": "images/HSK_2.0/level1/块.svg",
    "caption": "đồng (tiền), miếng"
  },
  "来": {
    "file": "来.svg",
    "src": "images/HSK_2.0/level1/来.svg",
    "caption": "đến, tới"
  },
  "老师": {
    "file": "老师.svg",
    "src": "images/HSK_2.0/level1/老师.svg",
    "caption": "thầy/cô giáo"
  },
  "了": {
    "file": "了.svg",
    "src": "images/HSK_2.0/level1/了.svg",
    "caption": "rồi (trợ từ)"
  },
  "冷": {
    "file": "冷.svg",
    "src": "images/HSK_2.0/level1/冷.svg",
    "caption": "lạnh"
  },
  "里": {
    "file": "里.svg",
    "src": "images/HSK_2.0/level1/里.svg",
    "caption": "bên trong"
  },
  "六": {
    "file": "六.svg",
    "src": "images/HSK_2.0/level1/六.svg",
    "caption": "sáu"
  },
  "吗": {
    "file": "吗.svg",
    "src": "images/HSK_2.0/level1/吗.svg",
    "caption": "à, không (trợ từ hỏi)"
  },
  "妈妈": {
    "file": "妈妈.svg",
    "src": "images/HSK_2.0/level1/妈妈.svg",
    "caption": "mẹ"
  },
  "买": {
    "file": "买.svg",
    "src": "images/HSK_2.0/level1/买.svg",
    "caption": "mua"
  },
  "猫": {
    "file": "猫.svg",
    "src": "images/HSK_2.0/level1/猫.svg",
    "caption": "con mèo"
  },
  "没关系": {
    "file": "没关系.svg",
    "src": "images/HSK_2.0/level1/没关系.svg",
    "caption": "không sao, không có gì"
  },
  "没有": {
    "file": "没有.svg",
    "src": "images/HSK_2.0/level1/没有.svg",
    "caption": "không có"
  },
  "米饭": {
    "file": "米饭.svg",
    "src": "images/HSK_2.0/level1/米饭.svg",
    "caption": "cơm"
  },
  "名字": {
    "file": "名字.svg",
    "src": "images/HSK_2.0/level1/名字.svg",
    "caption": "tên"
  },
  "明天": {
    "file": "明天.svg",
    "src": "images/HSK_2.0/level1/明天.svg",
    "caption": "ngày mai"
  },
  "哪": {
    "file": "哪.svg",
    "src": "images/HSK_2.0/level1/哪.svg",
    "caption": "nào"
  },
  "哪儿": {
    "file": "哪儿.svg",
    "src": "images/HSK_2.0/level1/哪儿.svg",
    "caption": "ở đâu"
  },
  "那": {
    "file": "那.svg",
    "src": "images/HSK_2.0/level1/那.svg",
    "caption": "đó, kia"
  },
  "呢": {
    "file": "呢.svg",
    "src": "images/HSK_2.0/level1/呢.svg",
    "caption": "thế còn (trợ từ)"
  },
  "能": {
    "file": "能.svg",
    "src": "images/HSK_2.0/level1/能.svg",
    "caption": "có thể"
  },
  "你": {
    "file": "你.svg",
    "src": "images/HSK_2.0/level1/你.svg",
    "caption": "bạn"
  },
  "年": {
    "file": "年.svg",
    "src": "images/HSK_2.0/level1/年.svg",
    "caption": "năm"
  },
  "女儿": {
    "file": "女儿.svg",
    "src": "images/HSK_2.0/level1/女儿.svg",
    "caption": "con gái"
  },
  "朋友": {
    "file": "朋友.svg",
    "src": "images/HSK_2.0/level1/朋友.svg",
    "caption": "bạn"
  },
  "漂亮": {
    "file": "漂亮.svg",
    "src": "images/HSK_2.0/level1/漂亮.svg",
    "caption": "đẹp"
  },
  "苹果": {
    "file": "苹果.svg",
    "src": "images/HSK_2.0/level1/苹果.svg",
    "caption": "quả táo"
  },
  "七": {
    "file": "七.svg",
    "src": "images/HSK_2.0/level1/七.svg",
    "caption": "bảy"
  },
  "前面": {
    "file": "前面.svg",
    "src": "images/HSK_2.0/level1/前面.svg",
    "caption": "phía trước"
  },
  "钱": {
    "file": "钱.svg",
    "src": "images/HSK_2.0/level1/钱.svg",
    "caption": "tiền"
  },
  "请": {
    "file": "请.svg",
    "src": "images/HSK_2.0/level1/请.svg",
    "caption": "xin mời"
  },
  "去": {
    "file": "去.svg",
    "src": "images/HSK_2.0/level1/去.svg",
    "caption": "đi"
  },
  "热": {
    "file": "热.svg",
    "src": "images/HSK_2.0/level1/热.svg",
    "caption": "nóng"
  },
  "人": {
    "file": "人.svg",
    "src": "images/HSK_2.0/level1/人.svg",
    "caption": "người"
  },
  "认识": {
    "file": "认识.svg",
    "src": "images/HSK_2.0/level1/认识.svg",
    "caption": "biết, quen biết"
  },
  "三": {
    "file": "三.svg",
    "src": "images/HSK_2.0/level1/三.svg",
    "caption": "ba"
  },
  "商店": {
    "file": "商店.svg",
    "src": "images/HSK_2.0/level1/商店.svg",
    "caption": "cửa hàng"
  },
  "上": {
    "file": "上.svg",
    "src": "images/HSK_2.0/level1/上.svg",
    "caption": "trên"
  },
  "上午": {
    "file": "上午.svg",
    "src": "images/HSK_2.0/level1/上午.svg",
    "caption": "buổi sáng"
  },
  "少": {
    "file": "少.svg",
    "src": "images/HSK_2.0/level1/少.svg",
    "caption": "ít"
  },
  "谁": {
    "file": "谁.svg",
    "src": "images/HSK_2.0/level1/谁.svg",
    "caption": "ai"
  },
  "什么": {
    "file": "什么.svg",
    "src": "images/HSK_2.0/level1/什么.svg",
    "caption": "cái gì"
  },
  "十": {
    "file": "十.svg",
    "src": "images/HSK_2.0/level1/十.svg",
    "caption": "mười"
  },
  "时候": {
    "file": "时候.svg",
    "src": "images/HSK_2.0/level1/时候.svg",
    "caption": "lúc, thời điểm"
  },
  "是": {
    "file": "是.svg",
    "src": "images/HSK_2.0/level1/是.svg",
    "caption": "là"
  },
  "书": {
    "file": "书.svg",
    "src": "images/HSK_2.0/level1/书.svg",
    "caption": "sách"
  },
  "水": {
    "file": "水.svg",
    "src": "images/HSK_2.0/level1/水.svg",
    "caption": "nước"
  },
  "水果": {
    "file": "水果.svg",
    "src": "images/HSK_2.0/level1/水果.svg",
    "caption": "trái cây"
  },
  "睡觉": {
    "file": "睡觉.svg",
    "src": "images/HSK_2.0/level1/睡觉.svg",
    "caption": "ngủ"
  },
  "说": {
    "file": "说.svg",
    "src": "images/HSK_2.0/level1/说.svg",
    "caption": "nói"
  },
  "四": {
    "file": "四.svg",
    "src": "images/HSK_2.0/level1/四.svg",
    "caption": "bốn"
  },
  "岁": {
    "file": "岁.svg",
    "src": "images/HSK_2.0/level1/岁.svg",
    "caption": "tuổi"
  },
  "他": {
    "file": "他.svg",
    "src": "images/HSK_2.0/level1/他.svg",
    "caption": "anh ấy, nó"
  },
  "她": {
    "file": "她.svg",
    "src": "images/HSK_2.0/level1/她.svg",
    "caption": "cô ấy"
  },
  "太": {
    "file": "太.svg",
    "src": "images/HSK_2.0/level1/太.svg",
    "caption": "quá"
  },
  "天气": {
    "file": "天气.svg",
    "src": "images/HSK_2.0/level1/天气.svg",
    "caption": "thời tiết"
  },
  "听": {
    "file": "听.svg",
    "src": "images/HSK_2.0/level1/听.svg",
    "caption": "nghe"
  },
  "同学": {
    "file": "同学.svg",
    "src": "images/HSK_2.0/level1/同学.svg",
    "caption": "bạn học"
  },
  "喂": {
    "file": "喂.svg",
    "src": "images/HSK_2.0/level1/喂.svg",
    "caption": "alô (chào điện thoại)"
  },
  "我": {
    "file": "我.svg",
    "src": "images/HSK_2.0/level1/我.svg",
    "caption": "tôi"
  },
  "我们": {
    "file": "我们.svg",
    "src": "images/HSK_2.0/level1/我们.svg",
    "caption": "chúng tôi, chúng ta"
  },
  "五": {
    "file": "五.svg",
    "src": "images/HSK_2.0/level1/五.svg",
    "caption": "năm"
  },
  "喜欢": {
    "file": "喜欢.svg",
    "src": "images/HSK_2.0/level1/喜欢.svg",
    "caption": "thích"
  },
  "下": {
    "file": "下.svg",
    "src": "images/HSK_2.0/level1/下.svg",
    "caption": "dưới"
  },
  "下午": {
    "file": "下午.svg",
    "src": "images/HSK_2.0/level1/下午.svg",
    "caption": "buổi chiều"
  },
  "下雨": {
    "file": "下雨.svg",
    "src": "images/HSK_2.0/level1/下雨.svg",
    "caption": "trời mưa"
  },
  "先生": {
    "file": "先生.svg",
    "src": "images/HSK_2.0/level1/先生.svg",
    "caption": "ông, quý ông"
  },
  "现在": {
    "file": "现在.svg",
    "src": "images/HSK_2.0/level1/现在.svg",
    "caption": "hiện tại, bây giờ"
  },
  "想": {
    "file": "想.svg",
    "src": "images/HSK_2.0/level1/想.svg",
    "caption": "muốn, nghĩ"
  },
  "小": {
    "file": "小.svg",
    "src": "images/HSK_2.0/level1/小.svg",
    "caption": "nhỏ"
  },
  "小姐": {
    "file": "小姐.svg",
    "src": "images/HSK_2.0/level1/小姐.svg",
    "caption": "cô (xưng hô)"
  },
  "些": {
    "file": "些.svg",
    "src": "images/HSK_2.0/level1/些.svg",
    "caption": "vài, một ít"
  },
  "写": {
    "file": "写.svg",
    "src": "images/HSK_2.0/level1/写.svg",
    "caption": "viết"
  },
  "谢谢": {
    "file": "谢谢.svg",
    "src": "images/HSK_2.0/level1/谢谢.svg",
    "caption": "cảm ơn"
  },
  "星期": {
    "file": "星期.svg",
    "src": "images/HSK_2.0/level1/星期.svg",
    "caption": "tuần, thứ (trong tuần)"
  },
  "学生": {
    "file": "学生.svg",
    "src": "images/HSK_2.0/level1/学生.svg",
    "caption": "học sinh"
  },
  "学习": {
    "file": "学习.svg",
    "src": "images/HSK_2.0/level1/学习.svg",
    "caption": "học tập"
  },
  "学校": {
    "file": "学校.svg",
    "src": "images/HSK_2.0/level1/学校.svg",
    "caption": "trường học"
  },
  "一": {
    "file": "一.svg",
    "src": "images/HSK_2.0/level1/一.svg",
    "caption": "một"
  },
  "一点儿": {
    "file": "一点儿.svg",
    "src": "images/HSK_2.0/level1/一点儿.svg",
    "caption": "một chút"
  },
  "医生": {
    "file": "医生.svg",
    "src": "images/HSK_2.0/level1/医生.svg",
    "caption": "bác sĩ"
  },
  "医院": {
    "file": "医院.svg",
    "src": "images/HSK_2.0/level1/医院.svg",
    "caption": "bệnh viện"
  },
  "衣服": {
    "file": "衣服.svg",
    "src": "images/HSK_2.0/level1/衣服.svg",
    "caption": "quần áo"
  },
  "椅子": {
    "file": "椅子.svg",
    "src": "images/HSK_2.0/level1/椅子.svg",
    "caption": "cái ghế"
  },
  "有": {
    "file": "有.svg",
    "src": "images/HSK_2.0/level1/有.svg",
    "caption": "có"
  },
  "月": {
    "file": "月.svg",
    "src": "images/HSK_2.0/level1/月.svg",
    "caption": "tháng"
  },
  "再见": {
    "file": "再见.svg",
    "src": "images/HSK_2.0/level1/再见.svg",
    "caption": "tạm biệt"
  },
  "在": {
    "file": "在.svg",
    "src": "images/HSK_2.0/level1/在.svg",
    "caption": "ở, đang"
  },
  "怎么": {
    "file": "怎么.svg",
    "src": "images/HSK_2.0/level1/怎么.svg",
    "caption": "thế nào, sao"
  },
  "怎么样": {
    "file": "怎么样.svg",
    "src": "images/HSK_2.0/level1/怎么样.svg",
    "caption": "như thế nào"
  },
  "这": {
    "file": "这.svg",
    "src": "images/HSK_2.0/level1/这.svg",
    "caption": "này"
  },
  "中国": {
    "file": "中国.svg",
    "src": "images/HSK_2.0/level1/中国.svg",
    "caption": "Trung Quốc"
  },
  "中午": {
    "file": "中午.svg",
    "src": "images/HSK_2.0/level1/中午.svg",
    "caption": "buổi trưa"
  },
  "住": {
    "file": "住.svg",
    "src": "images/HSK_2.0/level1/住.svg",
    "caption": "ở, sống"
  },
  "桌子": {
    "file": "桌子.svg",
    "src": "images/HSK_2.0/level1/桌子.svg",
    "caption": "cái bàn"
  },
  "字": {
    "file": "字.svg",
    "src": "images/HSK_2.0/level1/字.svg",
    "caption": "chữ"
  },
  "昨天": {
    "file": "昨天.svg",
    "src": "images/HSK_2.0/level1/昨天.svg",
    "caption": "hôm qua"
  },
  "做": {
    "file": "做.svg",
    "src": "images/HSK_2.0/level1/做.svg",
    "caption": "làm"
  },
  "坐": {
    "file": "坐.svg",
    "src": "images/HSK_2.0/level1/坐.svg",
    "caption": "ngồi"
  },
  "吧": {
    "file": "吧.svg",
    "src": "images/HSK_2.0/level2/吧.svg",
    "caption": "nhé (trợ từ)"
  },
  "白": {
    "file": "白.svg",
    "src": "images/HSK_2.0/level2/白.svg",
    "caption": "trắng"
  },
  "百": {
    "file": "百.svg",
    "src": "images/HSK_2.0/level2/百.svg",
    "caption": "trăm"
  },
  "帮助": {
    "file": "帮助.svg",
    "src": "images/HSK_2.0/level2/帮助.svg",
    "caption": "giúp đỡ"
  },
  "报纸": {
    "file": "报纸.svg",
    "src": "images/HSK_2.0/level2/报纸.svg",
    "caption": "báo"
  },
  "比": {
    "file": "比.svg",
    "src": "images/HSK_2.0/level2/比.svg",
    "caption": "so với"
  },
  "别": {
    "file": "别.svg",
    "src": "images/HSK_2.0/level2/别.svg",
    "caption": "đừng"
  },
  "宾馆": {
    "file": "宾馆.svg",
    "src": "images/HSK_2.0/level2/宾馆.svg",
    "caption": "khách sạn"
  },
  "长": {
    "file": "长.svg",
    "src": "images/HSK_2.0/level2/长.svg",
    "caption": "dài"
  },
  "唱歌": {
    "file": "唱歌.svg",
    "src": "images/HSK_2.0/level2/唱歌.svg",
    "caption": "hát"
  },
  "出": {
    "file": "出.svg",
    "src": "images/HSK_2.0/level2/出.svg",
    "caption": "ra, đi ra"
  },
  "穿": {
    "file": "穿.svg",
    "src": "images/HSK_2.0/level2/穿.svg",
    "caption": "mặc"
  },
  "次": {
    "file": "次.svg",
    "src": "images/HSK_2.0/level2/次.svg",
    "caption": "lần"
  },
  "从": {
    "file": "从.svg",
    "src": "images/HSK_2.0/level2/从.svg",
    "caption": "từ"
  },
  "错": {
    "file": "错.svg",
    "src": "images/HSK_2.0/level2/错.svg",
    "caption": "sai, nhầm"
  },
  "打篮球": {
    "file": "打篮球.svg",
    "src": "images/HSK_2.0/level2/打篮球.svg",
    "caption": "chơi bóng rổ"
  },
  "大家": {
    "file": "大家.svg",
    "src": "images/HSK_2.0/level2/大家.svg",
    "caption": "mọi người"
  },
  "到": {
    "file": "到.svg",
    "src": "images/HSK_2.0/level2/到.svg",
    "caption": "đến"
  },
  "得": {
    "file": "得.svg",
    "src": "images/HSK_2.0/level2/得.svg",
    "caption": "được (trợ từ)"
  },
  "等": {
    "file": "等.svg",
    "src": "images/HSK_2.0/level2/等.svg",
    "caption": "đợi, chờ"
  },
  "弟弟": {
    "file": "弟弟.svg",
    "src": "images/HSK_2.0/level2/弟弟.svg",
    "caption": "em trai"
  },
  "第一": {
    "file": "第一.svg",
    "src": "images/HSK_2.0/level2/第一.svg",
    "caption": "thứ nhất"
  },
  "懂": {
    "file": "懂.svg",
    "src": "images/HSK_2.0/level2/懂.svg",
    "caption": "hiểu"
  },
  "对": {
    "file": "对.svg",
    "src": "images/HSK_2.0/level2/对.svg",
    "caption": "đối với, hướng về (giới từ)"
  },
  "房间": {
    "file": "房间.svg",
    "src": "images/HSK_2.0/level2/房间.svg",
    "caption": "phòng"
  },
  "非常": {
    "file": "非常.svg",
    "src": "images/HSK_2.0/level2/非常.svg",
    "caption": "rất, vô cùng"
  },
  "服务员": {
    "file": "服务员.svg",
    "src": "images/HSK_2.0/level2/服务员.svg",
    "caption": "nhân viên phục vụ"
  },
  "高": {
    "file": "高.svg",
    "src": "images/HSK_2.0/level2/高.svg",
    "caption": "cao"
  },
  "告诉": {
    "file": "告诉.svg",
    "src": "images/HSK_2.0/level2/告诉.svg",
    "caption": "nói cho biết"
  },
  "哥哥": {
    "file": "哥哥.svg",
    "src": "images/HSK_2.0/level2/哥哥.svg",
    "caption": "anh trai"
  },
  "给": {
    "file": "给.svg",
    "src": "images/HSK_2.0/level2/给.svg",
    "caption": "cho, tặng"
  },
  "公共汽车": {
    "file": "公共汽车.svg",
    "src": "images/HSK_2.0/level2/公共汽车.svg",
    "caption": "xe buýt"
  },
  "公司": {
    "file": "公司.svg",
    "src": "images/HSK_2.0/level2/公司.svg",
    "caption": "công ty"
  },
  "贵": {
    "file": "贵.svg",
    "src": "images/HSK_2.0/level2/贵.svg",
    "caption": "đắt, quý"
  },
  "过": {
    "file": "过.svg",
    "src": "images/HSK_2.0/level2/过.svg",
    "caption": "đã từng (trợ từ)"
  },
  "孩子": {
    "file": "孩子.svg",
    "src": "images/HSK_2.0/level2/孩子.svg",
    "caption": "đứa trẻ"
  },
  "还": {
    "file": "还.svg",
    "src": "images/HSK_2.0/level2/还.svg",
    "caption": "vẫn còn"
  },
  "好吃": {
    "file": "好吃.svg",
    "src": "images/HSK_2.0/level2/好吃.svg",
    "caption": "ngon"
  },
  "黑": {
    "file": "黑.svg",
    "src": "images/HSK_2.0/level2/黑.svg",
    "caption": "đen"
  },
  "红": {
    "file": "红.svg",
    "src": "images/HSK_2.0/level2/红.svg",
    "caption": "đỏ"
  },
  "火车站": {
    "file": "火车站.svg",
    "src": "images/HSK_2.0/level2/火车站.svg",
    "caption": "ga tàu hỏa"
  },
  "机场": {
    "file": "机场.svg",
    "src": "images/HSK_2.0/level2/机场.svg",
    "caption": "sân bay"
  },
  "鸡蛋": {
    "file": "鸡蛋.svg",
    "src": "images/HSK_2.0/level2/鸡蛋.svg",
    "caption": "trứng gà"
  },
  "件": {
    "file": "件.svg",
    "src": "images/HSK_2.0/level2/件.svg",
    "caption": "cái, chiếc (lượng từ)"
  },
  "教室": {
    "file": "教室.svg",
    "src": "images/HSK_2.0/level2/教室.svg",
    "caption": "phòng học"
  },
  "姐姐": {
    "file": "姐姐.svg",
    "src": "images/HSK_2.0/level2/姐姐.svg",
    "caption": "chị gái"
  },
  "介绍": {
    "file": "介绍.svg",
    "src": "images/HSK_2.0/level2/介绍.svg",
    "caption": "giới thiệu"
  },
  "近": {
    "file": "近.svg",
    "src": "images/HSK_2.0/level2/近.svg",
    "caption": "gần"
  },
  "进": {
    "file": "进.svg",
    "src": "images/HSK_2.0/level2/进.svg",
    "caption": "vào"
  },
  "就": {
    "file": "就.svg",
    "src": "images/HSK_2.0/level2/就.svg",
    "caption": "là, ngay (trợ từ nhấn mạnh)"
  },
  "觉得": {
    "file": "觉得.svg",
    "src": "images/HSK_2.0/level2/觉得.svg",
    "caption": "cảm thấy"
  },
  "咖啡": {
    "file": "咖啡.svg",
    "src": "images/HSK_2.0/level2/咖啡.svg",
    "caption": "cà phê"
  },
  "开始": {
    "file": "开始.svg",
    "src": "images/HSK_2.0/level2/开始.svg",
    "caption": "bắt đầu"
  },
  "考试": {
    "file": "考试.svg",
    "src": "images/HSK_2.0/level2/考试.svg",
    "caption": "thi cử"
  },
  "可能": {
    "file": "可能.svg",
    "src": "images/HSK_2.0/level2/可能.svg",
    "caption": "có thể"
  },
  "可以": {
    "file": "可以.svg",
    "src": "images/HSK_2.0/level2/可以.svg",
    "caption": "có thể, được"
  },
  "课": {
    "file": "课.svg",
    "src": "images/HSK_2.0/level2/课.svg",
    "caption": "tiết học"
  },
  "快": {
    "file": "快.svg",
    "src": "images/HSK_2.0/level2/快.svg",
    "caption": "nhanh"
  },
  "快乐": {
    "file": "快乐.svg",
    "src": "images/HSK_2.0/level2/快乐.svg",
    "caption": "vui vẻ"
  },
  "累": {
    "file": "累.svg",
    "src": "images/HSK_2.0/level2/累.svg",
    "caption": "mệt"
  },
  "离": {
    "file": "离.svg",
    "src": "images/HSK_2.0/level2/离.svg",
    "caption": "cách (khoảng cách)"
  },
  "两": {
    "file": "两.svg",
    "src": "images/HSK_2.0/level2/两.svg",
    "caption": "hai (số lượng)"
  },
  "零": {
    "file": "零.svg",
    "src": "images/HSK_2.0/level2/零.svg",
    "caption": "không (số)"
  },
  "路": {
    "file": "路.svg",
    "src": "images/HSK_2.0/level2/路.svg",
    "caption": "đường"
  },
  "旅游": {
    "file": "旅游.svg",
    "src": "images/HSK_2.0/level2/旅游.svg",
    "caption": "du lịch"
  },
  "卖": {
    "file": "卖.svg",
    "src": "images/HSK_2.0/level2/卖.svg",
    "caption": "bán"
  },
  "慢": {
    "file": "慢.svg",
    "src": "images/HSK_2.0/level2/慢.svg",
    "caption": "chậm"
  },
  "忙": {
    "file": "忙.svg",
    "src": "images/HSK_2.0/level2/忙.svg",
    "caption": "bận"
  },
  "每": {
    "file": "每.svg",
    "src": "images/HSK_2.0/level2/每.svg",
    "caption": "mỗi"
  },
  "妹妹": {
    "file": "妹妹.svg",
    "src": "images/HSK_2.0/level2/妹妹.svg",
    "caption": "em gái"
  },
  "门": {
    "file": "门.svg",
    "src": "images/HSK_2.0/level2/门.svg",
    "caption": "cửa"
  },
  "面条": {
    "file": "面条.svg",
    "src": "images/HSK_2.0/level2/面条.svg",
    "caption": "mì"
  },
  "男": {
    "file": "男.svg",
    "src": "images/HSK_2.0/level2/男.svg",
    "caption": "nam, con trai"
  },
  "您": {
    "file": "您.svg",
    "src": "images/HSK_2.0/level2/您.svg",
    "caption": "ngài, bạn (kính ngữ)"
  },
  "牛奶": {
    "file": "牛奶.svg",
    "src": "images/HSK_2.0/level2/牛奶.svg",
    "caption": "sữa bò"
  },
  "女": {
    "file": "女.svg",
    "src": "images/HSK_2.0/level2/女.svg",
    "caption": "nữ, con gái"
  },
  "旁边": {
    "file": "旁边.svg",
    "src": "images/HSK_2.0/level2/旁边.svg",
    "caption": "bên cạnh"
  },
  "跑步": {
    "file": "跑步.svg",
    "src": "images/HSK_2.0/level2/跑步.svg",
    "caption": "chạy bộ"
  },
  "便宜": {
    "file": "便宜.svg",
    "src": "images/HSK_2.0/level2/便宜.svg",
    "caption": "rẻ"
  },
  "票": {
    "file": "票.svg",
    "src": "images/HSK_2.0/level2/票.svg",
    "caption": "vé"
  },
  "妻子": {
    "file": "妻子.svg",
    "src": "images/HSK_2.0/level2/妻子.svg",
    "caption": "vợ"
  },
  "起床": {
    "file": "起床.svg",
    "src": "images/HSK_2.0/level2/起床.svg",
    "caption": "ngủ dậy"
  },
  "千": {
    "file": "千.svg",
    "src": "images/HSK_2.0/level2/千.svg",
    "caption": "nghìn"
  },
  "铅笔": {
    "file": "铅笔.svg",
    "src": "images/HSK_2.0/level2/铅笔.svg",
    "caption": "bút chì"
  },
  "晴": {
    "file": "晴.svg",
    "src": "images/HSK_2.0/level2/晴.svg",
    "caption": "trời quang, nắng đẹp"
  },
  "去年": {
    "file": "去年.svg",
    "src": "images/HSK_2.0/level2/去年.svg",
    "caption": "năm ngoái"
  },
  "让": {
    "file": "让.svg",
    "src": "images/HSK_2.0/level2/让.svg",
    "caption": "để cho, khiến"
  },
  "日": {
    "file": "日.svg",
    "src": "images/HSK_2.0/level2/日.svg",
    "caption": "ngày, mặt trời"
  },
  "上班": {
    "file": "上班.svg",
    "src": "images/HSK_2.0/level2/上班.svg",
    "caption": "đi làm"
  },
  "身体": {
    "file": "身体.svg",
    "src": "images/HSK_2.0/level2/身体.svg",
    "caption": "cơ thể, sức khỏe"
  },
  "生病": {
    "file": "生病.svg",
    "src": "images/HSK_2.0/level2/生病.svg",
    "caption": "bị bệnh"
  },
  "生日": {
    "file": "生日.svg",
    "src": "images/HSK_2.0/level2/生日.svg",
    "caption": "sinh nhật"
  },
  "时间": {
    "file": "时间.svg",
    "src": "images/HSK_2.0/level2/时间.svg",
    "caption": "thời gian"
  },
  "事情": {
    "file": "事情.svg",
    "src": "images/HSK_2.0/level2/事情.svg",
    "caption": "việc, sự việc"
  },
  "手表": {
    "file": "手表.svg",
    "src": "images/HSK_2.0/level2/手表.svg",
    "caption": "đồng hồ đeo tay"
  },
  "手机": {
    "file": "手机.svg",
    "src": "images/HSK_2.0/level2/手机.svg",
    "caption": "điện thoại di động"
  },
  "说话": {
    "file": "说话.svg",
    "src": "images/HSK_2.0/level2/说话.svg",
    "caption": "nói chuyện"
  },
  "送": {
    "file": "送.svg",
    "src": "images/HSK_2.0/level2/送.svg",
    "caption": "tặng, đưa"
  },
  "虽然…但是…": {
    "file": "虽然…但是….svg",
    "src": "images/HSK_2.0/level2/虽然…但是….svg",
    "caption": "mặc dù… nhưng…"
  },
  "它": {
    "file": "它.svg",
    "src": "images/HSK_2.0/level2/它.svg",
    "caption": "nó (vật, con vật)"
  },
  "踢足球": {
    "file": "踢足球.svg",
    "src": "images/HSK_2.0/level2/踢足球.svg",
    "caption": "chơi đá bóng"
  },
  "题": {
    "file": "题.svg",
    "src": "images/HSK_2.0/level2/题.svg",
    "caption": "câu hỏi, đề bài"
  },
  "跳舞": {
    "file": "跳舞.svg",
    "src": "images/HSK_2.0/level2/跳舞.svg",
    "caption": "nhảy múa"
  },
  "外": {
    "file": "外.svg",
    "src": "images/HSK_2.0/level2/外.svg",
    "caption": "ngoài"
  },
  "完": {
    "file": "完.svg",
    "src": "images/HSK_2.0/level2/完.svg",
    "caption": "hoàn thành, xong"
  },
  "玩": {
    "file": "玩.svg",
    "src": "images/HSK_2.0/level2/玩.svg",
    "caption": "chơi"
  },
  "晚上": {
    "file": "晚上.svg",
    "src": "images/HSK_2.0/level2/晚上.svg",
    "caption": "buổi tối"
  },
  "往": {
    "file": "往.svg",
    "src": "images/HSK_2.0/level2/往.svg",
    "caption": "hướng về, đi về"
  },
  "为什么": {
    "file": "为什么.svg",
    "src": "images/HSK_2.0/level2/为什么.svg",
    "caption": "tại sao"
  },
  "问": {
    "file": "问.svg",
    "src": "images/HSK_2.0/level2/问.svg",
    "caption": "hỏi"
  },
  "问题": {
    "file": "问题.svg",
    "src": "images/HSK_2.0/level2/问题.svg",
    "caption": "câu hỏi, vấn đề"
  },
  "希望": {
    "file": "希望.svg",
    "src": "images/HSK_2.0/level2/希望.svg",
    "caption": "hy vọng"
  },
  "西瓜": {
    "file": "西瓜.svg",
    "src": "images/HSK_2.0/level2/西瓜.svg",
    "caption": "dưa hấu"
  },
  "洗": {
    "file": "洗.svg",
    "src": "images/HSK_2.0/level2/洗.svg",
    "caption": "rửa, tắm giặt"
  },
  "小时": {
    "file": "小时.svg",
    "src": "images/HSK_2.0/level2/小时.svg",
    "caption": "giờ (đơn vị thời gian)"
  },
  "笑": {
    "file": "笑.svg",
    "src": "images/HSK_2.0/level2/笑.svg",
    "caption": "cười"
  },
  "新": {
    "file": "新.svg",
    "src": "images/HSK_2.0/level2/新.svg",
    "caption": "mới"
  },
  "姓": {
    "file": "姓.svg",
    "src": "images/HSK_2.0/level2/姓.svg",
    "caption": "họ (tên)"
  },
  "休息": {
    "file": "休息.svg",
    "src": "images/HSK_2.0/level2/休息.svg",
    "caption": "nghỉ ngơi"
  },
  "雪": {
    "file": "雪.svg",
    "src": "images/HSK_2.0/level2/雪.svg",
    "caption": "tuyết"
  },
  "颜色": {
    "file": "颜色.svg",
    "src": "images/HSK_2.0/level2/颜色.svg",
    "caption": "màu sắc"
  },
  "眼睛": {
    "file": "眼睛.svg",
    "src": "images/HSK_2.0/level2/眼睛.svg",
    "caption": "mắt"
  },
  "羊肉": {
    "file": "羊肉.svg",
    "src": "images/HSK_2.0/level2/羊肉.svg",
    "caption": "thịt dê"
  },
  "药": {
    "file": "药.svg",
    "src": "images/HSK_2.0/level2/药.svg",
    "caption": "thuốc"
  },
  "要": {
    "file": "要.svg",
    "src": "images/HSK_2.0/level2/要.svg",
    "caption": "muốn, cần"
  },
  "也": {
    "file": "也.svg",
    "src": "images/HSK_2.0/level2/也.svg",
    "caption": "cũng"
  },
  "一下": {
    "file": "一下.svg",
    "src": "images/HSK_2.0/level2/一下.svg",
    "caption": "một chút, thử xem"
  },
  "已经": {
    "file": "已经.svg",
    "src": "images/HSK_2.0/level2/已经.svg",
    "caption": "đã"
  },
  "一起": {
    "file": "一起.svg",
    "src": "images/HSK_2.0/level2/一起.svg",
    "caption": "cùng nhau"
  },
  "意思": {
    "file": "意思.svg",
    "src": "images/HSK_2.0/level2/意思.svg",
    "caption": "ý nghĩa"
  },
  "因为…所以…": {
    "file": "因为…所以….svg",
    "src": "images/HSK_2.0/level2/因为…所以….svg",
    "caption": "vì… nên…"
  },
  "阴": {
    "file": "阴.svg",
    "src": "images/HSK_2.0/level2/阴.svg",
    "caption": "âm u, nhiều mây"
  },
  "游泳": {
    "file": "游泳.svg",
    "src": "images/HSK_2.0/level2/游泳.svg",
    "caption": "bơi lội"
  },
  "右边": {
    "file": "右边.svg",
    "src": "images/HSK_2.0/level2/右边.svg",
    "caption": "bên phải"
  },
  "鱼": {
    "file": "鱼.svg",
    "src": "images/HSK_2.0/level2/鱼.svg",
    "caption": "con cá"
  },
  "远": {
    "file": "远.svg",
    "src": "images/HSK_2.0/level2/远.svg",
    "caption": "xa"
  },
  "运动": {
    "file": "运动.svg",
    "src": "images/HSK_2.0/level2/运动.svg",
    "caption": "vận động, thể thao"
  },
  "再": {
    "file": "再.svg",
    "src": "images/HSK_2.0/level2/再.svg",
    "caption": "lại, lần nữa"
  },
  "早上": {
    "file": "早上.svg",
    "src": "images/HSK_2.0/level2/早上.svg",
    "caption": "buổi sáng sớm"
  },
  "丈夫": {
    "file": "丈夫.svg",
    "src": "images/HSK_2.0/level2/丈夫.svg",
    "caption": "chồng"
  },
  "找": {
    "file": "找.svg",
    "src": "images/HSK_2.0/level2/找.svg",
    "caption": "tìm"
  },
  "着": {
    "file": "着.svg",
    "src": "images/HSK_2.0/level2/着.svg",
    "caption": "đang (trợ từ)"
  },
  "真": {
    "file": "真.svg",
    "src": "images/HSK_2.0/level2/真.svg",
    "caption": "thật, thực sự"
  },
  "正在": {
    "file": "正在.svg",
    "src": "images/HSK_2.0/level2/正在.svg",
    "caption": "đang"
  },
  "知道": {
    "file": "知道.svg",
    "src": "images/HSK_2.0/level2/知道.svg",
    "caption": "biết"
  },
  "准备": {
    "file": "准备.svg",
    "src": "images/HSK_2.0/level2/准备.svg",
    "caption": "chuẩn bị"
  },
  "走": {
    "file": "走.svg",
    "src": "images/HSK_2.0/level2/走.svg",
    "caption": "đi bộ, rời đi"
  },
  "最": {
    "file": "最.svg",
    "src": "images/HSK_2.0/level2/最.svg",
    "caption": "nhất"
  },
  "左边": {
    "file": "左边.svg",
    "src": "images/HSK_2.0/level2/左边.svg",
    "caption": "bên trái"
  },
  "阿姨": {
    "file": "阿姨.svg",
    "src": "images/HSK_2.0/level3/阿姨.svg",
    "caption": "cô, dì (xưng hô)"
  },
  "啊": {
    "file": "啊.svg",
    "src": "images/HSK_2.0/level3/啊.svg",
    "caption": "à (trợ từ ngữ khí)"
  },
  "矮": {
    "file": "矮.svg",
    "src": "images/HSK_2.0/level3/矮.svg",
    "caption": "thấp"
  },
  "爱好": {
    "file": "爱好.svg",
    "src": "images/HSK_2.0/level3/爱好.svg",
    "caption": "sở thích"
  },
  "安静": {
    "file": "安静.svg",
    "src": "images/HSK_2.0/level3/安静.svg",
    "caption": "yên tĩnh"
  },
  "把": {
    "file": "把.svg",
    "src": "images/HSK_2.0/level3/把.svg",
    "caption": "cái, chiếc (lượng từ); cầm, nắm"
  },
  "班": {
    "file": "班.svg",
    "src": "images/HSK_2.0/level3/班.svg",
    "caption": "lớp"
  },
  "搬": {
    "file": "搬.svg",
    "src": "images/HSK_2.0/level3/搬.svg",
    "caption": "dọn, di chuyển"
  },
  "半": {
    "file": "半.svg",
    "src": "images/HSK_2.0/level3/半.svg",
    "caption": "một nửa"
  },
  "办法": {
    "file": "办法.svg",
    "src": "images/HSK_2.0/level3/办法.svg",
    "caption": "cách, phương pháp"
  },
  "办公室": {
    "file": "办公室.svg",
    "src": "images/HSK_2.0/level3/办公室.svg",
    "caption": "văn phòng"
  },
  "帮忙": {
    "file": "帮忙.svg",
    "src": "images/HSK_2.0/level3/帮忙.svg",
    "caption": "giúp đỡ"
  },
  "包": {
    "file": "包.svg",
    "src": "images/HSK_2.0/level3/包.svg",
    "caption": "cái túi; bao gồm"
  },
  "饱": {
    "file": "饱.svg",
    "src": "images/HSK_2.0/level3/饱.svg",
    "caption": "no"
  },
  "北方": {
    "file": "北方.svg",
    "src": "images/HSK_2.0/level3/北方.svg",
    "caption": "phía bắc"
  },
  "被": {
    "file": "被.svg",
    "src": "images/HSK_2.0/level3/被.svg",
    "caption": "bị (trợ từ bị động)"
  },
  "鼻子": {
    "file": "鼻子.svg",
    "src": "images/HSK_2.0/level3/鼻子.svg",
    "caption": "cái mũi"
  },
  "比较": {
    "file": "比较.svg",
    "src": "images/HSK_2.0/level3/比较.svg",
    "caption": "tương đối, so sánh"
  },
  "比赛": {
    "file": "比赛.svg",
    "src": "images/HSK_2.0/level3/比赛.svg",
    "caption": "cuộc thi đấu"
  },
  "笔记本": {
    "file": "笔记本.svg",
    "src": "images/HSK_2.0/level3/笔记本.svg",
    "caption": "vở ghi chép, laptop"
  },
  "必须": {
    "file": "必须.svg",
    "src": "images/HSK_2.0/level3/必须.svg",
    "caption": "phải, bắt buộc"
  },
  "变化": {
    "file": "变化.svg",
    "src": "images/HSK_2.0/level3/变化.svg",
    "caption": "sự thay đổi"
  },
  "别人": {
    "file": "别人.svg",
    "src": "images/HSK_2.0/level3/别人.svg",
    "caption": "người khác"
  },
  "冰箱": {
    "file": "冰箱.svg",
    "src": "images/HSK_2.0/level3/冰箱.svg",
    "caption": "tủ lạnh"
  },
  "菜单": {
    "file": "菜单.svg",
    "src": "images/HSK_2.0/level3/菜单.svg",
    "caption": "thực đơn"
  },
  "参加": {
    "file": "参加.svg",
    "src": "images/HSK_2.0/level3/参加.svg",
    "caption": "tham gia"
  },
  "草": {
    "file": "草.svg",
    "src": "images/HSK_2.0/level3/草.svg",
    "caption": "cỏ"
  },
  "层": {
    "file": "层.svg",
    "src": "images/HSK_2.0/level3/层.svg",
    "caption": "tầng (lượng từ)"
  },
  "差": {
    "file": "差.svg",
    "src": "images/HSK_2.0/level3/差.svg",
    "caption": "kém, thiếu"
  },
  "超市": {
    "file": "超市.svg",
    "src": "images/HSK_2.0/level3/超市.svg",
    "caption": "siêu thị"
  },
  "衬衫": {
    "file": "衬衫.svg",
    "src": "images/HSK_2.0/level3/衬衫.svg",
    "caption": "áo sơ mi"
  },
  "成绩": {
    "file": "成绩.svg",
    "src": "images/HSK_2.0/level3/成绩.svg",
    "caption": "thành tích, điểm số"
  },
  "城市": {
    "file": "城市.svg",
    "src": "images/HSK_2.0/level3/城市.svg",
    "caption": "thành phố"
  },
  "迟到": {
    "file": "迟到.svg",
    "src": "images/HSK_2.0/level3/迟到.svg",
    "caption": "đến muộn"
  },
  "除了": {
    "file": "除了.svg",
    "src": "images/HSK_2.0/level3/除了.svg",
    "caption": "ngoài ra, trừ"
  },
  "船": {
    "file": "船.svg",
    "src": "images/HSK_2.0/level3/船.svg",
    "caption": "con tàu, thuyền"
  },
  "春": {
    "file": "春.svg",
    "src": "images/HSK_2.0/level3/春.svg",
    "caption": "mùa xuân"
  },
  "词典": {
    "file": "词典.svg",
    "src": "images/HSK_2.0/level3/词典.svg",
    "caption": "từ điển"
  },
  "聪明": {
    "file": "聪明.svg",
    "src": "images/HSK_2.0/level3/聪明.svg",
    "caption": "thông minh"
  },
  "打扫": {
    "file": "打扫.svg",
    "src": "images/HSK_2.0/level3/打扫.svg",
    "caption": "dọn dẹp, quét"
  },
  "打算": {
    "file": "打算.svg",
    "src": "images/HSK_2.0/level3/打算.svg",
    "caption": "dự định"
  },
  "带": {
    "file": "带.svg",
    "src": "images/HSK_2.0/level3/带.svg",
    "caption": "mang theo, đai"
  },
  "担心": {
    "file": "担心.svg",
    "src": "images/HSK_2.0/level3/担心.svg",
    "caption": "lo lắng"
  },
  "蛋糕": {
    "file": "蛋糕.svg",
    "src": "images/HSK_2.0/level3/蛋糕.svg",
    "caption": "bánh ngọt"
  },
  "当然": {
    "file": "当然.svg",
    "src": "images/HSK_2.0/level3/当然.svg",
    "caption": "tất nhiên"
  },
  "地": {
    "file": "地.svg",
    "src": "images/HSK_2.0/level3/地.svg",
    "caption": "cách (trợ từ trạng ngữ)"
  },
  "灯": {
    "file": "灯.svg",
    "src": "images/HSK_2.0/level3/灯.svg",
    "caption": "cái đèn"
  },
  "地方": {
    "file": "地方.svg",
    "src": "images/HSK_2.0/level3/地方.svg",
    "caption": "nơi, địa phương"
  },
  "地铁": {
    "file": "地铁.svg",
    "src": "images/HSK_2.0/level3/地铁.svg",
    "caption": "tàu điện ngầm"
  },
  "地图": {
    "file": "地图.svg",
    "src": "images/HSK_2.0/level3/地图.svg",
    "caption": "bản đồ"
  },
  "电梯": {
    "file": "电梯.svg",
    "src": "images/HSK_2.0/level3/电梯.svg",
    "caption": "thang máy"
  },
  "电子邮件": {
    "file": "电子邮件.svg",
    "src": "images/HSK_2.0/level3/电子邮件.svg",
    "caption": "thư điện tử (email)"
  },
  "东": {
    "file": "东.svg",
    "src": "images/HSK_2.0/level3/东.svg",
    "caption": "phía đông"
  },
  "冬": {
    "file": "冬.svg",
    "src": "images/HSK_2.0/level3/冬.svg",
    "caption": "mùa đông"
  },
  "动物": {
    "file": "动物.svg",
    "src": "images/HSK_2.0/level3/动物.svg",
    "caption": "động vật"
  },
  "短": {
    "file": "短.svg",
    "src": "images/HSK_2.0/level3/短.svg",
    "caption": "ngắn"
  },
  "段": {
    "file": "段.svg",
    "src": "images/HSK_2.0/level3/段.svg",
    "caption": "đoạn (lượng từ)"
  },
  "锻炼": {
    "file": "锻炼.svg",
    "src": "images/HSK_2.0/level3/锻炼.svg",
    "caption": "rèn luyện, tập thể dục"
  },
  "多么": {
    "file": "多么.svg",
    "src": "images/HSK_2.0/level3/多么.svg",
    "caption": "biết bao, thế nào"
  },
  "饿": {
    "file": "饿.svg",
    "src": "images/HSK_2.0/level3/饿.svg",
    "caption": "đói"
  },
  "不但…而且…": {
    "file": "不但…而且….svg",
    "src": "images/HSK_2.0/level3/不但…而且….svg",
    "caption": "không những… mà còn…"
  },
  "耳朵": {
    "file": "耳朵.svg",
    "src": "images/HSK_2.0/level3/耳朵.svg",
    "caption": "tai"
  },
  "发": {
    "file": "发.svg",
    "src": "images/HSK_2.0/level3/发.svg",
    "caption": "phát ra, gửi"
  },
  "发烧": {
    "file": "发烧.svg",
    "src": "images/HSK_2.0/level3/发烧.svg",
    "caption": "sốt"
  },
  "发现": {
    "file": "发现.svg",
    "src": "images/HSK_2.0/level3/发现.svg",
    "caption": "phát hiện"
  },
  "方便": {
    "file": "方便.svg",
    "src": "images/HSK_2.0/level3/方便.svg",
    "caption": "thuận tiện"
  },
  "放": {
    "file": "放.svg",
    "src": "images/HSK_2.0/level3/放.svg",
    "caption": "đặt, để"
  },
  "放心": {
    "file": "放心.svg",
    "src": "images/HSK_2.0/level3/放心.svg",
    "caption": "yên tâm"
  },
  "分": {
    "file": "分.svg",
    "src": "images/HSK_2.0/level3/分.svg",
    "caption": "phút; điểm; phân (đơn vị tiền)"
  },
  "附近": {
    "file": "附近.svg",
    "src": "images/HSK_2.0/level3/附近.svg",
    "caption": "gần đây, lân cận"
  },
  "复习": {
    "file": "复习.svg",
    "src": "images/HSK_2.0/level3/复习.svg",
    "caption": "ôn tập"
  },
  "干净": {
    "file": "干净.svg",
    "src": "images/HSK_2.0/level3/干净.svg",
    "caption": "sạch sẽ"
  },
  "感兴趣": {
    "file": "感兴趣.svg",
    "src": "images/HSK_2.0/level3/感兴趣.svg",
    "caption": "có hứng thú"
  },
  "感冒": {
    "file": "感冒.svg",
    "src": "images/HSK_2.0/level3/感冒.svg",
    "caption": "bị cảm"
  },
  "刚才": {
    "file": "刚才.svg",
    "src": "images/HSK_2.0/level3/刚才.svg",
    "caption": "vừa nãy"
  },
  "个子": {
    "file": "个子.svg",
    "src": "images/HSK_2.0/level3/个子.svg",
    "caption": "chiều cao, vóc người"
  },
  "跟": {
    "file": "跟.svg",
    "src": "images/HSK_2.0/level3/跟.svg",
    "caption": "cùng với, theo"
  },
  "根据": {
    "file": "根据.svg",
    "src": "images/HSK_2.0/level3/根据.svg",
    "caption": "căn cứ, dựa theo"
  },
  "更": {
    "file": "更.svg",
    "src": "images/HSK_2.0/level3/更.svg",
    "caption": "càng, hơn"
  },
  "公斤": {
    "file": "公斤.svg",
    "src": "images/HSK_2.0/level3/公斤.svg",
    "caption": "kilôgam"
  },
  "公园": {
    "file": "公园.svg",
    "src": "images/HSK_2.0/level3/公园.svg",
    "caption": "công viên"
  },
  "故事": {
    "file": "故事.svg",
    "src": "images/HSK_2.0/level3/故事.svg",
    "caption": "câu chuyện"
  },
  "刮风": {
    "file": "刮风.svg",
    "src": "images/HSK_2.0/level3/刮风.svg",
    "caption": "có gió, gió thổi"
  },
  "关": {
    "file": "关.svg",
    "src": "images/HSK_2.0/level3/关.svg",
    "caption": "đóng, tắt"
  },
  "关系": {
    "file": "关系.svg",
    "src": "images/HSK_2.0/level3/关系.svg",
    "caption": "quan hệ"
  },
  "关心": {
    "file": "关心.svg",
    "src": "images/HSK_2.0/level3/关心.svg",
    "caption": "quan tâm"
  },
  "关于": {
    "file": "关于.svg",
    "src": "images/HSK_2.0/level3/关于.svg",
    "caption": "về, liên quan đến"
  },
  "国家": {
    "file": "国家.svg",
    "src": "images/HSK_2.0/level3/国家.svg",
    "caption": "quốc gia"
  },
  "过去": {
    "file": "过去.svg",
    "src": "images/HSK_2.0/level3/过去.svg",
    "caption": "quá khứ"
  },
  "过（动词）": {
    "file": "过（动词）.svg",
    "src": "images/HSK_2.0/level3/过（动词）.svg",
    "caption": "trải qua, qua"
  },
  "还是": {
    "file": "还是.svg",
    "src": "images/HSK_2.0/level3/还是.svg",
    "caption": "hay là, vẫn là"
  },
  "害怕": {
    "file": "害怕.svg",
    "src": "images/HSK_2.0/level3/害怕.svg",
    "caption": "sợ hãi"
  },
  "黑板": {
    "file": "黑板.svg",
    "src": "images/HSK_2.0/level3/黑板.svg",
    "caption": "bảng đen"
  },
  "后来": {
    "file": "后来.svg",
    "src": "images/HSK_2.0/level3/后来.svg",
    "caption": "sau đó"
  },
  "护照": {
    "file": "护照.svg",
    "src": "images/HSK_2.0/level3/护照.svg",
    "caption": "hộ chiếu"
  },
  "花（动词）": {
    "file": "花（动词）.svg",
    "src": "images/HSK_2.0/level3/花（动词）.svg",
    "caption": "tiêu (tiền, thời gian)"
  },
  "花（名词）": {
    "file": "花（名词）.svg",
    "src": "images/HSK_2.0/level3/花（名词）.svg",
    "caption": "hoa"
  },
  "画": {
    "file": "画.svg",
    "src": "images/HSK_2.0/level3/画.svg",
    "caption": "vẽ, tranh vẽ"
  },
  "坏": {
    "file": "坏.svg",
    "src": "images/HSK_2.0/level3/坏.svg",
    "caption": "hỏng, xấu"
  },
  "欢迎": {
    "file": "欢迎.svg",
    "src": "images/HSK_2.0/level3/欢迎.svg",
    "caption": "hoan nghênh, chào mừng"
  },
  "还（动词）": {
    "file": "还（动词）.svg",
    "src": "images/HSK_2.0/level3/还（动词）.svg",
    "caption": "trả lại"
  },
  "环境": {
    "file": "环境.svg",
    "src": "images/HSK_2.0/level3/环境.svg",
    "caption": "môi trường"
  },
  "换": {
    "file": "换.svg",
    "src": "images/HSK_2.0/level3/换.svg",
    "caption": "đổi, thay"
  },
  "黄河": {
    "file": "黄河.svg",
    "src": "images/HSK_2.0/level3/黄河.svg",
    "caption": "sông Hoàng Hà"
  },
  "回答": {
    "file": "回答.svg",
    "src": "images/HSK_2.0/level3/回答.svg",
    "caption": "trả lời"
  },
  "会议": {
    "file": "会议.svg",
    "src": "images/HSK_2.0/level3/会议.svg",
    "caption": "cuộc họp"
  },
  "或者": {
    "file": "或者.svg",
    "src": "images/HSK_2.0/level3/或者.svg",
    "caption": "hoặc là"
  },
  "几乎": {
    "file": "几乎.svg",
    "src": "images/HSK_2.0/level3/几乎.svg",
    "caption": "hầu như"
  },
  "机会": {
    "file": "机会.svg",
    "src": "images/HSK_2.0/level3/机会.svg",
    "caption": "cơ hội"
  },
  "极": {
    "file": "极.svg",
    "src": "images/HSK_2.0/level3/极.svg",
    "caption": "cực kỳ"
  },
  "记得": {
    "file": "记得.svg",
    "src": "images/HSK_2.0/level3/记得.svg",
    "caption": "nhớ (việc gì)"
  },
  "季节": {
    "file": "季节.svg",
    "src": "images/HSK_2.0/level3/季节.svg",
    "caption": "mùa, thời kỳ"
  },
  "检查": {
    "file": "检查.svg",
    "src": "images/HSK_2.0/level3/检查.svg",
    "caption": "kiểm tra"
  },
  "简单": {
    "file": "简单.svg",
    "src": "images/HSK_2.0/level3/简单.svg",
    "caption": "đơn giản"
  },
  "健康": {
    "file": "健康.svg",
    "src": "images/HSK_2.0/level3/健康.svg",
    "caption": "khỏe mạnh, sức khỏe"
  },
  "见面": {
    "file": "见面.svg",
    "src": "images/HSK_2.0/level3/见面.svg",
    "caption": "gặp mặt"
  },
  "讲": {
    "file": "讲.svg",
    "src": "images/HSK_2.0/level3/讲.svg",
    "caption": "nói, giảng giải"
  },
  "教": {
    "file": "教.svg",
    "src": "images/HSK_2.0/level3/教.svg",
    "caption": "dạy"
  },
  "角": {
    "file": "角.svg",
    "src": "images/HSK_2.0/level3/角.svg",
    "caption": "góc; hào (tiền)"
  },
  "脚": {
    "file": "脚.svg",
    "src": "images/HSK_2.0/level3/脚.svg",
    "caption": "chân"
  },
  "接": {
    "file": "接.svg",
    "src": "images/HSK_2.0/level3/接.svg",
    "caption": "đón, nhận"
  },
  "街道": {
    "file": "街道.svg",
    "src": "images/HSK_2.0/level3/街道.svg",
    "caption": "đường phố"
  },
  "结婚": {
    "file": "结婚.svg",
    "src": "images/HSK_2.0/level3/结婚.svg",
    "caption": "kết hôn"
  },
  "结束": {
    "file": "结束.svg",
    "src": "images/HSK_2.0/level3/结束.svg",
    "caption": "kết thúc"
  },
  "节目": {
    "file": "节目.svg",
    "src": "images/HSK_2.0/level3/节目.svg",
    "caption": "tiết mục, chương trình"
  },
  "节日": {
    "file": "节日.svg",
    "src": "images/HSK_2.0/level3/节日.svg",
    "caption": "ngày lễ"
  },
  "解决": {
    "file": "解决.svg",
    "src": "images/HSK_2.0/level3/解决.svg",
    "caption": "giải quyết"
  },
  "借": {
    "file": "借.svg",
    "src": "images/HSK_2.0/level3/借.svg",
    "caption": "cho mượn, mượn"
  },
  "经常": {
    "file": "经常.svg",
    "src": "images/HSK_2.0/level3/经常.svg",
    "caption": "thường xuyên"
  },
  "经过": {
    "file": "经过.svg",
    "src": "images/HSK_2.0/level3/经过.svg",
    "caption": "trải qua, đi qua"
  },
  "经理": {
    "file": "经理.svg",
    "src": "images/HSK_2.0/level3/经理.svg",
    "caption": "giám đốc, quản lý"
  },
  "久": {
    "file": "久.svg",
    "src": "images/HSK_2.0/level3/久.svg",
    "caption": "lâu"
  },
  "旧": {
    "file": "旧.svg",
    "src": "images/HSK_2.0/level3/旧.svg",
    "caption": "cũ"
  },
  "句子": {
    "file": "句子.svg",
    "src": "images/HSK_2.0/level3/句子.svg",
    "caption": "câu (văn)"
  },
  "决定": {
    "file": "决定.svg",
    "src": "images/HSK_2.0/level3/决定.svg",
    "caption": "quyết định"
  },
  "渴": {
    "file": "渴.svg",
    "src": "images/HSK_2.0/level3/渴.svg",
    "caption": "khát"
  },
  "可爱": {
    "file": "可爱.svg",
    "src": "images/HSK_2.0/level3/可爱.svg",
    "caption": "đáng yêu"
  },
  "刻": {
    "file": "刻.svg",
    "src": "images/HSK_2.0/level3/刻.svg",
    "caption": "khắc (15 phút)"
  },
  "客人": {
    "file": "客人.svg",
    "src": "images/HSK_2.0/level3/客人.svg",
    "caption": "khách"
  },
  "空调": {
    "file": "空调.svg",
    "src": "images/HSK_2.0/level3/空调.svg",
    "caption": "máy điều hòa"
  },
  "口": {
    "file": "口.svg",
    "src": "images/HSK_2.0/level3/口.svg",
    "caption": "miệng; cái (lượng từ)"
  },
  "哭": {
    "file": "哭.svg",
    "src": "images/HSK_2.0/level3/哭.svg",
    "caption": "khóc"
  },
  "裤子": {
    "file": "裤子.svg",
    "src": "images/HSK_2.0/level3/裤子.svg",
    "caption": "quần"
  },
  "筷子": {
    "file": "筷子.svg",
    "src": "images/HSK_2.0/level3/筷子.svg",
    "caption": "đôi đũa"
  },
  "蓝": {
    "file": "蓝.svg",
    "src": "images/HSK_2.0/level3/蓝.svg",
    "caption": "màu xanh dương"
  },
  "老": {
    "file": "老.svg",
    "src": "images/HSK_2.0/level3/老.svg",
    "caption": "già"
  },
  "离开": {
    "file": "离开.svg",
    "src": "images/HSK_2.0/level3/离开.svg",
    "caption": "rời khỏi"
  },
  "礼物": {
    "file": "礼物.svg",
    "src": "images/HSK_2.0/level3/礼物.svg",
    "caption": "quà tặng"
  },
  "历史": {
    "file": "历史.svg",
    "src": "images/HSK_2.0/level3/历史.svg",
    "caption": "lịch sử"
  },
  "脸": {
    "file": "脸.svg",
    "src": "images/HSK_2.0/level3/脸.svg",
    "caption": "khuôn mặt"
  },
  "聊天": {
    "file": "聊天.svg",
    "src": "images/HSK_2.0/level3/聊天.svg",
    "caption": "nói chuyện, chat"
  },
  "练习": {
    "file": "练习.svg",
    "src": "images/HSK_2.0/level3/练习.svg",
    "caption": "luyện tập, bài tập"
  },
  "辆": {
    "file": "辆.svg",
    "src": "images/HSK_2.0/level3/辆.svg",
    "caption": "chiếc (lượng từ xe)"
  },
  "了解": {
    "file": "了解.svg",
    "src": "images/HSK_2.0/level3/了解.svg",
    "caption": "hiểu rõ, tìm hiểu"
  },
  "邻居": {
    "file": "邻居.svg",
    "src": "images/HSK_2.0/level3/邻居.svg",
    "caption": "hàng xóm"
  },
  "留学": {
    "file": "留学.svg",
    "src": "images/HSK_2.0/level3/留学.svg",
    "caption": "du học"
  },
  "楼": {
    "file": "楼.svg",
    "src": "images/HSK_2.0/level3/楼.svg",
    "caption": "tầng, tòa nhà"
  },
  "绿": {
    "file": "绿.svg",
    "src": "images/HSK_2.0/level3/绿.svg",
    "caption": "màu xanh lá"
  },
  "马": {
    "file": "马.svg",
    "src": "images/HSK_2.0/level3/马.svg",
    "caption": "con ngựa"
  },
  "马上": {
    "file": "马上.svg",
    "src": "images/HSK_2.0/level3/马上.svg",
    "caption": "ngay lập tức"
  },
  "满意": {
    "file": "满意.svg",
    "src": "images/HSK_2.0/level3/满意.svg",
    "caption": "hài lòng"
  },
  "帽子": {
    "file": "帽子.svg",
    "src": "images/HSK_2.0/level3/帽子.svg",
    "caption": "cái mũ"
  },
  "米": {
    "file": "米.svg",
    "src": "images/HSK_2.0/level3/米.svg",
    "caption": "mét; gạo"
  },
  "面包": {
    "file": "面包.svg",
    "src": "images/HSK_2.0/level3/面包.svg",
    "caption": "bánh mì"
  },
  "明白": {
    "file": "明白.svg",
    "src": "images/HSK_2.0/level3/明白.svg",
    "caption": "hiểu rõ, rõ ràng"
  },
  "拿": {
    "file": "拿.svg",
    "src": "images/HSK_2.0/level3/拿.svg",
    "caption": "cầm, lấy"
  },
  "奶奶": {
    "file": "奶奶.svg",
    "src": "images/HSK_2.0/level3/奶奶.svg",
    "caption": "bà nội"
  },
  "南": {
    "file": "南.svg",
    "src": "images/HSK_2.0/level3/南.svg",
    "caption": "phía nam"
  },
  "难": {
    "file": "难.svg",
    "src": "images/HSK_2.0/level3/难.svg",
    "caption": "khó"
  },
  "难过": {
    "file": "难过.svg",
    "src": "images/HSK_2.0/level3/难过.svg",
    "caption": "buồn, khó chịu"
  },
  "年级": {
    "file": "年级.svg",
    "src": "images/HSK_2.0/level3/年级.svg",
    "caption": "khối lớp"
  },
  "年轻": {
    "file": "年轻.svg",
    "src": "images/HSK_2.0/level3/年轻.svg",
    "caption": "trẻ tuổi"
  },
  "鸟": {
    "file": "鸟.svg",
    "src": "images/HSK_2.0/level3/鸟.svg",
    "caption": "con chim"
  },
  "努力": {
    "file": "努力.svg",
    "src": "images/HSK_2.0/level3/努力.svg",
    "caption": "nỗ lực, cố gắng"
  },
  "爬山": {
    "file": "爬山.svg",
    "src": "images/HSK_2.0/level3/爬山.svg",
    "caption": "leo núi"
  },
  "盘子": {
    "file": "盘子.svg",
    "src": "images/HSK_2.0/level3/盘子.svg",
    "caption": "cái đĩa"
  },
  "胖": {
    "file": "胖.svg",
    "src": "images/HSK_2.0/level3/胖.svg",
    "caption": "béo, mập"
  },
  "啤酒": {
    "file": "啤酒.svg",
    "src": "images/HSK_2.0/level3/啤酒.svg",
    "caption": "bia"
  },
  "皮鞋": {
    "file": "皮鞋.svg",
    "src": "images/HSK_2.0/level3/皮鞋.svg",
    "caption": "giày da"
  },
  "瓶子": {
    "file": "瓶子.svg",
    "src": "images/HSK_2.0/level3/瓶子.svg",
    "caption": "cái chai, lọ"
  },
  "其实": {
    "file": "其实.svg",
    "src": "images/HSK_2.0/level3/其实.svg",
    "caption": "thực ra"
  },
  "其他": {
    "file": "其他.svg",
    "src": "images/HSK_2.0/level3/其他.svg",
    "caption": "cái khác, người khác"
  },
  "骑": {
    "file": "骑.svg",
    "src": "images/HSK_2.0/level3/骑.svg",
    "caption": "cưỡi, đạp (xe)"
  },
  "奇怪": {
    "file": "奇怪.svg",
    "src": "images/HSK_2.0/level3/奇怪.svg",
    "caption": "kỳ lạ"
  },
  "起来": {
    "file": "起来.svg",
    "src": "images/HSK_2.0/level3/起来.svg",
    "caption": "dậy, lên (chỉ hướng)"
  },
  "起飞": {
    "file": "起飞.svg",
    "src": "images/HSK_2.0/level3/起飞.svg",
    "caption": "cất cánh"
  },
  "清楚": {
    "file": "清楚.svg",
    "src": "images/HSK_2.0/level3/清楚.svg",
    "caption": "rõ ràng"
  },
  "请假": {
    "file": "请假.svg",
    "src": "images/HSK_2.0/level3/请假.svg",
    "caption": "xin nghỉ phép"
  },
  "秋": {
    "file": "秋.svg",
    "src": "images/HSK_2.0/level3/秋.svg",
    "caption": "mùa thu"
  },
  "裙子": {
    "file": "裙子.svg",
    "src": "images/HSK_2.0/level3/裙子.svg",
    "caption": "cái váy"
  },
  "然后": {
    "file": "然后.svg",
    "src": "images/HSK_2.0/level3/然后.svg",
    "caption": "sau đó"
  },
  "热情": {
    "file": "热情.svg",
    "src": "images/HSK_2.0/level3/热情.svg",
    "caption": "nhiệt tình"
  },
  "认为": {
    "file": "认为.svg",
    "src": "images/HSK_2.0/level3/认为.svg",
    "caption": "cho rằng, nghĩ rằng"
  },
  "认真": {
    "file": "认真.svg",
    "src": "images/HSK_2.0/level3/认真.svg",
    "caption": "nghiêm túc, chăm chỉ"
  },
  "容易": {
    "file": "容易.svg",
    "src": "images/HSK_2.0/level3/容易.svg",
    "caption": "dễ dàng"
  },
  "如果": {
    "file": "如果.svg",
    "src": "images/HSK_2.0/level3/如果.svg",
    "caption": "nếu"
  },
  "伞": {
    "file": "伞.svg",
    "src": "images/HSK_2.0/level3/伞.svg",
    "caption": "cái dù, ô"
  },
  "上网": {
    "file": "上网.svg",
    "src": "images/HSK_2.0/level3/上网.svg",
    "caption": "lên mạng"
  },
  "生气": {
    "file": "生气.svg",
    "src": "images/HSK_2.0/level3/生气.svg",
    "caption": "tức giận"
  },
  "声音": {
    "file": "声音.svg",
    "src": "images/HSK_2.0/level3/声音.svg",
    "caption": "âm thanh, giọng nói"
  },
  "试": {
    "file": "试.svg",
    "src": "images/HSK_2.0/level3/试.svg",
    "caption": "thử, thi"
  },
  "世界": {
    "file": "世界.svg",
    "src": "images/HSK_2.0/level3/世界.svg",
    "caption": "thế giới"
  },
  "瘦": {
    "file": "瘦.svg",
    "src": "images/HSK_2.0/level3/瘦.svg",
    "caption": "gầy, ốm"
  },
  "舒服": {
    "file": "舒服.svg",
    "src": "images/HSK_2.0/level3/舒服.svg",
    "caption": "thoải mái, dễ chịu"
  },
  "叔叔": {
    "file": "叔叔.svg",
    "src": "images/HSK_2.0/level3/叔叔.svg",
    "caption": "chú (em trai của bố)"
  },
  "树": {
    "file": "树.svg",
    "src": "images/HSK_2.0/level3/树.svg",
    "caption": "cây"
  },
  "数学": {
    "file": "数学.svg",
    "src": "images/HSK_2.0/level3/数学.svg",
    "caption": "môn toán"
  },
  "刷牙": {
    "file": "刷牙.svg",
    "src": "images/HSK_2.0/level3/刷牙.svg",
    "caption": "đánh răng"
  },
  "双": {
    "file": "双.svg",
    "src": "images/HSK_2.0/level3/双.svg",
    "caption": "đôi (lượng từ)"
  },
  "水平": {
    "file": "水平.svg",
    "src": "images/HSK_2.0/level3/水平.svg",
    "caption": "trình độ"
  },
  "司机": {
    "file": "司机.svg",
    "src": "images/HSK_2.0/level3/司机.svg",
    "caption": "lái xe, người lái xe"
  },
  "太阳": {
    "file": "太阳.svg",
    "src": "images/HSK_2.0/level3/太阳.svg",
    "caption": "mặt trời"
  },
  "特别": {
    "file": "特别.svg",
    "src": "images/HSK_2.0/level3/特别.svg",
    "caption": "đặc biệt"
  },
  "疼": {
    "file": "疼.svg",
    "src": "images/HSK_2.0/level3/疼.svg",
    "caption": "đau"
  },
  "提高": {
    "file": "提高.svg",
    "src": "images/HSK_2.0/level3/提高.svg",
    "caption": "nâng cao"
  },
  "体育": {
    "file": "体育.svg",
    "src": "images/HSK_2.0/level3/体育.svg",
    "caption": "thể dục, thể thao"
  },
  "甜": {
    "file": "甜.svg",
    "src": "images/HSK_2.0/level3/甜.svg",
    "caption": "ngọt"
  },
  "条": {
    "file": "条.svg",
    "src": "images/HSK_2.0/level3/条.svg",
    "caption": "con, dải (lượng từ)"
  },
  "同事": {
    "file": "同事.svg",
    "src": "images/HSK_2.0/level3/同事.svg",
    "caption": "đồng nghiệp"
  },
  "同意": {
    "file": "同意.svg",
    "src": "images/HSK_2.0/level3/同意.svg",
    "caption": "đồng ý"
  },
  "头发": {
    "file": "头发.svg",
    "src": "images/HSK_2.0/level3/头发.svg",
    "caption": "tóc"
  },
  "突然": {
    "file": "突然.svg",
    "src": "images/HSK_2.0/level3/突然.svg",
    "caption": "bất ngờ, đột nhiên"
  },
  "图书馆": {
    "file": "图书馆.svg",
    "src": "images/HSK_2.0/level3/图书馆.svg",
    "caption": "thư viện"
  },
  "腿": {
    "file": "腿.svg",
    "src": "images/HSK_2.0/level3/腿.svg",
    "caption": "chân, đùi"
  },
  "完成": {
    "file": "完成.svg",
    "src": "images/HSK_2.0/level3/完成.svg",
    "caption": "hoàn thành"
  },
  "碗": {
    "file": "碗.svg",
    "src": "images/HSK_2.0/level3/碗.svg",
    "caption": "cái bát"
  },
  "万": {
    "file": "万.svg",
    "src": "images/HSK_2.0/level3/万.svg",
    "caption": "vạn (mười nghìn)"
  },
  "忘记": {
    "file": "忘记.svg",
    "src": "images/HSK_2.0/level3/忘记.svg",
    "caption": "quên"
  },
  "为": {
    "file": "为.svg",
    "src": "images/HSK_2.0/level3/为.svg",
    "caption": "vì, cho"
  },
  "为了": {
    "file": "为了.svg",
    "src": "images/HSK_2.0/level3/为了.svg",
    "caption": "để (mục đích)"
  },
  "位": {
    "file": "位.svg",
    "src": "images/HSK_2.0/level3/位.svg",
    "caption": "vị (lượng từ kính trọng)"
  },
  "文化": {
    "file": "文化.svg",
    "src": "images/HSK_2.0/level3/文化.svg",
    "caption": "văn hóa"
  },
  "西": {
    "file": "西.svg",
    "src": "images/HSK_2.0/level3/西.svg",
    "caption": "phía tây"
  },
  "习惯": {
    "file": "习惯.svg",
    "src": "images/HSK_2.0/level3/习惯.svg",
    "caption": "thói quen, quen thuộc"
  },
  "洗手间": {
    "file": "洗手间.svg",
    "src": "images/HSK_2.0/level3/洗手间.svg",
    "caption": "nhà vệ sinh"
  },
  "洗澡": {
    "file": "洗澡.svg",
    "src": "images/HSK_2.0/level3/洗澡.svg",
    "caption": "tắm rửa"
  },
  "夏": {
    "file": "夏.svg",
    "src": "images/HSK_2.0/level3/夏.svg",
    "caption": "mùa hè"
  },
  "先": {
    "file": "先.svg",
    "src": "images/HSK_2.0/level3/先.svg",
    "caption": "trước"
  },
  "香蕉": {
    "file": "香蕉.svg",
    "src": "images/HSK_2.0/level3/香蕉.svg",
    "caption": "quả chuối"
  },
  "相信": {
    "file": "相信.svg",
    "src": "images/HSK_2.0/level3/相信.svg",
    "caption": "tin tưởng"
  },
  "向": {
    "file": "向.svg",
    "src": "images/HSK_2.0/level3/向.svg",
    "caption": "hướng về, về phía"
  },
  "像": {
    "file": "像.svg",
    "src": "images/HSK_2.0/level3/像.svg",
    "caption": "giống như"
  },
  "小心": {
    "file": "小心.svg",
    "src": "images/HSK_2.0/level3/小心.svg",
    "caption": "cẩn thận"
  },
  "校长": {
    "file": "校长.svg",
    "src": "images/HSK_2.0/level3/校长.svg",
    "caption": "hiệu trưởng"
  },
  "新闻": {
    "file": "新闻.svg",
    "src": "images/HSK_2.0/level3/新闻.svg",
    "caption": "tin tức"
  },
  "新鲜": {
    "file": "新鲜.svg",
    "src": "images/HSK_2.0/level3/新鲜.svg",
    "caption": "tươi mới"
  },
  "信用卡": {
    "file": "信用卡.svg",
    "src": "images/HSK_2.0/level3/信用卡.svg",
    "caption": "thẻ tín dụng"
  },
  "行李箱": {
    "file": "行李箱.svg",
    "src": "images/HSK_2.0/level3/行李箱.svg",
    "caption": "vali"
  },
  "熊猫": {
    "file": "熊猫.svg",
    "src": "images/HSK_2.0/level3/熊猫.svg",
    "caption": "gấu trúc"
  },
  "需要": {
    "file": "需要.svg",
    "src": "images/HSK_2.0/level3/需要.svg",
    "caption": "cần thiết, cần"
  },
  "选择": {
    "file": "选择.svg",
    "src": "images/HSK_2.0/level3/选择.svg",
    "caption": "lựa chọn"
  },
  "要求": {
    "file": "要求.svg",
    "src": "images/HSK_2.0/level3/要求.svg",
    "caption": "yêu cầu"
  },
  "爷爷": {
    "file": "爷爷.svg",
    "src": "images/HSK_2.0/level3/爷爷.svg",
    "caption": "ông nội"
  },
  "一定": {
    "file": "一定.svg",
    "src": "images/HSK_2.0/level3/一定.svg",
    "caption": "nhất định"
  },
  "一共": {
    "file": "一共.svg",
    "src": "images/HSK_2.0/level3/一共.svg",
    "caption": "tổng cộng"
  },
  "一会儿": {
    "file": "一会儿.svg",
    "src": "images/HSK_2.0/level3/一会儿.svg",
    "caption": "một lúc, một chút"
  },
  "一样": {
    "file": "一样.svg",
    "src": "images/HSK_2.0/level3/一样.svg",
    "caption": "giống nhau"
  },
  "以前": {
    "file": "以前.svg",
    "src": "images/HSK_2.0/level3/以前.svg",
    "caption": "trước đây"
  },
  "一般": {
    "file": "一般.svg",
    "src": "images/HSK_2.0/level3/一般.svg",
    "caption": "bình thường, nói chung"
  },
  "一边": {
    "file": "一边.svg",
    "src": "images/HSK_2.0/level3/一边.svg",
    "caption": "một bên, vừa… vừa…"
  },
  "一直": {
    "file": "一直.svg",
    "src": "images/HSK_2.0/level3/一直.svg",
    "caption": "luôn luôn, thẳng"
  },
  "音乐": {
    "file": "音乐.svg",
    "src": "images/HSK_2.0/level3/音乐.svg",
    "caption": "âm nhạc"
  },
  "银行": {
    "file": "银行.svg",
    "src": "images/HSK_2.0/level3/银行.svg",
    "caption": "ngân hàng"
  },
  "饮料": {
    "file": "饮料.svg",
    "src": "images/HSK_2.0/level3/饮料.svg",
    "caption": "đồ uống"
  },
  "应该": {
    "file": "应该.svg",
    "src": "images/HSK_2.0/level3/应该.svg",
    "caption": "nên, cần phải"
  },
  "影响": {
    "file": "影响.svg",
    "src": "images/HSK_2.0/level3/影响.svg",
    "caption": "ảnh hưởng"
  },
  "用": {
    "file": "用.svg",
    "src": "images/HSK_2.0/level3/用.svg",
    "caption": "dùng"
  },
  "游戏": {
    "file": "游戏.svg",
    "src": "images/HSK_2.0/level3/游戏.svg",
    "caption": "trò chơi"
  },
  "有名": {
    "file": "有名.svg",
    "src": "images/HSK_2.0/level3/有名.svg",
    "caption": "nổi tiếng"
  },
  "又": {
    "file": "又.svg",
    "src": "images/HSK_2.0/level3/又.svg",
    "caption": "lại (lần nữa)"
  },
  "遇到": {
    "file": "遇到.svg",
    "src": "images/HSK_2.0/level3/遇到.svg",
    "caption": "gặp phải"
  },
  "元": {
    "file": "元.svg",
    "src": "images/HSK_2.0/level3/元.svg",
    "caption": "đồng (tiền)"
  },
  "愿意": {
    "file": "愿意.svg",
    "src": "images/HSK_2.0/level3/愿意.svg",
    "caption": "sẵn lòng, muốn"
  },
  "月亮": {
    "file": "月亮.svg",
    "src": "images/HSK_2.0/level3/月亮.svg",
    "caption": "mặt trăng"
  },
  "越": {
    "file": "越.svg",
    "src": "images/HSK_2.0/level3/越.svg",
    "caption": "càng"
  },
  "站": {
    "file": "站.svg",
    "src": "images/HSK_2.0/level3/站.svg",
    "caption": "ga, bến; đứng"
  },
  "张": {
    "file": "张.svg",
    "src": "images/HSK_2.0/level3/张.svg",
    "caption": "tấm, tờ (lượng từ)"
  },
  "长（动词）": {
    "file": "长（动词）.svg",
    "src": "images/HSK_2.0/level3/长（动词）.svg",
    "caption": "trưởng thành, lớn lên"
  },
  "着急": {
    "file": "着急.svg",
    "src": "images/HSK_2.0/level3/着急.svg",
    "caption": "lo lắng, sốt ruột"
  },
  "照顾": {
    "file": "照顾.svg",
    "src": "images/HSK_2.0/level3/照顾.svg",
    "caption": "chăm sóc"
  },
  "照片": {
    "file": "照片.svg",
    "src": "images/HSK_2.0/level3/照片.svg",
    "caption": "tấm ảnh"
  },
  "照相机": {
    "file": "照相机.svg",
    "src": "images/HSK_2.0/level3/照相机.svg",
    "caption": "máy chụp ảnh"
  },
  "只（量词）": {
    "file": "只（量词）.svg",
    "src": "images/HSK_2.0/level3/只（量词）.svg",
    "caption": "con (lượng từ động vật)"
  },
  "只（副词）": {
    "file": "只（副词）.svg",
    "src": "images/HSK_2.0/level3/只（副词）.svg",
    "caption": "chỉ, chỉ là (phó từ)"
  },
  "只有…才…": {
    "file": "只有…才….svg",
    "src": "images/HSK_2.0/level3/只有…才….svg",
    "caption": "chỉ có… mới…"
  },
  "中文": {
    "file": "中文.svg",
    "src": "images/HSK_2.0/level3/中文.svg",
    "caption": "tiếng Trung"
  },
  "中间": {
    "file": "中间.svg",
    "src": "images/HSK_2.0/level3/中间.svg",
    "caption": "ở giữa"
  },
  "终于": {
    "file": "终于.svg",
    "src": "images/HSK_2.0/level3/终于.svg",
    "caption": "cuối cùng"
  },
  "种": {
    "file": "种.svg",
    "src": "images/HSK_2.0/level3/种.svg",
    "caption": "loại, giống (lượng từ)"
  },
  "重要": {
    "file": "重要.svg",
    "src": "images/HSK_2.0/level3/重要.svg",
    "caption": "quan trọng"
  },
  "周末": {
    "file": "周末.svg",
    "src": "images/HSK_2.0/level3/周末.svg",
    "caption": "cuối tuần"
  },
  "主要": {
    "file": "主要.svg",
    "src": "images/HSK_2.0/level3/主要.svg",
    "caption": "chủ yếu"
  },
  "注意": {
    "file": "注意.svg",
    "src": "images/HSK_2.0/level3/注意.svg",
    "caption": "chú ý"
  },
  "自己": {
    "file": "自己.svg",
    "src": "images/HSK_2.0/level3/自己.svg",
    "caption": "tự mình, bản thân"
  },
  "自行车": {
    "file": "自行车.svg",
    "src": "images/HSK_2.0/level3/自行车.svg",
    "caption": "xe đạp"
  },
  "总是": {
    "file": "总是.svg",
    "src": "images/HSK_2.0/level3/总是.svg",
    "caption": "luôn luôn"
  },
  "嘴": {
    "file": "嘴.svg",
    "src": "images/HSK_2.0/level3/嘴.svg",
    "caption": "miệng"
  },
  "最后": {
    "file": "最后.svg",
    "src": "images/HSK_2.0/level3/最后.svg",
    "caption": "cuối cùng"
  },
  "最近": {
    "file": "最近.svg",
    "src": "images/HSK_2.0/level3/最近.svg",
    "caption": "gần đây"
  },
  "作业": {
    "file": "作业.svg",
    "src": "images/HSK_2.0/level3/作业.svg",
    "caption": "bài tập về nhà"
  },
  "爱情": {
    "file": "爱情.svg",
    "src": "images/HSK_2.0/level4/爱情.svg",
    "caption": "tình yêu"
  },
  "安排": {
    "file": "安排.svg",
    "src": "images/HSK_2.0/level4/安排.svg",
    "caption": "sắp xếp, bố trí"
  },
  "安全": {
    "file": "安全.svg",
    "src": "images/HSK_2.0/level4/安全.svg",
    "caption": "an toàn"
  },
  "按时": {
    "file": "按时.svg",
    "src": "images/HSK_2.0/level4/按时.svg",
    "caption": "đúng giờ"
  },
  "按照": {
    "file": "按照.svg",
    "src": "images/HSK_2.0/level4/按照.svg",
    "caption": "theo, dựa theo"
  },
  "百分之": {
    "file": "百分之.svg",
    "src": "images/HSK_2.0/level4/百分之.svg",
    "caption": "phần trăm"
  },
  "棒": {
    "file": "棒.svg",
    "src": "images/HSK_2.0/level4/棒.svg",
    "caption": "cây gậy; tuyệt vời"
  },
  "包子": {
    "file": "包子.svg",
    "src": "images/HSK_2.0/level4/包子.svg",
    "caption": "bánh bao"
  },
  "保护": {
    "file": "保护.svg",
    "src": "images/HSK_2.0/level4/保护.svg",
    "caption": "bảo vệ"
  },
  "保证": {
    "file": "保证.svg",
    "src": "images/HSK_2.0/level4/保证.svg",
    "caption": "đảm bảo"
  },
  "抱": {
    "file": "抱.svg",
    "src": "images/HSK_2.0/level4/抱.svg",
    "caption": "ôm"
  },
  "抱歉": {
    "file": "抱歉.svg",
    "src": "images/HSK_2.0/level4/抱歉.svg",
    "caption": "xin lỗi, lấy làm tiếc"
  },
  "报名": {
    "file": "报名.svg",
    "src": "images/HSK_2.0/level4/报名.svg",
    "caption": "đăng ký (tham gia)"
  },
  "倍": {
    "file": "倍.svg",
    "src": "images/HSK_2.0/level4/倍.svg",
    "caption": "lần (gấp đôi, gấp ba...)"
  },
  "本来": {
    "file": "本来.svg",
    "src": "images/HSK_2.0/level4/本来.svg",
    "caption": "ban đầu, vốn dĩ"
  },
  "笨": {
    "file": "笨.svg",
    "src": "images/HSK_2.0/level4/笨.svg",
    "caption": "ngu ngốc, đần"
  },
  "比如": {
    "file": "比如.svg",
    "src": "images/HSK_2.0/level4/比如.svg",
    "caption": "ví như, chẳng hạn"
  },
  "毕业": {
    "file": "毕业.svg",
    "src": "images/HSK_2.0/level4/毕业.svg",
    "caption": "tốt nghiệp"
  },
  "遍": {
    "file": "遍.svg",
    "src": "images/HSK_2.0/level4/遍.svg",
    "caption": "lần (lượt qua hết)"
  },
  "标准": {
    "file": "标准.svg",
    "src": "images/HSK_2.0/level4/标准.svg",
    "caption": "tiêu chuẩn"
  },
  "表格": {
    "file": "表格.svg",
    "src": "images/HSK_2.0/level4/表格.svg",
    "caption": "biểu mẫu, bảng"
  },
  "表示": {
    "file": "表示.svg",
    "src": "images/HSK_2.0/level4/表示.svg",
    "caption": "biểu thị, thể hiện"
  },
  "表演": {
    "file": "表演.svg",
    "src": "images/HSK_2.0/level4/表演.svg",
    "caption": "biểu diễn"
  },
  "表扬": {
    "file": "表扬.svg",
    "src": "images/HSK_2.0/level4/表扬.svg",
    "caption": "khen ngợi"
  },
  "饼干": {
    "file": "饼干.svg",
    "src": "images/HSK_2.0/level4/饼干.svg",
    "caption": "bánh quy"
  },
  "并且": {
    "file": "并且.svg",
    "src": "images/HSK_2.0/level4/并且.svg",
    "caption": "và, hơn nữa"
  },
  "博士": {
    "file": "博士.svg",
    "src": "images/HSK_2.0/level4/博士.svg",
    "caption": "tiến sĩ"
  },
  "不过": {
    "file": "不过.svg",
    "src": "images/HSK_2.0/level4/不过.svg",
    "caption": "nhưng, tuy nhiên"
  },
  "不得不": {
    "file": "不得不.svg",
    "src": "images/HSK_2.0/level4/不得不.svg",
    "caption": "không thể không, buộc phải"
  },
  "不管": {
    "file": "不管.svg",
    "src": "images/HSK_2.0/level4/不管.svg",
    "caption": "bất kể, mặc kệ"
  },
  "不仅": {
    "file": "不仅.svg",
    "src": "images/HSK_2.0/level4/不仅.svg",
    "caption": "không chỉ"
  },
  "部分": {
    "file": "部分.svg",
    "src": "images/HSK_2.0/level4/部分.svg",
    "caption": "bộ phận, một phần"
  },
  "擦": {
    "file": "擦.svg",
    "src": "images/HSK_2.0/level4/擦.svg",
    "caption": "lau, chùi"
  },
  "猜": {
    "file": "猜.svg",
    "src": "images/HSK_2.0/level4/猜.svg",
    "caption": "đoán"
  },
  "材料": {
    "file": "材料.svg",
    "src": "images/HSK_2.0/level4/材料.svg",
    "caption": "tài liệu, nguyên liệu"
  },
  "参观": {
    "file": "参观.svg",
    "src": "images/HSK_2.0/level4/参观.svg",
    "caption": "tham quan"
  },
  "餐厅": {
    "file": "餐厅.svg",
    "src": "images/HSK_2.0/level4/餐厅.svg",
    "caption": "nhà hàng, quán ăn"
  },
  "差不多": {
    "file": "差不多.svg",
    "src": "images/HSK_2.0/level4/差不多.svg",
    "caption": "gần như, xấp xỉ"
  },
  "尝": {
    "file": "尝.svg",
    "src": "images/HSK_2.0/level4/尝.svg",
    "caption": "nếm thử"
  },
  "长城": {
    "file": "长城.svg",
    "src": "images/HSK_2.0/level4/长城.svg",
    "caption": "Trường Thành"
  },
  "长江": {
    "file": "长江.svg",
    "src": "images/HSK_2.0/level4/长江.svg",
    "caption": "sông Trường Giang"
  },
  "场": {
    "file": "场.svg",
    "src": "images/HSK_2.0/level4/场.svg",
    "caption": "bãi, sân (lượng từ)"
  },
  "超过": {
    "file": "超过.svg",
    "src": "images/HSK_2.0/level4/超过.svg",
    "caption": "vượt qua"
  },
  "厕所": {
    "file": "厕所.svg",
    "src": "images/HSK_2.0/level4/厕所.svg",
    "caption": "nhà vệ sinh"
  },
  "成功": {
    "file": "成功.svg",
    "src": "images/HSK_2.0/level4/成功.svg",
    "caption": "thành công"
  },
  "成为": {
    "file": "成为.svg",
    "src": "images/HSK_2.0/level4/成为.svg",
    "caption": "trở thành"
  },
  "诚实": {
    "file": "诚实.svg",
    "src": "images/HSK_2.0/level4/诚实.svg",
    "caption": "trung thực"
  },
  "乘坐": {
    "file": "乘坐.svg",
    "src": "images/HSK_2.0/level4/乘坐.svg",
    "caption": "đi (xe, tàu...)"
  },
  "吃惊": {
    "file": "吃惊.svg",
    "src": "images/HSK_2.0/level4/吃惊.svg",
    "caption": "kinh ngạc, giật mình"
  },
  "重新": {
    "file": "重新.svg",
    "src": "images/HSK_2.0/level4/重新.svg",
    "caption": "lại, làm lại từ đầu"
  },
  "抽烟": {
    "file": "抽烟.svg",
    "src": "images/HSK_2.0/level4/抽烟.svg",
    "caption": "hút thuốc"
  },
  "出差": {
    "file": "出差.svg",
    "src": "images/HSK_2.0/level4/出差.svg",
    "caption": "đi công tác"
  },
  "出发": {
    "file": "出发.svg",
    "src": "images/HSK_2.0/level4/出发.svg",
    "caption": "xuất phát"
  },
  "出生": {
    "file": "出生.svg",
    "src": "images/HSK_2.0/level4/出生.svg",
    "caption": "sinh ra"
  },
  "出现": {
    "file": "出现.svg",
    "src": "images/HSK_2.0/level4/出现.svg",
    "caption": "xuất hiện"
  },
  "厨房": {
    "file": "厨房.svg",
    "src": "images/HSK_2.0/level4/厨房.svg",
    "caption": "nhà bếp"
  },
  "传真": {
    "file": "传真.svg",
    "src": "images/HSK_2.0/level4/传真.svg",
    "caption": "fax"
  },
  "窗户": {
    "file": "窗户.svg",
    "src": "images/HSK_2.0/level4/窗户.svg",
    "caption": "cửa sổ"
  },
  "词语": {
    "file": "词语.svg",
    "src": "images/HSK_2.0/level4/词语.svg",
    "caption": "từ ngữ"
  },
  "从来": {
    "file": "从来.svg",
    "src": "images/HSK_2.0/level4/从来.svg",
    "caption": "từ trước đến nay, luôn luôn"
  },
  "粗心": {
    "file": "粗心.svg",
    "src": "images/HSK_2.0/level4/粗心.svg",
    "caption": "cẩu thả, bất cẩn"
  },
  "存": {
    "file": "存.svg",
    "src": "images/HSK_2.0/level4/存.svg",
    "caption": "gửi, lưu trữ"
  },
  "错误": {
    "file": "错误.svg",
    "src": "images/HSK_2.0/level4/错误.svg",
    "caption": "sai sót, lỗi"
  },
  "答案": {
    "file": "答案.svg",
    "src": "images/HSK_2.0/level4/答案.svg",
    "caption": "câu trả lời, đáp án"
  },
  "打招呼": {
    "file": "打招呼.svg",
    "src": "images/HSK_2.0/level4/打招呼.svg",
    "caption": "chào hỏi"
  },
  "打扮": {
    "file": "打扮.svg",
    "src": "images/HSK_2.0/level4/打扮.svg",
    "caption": "trang điểm, ăn diện"
  },
  "打扰": {
    "file": "打扰.svg",
    "src": "images/HSK_2.0/level4/打扰.svg",
    "caption": "làm phiền"
  },
  "打印": {
    "file": "打印.svg",
    "src": "images/HSK_2.0/level4/打印.svg",
    "caption": "in (ấn)"
  },
  "打折": {
    "file": "打折.svg",
    "src": "images/HSK_2.0/level4/打折.svg",
    "caption": "giảm giá"
  },
  "打针": {
    "file": "打针.svg",
    "src": "images/HSK_2.0/level4/打针.svg",
    "caption": "tiêm thuốc"
  },
  "大概": {
    "file": "大概.svg",
    "src": "images/HSK_2.0/level4/大概.svg",
    "caption": "đại khái, có lẽ"
  },
  "大使馆": {
    "file": "大使馆.svg",
    "src": "images/HSK_2.0/level4/大使馆.svg",
    "caption": "đại sứ quán"
  },
  "大约": {
    "file": "大约.svg",
    "src": "images/HSK_2.0/level4/大约.svg",
    "caption": "khoảng, ước chừng"
  },
  "戴": {
    "file": "戴.svg",
    "src": "images/HSK_2.0/level4/戴.svg",
    "caption": "đội, đeo"
  },
  "大夫": {
    "file": "大夫.svg",
    "src": "images/HSK_2.0/level4/大夫.svg",
    "caption": "bác sĩ"
  },
  "当": {
    "file": "当.svg",
    "src": "images/HSK_2.0/level4/当.svg",
    "caption": "khi, lúc"
  },
  "当时": {
    "file": "当时.svg",
    "src": "images/HSK_2.0/level4/当时.svg",
    "caption": "lúc đó, khi đó"
  },
  "刀": {
    "file": "刀.svg",
    "src": "images/HSK_2.0/level4/刀.svg",
    "caption": "dao"
  },
  "导游": {
    "file": "导游.svg",
    "src": "images/HSK_2.0/level4/导游.svg",
    "caption": "hướng dẫn viên du lịch"
  },
  "倒": {
    "file": "倒.svg",
    "src": "images/HSK_2.0/level4/倒.svg",
    "caption": "đổ, lật ngược"
  },
  "到处": {
    "file": "到处.svg",
    "src": "images/HSK_2.0/level4/到处.svg",
    "caption": "khắp nơi"
  },
  "到底": {
    "file": "到底.svg",
    "src": "images/HSK_2.0/level4/到底.svg",
    "caption": "rốt cuộc"
  },
  "道歉": {
    "file": "道歉.svg",
    "src": "images/HSK_2.0/level4/道歉.svg",
    "caption": "xin lỗi"
  },
  "得意": {
    "file": "得意.svg",
    "src": "images/HSK_2.0/level4/得意.svg",
    "caption": "tự đắc, hài lòng"
  },
  "地点": {
    "file": "地点.svg",
    "src": "images/HSK_2.0/level4/地点.svg",
    "caption": "địa điểm"
  },
  "得（助动词）": {
    "file": "得（助动词）.svg",
    "src": "images/HSK_2.0/level4/得（助动词）.svg",
    "caption": "phải, cần"
  },
  "登机牌": {
    "file": "登机牌.svg",
    "src": "images/HSK_2.0/level4/登机牌.svg",
    "caption": "thẻ lên máy bay"
  },
  "等（动）": {
    "file": "等（动）.svg",
    "src": "images/HSK_2.0/level4/等（动）.svg",
    "caption": "đợi, chờ"
  },
  "低": {
    "file": "低.svg",
    "src": "images/HSK_2.0/level4/低.svg",
    "caption": "thấp"
  },
  "底": {
    "file": "底.svg",
    "src": "images/HSK_2.0/level4/底.svg",
    "caption": "đáy"
  },
  "地球": {
    "file": "地球.svg",
    "src": "images/HSK_2.0/level4/地球.svg",
    "caption": "địa cầu, Trái Đất"
  },
  "地址": {
    "file": "地址.svg",
    "src": "images/HSK_2.0/level4/地址.svg",
    "caption": "địa chỉ"
  },
  "掉": {
    "file": "掉.svg",
    "src": "images/HSK_2.0/level4/掉.svg",
    "caption": "rơi, mất"
  },
  "调查": {
    "file": "调查.svg",
    "src": "images/HSK_2.0/level4/调查.svg",
    "caption": "điều tra"
  },
  "丢": {
    "file": "丢.svg",
    "src": "images/HSK_2.0/level4/丢.svg",
    "caption": "mất, đánh mất"
  },
  "动作": {
    "file": "动作.svg",
    "src": "images/HSK_2.0/level4/动作.svg",
    "caption": "động tác"
  },
  "堵车": {
    "file": "堵车.svg",
    "src": "images/HSK_2.0/level4/堵车.svg",
    "caption": "tắc đường"
  },
  "肚子": {
    "file": "肚子.svg",
    "src": "images/HSK_2.0/level4/肚子.svg",
    "caption": "bụng"
  },
  "短信": {
    "file": "短信.svg",
    "src": "images/HSK_2.0/level4/短信.svg",
    "caption": "tin nhắn"
  },
  "对于": {
    "file": "对于.svg",
    "src": "images/HSK_2.0/level4/对于.svg",
    "caption": "đối với"
  },
  "对话": {
    "file": "对话.svg",
    "src": "images/HSK_2.0/level4/对话.svg",
    "caption": "đối thoại"
  },
  "对面": {
    "file": "对面.svg",
    "src": "images/HSK_2.0/level4/对面.svg",
    "caption": "đối diện"
  },
  "而": {
    "file": "而.svg",
    "src": "images/HSK_2.0/level4/而.svg",
    "caption": "mà, và"
  },
  "儿童": {
    "file": "儿童.svg",
    "src": "images/HSK_2.0/level4/儿童.svg",
    "caption": "trẻ em"
  },
  "发生": {
    "file": "发生.svg",
    "src": "images/HSK_2.0/level4/发生.svg",
    "caption": "phát sinh, xảy ra"
  },
  "发展": {
    "file": "发展.svg",
    "src": "images/HSK_2.0/level4/发展.svg",
    "caption": "phát triển"
  },
  "法律": {
    "file": "法律.svg",
    "src": "images/HSK_2.0/level4/法律.svg",
    "caption": "pháp luật"
  },
  "翻译": {
    "file": "翻译.svg",
    "src": "images/HSK_2.0/level4/翻译.svg",
    "caption": "dịch, phiên dịch"
  },
  "烦恼": {
    "file": "烦恼.svg",
    "src": "images/HSK_2.0/level4/烦恼.svg",
    "caption": "phiền muộn"
  },
  "反对": {
    "file": "反对.svg",
    "src": "images/HSK_2.0/level4/反对.svg",
    "caption": "phản đối"
  },
  "方法": {
    "file": "方法.svg",
    "src": "images/HSK_2.0/level4/方法.svg",
    "caption": "phương pháp"
  },
  "方面": {
    "file": "方面.svg",
    "src": "images/HSK_2.0/level4/方面.svg",
    "caption": "phương diện, mặt"
  },
  "方向": {
    "file": "方向.svg",
    "src": "images/HSK_2.0/level4/方向.svg",
    "caption": "phương hướng"
  },
  "房东": {
    "file": "房东.svg",
    "src": "images/HSK_2.0/level4/房东.svg",
    "caption": "chủ nhà"
  },
  "放弃": {
    "file": "放弃.svg",
    "src": "images/HSK_2.0/level4/放弃.svg",
    "caption": "từ bỏ"
  },
  "放暑假": {
    "file": "放暑假.svg",
    "src": "images/HSK_2.0/level4/放暑假.svg",
    "caption": "nghỉ hè"
  },
  "放松": {
    "file": "放松.svg",
    "src": "images/HSK_2.0/level4/放松.svg",
    "caption": "thư giãn, thả lỏng"
  },
  "份": {
    "file": "份.svg",
    "src": "images/HSK_2.0/level4/份.svg",
    "caption": "phần (lượng từ)"
  },
  "丰富": {
    "file": "丰富.svg",
    "src": "images/HSK_2.0/level4/丰富.svg",
    "caption": "phong phú"
  },
  "否则": {
    "file": "否则.svg",
    "src": "images/HSK_2.0/level4/否则.svg",
    "caption": "nếu không thì"
  },
  "符合": {
    "file": "符合.svg",
    "src": "images/HSK_2.0/level4/符合.svg",
    "caption": "phù hợp, đúng với"
  },
  "富": {
    "file": "富.svg",
    "src": "images/HSK_2.0/level4/富.svg",
    "caption": "giàu"
  },
  "付款": {
    "file": "付款.svg",
    "src": "images/HSK_2.0/level4/付款.svg",
    "caption": "trả tiền"
  },
  "父亲": {
    "file": "父亲.svg",
    "src": "images/HSK_2.0/level4/父亲.svg",
    "caption": "cha"
  },
  "复印": {
    "file": "复印.svg",
    "src": "images/HSK_2.0/level4/复印.svg",
    "caption": "sao chụp, photocopy"
  },
  "复杂": {
    "file": "复杂.svg",
    "src": "images/HSK_2.0/level4/复杂.svg",
    "caption": "phức tạp"
  },
  "负责": {
    "file": "负责.svg",
    "src": "images/HSK_2.0/level4/负责.svg",
    "caption": "chịu trách nhiệm"
  },
  "改变": {
    "file": "改变.svg",
    "src": "images/HSK_2.0/level4/改变.svg",
    "caption": "thay đổi"
  },
  "干杯": {
    "file": "干杯.svg",
    "src": "images/HSK_2.0/level4/干杯.svg",
    "caption": "cạn ly"
  },
  "赶": {
    "file": "赶.svg",
    "src": "images/HSK_2.0/level4/赶.svg",
    "caption": "đuổi theo, kịp"
  },
  "敢": {
    "file": "敢.svg",
    "src": "images/HSK_2.0/level4/敢.svg",
    "caption": "dám"
  },
  "感动": {
    "file": "感动.svg",
    "src": "images/HSK_2.0/level4/感动.svg",
    "caption": "cảm động"
  },
  "感觉": {
    "file": "感觉.svg",
    "src": "images/HSK_2.0/level4/感觉.svg",
    "caption": "cảm giác"
  },
  "感情": {
    "file": "感情.svg",
    "src": "images/HSK_2.0/level4/感情.svg",
    "caption": "cảm tình, tình cảm"
  },
  "感谢": {
    "file": "感谢.svg",
    "src": "images/HSK_2.0/level4/感谢.svg",
    "caption": "cảm tạ, biết ơn"
  },
  "干": {
    "file": "干.svg",
    "src": "images/HSK_2.0/level4/干.svg",
    "caption": "khô"
  },
  "刚": {
    "file": "刚.svg",
    "src": "images/HSK_2.0/level4/刚.svg",
    "caption": "vừa mới"
  },
  "高速公路": {
    "file": "高速公路.svg",
    "src": "images/HSK_2.0/level4/高速公路.svg",
    "caption": "đường cao tốc"
  },
  "胳膊": {
    "file": "胳膊.svg",
    "src": "images/HSK_2.0/level4/胳膊.svg",
    "caption": "cánh tay"
  },
  "各": {
    "file": "各.svg",
    "src": "images/HSK_2.0/level4/各.svg",
    "caption": "mỗi, từng"
  },
  "公里": {
    "file": "公里.svg",
    "src": "images/HSK_2.0/level4/公里.svg",
    "caption": "kilômét"
  },
  "工资": {
    "file": "工资.svg",
    "src": "images/HSK_2.0/level4/工资.svg",
    "caption": "lương"
  },
  "功夫": {
    "file": "功夫.svg",
    "src": "images/HSK_2.0/level4/功夫.svg",
    "caption": "công phu (võ thuật/kỹ năng)"
  },
  "共同": {
    "file": "共同.svg",
    "src": "images/HSK_2.0/level4/共同.svg",
    "caption": "chung, cùng nhau"
  },
  "够": {
    "file": "够.svg",
    "src": "images/HSK_2.0/level4/够.svg",
    "caption": "đủ"
  },
  "购物": {
    "file": "购物.svg",
    "src": "images/HSK_2.0/level4/购物.svg",
    "caption": "mua sắm"
  },
  "估计": {
    "file": "估计.svg",
    "src": "images/HSK_2.0/level4/估计.svg",
    "caption": "ước tính"
  },
  "鼓励": {
    "file": "鼓励.svg",
    "src": "images/HSK_2.0/level4/鼓励.svg",
    "caption": "khuyến khích, động viên"
  },
  "顾客": {
    "file": "顾客.svg",
    "src": "images/HSK_2.0/level4/顾客.svg",
    "caption": "khách hàng"
  },
  "故意": {
    "file": "故意.svg",
    "src": "images/HSK_2.0/level4/故意.svg",
    "caption": "cố ý"
  },
  "挂": {
    "file": "挂.svg",
    "src": "images/HSK_2.0/level4/挂.svg",
    "caption": "treo"
  },
  "关键": {
    "file": "关键.svg",
    "src": "images/HSK_2.0/level4/关键.svg",
    "caption": "mấu chốt, then chốt"
  },
  "观众": {
    "file": "观众.svg",
    "src": "images/HSK_2.0/level4/观众.svg",
    "caption": "khán giả"
  },
  "管理": {
    "file": "管理.svg",
    "src": "images/HSK_2.0/level4/管理.svg",
    "caption": "quản lý"
  },
  "光": {
    "file": "光.svg",
    "src": "images/HSK_2.0/level4/光.svg",
    "caption": "ánh sáng"
  },
  "广播": {
    "file": "广播.svg",
    "src": "images/HSK_2.0/level4/广播.svg",
    "caption": "phát thanh"
  },
  "广告": {
    "file": "广告.svg",
    "src": "images/HSK_2.0/level4/广告.svg",
    "caption": "quảng cáo"
  },
  "逛": {
    "file": "逛.svg",
    "src": "images/HSK_2.0/level4/逛.svg",
    "caption": "đi dạo, đi rong"
  },
  "规定": {
    "file": "规定.svg",
    "src": "images/HSK_2.0/level4/规定.svg",
    "caption": "quy định"
  },
  "国际": {
    "file": "国际.svg",
    "src": "images/HSK_2.0/level4/国际.svg",
    "caption": "quốc tế"
  },
  "国籍": {
    "file": "国籍.svg",
    "src": "images/HSK_2.0/level4/国籍.svg",
    "caption": "quốc tịch"
  },
  "果汁": {
    "file": "果汁.svg",
    "src": "images/HSK_2.0/level4/果汁.svg",
    "caption": "nước ép trái cây"
  },
  "过程": {
    "file": "过程.svg",
    "src": "images/HSK_2.0/level4/过程.svg",
    "caption": "quá trình"
  },
  "海洋": {
    "file": "海洋.svg",
    "src": "images/HSK_2.0/level4/海洋.svg",
    "caption": "biển, đại dương"
  },
  "害羞": {
    "file": "害羞.svg",
    "src": "images/HSK_2.0/level4/害羞.svg",
    "caption": "xấu hổ, e thẹn"
  },
  "寒假": {
    "file": "寒假.svg",
    "src": "images/HSK_2.0/level4/寒假.svg",
    "caption": "nghỉ đông"
  },
  "汗": {
    "file": "汗.svg",
    "src": "images/HSK_2.0/level4/汗.svg",
    "caption": "mồ hôi"
  },
  "航班": {
    "file": "航班.svg",
    "src": "images/HSK_2.0/level4/航班.svg",
    "caption": "chuyến bay"
  },
  "好处": {
    "file": "好处.svg",
    "src": "images/HSK_2.0/level4/好处.svg",
    "caption": "lợi ích, điểm tốt"
  },
  "好像": {
    "file": "好像.svg",
    "src": "images/HSK_2.0/level4/好像.svg",
    "caption": "dường như, giống như"
  },
  "号码": {
    "file": "号码.svg",
    "src": "images/HSK_2.0/level4/号码.svg",
    "caption": "số (điện thoại, mã...)"
  },
  "合格": {
    "file": "合格.svg",
    "src": "images/HSK_2.0/level4/合格.svg",
    "caption": "đạt tiêu chuẩn, đủ tiêu chuẩn"
  },
  "合适": {
    "file": "合适.svg",
    "src": "images/HSK_2.0/level4/合适.svg",
    "caption": "phù hợp, thích hợp"
  },
  "盒子": {
    "file": "盒子.svg",
    "src": "images/HSK_2.0/level4/盒子.svg",
    "caption": "cái hộp"
  },
  "厚": {
    "file": "厚.svg",
    "src": "images/HSK_2.0/level4/厚.svg",
    "caption": "dày"
  },
  "后悔": {
    "file": "后悔.svg",
    "src": "images/HSK_2.0/level4/后悔.svg",
    "caption": "hối hận"
  },
  "护士": {
    "file": "护士.svg",
    "src": "images/HSK_2.0/level4/护士.svg",
    "caption": "y tá"
  },
  "互联网": {
    "file": "互联网.svg",
    "src": "images/HSK_2.0/level4/互联网.svg",
    "caption": "internet"
  },
  "互相": {
    "file": "互相.svg",
    "src": "images/HSK_2.0/level4/互相.svg",
    "caption": "lẫn nhau, qua lại"
  },
  "怀疑": {
    "file": "怀疑.svg",
    "src": "images/HSK_2.0/level4/怀疑.svg",
    "caption": "nghi ngờ"
  },
  "回忆": {
    "file": "回忆.svg",
    "src": "images/HSK_2.0/level4/回忆.svg",
    "caption": "hồi tưởng, hồi ức"
  },
  "活动": {
    "file": "活动.svg",
    "src": "images/HSK_2.0/level4/活动.svg",
    "caption": "hoạt động"
  },
  "活泼": {
    "file": "活泼.svg",
    "src": "images/HSK_2.0/level4/活泼.svg",
    "caption": "hoạt bát, năng động"
  },
  "火": {
    "file": "火.svg",
    "src": "images/HSK_2.0/level4/火.svg",
    "caption": "lửa"
  },
  "获得": {
    "file": "获得.svg",
    "src": "images/HSK_2.0/level4/获得.svg",
    "caption": "đạt được, giành được"
  },
  "基础": {
    "file": "基础.svg",
    "src": "images/HSK_2.0/level4/基础.svg",
    "caption": "cơ sở, nền tảng"
  },
  "激动": {
    "file": "激动.svg",
    "src": "images/HSK_2.0/level4/激动.svg",
    "caption": "kích động, xúc động"
  },
  "积极": {
    "file": "积极.svg",
    "src": "images/HSK_2.0/level4/积极.svg",
    "caption": "tích cực"
  },
  "积累": {
    "file": "积累.svg",
    "src": "images/HSK_2.0/level4/积累.svg",
    "caption": "tích lũy"
  },
  "及时": {
    "file": "及时.svg",
    "src": "images/HSK_2.0/level4/及时.svg",
    "caption": "kịp thời"
  },
  "即使": {
    "file": "即使.svg",
    "src": "images/HSK_2.0/level4/即使.svg",
    "caption": "cho dù, dù"
  },
  "寄": {
    "file": "寄.svg",
    "src": "images/HSK_2.0/level4/寄.svg",
    "caption": "gửi (thư, hàng...)"
  },
  "记者": {
    "file": "记者.svg",
    "src": "images/HSK_2.0/level4/记者.svg",
    "caption": "nhà báo, phóng viên"
  },
  "计划": {
    "file": "计划.svg",
    "src": "images/HSK_2.0/level4/计划.svg",
    "caption": "kế hoạch"
  },
  "既然": {
    "file": "既然.svg",
    "src": "images/HSK_2.0/level4/既然.svg",
    "caption": "đã như thế thì"
  },
  "技术": {
    "file": "技术.svg",
    "src": "images/HSK_2.0/level4/技术.svg",
    "caption": "kỹ thuật"
  },
  "继续": {
    "file": "继续.svg",
    "src": "images/HSK_2.0/level4/继续.svg",
    "caption": "tiếp tục"
  },
  "家具": {
    "file": "家具.svg",
    "src": "images/HSK_2.0/level4/家具.svg",
    "caption": "đồ nội thất"
  },
  "加班": {
    "file": "加班.svg",
    "src": "images/HSK_2.0/level4/加班.svg",
    "caption": "làm thêm giờ"
  },
  "加油站": {
    "file": "加油站.svg",
    "src": "images/HSK_2.0/level4/加油站.svg",
    "caption": "trạm xăng"
  },
  "假": {
    "file": "假.svg",
    "src": "images/HSK_2.0/level4/假.svg",
    "caption": "giả"
  },
  "价格": {
    "file": "价格.svg",
    "src": "images/HSK_2.0/level4/价格.svg",
    "caption": "giá cả"
  },
  "坚持": {
    "file": "坚持.svg",
    "src": "images/HSK_2.0/level4/坚持.svg",
    "caption": "kiên trì"
  },
  "减肥": {
    "file": "减肥.svg",
    "src": "images/HSK_2.0/level4/减肥.svg",
    "caption": "giảm cân"
  },
  "减少": {
    "file": "减少.svg",
    "src": "images/HSK_2.0/level4/减少.svg",
    "caption": "giảm thiểu"
  },
  "建议": {
    "file": "建议.svg",
    "src": "images/HSK_2.0/level4/建议.svg",
    "caption": "đề nghị, gợi ý"
  },
  "将来": {
    "file": "将来.svg",
    "src": "images/HSK_2.0/level4/将来.svg",
    "caption": "tương lai"
  },
  "奖金": {
    "file": "奖金.svg",
    "src": "images/HSK_2.0/level4/奖金.svg",
    "caption": "tiền thưởng"
  },
  "降低": {
    "file": "降低.svg",
    "src": "images/HSK_2.0/level4/降低.svg",
    "caption": "hạ thấp, giảm xuống"
  },
  "降落": {
    "file": "降落.svg",
    "src": "images/HSK_2.0/level4/降落.svg",
    "caption": "hạ cánh"
  },
  "交": {
    "file": "交.svg",
    "src": "images/HSK_2.0/level4/交.svg",
    "caption": "giao, đưa"
  },
  "交流": {
    "file": "交流.svg",
    "src": "images/HSK_2.0/level4/交流.svg",
    "caption": "giao lưu, trao đổi"
  },
  "交通": {
    "file": "交通.svg",
    "src": "images/HSK_2.0/level4/交通.svg",
    "caption": "giao thông"
  },
  "郊区": {
    "file": "郊区.svg",
    "src": "images/HSK_2.0/level4/郊区.svg",
    "caption": "ngoại ô"
  },
  "骄傲": {
    "file": "骄傲.svg",
    "src": "images/HSK_2.0/level4/骄傲.svg",
    "caption": "kiêu ngạo, tự hào"
  },
  "饺子": {
    "file": "饺子.svg",
    "src": "images/HSK_2.0/level4/饺子.svg",
    "caption": "bánh chẻo"
  },
  "教授": {
    "file": "教授.svg",
    "src": "images/HSK_2.0/level4/教授.svg",
    "caption": "giáo sư"
  },
  "教育": {
    "file": "教育.svg",
    "src": "images/HSK_2.0/level4/教育.svg",
    "caption": "giáo dục"
  },
  "接受": {
    "file": "接受.svg",
    "src": "images/HSK_2.0/level4/接受.svg",
    "caption": "tiếp nhận, chấp nhận"
  },
  "接着": {
    "file": "接着.svg",
    "src": "images/HSK_2.0/level4/接着.svg",
    "caption": "tiếp theo"
  },
  "结果": {
    "file": "结果.svg",
    "src": "images/HSK_2.0/level4/结果.svg",
    "caption": "kết quả"
  },
  "节": {
    "file": "节.svg",
    "src": "images/HSK_2.0/level4/节.svg",
    "caption": "đoạn, ngày lễ (lượng từ)"
  },
  "节约": {
    "file": "节约.svg",
    "src": "images/HSK_2.0/level4/节约.svg",
    "caption": "tiết kiệm"
  },
  "解释": {
    "file": "解释.svg",
    "src": "images/HSK_2.0/level4/解释.svg",
    "caption": "giải thích"
  },
  "尽管": {
    "file": "尽管.svg",
    "src": "images/HSK_2.0/level4/尽管.svg",
    "caption": "mặc dù"
  },
  "紧张": {
    "file": "紧张.svg",
    "src": "images/HSK_2.0/level4/紧张.svg",
    "caption": "căng thẳng, hồi hộp"
  },
  "进行": {
    "file": "进行.svg",
    "src": "images/HSK_2.0/level4/进行.svg",
    "caption": "tiến hành"
  },
  "禁止": {
    "file": "禁止.svg",
    "src": "images/HSK_2.0/level4/禁止.svg",
    "caption": "cấm, ngăn cấm"
  },
  "精彩": {
    "file": "精彩.svg",
    "src": "images/HSK_2.0/level4/精彩.svg",
    "caption": "hay, đặc sắc"
  },
  "经济": {
    "file": "经济.svg",
    "src": "images/HSK_2.0/level4/经济.svg",
    "caption": "kinh tế"
  },
  "经历": {
    "file": "经历.svg",
    "src": "images/HSK_2.0/level4/经历.svg",
    "caption": "trải qua, kinh nghiệm trải qua"
  },
  "经验": {
    "file": "经验.svg",
    "src": "images/HSK_2.0/level4/经验.svg",
    "caption": "kinh nghiệm"
  },
  "京剧": {
    "file": "京剧.svg",
    "src": "images/HSK_2.0/level4/京剧.svg",
    "caption": "Kinh kịch (kịch Bắc Kinh)"
  },
  "警察": {
    "file": "警察.svg",
    "src": "images/HSK_2.0/level4/警察.svg",
    "caption": "cảnh sát"
  },
  "景色": {
    "file": "景色.svg",
    "src": "images/HSK_2.0/level4/景色.svg",
    "caption": "cảnh sắc, phong cảnh"
  },
  "竟然": {
    "file": "竟然.svg",
    "src": "images/HSK_2.0/level4/竟然.svg",
    "caption": "lại, không ngờ là"
  },
  "竞争": {
    "file": "竞争.svg",
    "src": "images/HSK_2.0/level4/竞争.svg",
    "caption": "cạnh tranh"
  },
  "镜子": {
    "file": "镜子.svg",
    "src": "images/HSK_2.0/level4/镜子.svg",
    "caption": "cái gương"
  },
  "究竟": {
    "file": "究竟.svg",
    "src": "images/HSK_2.0/level4/究竟.svg",
    "caption": "rốt cuộc, cuối cùng"
  },
  "举": {
    "file": "举.svg",
    "src": "images/HSK_2.0/level4/举.svg",
    "caption": "nhấc, giơ lên"
  },
  "举办": {
    "file": "举办.svg",
    "src": "images/HSK_2.0/level4/举办.svg",
    "caption": "tổ chức"
  },
  "举行": {
    "file": "举行.svg",
    "src": "images/HSK_2.0/level4/举行.svg",
    "caption": "cử hành, tổ chức"
  },
  "拒绝": {
    "file": "拒绝.svg",
    "src": "images/HSK_2.0/level4/拒绝.svg",
    "caption": "từ chối"
  },
  "距离": {
    "file": "距离.svg",
    "src": "images/HSK_2.0/level4/距离.svg",
    "caption": "khoảng cách"
  },
  "聚会": {
    "file": "聚会.svg",
    "src": "images/HSK_2.0/level4/聚会.svg",
    "caption": "tiệc gặp mặt, buổi họp mặt"
  },
  "开玩笑": {
    "file": "开玩笑.svg",
    "src": "images/HSK_2.0/level4/开玩笑.svg",
    "caption": "đùa cợt, nói đùa"
  },
  "开心": {
    "file": "开心.svg",
    "src": "images/HSK_2.0/level4/开心.svg",
    "caption": "vui vẻ"
  },
  "看法": {
    "file": "看法.svg",
    "src": "images/HSK_2.0/level4/看法.svg",
    "caption": "quan điểm, cách nhìn"
  },
  "考虑": {
    "file": "考虑.svg",
    "src": "images/HSK_2.0/level4/考虑.svg",
    "caption": "xem xét, suy nghĩ"
  },
  "烤鸭": {
    "file": "烤鸭.svg",
    "src": "images/HSK_2.0/level4/烤鸭.svg",
    "caption": "vịt nướng"
  },
  "棵": {
    "file": "棵.svg",
    "src": "images/HSK_2.0/level4/棵.svg",
    "caption": "cây (lượng từ)"
  },
  "科学": {
    "file": "科学.svg",
    "src": "images/HSK_2.0/level4/科学.svg",
    "caption": "khoa học"
  },
  "咳嗽": {
    "file": "咳嗽.svg",
    "src": "images/HSK_2.0/level4/咳嗽.svg",
    "caption": "ho"
  },
  "可怜": {
    "file": "可怜.svg",
    "src": "images/HSK_2.0/level4/可怜.svg",
    "caption": "đáng thương"
  },
  "可是": {
    "file": "可是.svg",
    "src": "images/HSK_2.0/level4/可是.svg",
    "caption": "nhưng mà"
  },
  "可惜": {
    "file": "可惜.svg",
    "src": "images/HSK_2.0/level4/可惜.svg",
    "caption": "đáng tiếc"
  },
  "客厅": {
    "file": "客厅.svg",
    "src": "images/HSK_2.0/level4/客厅.svg",
    "caption": "phòng khách"
  },
  "肯定": {
    "file": "肯定.svg",
    "src": "images/HSK_2.0/level4/肯定.svg",
    "caption": "khẳng định, chắc chắn"
  },
  "空": {
    "file": "空.svg",
    "src": "images/HSK_2.0/level4/空.svg",
    "caption": "trống, rỗng"
  },
  "空气": {
    "file": "空气.svg",
    "src": "images/HSK_2.0/level4/空气.svg",
    "caption": "không khí"
  },
  "恐怕": {
    "file": "恐怕.svg",
    "src": "images/HSK_2.0/level4/恐怕.svg",
    "caption": "sợ rằng, e là"
  },
  "苦": {
    "file": "苦.svg",
    "src": "images/HSK_2.0/level4/苦.svg",
    "caption": "đắng, khổ"
  },
  "矿泉水": {
    "file": "矿泉水.svg",
    "src": "images/HSK_2.0/level4/矿泉水.svg",
    "caption": "nước khoáng"
  },
  "困": {
    "file": "困.svg",
    "src": "images/HSK_2.0/level4/困.svg",
    "caption": "buồn ngủ, mệt"
  },
  "困难": {
    "file": "困难.svg",
    "src": "images/HSK_2.0/level4/困难.svg",
    "caption": "khó khăn"
  },
  "拉": {
    "file": "拉.svg",
    "src": "images/HSK_2.0/level4/拉.svg",
    "caption": "kéo"
  },
  "垃圾桶": {
    "file": "垃圾桶.svg",
    "src": "images/HSK_2.0/level4/垃圾桶.svg",
    "caption": "thùng rác"
  },
  "辣": {
    "file": "辣.svg",
    "src": "images/HSK_2.0/level4/辣.svg",
    "caption": "cay"
  },
  "来自": {
    "file": "来自.svg",
    "src": "images/HSK_2.0/level4/来自.svg",
    "caption": "đến từ"
  },
  "来不及": {
    "file": "来不及.svg",
    "src": "images/HSK_2.0/level4/来不及.svg",
    "caption": "không kịp"
  },
  "来得及": {
    "file": "来得及.svg",
    "src": "images/HSK_2.0/level4/来得及.svg",
    "caption": "còn kịp"
  },
  "懒": {
    "file": "懒.svg",
    "src": "images/HSK_2.0/level4/懒.svg",
    "caption": "lười"
  },
  "浪费": {
    "file": "浪费.svg",
    "src": "images/HSK_2.0/level4/浪费.svg",
    "caption": "lãng phí"
  },
  "浪漫": {
    "file": "浪漫.svg",
    "src": "images/HSK_2.0/level4/浪漫.svg",
    "caption": "lãng mạn"
  },
  "老虎": {
    "file": "老虎.svg",
    "src": "images/HSK_2.0/level4/老虎.svg",
    "caption": "con hổ"
  },
  "冷静": {
    "file": "冷静.svg",
    "src": "images/HSK_2.0/level4/冷静.svg",
    "caption": "bình tĩnh"
  },
  "理发": {
    "file": "理发.svg",
    "src": "images/HSK_2.0/level4/理发.svg",
    "caption": "cắt tóc"
  },
  "理解": {
    "file": "理解.svg",
    "src": "images/HSK_2.0/level4/理解.svg",
    "caption": "lý giải, hiểu"
  },
  "理想": {
    "file": "理想.svg",
    "src": "images/HSK_2.0/level4/理想.svg",
    "caption": "lý tưởng"
  },
  "礼貌": {
    "file": "礼貌.svg",
    "src": "images/HSK_2.0/level4/礼貌.svg",
    "caption": "lễ độ, phép tắc"
  },
  "礼拜天": {
    "file": "礼拜天.svg",
    "src": "images/HSK_2.0/level4/礼拜天.svg",
    "caption": "ngày chủ nhật"
  },
  "厉害": {
    "file": "厉害.svg",
    "src": "images/HSK_2.0/level4/厉害.svg",
    "caption": "ghê gớm, lợi hại"
  },
  "力气": {
    "file": "力气.svg",
    "src": "images/HSK_2.0/level4/力气.svg",
    "caption": "sức lực"
  },
  "例如": {
    "file": "例如.svg",
    "src": "images/HSK_2.0/level4/例如.svg",
    "caption": "ví dụ như"
  },
  "俩": {
    "file": "俩.svg",
    "src": "images/HSK_2.0/level4/俩.svg",
    "caption": "hai (người)"
  },
  "连": {
    "file": "连.svg",
    "src": "images/HSK_2.0/level4/连.svg",
    "caption": "liên tiếp, ngay cả"
  },
  "联系": {
    "file": "联系.svg",
    "src": "images/HSK_2.0/level4/联系.svg",
    "caption": "liên hệ"
  },
  "凉快": {
    "file": "凉快.svg",
    "src": "images/HSK_2.0/level4/凉快.svg",
    "caption": "mát mẻ"
  },
  "零钱": {
    "file": "零钱.svg",
    "src": "images/HSK_2.0/level4/零钱.svg",
    "caption": "tiền lẻ"
  },
  "另外": {
    "file": "另外.svg",
    "src": "images/HSK_2.0/level4/另外.svg",
    "caption": "ngoài ra"
  },
  "留": {
    "file": "留.svg",
    "src": "images/HSK_2.0/level4/留.svg",
    "caption": "ở lại, lưu lại"
  },
  "流利": {
    "file": "流利.svg",
    "src": "images/HSK_2.0/level4/流利.svg",
    "caption": "trôi chảy, lưu loát"
  },
  "流行": {
    "file": "流行.svg",
    "src": "images/HSK_2.0/level4/流行.svg",
    "caption": "phổ biến, thịnh hành"
  },
  "乱": {
    "file": "乱.svg",
    "src": "images/HSK_2.0/level4/乱.svg",
    "caption": "lộn xộn, hỗn loạn"
  },
  "旅行": {
    "file": "旅行.svg",
    "src": "images/HSK_2.0/level4/旅行.svg",
    "caption": "du lịch"
  },
  "律师": {
    "file": "律师.svg",
    "src": "images/HSK_2.0/level4/律师.svg",
    "caption": "luật sư"
  },
  "麻烦": {
    "file": "麻烦.svg",
    "src": "images/HSK_2.0/level4/麻烦.svg",
    "caption": "phiền phức"
  },
  "马虎": {
    "file": "马虎.svg",
    "src": "images/HSK_2.0/level4/马虎.svg",
    "caption": "qua loa, cẩu thả"
  },
  "满": {
    "file": "满.svg",
    "src": "images/HSK_2.0/level4/满.svg",
    "caption": "đầy"
  },
  "毛": {
    "file": "毛.svg",
    "src": "images/HSK_2.0/level4/毛.svg",
    "caption": "lông; hào (tiền)"
  },
  "毛巾": {
    "file": "毛巾.svg",
    "src": "images/HSK_2.0/level4/毛巾.svg",
    "caption": "khăn mặt"
  },
  "美丽": {
    "file": "美丽.svg",
    "src": "images/HSK_2.0/level4/美丽.svg",
    "caption": "xinh đẹp"
  },
  "梦": {
    "file": "梦.svg",
    "src": "images/HSK_2.0/level4/梦.svg",
    "caption": "mơ, giấc mơ"
  },
  "迷路": {
    "file": "迷路.svg",
    "src": "images/HSK_2.0/level4/迷路.svg",
    "caption": "lạc đường"
  },
  "密码": {
    "file": "密码.svg",
    "src": "images/HSK_2.0/level4/密码.svg",
    "caption": "mật khẩu"
  },
  "免费": {
    "file": "免费.svg",
    "src": "images/HSK_2.0/level4/免费.svg",
    "caption": "miễn phí"
  },
  "秒": {
    "file": "秒.svg",
    "src": "images/HSK_2.0/level4/秒.svg",
    "caption": "giây"
  },
  "民族": {
    "file": "民族.svg",
    "src": "images/HSK_2.0/level4/民族.svg",
    "caption": "dân tộc"
  },
  "母亲": {
    "file": "母亲.svg",
    "src": "images/HSK_2.0/level4/母亲.svg",
    "caption": "mẹ"
  },
  "目的": {
    "file": "目的.svg",
    "src": "images/HSK_2.0/level4/目的.svg",
    "caption": "mục đích"
  },
  "耐心": {
    "file": "耐心.svg",
    "src": "images/HSK_2.0/level4/耐心.svg",
    "caption": "kiên nhẫn"
  },
  "难道": {
    "file": "难道.svg",
    "src": "images/HSK_2.0/level4/难道.svg",
    "caption": "chẳng lẽ"
  },
  "难受": {
    "file": "难受.svg",
    "src": "images/HSK_2.0/level4/难受.svg",
    "caption": "khó chịu, đau khổ"
  },
  "内": {
    "file": "内.svg",
    "src": "images/HSK_2.0/level4/内.svg",
    "caption": "trong, nội"
  },
  "内容": {
    "file": "内容.svg",
    "src": "images/HSK_2.0/level4/内容.svg",
    "caption": "nội dung"
  },
  "能力": {
    "file": "能力.svg",
    "src": "images/HSK_2.0/level4/能力.svg",
    "caption": "năng lực"
  },
  "年龄": {
    "file": "年龄.svg",
    "src": "images/HSK_2.0/level4/年龄.svg",
    "caption": "tuổi tác"
  },
  "弄": {
    "file": "弄.svg",
    "src": "images/HSK_2.0/level4/弄.svg",
    "caption": "làm, thao tác"
  },
  "暖和": {
    "file": "暖和.svg",
    "src": "images/HSK_2.0/level4/暖和.svg",
    "caption": "ấm áp"
  },
  "偶尔": {
    "file": "偶尔.svg",
    "src": "images/HSK_2.0/level4/偶尔.svg",
    "caption": "đôi khi, ngẫu nhiên"
  },
  "排队": {
    "file": "排队.svg",
    "src": "images/HSK_2.0/level4/排队.svg",
    "caption": "xếp hàng"
  },
  "排列": {
    "file": "排列.svg",
    "src": "images/HSK_2.0/level4/排列.svg",
    "caption": "xếp thành dãy, sắp xếp"
  },
  "判断": {
    "file": "判断.svg",
    "src": "images/HSK_2.0/level4/判断.svg",
    "caption": "phán đoán"
  },
  "陪": {
    "file": "陪.svg",
    "src": "images/HSK_2.0/level4/陪.svg",
    "caption": "đi cùng, tháp tùng"
  },
  "批评": {
    "file": "批评.svg",
    "src": "images/HSK_2.0/level4/批评.svg",
    "caption": "phê bình"
  },
  "皮肤": {
    "file": "皮肤.svg",
    "src": "images/HSK_2.0/level4/皮肤.svg",
    "caption": "da"
  },
  "脾气": {
    "file": "脾气.svg",
    "src": "images/HSK_2.0/level4/脾气.svg",
    "caption": "tính khí"
  },
  "篇": {
    "file": "篇.svg",
    "src": "images/HSK_2.0/level4/篇.svg",
    "caption": "bài, thiên (lượng từ)"
  },
  "骗": {
    "file": "骗.svg",
    "src": "images/HSK_2.0/level4/骗.svg",
    "caption": "lừa gạt"
  },
  "乒乓球": {
    "file": "乒乓球.svg",
    "src": "images/HSK_2.0/level4/乒乓球.svg",
    "caption": "bóng bàn"
  },
  "平时": {
    "file": "平时.svg",
    "src": "images/HSK_2.0/level4/平时.svg",
    "caption": "bình thường, hàng ngày"
  },
  "破": {
    "file": "破.svg",
    "src": "images/HSK_2.0/level4/破.svg",
    "caption": "hỏng, vỡ"
  },
  "葡萄": {
    "file": "葡萄.svg",
    "src": "images/HSK_2.0/level4/葡萄.svg",
    "caption": "quả nho"
  },
  "普遍": {
    "file": "普遍.svg",
    "src": "images/HSK_2.0/level4/普遍.svg",
    "caption": "phổ biến"
  },
  "普通话": {
    "file": "普通话.svg",
    "src": "images/HSK_2.0/level4/普通话.svg",
    "caption": "tiếng phổ thông (Trung Quốc)"
  },
  "其次": {
    "file": "其次.svg",
    "src": "images/HSK_2.0/level4/其次.svg",
    "caption": "thứ hai, tiếp theo"
  },
  "其中": {
    "file": "其中.svg",
    "src": "images/HSK_2.0/level4/其中.svg",
    "caption": "trong đó"
  },
  "气候": {
    "file": "气候.svg",
    "src": "images/HSK_2.0/level4/气候.svg",
    "caption": "khí hậu"
  },
  "千万": {
    "file": "千万.svg",
    "src": "images/HSK_2.0/level4/千万.svg",
    "caption": "nhất định, ngàn vạn lần"
  },
  "签证": {
    "file": "签证.svg",
    "src": "images/HSK_2.0/level4/签证.svg",
    "caption": "visa, thị thực"
  },
  "敲": {
    "file": "敲.svg",
    "src": "images/HSK_2.0/level4/敲.svg",
    "caption": "gõ, đập"
  },
  "桥": {
    "file": "桥.svg",
    "src": "images/HSK_2.0/level4/桥.svg",
    "caption": "cây cầu"
  },
  "巧克力": {
    "file": "巧克力.svg",
    "src": "images/HSK_2.0/level4/巧克力.svg",
    "caption": "sô-cô-la"
  },
  "亲戚": {
    "file": "亲戚.svg",
    "src": "images/HSK_2.0/level4/亲戚.svg",
    "caption": "người thân, họ hàng"
  },
  "轻": {
    "file": "轻.svg",
    "src": "images/HSK_2.0/level4/轻.svg",
    "caption": "nhẹ"
  },
  "轻松": {
    "file": "轻松.svg",
    "src": "images/HSK_2.0/level4/轻松.svg",
    "caption": "nhẹ nhõm, thoải mái"
  },
  "情况": {
    "file": "情况.svg",
    "src": "images/HSK_2.0/level4/情况.svg",
    "caption": "tình hình"
  },
  "穷": {
    "file": "穷.svg",
    "src": "images/HSK_2.0/level4/穷.svg",
    "caption": "nghèo"
  },
  "区别": {
    "file": "区别.svg",
    "src": "images/HSK_2.0/level4/区别.svg",
    "caption": "sự khác biệt"
  },
  "取": {
    "file": "取.svg",
    "src": "images/HSK_2.0/level4/取.svg",
    "caption": "lấy"
  },
  "全部": {
    "file": "全部.svg",
    "src": "images/HSK_2.0/level4/全部.svg",
    "caption": "toàn bộ"
  },
  "缺点": {
    "file": "缺点.svg",
    "src": "images/HSK_2.0/level4/缺点.svg",
    "caption": "khuyết điểm"
  },
  "缺少": {
    "file": "缺少.svg",
    "src": "images/HSK_2.0/level4/缺少.svg",
    "caption": "thiếu"
  },
  "却": {
    "file": "却.svg",
    "src": "images/HSK_2.0/level4/却.svg",
    "caption": "nhưng, lại"
  },
  "确实": {
    "file": "确实.svg",
    "src": "images/HSK_2.0/level4/确实.svg",
    "caption": "đích thực, đúng là"
  },
  "然而": {
    "file": "然而.svg",
    "src": "images/HSK_2.0/level4/然而.svg",
    "caption": "tuy nhiên"
  },
  "热闹": {
    "file": "热闹.svg",
    "src": "images/HSK_2.0/level4/热闹.svg",
    "caption": "náo nhiệt, nhộn nhịp"
  },
  "任何": {
    "file": "任何.svg",
    "src": "images/HSK_2.0/level4/任何.svg",
    "caption": "bất kỳ, mọi"
  },
  "任务": {
    "file": "任务.svg",
    "src": "images/HSK_2.0/level4/任务.svg",
    "caption": "nhiệm vụ"
  },
  "扔": {
    "file": "扔.svg",
    "src": "images/HSK_2.0/level4/扔.svg",
    "caption": "vứt, ném"
  },
  "仍然": {
    "file": "仍然.svg",
    "src": "images/HSK_2.0/level4/仍然.svg",
    "caption": "vẫn, vẫn còn"
  },
  "日记": {
    "file": "日记.svg",
    "src": "images/HSK_2.0/level4/日记.svg",
    "caption": "nhật ký"
  },
  "入口": {
    "file": "入口.svg",
    "src": "images/HSK_2.0/level4/入口.svg",
    "caption": "lối vào"
  },
  "散步": {
    "file": "散步.svg",
    "src": "images/HSK_2.0/level4/散步.svg",
    "caption": "đi bộ, đi dạo"
  },
  "森林": {
    "file": "森林.svg",
    "src": "images/HSK_2.0/level4/森林.svg",
    "caption": "rừng"
  },
  "沙发": {
    "file": "沙发.svg",
    "src": "images/HSK_2.0/level4/沙发.svg",
    "caption": "ghế sofa"
  },
  "商量": {
    "file": "商量.svg",
    "src": "images/HSK_2.0/level4/商量.svg",
    "caption": "thảo luận, bàn bạc"
  },
  "伤心": {
    "file": "伤心.svg",
    "src": "images/HSK_2.0/level4/伤心.svg",
    "caption": "buồn lòng, đau lòng"
  },
  "稍微": {
    "file": "稍微.svg",
    "src": "images/HSK_2.0/level4/稍微.svg",
    "caption": "một chút, hơi"
  },
  "勺子": {
    "file": "勺子.svg",
    "src": "images/HSK_2.0/level4/勺子.svg",
    "caption": "cái thìa"
  },
  "社会": {
    "file": "社会.svg",
    "src": "images/HSK_2.0/level4/社会.svg",
    "caption": "xã hội"
  },
  "深": {
    "file": "深.svg",
    "src": "images/HSK_2.0/level4/深.svg",
    "caption": "sâu"
  },
  "申请": {
    "file": "申请.svg",
    "src": "images/HSK_2.0/level4/申请.svg",
    "caption": "xin, đăng ký, nộp đơn"
  },
  "甚至": {
    "file": "甚至.svg",
    "src": "images/HSK_2.0/level4/甚至.svg",
    "caption": "thậm chí"
  },
  "生活": {
    "file": "生活.svg",
    "src": "images/HSK_2.0/level4/生活.svg",
    "caption": "sinh hoạt, cuộc sống"
  },
  "生命": {
    "file": "生命.svg",
    "src": "images/HSK_2.0/level4/生命.svg",
    "caption": "sinh mệnh, sự sống"
  },
  "生意": {
    "file": "生意.svg",
    "src": "images/HSK_2.0/level4/生意.svg",
    "caption": "việc buôn bán, kinh doanh"
  },
  "省": {
    "file": "省.svg",
    "src": "images/HSK_2.0/level4/省.svg",
    "caption": "tỉnh; tiết kiệm"
  },
  "剩": {
    "file": "剩.svg",
    "src": "images/HSK_2.0/level4/剩.svg",
    "caption": "còn lại"
  },
  "失败": {
    "file": "失败.svg",
    "src": "images/HSK_2.0/level4/失败.svg",
    "caption": "thất bại"
  },
  "失望": {
    "file": "失望.svg",
    "src": "images/HSK_2.0/level4/失望.svg",
    "caption": "thất vọng"
  },
  "师傅": {
    "file": "师傅.svg",
    "src": "images/HSK_2.0/level4/师傅.svg",
    "caption": "thầy, sư phụ (người thợ)"
  },
  "十分": {
    "file": "十分.svg",
    "src": "images/HSK_2.0/level4/十分.svg",
    "caption": "rất, mười phần"
  },
  "实际": {
    "file": "实际.svg",
    "src": "images/HSK_2.0/level4/实际.svg",
    "caption": "thực tế"
  },
  "实在": {
    "file": "实在.svg",
    "src": "images/HSK_2.0/level4/实在.svg",
    "caption": "thực sự, thật là"
  },
  "使": {
    "file": "使.svg",
    "src": "images/HSK_2.0/level4/使.svg",
    "caption": "làm cho, khiến cho"
  },
  "使用": {
    "file": "使用.svg",
    "src": "images/HSK_2.0/level4/使用.svg",
    "caption": "sử dụng"
  },
  "是否": {
    "file": "是否.svg",
    "src": "images/HSK_2.0/level4/是否.svg",
    "caption": "có... hay không"
  },
  "适合": {
    "file": "适合.svg",
    "src": "images/HSK_2.0/level4/适合.svg",
    "caption": "phù hợp"
  },
  "适应": {
    "file": "适应.svg",
    "src": "images/HSK_2.0/level4/适应.svg",
    "caption": "thích ứng"
  },
  "世纪": {
    "file": "世纪.svg",
    "src": "images/HSK_2.0/level4/世纪.svg",
    "caption": "thế kỷ"
  },
  "收": {
    "file": "收.svg",
    "src": "images/HSK_2.0/level4/收.svg",
    "caption": "thu, nhận"
  },
  "收入": {
    "file": "收入.svg",
    "src": "images/HSK_2.0/level4/收入.svg",
    "caption": "thu nhập"
  },
  "收拾": {
    "file": "收拾.svg",
    "src": "images/HSK_2.0/level4/收拾.svg",
    "caption": "thu dọn, sắp xếp"
  },
  "首都": {
    "file": "首都.svg",
    "src": "images/HSK_2.0/level4/首都.svg",
    "caption": "thủ đô"
  },
  "首先": {
    "file": "首先.svg",
    "src": "images/HSK_2.0/level4/首先.svg",
    "caption": "trước tiên, đầu tiên"
  },
  "受不了": {
    "file": "受不了.svg",
    "src": "images/HSK_2.0/level4/受不了.svg",
    "caption": "không chịu được"
  },
  "受到": {
    "file": "受到.svg",
    "src": "images/HSK_2.0/level4/受到.svg",
    "caption": "nhận được, bị (chịu)"
  },
  "售货员": {
    "file": "售货员.svg",
    "src": "images/HSK_2.0/level4/售货员.svg",
    "caption": "nhân viên bán hàng"
  },
  "输": {
    "file": "输.svg",
    "src": "images/HSK_2.0/level4/输.svg",
    "caption": "thua, thất bại"
  },
  "熟悉": {
    "file": "熟悉.svg",
    "src": "images/HSK_2.0/level4/熟悉.svg",
    "caption": "quen thuộc, thông thuộc"
  },
  "数量": {
    "file": "数量.svg",
    "src": "images/HSK_2.0/level4/数量.svg",
    "caption": "số lượng"
  },
  "数字": {
    "file": "数字.svg",
    "src": "images/HSK_2.0/level4/数字.svg",
    "caption": "số, chữ số"
  },
  "帅": {
    "file": "帅.svg",
    "src": "images/HSK_2.0/level4/帅.svg",
    "caption": "đẹp trai"
  },
  "顺便": {
    "file": "顺便.svg",
    "src": "images/HSK_2.0/level4/顺便.svg",
    "caption": "tiện thể, nhân tiện"
  },
  "顺利": {
    "file": "顺利.svg",
    "src": "images/HSK_2.0/level4/顺利.svg",
    "caption": "thuận lợi"
  },
  "顺序": {
    "file": "顺序.svg",
    "src": "images/HSK_2.0/level4/顺序.svg",
    "caption": "thứ tự, trình tự"
  },
  "说明": {
    "file": "说明.svg",
    "src": "images/HSK_2.0/level4/说明.svg",
    "caption": "giải thích, nói rõ"
  },
  "硕士": {
    "file": "硕士.svg",
    "src": "images/HSK_2.0/level4/硕士.svg",
    "caption": "thạc sĩ"
  },
  "死": {
    "file": "死.svg",
    "src": "images/HSK_2.0/level4/死.svg",
    "caption": "chết"
  },
  "速度": {
    "file": "速度.svg",
    "src": "images/HSK_2.0/level4/速度.svg",
    "caption": "tốc độ"
  },
  "塑料袋": {
    "file": "塑料袋.svg",
    "src": "images/HSK_2.0/level4/塑料袋.svg",
    "caption": "túi nhựa"
  },
  "酸": {
    "file": "酸.svg",
    "src": "images/HSK_2.0/level4/酸.svg",
    "caption": "chua"
  },
  "随便": {
    "file": "随便.svg",
    "src": "images/HSK_2.0/level4/随便.svg",
    "caption": "tùy ý, tùy tiện"
  },
  "随着": {
    "file": "随着.svg",
    "src": "images/HSK_2.0/level4/随着.svg",
    "caption": "theo cùng với"
  },
  "孙子": {
    "file": "孙子.svg",
    "src": "images/HSK_2.0/level4/孙子.svg",
    "caption": "cháu trai (nội)"
  },
  "所有": {
    "file": "所有.svg",
    "src": "images/HSK_2.0/level4/所有.svg",
    "caption": "tất cả, toàn bộ"
  },
  "台": {
    "file": "台.svg",
    "src": "images/HSK_2.0/level4/台.svg",
    "caption": "cái, bục, đài (lượng từ)"
  },
  "抬": {
    "file": "抬.svg",
    "src": "images/HSK_2.0/level4/抬.svg",
    "caption": "nâng lên, khiêng"
  },
  "态度": {
    "file": "态度.svg",
    "src": "images/HSK_2.0/level4/态度.svg",
    "caption": "thái độ"
  },
  "谈": {
    "file": "谈.svg",
    "src": "images/HSK_2.0/level4/谈.svg",
    "caption": "nói chuyện, bàn"
  },
  "弹钢琴": {
    "file": "弹钢琴.svg",
    "src": "images/HSK_2.0/level4/弹钢琴.svg",
    "caption": "chơi đàn piano"
  },
  "汤": {
    "file": "汤.svg",
    "src": "images/HSK_2.0/level4/汤.svg",
    "caption": "canh, súp"
  },
  "糖": {
    "file": "糖.svg",
    "src": "images/HSK_2.0/level4/糖.svg",
    "caption": "đường, kẹo"
  },
  "躺": {
    "file": "躺.svg",
    "src": "images/HSK_2.0/level4/躺.svg",
    "caption": "nằm"
  },
  "趟": {
    "file": "趟.svg",
    "src": "images/HSK_2.0/level4/趟.svg",
    "caption": "lượt, chuyến (lượng từ)"
  },
  "讨论": {
    "file": "讨论.svg",
    "src": "images/HSK_2.0/level4/讨论.svg",
    "caption": "thảo luận"
  },
  "讨厌": {
    "file": "讨厌.svg",
    "src": "images/HSK_2.0/level4/讨厌.svg",
    "caption": "ghét, đáng ghét"
  },
  "特点": {
    "file": "特点.svg",
    "src": "images/HSK_2.0/level4/特点.svg",
    "caption": "đặc điểm"
  },
  "提": {
    "file": "提.svg",
    "src": "images/HSK_2.0/level4/提.svg",
    "caption": "mang, xách; nêu ra"
  },
  "提供": {
    "file": "提供.svg",
    "src": "images/HSK_2.0/level4/提供.svg",
    "caption": "cung cấp"
  },
  "提前": {
    "file": "提前.svg",
    "src": "images/HSK_2.0/level4/提前.svg",
    "caption": "sớm hơn dự định, trước hạn"
  },
  "提醒": {
    "file": "提醒.svg",
    "src": "images/HSK_2.0/level4/提醒.svg",
    "caption": "nhắc nhở"
  },
  "填空": {
    "file": "填空.svg",
    "src": "images/HSK_2.0/level4/填空.svg",
    "caption": "điền vào chỗ trống"
  },
  "条件": {
    "file": "条件.svg",
    "src": "images/HSK_2.0/level4/条件.svg",
    "caption": "điều kiện"
  },
  "停": {
    "file": "停.svg",
    "src": "images/HSK_2.0/level4/停.svg",
    "caption": "ngừng, dừng"
  },
  "挺": {
    "file": "挺.svg",
    "src": "images/HSK_2.0/level4/挺.svg",
    "caption": "khá, rất"
  },
  "通过": {
    "file": "通过.svg",
    "src": "images/HSK_2.0/level4/通过.svg",
    "caption": "thông qua"
  },
  "通知": {
    "file": "通知.svg",
    "src": "images/HSK_2.0/level4/通知.svg",
    "caption": "thông báo"
  },
  "同时": {
    "file": "同时.svg",
    "src": "images/HSK_2.0/level4/同时.svg",
    "caption": "đồng thời"
  },
  "同情": {
    "file": "同情.svg",
    "src": "images/HSK_2.0/level4/同情.svg",
    "caption": "đồng cảm, thông cảm"
  },
  "推": {
    "file": "推.svg",
    "src": "images/HSK_2.0/level4/推.svg",
    "caption": "đẩy"
  },
  "推迟": {
    "file": "推迟.svg",
    "src": "images/HSK_2.0/level4/推迟.svg",
    "caption": "trì hoãn, lùi lại"
  },
  "脱": {
    "file": "脱.svg",
    "src": "images/HSK_2.0/level4/脱.svg",
    "caption": "cởi, tháo ra"
  },
  "袜子": {
    "file": "袜子.svg",
    "src": "images/HSK_2.0/level4/袜子.svg",
    "caption": "vớ, tất"
  },
  "完全": {
    "file": "完全.svg",
    "src": "images/HSK_2.0/level4/完全.svg",
    "caption": "hoàn toàn"
  },
  "往往": {
    "file": "往往.svg",
    "src": "images/HSK_2.0/level4/往往.svg",
    "caption": "thường thường"
  },
  "网球": {
    "file": "网球.svg",
    "src": "images/HSK_2.0/level4/网球.svg",
    "caption": "bóng tennis"
  },
  "网站": {
    "file": "网站.svg",
    "src": "images/HSK_2.0/level4/网站.svg",
    "caption": "trang web"
  },
  "危险": {
    "file": "危险.svg",
    "src": "images/HSK_2.0/level4/危险.svg",
    "caption": "nguy hiểm"
  },
  "味道": {
    "file": "味道.svg",
    "src": "images/HSK_2.0/level4/味道.svg",
    "caption": "mùi vị"
  },
  "卫生间": {
    "file": "卫生间.svg",
    "src": "images/HSK_2.0/level4/卫生间.svg",
    "caption": "nhà vệ sinh"
  },
  "温度": {
    "file": "温度.svg",
    "src": "images/HSK_2.0/level4/温度.svg",
    "caption": "nhiệt độ"
  },
  "文章": {
    "file": "文章.svg",
    "src": "images/HSK_2.0/level4/文章.svg",
    "caption": "bài viết, văn chương"
  },
  "污染": {
    "file": "污染.svg",
    "src": "images/HSK_2.0/level4/污染.svg",
    "caption": "ô nhiễm"
  },
  "无": {
    "file": "无.svg",
    "src": "images/HSK_2.0/level4/无.svg",
    "caption": "không có"
  },
  "无聊": {
    "file": "无聊.svg",
    "src": "images/HSK_2.0/level4/无聊.svg",
    "caption": "buồn chán, vô vị"
  },
  "无论": {
    "file": "无论.svg",
    "src": "images/HSK_2.0/level4/无论.svg",
    "caption": "bất luận, dù"
  },
  "误会": {
    "file": "误会.svg",
    "src": "images/HSK_2.0/level4/误会.svg",
    "caption": "hiểu lầm"
  },
  "西红柿": {
    "file": "西红柿.svg",
    "src": "images/HSK_2.0/level4/西红柿.svg",
    "caption": "cà chua"
  },
  "吸引": {
    "file": "吸引.svg",
    "src": "images/HSK_2.0/level4/吸引.svg",
    "caption": "thu hút"
  },
  "咸": {
    "file": "咸.svg",
    "src": "images/HSK_2.0/level4/咸.svg",
    "caption": "mặn"
  },
  "现金": {
    "file": "现金.svg",
    "src": "images/HSK_2.0/level4/现金.svg",
    "caption": "tiền mặt"
  },
  "羡慕": {
    "file": "羡慕.svg",
    "src": "images/HSK_2.0/level4/羡慕.svg",
    "caption": "ngưỡng mộ, ganh tị"
  },
  "香": {
    "file": "香.svg",
    "src": "images/HSK_2.0/level4/香.svg",
    "caption": "thơm"
  },
  "相反": {
    "file": "相反.svg",
    "src": "images/HSK_2.0/level4/相反.svg",
    "caption": "trái lại, ngược lại"
  },
  "相同": {
    "file": "相同.svg",
    "src": "images/HSK_2.0/level4/相同.svg",
    "caption": "giống nhau"
  },
  "详细": {
    "file": "详细.svg",
    "src": "images/HSK_2.0/level4/详细.svg",
    "caption": "chi tiết, kỹ lưỡng"
  },
  "响": {
    "file": "响.svg",
    "src": "images/HSK_2.0/level4/响.svg",
    "caption": "reo, vang lên"
  },
  "橡皮": {
    "file": "橡皮.svg",
    "src": "images/HSK_2.0/level4/橡皮.svg",
    "caption": "cục tẩy, cao su"
  },
  "消息": {
    "file": "消息.svg",
    "src": "images/HSK_2.0/level4/消息.svg",
    "caption": "tin tức"
  },
  "小吃": {
    "file": "小吃.svg",
    "src": "images/HSK_2.0/level4/小吃.svg",
    "caption": "món ăn vặt, đồ ăn nhanh"
  },
  "小伙子": {
    "file": "小伙子.svg",
    "src": "images/HSK_2.0/level4/小伙子.svg",
    "caption": "chàng trai trẻ"
  },
  "小说": {
    "file": "小说.svg",
    "src": "images/HSK_2.0/level4/小说.svg",
    "caption": "tiểu thuyết"
  },
  "笑话": {
    "file": "笑话.svg",
    "src": "images/HSK_2.0/level4/笑话.svg",
    "caption": "chuyện cười, lời nói đùa"
  },
  "效果": {
    "file": "效果.svg",
    "src": "images/HSK_2.0/level4/效果.svg",
    "caption": "hiệu quả"
  },
  "辛苦": {
    "file": "辛苦.svg",
    "src": "images/HSK_2.0/level4/辛苦.svg",
    "caption": "vất vả, gian khổ"
  },
  "心情": {
    "file": "心情.svg",
    "src": "images/HSK_2.0/level4/心情.svg",
    "caption": "tâm trạng"
  },
  "信封": {
    "file": "信封.svg",
    "src": "images/HSK_2.0/level4/信封.svg",
    "caption": "bao thư, phong bì"
  },
  "信息": {
    "file": "信息.svg",
    "src": "images/HSK_2.0/level4/信息.svg",
    "caption": "thông tin"
  },
  "信心": {
    "file": "信心.svg",
    "src": "images/HSK_2.0/level4/信心.svg",
    "caption": "sự tự tin"
  },
  "兴奋": {
    "file": "兴奋.svg",
    "src": "images/HSK_2.0/level4/兴奋.svg",
    "caption": "hưng phấn, kích động"
  },
  "行": {
    "file": "行.svg",
    "src": "images/HSK_2.0/level4/行.svg",
    "caption": "được, ổn"
  },
  "醒": {
    "file": "醒.svg",
    "src": "images/HSK_2.0/level4/醒.svg",
    "caption": "tỉnh, thức"
  },
  "性别": {
    "file": "性别.svg",
    "src": "images/HSK_2.0/level4/性别.svg",
    "caption": "giới tính"
  },
  "性格": {
    "file": "性格.svg",
    "src": "images/HSK_2.0/level4/性格.svg",
    "caption": "tính cách"
  },
  "幸福": {
    "file": "幸福.svg",
    "src": "images/HSK_2.0/level4/幸福.svg",
    "caption": "hạnh phúc"
  },
  "修理": {
    "file": "修理.svg",
    "src": "images/HSK_2.0/level4/修理.svg",
    "caption": "sửa chữa"
  },
  "许多": {
    "file": "许多.svg",
    "src": "images/HSK_2.0/level4/许多.svg",
    "caption": "nhiều, rất nhiều"
  },
  "学期": {
    "file": "学期.svg",
    "src": "images/HSK_2.0/level4/学期.svg",
    "caption": "học kỳ"
  },
  "压力": {
    "file": "压力.svg",
    "src": "images/HSK_2.0/level4/压力.svg",
    "caption": "áp lực"
  },
  "牙膏": {
    "file": "牙膏.svg",
    "src": "images/HSK_2.0/level4/牙膏.svg",
    "caption": "kem đánh răng"
  },
  "亚洲": {
    "file": "亚洲.svg",
    "src": "images/HSK_2.0/level4/亚洲.svg",
    "caption": "châu Á"
  },
  "呀": {
    "file": "呀.svg",
    "src": "images/HSK_2.0/level4/呀.svg",
    "caption": "trợ từ ngữ khí (à, nhé)"
  },
  "盐": {
    "file": "盐.svg",
    "src": "images/HSK_2.0/level4/盐.svg",
    "caption": "muối"
  },
  "严格": {
    "file": "严格.svg",
    "src": "images/HSK_2.0/level4/严格.svg",
    "caption": "nghiêm khắc, chặt chẽ"
  },
  "严重": {
    "file": "严重.svg",
    "src": "images/HSK_2.0/level4/严重.svg",
    "caption": "nghiêm trọng"
  },
  "研究": {
    "file": "研究.svg",
    "src": "images/HSK_2.0/level4/研究.svg",
    "caption": "nghiên cứu"
  },
  "演出": {
    "file": "演出.svg",
    "src": "images/HSK_2.0/level4/演出.svg",
    "caption": "diễn xuất, biểu diễn"
  },
  "演员": {
    "file": "演员.svg",
    "src": "images/HSK_2.0/level4/演员.svg",
    "caption": "diễn viên"
  },
  "眼镜": {
    "file": "眼镜.svg",
    "src": "images/HSK_2.0/level4/眼镜.svg",
    "caption": "mắt kính"
  },
  "阳光": {
    "file": "阳光.svg",
    "src": "images/HSK_2.0/level4/阳光.svg",
    "caption": "ánh nắng"
  },
  "养成": {
    "file": "养成.svg",
    "src": "images/HSK_2.0/level4/养成.svg",
    "caption": "hình thành, tạo thành (thói quen)"
  },
  "样子": {
    "file": "样子.svg",
    "src": "images/HSK_2.0/level4/样子.svg",
    "caption": "dáng vẻ, hình dạng"
  },
  "邀请": {
    "file": "邀请.svg",
    "src": "images/HSK_2.0/level4/邀请.svg",
    "caption": "mời, lời mời"
  },
  "要是": {
    "file": "要是.svg",
    "src": "images/HSK_2.0/level4/要是.svg",
    "caption": "nếu, nếu là"
  },
  "钥匙": {
    "file": "钥匙.svg",
    "src": "images/HSK_2.0/level4/钥匙.svg",
    "caption": "chìa khóa"
  },
  "也许": {
    "file": "也许.svg",
    "src": "images/HSK_2.0/level4/也许.svg",
    "caption": "có lẽ"
  },
  "页": {
    "file": "页.svg",
    "src": "images/HSK_2.0/level4/页.svg",
    "caption": "trang (sách)"
  },
  "叶子": {
    "file": "叶子.svg",
    "src": "images/HSK_2.0/level4/叶子.svg",
    "caption": "lá cây"
  },
  "一切": {
    "file": "一切.svg",
    "src": "images/HSK_2.0/level4/一切.svg",
    "caption": "tất cả, mọi thứ"
  },
  "以": {
    "file": "以.svg",
    "src": "images/HSK_2.0/level4/以.svg",
    "caption": "bằng, dùng"
  },
  "以为": {
    "file": "以为.svg",
    "src": "images/HSK_2.0/level4/以为.svg",
    "caption": "cho rằng, nghĩ là"
  },
  "意见": {
    "file": "意见.svg",
    "src": "images/HSK_2.0/level4/意见.svg",
    "caption": "ý kiến"
  },
  "艺术": {
    "file": "艺术.svg",
    "src": "images/HSK_2.0/level4/艺术.svg",
    "caption": "nghệ thuật"
  },
  "因此": {
    "file": "因此.svg",
    "src": "images/HSK_2.0/level4/因此.svg",
    "caption": "vì vậy, do đó"
  },
  "引起": {
    "file": "引起.svg",
    "src": "images/HSK_2.0/level4/引起.svg",
    "caption": "gây ra, dẫn đến"
  },
  "印象": {
    "file": "印象.svg",
    "src": "images/HSK_2.0/level4/印象.svg",
    "caption": "ấn tượng"
  },
  "应聘": {
    "file": "应聘.svg",
    "src": "images/HSK_2.0/level4/应聘.svg",
    "caption": "ứng tuyển"
  },
  "赢": {
    "file": "赢.svg",
    "src": "images/HSK_2.0/level4/赢.svg",
    "caption": "thắng"
  },
  "勇敢": {
    "file": "勇敢.svg",
    "src": "images/HSK_2.0/level4/勇敢.svg",
    "caption": "dũng cảm"
  },
  "永远": {
    "file": "永远.svg",
    "src": "images/HSK_2.0/level4/永远.svg",
    "caption": "vĩnh viễn, mãi mãi"
  },
  "优点": {
    "file": "优点.svg",
    "src": "images/HSK_2.0/level4/优点.svg",
    "caption": "ưu điểm"
  },
  "优秀": {
    "file": "优秀.svg",
    "src": "images/HSK_2.0/level4/优秀.svg",
    "caption": "ưu tú, xuất sắc"
  },
  "幽默": {
    "file": "幽默.svg",
    "src": "images/HSK_2.0/level4/幽默.svg",
    "caption": "hài hước"
  },
  "由": {
    "file": "由.svg",
    "src": "images/HSK_2.0/level4/由.svg",
    "caption": "do, từ"
  },
  "由于": {
    "file": "由于.svg",
    "src": "images/HSK_2.0/level4/由于.svg",
    "caption": "do, vì"
  },
  "邮局": {
    "file": "邮局.svg",
    "src": "images/HSK_2.0/level4/邮局.svg",
    "caption": "bưu điện"
  },
  "尤其": {
    "file": "尤其.svg",
    "src": "images/HSK_2.0/level4/尤其.svg",
    "caption": "đặc biệt là"
  },
  "有趣": {
    "file": "有趣.svg",
    "src": "images/HSK_2.0/level4/有趣.svg",
    "caption": "thú vị, hấp dẫn"
  },
  "友好": {
    "file": "友好.svg",
    "src": "images/HSK_2.0/level4/友好.svg",
    "caption": "thân thiện, hữu hảo"
  },
  "友谊": {
    "file": "友谊.svg",
    "src": "images/HSK_2.0/level4/友谊.svg",
    "caption": "tình hữu nghị"
  },
  "愉快": {
    "file": "愉快.svg",
    "src": "images/HSK_2.0/level4/愉快.svg",
    "caption": "vui vẻ, vui sướng"
  },
  "于是": {
    "file": "于是.svg",
    "src": "images/HSK_2.0/level4/于是.svg",
    "caption": "vì vậy, do đó"
  },
  "与": {
    "file": "与.svg",
    "src": "images/HSK_2.0/level4/与.svg",
    "caption": "và, với"
  },
  "语法": {
    "file": "语法.svg",
    "src": "images/HSK_2.0/level4/语法.svg",
    "caption": "ngữ pháp"
  },
  "语言": {
    "file": "语言.svg",
    "src": "images/HSK_2.0/level4/语言.svg",
    "caption": "ngôn ngữ"
  },
  "羽毛球": {
    "file": "羽毛球.svg",
    "src": "images/HSK_2.0/level4/羽毛球.svg",
    "caption": "cầu lông"
  },
  "预习": {
    "file": "预习.svg",
    "src": "images/HSK_2.0/level4/预习.svg",
    "caption": "học trước (bài mới)"
  },
  "原来": {
    "file": "原来.svg",
    "src": "images/HSK_2.0/level4/原来.svg",
    "caption": "ban đầu, hóa ra"
  },
  "原谅": {
    "file": "原谅.svg",
    "src": "images/HSK_2.0/level4/原谅.svg",
    "caption": "tha thứ, lượng thứ"
  },
  "原因": {
    "file": "原因.svg",
    "src": "images/HSK_2.0/level4/原因.svg",
    "caption": "nguyên nhân"
  },
  "约会": {
    "file": "约会.svg",
    "src": "images/HSK_2.0/level4/约会.svg",
    "caption": "cuộc hẹn, hẹn hò"
  },
  "阅读": {
    "file": "阅读.svg",
    "src": "images/HSK_2.0/level4/阅读.svg",
    "caption": "đọc, đọc hiểu"
  },
  "云": {
    "file": "云.svg",
    "src": "images/HSK_2.0/level4/云.svg",
    "caption": "mây"
  },
  "允许": {
    "file": "允许.svg",
    "src": "images/HSK_2.0/level4/允许.svg",
    "caption": "cho phép"
  },
  "杂志": {
    "file": "杂志.svg",
    "src": "images/HSK_2.0/level4/杂志.svg",
    "caption": "tạp chí"
  },
  "咱们": {
    "file": "咱们.svg",
    "src": "images/HSK_2.0/level4/咱们.svg",
    "caption": "chúng ta (gồm cả người nghe)"
  },
  "暂时": {
    "file": "暂时.svg",
    "src": "images/HSK_2.0/level4/暂时.svg",
    "caption": "tạm thời"
  },
  "脏": {
    "file": "脏.svg",
    "src": "images/HSK_2.0/level4/脏.svg",
    "caption": "bẩn, dơ"
  },
  "责任": {
    "file": "责任.svg",
    "src": "images/HSK_2.0/level4/责任.svg",
    "caption": "trách nhiệm"
  },
  "增加": {
    "file": "增加.svg",
    "src": "images/HSK_2.0/level4/增加.svg",
    "caption": "tăng thêm"
  },
  "占线": {
    "file": "占线.svg",
    "src": "images/HSK_2.0/level4/占线.svg",
    "caption": "đang bận (đường dây)"
  },
  "招聘": {
    "file": "招聘.svg",
    "src": "images/HSK_2.0/level4/招聘.svg",
    "caption": "tuyển dụng"
  },
  "照": {
    "file": "照.svg",
    "src": "images/HSK_2.0/level4/照.svg",
    "caption": "chiếu, soi"
  },
  "真正": {
    "file": "真正.svg",
    "src": "images/HSK_2.0/level4/真正.svg",
    "caption": "thực sự, chân chính"
  },
  "整理": {
    "file": "整理.svg",
    "src": "images/HSK_2.0/level4/整理.svg",
    "caption": "chỉnh lý, sắp xếp"
  },
  "正常": {
    "file": "正常.svg",
    "src": "images/HSK_2.0/level4/正常.svg",
    "caption": "bình thường"
  },
  "正好": {
    "file": "正好.svg",
    "src": "images/HSK_2.0/level4/正好.svg",
    "caption": "vừa đúng, vừa khéo"
  },
  "正确": {
    "file": "正确.svg",
    "src": "images/HSK_2.0/level4/正确.svg",
    "caption": "chính xác, đúng đắn"
  },
  "正式": {
    "file": "正式.svg",
    "src": "images/HSK_2.0/level4/正式.svg",
    "caption": "chính thức"
  },
  "证明": {
    "file": "证明.svg",
    "src": "images/HSK_2.0/level4/证明.svg",
    "caption": "chứng minh"
  },
  "之": {
    "file": "之.svg",
    "src": "images/HSK_2.0/level4/之.svg",
    "caption": "của (trợ từ văn viết)"
  },
  "支持": {
    "file": "支持.svg",
    "src": "images/HSK_2.0/level4/支持.svg",
    "caption": "ủng hộ"
  },
  "知识": {
    "file": "知识.svg",
    "src": "images/HSK_2.0/level4/知识.svg",
    "caption": "kiến thức"
  },
  "值得": {
    "file": "值得.svg",
    "src": "images/HSK_2.0/level4/值得.svg",
    "caption": "đáng, xứng đáng"
  },
  "直接": {
    "file": "直接.svg",
    "src": "images/HSK_2.0/level4/直接.svg",
    "caption": "trực tiếp"
  },
  "植物": {
    "file": "植物.svg",
    "src": "images/HSK_2.0/level4/植物.svg",
    "caption": "thực vật"
  },
  "职业": {
    "file": "职业.svg",
    "src": "images/HSK_2.0/level4/职业.svg",
    "caption": "nghề nghiệp"
  },
  "指": {
    "file": "指.svg",
    "src": "images/HSK_2.0/level4/指.svg",
    "caption": "ngón tay; chỉ vào"
  },
  "只好": {
    "file": "只好.svg",
    "src": "images/HSK_2.0/level4/只好.svg",
    "caption": "chỉ có thể, đành phải"
  },
  "只要": {
    "file": "只要.svg",
    "src": "images/HSK_2.0/level4/只要.svg",
    "caption": "chỉ cần"
  },
  "质量": {
    "file": "质量.svg",
    "src": "images/HSK_2.0/level4/质量.svg",
    "caption": "chất lượng"
  },
  "至少": {
    "file": "至少.svg",
    "src": "images/HSK_2.0/level4/至少.svg",
    "caption": "ít nhất"
  },
  "重": {
    "file": "重.svg",
    "src": "images/HSK_2.0/level4/重.svg",
    "caption": "nặng"
  },
  "重点": {
    "file": "重点.svg",
    "src": "images/HSK_2.0/level4/重点.svg",
    "caption": "điểm trọng tâm, trọng điểm"
  },
  "重视": {
    "file": "重视.svg",
    "src": "images/HSK_2.0/level4/重视.svg",
    "caption": "coi trọng"
  },
  "周围": {
    "file": "周围.svg",
    "src": "images/HSK_2.0/level4/周围.svg",
    "caption": "xung quanh"
  },
  "主意": {
    "file": "主意.svg",
    "src": "images/HSK_2.0/level4/主意.svg",
    "caption": "ý tưởng, chủ ý"
  },
  "祝贺": {
    "file": "祝贺.svg",
    "src": "images/HSK_2.0/level4/祝贺.svg",
    "caption": "chúc mừng"
  },
  "著名": {
    "file": "著名.svg",
    "src": "images/HSK_2.0/level4/著名.svg",
    "caption": "nổi tiếng"
  },
  "专门": {
    "file": "专门.svg",
    "src": "images/HSK_2.0/level4/专门.svg",
    "caption": "chuyên môn, chuyên biệt"
  },
  "专业": {
    "file": "专业.svg",
    "src": "images/HSK_2.0/level4/专业.svg",
    "caption": "chuyên ngành"
  },
  "转": {
    "file": "转.svg",
    "src": "images/HSK_2.0/level4/转.svg",
    "caption": "quay, xoay"
  },
  "赚": {
    "file": "赚.svg",
    "src": "images/HSK_2.0/level4/赚.svg",
    "caption": "kiếm (tiền), lãi"
  },
  "准确": {
    "file": "准确.svg",
    "src": "images/HSK_2.0/level4/准确.svg",
    "caption": "chuẩn xác"
  },
  "准时": {
    "file": "准时.svg",
    "src": "images/HSK_2.0/level4/准时.svg",
    "caption": "đúng giờ"
  },
  "仔细": {
    "file": "仔细.svg",
    "src": "images/HSK_2.0/level4/仔细.svg",
    "caption": "cẩn thận, kỹ lưỡng"
  },
  "自然": {
    "file": "自然.svg",
    "src": "images/HSK_2.0/level4/自然.svg",
    "caption": "tự nhiên"
  },
  "自信": {
    "file": "自信.svg",
    "src": "images/HSK_2.0/level4/自信.svg",
    "caption": "tự tin"
  },
  "总结": {
    "file": "总结.svg",
    "src": "images/HSK_2.0/level4/总结.svg",
    "caption": "tổng kết"
  },
  "租": {
    "file": "租.svg",
    "src": "images/HSK_2.0/level4/租.svg",
    "caption": "thuê"
  },
  "最好": {
    "file": "最好.svg",
    "src": "images/HSK_2.0/level4/最好.svg",
    "caption": "tốt nhất"
  },
  "尊重": {
    "file": "尊重.svg",
    "src": "images/HSK_2.0/level4/尊重.svg",
    "caption": "tôn trọng"
  },
  "左右": {
    "file": "左右.svg",
    "src": "images/HSK_2.0/level4/左右.svg",
    "caption": "khoảng, trái phải"
  },
  "座": {
    "file": "座.svg",
    "src": "images/HSK_2.0/level4/座.svg",
    "caption": "chỗ ngồi, tòa (lượng từ)"
  },
  "作家": {
    "file": "作家.svg",
    "src": "images/HSK_2.0/level4/作家.svg",
    "caption": "nhà văn"
  },
  "座位": {
    "file": "座位.svg",
    "src": "images/HSK_2.0/level4/座位.svg",
    "caption": "chỗ ngồi"
  },
  "作用": {
    "file": "作用.svg",
    "src": "images/HSK_2.0/level4/作用.svg",
    "caption": "tác dụng"
  },
  "作者": {
    "file": "作者.svg",
    "src": "images/HSK_2.0/level4/作者.svg",
    "caption": "tác giả"
  },
  "唉": {
    "file": "唉.svg",
    "src": "images/HSK_2.0/level5/唉.svg",
    "caption": "ôi, chà (thán từ)"
  },
  "爱心": {
    "file": "爱心.svg",
    "src": "images/HSK_2.0/level5/爱心.svg",
    "caption": "lòng yêu thương"
  },
  "安慰": {
    "file": "安慰.svg",
    "src": "images/HSK_2.0/level5/安慰.svg",
    "caption": "an ủi"
  },
  "岸": {
    "file": "岸.svg",
    "src": "images/HSK_2.0/level5/岸.svg",
    "caption": "bờ (sông, biển)"
  },
  "熬夜": {
    "file": "熬夜.svg",
    "src": "images/HSK_2.0/level5/熬夜.svg",
    "caption": "thức khuya"
  },
  "包含": {
    "file": "包含.svg",
    "src": "images/HSK_2.0/level5/包含.svg",
    "caption": "bao hàm, chứa đựng"
  },
  "宝贵": {
    "file": "宝贵.svg",
    "src": "images/HSK_2.0/level5/宝贵.svg",
    "caption": "quý báu"
  },
  "保存": {
    "file": "保存.svg",
    "src": "images/HSK_2.0/level5/保存.svg",
    "caption": "bảo tồn, lưu giữ"
  },
  "保留": {
    "file": "保留.svg",
    "src": "images/HSK_2.0/level5/保留.svg",
    "caption": "giữ lại, bảo lưu"
  },
  "报到": {
    "file": "报到.svg",
    "src": "images/HSK_2.0/level5/报到.svg",
    "caption": "đăng ký, trình báo"
  },
  "报告": {
    "file": "报告.svg",
    "src": "images/HSK_2.0/level5/报告.svg",
    "caption": "báo cáo"
  },
  "悲观": {
    "file": "悲观.svg",
    "src": "images/HSK_2.0/level5/悲观.svg",
    "caption": "bi quan"
  },
  "背景": {
    "file": "背景.svg",
    "src": "images/HSK_2.0/level5/背景.svg",
    "caption": "bối cảnh"
  },
  "被子": {
    "file": "被子.svg",
    "src": "images/HSK_2.0/level5/被子.svg",
    "caption": "chăn"
  },
  "本科": {
    "file": "本科.svg",
    "src": "images/HSK_2.0/level5/本科.svg",
    "caption": "đại học chính quy"
  },
  "本领": {
    "file": "本领.svg",
    "src": "images/HSK_2.0/level5/本领.svg",
    "caption": "bản lĩnh, năng lực"
  },
  "比例": {
    "file": "比例.svg",
    "src": "images/HSK_2.0/level5/比例.svg",
    "caption": "tỷ lệ"
  },
  "必然": {
    "file": "必然.svg",
    "src": "images/HSK_2.0/level5/必然.svg",
    "caption": "tất nhiên, chắc chắn"
  },
  "必要": {
    "file": "必要.svg",
    "src": "images/HSK_2.0/level5/必要.svg",
    "caption": "cần thiết"
  },
  "鞭炮": {
    "file": "鞭炮.svg",
    "src": "images/HSK_2.0/level5/鞭炮.svg",
    "caption": "pháo"
  },
  "辩论": {
    "file": "辩论.svg",
    "src": "images/HSK_2.0/level5/辩论.svg",
    "caption": "tranh luận"
  },
  "标志": {
    "file": "标志.svg",
    "src": "images/HSK_2.0/level5/标志.svg",
    "caption": "biểu tượng, dấu hiệu"
  },
  "表达": {
    "file": "表达.svg",
    "src": "images/HSK_2.0/level5/表达.svg",
    "caption": "biểu đạt, diễn đạt"
  },
  "表面": {
    "file": "表面.svg",
    "src": "images/HSK_2.0/level5/表面.svg",
    "caption": "bề mặt"
  },
  "表情": {
    "file": "表情.svg",
    "src": "images/HSK_2.0/level5/表情.svg",
    "caption": "biểu cảm, vẻ mặt"
  },
  "表现": {
    "file": "表现.svg",
    "src": "images/HSK_2.0/level5/表现.svg",
    "caption": "biểu hiện, thể hiện"
  },
  "冰激凌": {
    "file": "冰激凌.svg",
    "src": "images/HSK_2.0/level5/冰激凌.svg",
    "caption": "kem (món ăn)"
  },
  "玻璃": {
    "file": "玻璃.svg",
    "src": "images/HSK_2.0/level5/玻璃.svg",
    "caption": "kính, thủy tinh"
  },
  "博物馆": {
    "file": "博物馆.svg",
    "src": "images/HSK_2.0/level5/博物馆.svg",
    "caption": "viện bảo tàng"
  },
  "不断": {
    "file": "不断.svg",
    "src": "images/HSK_2.0/level5/不断.svg",
    "caption": "không ngừng, liên tục"
  },
  "不见得": {
    "file": "不见得.svg",
    "src": "images/HSK_2.0/level5/不见得.svg",
    "caption": "chưa chắc, không hẳn"
  },
  "不耐烦": {
    "file": "不耐烦.svg",
    "src": "images/HSK_2.0/level5/不耐烦.svg",
    "caption": "mất kiên nhẫn"
  },
  "补充": {
    "file": "补充.svg",
    "src": "images/HSK_2.0/level5/补充.svg",
    "caption": "bổ sung"
  },
  "不然": {
    "file": "不然.svg",
    "src": "images/HSK_2.0/level5/不然.svg",
    "caption": "nếu không thì"
  },
  "不足": {
    "file": "不足.svg",
    "src": "images/HSK_2.0/level5/不足.svg",
    "caption": "không đủ, thiếu"
  },
  "部门": {
    "file": "部门.svg",
    "src": "images/HSK_2.0/level5/部门.svg",
    "caption": "bộ phận, phòng ban"
  },
  "财产": {
    "file": "财产.svg",
    "src": "images/HSK_2.0/level5/财产.svg",
    "caption": "tài sản"
  },
  "踩": {
    "file": "踩.svg",
    "src": "images/HSK_2.0/level5/踩.svg",
    "caption": "đạp, giẫm"
  },
  "采取": {
    "file": "采取.svg",
    "src": "images/HSK_2.0/level5/采取.svg",
    "caption": "áp dụng, tiến hành"
  },
  "参考": {
    "file": "参考.svg",
    "src": "images/HSK_2.0/level5/参考.svg",
    "caption": "tham khảo"
  },
  "操场": {
    "file": "操场.svg",
    "src": "images/HSK_2.0/level5/操场.svg",
    "caption": "sân tập, sân vận động"
  },
  "插": {
    "file": "插.svg",
    "src": "images/HSK_2.0/level5/插.svg",
    "caption": "cắm, chèn vào"
  },
  "叉子": {
    "file": "叉子.svg",
    "src": "images/HSK_2.0/level5/叉子.svg",
    "caption": "cái nĩa"
  },
  "拆": {
    "file": "拆.svg",
    "src": "images/HSK_2.0/level5/拆.svg",
    "caption": "dỡ, tháo ra"
  },
  "产生": {
    "file": "产生.svg",
    "src": "images/HSK_2.0/level5/产生.svg",
    "caption": "sinh ra, phát sinh"
  },
  "常识": {
    "file": "常识.svg",
    "src": "images/HSK_2.0/level5/常识.svg",
    "caption": "kiến thức thông thường"
  },
  "潮湿": {
    "file": "潮湿.svg",
    "src": "images/HSK_2.0/level5/潮湿.svg",
    "caption": "ẩm ướt"
  },
  "吵": {
    "file": "吵.svg",
    "src": "images/HSK_2.0/level5/吵.svg",
    "caption": "ồn ào, cãi nhau"
  },
  "车库": {
    "file": "车库.svg",
    "src": "images/HSK_2.0/level5/车库.svg",
    "caption": "nhà để xe"
  },
  "彻底": {
    "file": "彻底.svg",
    "src": "images/HSK_2.0/level5/彻底.svg",
    "caption": "triệt để"
  },
  "趁": {
    "file": "趁.svg",
    "src": "images/HSK_2.0/level5/趁.svg",
    "caption": "nhân lúc, lợi dụng"
  },
  "称": {
    "file": "称.svg",
    "src": "images/HSK_2.0/level5/称.svg",
    "caption": "gọi là, xưng là"
  },
  "称赞": {
    "file": "称赞.svg",
    "src": "images/HSK_2.0/level5/称赞.svg",
    "caption": "khen ngợi"
  },
  "承担": {
    "file": "承担.svg",
    "src": "images/HSK_2.0/level5/承担.svg",
    "caption": "đảm nhận, chịu trách nhiệm"
  },
  "承受": {
    "file": "承受.svg",
    "src": "images/HSK_2.0/level5/承受.svg",
    "caption": "chịu đựng, gánh chịu"
  },
  "程序": {
    "file": "程序.svg",
    "src": "images/HSK_2.0/level5/程序.svg",
    "caption": "trình tự, chương trình"
  },
  "成立": {
    "file": "成立.svg",
    "src": "images/HSK_2.0/level5/成立.svg",
    "caption": "thành lập"
  },
  "成人": {
    "file": "成人.svg",
    "src": "images/HSK_2.0/level5/成人.svg",
    "caption": "người trưởng thành"
  },
  "成语": {
    "file": "成语.svg",
    "src": "images/HSK_2.0/level5/成语.svg",
    "caption": "thành ngữ"
  },
  "诚恳": {
    "file": "诚恳.svg",
    "src": "images/HSK_2.0/level5/诚恳.svg",
    "caption": "chân thành"
  },
  "持续": {
    "file": "持续.svg",
    "src": "images/HSK_2.0/level5/持续.svg",
    "caption": "tiếp tục, kéo dài"
  },
  "尺子": {
    "file": "尺子.svg",
    "src": "images/HSK_2.0/level5/尺子.svg",
    "caption": "cái thước"
  },
  "冲": {
    "file": "冲.svg",
    "src": "images/HSK_2.0/level5/冲.svg",
    "caption": "xông tới, tráng (nước)"
  },
  "充分": {
    "file": "充分.svg",
    "src": "images/HSK_2.0/level5/充分.svg",
    "caption": "đầy đủ, đầy"
  },
  "重复": {
    "file": "重复.svg",
    "src": "images/HSK_2.0/level5/重复.svg",
    "caption": "lặp lại"
  },
  "宠物": {
    "file": "宠物.svg",
    "src": "images/HSK_2.0/level5/宠物.svg",
    "caption": "vật nuôi, thú cưng"
  },
  "抽象": {
    "file": "抽象.svg",
    "src": "images/HSK_2.0/level5/抽象.svg",
    "caption": "trừu tượng"
  },
  "丑": {
    "file": "丑.svg",
    "src": "images/HSK_2.0/level5/丑.svg",
    "caption": "xấu"
  },
  "出口": {
    "file": "出口.svg",
    "src": "images/HSK_2.0/level5/出口.svg",
    "caption": "lối ra, xuất khẩu"
  },
  "出示": {
    "file": "出示.svg",
    "src": "images/HSK_2.0/level5/出示.svg",
    "caption": "trình ra, xuất trình"
  },
  "出席": {
    "file": "出席.svg",
    "src": "images/HSK_2.0/level5/出席.svg",
    "caption": "tham dự"
  },
  "除非": {
    "file": "除非.svg",
    "src": "images/HSK_2.0/level5/除非.svg",
    "caption": "trừ khi"
  },
  "除夕": {
    "file": "除夕.svg",
    "src": "images/HSK_2.0/level5/除夕.svg",
    "caption": "đêm giao thừa"
  },
  "处理": {
    "file": "处理.svg",
    "src": "images/HSK_2.0/level5/处理.svg",
    "caption": "xử lý"
  },
  "传染": {
    "file": "传染.svg",
    "src": "images/HSK_2.0/level5/传染.svg",
    "caption": "lây nhiễm"
  },
  "传统": {
    "file": "传统.svg",
    "src": "images/HSK_2.0/level5/传统.svg",
    "caption": "truyền thống"
  },
  "闯": {
    "file": "闯.svg",
    "src": "images/HSK_2.0/level5/闯.svg",
    "caption": "xông vào, vượt qua"
  },
  "吹": {
    "file": "吹.svg",
    "src": "images/HSK_2.0/level5/吹.svg",
    "caption": "thổi"
  },
  "此外": {
    "file": "此外.svg",
    "src": "images/HSK_2.0/level5/此外.svg",
    "caption": "ngoài ra"
  },
  "次要": {
    "file": "次要.svg",
    "src": "images/HSK_2.0/level5/次要.svg",
    "caption": "phụ, thứ yếu"
  },
  "匆忙": {
    "file": "匆忙.svg",
    "src": "images/HSK_2.0/level5/匆忙.svg",
    "caption": "vội vàng"
  },
  "从而": {
    "file": "从而.svg",
    "src": "images/HSK_2.0/level5/从而.svg",
    "caption": "do đó, vì thế"
  },
  "从前": {
    "file": "从前.svg",
    "src": "images/HSK_2.0/level5/从前.svg",
    "caption": "trước đây, ngày xưa"
  },
  "粗糙": {
    "file": "粗糙.svg",
    "src": "images/HSK_2.0/level5/粗糙.svg",
    "caption": "thô ráp, sơ sài"
  },
  "醋": {
    "file": "醋.svg",
    "src": "images/HSK_2.0/level5/醋.svg",
    "caption": "giấm"
  },
  "促使": {
    "file": "促使.svg",
    "src": "images/HSK_2.0/level5/促使.svg",
    "caption": "thúc đẩy, khiến cho"
  },
  "措施": {
    "file": "措施.svg",
    "src": "images/HSK_2.0/level5/措施.svg",
    "caption": "biện pháp"
  },
  "打工": {
    "file": "打工.svg",
    "src": "images/HSK_2.0/level5/打工.svg",
    "caption": "làm thuê, làm thêm"
  },
  "大厦": {
    "file": "大厦.svg",
    "src": "images/HSK_2.0/level5/大厦.svg",
    "caption": "tòa nhà lớn"
  },
  "大象": {
    "file": "大象.svg",
    "src": "images/HSK_2.0/level5/大象.svg",
    "caption": "con voi"
  },
  "代表": {
    "file": "代表.svg",
    "src": "images/HSK_2.0/level5/代表.svg",
    "caption": "đại diện"
  },
  "待遇": {
    "file": "待遇.svg",
    "src": "images/HSK_2.0/level5/待遇.svg",
    "caption": "đãi ngộ"
  },
  "单调": {
    "file": "单调.svg",
    "src": "images/HSK_2.0/level5/单调.svg",
    "caption": "đơn điệu"
  },
  "单位": {
    "file": "单位.svg",
    "src": "images/HSK_2.0/level5/单位.svg",
    "caption": "đơn vị, cơ quan"
  },
  "担任": {
    "file": "担任.svg",
    "src": "images/HSK_2.0/level5/担任.svg",
    "caption": "đảm nhiệm"
  },
  "耽误": {
    "file": "耽误.svg",
    "src": "images/HSK_2.0/level5/耽误.svg",
    "caption": "làm lỡ, làm trễ"
  },
  "淡": {
    "file": "淡.svg",
    "src": "images/HSK_2.0/level5/淡.svg",
    "caption": "nhạt"
  },
  "倒霉": {
    "file": "倒霉.svg",
    "src": "images/HSK_2.0/level5/倒霉.svg",
    "caption": "xui xẻo, gặp vận đen"
  },
  "道理": {
    "file": "道理.svg",
    "src": "images/HSK_2.0/level5/道理.svg",
    "caption": "lý lẽ, đạo lý"
  },
  "登记": {
    "file": "登记.svg",
    "src": "images/HSK_2.0/level5/登记.svg",
    "caption": "đăng ký"
  },
  "等于": {
    "file": "等于.svg",
    "src": "images/HSK_2.0/level5/等于.svg",
    "caption": "tương đương, bằng với"
  },
  "滴": {
    "file": "滴.svg",
    "src": "images/HSK_2.0/level5/滴.svg",
    "caption": "nhỏ giọt"
  },
  "敌人": {
    "file": "敌人.svg",
    "src": "images/HSK_2.0/level5/敌人.svg",
    "caption": "kẻ địch"
  },
  "递": {
    "file": "递.svg",
    "src": "images/HSK_2.0/level5/递.svg",
    "caption": "đưa, chuyển"
  },
  "地毯": {
    "file": "地毯.svg",
    "src": "images/HSK_2.0/level5/地毯.svg",
    "caption": "tấm thảm"
  },
  "地震": {
    "file": "地震.svg",
    "src": "images/HSK_2.0/level5/地震.svg",
    "caption": "động đất"
  },
  "电池": {
    "file": "电池.svg",
    "src": "images/HSK_2.0/level5/电池.svg",
    "caption": "pin"
  },
  "顶": {
    "file": "顶.svg",
    "src": "images/HSK_2.0/level5/顶.svg",
    "caption": "đỉnh, nóc"
  },
  "冻": {
    "file": "冻.svg",
    "src": "images/HSK_2.0/level5/冻.svg",
    "caption": "đông lạnh"
  },
  "动画片": {
    "file": "动画片.svg",
    "src": "images/HSK_2.0/level5/动画片.svg",
    "caption": "phim hoạt hình"
  },
  "逗": {
    "file": "逗.svg",
    "src": "images/HSK_2.0/level5/逗.svg",
    "caption": "buồn cười, chọc cười"
  },
  "独特": {
    "file": "独特.svg",
    "src": "images/HSK_2.0/level5/独特.svg",
    "caption": "độc đáo"
  },
  "度过": {
    "file": "度过.svg",
    "src": "images/HSK_2.0/level5/度过.svg",
    "caption": "trải qua (thời gian)"
  },
  "对比": {
    "file": "对比.svg",
    "src": "images/HSK_2.0/level5/对比.svg",
    "caption": "đối chiếu, so sánh"
  },
  "对待": {
    "file": "对待.svg",
    "src": "images/HSK_2.0/level5/对待.svg",
    "caption": "đối xử"
  },
  "对手": {
    "file": "对手.svg",
    "src": "images/HSK_2.0/level5/对手.svg",
    "caption": "đối thủ"
  },
  "吨": {
    "file": "吨.svg",
    "src": "images/HSK_2.0/level5/吨.svg",
    "caption": "tấn (đơn vị khối lượng)"
  },
  "顿": {
    "file": "顿.svg",
    "src": "images/HSK_2.0/level5/顿.svg",
    "caption": "bữa (lượng từ bữa ăn)"
  },
  "多亏": {
    "file": "多亏.svg",
    "src": "images/HSK_2.0/level5/多亏.svg",
    "caption": "may mà, nhờ có"
  },
  "朵": {
    "file": "朵.svg",
    "src": "images/HSK_2.0/level5/朵.svg",
    "caption": "bông (lượng từ hoa)"
  },
  "发表": {
    "file": "发表.svg",
    "src": "images/HSK_2.0/level5/发表.svg",
    "caption": "phát biểu, công bố"
  },
  "发达": {
    "file": "发达.svg",
    "src": "images/HSK_2.0/level5/发达.svg",
    "caption": "phát triển"
  },
  "发挥": {
    "file": "发挥.svg",
    "src": "images/HSK_2.0/level5/发挥.svg",
    "caption": "phát huy"
  },
  "发票": {
    "file": "发票.svg",
    "src": "images/HSK_2.0/level5/发票.svg",
    "caption": "hóa đơn"
  },
  "发言": {
    "file": "发言.svg",
    "src": "images/HSK_2.0/level5/发言.svg",
    "caption": "phát ngôn, phát biểu"
  },
  "罚款": {
    "file": "罚款.svg",
    "src": "images/HSK_2.0/level5/罚款.svg",
    "caption": "tiền phạt, phạt tiền"
  },
  "法院": {
    "file": "法院.svg",
    "src": "images/HSK_2.0/level5/法院.svg",
    "caption": "tòa án"
  },
  "繁荣": {
    "file": "繁荣.svg",
    "src": "images/HSK_2.0/level5/繁荣.svg",
    "caption": "phồn vinh, thịnh vượng"
  },
  "反而": {
    "file": "反而.svg",
    "src": "images/HSK_2.0/level5/反而.svg",
    "caption": "ngược lại, trái lại"
  },
  "反应": {
    "file": "反应.svg",
    "src": "images/HSK_2.0/level5/反应.svg",
    "caption": "phản ứng"
  },
  "反正": {
    "file": "反正.svg",
    "src": "images/HSK_2.0/level5/反正.svg",
    "caption": "dù sao thì, đằng nào cũng"
  },
  "范围": {
    "file": "范围.svg",
    "src": "images/HSK_2.0/level5/范围.svg",
    "caption": "phạm vi"
  },
  "方案": {
    "file": "方案.svg",
    "src": "images/HSK_2.0/level5/方案.svg",
    "caption": "phương án"
  },
  "方式": {
    "file": "方式.svg",
    "src": "images/HSK_2.0/level5/方式.svg",
    "caption": "phương thức, cách thức"
  },
  "妨碍": {
    "file": "妨碍.svg",
    "src": "images/HSK_2.0/level5/妨碍.svg",
    "caption": "cản trở, gây trở ngại"
  },
  "肥皂": {
    "file": "肥皂.svg",
    "src": "images/HSK_2.0/level5/肥皂.svg",
    "caption": "xà phòng"
  },
  "分布": {
    "file": "分布.svg",
    "src": "images/HSK_2.0/level5/分布.svg",
    "caption": "phân bố"
  },
  "分手": {
    "file": "分手.svg",
    "src": "images/HSK_2.0/level5/分手.svg",
    "caption": "chia tay"
  },
  "风景": {
    "file": "风景.svg",
    "src": "images/HSK_2.0/level5/风景.svg",
    "caption": "cảnh đẹp, phong cảnh"
  },
  "风险": {
    "file": "风险.svg",
    "src": "images/HSK_2.0/level5/风险.svg",
    "caption": "rủi ro"
  },
  "讽刺": {
    "file": "讽刺.svg",
    "src": "images/HSK_2.0/level5/讽刺.svg",
    "caption": "châm biếm, mỉa mai"
  },
  "否认": {
    "file": "否认.svg",
    "src": "images/HSK_2.0/level5/否认.svg",
    "caption": "phủ nhận"
  },
  "扶": {
    "file": "扶.svg",
    "src": "images/HSK_2.0/level5/扶.svg",
    "caption": "đỡ, nâng đỡ"
  },
  "复制": {
    "file": "复制.svg",
    "src": "images/HSK_2.0/level5/复制.svg",
    "caption": "sao chép"
  },
  "改进": {
    "file": "改进.svg",
    "src": "images/HSK_2.0/level5/改进.svg",
    "caption": "cải tiến"
  },
  "改正": {
    "file": "改正.svg",
    "src": "images/HSK_2.0/level5/改正.svg",
    "caption": "sửa chữa, cải chính"
  },
  "概括": {
    "file": "概括.svg",
    "src": "images/HSK_2.0/level5/概括.svg",
    "caption": "khái quát, tóm tắt"
  },
  "感想": {
    "file": "感想.svg",
    "src": "images/HSK_2.0/level5/感想.svg",
    "caption": "cảm tưởng, suy nghĩ"
  },
  "赶快": {
    "file": "赶快.svg",
    "src": "images/HSK_2.0/level5/赶快.svg",
    "caption": "nhanh lên, mau lên"
  },
  "干活儿": {
    "file": "干活儿.svg",
    "src": "images/HSK_2.0/level5/干活儿.svg",
    "caption": "làm việc, làm công"
  },
  "高级": {
    "file": "高级.svg",
    "src": "images/HSK_2.0/level5/高级.svg",
    "caption": "cao cấp"
  },
  "告别": {
    "file": "告别.svg",
    "src": "images/HSK_2.0/level5/告别.svg",
    "caption": "tạm biệt, cáo biệt"
  },
  "隔壁": {
    "file": "隔壁.svg",
    "src": "images/HSK_2.0/level5/隔壁.svg",
    "caption": "nhà hàng xóm, bên cạnh"
  },
  "个人": {
    "file": "个人.svg",
    "src": "images/HSK_2.0/level5/个人.svg",
    "caption": "cá nhân"
  },
  "各自": {
    "file": "各自.svg",
    "src": "images/HSK_2.0/level5/各自.svg",
    "caption": "mỗi người, từng người"
  },
  "根本": {
    "file": "根本.svg",
    "src": "images/HSK_2.0/level5/根本.svg",
    "caption": "căn bản, hoàn toàn"
  },
  "公开": {
    "file": "公开.svg",
    "src": "images/HSK_2.0/level5/公开.svg",
    "caption": "công khai"
  },
  "公平": {
    "file": "公平.svg",
    "src": "images/HSK_2.0/level5/公平.svg",
    "caption": "công bằng"
  },
  "公寓": {
    "file": "公寓.svg",
    "src": "images/HSK_2.0/level5/公寓.svg",
    "caption": "căn hộ"
  },
  "工厂": {
    "file": "工厂.svg",
    "src": "images/HSK_2.0/level5/工厂.svg",
    "caption": "nhà máy"
  },
  "工具": {
    "file": "工具.svg",
    "src": "images/HSK_2.0/level5/工具.svg",
    "caption": "công cụ"
  },
  "工业": {
    "file": "工业.svg",
    "src": "images/HSK_2.0/level5/工业.svg",
    "caption": "công nghiệp"
  },
  "功能": {
    "file": "功能.svg",
    "src": "images/HSK_2.0/level5/功能.svg",
    "caption": "công năng, chức năng"
  },
  "沟通": {
    "file": "沟通.svg",
    "src": "images/HSK_2.0/level5/沟通.svg",
    "caption": "giao tiếp, trao đổi"
  },
  "姑娘": {
    "file": "姑娘.svg",
    "src": "images/HSK_2.0/level5/姑娘.svg",
    "caption": "cô gái"
  },
  "古代": {
    "file": "古代.svg",
    "src": "images/HSK_2.0/level5/古代.svg",
    "caption": "cổ đại"
  },
  "鼓掌": {
    "file": "鼓掌.svg",
    "src": "images/HSK_2.0/level5/鼓掌.svg",
    "caption": "vỗ tay"
  },
  "骨头": {
    "file": "骨头.svg",
    "src": "images/HSK_2.0/level5/骨头.svg",
    "caption": "xương"
  },
  "乖": {
    "file": "乖.svg",
    "src": "images/HSK_2.0/level5/乖.svg",
    "caption": "ngoan"
  },
  "怪不得": {
    "file": "怪不得.svg",
    "src": "images/HSK_2.0/level5/怪不得.svg",
    "caption": "chẳng trách, không lạ gì"
  },
  "观察": {
    "file": "观察.svg",
    "src": "images/HSK_2.0/level5/观察.svg",
    "caption": "quan sát"
  },
  "观念": {
    "file": "观念.svg",
    "src": "images/HSK_2.0/level5/观念.svg",
    "caption": "quan niệm"
  },
  "冠军": {
    "file": "冠军.svg",
    "src": "images/HSK_2.0/level5/冠军.svg",
    "caption": "nhà quán quân"
  },
  "光滑": {
    "file": "光滑.svg",
    "src": "images/HSK_2.0/level5/光滑.svg",
    "caption": "trơn nhẵn"
  },
  "光明": {
    "file": "光明.svg",
    "src": "images/HSK_2.0/level5/光明.svg",
    "caption": "sáng sủa, quang minh"
  },
  "广大": {
    "file": "广大.svg",
    "src": "images/HSK_2.0/level5/广大.svg",
    "caption": "rộng lớn, đông đảo"
  },
  "规律": {
    "file": "规律.svg",
    "src": "images/HSK_2.0/level5/规律.svg",
    "caption": "quy luật"
  },
  "规则": {
    "file": "规则.svg",
    "src": "images/HSK_2.0/level5/规则.svg",
    "caption": "quy tắc"
  },
  "滚": {
    "file": "滚.svg",
    "src": "images/HSK_2.0/level5/滚.svg",
    "caption": "lăn"
  },
  "国庆节": {
    "file": "国庆节.svg",
    "src": "images/HSK_2.0/level5/国庆节.svg",
    "caption": "ngày Quốc khánh"
  },
  "果实": {
    "file": "果实.svg",
    "src": "images/HSK_2.0/level5/果实.svg",
    "caption": "thành quả, quả"
  },
  "过敏": {
    "file": "过敏.svg",
    "src": "images/HSK_2.0/level5/过敏.svg",
    "caption": "dị ứng"
  },
  "海鲜": {
    "file": "海鲜.svg",
    "src": "images/HSK_2.0/level5/海鲜.svg",
    "caption": "hải sản"
  },
  "豪华": {
    "file": "豪华.svg",
    "src": "images/HSK_2.0/level5/豪华.svg",
    "caption": "sang trọng"
  },
  "好奇": {
    "file": "好奇.svg",
    "src": "images/HSK_2.0/level5/好奇.svg",
    "caption": "tò mò"
  },
  "何必": {
    "file": "何必.svg",
    "src": "images/HSK_2.0/level5/何必.svg",
    "caption": "cần gì phải"
  },
  "合法": {
    "file": "合法.svg",
    "src": "images/HSK_2.0/level5/合法.svg",
    "caption": "hợp pháp"
  },
  "合理": {
    "file": "合理.svg",
    "src": "images/HSK_2.0/level5/合理.svg",
    "caption": "hợp lý"
  },
  "合同": {
    "file": "合同.svg",
    "src": "images/HSK_2.0/level5/合同.svg",
    "caption": "hợp đồng"
  },
  "合作": {
    "file": "合作.svg",
    "src": "images/HSK_2.0/level5/合作.svg",
    "caption": "hợp tác"
  },
  "恨": {
    "file": "恨.svg",
    "src": "images/HSK_2.0/level5/恨.svg",
    "caption": "thù hận, ghét"
  },
  "猴子": {
    "file": "猴子.svg",
    "src": "images/HSK_2.0/level5/猴子.svg",
    "caption": "con khỉ"
  },
  "后背": {
    "file": "后背.svg",
    "src": "images/HSK_2.0/level5/后背.svg",
    "caption": "lưng (cơ thể)"
  },
  "忽视": {
    "file": "忽视.svg",
    "src": "images/HSK_2.0/level5/忽视.svg",
    "caption": "xem nhẹ, bỏ qua"
  },
  "壶": {
    "file": "壶.svg",
    "src": "images/HSK_2.0/level5/壶.svg",
    "caption": "cái bình, ấm"
  },
  "胡说": {
    "file": "胡说.svg",
    "src": "images/HSK_2.0/level5/胡说.svg",
    "caption": "nói nhăng, nói bừa"
  },
  "糊涂": {
    "file": "糊涂.svg",
    "src": "images/HSK_2.0/level5/糊涂.svg",
    "caption": "mơ hồ, lú lẫn"
  },
  "花生": {
    "file": "花生.svg",
    "src": "images/HSK_2.0/level5/花生.svg",
    "caption": "đậu phộng"
  },
  "划": {
    "file": "划.svg",
    "src": "images/HSK_2.0/level5/划.svg",
    "caption": "chèo (thuyền)"
  },
  "话题": {
    "file": "话题.svg",
    "src": "images/HSK_2.0/level5/话题.svg",
    "caption": "chủ đề"
  },
  "怀念": {
    "file": "怀念.svg",
    "src": "images/HSK_2.0/level5/怀念.svg",
    "caption": "hoài niệm, nhớ nhung"
  },
  "怀孕": {
    "file": "怀孕.svg",
    "src": "images/HSK_2.0/level5/怀孕.svg",
    "caption": "mang thai"
  },
  "慌张": {
    "file": "慌张.svg",
    "src": "images/HSK_2.0/level5/慌张.svg",
    "caption": "hoảng loạn, luống cuống"
  },
  "黄金": {
    "file": "黄金.svg",
    "src": "images/HSK_2.0/level5/黄金.svg",
    "caption": "vàng"
  },
  "灰": {
    "file": "灰.svg",
    "src": "images/HSK_2.0/level5/灰.svg",
    "caption": "màu xám, tro"
  },
  "灰心": {
    "file": "灰心.svg",
    "src": "images/HSK_2.0/level5/灰心.svg",
    "caption": "nản lòng, chán nản"
  },
  "婚礼": {
    "file": "婚礼.svg",
    "src": "images/HSK_2.0/level5/婚礼.svg",
    "caption": "lễ cưới"
  },
  "活跃": {
    "file": "活跃.svg",
    "src": "images/HSK_2.0/level5/活跃.svg",
    "caption": "sôi động, năng động"
  },
  "伙伴": {
    "file": "伙伴.svg",
    "src": "images/HSK_2.0/level5/伙伴.svg",
    "caption": "bạn đồng hành"
  },
  "或许": {
    "file": "或许.svg",
    "src": "images/HSK_2.0/level5/或许.svg",
    "caption": "có thể, có lẽ"
  },
  "基本": {
    "file": "基本.svg",
    "src": "images/HSK_2.0/level5/基本.svg",
    "caption": "cơ bản"
  },
  "机器": {
    "file": "机器.svg",
    "src": "images/HSK_2.0/level5/机器.svg",
    "caption": "máy móc"
  },
  "及格": {
    "file": "及格.svg",
    "src": "images/HSK_2.0/level5/及格.svg",
    "caption": "đạt yêu cầu, đủ điểm"
  },
  "集合": {
    "file": "集合.svg",
    "src": "images/HSK_2.0/level5/集合.svg",
    "caption": "tập hợp"
  },
  "集中": {
    "file": "集中.svg",
    "src": "images/HSK_2.0/level5/集中.svg",
    "caption": "tập trung"
  },
  "急诊": {
    "file": "急诊.svg",
    "src": "images/HSK_2.0/level5/急诊.svg",
    "caption": "cấp cứu"
  },
  "记忆": {
    "file": "记忆.svg",
    "src": "images/HSK_2.0/level5/记忆.svg",
    "caption": "ký ức, ghi nhớ"
  },
  "纪录": {
    "file": "纪录.svg",
    "src": "images/HSK_2.0/level5/纪录.svg",
    "caption": "kỷ lục"
  },
  "纪念": {
    "file": "纪念.svg",
    "src": "images/HSK_2.0/level5/纪念.svg",
    "caption": "lưu niệm, kỷ niệm"
  },
  "家务": {
    "file": "家务.svg",
    "src": "images/HSK_2.0/level5/家务.svg",
    "caption": "công việc nhà"
  },
  "嘉宾": {
    "file": "嘉宾.svg",
    "src": "images/HSK_2.0/level5/嘉宾.svg",
    "caption": "khách quý"
  },
  "甲": {
    "file": "甲.svg",
    "src": "images/HSK_2.0/level5/甲.svg",
    "caption": "móng (tay/chân); thứ nhất"
  },
  "假如": {
    "file": "假如.svg",
    "src": "images/HSK_2.0/level5/假如.svg",
    "caption": "nếu, giả như"
  },
  "假装": {
    "file": "假装.svg",
    "src": "images/HSK_2.0/level5/假装.svg",
    "caption": "giả vờ"
  },
  "驾驶": {
    "file": "驾驶.svg",
    "src": "images/HSK_2.0/level5/驾驶.svg",
    "caption": "lái (xe)"
  },
  "坚强": {
    "file": "坚强.svg",
    "src": "images/HSK_2.0/level5/坚强.svg",
    "caption": "kiên cường"
  },
  "艰苦": {
    "file": "艰苦.svg",
    "src": "images/HSK_2.0/level5/艰苦.svg",
    "caption": "gian khổ"
  },
  "捡": {
    "file": "捡.svg",
    "src": "images/HSK_2.0/level5/捡.svg",
    "caption": "nhặt, lượm"
  },
  "简直": {
    "file": "简直.svg",
    "src": "images/HSK_2.0/level5/简直.svg",
    "caption": "thật là, đơn giản là"
  },
  "健身": {
    "file": "健身.svg",
    "src": "images/HSK_2.0/level5/健身.svg",
    "caption": "thể hình, tập gym"
  },
  "建设": {
    "file": "建设.svg",
    "src": "images/HSK_2.0/level5/建设.svg",
    "caption": "xây dựng"
  },
  "建筑": {
    "file": "建筑.svg",
    "src": "images/HSK_2.0/level5/建筑.svg",
    "caption": "kiến trúc, công trình"
  },
  "键盘": {
    "file": "键盘.svg",
    "src": "images/HSK_2.0/level5/键盘.svg",
    "caption": "bàn phím"
  },
  "讲座": {
    "file": "讲座.svg",
    "src": "images/HSK_2.0/level5/讲座.svg",
    "caption": "buổi giảng, bài giảng"
  },
  "酱油": {
    "file": "酱油.svg",
    "src": "images/HSK_2.0/level5/酱油.svg",
    "caption": "nước tương, xì dầu"
  },
  "浇": {
    "file": "浇.svg",
    "src": "images/HSK_2.0/level5/浇.svg",
    "caption": "tưới, rưới"
  },
  "交换": {
    "file": "交换.svg",
    "src": "images/HSK_2.0/level5/交换.svg",
    "caption": "trao đổi"
  },
  "交往": {
    "file": "交往.svg",
    "src": "images/HSK_2.0/level5/交往.svg",
    "caption": "giao tiếp, qua lại"
  },
  "角度": {
    "file": "角度.svg",
    "src": "images/HSK_2.0/level5/角度.svg",
    "caption": "góc độ"
  },
  "教材": {
    "file": "教材.svg",
    "src": "images/HSK_2.0/level5/教材.svg",
    "caption": "giáo trình, tài liệu giảng dạy"
  },
  "教训": {
    "file": "教训.svg",
    "src": "images/HSK_2.0/level5/教训.svg",
    "caption": "bài học, giáo huấn"
  },
  "接待": {
    "file": "接待.svg",
    "src": "images/HSK_2.0/level5/接待.svg",
    "caption": "tiếp đón"
  },
  "结实": {
    "file": "结实.svg",
    "src": "images/HSK_2.0/level5/结实.svg",
    "caption": "chắc chắn, khỏe mạnh"
  },
  "节省": {
    "file": "节省.svg",
    "src": "images/HSK_2.0/level5/节省.svg",
    "caption": "tiết kiệm"
  },
  "结构": {
    "file": "结构.svg",
    "src": "images/HSK_2.0/level5/结构.svg",
    "caption": "cấu trúc"
  },
  "结合": {
    "file": "结合.svg",
    "src": "images/HSK_2.0/level5/结合.svg",
    "caption": "kết hợp"
  },
  "结论": {
    "file": "结论.svg",
    "src": "images/HSK_2.0/level5/结论.svg",
    "caption": "kết luận"
  },
  "结账": {
    "file": "结账.svg",
    "src": "images/HSK_2.0/level5/结账.svg",
    "caption": "tính tiền, thanh toán"
  },
  "届": {
    "file": "届.svg",
    "src": "images/HSK_2.0/level5/届.svg",
    "caption": "khóa, kỳ (lượng từ)"
  },
  "借口": {
    "file": "借口.svg",
    "src": "images/HSK_2.0/level5/借口.svg",
    "caption": "cái cớ"
  },
  "戒": {
    "file": "戒.svg",
    "src": "images/HSK_2.0/level5/戒.svg",
    "caption": "bỏ, từ bỏ (thói xấu)"
  },
  "紧急": {
    "file": "紧急.svg",
    "src": "images/HSK_2.0/level5/紧急.svg",
    "caption": "cấp bách, khẩn cấp"
  },
  "尽快": {
    "file": "尽快.svg",
    "src": "images/HSK_2.0/level5/尽快.svg",
    "caption": "càng nhanh càng tốt"
  },
  "谨慎": {
    "file": "谨慎.svg",
    "src": "images/HSK_2.0/level5/谨慎.svg",
    "caption": "cẩn trọng"
  },
  "进步": {
    "file": "进步.svg",
    "src": "images/HSK_2.0/level5/进步.svg",
    "caption": "tiến bộ"
  },
  "近代": {
    "file": "近代.svg",
    "src": "images/HSK_2.0/level5/近代.svg",
    "caption": "thời cận đại"
  },
  "尽量": {
    "file": "尽量.svg",
    "src": "images/HSK_2.0/level5/尽量.svg",
    "caption": "cố gắng hết mức"
  },
  "精神": {
    "file": "精神.svg",
    "src": "images/HSK_2.0/level5/精神.svg",
    "caption": "tinh thần"
  },
  "经典": {
    "file": "经典.svg",
    "src": "images/HSK_2.0/level5/经典.svg",
    "caption": "cổ điển, kinh điển"
  },
  "救": {
    "file": "救.svg",
    "src": "images/HSK_2.0/level5/救.svg",
    "caption": "cứu"
  },
  "舅舅": {
    "file": "舅舅.svg",
    "src": "images/HSK_2.0/level5/舅舅.svg",
    "caption": "cậu (em/anh trai của mẹ)"
  },
  "桔子": {
    "file": "桔子.svg",
    "src": "images/HSK_2.0/level5/桔子.svg",
    "caption": "quả quýt"
  },
  "具备": {
    "file": "具备.svg",
    "src": "images/HSK_2.0/level5/具备.svg",
    "caption": "có đủ, có sẵn"
  },
  "巨大": {
    "file": "巨大.svg",
    "src": "images/HSK_2.0/level5/巨大.svg",
    "caption": "to lớn"
  },
  "决赛": {
    "file": "决赛.svg",
    "src": "images/HSK_2.0/level5/决赛.svg",
    "caption": "trận chung kết"
  },
  "绝对": {
    "file": "绝对.svg",
    "src": "images/HSK_2.0/level5/绝对.svg",
    "caption": "tuyệt đối"
  },
  "军事": {
    "file": "军事.svg",
    "src": "images/HSK_2.0/level5/军事.svg",
    "caption": "quân sự"
  },
  "开放": {
    "file": "开放.svg",
    "src": "images/HSK_2.0/level5/开放.svg",
    "caption": "mở cửa, khai phóng"
  },
  "开水": {
    "file": "开水.svg",
    "src": "images/HSK_2.0/level5/开水.svg",
    "caption": "nước sôi"
  },
  "砍": {
    "file": "砍.svg",
    "src": "images/HSK_2.0/level5/砍.svg",
    "caption": "chặt, đốn"
  },
  "看不起": {
    "file": "看不起.svg",
    "src": "images/HSK_2.0/level5/看不起.svg",
    "caption": "coi thường, khinh thường"
  },
  "可见": {
    "file": "可见.svg",
    "src": "images/HSK_2.0/level5/可见.svg",
    "caption": "có thể thấy, rõ ràng là"
  },
  "可怕": {
    "file": "可怕.svg",
    "src": "images/HSK_2.0/level5/可怕.svg",
    "caption": "đáng sợ"
  },
  "克": {
    "file": "克.svg",
    "src": "images/HSK_2.0/level5/克.svg",
    "caption": "gram"
  },
  "客观": {
    "file": "客观.svg",
    "src": "images/HSK_2.0/level5/客观.svg",
    "caption": "khách quan"
  },
  "控制": {
    "file": "控制.svg",
    "src": "images/HSK_2.0/level5/控制.svg",
    "caption": "kiểm soát"
  },
  "口味": {
    "file": "口味.svg",
    "src": "images/HSK_2.0/level5/口味.svg",
    "caption": "khẩu vị"
  },
  "夸": {
    "file": "夸.svg",
    "src": "images/HSK_2.0/level5/夸.svg",
    "caption": "khen ngợi, khoe khoang"
  },
  "扩大": {
    "file": "扩大.svg",
    "src": "images/HSK_2.0/level5/扩大.svg",
    "caption": "mở rộng"
  },
  "辣椒": {
    "file": "辣椒.svg",
    "src": "images/HSK_2.0/level5/辣椒.svg",
    "caption": "ớt"
  },
  "烂": {
    "file": "烂.svg",
    "src": "images/HSK_2.0/level5/烂.svg",
    "caption": "thối, nát, hỏng"
  },
  "劳动": {
    "file": "劳动.svg",
    "src": "images/HSK_2.0/level5/劳动.svg",
    "caption": "lao động"
  },
  "老板": {
    "file": "老板.svg",
    "src": "images/HSK_2.0/level5/老板.svg",
    "caption": "ông chủ"
  },
  "老鼠": {
    "file": "老鼠.svg",
    "src": "images/HSK_2.0/level5/老鼠.svg",
    "caption": "con chuột"
  },
  "姥姥": {
    "file": "姥姥.svg",
    "src": "images/HSK_2.0/level5/姥姥.svg",
    "caption": "bà ngoại"
  },
  "理论": {
    "file": "理论.svg",
    "src": "images/HSK_2.0/level5/理论.svg",
    "caption": "lý luận"
  },
  "理由": {
    "file": "理由.svg",
    "src": "images/HSK_2.0/level5/理由.svg",
    "caption": "lý do"
  },
  "立刻": {
    "file": "立刻.svg",
    "src": "images/HSK_2.0/level5/立刻.svg",
    "caption": "ngay lập tức"
  },
  "力量": {
    "file": "力量.svg",
    "src": "images/HSK_2.0/level5/力量.svg",
    "caption": "lực lượng, sức mạnh"
  },
  "利息": {
    "file": "利息.svg",
    "src": "images/HSK_2.0/level5/利息.svg",
    "caption": "tiền lãi"
  },
  "利用": {
    "file": "利用.svg",
    "src": "images/HSK_2.0/level5/利用.svg",
    "caption": "lợi dụng, tận dụng"
  },
  "连忙": {
    "file": "连忙.svg",
    "src": "images/HSK_2.0/level5/连忙.svg",
    "caption": "vội vàng, lập tức"
  },
  "联合": {
    "file": "联合.svg",
    "src": "images/HSK_2.0/level5/联合.svg",
    "caption": "liên hợp, liên minh"
  },
  "了不起": {
    "file": "了不起.svg",
    "src": "images/HSK_2.0/level5/了不起.svg",
    "caption": "tuyệt vời, đáng khâm phục"
  },
  "列车": {
    "file": "列车.svg",
    "src": "images/HSK_2.0/level5/列车.svg",
    "caption": "đoàn tàu"
  },
  "临时": {
    "file": "临时.svg",
    "src": "images/HSK_2.0/level5/临时.svg",
    "caption": "tạm thời"
  },
  "灵活": {
    "file": "灵活.svg",
    "src": "images/HSK_2.0/level5/灵活.svg",
    "caption": "linh hoạt"
  },
  "领域": {
    "file": "领域.svg",
    "src": "images/HSK_2.0/level5/领域.svg",
    "caption": "lĩnh vực"
  },
  "流传": {
    "file": "流传.svg",
    "src": "images/HSK_2.0/level5/流传.svg",
    "caption": "lưu truyền"
  },
  "浏览": {
    "file": "浏览.svg",
    "src": "images/HSK_2.0/level5/浏览.svg",
    "caption": "xem qua, lướt qua"
  },
  "龙": {
    "file": "龙.svg",
    "src": "images/HSK_2.0/level5/龙.svg",
    "caption": "con rồng"
  },
  "漏": {
    "file": "漏.svg",
    "src": "images/HSK_2.0/level5/漏.svg",
    "caption": "rò, lọt, dò"
  },
  "陆地": {
    "file": "陆地.svg",
    "src": "images/HSK_2.0/level5/陆地.svg",
    "caption": "đất liền"
  },
  "录取": {
    "file": "录取.svg",
    "src": "images/HSK_2.0/level5/录取.svg",
    "caption": "tuyển vào, trúng tuyển"
  },
  "论文": {
    "file": "论文.svg",
    "src": "images/HSK_2.0/level5/论文.svg",
    "caption": "luận văn"
  },
  "落后": {
    "file": "落后.svg",
    "src": "images/HSK_2.0/level5/落后.svg",
    "caption": "lạc hậu, tụt hậu"
  },
  "骂": {
    "file": "骂.svg",
    "src": "images/HSK_2.0/level5/骂.svg",
    "caption": "mắng, chửi"
  },
  "麦克风": {
    "file": "麦克风.svg",
    "src": "images/HSK_2.0/level5/麦克风.svg",
    "caption": "microphone"
  },
  "满足": {
    "file": "满足.svg",
    "src": "images/HSK_2.0/level5/满足.svg",
    "caption": "thỏa mãn"
  },
  "冒险": {
    "file": "冒险.svg",
    "src": "images/HSK_2.0/level5/冒险.svg",
    "caption": "mạo hiểm"
  },
  "眉毛": {
    "file": "眉毛.svg",
    "src": "images/HSK_2.0/level5/眉毛.svg",
    "caption": "lông mày"
  },
  "美术": {
    "file": "美术.svg",
    "src": "images/HSK_2.0/level5/美术.svg",
    "caption": "mỹ thuật"
  },
  "秘密": {
    "file": "秘密.svg",
    "src": "images/HSK_2.0/level5/秘密.svg",
    "caption": "bí mật"
  },
  "面对": {
    "file": "面对.svg",
    "src": "images/HSK_2.0/level5/面对.svg",
    "caption": "đối mặt"
  },
  "面临": {
    "file": "面临.svg",
    "src": "images/HSK_2.0/level5/面临.svg",
    "caption": "đối diện, đứng trước"
  },
  "苗条": {
    "file": "苗条.svg",
    "src": "images/HSK_2.0/level5/苗条.svg",
    "caption": "thon thả, mảnh mai"
  },
  "明确": {
    "file": "明确.svg",
    "src": "images/HSK_2.0/level5/明确.svg",
    "caption": "rõ ràng, minh xác"
  },
  "明显": {
    "file": "明显.svg",
    "src": "images/HSK_2.0/level5/明显.svg",
    "caption": "rõ rệt, hiển nhiên"
  },
  "名牌": {
    "file": "名牌.svg",
    "src": "images/HSK_2.0/level5/名牌.svg",
    "caption": "nhãn hiệu nổi tiếng"
  },
  "名胜古迹": {
    "file": "名胜古迹.svg",
    "src": "images/HSK_2.0/level5/名胜古迹.svg",
    "caption": "danh lam thắng cảnh"
  },
  "命令": {
    "file": "命令.svg",
    "src": "images/HSK_2.0/level5/命令.svg",
    "caption": "lệnh, mệnh lệnh"
  },
  "摸": {
    "file": "摸.svg",
    "src": "images/HSK_2.0/level5/摸.svg",
    "caption": "sờ, chạm"
  },
  "模糊": {
    "file": "模糊.svg",
    "src": "images/HSK_2.0/level5/模糊.svg",
    "caption": "mơ hồ, mờ nhạt"
  },
  "摩托车": {
    "file": "摩托车.svg",
    "src": "images/HSK_2.0/level5/摩托车.svg",
    "caption": "xe máy"
  },
  "某": {
    "file": "某.svg",
    "src": "images/HSK_2.0/level5/某.svg",
    "caption": "một, nào đó"
  },
  "目标": {
    "file": "目标.svg",
    "src": "images/HSK_2.0/level5/目标.svg",
    "caption": "mục tiêu"
  },
  "目录": {
    "file": "目录.svg",
    "src": "images/HSK_2.0/level5/目录.svg",
    "caption": "mục lục, danh mục"
  },
  "木头": {
    "file": "木头.svg",
    "src": "images/HSK_2.0/level5/木头.svg",
    "caption": "gỗ"
  },
  "哪怕": {
    "file": "哪怕.svg",
    "src": "images/HSK_2.0/level5/哪怕.svg",
    "caption": "dù cho, dù là"
  },
  "难免": {
    "file": "难免.svg",
    "src": "images/HSK_2.0/level5/难免.svg",
    "caption": "khó tránh khỏi"
  },
  "脑袋": {
    "file": "脑袋.svg",
    "src": "images/HSK_2.0/level5/脑袋.svg",
    "caption": "cái đầu"
  },
  "内科": {
    "file": "内科.svg",
    "src": "images/HSK_2.0/level5/内科.svg",
    "caption": "khoa nội (y học)"
  },
  "嫩": {
    "file": "嫩.svg",
    "src": "images/HSK_2.0/level5/嫩.svg",
    "caption": "non, mềm"
  },
  "能干": {
    "file": "能干.svg",
    "src": "images/HSK_2.0/level5/能干.svg",
    "caption": "có năng lực, tài giỏi"
  },
  "能源": {
    "file": "能源.svg",
    "src": "images/HSK_2.0/level5/能源.svg",
    "caption": "năng lượng"
  },
  "年代": {
    "file": "年代.svg",
    "src": "images/HSK_2.0/level5/年代.svg",
    "caption": "niên đại, thời đại"
  },
  "年纪": {
    "file": "年纪.svg",
    "src": "images/HSK_2.0/level5/年纪.svg",
    "caption": "tuổi tác"
  },
  "宁可": {
    "file": "宁可.svg",
    "src": "images/HSK_2.0/level5/宁可.svg",
    "caption": "thà rằng"
  },
  "牛仔裤": {
    "file": "牛仔裤.svg",
    "src": "images/HSK_2.0/level5/牛仔裤.svg",
    "caption": "quần jean"
  },
  "农村": {
    "file": "农村.svg",
    "src": "images/HSK_2.0/level5/农村.svg",
    "caption": "nông thôn"
  },
  "农业": {
    "file": "农业.svg",
    "src": "images/HSK_2.0/level5/农业.svg",
    "caption": "nông nghiệp"
  },
  "女士": {
    "file": "女士.svg",
    "src": "images/HSK_2.0/level5/女士.svg",
    "caption": "quý bà, bà (xưng hô)"
  },
  "派": {
    "file": "派.svg",
    "src": "images/HSK_2.0/level5/派.svg",
    "caption": "cử, phái"
  },
  "赔偿": {
    "file": "赔偿.svg",
    "src": "images/HSK_2.0/level5/赔偿.svg",
    "caption": "đền bù"
  },
  "培养": {
    "file": "培养.svg",
    "src": "images/HSK_2.0/level5/培养.svg",
    "caption": "bồi dưỡng, nuôi dưỡng"
  },
  "配合": {
    "file": "配合.svg",
    "src": "images/HSK_2.0/level5/配合.svg",
    "caption": "phối hợp"
  },
  "披": {
    "file": "披.svg",
    "src": "images/HSK_2.0/level5/披.svg",
    "caption": "khoác, choàng"
  },
  "片面": {
    "file": "片面.svg",
    "src": "images/HSK_2.0/level5/片面.svg",
    "caption": "một chiều, thiên lệch"
  },
  "拼音": {
    "file": "拼音.svg",
    "src": "images/HSK_2.0/level5/拼音.svg",
    "caption": "phiên âm (pinyin)"
  },
  "平": {
    "file": "平.svg",
    "src": "images/HSK_2.0/level5/平.svg",
    "caption": "bằng, phẳng"
  },
  "平常": {
    "file": "平常.svg",
    "src": "images/HSK_2.0/level5/平常.svg",
    "caption": "bình thường, thường ngày"
  },
  "平方": {
    "file": "平方.svg",
    "src": "images/HSK_2.0/level5/平方.svg",
    "caption": "bình phương, vuông"
  },
  "平静": {
    "file": "平静.svg",
    "src": "images/HSK_2.0/level5/平静.svg",
    "caption": "bình tĩnh, yên tĩnh"
  },
  "评价": {
    "file": "评价.svg",
    "src": "images/HSK_2.0/level5/评价.svg",
    "caption": "đánh giá"
  },
  "破坏": {
    "file": "破坏.svg",
    "src": "images/HSK_2.0/level5/破坏.svg",
    "caption": "phá hoại"
  },
  "期待": {
    "file": "期待.svg",
    "src": "images/HSK_2.0/level5/期待.svg",
    "caption": "mong đợi, kỳ vọng"
  },
  "奇迹": {
    "file": "奇迹.svg",
    "src": "images/HSK_2.0/level5/奇迹.svg",
    "caption": "kỳ tích, điều kỳ diệu"
  },
  "启发": {
    "file": "启发.svg",
    "src": "images/HSK_2.0/level5/启发.svg",
    "caption": "khơi gợi, gợi mở"
  },
  "气氛": {
    "file": "气氛.svg",
    "src": "images/HSK_2.0/level5/气氛.svg",
    "caption": "không khí, bầu không khí"
  },
  "汽油": {
    "file": "汽油.svg",
    "src": "images/HSK_2.0/level5/汽油.svg",
    "caption": "xăng"
  },
  "谦虚": {
    "file": "谦虚.svg",
    "src": "images/HSK_2.0/level5/谦虚.svg",
    "caption": "khiêm tốn"
  },
  "签": {
    "file": "签.svg",
    "src": "images/HSK_2.0/level5/签.svg",
    "caption": "ký (tên)"
  },
  "浅": {
    "file": "浅.svg",
    "src": "images/HSK_2.0/level5/浅.svg",
    "caption": "cạn, nông"
  },
  "枪": {
    "file": "枪.svg",
    "src": "images/HSK_2.0/level5/枪.svg",
    "caption": "súng"
  },
  "强调": {
    "file": "强调.svg",
    "src": "images/HSK_2.0/level5/强调.svg",
    "caption": "nhấn mạnh"
  },
  "抢": {
    "file": "抢.svg",
    "src": "images/HSK_2.0/level5/抢.svg",
    "caption": "giành, cướp"
  },
  "悄悄": {
    "file": "悄悄.svg",
    "src": "images/HSK_2.0/level5/悄悄.svg",
    "caption": "lặng lẽ, êm ru"
  },
  "瞧": {
    "file": "瞧.svg",
    "src": "images/HSK_2.0/level5/瞧.svg",
    "caption": "nhìn, xem"
  },
  "巧妙": {
    "file": "巧妙.svg",
    "src": "images/HSK_2.0/level5/巧妙.svg",
    "caption": "khéo léo, tài tình"
  },
  "亲爱": {
    "file": "亲爱.svg",
    "src": "images/HSK_2.0/level5/亲爱.svg",
    "caption": "thân yêu"
  },
  "亲切": {
    "file": "亲切.svg",
    "src": "images/HSK_2.0/level5/亲切.svg",
    "caption": "thân thiết, gần gũi"
  },
  "勤奋": {
    "file": "勤奋.svg",
    "src": "images/HSK_2.0/level5/勤奋.svg",
    "caption": "chăm chỉ, cần cù"
  },
  "青春": {
    "file": "青春.svg",
    "src": "images/HSK_2.0/level5/青春.svg",
    "caption": "tuổi thanh xuân"
  },
  "轻视": {
    "file": "轻视.svg",
    "src": "images/HSK_2.0/level5/轻视.svg",
    "caption": "coi thường, xem nhẹ"
  },
  "请求": {
    "file": "请求.svg",
    "src": "images/HSK_2.0/level5/请求.svg",
    "caption": "thỉnh cầu, yêu cầu"
  },
  "球迷": {
    "file": "球迷.svg",
    "src": "images/HSK_2.0/level5/球迷.svg",
    "caption": "người mê bóng"
  },
  "趋势": {
    "file": "趋势.svg",
    "src": "images/HSK_2.0/level5/趋势.svg",
    "caption": "xu thế"
  },
  "去世": {
    "file": "去世.svg",
    "src": "images/HSK_2.0/level5/去世.svg",
    "caption": "qua đời"
  },
  "权力": {
    "file": "权力.svg",
    "src": "images/HSK_2.0/level5/权力.svg",
    "caption": "quyền lực"
  },
  "劝": {
    "file": "劝.svg",
    "src": "images/HSK_2.0/level5/劝.svg",
    "caption": "khuyên"
  },
  "缺乏": {
    "file": "缺乏.svg",
    "src": "images/HSK_2.0/level5/缺乏.svg",
    "caption": "thiếu thốn"
  },
  "确认": {
    "file": "确认.svg",
    "src": "images/HSK_2.0/level5/确认.svg",
    "caption": "xác nhận"
  },
  "群": {
    "file": "群.svg",
    "src": "images/HSK_2.0/level5/群.svg",
    "caption": "đám, nhóm (lượng từ)"
  },
  "燃烧": {
    "file": "燃烧.svg",
    "src": "images/HSK_2.0/level5/燃烧.svg",
    "caption": "đốt cháy"
  },
  "绕": {
    "file": "绕.svg",
    "src": "images/HSK_2.0/level5/绕.svg",
    "caption": "vòng quanh"
  },
  "热爱": {
    "file": "热爱.svg",
    "src": "images/HSK_2.0/level5/热爱.svg",
    "caption": "yêu mến, yêu thương"
  },
  "热心": {
    "file": "热心.svg",
    "src": "images/HSK_2.0/level5/热心.svg",
    "caption": "nhiệt tâm"
  },
  "人才": {
    "file": "人才.svg",
    "src": "images/HSK_2.0/level5/人才.svg",
    "caption": "nhân tài"
  },
  "人类": {
    "file": "人类.svg",
    "src": "images/HSK_2.0/level5/人类.svg",
    "caption": "loài người, nhân loại"
  },
  "人生": {
    "file": "人生.svg",
    "src": "images/HSK_2.0/level5/人生.svg",
    "caption": "cuộc đời, đời người"
  },
  "人物": {
    "file": "人物.svg",
    "src": "images/HSK_2.0/level5/人物.svg",
    "caption": "nhân vật"
  },
  "忍不住": {
    "file": "忍不住.svg",
    "src": "images/HSK_2.0/level5/忍不住.svg",
    "caption": "không chịu được, không kìm được"
  },
  "日程": {
    "file": "日程.svg",
    "src": "images/HSK_2.0/level5/日程.svg",
    "caption": "lịch trình"
  },
  "日历": {
    "file": "日历.svg",
    "src": "images/HSK_2.0/level5/日历.svg",
    "caption": "lịch (tờ)"
  },
  "日用品": {
    "file": "日用品.svg",
    "src": "images/HSK_2.0/level5/日用品.svg",
    "caption": "đồ dùng hàng ngày"
  },
  "如何": {
    "file": "如何.svg",
    "src": "images/HSK_2.0/level5/如何.svg",
    "caption": "như thế nào, làm sao"
  },
  "软件": {
    "file": "软件.svg",
    "src": "images/HSK_2.0/level5/软件.svg",
    "caption": "phần mềm"
  },
  "洒": {
    "file": "洒.svg",
    "src": "images/HSK_2.0/level5/洒.svg",
    "caption": "rảy, rắc"
  },
  "嗓子": {
    "file": "嗓子.svg",
    "src": "images/HSK_2.0/level5/嗓子.svg",
    "caption": "cổ họng"
  },
  "沙滩": {
    "file": "沙滩.svg",
    "src": "images/HSK_2.0/level5/沙滩.svg",
    "caption": "bãi biển, bãi cát"
  },
  "晒": {
    "file": "晒.svg",
    "src": "images/HSK_2.0/level5/晒.svg",
    "caption": "phơi nắng"
  },
  "闪电": {
    "file": "闪电.svg",
    "src": "images/HSK_2.0/level5/闪电.svg",
    "caption": "tia chớp, sét"
  },
  "善于": {
    "file": "善于.svg",
    "src": "images/HSK_2.0/level5/善于.svg",
    "caption": "giỏi về, sở trường"
  },
  "商品": {
    "file": "商品.svg",
    "src": "images/HSK_2.0/level5/商品.svg",
    "caption": "hàng hóa"
  },
  "商务": {
    "file": "商务.svg",
    "src": "images/HSK_2.0/level5/商务.svg",
    "caption": "thương vụ, công việc kinh doanh"
  },
  "伤害": {
    "file": "伤害.svg",
    "src": "images/HSK_2.0/level5/伤害.svg",
    "caption": "làm tổn hại"
  },
  "舍不得": {
    "file": "舍不得.svg",
    "src": "images/HSK_2.0/level5/舍不得.svg",
    "caption": "không nỡ, tiếc không muốn"
  },
  "设计": {
    "file": "设计.svg",
    "src": "images/HSK_2.0/level5/设计.svg",
    "caption": "thiết kế"
  },
  "摄影": {
    "file": "摄影.svg",
    "src": "images/HSK_2.0/level5/摄影.svg",
    "caption": "chụp ảnh, nhiếp ảnh"
  },
  "伸": {
    "file": "伸.svg",
    "src": "images/HSK_2.0/level5/伸.svg",
    "caption": "duỗi, thò ra"
  },
  "深刻": {
    "file": "深刻.svg",
    "src": "images/HSK_2.0/level5/深刻.svg",
    "caption": "sâu sắc"
  },
  "身份": {
    "file": "身份.svg",
    "src": "images/HSK_2.0/level5/身份.svg",
    "caption": "thân phận, danh phận"
  },
  "神秘": {
    "file": "神秘.svg",
    "src": "images/HSK_2.0/level5/神秘.svg",
    "caption": "thần bí, huyền bí"
  },
  "生动": {
    "file": "生动.svg",
    "src": "images/HSK_2.0/level5/生动.svg",
    "caption": "sinh động"
  },
  "生长": {
    "file": "生长.svg",
    "src": "images/HSK_2.0/level5/生长.svg",
    "caption": "sinh trưởng"
  },
  "诗": {
    "file": "诗.svg",
    "src": "images/HSK_2.0/level5/诗.svg",
    "caption": "thơ"
  },
  "失眠": {
    "file": "失眠.svg",
    "src": "images/HSK_2.0/level5/失眠.svg",
    "caption": "mất ngủ"
  },
  "狮子": {
    "file": "狮子.svg",
    "src": "images/HSK_2.0/level5/狮子.svg",
    "caption": "con sư tử"
  },
  "时代": {
    "file": "时代.svg",
    "src": "images/HSK_2.0/level5/时代.svg",
    "caption": "thời đại"
  },
  "时髦": {
    "file": "时髦.svg",
    "src": "images/HSK_2.0/level5/时髦.svg",
    "caption": "thời trang, hợp thời"
  },
  "时尚": {
    "file": "时尚.svg",
    "src": "images/HSK_2.0/level5/时尚.svg",
    "caption": "thời thượng"
  },
  "实习": {
    "file": "实习.svg",
    "src": "images/HSK_2.0/level5/实习.svg",
    "caption": "thực tập"
  },
  "实验": {
    "file": "实验.svg",
    "src": "images/HSK_2.0/level5/实验.svg",
    "caption": "thí nghiệm, thực nghiệm"
  },
  "石头": {
    "file": "石头.svg",
    "src": "images/HSK_2.0/level5/石头.svg",
    "caption": "đá"
  },
  "使劲儿": {
    "file": "使劲儿.svg",
    "src": "images/HSK_2.0/level5/使劲儿.svg",
    "caption": "dồn hết sức"
  },
  "始终": {
    "file": "始终.svg",
    "src": "images/HSK_2.0/level5/始终.svg",
    "caption": "trước sau, luôn luôn"
  },
  "试卷": {
    "file": "试卷.svg",
    "src": "images/HSK_2.0/level5/试卷.svg",
    "caption": "bài thi, đề thi"
  },
  "市场": {
    "file": "市场.svg",
    "src": "images/HSK_2.0/level5/市场.svg",
    "caption": "thị trường, chợ"
  },
  "事物": {
    "file": "事物.svg",
    "src": "images/HSK_2.0/level5/事物.svg",
    "caption": "sự vật"
  },
  "收据": {
    "file": "收据.svg",
    "src": "images/HSK_2.0/level5/收据.svg",
    "caption": "biên nhận, hóa đơn"
  },
  "手工": {
    "file": "手工.svg",
    "src": "images/HSK_2.0/level5/手工.svg",
    "caption": "thủ công"
  },
  "手术": {
    "file": "手术.svg",
    "src": "images/HSK_2.0/level5/手术.svg",
    "caption": "ca phẫu thuật"
  },
  "手续": {
    "file": "手续.svg",
    "src": "images/HSK_2.0/level5/手续.svg",
    "caption": "thủ tục"
  },
  "首": {
    "file": "首.svg",
    "src": "images/HSK_2.0/level5/首.svg",
    "caption": "đầu, người đứng đầu"
  },
  "受伤": {
    "file": "受伤.svg",
    "src": "images/HSK_2.0/level5/受伤.svg",
    "caption": "bị thương"
  },
  "寿命": {
    "file": "寿命.svg",
    "src": "images/HSK_2.0/level5/寿命.svg",
    "caption": "tuổi thọ"
  },
  "书架": {
    "file": "书架.svg",
    "src": "images/HSK_2.0/level5/书架.svg",
    "caption": "giá sách"
  },
  "输入": {
    "file": "输入.svg",
    "src": "images/HSK_2.0/level5/输入.svg",
    "caption": "nhập vào"
  },
  "熟练": {
    "file": "熟练.svg",
    "src": "images/HSK_2.0/level5/熟练.svg",
    "caption": "thành thục, thuần thục"
  },
  "鼠标": {
    "file": "鼠标.svg",
    "src": "images/HSK_2.0/level5/鼠标.svg",
    "caption": "con chuột (máy tính)"
  },
  "数据": {
    "file": "数据.svg",
    "src": "images/HSK_2.0/level5/数据.svg",
    "caption": "số liệu, dữ liệu"
  },
  "数码": {
    "file": "数码.svg",
    "src": "images/HSK_2.0/level5/数码.svg",
    "caption": "kỹ thuật số"
  },
  "摔倒": {
    "file": "摔倒.svg",
    "src": "images/HSK_2.0/level5/摔倒.svg",
    "caption": "ngã, té"
  },
  "双方": {
    "file": "双方.svg",
    "src": "images/HSK_2.0/level5/双方.svg",
    "caption": "hai bên, đôi bên"
  },
  "税": {
    "file": "税.svg",
    "src": "images/HSK_2.0/level5/税.svg",
    "caption": "thuế"
  },
  "说服": {
    "file": "说服.svg",
    "src": "images/HSK_2.0/level5/说服.svg",
    "caption": "thuyết phục"
  },
  "丝绸": {
    "file": "丝绸.svg",
    "src": "images/HSK_2.0/level5/丝绸.svg",
    "caption": "lụa, tơ lụa"
  },
  "思想": {
    "file": "思想.svg",
    "src": "images/HSK_2.0/level5/思想.svg",
    "caption": "tư tưởng, suy nghĩ"
  },
  "似乎": {
    "file": "似乎.svg",
    "src": "images/HSK_2.0/level5/似乎.svg",
    "caption": "dường như, có vẻ"
  },
  "随身": {
    "file": "随身.svg",
    "src": "images/HSK_2.0/level5/随身.svg",
    "caption": "mang theo người"
  },
  "碎": {
    "file": "碎.svg",
    "src": "images/HSK_2.0/level5/碎.svg",
    "caption": "vỡ, vụn"
  },
  "损失": {
    "file": "损失.svg",
    "src": "images/HSK_2.0/level5/损失.svg",
    "caption": "tổn thất, thiệt hại"
  },
  "锁": {
    "file": "锁.svg",
    "src": "images/HSK_2.0/level5/锁.svg",
    "caption": "cái khóa"
  },
  "台阶": {
    "file": "台阶.svg",
    "src": "images/HSK_2.0/level5/台阶.svg",
    "caption": "bậc thang"
  },
  "太极拳": {
    "file": "太极拳.svg",
    "src": "images/HSK_2.0/level5/太极拳.svg",
    "caption": "Thái cực quyền"
  },
  "逃": {
    "file": "逃.svg",
    "src": "images/HSK_2.0/level5/逃.svg",
    "caption": "chạy trốn, trốn"
  },
  "淘气": {
    "file": "淘气.svg",
    "src": "images/HSK_2.0/level5/淘气.svg",
    "caption": "nghịch ngợm"
  },
  "讨价还价": {
    "file": "讨价还价.svg",
    "src": "images/HSK_2.0/level5/讨价还价.svg",
    "caption": "trả giá, kỳ kèo giá"
  },
  "套": {
    "file": "套.svg",
    "src": "images/HSK_2.0/level5/套.svg",
    "caption": "bộ,套 (lượng từ)"
  },
  "特色": {
    "file": "特色.svg",
    "src": "images/HSK_2.0/level5/特色.svg",
    "caption": "đặc sắc, nét đặc trưng"
  },
  "提倡": {
    "file": "提倡.svg",
    "src": "images/HSK_2.0/level5/提倡.svg",
    "caption": "đề xướng, khuyến khích"
  },
  "题目": {
    "file": "题目.svg",
    "src": "images/HSK_2.0/level5/题目.svg",
    "caption": "đề bài, tiêu đề"
  },
  "体贴": {
    "file": "体贴.svg",
    "src": "images/HSK_2.0/level5/体贴.svg",
    "caption": "ân cần, chu đáo"
  },
  "体验": {
    "file": "体验.svg",
    "src": "images/HSK_2.0/level5/体验.svg",
    "caption": "trải nghiệm"
  },
  "天空": {
    "file": "天空.svg",
    "src": "images/HSK_2.0/level5/天空.svg",
    "caption": "bầu trời"
  },
  "天真": {
    "file": "天真.svg",
    "src": "images/HSK_2.0/level5/天真.svg",
    "caption": "ngây thơ, hồn nhiên"
  },
  "调整": {
    "file": "调整.svg",
    "src": "images/HSK_2.0/level5/调整.svg",
    "caption": "điều chỉnh"
  },
  "通常": {
    "file": "通常.svg",
    "src": "images/HSK_2.0/level5/通常.svg",
    "caption": "thông thường"
  },
  "统一": {
    "file": "统一.svg",
    "src": "images/HSK_2.0/level5/统一.svg",
    "caption": "thống nhất"
  },
  "痛快": {
    "file": "痛快.svg",
    "src": "images/HSK_2.0/level5/痛快.svg",
    "caption": "thỏa thích, vui sướng"
  },
  "偷": {
    "file": "偷.svg",
    "src": "images/HSK_2.0/level5/偷.svg",
    "caption": "trộm, ăn cắp"
  },
  "投资": {
    "file": "投资.svg",
    "src": "images/HSK_2.0/level5/投资.svg",
    "caption": "đầu tư"
  },
  "突出": {
    "file": "突出.svg",
    "src": "images/HSK_2.0/level5/突出.svg",
    "caption": "nổi bật, đột xuất"
  },
  "土豆": {
    "file": "土豆.svg",
    "src": "images/HSK_2.0/level5/土豆.svg",
    "caption": "khoai tây"
  },
  "兔子": {
    "file": "兔子.svg",
    "src": "images/HSK_2.0/level5/兔子.svg",
    "caption": "con thỏ"
  },
  "推辞": {
    "file": "推辞.svg",
    "src": "images/HSK_2.0/level5/推辞.svg",
    "caption": "từ chối, khước từ"
  },
  "推荐": {
    "file": "推荐.svg",
    "src": "images/HSK_2.0/level5/推荐.svg",
    "caption": "đề cử, giới thiệu"
  },
  "退": {
    "file": "退.svg",
    "src": "images/HSK_2.0/level5/退.svg",
    "caption": "rút, lùi"
  },
  "退休": {
    "file": "退休.svg",
    "src": "images/HSK_2.0/level5/退休.svg",
    "caption": "nghỉ hưu"
  },
  "外公": {
    "file": "外公.svg",
    "src": "images/HSK_2.0/level5/外公.svg",
    "caption": "ông ngoại"
  },
  "完整": {
    "file": "完整.svg",
    "src": "images/HSK_2.0/level5/完整.svg",
    "caption": "hoàn chỉnh, đầy đủ"
  },
  "玩具": {
    "file": "玩具.svg",
    "src": "images/HSK_2.0/level5/玩具.svg",
    "caption": "đồ chơi"
  },
  "万一": {
    "file": "万一.svg",
    "src": "images/HSK_2.0/level5/万一.svg",
    "caption": "trong trường hợp, lỡ như"
  },
  "威胁": {
    "file": "威胁.svg",
    "src": "images/HSK_2.0/level5/威胁.svg",
    "caption": "đe dọa"
  },
  "维修": {
    "file": "维修.svg",
    "src": "images/HSK_2.0/level5/维修.svg",
    "caption": "bảo trì, sửa chữa"
  },
  "围绕": {
    "file": "围绕.svg",
    "src": "images/HSK_2.0/level5/围绕.svg",
    "caption": "xoay quanh"
  },
  "尾巴": {
    "file": "尾巴.svg",
    "src": "images/HSK_2.0/level5/尾巴.svg",
    "caption": "cái đuôi"
  },
  "委屈": {
    "file": "委屈.svg",
    "src": "images/HSK_2.0/level5/委屈.svg",
    "caption": "tủi thân, oan ức"
  },
  "胃": {
    "file": "胃.svg",
    "src": "images/HSK_2.0/level5/胃.svg",
    "caption": "dạ dày"
  },
  "位于": {
    "file": "位于.svg",
    "src": "images/HSK_2.0/level5/位于.svg",
    "caption": "nằm ở, tọa lạc"
  },
  "未必": {
    "file": "未必.svg",
    "src": "images/HSK_2.0/level5/未必.svg",
    "caption": "chưa hẳn, không nhất định"
  },
  "温柔": {
    "file": "温柔.svg",
    "src": "images/HSK_2.0/level5/温柔.svg",
    "caption": "dịu dàng, ôn nhu"
  },
  "文具": {
    "file": "文具.svg",
    "src": "images/HSK_2.0/level5/文具.svg",
    "caption": "văn phòng phẩm"
  },
  "文学": {
    "file": "文学.svg",
    "src": "images/HSK_2.0/level5/文学.svg",
    "caption": "văn học"
  },
  "稳定": {
    "file": "稳定.svg",
    "src": "images/HSK_2.0/level5/稳定.svg",
    "caption": "ổn định"
  },
  "问候": {
    "file": "问候.svg",
    "src": "images/HSK_2.0/level5/问候.svg",
    "caption": "hỏi thăm"
  },
  "卧室": {
    "file": "卧室.svg",
    "src": "images/HSK_2.0/level5/卧室.svg",
    "caption": "phòng ngủ"
  },
  "无数": {
    "file": "无数.svg",
    "src": "images/HSK_2.0/level5/无数.svg",
    "caption": "vô số"
  },
  "勿": {
    "file": "勿.svg",
    "src": "images/HSK_2.0/level5/勿.svg",
    "caption": "không, đừng"
  },
  "物质": {
    "file": "物质.svg",
    "src": "images/HSK_2.0/level5/物质.svg",
    "caption": "vật chất"
  },
  "吸取": {
    "file": "吸取.svg",
    "src": "images/HSK_2.0/level5/吸取.svg",
    "caption": "thu hút, rút ra (kinh nghiệm)"
  },
  "系统": {
    "file": "系统.svg",
    "src": "images/HSK_2.0/level5/系统.svg",
    "caption": "hệ thống"
  },
  "戏剧": {
    "file": "戏剧.svg",
    "src": "images/HSK_2.0/level5/戏剧.svg",
    "caption": "kịch, hí kịch"
  },
  "吓": {
    "file": "吓.svg",
    "src": "images/HSK_2.0/level5/吓.svg",
    "caption": "làm sợ, hù"
  },
  "夏令营": {
    "file": "夏令营.svg",
    "src": "images/HSK_2.0/level5/夏令营.svg",
    "caption": "trại hè"
  },
  "下载": {
    "file": "下载.svg",
    "src": "images/HSK_2.0/level5/下载.svg",
    "caption": "tải xuống"
  },
  "显然": {
    "file": "显然.svg",
    "src": "images/HSK_2.0/level5/显然.svg",
    "caption": "rõ ràng, hiển nhiên"
  },
  "县": {
    "file": "县.svg",
    "src": "images/HSK_2.0/level5/县.svg",
    "caption": "huyện"
  },
  "现象": {
    "file": "现象.svg",
    "src": "images/HSK_2.0/level5/现象.svg",
    "caption": "hiện tượng"
  },
  "香肠": {
    "file": "香肠.svg",
    "src": "images/HSK_2.0/level5/香肠.svg",
    "caption": "xúc xích"
  },
  "相当": {
    "file": "相当.svg",
    "src": "images/HSK_2.0/level5/相当.svg",
    "caption": "tương đối, khá"
  },
  "相似": {
    "file": "相似.svg",
    "src": "images/HSK_2.0/level5/相似.svg",
    "caption": "tương tự, giống nhau"
  },
  "想念": {
    "file": "想念.svg",
    "src": "images/HSK_2.0/level5/想念.svg",
    "caption": "nhớ nhung"
  },
  "享受": {
    "file": "享受.svg",
    "src": "images/HSK_2.0/level5/享受.svg",
    "caption": "hưởng thụ"
  },
  "项链": {
    "file": "项链.svg",
    "src": "images/HSK_2.0/level5/项链.svg",
    "caption": "dây chuyền"
  },
  "象征": {
    "file": "象征.svg",
    "src": "images/HSK_2.0/level5/象征.svg",
    "caption": "biểu tượng, tượng trưng"
  },
  "消极": {
    "file": "消极.svg",
    "src": "images/HSK_2.0/level5/消极.svg",
    "caption": "tiêu cực"
  },
  "消失": {
    "file": "消失.svg",
    "src": "images/HSK_2.0/level5/消失.svg",
    "caption": "biến mất"
  },
  "小气": {
    "file": "小气.svg",
    "src": "images/HSK_2.0/level5/小气.svg",
    "caption": "ích kỷ, hẹp hòi"
  },
  "孝顺": {
    "file": "孝顺.svg",
    "src": "images/HSK_2.0/level5/孝顺.svg",
    "caption": "hiếu thuận"
  },
  "斜": {
    "file": "斜.svg",
    "src": "images/HSK_2.0/level5/斜.svg",
    "caption": "xiên, chéo"
  },
  "写作": {
    "file": "写作.svg",
    "src": "images/HSK_2.0/level5/写作.svg",
    "caption": "viết văn, sáng tác"
  },
  "心理": {
    "file": "心理.svg",
    "src": "images/HSK_2.0/level5/心理.svg",
    "caption": "tâm lý"
  },
  "心脏": {
    "file": "心脏.svg",
    "src": "images/HSK_2.0/level5/心脏.svg",
    "caption": "tim"
  },
  "信任": {
    "file": "信任.svg",
    "src": "images/HSK_2.0/level5/信任.svg",
    "caption": "tin tưởng"
  },
  "行为": {
    "file": "行为.svg",
    "src": "images/HSK_2.0/level5/行为.svg",
    "caption": "hành vi"
  },
  "形容": {
    "file": "形容.svg",
    "src": "images/HSK_2.0/level5/形容.svg",
    "caption": "miêu tả, hình dung"
  },
  "形势": {
    "file": "形势.svg",
    "src": "images/HSK_2.0/level5/形势.svg",
    "caption": "tình hình, cục diện"
  },
  "形状": {
    "file": "形状.svg",
    "src": "images/HSK_2.0/level5/形状.svg",
    "caption": "hình dạng"
  },
  "幸运": {
    "file": "幸运.svg",
    "src": "images/HSK_2.0/level5/幸运.svg",
    "caption": "may mắn"
  },
  "兄弟": {
    "file": "兄弟.svg",
    "src": "images/HSK_2.0/level5/兄弟.svg",
    "caption": "anh em"
  },
  "虚心": {
    "file": "虚心.svg",
    "src": "images/HSK_2.0/level5/虚心.svg",
    "caption": "khiêm tốn, cầu thị"
  },
  "宣布": {
    "file": "宣布.svg",
    "src": "images/HSK_2.0/level5/宣布.svg",
    "caption": "tuyên bố"
  },
  "学术": {
    "file": "学术.svg",
    "src": "images/HSK_2.0/level5/学术.svg",
    "caption": "học thuật"
  },
  "询问": {
    "file": "询问.svg",
    "src": "images/HSK_2.0/level5/询问.svg",
    "caption": "hỏi thăm, tìm hiểu"
  },
  "训练": {
    "file": "训练.svg",
    "src": "images/HSK_2.0/level5/训练.svg",
    "caption": "huấn luyện"
  },
  "押金": {
    "file": "押金.svg",
    "src": "images/HSK_2.0/level5/押金.svg",
    "caption": "tiền đặt cọc"
  },
  "牙齿": {
    "file": "牙齿.svg",
    "src": "images/HSK_2.0/level5/牙齿.svg",
    "caption": "răng"
  },
  "宴会": {
    "file": "宴会.svg",
    "src": "images/HSK_2.0/level5/宴会.svg",
    "caption": "tiệc, dạ hội"
  },
  "痒": {
    "file": "痒.svg",
    "src": "images/HSK_2.0/level5/痒.svg",
    "caption": "ngứa"
  },
  "样式": {
    "file": "样式.svg",
    "src": "images/HSK_2.0/level5/样式.svg",
    "caption": "kiểu dáng"
  },
  "腰": {
    "file": "腰.svg",
    "src": "images/HSK_2.0/level5/腰.svg",
    "caption": "eo, lưng"
  },
  "咬": {
    "file": "咬.svg",
    "src": "images/HSK_2.0/level5/咬.svg",
    "caption": "cắn"
  },
  "夜": {
    "file": "夜.svg",
    "src": "images/HSK_2.0/level5/夜.svg",
    "caption": "đêm"
  },
  "业余": {
    "file": "业余.svg",
    "src": "images/HSK_2.0/level5/业余.svg",
    "caption": "không chuyên, ngoài giờ"
  },
  "依然": {
    "file": "依然.svg",
    "src": "images/HSK_2.0/level5/依然.svg",
    "caption": "vẫn như cũ"
  },
  "一旦": {
    "file": "一旦.svg",
    "src": "images/HSK_2.0/level5/一旦.svg",
    "caption": "một khi, nếu"
  },
  "一致": {
    "file": "一致.svg",
    "src": "images/HSK_2.0/level5/一致.svg",
    "caption": "nhất trí, đồng nhất"
  },
  "一再": {
    "file": "一再.svg",
    "src": "images/HSK_2.0/level5/一再.svg",
    "caption": "nhiều lần, lặp lại"
  },
  "移民": {
    "file": "移民.svg",
    "src": "images/HSK_2.0/level5/移民.svg",
    "caption": "di dân, người nhập cư"
  },
  "疑问": {
    "file": "疑问.svg",
    "src": "images/HSK_2.0/level5/疑问.svg",
    "caption": "nghi vấn, thắc mắc"
  },
  "以来": {
    "file": "以来.svg",
    "src": "images/HSK_2.0/level5/以来.svg",
    "caption": "từ trước đến nay"
  },
  "意外": {
    "file": "意外.svg",
    "src": "images/HSK_2.0/level5/意外.svg",
    "caption": "ngoài ý muốn, bất ngờ"
  },
  "议论": {
    "file": "议论.svg",
    "src": "images/HSK_2.0/level5/议论.svg",
    "caption": "bàn luận"
  },
  "义务": {
    "file": "义务.svg",
    "src": "images/HSK_2.0/level5/义务.svg",
    "caption": "nghĩa vụ"
  },
  "因素": {
    "file": "因素.svg",
    "src": "images/HSK_2.0/level5/因素.svg",
    "caption": "nhân tố, yếu tố"
  },
  "英俊": {
    "file": "英俊.svg",
    "src": "images/HSK_2.0/level5/英俊.svg",
    "caption": "tuấn tú, đẹp trai"
  },
  "营养": {
    "file": "营养.svg",
    "src": "images/HSK_2.0/level5/营养.svg",
    "caption": "dinh dưỡng"
  },
  "硬": {
    "file": "硬.svg",
    "src": "images/HSK_2.0/level5/硬.svg",
    "caption": "cứng"
  },
  "应付": {
    "file": "应付.svg",
    "src": "images/HSK_2.0/level5/应付.svg",
    "caption": "đối phó, ứng phó"
  },
  "应用": {
    "file": "应用.svg",
    "src": "images/HSK_2.0/level5/应用.svg",
    "caption": "ứng dụng"
  },
  "拥挤": {
    "file": "拥挤.svg",
    "src": "images/HSK_2.0/level5/拥挤.svg",
    "caption": "chen chúc, đông đúc"
  },
  "勇气": {
    "file": "勇气.svg",
    "src": "images/HSK_2.0/level5/勇气.svg",
    "caption": "lòng can đảm"
  },
  "用功": {
    "file": "用功.svg",
    "src": "images/HSK_2.0/level5/用功.svg",
    "caption": "chăm chỉ học hành"
  },
  "优惠": {
    "file": "优惠.svg",
    "src": "images/HSK_2.0/level5/优惠.svg",
    "caption": "ưu đãi"
  },
  "优势": {
    "file": "优势.svg",
    "src": "images/HSK_2.0/level5/优势.svg",
    "caption": "ưu thế"
  },
  "悠久": {
    "file": "悠久.svg",
    "src": "images/HSK_2.0/level5/悠久.svg",
    "caption": "lâu đời"
  },
  "油炸": {
    "file": "油炸.svg",
    "src": "images/HSK_2.0/level5/油炸.svg",
    "caption": "chiên, rán"
  },
  "有利": {
    "file": "有利.svg",
    "src": "images/HSK_2.0/level5/有利.svg",
    "caption": "có lợi"
  },
  "娱乐": {
    "file": "娱乐.svg",
    "src": "images/HSK_2.0/level5/娱乐.svg",
    "caption": "giải trí"
  },
  "预报": {
    "file": "预报.svg",
    "src": "images/HSK_2.0/level5/预报.svg",
    "caption": "dự báo"
  },
  "预防": {
    "file": "预防.svg",
    "src": "images/HSK_2.0/level5/预防.svg",
    "caption": "đề phòng, phòng ngừa"
  },
  "圆": {
    "file": "圆.svg",
    "src": "images/HSK_2.0/level5/圆.svg",
    "caption": "tròn"
  },
  "元旦": {
    "file": "元旦.svg",
    "src": "images/HSK_2.0/level5/元旦.svg",
    "caption": "Tết Dương lịch"
  },
  "员工": {
    "file": "员工.svg",
    "src": "images/HSK_2.0/level5/员工.svg",
    "caption": "nhân viên"
  },
  "愿望": {
    "file": "愿望.svg",
    "src": "images/HSK_2.0/level5/愿望.svg",
    "caption": "nguyện vọng, mong muốn"
  },
  "晕": {
    "file": "晕.svg",
    "src": "images/HSK_2.0/level5/晕.svg",
    "caption": "choáng, váng đầu"
  },
  "运气": {
    "file": "运气.svg",
    "src": "images/HSK_2.0/level5/运气.svg",
    "caption": "vận may, may rủi"
  },
  "运用": {
    "file": "运用.svg",
    "src": "images/HSK_2.0/level5/运用.svg",
    "caption": "vận dụng"
  },
  "灾害": {
    "file": "灾害.svg",
    "src": "images/HSK_2.0/level5/灾害.svg",
    "caption": "tai họa, thiên tai"
  },
  "在乎": {
    "file": "在乎.svg",
    "src": "images/HSK_2.0/level5/在乎.svg",
    "caption": "để tâm, quan tâm đến"
  },
  "再三": {
    "file": "再三.svg",
    "src": "images/HSK_2.0/level5/再三.svg",
    "caption": "nhiều lần, đắn đo"
  },
  "赞成": {
    "file": "赞成.svg",
    "src": "images/HSK_2.0/level5/赞成.svg",
    "caption": "tán thành"
  },
  "糟糕": {
    "file": "糟糕.svg",
    "src": "images/HSK_2.0/level5/糟糕.svg",
    "caption": "tệ, hỏng việc"
  },
  "造成": {
    "file": "造成.svg",
    "src": "images/HSK_2.0/level5/造成.svg",
    "caption": "gây ra, tạo thành"
  },
  "责备": {
    "file": "责备.svg",
    "src": "images/HSK_2.0/level5/责备.svg",
    "caption": "khiển trách"
  },
  "窄": {
    "file": "窄.svg",
    "src": "images/HSK_2.0/level5/窄.svg",
    "caption": "hẹp"
  },
  "展开": {
    "file": "展开.svg",
    "src": "images/HSK_2.0/level5/展开.svg",
    "caption": "triển khai, mở rộng"
  },
  "掌握": {
    "file": "掌握.svg",
    "src": "images/HSK_2.0/level5/掌握.svg",
    "caption": "nắm vững"
  },
  "账户": {
    "file": "账户.svg",
    "src": "images/HSK_2.0/level5/账户.svg",
    "caption": "tài khoản"
  },
  "珍惜": {
    "file": "珍惜.svg",
    "src": "images/HSK_2.0/level5/珍惜.svg",
    "caption": "trân trọng, quý trọng"
  },
  "阵": {
    "file": "阵.svg",
    "src": "images/HSK_2.0/level5/阵.svg",
    "caption": "cơn, trận (lượng từ)"
  },
  "睁": {
    "file": "睁.svg",
    "src": "images/HSK_2.0/level5/睁.svg",
    "caption": "mở (mắt)"
  },
  "争取": {
    "file": "争取.svg",
    "src": "images/HSK_2.0/level5/争取.svg",
    "caption": "tranh thủ, đấu tranh để đạt được"
  },
  "整个": {
    "file": "整个.svg",
    "src": "images/HSK_2.0/level5/整个.svg",
    "caption": "toàn bộ, cả"
  },
  "整齐": {
    "file": "整齐.svg",
    "src": "images/HSK_2.0/level5/整齐.svg",
    "caption": "ngăn ngắn, gọn gàng"
  },
  "正": {
    "file": "正.svg",
    "src": "images/HSK_2.0/level5/正.svg",
    "caption": "vừa, đang (trạng từ)"
  },
  "政府": {
    "file": "政府.svg",
    "src": "images/HSK_2.0/level5/政府.svg",
    "caption": "chính phủ"
  },
  "证件": {
    "file": "证件.svg",
    "src": "images/HSK_2.0/level5/证件.svg",
    "caption": "giấy chứng minh, chứng từ"
  },
  "支": {
    "file": "支.svg",
    "src": "images/HSK_2.0/level5/支.svg",
    "caption": "nhánh, cây (lượng từ)"
  },
  "支票": {
    "file": "支票.svg",
    "src": "images/HSK_2.0/level5/支票.svg",
    "caption": "tờ chi phiếu, séc"
  },
  "指导": {
    "file": "指导.svg",
    "src": "images/HSK_2.0/level5/指导.svg",
    "caption": "chỉ đạo, hướng dẫn"
  },
  "制定": {
    "file": "制定.svg",
    "src": "images/HSK_2.0/level5/制定.svg",
    "caption": "đặt ra, định ra (quy định)"
  },
  "制造": {
    "file": "制造.svg",
    "src": "images/HSK_2.0/level5/制造.svg",
    "caption": "chế tạo"
  },
  "智慧": {
    "file": "智慧.svg",
    "src": "images/HSK_2.0/level5/智慧.svg",
    "caption": "trí tuệ"
  },
  "秩序": {
    "file": "秩序.svg",
    "src": "images/HSK_2.0/level5/秩序.svg",
    "caption": "trật tự"
  },
  "中介": {
    "file": "中介.svg",
    "src": "images/HSK_2.0/level5/中介.svg",
    "caption": "trung gian, môi giới"
  },
  "中旬": {
    "file": "中旬.svg",
    "src": "images/HSK_2.0/level5/中旬.svg",
    "caption": "trung tuần (giữa tháng)"
  },
  "周到": {
    "file": "周到.svg",
    "src": "images/HSK_2.0/level5/周到.svg",
    "caption": "chu đáo"
  },
  "逐步": {
    "file": "逐步.svg",
    "src": "images/HSK_2.0/level5/逐步.svg",
    "caption": "từng bước"
  },
  "竹子": {
    "file": "竹子.svg",
    "src": "images/HSK_2.0/level5/竹子.svg",
    "caption": "cây tre"
  },
  "主持": {
    "file": "主持.svg",
    "src": "images/HSK_2.0/level5/主持.svg",
    "caption": "chủ trì, dẫn dắt"
  },
  "主观": {
    "file": "主观.svg",
    "src": "images/HSK_2.0/level5/主观.svg",
    "caption": "chủ quan"
  },
  "主题": {
    "file": "主题.svg",
    "src": "images/HSK_2.0/level5/主题.svg",
    "caption": "chủ đề"
  },
  "主任": {
    "file": "主任.svg",
    "src": "images/HSK_2.0/level5/主任.svg",
    "caption": "chủ nhiệm"
  },
  "抓": {
    "file": "抓.svg",
    "src": "images/HSK_2.0/level5/抓.svg",
    "caption": "nắm, tóm"
  },
  "专家": {
    "file": "专家.svg",
    "src": "images/HSK_2.0/level5/专家.svg",
    "caption": "chuyên gia"
  },
  "专心": {
    "file": "专心.svg",
    "src": "images/HSK_2.0/level5/专心.svg",
    "caption": "chuyên tâm, tập trung"
  },
  "转告": {
    "file": "转告.svg",
    "src": "images/HSK_2.0/level5/转告.svg",
    "caption": "chuyển lời, nhắn lại"
  },
  "装": {
    "file": "装.svg",
    "src": "images/HSK_2.0/level5/装.svg",
    "caption": "đóng gói, đóng giả"
  },
  "装修": {
    "file": "装修.svg",
    "src": "images/HSK_2.0/level5/装修.svg",
    "caption": "trang trí nội thất"
  },
  "状况": {
    "file": "状况.svg",
    "src": "images/HSK_2.0/level5/状况.svg",
    "caption": "tình trạng"
  },
  "追": {
    "file": "追.svg",
    "src": "images/HSK_2.0/level5/追.svg",
    "caption": "đuổi theo, theo đuổi"
  },
  "资格": {
    "file": "资格.svg",
    "src": "images/HSK_2.0/level5/资格.svg",
    "caption": "tư cách, trình độ"
  },
  "资料": {
    "file": "资料.svg",
    "src": "images/HSK_2.0/level5/资料.svg",
    "caption": "tư liệu, tài liệu"
  },
  "姿势": {
    "file": "姿势.svg",
    "src": "images/HSK_2.0/level5/姿势.svg",
    "caption": "tư thế, dáng vẻ"
  },
  "紫": {
    "file": "紫.svg",
    "src": "images/HSK_2.0/level5/紫.svg",
    "caption": "màu tím"
  },
  "字幕": {
    "file": "字幕.svg",
    "src": "images/HSK_2.0/level5/字幕.svg",
    "caption": "phụ đề"
  },
  "自动": {
    "file": "自动.svg",
    "src": "images/HSK_2.0/level5/自动.svg",
    "caption": "tự động"
  },
  "自由": {
    "file": "自由.svg",
    "src": "images/HSK_2.0/level5/自由.svg",
    "caption": "tự do"
  },
  "综合": {
    "file": "综合.svg",
    "src": "images/HSK_2.0/level5/综合.svg",
    "caption": "tổng hợp"
  },
  "总共": {
    "file": "总共.svg",
    "src": "images/HSK_2.0/level5/总共.svg",
    "caption": "tổng cộng"
  },
  "总理": {
    "file": "总理.svg",
    "src": "images/HSK_2.0/level5/总理.svg",
    "caption": "thủ tướng"
  },
  "总算": {
    "file": "总算.svg",
    "src": "images/HSK_2.0/level5/总算.svg",
    "caption": "cuối cùng cũng, rốt cuộc"
  },
  "总之": {
    "file": "总之.svg",
    "src": "images/HSK_2.0/level5/总之.svg",
    "caption": "tóm lại, nói chung"
  },
  "组成": {
    "file": "组成.svg",
    "src": "images/HSK_2.0/level5/组成.svg",
    "caption": "tạo thành, cấu thành"
  },
  "组织": {
    "file": "组织.svg",
    "src": "images/HSK_2.0/level5/组织.svg",
    "caption": "tổ chức"
  },
  "作文": {
    "file": "作文.svg",
    "src": "images/HSK_2.0/level5/作文.svg",
    "caption": "bài văn, làm văn"
  },
  "哎": {
    "file": "哎.svg",
    "src": "images/HSK_2.0/level5/哎.svg",
    "caption": "ơ, ô (thán từ)"
  },
  "爱护": {
    "file": "爱护.svg",
    "src": "images/HSK_2.0/level5/爱护.svg",
    "caption": "yêu quý, bảo vệ"
  },
  "爱惜": {
    "file": "爱惜.svg",
    "src": "images/HSK_2.0/level5/爱惜.svg",
    "caption": "trân trọng, quý trọng"
  },
  "安装": {
    "file": "安装.svg",
    "src": "images/HSK_2.0/level5/安装.svg",
    "caption": "lắp đặt"
  },
  "暗": {
    "file": "暗.svg",
    "src": "images/HSK_2.0/level5/暗.svg",
    "caption": "tối, mờ"
  },
  "把握": {
    "file": "把握.svg",
    "src": "images/HSK_2.0/level5/把握.svg",
    "caption": "nắm bắt, nắm chắc"
  },
  "摆": {
    "file": "摆.svg",
    "src": "images/HSK_2.0/level5/摆.svg",
    "caption": "bày, đặt"
  },
  "办理": {
    "file": "办理.svg",
    "src": "images/HSK_2.0/level5/办理.svg",
    "caption": "xử lý, làm thủ tục"
  },
  "傍晚": {
    "file": "傍晚.svg",
    "src": "images/HSK_2.0/level5/傍晚.svg",
    "caption": "chiều tối"
  },
  "包裹": {
    "file": "包裹.svg",
    "src": "images/HSK_2.0/level5/包裹.svg",
    "caption": "bưu phẩm, kiện hàng"
  },
  "包括": {
    "file": "包括.svg",
    "src": "images/HSK_2.0/level5/包括.svg",
    "caption": "bao gồm"
  },
  "薄": {
    "file": "薄.svg",
    "src": "images/HSK_2.0/level5/薄.svg",
    "caption": "mỏng"
  },
  "宝贝": {
    "file": "宝贝.svg",
    "src": "images/HSK_2.0/level5/宝贝.svg",
    "caption": "báu vật, em yêu"
  },
  "保持": {
    "file": "保持.svg",
    "src": "images/HSK_2.0/level5/保持.svg",
    "caption": "duy trì, giữ vững"
  },
  "保险": {
    "file": "保险.svg",
    "src": "images/HSK_2.0/level5/保险.svg",
    "caption": "bảo hiểm"
  },
  "抱怨": {
    "file": "抱怨.svg",
    "src": "images/HSK_2.0/level5/抱怨.svg",
    "caption": "phàn nàn, oán trách"
  },
  "报道": {
    "file": "报道.svg",
    "src": "images/HSK_2.0/level5/报道.svg",
    "caption": "đưa tin, báo cáo"
  },
  "报社": {
    "file": "报社.svg",
    "src": "images/HSK_2.0/level5/报社.svg",
    "caption": "tòa soạn báo"
  },
  "背": {
    "file": "背.svg",
    "src": "images/HSK_2.0/level5/背.svg",
    "caption": "lưng, cõng"
  },
  "本质": {
    "file": "本质.svg",
    "src": "images/HSK_2.0/level5/本质.svg",
    "caption": "bản chất"
  },
  "彼此": {
    "file": "彼此.svg",
    "src": "images/HSK_2.0/level5/彼此.svg",
    "caption": "lẫn nhau, hai bên"
  },
  "毕竟": {
    "file": "毕竟.svg",
    "src": "images/HSK_2.0/level5/毕竟.svg",
    "caption": "xét cho cùng, dù sao"
  },
  "避免": {
    "file": "避免.svg",
    "src": "images/HSK_2.0/level5/避免.svg",
    "caption": "tránh, tránh khỏi"
  },
  "编辑": {
    "file": "编辑.svg",
    "src": "images/HSK_2.0/level5/编辑.svg",
    "caption": "biên tập"
  },
  "便": {
    "file": "便.svg",
    "src": "images/HSK_2.0/level5/便.svg",
    "caption": "thì, liền (liên từ)"
  },
  "标点": {
    "file": "标点.svg",
    "src": "images/HSK_2.0/level5/标点.svg",
    "caption": "dấu câu"
  },
  "表明": {
    "file": "表明.svg",
    "src": "images/HSK_2.0/level5/表明.svg",
    "caption": "chứng tỏ, biểu thị rõ"
  },
  "病毒": {
    "file": "病毒.svg",
    "src": "images/HSK_2.0/level5/病毒.svg",
    "caption": "vi-rút, vi khuẩn"
  },
  "播放": {
    "file": "播放.svg",
    "src": "images/HSK_2.0/level5/播放.svg",
    "caption": "phát (sóng, nhạc)"
  },
  "脖子": {
    "file": "脖子.svg",
    "src": "images/HSK_2.0/level5/脖子.svg",
    "caption": "cổ"
  },
  "不要紧": {
    "file": "不要紧.svg",
    "src": "images/HSK_2.0/level5/不要紧.svg",
    "caption": "không sao, không quan trọng"
  },
  "布": {
    "file": "布.svg",
    "src": "images/HSK_2.0/level5/布.svg",
    "caption": "vải"
  },
  "不安": {
    "file": "不安.svg",
    "src": "images/HSK_2.0/level5/不安.svg",
    "caption": "bất an, lo lắng"
  },
  "不得了": {
    "file": "不得了.svg",
    "src": "images/HSK_2.0/level5/不得了.svg",
    "caption": "lắm, vô cùng"
  },
  "不如": {
    "file": "不如.svg",
    "src": "images/HSK_2.0/level5/不如.svg",
    "caption": "không bằng, chẳng thà"
  },
  "步骤": {
    "file": "步骤.svg",
    "src": "images/HSK_2.0/level5/步骤.svg",
    "caption": "bước, trình tự"
  },
  "采访": {
    "file": "采访.svg",
    "src": "images/HSK_2.0/level5/采访.svg",
    "caption": "phỏng vấn"
  },
  "彩虹": {
    "file": "彩虹.svg",
    "src": "images/HSK_2.0/level5/彩虹.svg",
    "caption": "cầu vồng"
  },
  "参与": {
    "file": "参与.svg",
    "src": "images/HSK_2.0/level5/参与.svg",
    "caption": "tham gia vào"
  },
  "惭愧": {
    "file": "惭愧.svg",
    "src": "images/HSK_2.0/level5/惭愧.svg",
    "caption": "xấu hổ, hổ thẹn"
  },
  "操心": {
    "file": "操心.svg",
    "src": "images/HSK_2.0/level5/操心.svg",
    "caption": "lo lắng, bận tâm"
  },
  "册": {
    "file": "册.svg",
    "src": "images/HSK_2.0/level5/册.svg",
    "caption": "tập, cuốn (lượng từ sách)"
  },
  "测验": {
    "file": "测验.svg",
    "src": "images/HSK_2.0/level5/测验.svg",
    "caption": "kiểm tra, trắc nghiệm"
  },
  "曾经": {
    "file": "曾经.svg",
    "src": "images/HSK_2.0/level5/曾经.svg",
    "caption": "đã từng"
  },
  "差距": {
    "file": "差距.svg",
    "src": "images/HSK_2.0/level5/差距.svg",
    "caption": "khoảng cách, sự chênh lệch"
  },
  "产品": {
    "file": "产品.svg",
    "src": "images/HSK_2.0/level5/产品.svg",
    "caption": "sản phẩm"
  },
  "长途": {
    "file": "长途.svg",
    "src": "images/HSK_2.0/level5/长途.svg",
    "caption": "đường dài"
  },
  "抄": {
    "file": "抄.svg",
    "src": "images/HSK_2.0/level5/抄.svg",
    "caption": "chép, sao chép"
  },
  "超级": {
    "file": "超级.svg",
    "src": "images/HSK_2.0/level5/超级.svg",
    "caption": "siêu, hạng nhất"
  },
  "朝": {
    "file": "朝.svg",
    "src": "images/HSK_2.0/level5/朝.svg",
    "caption": "hướng về, về phía"
  },
  "炒": {
    "file": "炒.svg",
    "src": "images/HSK_2.0/level5/炒.svg",
    "caption": "xào, rang"
  },
  "吵架": {
    "file": "吵架.svg",
    "src": "images/HSK_2.0/level5/吵架.svg",
    "caption": "cãi nhau"
  },
  "车厢": {
    "file": "车厢.svg",
    "src": "images/HSK_2.0/level5/车厢.svg",
    "caption": "toa xe, khoang xe"
  },
  "沉默": {
    "file": "沉默.svg",
    "src": "images/HSK_2.0/level5/沉默.svg",
    "caption": "im lặng, trầm lặng"
  },
  "称呼": {
    "file": "称呼.svg",
    "src": "images/HSK_2.0/level5/称呼.svg",
    "caption": "gọi, xưng gọi"
  },
  "承认": {
    "file": "承认.svg",
    "src": "images/HSK_2.0/level5/承认.svg",
    "caption": "công nhận, thừa nhận"
  },
  "程度": {
    "file": "程度.svg",
    "src": "images/HSK_2.0/level5/程度.svg",
    "caption": "mức độ"
  },
  "成分": {
    "file": "成分.svg",
    "src": "images/HSK_2.0/level5/成分.svg",
    "caption": "thành phần"
  },
  "成果": {
    "file": "成果.svg",
    "src": "images/HSK_2.0/level5/成果.svg",
    "caption": "thành quả"
  },
  "成就": {
    "file": "成就.svg",
    "src": "images/HSK_2.0/level5/成就.svg",
    "caption": "thành tựu"
  },
  "成熟": {
    "file": "成熟.svg",
    "src": "images/HSK_2.0/level5/成熟.svg",
    "caption": "chín, trưởng thành"
  },
  "成长": {
    "file": "成长.svg",
    "src": "images/HSK_2.0/level5/成长.svg",
    "caption": "trưởng thành, phát triển"
  },
  "吃亏": {
    "file": "吃亏.svg",
    "src": "images/HSK_2.0/level5/吃亏.svg",
    "caption": "chịu thiệt, bị thua lỗ"
  },
  "迟早": {
    "file": "迟早.svg",
    "src": "images/HSK_2.0/level5/迟早.svg",
    "caption": "sớm hay muộn"
  },
  "池塘": {
    "file": "池塘.svg",
    "src": "images/HSK_2.0/level5/池塘.svg",
    "caption": "cái ao"
  },
  "翅膀": {
    "file": "翅膀.svg",
    "src": "images/HSK_2.0/level5/翅膀.svg",
    "caption": "cánh (chim, côn trùng)"
  },
  "充电器": {
    "file": "充电器.svg",
    "src": "images/HSK_2.0/level5/充电器.svg",
    "caption": "bộ sạc"
  },
  "充满": {
    "file": "充满.svg",
    "src": "images/HSK_2.0/level5/充满.svg",
    "caption": "đầy, tràn đầy"
  },
  "抽屉": {
    "file": "抽屉.svg",
    "src": "images/HSK_2.0/level5/抽屉.svg",
    "caption": "ngăn kéo"
  },
  "臭": {
    "file": "臭.svg",
    "src": "images/HSK_2.0/level5/臭.svg",
    "caption": "thối, hôi"
  },
  "出版": {
    "file": "出版.svg",
    "src": "images/HSK_2.0/level5/出版.svg",
    "caption": "xuất bản"
  },
  "出色": {
    "file": "出色.svg",
    "src": "images/HSK_2.0/level5/出色.svg",
    "caption": "xuất sắc, nổi bật"
  },
  "初级": {
    "file": "初级.svg",
    "src": "images/HSK_2.0/level5/初级.svg",
    "caption": "sơ cấp"
  },
  "传播": {
    "file": "传播.svg",
    "src": "images/HSK_2.0/level5/传播.svg",
    "caption": "truyền bá, lan truyền"
  },
  "传说": {
    "file": "传说.svg",
    "src": "images/HSK_2.0/level5/传说.svg",
    "caption": "truyền thuyết"
  },
  "窗帘": {
    "file": "窗帘.svg",
    "src": "images/HSK_2.0/level5/窗帘.svg",
    "caption": "rèm cửa"
  },
  "创造": {
    "file": "创造.svg",
    "src": "images/HSK_2.0/level5/创造.svg",
    "caption": "sáng tạo"
  },
  "词汇": {
    "file": "词汇.svg",
    "src": "images/HSK_2.0/level5/词汇.svg",
    "caption": "từ vựng"
  },
  "辞职": {
    "file": "辞职.svg",
    "src": "images/HSK_2.0/level5/辞职.svg",
    "caption": "từ chức"
  },
  "刺激": {
    "file": "刺激.svg",
    "src": "images/HSK_2.0/level5/刺激.svg",
    "caption": "kích thích"
  },
  "从此": {
    "file": "从此.svg",
    "src": "images/HSK_2.0/level5/从此.svg",
    "caption": "từ đó, kể từ đây"
  },
  "从事": {
    "file": "从事.svg",
    "src": "images/HSK_2.0/level5/从事.svg",
    "caption": "làm việc, theo đuổi (nghề)"
  },
  "促进": {
    "file": "促进.svg",
    "src": "images/HSK_2.0/level5/促进.svg",
    "caption": "thúc đẩy"
  },
  "催": {
    "file": "催.svg",
    "src": "images/HSK_2.0/level5/催.svg",
    "caption": "thúc, đốc thúc"
  },
  "存在": {
    "file": "存在.svg",
    "src": "images/HSK_2.0/level5/存在.svg",
    "caption": "tồn tại"
  },
  "答应": {
    "file": "答应.svg",
    "src": "images/HSK_2.0/level5/答应.svg",
    "caption": "đáp ứng, đồng ý"
  },
  "达到": {
    "file": "达到.svg",
    "src": "images/HSK_2.0/level5/达到.svg",
    "caption": "đạt được"
  },
  "打交道": {
    "file": "打交道.svg",
    "src": "images/HSK_2.0/level5/打交道.svg",
    "caption": "giao tiếp, qua lại"
  },
  "打喷嚏": {
    "file": "打喷嚏.svg",
    "src": "images/HSK_2.0/level5/打喷嚏.svg",
    "caption": "hắt hơi"
  },
  "打听": {
    "file": "打听.svg",
    "src": "images/HSK_2.0/level5/打听.svg",
    "caption": "dò hỏi, hỏi thăm"
  },
  "大方": {
    "file": "大方.svg",
    "src": "images/HSK_2.0/level5/大方.svg",
    "caption": "rộng lượng, hào phóng"
  },
  "大型": {
    "file": "大型.svg",
    "src": "images/HSK_2.0/level5/大型.svg",
    "caption": "cỡ lớn, quy mô lớn"
  },
  "呆": {
    "file": "呆.svg",
    "src": "images/HSK_2.0/level5/呆.svg",
    "caption": "ở lại, đờ đẫn"
  },
  "代替": {
    "file": "代替.svg",
    "src": "images/HSK_2.0/level5/代替.svg",
    "caption": "thay thế"
  },
  "贷款": {
    "file": "贷款.svg",
    "src": "images/HSK_2.0/level5/贷款.svg",
    "caption": "cho vay, vay tiền"
  },
  "单纯": {
    "file": "单纯.svg",
    "src": "images/HSK_2.0/level5/单纯.svg",
    "caption": "đơn giản, đơn thuần"
  },
  "单独": {
    "file": "单独.svg",
    "src": "images/HSK_2.0/level5/单独.svg",
    "caption": "đơn độc, riêng lẻ"
  },
  "单元": {
    "file": "单元.svg",
    "src": "images/HSK_2.0/level5/单元.svg",
    "caption": "đơn nguyên, bài học (sách giáo trình)"
  },
  "胆小鬼": {
    "file": "胆小鬼.svg",
    "src": "images/HSK_2.0/level5/胆小鬼.svg",
    "caption": "kẻ nhút nhát"
  },
  "当地": {
    "file": "当地.svg",
    "src": "images/HSK_2.0/level5/当地.svg",
    "caption": "địa phương, bản địa"
  },
  "当心": {
    "file": "当心.svg",
    "src": "images/HSK_2.0/level5/当心.svg",
    "caption": "coi chừng, cẩn thận"
  },
  "挡": {
    "file": "挡.svg",
    "src": "images/HSK_2.0/level5/挡.svg",
    "caption": "chặn, cản"
  },
  "岛屿": {
    "file": "岛屿.svg",
    "src": "images/HSK_2.0/level5/岛屿.svg",
    "caption": "đảo"
  },
  "导演": {
    "file": "导演.svg",
    "src": "images/HSK_2.0/level5/导演.svg",
    "caption": "đạo diễn"
  },
  "导致": {
    "file": "导致.svg",
    "src": "images/HSK_2.0/level5/导致.svg",
    "caption": "dẫn đến, gây ra"
  },
  "到达": {
    "file": "到达.svg",
    "src": "images/HSK_2.0/level5/到达.svg",
    "caption": "đến nơi, đạt tới"
  },
  "道德": {
    "file": "道德.svg",
    "src": "images/HSK_2.0/level5/道德.svg",
    "caption": "đạo đức"
  },
  "等待": {
    "file": "等待.svg",
    "src": "images/HSK_2.0/level5/等待.svg",
    "caption": "chờ đợi"
  },
  "的确": {
    "file": "的确.svg",
    "src": "images/HSK_2.0/level5/的确.svg",
    "caption": "đích thực, quả thực"
  },
  "地道": {
    "file": "地道.svg",
    "src": "images/HSK_2.0/level5/地道.svg",
    "caption": "đường hầm; chính gốc"
  },
  "地理": {
    "file": "地理.svg",
    "src": "images/HSK_2.0/level5/地理.svg",
    "caption": "địa lý"
  },
  "地区": {
    "file": "地区.svg",
    "src": "images/HSK_2.0/level5/地区.svg",
    "caption": "khu vực, vùng"
  },
  "地位": {
    "file": "地位.svg",
    "src": "images/HSK_2.0/level5/地位.svg",
    "caption": "địa vị"
  },
  "点心": {
    "file": "点心.svg",
    "src": "images/HSK_2.0/level5/点心.svg",
    "caption": "món tráng miệng, bánh ngọt"
  },
  "电台": {
    "file": "电台.svg",
    "src": "images/HSK_2.0/level5/电台.svg",
    "caption": "đài phát thanh"
  },
  "钓": {
    "file": "钓.svg",
    "src": "images/HSK_2.0/level5/钓.svg",
    "caption": "câu (cá)"
  },
  "洞": {
    "file": "洞.svg",
    "src": "images/HSK_2.0/level5/洞.svg",
    "caption": "cái lỗ, hang"
  },
  "豆腐": {
    "file": "豆腐.svg",
    "src": "images/HSK_2.0/level5/豆腐.svg",
    "caption": "đậu phụ"
  },
  "独立": {
    "file": "独立.svg",
    "src": "images/HSK_2.0/level5/独立.svg",
    "caption": "độc lập"
  },
  "断": {
    "file": "断.svg",
    "src": "images/HSK_2.0/level5/断.svg",
    "caption": "đứt, gãy"
  },
  "堆": {
    "file": "堆.svg",
    "src": "images/HSK_2.0/level5/堆.svg",
    "caption": "đống, chồng"
  },
  "对方": {
    "file": "对方.svg",
    "src": "images/HSK_2.0/level5/对方.svg",
    "caption": "đối phương, phía bên kia"
  },
  "对象": {
    "file": "对象.svg",
    "src": "images/HSK_2.0/level5/对象.svg",
    "caption": "đối tượng"
  },
  "兑换": {
    "file": "兑换.svg",
    "src": "images/HSK_2.0/level5/兑换.svg",
    "caption": "đổi tiền"
  },
  "蹲": {
    "file": "蹲.svg",
    "src": "images/HSK_2.0/level5/蹲.svg",
    "caption": "ngồi xổm"
  },
  "多余": {
    "file": "多余.svg",
    "src": "images/HSK_2.0/level5/多余.svg",
    "caption": "dư thừa, thừa thãi"
  },
  "躲藏": {
    "file": "躲藏.svg",
    "src": "images/HSK_2.0/level5/躲藏.svg",
    "caption": "ẩn nấp, trốn"
  },
  "恶劣": {
    "file": "恶劣.svg",
    "src": "images/HSK_2.0/level5/恶劣.svg",
    "caption": "xấu, tồi tệ"
  },
  "耳环": {
    "file": "耳环.svg",
    "src": "images/HSK_2.0/level5/耳环.svg",
    "caption": "khuyên tai"
  },
  "发愁": {
    "file": "发愁.svg",
    "src": "images/HSK_2.0/level5/发愁.svg",
    "caption": "lo lắng, lo buồn"
  },
  "发抖": {
    "file": "发抖.svg",
    "src": "images/HSK_2.0/level5/发抖.svg",
    "caption": "run rẩy"
  },
  "发明": {
    "file": "发明.svg",
    "src": "images/HSK_2.0/level5/发明.svg",
    "caption": "phát minh"
  },
  "翻": {
    "file": "翻.svg",
    "src": "images/HSK_2.0/level5/翻.svg",
    "caption": "lật, dịch"
  },
  "反复": {
    "file": "反复.svg",
    "src": "images/HSK_2.0/level5/反复.svg",
    "caption": "lặp đi lặp lại"
  },
  "反映": {
    "file": "反映.svg",
    "src": "images/HSK_2.0/level5/反映.svg",
    "caption": "phản ánh"
  },
  "方": {
    "file": "方.svg",
    "src": "images/HSK_2.0/level5/方.svg",
    "caption": "vuông, phương"
  },
  "仿佛": {
    "file": "仿佛.svg",
    "src": "images/HSK_2.0/level5/仿佛.svg",
    "caption": "dường như, tựa như"
  },
  "非": {
    "file": "非.svg",
    "src": "images/HSK_2.0/level5/非.svg",
    "caption": "không phải, phi"
  },
  "废话": {
    "file": "废话.svg",
    "src": "images/HSK_2.0/level5/废话.svg",
    "caption": "lời nói vô ích"
  },
  "分别": {
    "file": "分别.svg",
    "src": "images/HSK_2.0/level5/分别.svg",
    "caption": "phân biệt, chia tay"
  },
  "分配": {
    "file": "分配.svg",
    "src": "images/HSK_2.0/level5/分配.svg",
    "caption": "phân phối"
  },
  "分析": {
    "file": "分析.svg",
    "src": "images/HSK_2.0/level5/分析.svg",
    "caption": "phân tích"
  },
  "纷纷": {
    "file": "纷纷.svg",
    "src": "images/HSK_2.0/level5/纷纷.svg",
    "caption": "lần lượt, ùn ùn"
  },
  "奋斗": {
    "file": "奋斗.svg",
    "src": "images/HSK_2.0/level5/奋斗.svg",
    "caption": "phấn đấu"
  },
  "风格": {
    "file": "风格.svg",
    "src": "images/HSK_2.0/level5/风格.svg",
    "caption": "phong cách"
  },
  "风俗": {
    "file": "风俗.svg",
    "src": "images/HSK_2.0/level5/风俗.svg",
    "caption": "phong tục"
  },
  "疯狂": {
    "file": "疯狂.svg",
    "src": "images/HSK_2.0/level5/疯狂.svg",
    "caption": "cuồng loạn, điên cuồng"
  },
  "否定": {
    "file": "否定.svg",
    "src": "images/HSK_2.0/level5/否定.svg",
    "caption": "phủ định"
  },
  "幅": {
    "file": "幅.svg",
    "src": "images/HSK_2.0/level5/幅.svg",
    "caption": "bức (lượng từ tranh, ảnh)"
  },
  "服装": {
    "file": "服装.svg",
    "src": "images/HSK_2.0/level5/服装.svg",
    "caption": "trang phục"
  },
  "辅导": {
    "file": "辅导.svg",
    "src": "images/HSK_2.0/level5/辅导.svg",
    "caption": "phụ đạo, hướng dẫn"
  },
  "妇女": {
    "file": "妇女.svg",
    "src": "images/HSK_2.0/level5/妇女.svg",
    "caption": "phụ nữ"
  },
  "改革": {
    "file": "改革.svg",
    "src": "images/HSK_2.0/level5/改革.svg",
    "caption": "cải cách"
  },
  "改善": {
    "file": "改善.svg",
    "src": "images/HSK_2.0/level5/改善.svg",
    "caption": "cải thiện"
  },
  "盖": {
    "file": "盖.svg",
    "src": "images/HSK_2.0/level5/盖.svg",
    "caption": "che, đậy"
  },
  "概念": {
    "file": "概念.svg",
    "src": "images/HSK_2.0/level5/概念.svg",
    "caption": "khái niệm"
  },
  "干脆": {
    "file": "干脆.svg",
    "src": "images/HSK_2.0/level5/干脆.svg",
    "caption": "thẳng thắn, dứt khoát"
  },
  "干燥": {
    "file": "干燥.svg",
    "src": "images/HSK_2.0/level5/干燥.svg",
    "caption": "khô khan, hanh khô"
  },
  "感激": {
    "file": "感激.svg",
    "src": "images/HSK_2.0/level5/感激.svg",
    "caption": "cảm kích, biết ơn"
  },
  "感受": {
    "file": "感受.svg",
    "src": "images/HSK_2.0/level5/感受.svg",
    "caption": "cảm nhận"
  },
  "赶紧": {
    "file": "赶紧.svg",
    "src": "images/HSK_2.0/level5/赶紧.svg",
    "caption": "nhanh chóng, lập tức"
  },
  "钢铁": {
    "file": "钢铁.svg",
    "src": "images/HSK_2.0/level5/钢铁.svg",
    "caption": "thép, sắt"
  },
  "高档": {
    "file": "高档.svg",
    "src": "images/HSK_2.0/level5/高档.svg",
    "caption": "cao cấp, hảo hạng"
  },
  "搞": {
    "file": "搞.svg",
    "src": "images/HSK_2.0/level5/搞.svg",
    "caption": "làm, tổ chức"
  },
  "格外": {
    "file": "格外.svg",
    "src": "images/HSK_2.0/level5/格外.svg",
    "caption": "đặc biệt, hơn hẳn"
  },
  "个别": {
    "file": "个别.svg",
    "src": "images/HSK_2.0/level5/个别.svg",
    "caption": "riêng lẻ, cá biệt"
  },
  "个性": {
    "file": "个性.svg",
    "src": "images/HSK_2.0/level5/个性.svg",
    "caption": "cá tính"
  },
  "根": {
    "file": "根.svg",
    "src": "images/HSK_2.0/level5/根.svg",
    "caption": "rễ, gốc"
  },
  "公布": {
    "file": "公布.svg",
    "src": "images/HSK_2.0/level5/公布.svg",
    "caption": "công bố"
  },
  "公元": {
    "file": "公元.svg",
    "src": "images/HSK_2.0/level5/公元.svg",
    "caption": "công nguyên"
  },
  "公主": {
    "file": "公主.svg",
    "src": "images/HSK_2.0/level5/公主.svg",
    "caption": "công chúa"
  },
  "工程师": {
    "file": "工程师.svg",
    "src": "images/HSK_2.0/level5/工程师.svg",
    "caption": "kỹ sư"
  },
  "工人": {
    "file": "工人.svg",
    "src": "images/HSK_2.0/level5/工人.svg",
    "caption": "công nhân"
  },
  "恭喜": {
    "file": "恭喜.svg",
    "src": "images/HSK_2.0/level5/恭喜.svg",
    "caption": "chúc mừng"
  },
  "贡献": {
    "file": "贡献.svg",
    "src": "images/HSK_2.0/level5/贡献.svg",
    "caption": "cống hiến"
  },
  "构成": {
    "file": "构成.svg",
    "src": "images/HSK_2.0/level5/构成.svg",
    "caption": "cấu thành"
  },
  "姑姑": {
    "file": "姑姑.svg",
    "src": "images/HSK_2.0/level5/姑姑.svg",
    "caption": "cô (em/chị gái của bố)"
  },
  "古典": {
    "file": "古典.svg",
    "src": "images/HSK_2.0/level5/古典.svg",
    "caption": "cổ điển"
  },
  "鼓舞": {
    "file": "鼓舞.svg",
    "src": "images/HSK_2.0/level5/鼓舞.svg",
    "caption": "khích lệ, cổ vũ"
  },
  "股票": {
    "file": "股票.svg",
    "src": "images/HSK_2.0/level5/股票.svg",
    "caption": "cổ phiếu"
  },
  "固定": {
    "file": "固定.svg",
    "src": "images/HSK_2.0/level5/固定.svg",
    "caption": "cố định"
  },
  "挂号": {
    "file": "挂号.svg",
    "src": "images/HSK_2.0/level5/挂号.svg",
    "caption": "đăng ký (khám bệnh, gửi thư)"
  },
  "拐弯": {
    "file": "拐弯.svg",
    "src": "images/HSK_2.0/level5/拐弯.svg",
    "caption": "rẽ, ngoặt"
  },
  "官": {
    "file": "官.svg",
    "src": "images/HSK_2.0/level5/官.svg",
    "caption": "quan, viên chức"
  },
  "关闭": {
    "file": "关闭.svg",
    "src": "images/HSK_2.0/level5/关闭.svg",
    "caption": "đóng cửa, đóng lại"
  },
  "观点": {
    "file": "观点.svg",
    "src": "images/HSK_2.0/level5/观点.svg",
    "caption": "quan điểm"
  },
  "管子": {
    "file": "管子.svg",
    "src": "images/HSK_2.0/level5/管子.svg",
    "caption": "ống dẫn"
  },
  "光临": {
    "file": "光临.svg",
    "src": "images/HSK_2.0/level5/光临.svg",
    "caption": "quang lâm, đến dự"
  },
  "光盘": {
    "file": "光盘.svg",
    "src": "images/HSK_2.0/level5/光盘.svg",
    "caption": "đĩa CD"
  },
  "广场": {
    "file": "广场.svg",
    "src": "images/HSK_2.0/level5/广场.svg",
    "caption": "quảng trường"
  },
  "广泛": {
    "file": "广泛.svg",
    "src": "images/HSK_2.0/level5/广泛.svg",
    "caption": "rộng rãi, phổ biến"
  },
  "规矩": {
    "file": "规矩.svg",
    "src": "images/HSK_2.0/level5/规矩.svg",
    "caption": "quy củ, lề lối"
  },
  "规模": {
    "file": "规模.svg",
    "src": "images/HSK_2.0/level5/规模.svg",
    "caption": "quy mô"
  },
  "归纳": {
    "file": "归纳.svg",
    "src": "images/HSK_2.0/level5/归纳.svg",
    "caption": "quy nạp, tổng hợp"
  },
  "柜台": {
    "file": "柜台.svg",
    "src": "images/HSK_2.0/level5/柜台.svg",
    "caption": "quầy hàng, quầy thu ngân"
  },
  "锅": {
    "file": "锅.svg",
    "src": "images/HSK_2.0/level5/锅.svg",
    "caption": "nồi, chảo"
  },
  "国王": {
    "file": "国王.svg",
    "src": "images/HSK_2.0/level5/国王.svg",
    "caption": "quốc vương"
  },
  "果然": {
    "file": "果然.svg",
    "src": "images/HSK_2.0/level5/果然.svg",
    "caption": "quả nhiên, đúng như vậy"
  },
  "过分": {
    "file": "过分.svg",
    "src": "images/HSK_2.0/level5/过分.svg",
    "caption": "quá mức, quá đáng"
  },
  "过期": {
    "file": "过期.svg",
    "src": "images/HSK_2.0/level5/过期.svg",
    "caption": "quá hạn"
  },
  "哈": {
    "file": "哈.svg",
    "src": "images/HSK_2.0/level5/哈.svg",
    "caption": "ha (thán từ cười)"
  },
  "海关": {
    "file": "海关.svg",
    "src": "images/HSK_2.0/level5/海关.svg",
    "caption": "hải quan"
  },
  "喊": {
    "file": "喊.svg",
    "src": "images/HSK_2.0/level5/喊.svg",
    "caption": "hô, gọi to"
  },
  "行业": {
    "file": "行业.svg",
    "src": "images/HSK_2.0/level5/行业.svg",
    "caption": "ngành nghề"
  },
  "好客": {
    "file": "好客.svg",
    "src": "images/HSK_2.0/level5/好客.svg",
    "caption": "mến khách"
  },
  "和平": {
    "file": "和平.svg",
    "src": "images/HSK_2.0/level5/和平.svg",
    "caption": "hòa bình"
  },
  "何况": {
    "file": "何况.svg",
    "src": "images/HSK_2.0/level5/何况.svg",
    "caption": "huống hồ, huống chi"
  },
  "合影": {
    "file": "合影.svg",
    "src": "images/HSK_2.0/level5/合影.svg",
    "caption": "chụp ảnh chung"
  },
  "核心": {
    "file": "核心.svg",
    "src": "images/HSK_2.0/level5/核心.svg",
    "caption": "hạt nhân, trọng tâm"
  },
  "后果": {
    "file": "后果.svg",
    "src": "images/HSK_2.0/level5/后果.svg",
    "caption": "hậu quả"
  },
  "忽然": {
    "file": "忽然.svg",
    "src": "images/HSK_2.0/level5/忽然.svg",
    "caption": "bỗng nhiên, đột nhiên"
  },
  "呼吸": {
    "file": "呼吸.svg",
    "src": "images/HSK_2.0/level5/呼吸.svg",
    "caption": "hô hấp, thở"
  },
  "蝴蝶": {
    "file": "蝴蝶.svg",
    "src": "images/HSK_2.0/level5/蝴蝶.svg",
    "caption": "con bướm"
  },
  "胡同": {
    "file": "胡同.svg",
    "src": "images/HSK_2.0/level5/胡同.svg",
    "caption": "hẻm, ngõ"
  },
  "华裔": {
    "file": "华裔.svg",
    "src": "images/HSK_2.0/level5/华裔.svg",
    "caption": "Hoa kiều, người gốc Hoa"
  },
  "滑": {
    "file": "滑.svg",
    "src": "images/HSK_2.0/level5/滑.svg",
    "caption": "trơn, trượt"
  },
  "化学": {
    "file": "化学.svg",
    "src": "images/HSK_2.0/level5/化学.svg",
    "caption": "hóa học"
  },
  "缓解": {
    "file": "缓解.svg",
    "src": "images/HSK_2.0/level5/缓解.svg",
    "caption": "làm giảm, giảm nhẹ"
  },
  "幻想": {
    "file": "幻想.svg",
    "src": "images/HSK_2.0/level5/幻想.svg",
    "caption": "ảo tưởng, mơ mộng"
  },
  "挥": {
    "file": "挥.svg",
    "src": "images/HSK_2.0/level5/挥.svg",
    "caption": "vẫy, vung"
  },
  "灰尘": {
    "file": "灰尘.svg",
    "src": "images/HSK_2.0/level5/灰尘.svg",
    "caption": "bụi bặm"
  },
  "恢复": {
    "file": "恢复.svg",
    "src": "images/HSK_2.0/level5/恢复.svg",
    "caption": "phục hồi, khôi phục"
  },
  "汇率": {
    "file": "汇率.svg",
    "src": "images/HSK_2.0/level5/汇率.svg",
    "caption": "tỷ giá hối đoái"
  },
  "婚姻": {
    "file": "婚姻.svg",
    "src": "images/HSK_2.0/level5/婚姻.svg",
    "caption": "hôn nhân"
  },
  "火柴": {
    "file": "火柴.svg",
    "src": "images/HSK_2.0/level5/火柴.svg",
    "caption": "diêm (que)"
  },
  "激烈": {
    "file": "激烈.svg",
    "src": "images/HSK_2.0/level5/激烈.svg",
    "caption": "kịch liệt, gay gắt"
  },
  "肌肉": {
    "file": "肌肉.svg",
    "src": "images/HSK_2.0/level5/肌肉.svg",
    "caption": "cơ bắp"
  },
  "极其": {
    "file": "极其.svg",
    "src": "images/HSK_2.0/level5/极其.svg",
    "caption": "cực kỳ, hết sức"
  },
  "集体": {
    "file": "集体.svg",
    "src": "images/HSK_2.0/level5/集体.svg",
    "caption": "tập thể"
  },
  "急忙": {
    "file": "急忙.svg",
    "src": "images/HSK_2.0/level5/急忙.svg",
    "caption": "vội vã, gấp gáp"
  },
  "记录": {
    "file": "记录.svg",
    "src": "images/HSK_2.0/level5/记录.svg",
    "caption": "ghi chép, kỷ lục"
  },
  "计算": {
    "file": "计算.svg",
    "src": "images/HSK_2.0/level5/计算.svg",
    "caption": "tính toán"
  },
  "系领带": {
    "file": "系领带.svg",
    "src": "images/HSK_2.0/level5/系领带.svg",
    "caption": "thắt cà vạt"
  },
  "纪律": {
    "file": "纪律.svg",
    "src": "images/HSK_2.0/level5/纪律.svg",
    "caption": "kỷ luật"
  },
  "寂寞": {
    "file": "寂寞.svg",
    "src": "images/HSK_2.0/level5/寂寞.svg",
    "caption": "cô đơn, tịch mịch"
  },
  "家庭": {
    "file": "家庭.svg",
    "src": "images/HSK_2.0/level5/家庭.svg",
    "caption": "gia đình"
  },
  "家乡": {
    "file": "家乡.svg",
    "src": "images/HSK_2.0/level5/家乡.svg",
    "caption": "quê hương"
  },
  "夹子": {
    "file": "夹子.svg",
    "src": "images/HSK_2.0/level5/夹子.svg",
    "caption": "cái kẹp"
  },
  "假设": {
    "file": "假设.svg",
    "src": "images/HSK_2.0/level5/假设.svg",
    "caption": "giả thiết, giả định"
  },
  "嫁": {
    "file": "嫁.svg",
    "src": "images/HSK_2.0/level5/嫁.svg",
    "caption": "lấy chồng, gả"
  },
  "价值": {
    "file": "价值.svg",
    "src": "images/HSK_2.0/level5/价值.svg",
    "caption": "giá trị"
  },
  "肩膀": {
    "file": "肩膀.svg",
    "src": "images/HSK_2.0/level5/肩膀.svg",
    "caption": "bờ vai"
  },
  "坚决": {
    "file": "坚决.svg",
    "src": "images/HSK_2.0/level5/坚决.svg",
    "caption": "kiên quyết"
  },
  "艰巨": {
    "file": "艰巨.svg",
    "src": "images/HSK_2.0/level5/艰巨.svg",
    "caption": "gian nan, khó khăn"
  },
  "兼职": {
    "file": "兼职.svg",
    "src": "images/HSK_2.0/level5/兼职.svg",
    "caption": "kiêm nhiệm, làm thêm"
  },
  "简历": {
    "file": "简历.svg",
    "src": "images/HSK_2.0/level5/简历.svg",
    "caption": "sơ yếu lý lịch"
  },
  "剪刀": {
    "file": "剪刀.svg",
    "src": "images/HSK_2.0/level5/剪刀.svg",
    "caption": "cái kéo"
  },
  "建立": {
    "file": "建立.svg",
    "src": "images/HSK_2.0/level5/建立.svg",
    "caption": "xây dựng, kiến lập"
  },
  "讲究": {
    "file": "讲究.svg",
    "src": "images/HSK_2.0/level5/讲究.svg",
    "caption": "chú trọng, cầu kỳ"
  },
  "交际": {
    "file": "交际.svg",
    "src": "images/HSK_2.0/level5/交际.svg",
    "caption": "giao tiếp xã hội"
  },
  "胶水": {
    "file": "胶水.svg",
    "src": "images/HSK_2.0/level5/胶水.svg",
    "caption": "keo dán, hồ dán"
  },
  "狡猾": {
    "file": "狡猾.svg",
    "src": "images/HSK_2.0/level5/狡猾.svg",
    "caption": "xảo trá, gian xảo"
  },
  "教练": {
    "file": "教练.svg",
    "src": "images/HSK_2.0/level5/教练.svg",
    "caption": "huấn luyện viên"
  },
  "接触": {
    "file": "接触.svg",
    "src": "images/HSK_2.0/level5/接触.svg",
    "caption": "tiếp xúc"
  },
  "接近": {
    "file": "接近.svg",
    "src": "images/HSK_2.0/level5/接近.svg",
    "caption": "gần gũi, tiếp cận"
  },
  "阶段": {
    "file": "阶段.svg",
    "src": "images/HSK_2.0/level5/阶段.svg",
    "caption": "giai đoạn"
  },
  "戒指": {
    "file": "戒指.svg",
    "src": "images/HSK_2.0/level5/戒指.svg",
    "caption": "nhẫn (trang sức)"
  },
  "金属": {
    "file": "金属.svg",
    "src": "images/HSK_2.0/level5/金属.svg",
    "caption": "kim loại"
  },
  "进口": {
    "file": "进口.svg",
    "src": "images/HSK_2.0/level5/进口.svg",
    "caption": "nhập khẩu"
  },
  "尽力": {
    "file": "尽力.svg",
    "src": "images/HSK_2.0/level5/尽力.svg",
    "caption": "hết sức, gắng hết sức"
  },
  "精力": {
    "file": "精力.svg",
    "src": "images/HSK_2.0/level5/精力.svg",
    "caption": "tinh lực, năng lượng"
  },
  "经商": {
    "file": "经商.svg",
    "src": "images/HSK_2.0/level5/经商.svg",
    "caption": "kinh doanh, buôn bán"
  },
  "经营": {
    "file": "经营.svg",
    "src": "images/HSK_2.0/level5/经营.svg",
    "caption": "kinh doanh, quản lý"
  },
  "酒吧": {
    "file": "酒吧.svg",
    "src": "images/HSK_2.0/level5/酒吧.svg",
    "caption": "quán bar"
  },
  "救护车": {
    "file": "救护车.svg",
    "src": "images/HSK_2.0/level5/救护车.svg",
    "caption": "xe cứu thương"
  },
  "居然": {
    "file": "居然.svg",
    "src": "images/HSK_2.0/level5/居然.svg",
    "caption": "thế mà, ngờ rằng"
  },
  "具体": {
    "file": "具体.svg",
    "src": "images/HSK_2.0/level5/具体.svg",
    "caption": "cụ thể"
  },
  "俱乐部": {
    "file": "俱乐部.svg",
    "src": "images/HSK_2.0/level5/俱乐部.svg",
    "caption": "câu lạc bộ"
  },
  "据说": {
    "file": "据说.svg",
    "src": "images/HSK_2.0/level5/据说.svg",
    "caption": "nghe nói, theo lời kể"
  },
  "捐": {
    "file": "捐.svg",
    "src": "images/HSK_2.0/level5/捐.svg",
    "caption": "quyên góp, hiến tặng"
  },
  "决心": {
    "file": "决心.svg",
    "src": "images/HSK_2.0/level5/决心.svg",
    "caption": "quyết tâm"
  },
  "角色": {
    "file": "角色.svg",
    "src": "images/HSK_2.0/level5/角色.svg",
    "caption": "vai diễn, vai trò"
  },
  "均匀": {
    "file": "均匀.svg",
    "src": "images/HSK_2.0/level5/均匀.svg",
    "caption": "đồng đều, đều đặn"
  },
  "卡车": {
    "file": "卡车.svg",
    "src": "images/HSK_2.0/level5/卡车.svg",
    "caption": "xe tải"
  },
  "开发": {
    "file": "开发.svg",
    "src": "images/HSK_2.0/level5/开发.svg",
    "caption": "khai phát, phát triển"
  },
  "开幕式": {
    "file": "开幕式.svg",
    "src": "images/HSK_2.0/level5/开幕式.svg",
    "caption": "lễ khai mạc"
  },
  "看望": {
    "file": "看望.svg",
    "src": "images/HSK_2.0/level5/看望.svg",
    "caption": "thăm hỏi"
  },
  "靠": {
    "file": "靠.svg",
    "src": "images/HSK_2.0/level5/靠.svg",
    "caption": "dựa, tựa vào"
  },
  "颗": {
    "file": "颗.svg",
    "src": "images/HSK_2.0/level5/颗.svg",
    "caption": "hạt, viên (lượng từ)"
  },
  "可靠": {
    "file": "可靠.svg",
    "src": "images/HSK_2.0/level5/可靠.svg",
    "caption": "đáng tin cậy"
  },
  "课程": {
    "file": "课程.svg",
    "src": "images/HSK_2.0/level5/课程.svg",
    "caption": "khóa học, chương trình học"
  },
  "克服": {
    "file": "克服.svg",
    "src": "images/HSK_2.0/level5/克服.svg",
    "caption": "khắc phục"
  },
  "刻苦": {
    "file": "刻苦.svg",
    "src": "images/HSK_2.0/level5/刻苦.svg",
    "caption": "chịu khó, khắc khổ"
  },
  "空间": {
    "file": "空间.svg",
    "src": "images/HSK_2.0/level5/空间.svg",
    "caption": "không gian"
  },
  "空闲": {
    "file": "空闲.svg",
    "src": "images/HSK_2.0/level5/空闲.svg",
    "caption": "rảnh rỗi"
  },
  "夸张": {
    "file": "夸张.svg",
    "src": "images/HSK_2.0/level5/夸张.svg",
    "caption": "phô trương, khoa trương"
  },
  "会计": {
    "file": "会计.svg",
    "src": "images/HSK_2.0/level5/会计.svg",
    "caption": "kế toán"
  },
  "宽": {
    "file": "宽.svg",
    "src": "images/HSK_2.0/level5/宽.svg",
    "caption": "rộng"
  },
  "昆虫": {
    "file": "昆虫.svg",
    "src": "images/HSK_2.0/level5/昆虫.svg",
    "caption": "côn trùng"
  },
  "拦": {
    "file": "拦.svg",
    "src": "images/HSK_2.0/level5/拦.svg",
    "caption": "chặn, ngăn"
  },
  "朗读": {
    "file": "朗读.svg",
    "src": "images/HSK_2.0/level5/朗读.svg",
    "caption": "đọc to, đọc diễn cảm"
  },
  "劳驾": {
    "file": "劳驾.svg",
    "src": "images/HSK_2.0/level5/劳驾.svg",
    "caption": "xin làm ơn, làm phiền"
  },
  "老百姓": {
    "file": "老百姓.svg",
    "src": "images/HSK_2.0/level5/老百姓.svg",
    "caption": "dân thường, bách tính"
  },
  "老实": {
    "file": "老实.svg",
    "src": "images/HSK_2.0/level5/老实.svg",
    "caption": "thật thà, trung thực"
  },
  "老婆": {
    "file": "老婆.svg",
    "src": "images/HSK_2.0/level5/老婆.svg",
    "caption": "vợ (cách gọi thân mật)"
  },
  "乐观": {
    "file": "乐观.svg",
    "src": "images/HSK_2.0/level5/乐观.svg",
    "caption": "lạc quan"
  },
  "雷": {
    "file": "雷.svg",
    "src": "images/HSK_2.0/level5/雷.svg",
    "caption": "sấm sét"
  },
  "类型": {
    "file": "类型.svg",
    "src": "images/HSK_2.0/level5/类型.svg",
    "caption": "loại hình"
  },
  "冷淡": {
    "file": "冷淡.svg",
    "src": "images/HSK_2.0/level5/冷淡.svg",
    "caption": "lạnh nhạt, thờ ơ"
  },
  "梨": {
    "file": "梨.svg",
    "src": "images/HSK_2.0/level5/梨.svg",
    "caption": "quả lê"
  },
  "离婚": {
    "file": "离婚.svg",
    "src": "images/HSK_2.0/level5/离婚.svg",
    "caption": "ly hôn"
  },
  "厘米": {
    "file": "厘米.svg",
    "src": "images/HSK_2.0/level5/厘米.svg",
    "caption": "xentimét"
  },
  "立即": {
    "file": "立即.svg",
    "src": "images/HSK_2.0/level5/立即.svg",
    "caption": "lập tức"
  },
  "利润": {
    "file": "利润.svg",
    "src": "images/HSK_2.0/level5/利润.svg",
    "caption": "lợi nhuận"
  },
  "利益": {
    "file": "利益.svg",
    "src": "images/HSK_2.0/level5/利益.svg",
    "caption": "lợi ích"
  },
  "连续": {
    "file": "连续.svg",
    "src": "images/HSK_2.0/level5/连续.svg",
    "caption": "liên tục"
  },
  "恋爱": {
    "file": "恋爱.svg",
    "src": "images/HSK_2.0/level5/恋爱.svg",
    "caption": "tình yêu, hẹn hò"
  },
  "良好": {
    "file": "良好.svg",
    "src": "images/HSK_2.0/level5/良好.svg",
    "caption": "tốt đẹp"
  },
  "粮食": {
    "file": "粮食.svg",
    "src": "images/HSK_2.0/level5/粮食.svg",
    "caption": "lương thực, ngũ cốc"
  },
  "亮": {
    "file": "亮.svg",
    "src": "images/HSK_2.0/level5/亮.svg",
    "caption": "sáng"
  },
  "铃": {
    "file": "铃.svg",
    "src": "images/HSK_2.0/level5/铃.svg",
    "caption": "cái chuông"
  },
  "零件": {
    "file": "零件.svg",
    "src": "images/HSK_2.0/level5/零件.svg",
    "caption": "linh kiện, phụ tùng"
  },
  "零食": {
    "file": "零食.svg",
    "src": "images/HSK_2.0/level5/零食.svg",
    "caption": "đồ ăn vặt"
  },
  "领导": {
    "file": "领导.svg",
    "src": "images/HSK_2.0/level5/领导.svg",
    "caption": "lãnh đạo"
  },
  "流泪": {
    "file": "流泪.svg",
    "src": "images/HSK_2.0/level5/流泪.svg",
    "caption": "rơi lệ, chảy nước mắt"
  },
  "陆续": {
    "file": "陆续.svg",
    "src": "images/HSK_2.0/level5/陆续.svg",
    "caption": "lần lượt, liên tiếp"
  },
  "录音": {
    "file": "录音.svg",
    "src": "images/HSK_2.0/level5/录音.svg",
    "caption": "ghi âm"
  },
  "轮流": {
    "file": "轮流.svg",
    "src": "images/HSK_2.0/level5/轮流.svg",
    "caption": "lần lượt, thay phiên"
  },
  "逻辑": {
    "file": "逻辑.svg",
    "src": "images/HSK_2.0/level5/逻辑.svg",
    "caption": "logic"
  },
  "馒头": {
    "file": "馒头.svg",
    "src": "images/HSK_2.0/level5/馒头.svg",
    "caption": "bánh bao (không nhân)"
  },
  "毛病": {
    "file": "毛病.svg",
    "src": "images/HSK_2.0/level5/毛病.svg",
    "caption": "lỗi, thói xấu, trục trặc"
  },
  "矛盾": {
    "file": "矛盾.svg",
    "src": "images/HSK_2.0/level5/矛盾.svg",
    "caption": "mâu thuẫn"
  },
  "贸易": {
    "file": "贸易.svg",
    "src": "images/HSK_2.0/level5/贸易.svg",
    "caption": "mậu dịch, thương mại"
  },
  "媒体": {
    "file": "媒体.svg",
    "src": "images/HSK_2.0/level5/媒体.svg",
    "caption": "truyền thông, media"
  },
  "煤炭": {
    "file": "煤炭.svg",
    "src": "images/HSK_2.0/level5/煤炭.svg",
    "caption": "than đá"
  },
  "魅力": {
    "file": "魅力.svg",
    "src": "images/HSK_2.0/level5/魅力.svg",
    "caption": "sức hấp dẫn, sự quyến rũ"
  },
  "梦想": {
    "file": "梦想.svg",
    "src": "images/HSK_2.0/level5/梦想.svg",
    "caption": "ước mơ"
  },
  "蜜蜂": {
    "file": "蜜蜂.svg",
    "src": "images/HSK_2.0/level5/蜜蜂.svg",
    "caption": "con ong"
  },
  "密切": {
    "file": "密切.svg",
    "src": "images/HSK_2.0/level5/密切.svg",
    "caption": "mật thiết, chặt chẽ"
  },
  "秘书": {
    "file": "秘书.svg",
    "src": "images/HSK_2.0/level5/秘书.svg",
    "caption": "thư ký"
  },
  "面积": {
    "file": "面积.svg",
    "src": "images/HSK_2.0/level5/面积.svg",
    "caption": "diện tích"
  },
  "描写": {
    "file": "描写.svg",
    "src": "images/HSK_2.0/level5/描写.svg",
    "caption": "miêu tả"
  },
  "敏感": {
    "file": "敏感.svg",
    "src": "images/HSK_2.0/level5/敏感.svg",
    "caption": "nhạy cảm"
  },
  "明星": {
    "file": "明星.svg",
    "src": "images/HSK_2.0/level5/明星.svg",
    "caption": "minh tinh, ngôi sao"
  },
  "名片": {
    "file": "名片.svg",
    "src": "images/HSK_2.0/level5/名片.svg",
    "caption": "danh thiếp"
  },
  "命运": {
    "file": "命运.svg",
    "src": "images/HSK_2.0/level5/命运.svg",
    "caption": "vận mệnh, số phận"
  },
  "模仿": {
    "file": "模仿.svg",
    "src": "images/HSK_2.0/level5/模仿.svg",
    "caption": "mô phỏng, bắt chước"
  },
  "模特": {
    "file": "模特.svg",
    "src": "images/HSK_2.0/level5/模特.svg",
    "caption": "người mẫu"
  },
  "陌生": {
    "file": "陌生.svg",
    "src": "images/HSK_2.0/level5/陌生.svg",
    "caption": "lạ, xa lạ"
  },
  "目前": {
    "file": "目前.svg",
    "src": "images/HSK_2.0/level5/目前.svg",
    "caption": "hiện tại, trước mắt"
  },
  "难怪": {
    "file": "难怪.svg",
    "src": "images/HSK_2.0/level5/难怪.svg",
    "caption": "chẳng trách, không lạ gì"
  },
  "内部": {
    "file": "内部.svg",
    "src": "images/HSK_2.0/level5/内部.svg",
    "caption": "nội bộ, bên trong"
  },
  "嗯": {
    "file": "嗯.svg",
    "src": "images/HSK_2.0/level5/嗯.svg",
    "caption": "ừ, vâng (thán từ)"
  },
  "念": {
    "file": "念.svg",
    "src": "images/HSK_2.0/level5/念.svg",
    "caption": "đọc, niệm"
  },
  "浓": {
    "file": "浓.svg",
    "src": "images/HSK_2.0/level5/浓.svg",
    "caption": "đậm, đặc"
  },
  "农民": {
    "file": "农民.svg",
    "src": "images/HSK_2.0/level5/农民.svg",
    "caption": "nông dân"
  },
  "欧洲": {
    "file": "欧洲.svg",
    "src": "images/HSK_2.0/level5/欧洲.svg",
    "caption": "châu Âu"
  },
  "偶然": {
    "file": "偶然.svg",
    "src": "images/HSK_2.0/level5/偶然.svg",
    "caption": "ngẫu nhiên, bất ngờ"
  },
  "拍": {
    "file": "拍.svg",
    "src": "images/HSK_2.0/level5/拍.svg",
    "caption": "đập, chụp (ảnh)"
  },
  "盼望": {
    "file": "盼望.svg",
    "src": "images/HSK_2.0/level5/盼望.svg",
    "caption": "mong đợi, trông mong"
  },
  "培训": {
    "file": "培训.svg",
    "src": "images/HSK_2.0/level5/培训.svg",
    "caption": "đào tạo, huấn luyện"
  },
  "佩服": {
    "file": "佩服.svg",
    "src": "images/HSK_2.0/level5/佩服.svg",
    "caption": "khâm phục, ngưỡng mộ"
  },
  "盆": {
    "file": "盆.svg",
    "src": "images/HSK_2.0/level5/盆.svg",
    "caption": "cái chậu"
  },
  "碰": {
    "file": "碰.svg",
    "src": "images/HSK_2.0/level5/碰.svg",
    "caption": "va, đụng, gặp"
  },
  "批": {
    "file": "批.svg",
    "src": "images/HSK_2.0/level5/批.svg",
    "caption": "lô, mẻ, đợt"
  },
  "批准": {
    "file": "批准.svg",
    "src": "images/HSK_2.0/level5/批准.svg",
    "caption": "phê chuẩn"
  },
  "疲劳": {
    "file": "疲劳.svg",
    "src": "images/HSK_2.0/level5/疲劳.svg",
    "caption": "mệt mỏi, mỏi mệt"
  },
  "匹": {
    "file": "匹.svg",
    "src": "images/HSK_2.0/level5/匹.svg",
    "caption": "con (lượng từ ngựa)"
  },
  "片": {
    "file": "片.svg",
    "src": "images/HSK_2.0/level5/片.svg",
    "caption": "miếng, lát mỏng"
  },
  "飘": {
    "file": "飘.svg",
    "src": "images/HSK_2.0/level5/飘.svg",
    "caption": "bay phất phơ, lơ lửng"
  },
  "频道": {
    "file": "频道.svg",
    "src": "images/HSK_2.0/level5/频道.svg",
    "caption": "kênh (truyền hình)"
  },
  "凭": {
    "file": "凭.svg",
    "src": "images/HSK_2.0/level5/凭.svg",
    "caption": "dựa vào, căn cứ vào"
  },
  "平安": {
    "file": "平安.svg",
    "src": "images/HSK_2.0/level5/平安.svg",
    "caption": "bình an"
  },
  "平等": {
    "file": "平等.svg",
    "src": "images/HSK_2.0/level5/平等.svg",
    "caption": "bình đẳng"
  },
  "平衡": {
    "file": "平衡.svg",
    "src": "images/HSK_2.0/level5/平衡.svg",
    "caption": "cân bằng"
  },
  "平均": {
    "file": "平均.svg",
    "src": "images/HSK_2.0/level5/平均.svg",
    "caption": "trung bình, bình quân"
  },
  "破产": {
    "file": "破产.svg",
    "src": "images/HSK_2.0/level5/破产.svg",
    "caption": "phá sản"
  },
  "迫切": {
    "file": "迫切.svg",
    "src": "images/HSK_2.0/level5/迫切.svg",
    "caption": "cấp bách, khẩn thiết"
  },
  "期间": {
    "file": "期间.svg",
    "src": "images/HSK_2.0/level5/期间.svg",
    "caption": "thời gian, khoảng thời gian"
  },
  "其余": {
    "file": "其余.svg",
    "src": "images/HSK_2.0/level5/其余.svg",
    "caption": "còn lại, phần còn lại"
  },
  "企业": {
    "file": "企业.svg",
    "src": "images/HSK_2.0/level5/企业.svg",
    "caption": "doanh nghiệp"
  },
  "前途": {
    "file": "前途.svg",
    "src": "images/HSK_2.0/level5/前途.svg",
    "caption": "tiền đồ, tương lai"
  },
  "欠": {
    "file": "欠.svg",
    "src": "images/HSK_2.0/level5/欠.svg",
    "caption": "thiếu, nợ"
  },
  "墙": {
    "file": "墙.svg",
    "src": "images/HSK_2.0/level5/墙.svg",
    "caption": "tường"
  },
  "强烈": {
    "file": "强烈.svg",
    "src": "images/HSK_2.0/level5/强烈.svg",
    "caption": "mạnh mẽ, kịch liệt"
  },
  "切": {
    "file": "切.svg",
    "src": "images/HSK_2.0/level5/切.svg",
    "caption": "cắt, thái"
  },
  "亲自": {
    "file": "亲自.svg",
    "src": "images/HSK_2.0/level5/亲自.svg",
    "caption": "tự mình, đích thân"
  },
  "青": {
    "file": "青.svg",
    "src": "images/HSK_2.0/level5/青.svg",
    "caption": "xanh (màu); trẻ"
  },
  "青少年": {
    "file": "青少年.svg",
    "src": "images/HSK_2.0/level5/青少年.svg",
    "caption": "thanh thiếu niên"
  },
  "轻易": {
    "file": "轻易.svg",
    "src": "images/HSK_2.0/level5/轻易.svg",
    "caption": "dễ dàng, tùy tiện"
  },
  "清淡": {
    "file": "清淡.svg",
    "src": "images/HSK_2.0/level5/清淡.svg",
    "caption": "thanh đạm, nhạt"
  },
  "情景": {
    "file": "情景.svg",
    "src": "images/HSK_2.0/level5/情景.svg",
    "caption": "cảnh tượng, tình cảnh"
  },
  "情绪": {
    "file": "情绪.svg",
    "src": "images/HSK_2.0/level5/情绪.svg",
    "caption": "tâm trạng, cảm xúc"
  },
  "庆祝": {
    "file": "庆祝.svg",
    "src": "images/HSK_2.0/level5/庆祝.svg",
    "caption": "chúc mừng, ăn mừng"
  },
  "娶": {
    "file": "娶.svg",
    "src": "images/HSK_2.0/level5/娶.svg",
    "caption": "lấy vợ, cưới"
  },
  "取消": {
    "file": "取消.svg",
    "src": "images/HSK_2.0/level5/取消.svg",
    "caption": "hủy bỏ"
  },
  "圈": {
    "file": "圈.svg",
    "src": "images/HSK_2.0/level5/圈.svg",
    "caption": "vòng, khoanh tròn"
  },
  "全面": {
    "file": "全面.svg",
    "src": "images/HSK_2.0/level5/全面.svg",
    "caption": "toàn diện"
  },
  "权利": {
    "file": "权利.svg",
    "src": "images/HSK_2.0/level5/权利.svg",
    "caption": "quyền lợi"
  },
  "确定": {
    "file": "确定.svg",
    "src": "images/HSK_2.0/level5/确定.svg",
    "caption": "xác định"
  },
  "热烈": {
    "file": "热烈.svg",
    "src": "images/HSK_2.0/level5/热烈.svg",
    "caption": "nhiệt liệt, sôi nổi"
  },
  "人口": {
    "file": "人口.svg",
    "src": "images/HSK_2.0/level5/人口.svg",
    "caption": "dân số"
  },
  "人民币": {
    "file": "人民币.svg",
    "src": "images/HSK_2.0/level5/人民币.svg",
    "caption": "đồng nhân dân tệ"
  },
  "人事": {
    "file": "人事.svg",
    "src": "images/HSK_2.0/level5/人事.svg",
    "caption": "nhân sự"
  },
  "人员": {
    "file": "人员.svg",
    "src": "images/HSK_2.0/level5/人员.svg",
    "caption": "nhân viên, người làm"
  },
  "日常": {
    "file": "日常.svg",
    "src": "images/HSK_2.0/level5/日常.svg",
    "caption": "thường ngày, hàng ngày"
  },
  "日期": {
    "file": "日期.svg",
    "src": "images/HSK_2.0/level5/日期.svg",
    "caption": "ngày, ngày tháng"
  },
  "日子": {
    "file": "日子.svg",
    "src": "images/HSK_2.0/level5/日子.svg",
    "caption": "ngày tháng, cuộc sống"
  },
  "如今": {
    "file": "如今.svg",
    "src": "images/HSK_2.0/level5/如今.svg",
    "caption": "hiện nay, ngày nay"
  },
  "软": {
    "file": "软.svg",
    "src": "images/HSK_2.0/level5/软.svg",
    "caption": "mềm"
  },
  "弱": {
    "file": "弱.svg",
    "src": "images/HSK_2.0/level5/弱.svg",
    "caption": "yếu"
  },
  "色彩": {
    "file": "色彩.svg",
    "src": "images/HSK_2.0/level5/色彩.svg",
    "caption": "màu sắc, sắc thái"
  },
  "杀": {
    "file": "杀.svg",
    "src": "images/HSK_2.0/level5/杀.svg",
    "caption": "giết"
  },
  "沙漠": {
    "file": "沙漠.svg",
    "src": "images/HSK_2.0/level5/沙漠.svg",
    "caption": "sa mạc"
  },
  "傻": {
    "file": "傻.svg",
    "src": "images/HSK_2.0/level5/傻.svg",
    "caption": "ngốc, ngu ngơ"
  },
  "删除": {
    "file": "删除.svg",
    "src": "images/HSK_2.0/level5/删除.svg",
    "caption": "xóa, xóa bỏ"
  },
  "善良": {
    "file": "善良.svg",
    "src": "images/HSK_2.0/level5/善良.svg",
    "caption": "hiền lành, tốt bụng"
  },
  "扇子": {
    "file": "扇子.svg",
    "src": "images/HSK_2.0/level5/扇子.svg",
    "caption": "cái quạt"
  },
  "商业": {
    "file": "商业.svg",
    "src": "images/HSK_2.0/level5/商业.svg",
    "caption": "thương nghiệp, kinh doanh"
  },
  "上当": {
    "file": "上当.svg",
    "src": "images/HSK_2.0/level5/上当.svg",
    "caption": "bị lừa, mắc lừa"
  },
  "蛇": {
    "file": "蛇.svg",
    "src": "images/HSK_2.0/level5/蛇.svg",
    "caption": "con rắn"
  },
  "设备": {
    "file": "设备.svg",
    "src": "images/HSK_2.0/level5/设备.svg",
    "caption": "thiết bị"
  },
  "设施": {
    "file": "设施.svg",
    "src": "images/HSK_2.0/level5/设施.svg",
    "caption": "cơ sở vật chất, hạ tầng"
  },
  "射击": {
    "file": "射击.svg",
    "src": "images/HSK_2.0/level5/射击.svg",
    "caption": "bắn, xạ kích"
  },
  "身材": {
    "file": "身材.svg",
    "src": "images/HSK_2.0/level5/身材.svg",
    "caption": "thân hình, vóc dáng"
  },
  "神话": {
    "file": "神话.svg",
    "src": "images/HSK_2.0/level5/神话.svg",
    "caption": "thần thoại"
  },
  "升": {
    "file": "升.svg",
    "src": "images/HSK_2.0/level5/升.svg",
    "caption": "thăng, lên"
  },
  "生产": {
    "file": "生产.svg",
    "src": "images/HSK_2.0/level5/生产.svg",
    "caption": "sản xuất"
  },
  "声调": {
    "file": "声调.svg",
    "src": "images/HSK_2.0/level5/声调.svg",
    "caption": "thanh điệu"
  },
  "绳子": {
    "file": "绳子.svg",
    "src": "images/HSK_2.0/level5/绳子.svg",
    "caption": "dây, sợi dây"
  },
  "省略": {
    "file": "省略.svg",
    "src": "images/HSK_2.0/level5/省略.svg",
    "caption": "tỉnh lược, bỏ qua"
  },
  "胜利": {
    "file": "胜利.svg",
    "src": "images/HSK_2.0/level5/胜利.svg",
    "caption": "thắng lợi"
  },
  "失去": {
    "file": "失去.svg",
    "src": "images/HSK_2.0/level5/失去.svg",
    "caption": "mất đi"
  },
  "失业": {
    "file": "失业.svg",
    "src": "images/HSK_2.0/level5/失业.svg",
    "caption": "thất nghiệp"
  },
  "湿润": {
    "file": "湿润.svg",
    "src": "images/HSK_2.0/level5/湿润.svg",
    "caption": "ẩm ướt, ẩm"
  },
  "时差": {
    "file": "时差.svg",
    "src": "images/HSK_2.0/level5/时差.svg",
    "caption": "chênh lệch giờ"
  },
  "时刻": {
    "file": "时刻.svg",
    "src": "images/HSK_2.0/level5/时刻.svg",
    "caption": "thời khắc, giây phút"
  },
  "时期": {
    "file": "时期.svg",
    "src": "images/HSK_2.0/level5/时期.svg",
    "caption": "thời kỳ"
  },
  "实话": {
    "file": "实话.svg",
    "src": "images/HSK_2.0/level5/实话.svg",
    "caption": "lời nói thật"
  },
  "实践": {
    "file": "实践.svg",
    "src": "images/HSK_2.0/level5/实践.svg",
    "caption": "thực tiễn"
  },
  "实现": {
    "file": "实现.svg",
    "src": "images/HSK_2.0/level5/实现.svg",
    "caption": "thực hiện"
  },
  "实用": {
    "file": "实用.svg",
    "src": "images/HSK_2.0/level5/实用.svg",
    "caption": "thực dụng, hữu dụng"
  },
  "食物": {
    "file": "食物.svg",
    "src": "images/HSK_2.0/level5/食物.svg",
    "caption": "thức ăn, thực phẩm"
  },
  "士兵": {
    "file": "士兵.svg",
    "src": "images/HSK_2.0/level5/士兵.svg",
    "caption": "binh sĩ"
  },
  "似的": {
    "file": "似的.svg",
    "src": "images/HSK_2.0/level5/似的.svg",
    "caption": "giống như, tựa như"
  },
  "事实": {
    "file": "事实.svg",
    "src": "images/HSK_2.0/level5/事实.svg",
    "caption": "sự thật"
  },
  "事先": {
    "file": "事先.svg",
    "src": "images/HSK_2.0/level5/事先.svg",
    "caption": "trước đó, trước khi"
  },
  "收获": {
    "file": "收获.svg",
    "src": "images/HSK_2.0/level5/收获.svg",
    "caption": "thu hoạch"
  },
  "手套": {
    "file": "手套.svg",
    "src": "images/HSK_2.0/level5/手套.svg",
    "caption": "bao tay, găng tay"
  },
  "手指": {
    "file": "手指.svg",
    "src": "images/HSK_2.0/level5/手指.svg",
    "caption": "ngón tay"
  },
  "蔬菜": {
    "file": "蔬菜.svg",
    "src": "images/HSK_2.0/level5/蔬菜.svg",
    "caption": "rau xanh"
  },
  "舒适": {
    "file": "舒适.svg",
    "src": "images/HSK_2.0/level5/舒适.svg",
    "caption": "thoải mái, dễ chịu"
  },
  "梳子": {
    "file": "梳子.svg",
    "src": "images/HSK_2.0/level5/梳子.svg",
    "caption": "cái lược"
  },
  "属于": {
    "file": "属于.svg",
    "src": "images/HSK_2.0/level5/属于.svg",
    "caption": "thuộc về"
  },
  "数": {
    "file": "数.svg",
    "src": "images/HSK_2.0/level5/数.svg",
    "caption": "đếm, tính"
  },
  "甩": {
    "file": "甩.svg",
    "src": "images/HSK_2.0/level5/甩.svg",
    "caption": "vứt bỏ, vẩy"
  },
  "说不定": {
    "file": "说不定.svg",
    "src": "images/HSK_2.0/level5/说不定.svg",
    "caption": "không chắc, có lẽ"
  },
  "撕": {
    "file": "撕.svg",
    "src": "images/HSK_2.0/level5/撕.svg",
    "caption": "xé"
  },
  "丝毫": {
    "file": "丝毫.svg",
    "src": "images/HSK_2.0/level5/丝毫.svg",
    "caption": "một chút, mảy may"
  },
  "思考": {
    "file": "思考.svg",
    "src": "images/HSK_2.0/level5/思考.svg",
    "caption": "suy nghĩ, tư duy"
  },
  "私人": {
    "file": "私人.svg",
    "src": "images/HSK_2.0/level5/私人.svg",
    "caption": "cá nhân, riêng tư"
  },
  "搜索": {
    "file": "搜索.svg",
    "src": "images/HSK_2.0/level5/搜索.svg",
    "caption": "tìm kiếm, tra cứu"
  },
  "宿舍": {
    "file": "宿舍.svg",
    "src": "images/HSK_2.0/level5/宿舍.svg",
    "caption": "nhà tập thể, ký túc xá"
  },
  "随时": {
    "file": "随时.svg",
    "src": "images/HSK_2.0/level5/随时.svg",
    "caption": "bất cứ lúc nào"
  },
  "随手": {
    "file": "随手.svg",
    "src": "images/HSK_2.0/level5/随手.svg",
    "caption": "tiện tay, nhân tiện"
  },
  "缩短": {
    "file": "缩短.svg",
    "src": "images/HSK_2.0/level5/缩短.svg",
    "caption": "rút ngắn"
  },
  "所": {
    "file": "所.svg",
    "src": "images/HSK_2.0/level5/所.svg",
    "caption": "nơi, sở (lượng từ tổ chức)"
  },
  "太太": {
    "file": "太太.svg",
    "src": "images/HSK_2.0/level5/太太.svg",
    "caption": "bà (vợ, phu nhân)"
  },
  "谈判": {
    "file": "谈判.svg",
    "src": "images/HSK_2.0/level5/谈判.svg",
    "caption": "đàm phán"
  },
  "坦率": {
    "file": "坦率.svg",
    "src": "images/HSK_2.0/level5/坦率.svg",
    "caption": "thẳng thắn"
  },
  "烫": {
    "file": "烫.svg",
    "src": "images/HSK_2.0/level5/烫.svg",
    "caption": "bỏng, nóng"
  },
  "桃": {
    "file": "桃.svg",
    "src": "images/HSK_2.0/level5/桃.svg",
    "caption": "quả đào"
  },
  "逃避": {
    "file": "逃避.svg",
    "src": "images/HSK_2.0/level5/逃避.svg",
    "caption": "trốn tránh"
  },
  "特殊": {
    "file": "特殊.svg",
    "src": "images/HSK_2.0/level5/特殊.svg",
    "caption": "đặc biệt"
  },
  "特征": {
    "file": "特征.svg",
    "src": "images/HSK_2.0/level5/特征.svg",
    "caption": "đặc trưng"
  },
  "疼爱": {
    "file": "疼爱.svg",
    "src": "images/HSK_2.0/level5/疼爱.svg",
    "caption": "yêu thương, cưng chiều"
  },
  "提纲": {
    "file": "提纲.svg",
    "src": "images/HSK_2.0/level5/提纲.svg",
    "caption": "đề cương, dàn ý"
  },
  "提问": {
    "file": "提问.svg",
    "src": "images/HSK_2.0/level5/提问.svg",
    "caption": "đặt câu hỏi"
  },
  "体会": {
    "file": "体会.svg",
    "src": "images/HSK_2.0/level5/体会.svg",
    "caption": "thể nghiệm, cảm nhận"
  },
  "体现": {
    "file": "体现.svg",
    "src": "images/HSK_2.0/level5/体现.svg",
    "caption": "thể hiện"
  },
  "调皮": {
    "file": "调皮.svg",
    "src": "images/HSK_2.0/level5/调皮.svg",
    "caption": "nghịch ngợm"
  },
  "挑战": {
    "file": "挑战.svg",
    "src": "images/HSK_2.0/level5/挑战.svg",
    "caption": "thử thách, thách thức"
  },
  "痛苦": {
    "file": "痛苦.svg",
    "src": "images/HSK_2.0/level5/痛苦.svg",
    "caption": "đau khổ"
  },
  "投入": {
    "file": "投入.svg",
    "src": "images/HSK_2.0/level5/投入.svg",
    "caption": "đầu tư vào, dồn vào"
  },
  "透明": {
    "file": "透明.svg",
    "src": "images/HSK_2.0/level5/透明.svg",
    "caption": "trong suốt, minh bạch"
  },
  "土地": {
    "file": "土地.svg",
    "src": "images/HSK_2.0/level5/土地.svg",
    "caption": "đất đai"
  },
  "吐": {
    "file": "吐.svg",
    "src": "images/HSK_2.0/level5/吐.svg",
    "caption": "nhổ, nôn"
  },
  "团": {
    "file": "团.svg",
    "src": "images/HSK_2.0/level5/团.svg",
    "caption": "đoàn, nhóm"
  },
  "推广": {
    "file": "推广.svg",
    "src": "images/HSK_2.0/level5/推广.svg",
    "caption": "quảng bá, phổ biến rộng"
  },
  "退步": {
    "file": "退步.svg",
    "src": "images/HSK_2.0/level5/退步.svg",
    "caption": "lùi bước, thoái bộ"
  },
  "歪": {
    "file": "歪.svg",
    "src": "images/HSK_2.0/level5/歪.svg",
    "caption": "lệch, vẹo"
  },
  "外交": {
    "file": "外交.svg",
    "src": "images/HSK_2.0/level5/外交.svg",
    "caption": "ngoại giao"
  },
  "完美": {
    "file": "完美.svg",
    "src": "images/HSK_2.0/level5/完美.svg",
    "caption": "hoàn hảo"
  },
  "完善": {
    "file": "完善.svg",
    "src": "images/HSK_2.0/level5/完善.svg",
    "caption": "hoàn thiện"
  },
  "王子": {
    "file": "王子.svg",
    "src": "images/HSK_2.0/level5/王子.svg",
    "caption": "hoàng tử"
  },
  "往返": {
    "file": "往返.svg",
    "src": "images/HSK_2.0/level5/往返.svg",
    "caption": "đi lại, khứ hồi"
  },
  "网络": {
    "file": "网络.svg",
    "src": "images/HSK_2.0/level5/网络.svg",
    "caption": "mạng, internet"
  },
  "危害": {
    "file": "危害.svg",
    "src": "images/HSK_2.0/level5/危害.svg",
    "caption": "gây hại, tổn hại"
  },
  "微笑": {
    "file": "微笑.svg",
    "src": "images/HSK_2.0/level5/微笑.svg",
    "caption": "mỉm cười"
  },
  "违反": {
    "file": "违反.svg",
    "src": "images/HSK_2.0/level5/违反.svg",
    "caption": "vi phạm"
  },
  "围巾": {
    "file": "围巾.svg",
    "src": "images/HSK_2.0/level5/围巾.svg",
    "caption": "khăn quàng cổ"
  },
  "唯一": {
    "file": "唯一.svg",
    "src": "images/HSK_2.0/level5/唯一.svg",
    "caption": "duy nhất"
  },
  "伟大": {
    "file": "伟大.svg",
    "src": "images/HSK_2.0/level5/伟大.svg",
    "caption": "vĩ đại"
  },
  "胃口": {
    "file": "胃口.svg",
    "src": "images/HSK_2.0/level5/胃口.svg",
    "caption": "khẩu vị, sự thèm ăn"
  },
  "位置": {
    "file": "位置.svg",
    "src": "images/HSK_2.0/level5/位置.svg",
    "caption": "vị trí"
  },
  "未来": {
    "file": "未来.svg",
    "src": "images/HSK_2.0/level5/未来.svg",
    "caption": "tương lai"
  },
  "温暖": {
    "file": "温暖.svg",
    "src": "images/HSK_2.0/level5/温暖.svg",
    "caption": "ấm áp"
  },
  "闻": {
    "file": "闻.svg",
    "src": "images/HSK_2.0/level5/闻.svg",
    "caption": "nghe, ngửi"
  },
  "文件": {
    "file": "文件.svg",
    "src": "images/HSK_2.0/level5/文件.svg",
    "caption": "văn kiện, tài liệu"
  },
  "文明": {
    "file": "文明.svg",
    "src": "images/HSK_2.0/level5/文明.svg",
    "caption": "văn minh"
  },
  "文字": {
    "file": "文字.svg",
    "src": "images/HSK_2.0/level5/文字.svg",
    "caption": "văn tự, chữ viết"
  },
  "吻": {
    "file": "吻.svg",
    "src": "images/HSK_2.0/level5/吻.svg",
    "caption": "hôn"
  },
  "握手": {
    "file": "握手.svg",
    "src": "images/HSK_2.0/level5/握手.svg",
    "caption": "bắt tay"
  },
  "屋子": {
    "file": "屋子.svg",
    "src": "images/HSK_2.0/level5/屋子.svg",
    "caption": "căn phòng, căn nhà"
  },
  "无奈": {
    "file": "无奈.svg",
    "src": "images/HSK_2.0/level5/无奈.svg",
    "caption": "đành chịu, bất lực"
  },
  "无所谓": {
    "file": "无所谓.svg",
    "src": "images/HSK_2.0/level5/无所谓.svg",
    "caption": "không quan trọng, không sao"
  },
  "武术": {
    "file": "武术.svg",
    "src": "images/HSK_2.0/level5/武术.svg",
    "caption": "võ thuật"
  },
  "雾": {
    "file": "雾.svg",
    "src": "images/HSK_2.0/level5/雾.svg",
    "caption": "sương mù"
  },
  "物理": {
    "file": "物理.svg",
    "src": "images/HSK_2.0/level5/物理.svg",
    "caption": "vật lý"
  },
  "吸收": {
    "file": "吸收.svg",
    "src": "images/HSK_2.0/level5/吸收.svg",
    "caption": "hấp thu"
  },
  "系": {
    "file": "系.svg",
    "src": "images/HSK_2.0/level5/系.svg",
    "caption": "khoa (trong trường đại học)"
  },
  "细节": {
    "file": "细节.svg",
    "src": "images/HSK_2.0/level5/细节.svg",
    "caption": "chi tiết"
  },
  "瞎": {
    "file": "瞎.svg",
    "src": "images/HSK_2.0/level5/瞎.svg",
    "caption": "mù, mù quáng"
  },
  "鲜艳": {
    "file": "鲜艳.svg",
    "src": "images/HSK_2.0/level5/鲜艳.svg",
    "caption": "rực rỡ, tươi sáng"
  },
  "显得": {
    "file": "显得.svg",
    "src": "images/HSK_2.0/level5/显得.svg",
    "caption": "trông có vẻ, tỏ ra"
  },
  "显示": {
    "file": "显示.svg",
    "src": "images/HSK_2.0/level5/显示.svg",
    "caption": "hiển thị, thể hiện"
  },
  "现代": {
    "file": "现代.svg",
    "src": "images/HSK_2.0/level5/现代.svg",
    "caption": "hiện đại"
  },
  "现实": {
    "file": "现实.svg",
    "src": "images/HSK_2.0/level5/现实.svg",
    "caption": "thực tế, hiện thực"
  },
  "限制": {
    "file": "限制.svg",
    "src": "images/HSK_2.0/level5/限制.svg",
    "caption": "hạn chế"
  },
  "相处": {
    "file": "相处.svg",
    "src": "images/HSK_2.0/level5/相处.svg",
    "caption": "sống cùng, chung sống"
  },
  "相对": {
    "file": "相对.svg",
    "src": "images/HSK_2.0/level5/相对.svg",
    "caption": "tương đối"
  },
  "相关": {
    "file": "相关.svg",
    "src": "images/HSK_2.0/level5/相关.svg",
    "caption": "tương quan, liên quan"
  },
  "想象": {
    "file": "想象.svg",
    "src": "images/HSK_2.0/level5/想象.svg",
    "caption": "tưởng tượng"
  },
  "项": {
    "file": "项.svg",
    "src": "images/HSK_2.0/level5/项.svg",
    "caption": "khoản, mục (lượng từ)"
  },
  "项目": {
    "file": "项目.svg",
    "src": "images/HSK_2.0/level5/项目.svg",
    "caption": "dự án, hạng mục"
  },
  "象棋": {
    "file": "象棋.svg",
    "src": "images/HSK_2.0/level5/象棋.svg",
    "caption": "cờ tướng"
  },
  "消费": {
    "file": "消费.svg",
    "src": "images/HSK_2.0/level5/消费.svg",
    "caption": "tiêu dùng, chi tiêu"
  },
  "消化": {
    "file": "消化.svg",
    "src": "images/HSK_2.0/level5/消化.svg",
    "caption": "tiêu hóa"
  },
  "销售": {
    "file": "销售.svg",
    "src": "images/HSK_2.0/level5/销售.svg",
    "caption": "tiêu thụ, bán hàng"
  },
  "小麦": {
    "file": "小麦.svg",
    "src": "images/HSK_2.0/level5/小麦.svg",
    "caption": "lúa mì"
  },
  "效率": {
    "file": "效率.svg",
    "src": "images/HSK_2.0/level5/效率.svg",
    "caption": "hiệu suất"
  },
  "歇": {
    "file": "歇.svg",
    "src": "images/HSK_2.0/level5/歇.svg",
    "caption": "nghỉ ngơi"
  },
  "欣赏": {
    "file": "欣赏.svg",
    "src": "images/HSK_2.0/level5/欣赏.svg",
    "caption": "thưởng thức, đánh giá cao"
  },
  "信号": {
    "file": "信号.svg",
    "src": "images/HSK_2.0/level5/信号.svg",
    "caption": "tín hiệu"
  },
  "行动": {
    "file": "行动.svg",
    "src": "images/HSK_2.0/level5/行动.svg",
    "caption": "hành động"
  },
  "行人": {
    "file": "行人.svg",
    "src": "images/HSK_2.0/level5/行人.svg",
    "caption": "người đi đường"
  },
  "形成": {
    "file": "形成.svg",
    "src": "images/HSK_2.0/level5/形成.svg",
    "caption": "hình thành"
  },
  "形式": {
    "file": "形式.svg",
    "src": "images/HSK_2.0/level5/形式.svg",
    "caption": "hình thức"
  },
  "形象": {
    "file": "形象.svg",
    "src": "images/HSK_2.0/level5/形象.svg",
    "caption": "hình tượng"
  },
  "性质": {
    "file": "性质.svg",
    "src": "images/HSK_2.0/level5/性质.svg",
    "caption": "tính chất"
  },
  "幸亏": {
    "file": "幸亏.svg",
    "src": "images/HSK_2.0/level5/幸亏.svg",
    "caption": "may mà"
  },
  "胸": {
    "file": "胸.svg",
    "src": "images/HSK_2.0/level5/胸.svg",
    "caption": "ngực"
  },
  "修改": {
    "file": "修改.svg",
    "src": "images/HSK_2.0/level5/修改.svg",
    "caption": "sửa đổi"
  },
  "休闲": {
    "file": "休闲.svg",
    "src": "images/HSK_2.0/level5/休闲.svg",
    "caption": "thư giãn, nhàn nhã"
  },
  "叙述": {
    "file": "叙述.svg",
    "src": "images/HSK_2.0/level5/叙述.svg",
    "caption": "tường thuật, kể lại"
  },
  "宣传": {
    "file": "宣传.svg",
    "src": "images/HSK_2.0/level5/宣传.svg",
    "caption": "tuyên truyền, quảng bá"
  },
  "学历": {
    "file": "学历.svg",
    "src": "images/HSK_2.0/level5/学历.svg",
    "caption": "học lực, học vấn"
  },
  "学问": {
    "file": "学问.svg",
    "src": "images/HSK_2.0/level5/学问.svg",
    "caption": "học thức, kiến thức"
  },
  "血": {
    "file": "血.svg",
    "src": "images/HSK_2.0/level5/血.svg",
    "caption": "máu"
  },
  "寻找": {
    "file": "寻找.svg",
    "src": "images/HSK_2.0/level5/寻找.svg",
    "caption": "tìm kiếm"
  },
  "迅速": {
    "file": "迅速.svg",
    "src": "images/HSK_2.0/level5/迅速.svg",
    "caption": "nhanh chóng"
  },
  "延长": {
    "file": "延长.svg",
    "src": "images/HSK_2.0/level5/延长.svg",
    "caption": "kéo dài"
  },
  "严肃": {
    "file": "严肃.svg",
    "src": "images/HSK_2.0/level5/严肃.svg",
    "caption": "nghiêm túc"
  },
  "演讲": {
    "file": "演讲.svg",
    "src": "images/HSK_2.0/level5/演讲.svg",
    "caption": "diễn thuyết"
  },
  "阳台": {
    "file": "阳台.svg",
    "src": "images/HSK_2.0/level5/阳台.svg",
    "caption": "ban công"
  },
  "摇": {
    "file": "摇.svg",
    "src": "images/HSK_2.0/level5/摇.svg",
    "caption": "lắc, rung"
  },
  "要不": {
    "file": "要不.svg",
    "src": "images/HSK_2.0/level5/要不.svg",
    "caption": "nếu không thì, hay là"
  },
  "业务": {
    "file": "业务.svg",
    "src": "images/HSK_2.0/level5/业务.svg",
    "caption": "nghiệp vụ, công việc"
  },
  "一辈子": {
    "file": "一辈子.svg",
    "src": "images/HSK_2.0/level5/一辈子.svg",
    "caption": "cả đời, một đời"
  },
  "一律": {
    "file": "一律.svg",
    "src": "images/HSK_2.0/level5/一律.svg",
    "caption": "đồng nhất, tất cả"
  },
  "移动": {
    "file": "移动.svg",
    "src": "images/HSK_2.0/level5/移动.svg",
    "caption": "di động, di chuyển"
  },
  "遗憾": {
    "file": "遗憾.svg",
    "src": "images/HSK_2.0/level5/遗憾.svg",
    "caption": "đáng tiếc, hối tiếc"
  },
  "乙": {
    "file": "乙.svg",
    "src": "images/HSK_2.0/level5/乙.svg",
    "caption": "thứ hai (trong giáp, ất...)"
  },
  "以及": {
    "file": "以及.svg",
    "src": "images/HSK_2.0/level5/以及.svg",
    "caption": "cùng với, và"
  },
  "亿": {
    "file": "亿.svg",
    "src": "images/HSK_2.0/level5/亿.svg",
    "caption": "trăm triệu, ức"
  },
  "意义": {
    "file": "意义.svg",
    "src": "images/HSK_2.0/level5/意义.svg",
    "caption": "ý nghĩa"
  },
  "因而": {
    "file": "因而.svg",
    "src": "images/HSK_2.0/level5/因而.svg",
    "caption": "do đó, vì vậy"
  },
  "银": {
    "file": "银.svg",
    "src": "images/HSK_2.0/level5/银.svg",
    "caption": "bạc"
  },
  "印刷": {
    "file": "印刷.svg",
    "src": "images/HSK_2.0/level5/印刷.svg",
    "caption": "in ấn"
  },
  "英雄": {
    "file": "英雄.svg",
    "src": "images/HSK_2.0/level5/英雄.svg",
    "caption": "anh hùng"
  },
  "迎接": {
    "file": "迎接.svg",
    "src": "images/HSK_2.0/level5/迎接.svg",
    "caption": "đón tiếp, chào đón"
  },
  "营业": {
    "file": "营业.svg",
    "src": "images/HSK_2.0/level5/营业.svg",
    "caption": "kinh doanh, mở cửa hàng"
  },
  "影子": {
    "file": "影子.svg",
    "src": "images/HSK_2.0/level5/影子.svg",
    "caption": "bóng (hình)"
  },
  "硬件": {
    "file": "硬件.svg",
    "src": "images/HSK_2.0/level5/硬件.svg",
    "caption": "phần cứng"
  },
  "拥抱": {
    "file": "拥抱.svg",
    "src": "images/HSK_2.0/level5/拥抱.svg",
    "caption": "ôm, ôm chầm"
  },
  "用途": {
    "file": "用途.svg",
    "src": "images/HSK_2.0/level5/用途.svg",
    "caption": "công dụng, mục đích sử dụng"
  },
  "优美": {
    "file": "优美.svg",
    "src": "images/HSK_2.0/level5/优美.svg",
    "caption": "tươi đẹp, ưu mỹ"
  },
  "游览": {
    "file": "游览.svg",
    "src": "images/HSK_2.0/level5/游览.svg",
    "caption": "du ngoạn, tham quan"
  },
  "犹豫": {
    "file": "犹豫.svg",
    "src": "images/HSK_2.0/level5/犹豫.svg",
    "caption": "do dự, lưỡng lự"
  },
  "幼儿园": {
    "file": "幼儿园.svg",
    "src": "images/HSK_2.0/level5/幼儿园.svg",
    "caption": "trường mẫu giáo"
  },
  "与其": {
    "file": "与其.svg",
    "src": "images/HSK_2.0/level5/与其.svg",
    "caption": "thay vì, hơn là"
  },
  "语气": {
    "file": "语气.svg",
    "src": "images/HSK_2.0/level5/语气.svg",
    "caption": "ngữ điệu, giọng nói"
  },
  "预订": {
    "file": "预订.svg",
    "src": "images/HSK_2.0/level5/预订.svg",
    "caption": "đặt trước"
  },
  "玉米": {
    "file": "玉米.svg",
    "src": "images/HSK_2.0/level5/玉米.svg",
    "caption": "bắp, ngô"
  },
  "原料": {
    "file": "原料.svg",
    "src": "images/HSK_2.0/level5/原料.svg",
    "caption": "nguyên liệu"
  },
  "原则": {
    "file": "原则.svg",
    "src": "images/HSK_2.0/level5/原则.svg",
    "caption": "nguyên tắc"
  },
  "乐器": {
    "file": "乐器.svg",
    "src": "images/HSK_2.0/level5/乐器.svg",
    "caption": "nhạc cụ"
  },
  "运输": {
    "file": "运输.svg",
    "src": "images/HSK_2.0/level5/运输.svg",
    "caption": "vận chuyển, vận tải"
  },
  "在于": {
    "file": "在于.svg",
    "src": "images/HSK_2.0/level5/在于.svg",
    "caption": "ở chỗ, nằm ở"
  },
  "赞美": {
    "file": "赞美.svg",
    "src": "images/HSK_2.0/level5/赞美.svg",
    "caption": "khen ngợi, ca ngợi"
  },
  "则": {
    "file": "则.svg",
    "src": "images/HSK_2.0/level5/则.svg",
    "caption": "thì, là (liên từ văn viết)"
  },
  "摘": {
    "file": "摘.svg",
    "src": "images/HSK_2.0/level5/摘.svg",
    "caption": "ngắt, hái"
  },
  "粘贴": {
    "file": "粘贴.svg",
    "src": "images/HSK_2.0/level5/粘贴.svg",
    "caption": "dán"
  },
  "展览": {
    "file": "展览.svg",
    "src": "images/HSK_2.0/level5/展览.svg",
    "caption": "triển lãm"
  },
  "占": {
    "file": "占.svg",
    "src": "images/HSK_2.0/level5/占.svg",
    "caption": "chiếm, chiếm giữ"
  },
  "战争": {
    "file": "战争.svg",
    "src": "images/HSK_2.0/level5/战争.svg",
    "caption": "chiến tranh"
  },
  "长辈": {
    "file": "长辈.svg",
    "src": "images/HSK_2.0/level5/长辈.svg",
    "caption": "người lớn tuổi, bậc trên"
  },
  "涨": {
    "file": "涨.svg",
    "src": "images/HSK_2.0/level5/涨.svg",
    "caption": "tăng, dâng lên"
  },
  "招待": {
    "file": "招待.svg",
    "src": "images/HSK_2.0/level5/招待.svg",
    "caption": "tiếp đãi, chiêu đãi"
  },
  "着火": {
    "file": "着火.svg",
    "src": "images/HSK_2.0/level5/着火.svg",
    "caption": "bốc cháy"
  },
  "着凉": {
    "file": "着凉.svg",
    "src": "images/HSK_2.0/level5/着凉.svg",
    "caption": "bị cảm lạnh"
  },
  "召开": {
    "file": "召开.svg",
    "src": "images/HSK_2.0/level5/召开.svg",
    "caption": "triệu tập, tổ chức (họp)"
  },
  "照常": {
    "file": "照常.svg",
    "src": "images/HSK_2.0/level5/照常.svg",
    "caption": "như thường lệ"
  },
  "哲学": {
    "file": "哲学.svg",
    "src": "images/HSK_2.0/level5/哲学.svg",
    "caption": "triết học"
  },
  "真实": {
    "file": "真实.svg",
    "src": "images/HSK_2.0/level5/真实.svg",
    "caption": "chân thực"
  },
  "针对": {
    "file": "针对.svg",
    "src": "images/HSK_2.0/level5/针对.svg",
    "caption": "nhằm vào, đối với"
  },
  "诊断": {
    "file": "诊断.svg",
    "src": "images/HSK_2.0/level5/诊断.svg",
    "caption": "chẩn đoán"
  },
  "振动": {
    "file": "振动.svg",
    "src": "images/HSK_2.0/level5/振动.svg",
    "caption": "rung động, chấn động"
  },
  "争论": {
    "file": "争论.svg",
    "src": "images/HSK_2.0/level5/争论.svg",
    "caption": "tranh luận, cãi vã"
  },
  "征求": {
    "file": "征求.svg",
    "src": "images/HSK_2.0/level5/征求.svg",
    "caption": "trưng cầu, xin ý kiến"
  },
  "整体": {
    "file": "整体.svg",
    "src": "images/HSK_2.0/level5/整体.svg",
    "caption": "toàn thể, tổng thể"
  },
  "政治": {
    "file": "政治.svg",
    "src": "images/HSK_2.0/level5/政治.svg",
    "caption": "chính trị"
  },
  "证据": {
    "file": "证据.svg",
    "src": "images/HSK_2.0/level5/证据.svg",
    "caption": "chứng cứ"
  },
  "挣": {
    "file": "挣.svg",
    "src": "images/HSK_2.0/level5/挣.svg",
    "caption": "kiếm (tiền)"
  },
  "直": {
    "file": "直.svg",
    "src": "images/HSK_2.0/level5/直.svg",
    "caption": "thẳng"
  },
  "执照": {
    "file": "执照.svg",
    "src": "images/HSK_2.0/level5/执照.svg",
    "caption": "giấy phép"
  },
  "指挥": {
    "file": "指挥.svg",
    "src": "images/HSK_2.0/level5/指挥.svg",
    "caption": "chỉ huy"
  },
  "制度": {
    "file": "制度.svg",
    "src": "images/HSK_2.0/level5/制度.svg",
    "caption": "chế độ, thể chế"
  },
  "制作": {
    "file": "制作.svg",
    "src": "images/HSK_2.0/level5/制作.svg",
    "caption": "chế tác, làm ra"
  },
  "至今": {
    "file": "至今.svg",
    "src": "images/HSK_2.0/level5/至今.svg",
    "caption": "đến nay"
  },
  "至于": {
    "file": "至于.svg",
    "src": "images/HSK_2.0/level5/至于.svg",
    "caption": "về việc, đối với"
  },
  "治疗": {
    "file": "治疗.svg",
    "src": "images/HSK_2.0/level5/治疗.svg",
    "caption": "điều trị"
  },
  "志愿者": {
    "file": "志愿者.svg",
    "src": "images/HSK_2.0/level5/志愿者.svg",
    "caption": "người tự nguyện, tình nguyện viên"
  },
  "中心": {
    "file": "中心.svg",
    "src": "images/HSK_2.0/level5/中心.svg",
    "caption": "trung tâm"
  },
  "种类": {
    "file": "种类.svg",
    "src": "images/HSK_2.0/level5/种类.svg",
    "caption": "chủng loại"
  },
  "重大": {
    "file": "重大.svg",
    "src": "images/HSK_2.0/level5/重大.svg",
    "caption": "to lớn, trọng đại"
  },
  "重量": {
    "file": "重量.svg",
    "src": "images/HSK_2.0/level5/重量.svg",
    "caption": "trọng lượng"
  },
  "猪": {
    "file": "猪.svg",
    "src": "images/HSK_2.0/level5/猪.svg",
    "caption": "con lợn"
  },
  "逐渐": {
    "file": "逐渐.svg",
    "src": "images/HSK_2.0/level5/逐渐.svg",
    "caption": "dần dần"
  },
  "煮": {
    "file": "煮.svg",
    "src": "images/HSK_2.0/level5/煮.svg",
    "caption": "nấu, đun sôi"
  },
  "主动": {
    "file": "主动.svg",
    "src": "images/HSK_2.0/level5/主动.svg",
    "caption": "chủ động"
  },
  "主人": {
    "file": "主人.svg",
    "src": "images/HSK_2.0/level5/主人.svg",
    "caption": "chủ nhân"
  },
  "主席": {
    "file": "主席.svg",
    "src": "images/HSK_2.0/level5/主席.svg",
    "caption": "chủ tịch"
  },
  "主张": {
    "file": "主张.svg",
    "src": "images/HSK_2.0/level5/主张.svg",
    "caption": "chủ trương"
  },
  "祝福": {
    "file": "祝福.svg",
    "src": "images/HSK_2.0/level5/祝福.svg",
    "caption": "chúc phúc"
  },
  "注册": {
    "file": "注册.svg",
    "src": "images/HSK_2.0/level5/注册.svg",
    "caption": "đăng ký, ghi danh"
  },
  "抓紧": {
    "file": "抓紧.svg",
    "src": "images/HSK_2.0/level5/抓紧.svg",
    "caption": "nắm chắc, gấp rút"
  },
  "转变": {
    "file": "转变.svg",
    "src": "images/HSK_2.0/level5/转变.svg",
    "caption": "chuyển biến, thay đổi"
  },
  "装饰": {
    "file": "装饰.svg",
    "src": "images/HSK_2.0/level5/装饰.svg",
    "caption": "trang trí"
  },
  "撞": {
    "file": "撞.svg",
    "src": "images/HSK_2.0/level5/撞.svg",
    "caption": "va, đâm"
  },
  "状态": {
    "file": "状态.svg",
    "src": "images/HSK_2.0/level5/状态.svg",
    "caption": "trạng thái"
  },
  "追求": {
    "file": "追求.svg",
    "src": "images/HSK_2.0/level5/追求.svg",
    "caption": "theo đuổi"
  },
  "资金": {
    "file": "资金.svg",
    "src": "images/HSK_2.0/level5/资金.svg",
    "caption": "nguồn vốn, tài chính"
  },
  "资源": {
    "file": "资源.svg",
    "src": "images/HSK_2.0/level5/资源.svg",
    "caption": "tài nguyên"
  },
  "咨询": {
    "file": "咨询.svg",
    "src": "images/HSK_2.0/level5/咨询.svg",
    "caption": "tư vấn"
  },
  "字母": {
    "file": "字母.svg",
    "src": "images/HSK_2.0/level5/字母.svg",
    "caption": "chữ cái"
  },
  "自从": {
    "file": "自从.svg",
    "src": "images/HSK_2.0/level5/自从.svg",
    "caption": "từ khi, kể từ"
  },
  "自豪": {
    "file": "自豪.svg",
    "src": "images/HSK_2.0/level5/自豪.svg",
    "caption": "tự hào"
  },
  "自觉": {
    "file": "自觉.svg",
    "src": "images/HSK_2.0/level5/自觉.svg",
    "caption": "tự giác"
  },
  "自私": {
    "file": "自私.svg",
    "src": "images/HSK_2.0/level5/自私.svg",
    "caption": "tự tư, ích kỷ"
  },
  "自愿": {
    "file": "自愿.svg",
    "src": "images/HSK_2.0/level5/自愿.svg",
    "caption": "tự nguyện"
  },
  "总裁": {
    "file": "总裁.svg",
    "src": "images/HSK_2.0/level5/总裁.svg",
    "caption": "tổng giám đốc"
  },
  "总统": {
    "file": "总统.svg",
    "src": "images/HSK_2.0/level5/总统.svg",
    "caption": "tổng thống"
  },
  "组": {
    "file": "组.svg",
    "src": "images/HSK_2.0/level5/组.svg",
    "caption": "nhóm, tổ"
  },
  "组合": {
    "file": "组合.svg",
    "src": "images/HSK_2.0/level5/组合.svg",
    "caption": "tổ hợp, kết hợp"
  },
  "阻止": {
    "file": "阻止.svg",
    "src": "images/HSK_2.0/level5/阻止.svg",
    "caption": "ngăn chặn"
  },
  "醉": {
    "file": "醉.svg",
    "src": "images/HSK_2.0/level5/醉.svg",
    "caption": "say (rượu)"
  },
  "最初": {
    "file": "最初.svg",
    "src": "images/HSK_2.0/level5/最初.svg",
    "caption": "ban đầu, lúc đầu"
  },
  "尊敬": {
    "file": "尊敬.svg",
    "src": "images/HSK_2.0/level5/尊敬.svg",
    "caption": "tôn kính"
  },
  "遵守": {
    "file": "遵守.svg",
    "src": "images/HSK_2.0/level5/遵守.svg",
    "caption": "tuân thủ"
  },
  "作品": {
    "file": "作品.svg",
    "src": "images/HSK_2.0/level5/作品.svg",
    "caption": "tác phẩm"
  },
  "作为": {
    "file": "作为.svg",
    "src": "images/HSK_2.0/level5/作为.svg",
    "caption": "là, với danh nghĩa"
  },
  "挨": {
    "file": "挨.svg",
    "src": "images/HSK_2.0/level6/挨.svg",
    "caption": "chịu đựng; lần lượt theo thứ tự"
  },
  "癌症": {
    "file": "癌症.svg",
    "src": "images/HSK_2.0/level6/癌症.svg",
    "caption": "bệnh ung thư"
  },
  "爱不释手": {
    "file": "爱不释手.svg",
    "src": "images/HSK_2.0/level6/爱不释手.svg",
    "caption": "yêu thích đến mức không muốn rời tay"
  },
  "爱戴": {
    "file": "爱戴.svg",
    "src": "images/HSK_2.0/level6/爱戴.svg",
    "caption": "yêu mến và kính trọng"
  },
  "暧昧": {
    "file": "暧昧.svg",
    "src": "images/HSK_2.0/level6/暧昧.svg",
    "caption": "mơ hồ, không rõ ràng, ám muội"
  },
  "安居乐业": {
    "file": "安居乐业.svg",
    "src": "images/HSK_2.0/level6/安居乐业.svg",
    "caption": "an cư lạc nghiệp"
  },
  "安宁": {
    "file": "安宁.svg",
    "src": "images/HSK_2.0/level6/安宁.svg",
    "caption": "yên bình, thanh bình"
  },
  "安详": {
    "file": "安详.svg",
    "src": "images/HSK_2.0/level6/安详.svg",
    "caption": "điềm tĩnh, thư thái"
  },
  "安置": {
    "file": "安置.svg",
    "src": "images/HSK_2.0/level6/安置.svg",
    "caption": "bố trí, sắp xếp chỗ ở hoặc việc làm"
  },
  "暗示": {
    "file": "暗示.svg",
    "src": "images/HSK_2.0/level6/暗示.svg",
    "caption": "ngụ ý, ám chỉ"
  },
  "案件": {
    "file": "案件.svg",
    "src": "images/HSK_2.0/level6/案件.svg",
    "caption": "vụ án"
  },
  "案例": {
    "file": "案例.svg",
    "src": "images/HSK_2.0/level6/案例.svg",
    "caption": "trường hợp điển hình, ví dụ thực tế"
  },
  "按摩": {
    "file": "按摩.svg",
    "src": "images/HSK_2.0/level6/按摩.svg",
    "caption": "xoa bóp, massage"
  },
  "昂贵": {
    "file": "昂贵.svg",
    "src": "images/HSK_2.0/level6/昂贵.svg",
    "caption": "đắt đỏ"
  },
  "凹凸": {
    "file": "凹凸.svg",
    "src": "images/HSK_2.0/level6/凹凸.svg",
    "caption": "lồi lõm, gập ghềnh"
  },
  "熬": {
    "file": "熬.svg",
    "src": "images/HSK_2.0/level6/熬.svg",
    "caption": "hầm, ninh lâu; chịu đựng"
  },
  "奥秘": {
    "file": "奥秘.svg",
    "src": "images/HSK_2.0/level6/奥秘.svg",
    "caption": "điều bí ẩn, huyền bí"
  },
  "巴不得": {
    "file": "巴不得.svg",
    "src": "images/HSK_2.0/level6/巴不得.svg",
    "caption": "mong mỏi, ước gì"
  },
  "巴结": {
    "file": "巴结.svg",
    "src": "images/HSK_2.0/level6/巴结.svg",
    "caption": "bợ đỡ, lấy lòng"
  },
  "拔苗助长": {
    "file": "拔苗助长.svg",
    "src": "images/HSK_2.0/level6/拔苗助长.svg",
    "caption": "nóng vội làm hỏng việc (nhổ mạ giúp lúa lớn nhanh)"
  },
  "把关": {
    "file": "把关.svg",
    "src": "images/HSK_2.0/level6/把关.svg",
    "caption": "kiểm soát chặt chẽ, gác cổng"
  },
  "把戏": {
    "file": "把戏.svg",
    "src": "images/HSK_2.0/level6/把戏.svg",
    "caption": "mánh lới, trò bịp"
  },
  "霸道": {
    "file": "霸道.svg",
    "src": "images/HSK_2.0/level6/霸道.svg",
    "caption": "hống hách, ngang ngược"
  },
  "罢工": {
    "file": "罢工.svg",
    "src": "images/HSK_2.0/level6/罢工.svg",
    "caption": "đình công"
  },
  "掰": {
    "file": "掰.svg",
    "src": "images/HSK_2.0/level6/掰.svg",
    "caption": "bẻ bằng hai tay"
  },
  "百分点": {
    "file": "百分点.svg",
    "src": "images/HSK_2.0/level6/百分点.svg",
    "caption": "điểm phần trăm"
  },
  "摆脱": {
    "file": "摆脱.svg",
    "src": "images/HSK_2.0/level6/摆脱.svg",
    "caption": "thoát khỏi, giải thoát"
  },
  "拜访": {
    "file": "拜访.svg",
    "src": "images/HSK_2.0/level6/拜访.svg",
    "caption": "đến thăm (trang trọng)"
  },
  "败坏": {
    "file": "败坏.svg",
    "src": "images/HSK_2.0/level6/败坏.svg",
    "caption": "làm hư hỏng, hủy hoại"
  },
  "拜年": {
    "file": "拜年.svg",
    "src": "images/HSK_2.0/level6/拜年.svg",
    "caption": "chúc Tết"
  },
  "拜托": {
    "file": "拜托.svg",
    "src": "images/HSK_2.0/level6/拜托.svg",
    "caption": "làm ơn, nhờ vả"
  },
  "颁布": {
    "file": "颁布.svg",
    "src": "images/HSK_2.0/level6/颁布.svg",
    "caption": "ban hành (luật)"
  },
  "颁发": {
    "file": "颁发.svg",
    "src": "images/HSK_2.0/level6/颁发.svg",
    "caption": "cấp phát, trao (giải, văn bản)"
  },
  "斑纹": {
    "file": "斑纹.svg",
    "src": "images/HSK_2.0/level6/斑纹.svg",
    "caption": "vân, vết sọc"
  },
  "班主任": {
    "file": "班主任.svg",
    "src": "images/HSK_2.0/level6/班主任.svg",
    "caption": "giáo viên chủ nhiệm"
  },
  "版本": {
    "file": "版本.svg",
    "src": "images/HSK_2.0/level6/版本.svg",
    "caption": "phiên bản"
  },
  "半途而废": {
    "file": "半途而废.svg",
    "src": "images/HSK_2.0/level6/半途而废.svg",
    "caption": "bỏ giữa đường, làm nửa chừng rồi bỏ"
  },
  "扮演": {
    "file": "扮演.svg",
    "src": "images/HSK_2.0/level6/扮演.svg",
    "caption": "đóng vai, diễn vai"
  },
  "绑架": {
    "file": "绑架.svg",
    "src": "images/HSK_2.0/level6/绑架.svg",
    "caption": "bắt cóc"
  },
  "榜样": {
    "file": "榜样.svg",
    "src": "images/HSK_2.0/level6/榜样.svg",
    "caption": "tấm gương, hình mẫu"
  },
  "磅": {
    "file": "磅.svg",
    "src": "images/HSK_2.0/level6/磅.svg",
    "caption": "cân Anh (pound)"
  },
  "包庇": {
    "file": "包庇.svg",
    "src": "images/HSK_2.0/level6/包庇.svg",
    "caption": "che chở, bao che việc xấu"
  },
  "包袱": {
    "file": "包袱.svg",
    "src": "images/HSK_2.0/level6/包袱.svg",
    "caption": "cái bọc; gánh nặng (nghĩa bóng)"
  },
  "包围": {
    "file": "包围.svg",
    "src": "images/HSK_2.0/level6/包围.svg",
    "caption": "bao vây"
  },
  "保管": {
    "file": "保管.svg",
    "src": "images/HSK_2.0/level6/保管.svg",
    "caption": "bảo quản, trông giữ; chắc chắn"
  },
  "饱和": {
    "file": "饱和.svg",
    "src": "images/HSK_2.0/level6/饱和.svg",
    "caption": "bão hòa"
  },
  "饱经沧桑": {
    "file": "饱经沧桑.svg",
    "src": "images/HSK_2.0/level6/饱经沧桑.svg",
    "caption": "đã trải qua nhiều biến cố, thăng trầm"
  },
  "保密": {
    "file": "保密.svg",
    "src": "images/HSK_2.0/level6/保密.svg",
    "caption": "giữ bí mật"
  },
  "保姆": {
    "file": "保姆.svg",
    "src": "images/HSK_2.0/level6/保姆.svg",
    "caption": "người giúp việc, bảo mẫu"
  },
  "保守": {
    "file": "保守.svg",
    "src": "images/HSK_2.0/level6/保守.svg",
    "caption": "bảo thủ; giữ bí mật"
  },
  "保卫": {
    "file": "保卫.svg",
    "src": "images/HSK_2.0/level6/保卫.svg",
    "caption": "bảo vệ (an ninh, chủ quyền)"
  },
  "保养": {
    "file": "保养.svg",
    "src": "images/HSK_2.0/level6/保养.svg",
    "caption": "bảo dưỡng, dưỡng sinh"
  },
  "保障": {
    "file": "保障.svg",
    "src": "images/HSK_2.0/level6/保障.svg",
    "caption": "bảo đảm"
  },
  "保重": {
    "file": "保重.svg",
    "src": "images/HSK_2.0/level6/保重.svg",
    "caption": "giữ gìn sức khỏe"
  },
  "报仇": {
    "file": "报仇.svg",
    "src": "images/HSK_2.0/level6/报仇.svg",
    "caption": "báo thù, trả thù"
  },
  "报酬": {
    "file": "报酬.svg",
    "src": "images/HSK_2.0/level6/报酬.svg",
    "caption": "tiền công, thù lao"
  },
  "报答": {
    "file": "报答.svg",
    "src": "images/HSK_2.0/level6/报答.svg",
    "caption": "đền đáp"
  },
  "爆发": {
    "file": "爆发.svg",
    "src": "images/HSK_2.0/level6/爆发.svg",
    "caption": "bùng nổ, nổ ra"
  },
  "报复": {
    "file": "报复.svg",
    "src": "images/HSK_2.0/level6/报复.svg",
    "caption": "trả đũa, báo thù"
  },
  "抱负": {
    "file": "抱负.svg",
    "src": "images/HSK_2.0/level6/抱负.svg",
    "caption": "hoài bão, khát vọng"
  },
  "曝光": {
    "file": "曝光.svg",
    "src": "images/HSK_2.0/level6/曝光.svg",
    "caption": "phơi sáng; phơi bày (sự việc)"
  },
  "暴力": {
    "file": "暴力.svg",
    "src": "images/HSK_2.0/level6/暴力.svg",
    "caption": "vũ lực, bạo lực"
  },
  "暴露": {
    "file": "暴露.svg",
    "src": "images/HSK_2.0/level6/暴露.svg",
    "caption": "phơi bày, để lộ"
  },
  "报销": {
    "file": "报销.svg",
    "src": "images/HSK_2.0/level6/报销.svg",
    "caption": "thanh toán chi phí (hoàn ứng)"
  },
  "爆炸": {
    "file": "爆炸.svg",
    "src": "images/HSK_2.0/level6/爆炸.svg",
    "caption": "nổ, vụ nổ"
  },
  "悲哀": {
    "file": "悲哀.svg",
    "src": "images/HSK_2.0/level6/悲哀.svg",
    "caption": "đau buồn, bi thương"
  },
  "卑鄙": {
    "file": "卑鄙.svg",
    "src": "images/HSK_2.0/level6/卑鄙.svg",
    "caption": "đê tiện, hèn hạ"
  },
  "悲惨": {
    "file": "悲惨.svg",
    "src": "images/HSK_2.0/level6/悲惨.svg",
    "caption": "bi thảm, thảm thương"
  },
  "北极": {
    "file": "北极.svg",
    "src": "images/HSK_2.0/level6/北极.svg",
    "caption": "Bắc Cực"
  },
  "被动": {
    "file": "被动.svg",
    "src": "images/HSK_2.0/level6/被动.svg",
    "caption": "bị động"
  },
  "备份": {
    "file": "备份.svg",
    "src": "images/HSK_2.0/level6/备份.svg",
    "caption": "sao lưu (dữ liệu)"
  },
  "被告": {
    "file": "被告.svg",
    "src": "images/HSK_2.0/level6/被告.svg",
    "caption": "bị cáo"
  },
  "背叛": {
    "file": "背叛.svg",
    "src": "images/HSK_2.0/level6/背叛.svg",
    "caption": "phản bội"
  },
  "背诵": {
    "file": "背诵.svg",
    "src": "images/HSK_2.0/level6/背诵.svg",
    "caption": "đọc thuộc lòng, ngâm thuộc"
  },
  "奔波": {
    "file": "奔波.svg",
    "src": "images/HSK_2.0/level6/奔波.svg",
    "caption": "bôn ba, vất vả ngược xuôi"
  },
  "奔驰": {
    "file": "奔驰.svg",
    "src": "images/HSK_2.0/level6/奔驰.svg",
    "caption": "phi nhanh, chạy nhanh"
  },
  "本能": {
    "file": "本能.svg",
    "src": "images/HSK_2.0/level6/本能.svg",
    "caption": "bản năng"
  },
  "本钱": {
    "file": "本钱.svg",
    "src": "images/HSK_2.0/level6/本钱.svg",
    "caption": "vốn (tiền)"
  },
  "本人": {
    "file": "本人.svg",
    "src": "images/HSK_2.0/level6/本人.svg",
    "caption": "bản thân, chính người đó"
  },
  "本身": {
    "file": "本身.svg",
    "src": "images/HSK_2.0/level6/本身.svg",
    "caption": "bản thân, chính nó"
  },
  "本事": {
    "file": "本事.svg",
    "src": "images/HSK_2.0/level6/本事.svg",
    "caption": "năng lực, tài cán"
  },
  "本着": {
    "file": "本着.svg",
    "src": "images/HSK_2.0/level6/本着.svg",
    "caption": "dựa trên, theo nguyên tắc"
  },
  "笨拙": {
    "file": "笨拙.svg",
    "src": "images/HSK_2.0/level6/笨拙.svg",
    "caption": "vụng về, ngốc nghếch"
  },
  "崩溃": {
    "file": "崩溃.svg",
    "src": "images/HSK_2.0/level6/崩溃.svg",
    "caption": "sụp đổ, suy sụp"
  },
  "甭": {
    "file": "甭.svg",
    "src": "images/HSK_2.0/level6/甭.svg",
    "caption": "khỏi cần, không cần (phương ngữ)"
  },
  "蹦": {
    "file": "蹦.svg",
    "src": "images/HSK_2.0/level6/蹦.svg",
    "caption": "nhảy, bật"
  },
  "迸发": {
    "file": "迸发.svg",
    "src": "images/HSK_2.0/level6/迸发.svg",
    "caption": "bùng phát, tuôn ra"
  },
  "逼迫": {
    "file": "逼迫.svg",
    "src": "images/HSK_2.0/level6/逼迫.svg",
    "caption": "ép buộc, cưỡng bức"
  },
  "鼻涕": {
    "file": "鼻涕.svg",
    "src": "images/HSK_2.0/level6/鼻涕.svg",
    "caption": "nước mũi"
  },
  "比方": {
    "file": "比方.svg",
    "src": "images/HSK_2.0/level6/比方.svg",
    "caption": "ví dụ, chẳng hạn"
  },
  "比喻": {
    "file": "比喻.svg",
    "src": "images/HSK_2.0/level6/比喻.svg",
    "caption": "ví, so sánh ẩn dụ"
  },
  "比重": {
    "file": "比重.svg",
    "src": "images/HSK_2.0/level6/比重.svg",
    "caption": "tỷ trọng"
  },
  "臂": {
    "file": "臂.svg",
    "src": "images/HSK_2.0/level6/臂.svg",
    "caption": "cánh tay"
  },
  "弊病": {
    "file": "弊病.svg",
    "src": "images/HSK_2.0/level6/弊病.svg",
    "caption": "tệ nạn, khuyết điểm"
  },
  "必定": {
    "file": "必定.svg",
    "src": "images/HSK_2.0/level6/必定.svg",
    "caption": "chắc chắn, nhất định"
  },
  "弊端": {
    "file": "弊端.svg",
    "src": "images/HSK_2.0/level6/弊端.svg",
    "caption": "tệ đoan, sai sót lạm dụng"
  },
  "闭塞": {
    "file": "闭塞.svg",
    "src": "images/HSK_2.0/level6/闭塞.svg",
    "caption": "khép kín, lạc hậu, khó tiếp cận"
  },
  "必需": {
    "file": "必需.svg",
    "src": "images/HSK_2.0/level6/必需.svg",
    "caption": "cần thiết, thiết yếu"
  },
  "鞭策": {
    "file": "鞭策.svg",
    "src": "images/HSK_2.0/level6/鞭策.svg",
    "caption": "thúc đẩy, khuyến khích"
  },
  "边疆": {
    "file": "边疆.svg",
    "src": "images/HSK_2.0/level6/边疆.svg",
    "caption": "biên cương"
  },
  "边界": {
    "file": "边界.svg",
    "src": "images/HSK_2.0/level6/边界.svg",
    "caption": "ranh giới, biên giới"
  },
  "边境": {
    "file": "边境.svg",
    "src": "images/HSK_2.0/level6/边境.svg",
    "caption": "vùng biên giới"
  },
  "边缘": {
    "file": "边缘.svg",
    "src": "images/HSK_2.0/level6/边缘.svg",
    "caption": "bờ rìa, ranh giới, ngưỡng"
  },
  "编织": {
    "file": "编织.svg",
    "src": "images/HSK_2.0/level6/编织.svg",
    "caption": "đan, dệt"
  },
  "扁": {
    "file": "扁.svg",
    "src": "images/HSK_2.0/level6/扁.svg",
    "caption": "dẹt, bẹt"
  },
  "贬低": {
    "file": "贬低.svg",
    "src": "images/HSK_2.0/level6/贬低.svg",
    "caption": "hạ thấp, chê bai"
  },
  "贬义": {
    "file": "贬义.svg",
    "src": "images/HSK_2.0/level6/贬义.svg",
    "caption": "nghĩa xấu, hàm ý tiêu cực"
  },
  "遍布": {
    "file": "遍布.svg",
    "src": "images/HSK_2.0/level6/遍布.svg",
    "caption": "lan rộng khắp, có mặt mọi nơi"
  },
  "变故": {
    "file": "变故.svg",
    "src": "images/HSK_2.0/level6/变故.svg",
    "caption": "sự việc bất ngờ, biến cố"
  },
  "辩护": {
    "file": "辩护.svg",
    "src": "images/HSK_2.0/level6/辩护.svg",
    "caption": "bào chữa"
  },
  "辩解": {
    "file": "辩解.svg",
    "src": "images/HSK_2.0/level6/辩解.svg",
    "caption": "giải thích, biện hộ"
  },
  "便利": {
    "file": "便利.svg",
    "src": "images/HSK_2.0/level6/便利.svg",
    "caption": "thuận tiện"
  },
  "变迁": {
    "file": "变迁.svg",
    "src": "images/HSK_2.0/level6/变迁.svg",
    "caption": "biến đổi, thay đổi theo thời gian"
  },
  "辨认": {
    "file": "辨认.svg",
    "src": "images/HSK_2.0/level6/辨认.svg",
    "caption": "nhận diện, phân biệt"
  },
  "便条": {
    "file": "便条.svg",
    "src": "images/HSK_2.0/level6/便条.svg",
    "caption": "giấy nhắn"
  },
  "便于": {
    "file": "便于.svg",
    "src": "images/HSK_2.0/level6/便于.svg",
    "caption": "thuận tiện cho, dễ"
  },
  "辩证": {
    "file": "辩证.svg",
    "src": "images/HSK_2.0/level6/辩证.svg",
    "caption": "biện chứng"
  },
  "变质": {
    "file": "变质.svg",
    "src": "images/HSK_2.0/level6/变质.svg",
    "caption": "biến chất, hư hỏng"
  },
  "辫子": {
    "file": "辫子.svg",
    "src": "images/HSK_2.0/level6/辫子.svg",
    "caption": "bím tóc"
  },
  "标本": {
    "file": "标本.svg",
    "src": "images/HSK_2.0/level6/标本.svg",
    "caption": "mẫu vật, tiêu bản"
  },
  "标记": {
    "file": "标记.svg",
    "src": "images/HSK_2.0/level6/标记.svg",
    "caption": "dấu hiệu, ký hiệu"
  },
  "飙升": {
    "file": "飙升.svg",
    "src": "images/HSK_2.0/level6/飙升.svg",
    "caption": "tăng vọt"
  },
  "标题": {
    "file": "标题.svg",
    "src": "images/HSK_2.0/level6/标题.svg",
    "caption": "đề mục, tiêu đề"
  },
  "表决": {
    "file": "表决.svg",
    "src": "images/HSK_2.0/level6/表决.svg",
    "caption": "bỏ phiếu quyết định"
  },
  "表态": {
    "file": "表态.svg",
    "src": "images/HSK_2.0/level6/表态.svg",
    "caption": "tỏ rõ lập trường, lên tiếng"
  },
  "表彰": {
    "file": "表彰.svg",
    "src": "images/HSK_2.0/level6/表彰.svg",
    "caption": "tuyên dương, khen thưởng"
  },
  "憋": {
    "file": "憋.svg",
    "src": "images/HSK_2.0/level6/憋.svg",
    "caption": "nén lại, kìm nén"
  },
  "别墅": {
    "file": "别墅.svg",
    "src": "images/HSK_2.0/level6/别墅.svg",
    "caption": "biệt thự"
  },
  "别致": {
    "file": "别致.svg",
    "src": "images/HSK_2.0/level6/别致.svg",
    "caption": "độc đáo, lạ mắt"
  },
  "别扭": {
    "file": "别扭.svg",
    "src": "images/HSK_2.0/level6/别扭.svg",
    "caption": "khó chịu, gượng gạo"
  },
  "濒临": {
    "file": "濒临.svg",
    "src": "images/HSK_2.0/level6/濒临.svg",
    "caption": "cận kề, sắp"
  },
  "冰雹": {
    "file": "冰雹.svg",
    "src": "images/HSK_2.0/level6/冰雹.svg",
    "caption": "mưa đá"
  },
  "并存": {
    "file": "并存.svg",
    "src": "images/HSK_2.0/level6/并存.svg",
    "caption": "cùng tồn tại"
  },
  "并非": {
    "file": "并非.svg",
    "src": "images/HSK_2.0/level6/并非.svg",
    "caption": "thực ra không phải"
  },
  "并列": {
    "file": "并列.svg",
    "src": "images/HSK_2.0/level6/并列.svg",
    "caption": "đứng song song, ngang hàng"
  },
  "拨打": {
    "file": "拨打.svg",
    "src": "images/HSK_2.0/level6/拨打.svg",
    "caption": "bấm gọi (điện thoại)"
  },
  "波浪": {
    "file": "波浪.svg",
    "src": "images/HSK_2.0/level6/波浪.svg",
    "caption": "sóng (nước)"
  },
  "波涛汹涌": {
    "file": "波涛汹涌.svg",
    "src": "images/HSK_2.0/level6/波涛汹涌.svg",
    "caption": "sóng dữ cuồn cuộn"
  },
  "剥削": {
    "file": "剥削.svg",
    "src": "images/HSK_2.0/level6/剥削.svg",
    "caption": "bóc lột"
  },
  "播种": {
    "file": "播种.svg",
    "src": "images/HSK_2.0/level6/播种.svg",
    "caption": "gieo hạt"
  },
  "博大精深": {
    "file": "博大精深.svg",
    "src": "images/HSK_2.0/level6/博大精深.svg",
    "caption": "rộng lớn và sâu sắc"
  },
  "搏斗": {
    "file": "搏斗.svg",
    "src": "images/HSK_2.0/level6/搏斗.svg",
    "caption": "vật lộn, chiến đấu"
  },
  "博览会": {
    "file": "博览会.svg",
    "src": "images/HSK_2.0/level6/博览会.svg",
    "caption": "hội chợ, triển lãm"
  },
  "薄弱": {
    "file": "薄弱.svg",
    "src": "images/HSK_2.0/level6/薄弱.svg",
    "caption": "yếu kém"
  },
  "补偿": {
    "file": "补偿.svg",
    "src": "images/HSK_2.0/level6/补偿.svg",
    "caption": "bồi thường, bù đắp"
  },
  "补救": {
    "file": "补救.svg",
    "src": "images/HSK_2.0/level6/补救.svg",
    "caption": "khắc phục, cứu vớt"
  },
  "哺乳": {
    "file": "哺乳.svg",
    "src": "images/HSK_2.0/level6/哺乳.svg",
    "caption": "cho con bú"
  },
  "补贴": {
    "file": "补贴.svg",
    "src": "images/HSK_2.0/level6/补贴.svg",
    "caption": "trợ cấp"
  },
  "捕捉": {
    "file": "捕捉.svg",
    "src": "images/HSK_2.0/level6/捕捉.svg",
    "caption": "bắt, tóm"
  },
  "不必": {
    "file": "不必.svg",
    "src": "images/HSK_2.0/level6/不必.svg",
    "caption": "không cần"
  },
  "不得已": {
    "file": "不得已.svg",
    "src": "images/HSK_2.0/level6/不得已.svg",
    "caption": "bất đắc dĩ, không có lựa chọn khác"
  },
  "步伐": {
    "file": "步伐.svg",
    "src": "images/HSK_2.0/level6/步伐.svg",
    "caption": "bước chân, nhịp bước"
  },
  "不妨": {
    "file": "不妨.svg",
    "src": "images/HSK_2.0/level6/不妨.svg",
    "caption": "không ngại, cứ"
  },
  "不敢当": {
    "file": "不敢当.svg",
    "src": "images/HSK_2.0/level6/不敢当.svg",
    "caption": "tôi không xứng đáng (khiêm tốn)"
  },
  "布告": {
    "file": "布告.svg",
    "src": "images/HSK_2.0/level6/布告.svg",
    "caption": "thông báo, bảng tin"
  },
  "不顾": {
    "file": "不顾.svg",
    "src": "images/HSK_2.0/level6/不顾.svg",
    "caption": "không màng tới, bất kể"
  },
  "不好意思": {
    "file": "不好意思.svg",
    "src": "images/HSK_2.0/level6/不好意思.svg",
    "caption": "ngại ngùng, xin lỗi"
  },
  "不禁": {
    "file": "不禁.svg",
    "src": "images/HSK_2.0/level6/不禁.svg",
    "caption": "không kìm được, bất giác"
  },
  "布局": {
    "file": "布局.svg",
    "src": "images/HSK_2.0/level6/布局.svg",
    "caption": "bố cục, cách bố trí"
  },
  "不堪": {
    "file": "不堪.svg",
    "src": "images/HSK_2.0/level6/不堪.svg",
    "caption": "không chịu đựng được, đến mức"
  },
  "不可思议": {
    "file": "不可思议.svg",
    "src": "images/HSK_2.0/level6/不可思议.svg",
    "caption": "không thể tưởng tượng được"
  },
  "不愧": {
    "file": "不愧.svg",
    "src": "images/HSK_2.0/level6/不愧.svg",
    "caption": "đáng được gọi là, xứng đáng"
  },
  "不料": {
    "file": "不料.svg",
    "src": "images/HSK_2.0/level6/不料.svg",
    "caption": "không ngờ"
  },
  "部位": {
    "file": "部位.svg",
    "src": "images/HSK_2.0/level6/部位.svg",
    "caption": "vị trí, vùng (trên cơ thể)"
  },
  "不惜": {
    "file": "不惜.svg",
    "src": "images/HSK_2.0/level6/不惜.svg",
    "caption": "không ngại, không tiếc (công sức, tiền của)"
  },
  "不相上下": {
    "file": "不相上下.svg",
    "src": "images/HSK_2.0/level6/不相上下.svg",
    "caption": "ngang ngửa, không phân biệt hơn kém"
  },
  "不像话": {
    "file": "不像话.svg",
    "src": "images/HSK_2.0/level6/不像话.svg",
    "caption": "vô lý, quá đáng"
  },
  "不屑一顾": {
    "file": "不屑一顾.svg",
    "src": "images/HSK_2.0/level6/不屑一顾.svg",
    "caption": "coi thường, không đáng để ý"
  },
  "不言而喻": {
    "file": "不言而喻.svg",
    "src": "images/HSK_2.0/level6/不言而喻.svg",
    "caption": "hiển nhiên, không cần nói cũng biết"
  },
  "不由得": {
    "file": "不由得.svg",
    "src": "images/HSK_2.0/level6/不由得.svg",
    "caption": "không kìm được, tự nhiên"
  },
  "不择手段": {
    "file": "不择手段.svg",
    "src": "images/HSK_2.0/level6/不择手段.svg",
    "caption": "bất chấp mọi thủ đoạn"
  },
  "不止": {
    "file": "不止.svg",
    "src": "images/HSK_2.0/level6/不止.svg",
    "caption": "không chỉ, hơn (số lượng)"
  },
  "布置": {
    "file": "布置.svg",
    "src": "images/HSK_2.0/level6/布置.svg",
    "caption": "bố trí, trang trí"
  },
  "裁缝": {
    "file": "裁缝.svg",
    "src": "images/HSK_2.0/level6/裁缝.svg",
    "caption": "thợ may"
  },
  "财富": {
    "file": "财富.svg",
    "src": "images/HSK_2.0/level6/财富.svg",
    "caption": "của cải, tài sản"
  },
  "才干": {
    "file": "才干.svg",
    "src": "images/HSK_2.0/level6/才干.svg",
    "caption": "tài năng, năng lực"
  },
  "裁判": {
    "file": "裁判.svg",
    "src": "images/HSK_2.0/level6/裁判.svg",
    "caption": "trọng tài; xét xử"
  },
  "财务": {
    "file": "财务.svg",
    "src": "images/HSK_2.0/level6/财务.svg",
    "caption": "tài vụ"
  },
  "裁员": {
    "file": "裁员.svg",
    "src": "images/HSK_2.0/level6/裁员.svg",
    "caption": "sa thải, cắt giảm nhân sự"
  },
  "财政": {
    "file": "财政.svg",
    "src": "images/HSK_2.0/level6/财政.svg",
    "caption": "tài chính (nhà nước)"
  },
  "采购": {
    "file": "采购.svg",
    "src": "images/HSK_2.0/level6/采购.svg",
    "caption": "mua sắm, thu mua"
  },
  "采集": {
    "file": "采集.svg",
    "src": "images/HSK_2.0/level6/采集.svg",
    "caption": "thu thập, hái lượm"
  },
  "采纳": {
    "file": "采纳.svg",
    "src": "images/HSK_2.0/level6/采纳.svg",
    "caption": "tiếp thu, chấp nhận (ý kiến)"
  },
  "彩票": {
    "file": "彩票.svg",
    "src": "images/HSK_2.0/level6/彩票.svg",
    "caption": "vé số"
  },
  "参谋": {
    "file": "参谋.svg",
    "src": "images/HSK_2.0/level6/参谋.svg",
    "caption": "tham mưu; cố vấn"
  },
  "参照": {
    "file": "参照.svg",
    "src": "images/HSK_2.0/level6/参照.svg",
    "caption": "tham khảo, đối chiếu"
  },
  "残疾": {
    "file": "残疾.svg",
    "src": "images/HSK_2.0/level6/残疾.svg",
    "caption": "tàn tật, khuyết tật"
  },
  "残酷": {
    "file": "残酷.svg",
    "src": "images/HSK_2.0/level6/残酷.svg",
    "caption": "tàn khốc, khốc liệt"
  },
  "残留": {
    "file": "残留.svg",
    "src": "images/HSK_2.0/level6/残留.svg",
    "caption": "sót lại, tồn dư"
  },
  "残忍": {
    "file": "残忍.svg",
    "src": "images/HSK_2.0/level6/残忍.svg",
    "caption": "tàn nhẫn"
  },
  "灿烂": {
    "file": "灿烂.svg",
    "src": "images/HSK_2.0/level6/灿烂.svg",
    "caption": "rực rỡ, sáng chói"
  },
  "舱": {
    "file": "舱.svg",
    "src": "images/HSK_2.0/level6/舱.svg",
    "caption": "ca-bin, khoang (tàu, máy bay)"
  },
  "仓促": {
    "file": "仓促.svg",
    "src": "images/HSK_2.0/level6/仓促.svg",
    "caption": "vội vàng, gấp gáp"
  },
  "仓库": {
    "file": "仓库.svg",
    "src": "images/HSK_2.0/level6/仓库.svg",
    "caption": "nhà kho"
  },
  "操劳": {
    "file": "操劳.svg",
    "src": "images/HSK_2.0/level6/操劳.svg",
    "caption": "vất vả lo toan"
  },
  "操练": {
    "file": "操练.svg",
    "src": "images/HSK_2.0/level6/操练.svg",
    "caption": "luyện tập, huấn luyện"
  },
  "操纵": {
    "file": "操纵.svg",
    "src": "images/HSK_2.0/level6/操纵.svg",
    "caption": "điều khiển, giật dây"
  },
  "操作": {
    "file": "操作.svg",
    "src": "images/HSK_2.0/level6/操作.svg",
    "caption": "vận hành, thao tác"
  },
  "嘈杂": {
    "file": "嘈杂.svg",
    "src": "images/HSK_2.0/level6/嘈杂.svg",
    "caption": "ồn ào, huyên náo"
  },
  "草案": {
    "file": "草案.svg",
    "src": "images/HSK_2.0/level6/草案.svg",
    "caption": "dự thảo"
  },
  "草率": {
    "file": "草率.svg",
    "src": "images/HSK_2.0/level6/草率.svg",
    "caption": "cẩu thả, qua loa"
  },
  "策划": {
    "file": "策划.svg",
    "src": "images/HSK_2.0/level6/策划.svg",
    "caption": "hoạch định, lên kế hoạch"
  },
  "测量": {
    "file": "测量.svg",
    "src": "images/HSK_2.0/level6/测量.svg",
    "caption": "đo lường, khảo sát"
  },
  "策略": {
    "file": "策略.svg",
    "src": "images/HSK_2.0/level6/策略.svg",
    "caption": "chiến lược, sách lược"
  },
  "侧面": {
    "file": "侧面.svg",
    "src": "images/HSK_2.0/level6/侧面.svg",
    "caption": "mặt bên, khía cạnh"
  },
  "层次": {
    "file": "层次.svg",
    "src": "images/HSK_2.0/level6/层次.svg",
    "caption": "tầng bậc, cấp độ"
  },
  "层出不穷": {
    "file": "层出不穷.svg",
    "src": "images/HSK_2.0/level6/层出不穷.svg",
    "caption": "xuất hiện liên tục không ngừng"
  },
  "差别": {
    "file": "差别.svg",
    "src": "images/HSK_2.0/level6/差别.svg",
    "caption": "sự khác biệt"
  },
  "查获": {
    "file": "查获.svg",
    "src": "images/HSK_2.0/level6/查获.svg",
    "caption": "lục soát bắt giữ, phát hiện thu giữ"
  },
  "岔": {
    "file": "岔.svg",
    "src": "images/HSK_2.0/level6/岔.svg",
    "caption": "rẽ, ngã (đường), lạc đề"
  },
  "刹那": {
    "file": "刹那.svg",
    "src": "images/HSK_2.0/level6/刹那.svg",
    "caption": "trong khoảnh khắc, tức thời"
  },
  "诧异": {
    "file": "诧异.svg",
    "src": "images/HSK_2.0/level6/诧异.svg",
    "caption": "ngạc nhiên, sửng sốt"
  },
  "柴油": {
    "file": "柴油.svg",
    "src": "images/HSK_2.0/level6/柴油.svg",
    "caption": "dầu diesel"
  },
  "搀": {
    "file": "搀.svg",
    "src": "images/HSK_2.0/level6/搀.svg",
    "caption": "đỡ, dắt (người)"
  },
  "缠绕": {
    "file": "缠绕.svg",
    "src": "images/HSK_2.0/level6/缠绕.svg",
    "caption": "quấn quanh, vướng vít"
  },
  "阐述": {
    "file": "阐述.svg",
    "src": "images/HSK_2.0/level6/阐述.svg",
    "caption": "trình bày rõ, luận giải"
  },
  "产业": {
    "file": "产业.svg",
    "src": "images/HSK_2.0/level6/产业.svg",
    "caption": "ngành công nghiệp, sản nghiệp"
  },
  "颤抖": {
    "file": "颤抖.svg",
    "src": "images/HSK_2.0/level6/颤抖.svg",
    "caption": "rung, run rẩy"
  },
  "猖狂": {
    "file": "猖狂.svg",
    "src": "images/HSK_2.0/level6/猖狂.svg",
    "caption": "hung hăng, ngông cuồng"
  },
  "昌盛": {
    "file": "昌盛.svg",
    "src": "images/HSK_2.0/level6/昌盛.svg",
    "caption": "thịnh vượng"
  },
  "偿还": {
    "file": "偿还.svg",
    "src": "images/HSK_2.0/level6/偿还.svg",
    "caption": "hoàn trả, trả nợ"
  },
  "常年": {
    "file": "常年.svg",
    "src": "images/HSK_2.0/level6/常年.svg",
    "caption": "quanh năm, hằng năm"
  },
  "尝试": {
    "file": "尝试.svg",
    "src": "images/HSK_2.0/level6/尝试.svg",
    "caption": "thử nghiệm"
  },
  "常务": {
    "file": "常务.svg",
    "src": "images/HSK_2.0/level6/常务.svg",
    "caption": "thường vụ, công việc thường ngày"
  },
  "场合": {
    "file": "场合.svg",
    "src": "images/HSK_2.0/level6/场合.svg",
    "caption": "hoàn cảnh, dịp"
  },
  "敞开": {
    "file": "敞开.svg",
    "src": "images/HSK_2.0/level6/敞开.svg",
    "caption": "mở rộng, mở toang"
  },
  "场面": {
    "file": "场面.svg",
    "src": "images/HSK_2.0/level6/场面.svg",
    "caption": "cảnh tượng, quy mô"
  },
  "场所": {
    "file": "场所.svg",
    "src": "images/HSK_2.0/level6/场所.svg",
    "caption": "nơi, địa điểm"
  },
  "倡导": {
    "file": "倡导.svg",
    "src": "images/HSK_2.0/level6/倡导.svg",
    "caption": "khởi xướng, đề xướng"
  },
  "畅通": {
    "file": "畅通.svg",
    "src": "images/HSK_2.0/level6/畅通.svg",
    "caption": "thông suốt, không bị cản trở"
  },
  "畅销": {
    "file": "畅销.svg",
    "src": "images/HSK_2.0/level6/畅销.svg",
    "caption": "bán chạy, ăn khách"
  },
  "倡议": {
    "file": "倡议.svg",
    "src": "images/HSK_2.0/level6/倡议.svg",
    "caption": "đề nghị, kiến nghị"
  },
  "钞票": {
    "file": "钞票.svg",
    "src": "images/HSK_2.0/level6/钞票.svg",
    "caption": "tiền giấy"
  },
  "超越": {
    "file": "超越.svg",
    "src": "images/HSK_2.0/level6/超越.svg",
    "caption": "vượt qua, siêu việt"
  },
  "朝代": {
    "file": "朝代.svg",
    "src": "images/HSK_2.0/level6/朝代.svg",
    "caption": "triều đại"
  },
  "潮流": {
    "file": "潮流.svg",
    "src": "images/HSK_2.0/level6/潮流.svg",
    "caption": "trào lưu, xu hướng"
  },
  "嘲笑": {
    "file": "嘲笑.svg",
    "src": "images/HSK_2.0/level6/嘲笑.svg",
    "caption": "chê cười, nhạo báng"
  },
  "撤退": {
    "file": "撤退.svg",
    "src": "images/HSK_2.0/level6/撤退.svg",
    "caption": "rút lui"
  },
  "撤销": {
    "file": "撤销.svg",
    "src": "images/HSK_2.0/level6/撤销.svg",
    "caption": "hủy bỏ, thu hồi"
  },
  "沉淀": {
    "file": "沉淀.svg",
    "src": "images/HSK_2.0/level6/沉淀.svg",
    "caption": "lắng đọng, kết tủa"
  },
  "陈旧": {
    "file": "陈旧.svg",
    "src": "images/HSK_2.0/level6/陈旧.svg",
    "caption": "cũ kỹ, lạc hậu"
  },
  "陈列": {
    "file": "陈列.svg",
    "src": "images/HSK_2.0/level6/陈列.svg",
    "caption": "trưng bày"
  },
  "沉闷": {
    "file": "沉闷.svg",
    "src": "images/HSK_2.0/level6/沉闷.svg",
    "caption": "nặng nề, ngột ngạt (tâm trạng/thời tiết)"
  },
  "陈述": {
    "file": "陈述.svg",
    "src": "images/HSK_2.0/level6/陈述.svg",
    "caption": "trình bày, tường thuật"
  },
  "沉思": {
    "file": "沉思.svg",
    "src": "images/HSK_2.0/level6/沉思.svg",
    "caption": "suy ngẫm, trầm tư"
  },
  "沉重": {
    "file": "沉重.svg",
    "src": "images/HSK_2.0/level6/沉重.svg",
    "caption": "nặng nề, nghiêm trọng"
  },
  "沉着": {
    "file": "沉着.svg",
    "src": "images/HSK_2.0/level6/沉着.svg",
    "caption": "bình tĩnh, điềm đạm"
  },
  "称心如意": {
    "file": "称心如意.svg",
    "src": "images/HSK_2.0/level6/称心如意.svg",
    "caption": "vừa lòng, như ý"
  },
  "称号": {
    "file": "称号.svg",
    "src": "images/HSK_2.0/level6/称号.svg",
    "caption": "danh hiệu"
  },
  "橙": {
    "file": "橙.svg",
    "src": "images/HSK_2.0/level6/橙.svg",
    "caption": "quả cam, màu cam"
  },
  "盛": {
    "file": "盛.svg",
    "src": "images/HSK_2.0/level6/盛.svg",
    "caption": "đựng, chứa (múc)"
  },
  "承办": {
    "file": "承办.svg",
    "src": "images/HSK_2.0/level6/承办.svg",
    "caption": "đảm nhận, đứng ra tổ chức"
  },
  "承包": {
    "file": "承包.svg",
    "src": "images/HSK_2.0/level6/承包.svg",
    "caption": "nhận thầu, khoán"
  },
  "城堡": {
    "file": "城堡.svg",
    "src": "images/HSK_2.0/level6/城堡.svg",
    "caption": "lâu đài, thành lũy"
  },
  "成本": {
    "file": "成本.svg",
    "src": "images/HSK_2.0/level6/成本.svg",
    "caption": "chi phí, giá thành"
  },
  "惩罚": {
    "file": "惩罚.svg",
    "src": "images/HSK_2.0/level6/惩罚.svg",
    "caption": "trừng phạt"
  },
  "成交": {
    "file": "成交.svg",
    "src": "images/HSK_2.0/level6/成交.svg",
    "caption": "giao dịch thành công"
  },
  "承诺": {
    "file": "承诺.svg",
    "src": "images/HSK_2.0/level6/承诺.svg",
    "caption": "hứa hẹn, cam kết"
  },
  "澄清": {
    "file": "澄清.svg",
    "src": "images/HSK_2.0/level6/澄清.svg",
    "caption": "làm sáng tỏ, thanh lọc"
  },
  "成天": {
    "file": "成天.svg",
    "src": "images/HSK_2.0/level6/成天.svg",
    "caption": "suốt ngày"
  },
  "乘务员": {
    "file": "乘务员.svg",
    "src": "images/HSK_2.0/level6/乘务员.svg",
    "caption": "nhân viên phục vụ (tàu, máy bay)"
  },
  "呈现": {
    "file": "呈现.svg",
    "src": "images/HSK_2.0/level6/呈现.svg",
    "caption": "hiện ra, biểu hiện"
  },
  "成效": {
    "file": "成效.svg",
    "src": "images/HSK_2.0/level6/成效.svg",
    "caption": "hiệu quả"
  },
  "成心": {
    "file": "成心.svg",
    "src": "images/HSK_2.0/level6/成心.svg",
    "caption": "cố ý, có chủ đích"
  },
  "成员": {
    "file": "成员.svg",
    "src": "images/HSK_2.0/level6/成员.svg",
    "caption": "thành viên"
  },
  "诚挚": {
    "file": "诚挚.svg",
    "src": "images/HSK_2.0/level6/诚挚.svg",
    "caption": "chân thành, thành khẩn"
  },
  "秤": {
    "file": "秤.svg",
    "src": "images/HSK_2.0/level6/秤.svg",
    "caption": "cái cân"
  },
  "吃苦": {
    "file": "吃苦.svg",
    "src": "images/HSK_2.0/level6/吃苦.svg",
    "caption": "chịu khổ"
  },
  "吃力": {
    "file": "吃力.svg",
    "src": "images/HSK_2.0/level6/吃力.svg",
    "caption": "vất vả, tốn sức"
  },
  "迟缓": {
    "file": "迟缓.svg",
    "src": "images/HSK_2.0/level6/迟缓.svg",
    "caption": "chậm chạp, trì trệ"
  },
  "持久": {
    "file": "持久.svg",
    "src": "images/HSK_2.0/level6/持久.svg",
    "caption": "lâu dài, bền lâu"
  },
  "迟疑": {
    "file": "迟疑.svg",
    "src": "images/HSK_2.0/level6/迟疑.svg",
    "caption": "lưỡng lự, do dự"
  },
  "赤道": {
    "file": "赤道.svg",
    "src": "images/HSK_2.0/level6/赤道.svg",
    "caption": "đường xích đạo"
  },
  "赤字": {
    "file": "赤字.svg",
    "src": "images/HSK_2.0/level6/赤字.svg",
    "caption": "thâm hụt (tài chính)"
  },
  "充当": {
    "file": "充当.svg",
    "src": "images/HSK_2.0/level6/充当.svg",
    "caption": "đóng vai, làm"
  },
  "冲动": {
    "file": "冲动.svg",
    "src": "images/HSK_2.0/level6/冲动.svg",
    "caption": "bốc đồng, xung động"
  },
  "冲击": {
    "file": "冲击.svg",
    "src": "images/HSK_2.0/level6/冲击.svg",
    "caption": "xung kích, va đập, tác động mạnh"
  },
  "充沛": {
    "file": "充沛.svg",
    "src": "images/HSK_2.0/level6/充沛.svg",
    "caption": "sung mãn, dồi dào"
  },
  "充实": {
    "file": "充实.svg",
    "src": "images/HSK_2.0/level6/充实.svg",
    "caption": "sung túc, đầy đủ phong phú"
  },
  "冲突": {
    "file": "冲突.svg",
    "src": "images/HSK_2.0/level6/冲突.svg",
    "caption": "xung đột"
  },
  "充足": {
    "file": "充足.svg",
    "src": "images/HSK_2.0/level6/充足.svg",
    "caption": "đầy đủ, dồi dào"
  },
  "崇拜": {
    "file": "崇拜.svg",
    "src": "images/HSK_2.0/level6/崇拜.svg",
    "caption": "tôn sùng, thờ phụng"
  },
  "重叠": {
    "file": "重叠.svg",
    "src": "images/HSK_2.0/level6/重叠.svg",
    "caption": "trùng lặp, chồng lên"
  },
  "崇高": {
    "file": "崇高.svg",
    "src": "images/HSK_2.0/level6/崇高.svg",
    "caption": "cao cả"
  },
  "崇敬": {
    "file": "崇敬.svg",
    "src": "images/HSK_2.0/level6/崇敬.svg",
    "caption": "kính trọng, tôn kính"
  },
  "抽空": {
    "file": "抽空.svg",
    "src": "images/HSK_2.0/level6/抽空.svg",
    "caption": "tranh thủ thời gian"
  },
  "筹备": {
    "file": "筹备.svg",
    "src": "images/HSK_2.0/level6/筹备.svg",
    "caption": "chuẩn bị (cho sự kiện)"
  },
  "踌躇": {
    "file": "踌躇.svg",
    "src": "images/HSK_2.0/level6/踌躇.svg",
    "caption": "do dự, lưỡng lự"
  },
  "稠密": {
    "file": "稠密.svg",
    "src": "images/HSK_2.0/level6/稠密.svg",
    "caption": "dày đặc, đông đúc"
  },
  "丑恶": {
    "file": "丑恶.svg",
    "src": "images/HSK_2.0/level6/丑恶.svg",
    "caption": "xấu xa, đáng ghê tởm"
  },
  "初步": {
    "file": "初步.svg",
    "src": "images/HSK_2.0/level6/初步.svg",
    "caption": "sơ bộ, ban đầu"
  },
  "出路": {
    "file": "出路.svg",
    "src": "images/HSK_2.0/level6/出路.svg",
    "caption": "đường ra, hướng giải quyết"
  },
  "出卖": {
    "file": "出卖.svg",
    "src": "images/HSK_2.0/level6/出卖.svg",
    "caption": "bán; bán rẻ (phản bội)"
  },
  "出身": {
    "file": "出身.svg",
    "src": "images/HSK_2.0/level6/出身.svg",
    "caption": "xuất thân"
  },
  "出神": {
    "file": "出神.svg",
    "src": "images/HSK_2.0/level6/出神.svg",
    "caption": "ngẩn ngơ, mê mải"
  },
  "出息": {
    "file": "出息.svg",
    "src": "images/HSK_2.0/level6/出息.svg",
    "caption": "tiền đồ, tương lai"
  },
  "传递": {
    "file": "传递.svg",
    "src": "images/HSK_2.0/level6/传递.svg",
    "caption": "truyền, chuyển (tin tức, vật)"
  },
  "床单": {
    "file": "床单.svg",
    "src": "images/HSK_2.0/level6/床单.svg",
    "caption": "ga trải giường"
  },
  "创新": {
    "file": "创新.svg",
    "src": "images/HSK_2.0/level6/创新.svg",
    "caption": "sáng tạo, đổi mới"
  },
  "创业": {
    "file": "创业.svg",
    "src": "images/HSK_2.0/level6/创业.svg",
    "caption": "khởi nghiệp"
  },
  "创作": {
    "file": "创作.svg",
    "src": "images/HSK_2.0/level6/创作.svg",
    "caption": "sáng tác"
  },
  "达成": {
    "file": "达成.svg",
    "src": "images/HSK_2.0/level6/达成.svg",
    "caption": "đạt được (thỏa thuận)"
  },
  "打包": {
    "file": "打包.svg",
    "src": "images/HSK_2.0/level6/打包.svg",
    "caption": "đóng gói, gói lại"
  },
  "当前": {
    "file": "当前.svg",
    "src": "images/HSK_2.0/level6/当前.svg",
    "caption": "hiện tại, trước mắt"
  },
  "登录": {
    "file": "登录.svg",
    "src": "images/HSK_2.0/level6/登录.svg",
    "caption": "đăng nhập"
  },
  "等候": {
    "file": "等候.svg",
    "src": "images/HSK_2.0/level6/等候.svg",
    "caption": "chờ đợi"
  },
  "定期": {
    "file": "定期.svg",
    "src": "images/HSK_2.0/level6/定期.svg",
    "caption": "định kỳ"
  },
  "动手": {
    "file": "动手.svg",
    "src": "images/HSK_2.0/level6/动手.svg",
    "caption": "ra tay, bắt tay vào làm"
  },
  "队伍": {
    "file": "队伍.svg",
    "src": "images/HSK_2.0/level6/队伍.svg",
    "caption": "đội ngũ"
  },
  "发布": {
    "file": "发布.svg",
    "src": "images/HSK_2.0/level6/发布.svg",
    "caption": "công bố, phát hành"
  },
  "防止": {
    "file": "防止.svg",
    "src": "images/HSK_2.0/level6/防止.svg",
    "caption": "ngăn ngừa"
  },
  "访问": {
    "file": "访问.svg",
    "src": "images/HSK_2.0/level6/访问.svg",
    "caption": "thăm viếng, phỏng vấn"
  },
  "夫妇": {
    "file": "夫妇.svg",
    "src": "images/HSK_2.0/level6/夫妇.svg",
    "caption": "vợ chồng"
  },
  "付出": {
    "file": "付出.svg",
    "src": "images/HSK_2.0/level6/付出.svg",
    "caption": "cống hiến, bỏ ra"
  },
  "负担": {
    "file": "负担.svg",
    "src": "images/HSK_2.0/level6/负担.svg",
    "caption": "gánh nặng"
  },
  "富有": {
    "file": "富有.svg",
    "src": "images/HSK_2.0/level6/富有.svg",
    "caption": "giàu có"
  },
  "更新": {
    "file": "更新.svg",
    "src": "images/HSK_2.0/level6/更新.svg",
    "caption": "cập nhật, đổi mới"
  },
  "工程": {
    "file": "工程.svg",
    "src": "images/HSK_2.0/level6/工程.svg",
    "caption": "công trình, kỹ thuật"
  },
  "工艺": {
    "file": "工艺.svg",
    "src": "images/HSK_2.0/level6/工艺.svg",
    "caption": "công nghệ, kỹ thuật chế tác"
  },
  "故乡": {
    "file": "故乡.svg",
    "src": "images/HSK_2.0/level6/故乡.svg",
    "caption": "quê hương"
  },
  "过于": {
    "file": "过于.svg",
    "src": "images/HSK_2.0/level6/过于.svg",
    "caption": "quá mức"
  },
  "海外": {
    "file": "海外.svg",
    "src": "images/HSK_2.0/level6/海外.svg",
    "caption": "hải ngoại, nước ngoài"
  },
  "花费": {
    "file": "花费.svg",
    "src": "images/HSK_2.0/level6/花费.svg",
    "caption": "tốn, chi tiêu"
  },
  "环节": {
    "file": "环节.svg",
    "src": "images/HSK_2.0/level6/环节.svg",
    "caption": "khâu, mắt xích"
  },
  "记载": {
    "file": "记载.svg",
    "src": "images/HSK_2.0/level6/记载.svg",
    "caption": "ghi chép, ghi lại"
  },
  "季度": {
    "file": "季度.svg",
    "src": "images/HSK_2.0/level6/季度.svg",
    "caption": "quý (3 tháng)"
  },
  "加工": {
    "file": "加工.svg",
    "src": "images/HSK_2.0/level6/加工.svg",
    "caption": "gia công, chế biến"
  },
  "将近": {
    "file": "将近.svg",
    "src": "images/HSK_2.0/level6/将近.svg",
    "caption": "gần (số lượng, thời gian)"
  },
  "就业": {
    "file": "就业.svg",
    "src": "images/HSK_2.0/level6/就业.svg",
    "caption": "việc làm, có công việc"
  },
  "居民": {
    "file": "居民.svg",
    "src": "images/HSK_2.0/level6/居民.svg",
    "caption": "cư dân"
  },
  "居住": {
    "file": "居住.svg",
    "src": "images/HSK_2.0/level6/居住.svg",
    "caption": "cư trú, sinh sống"
  },
  "开展": {
    "file": "开展.svg",
    "src": "images/HSK_2.0/level6/开展.svg",
    "caption": "triển khai"
  },
  "亏": {
    "file": "亏.svg",
    "src": "images/HSK_2.0/level6/亏.svg",
    "caption": "thua, lỗ"
  },
  "来源": {
    "file": "来源.svg",
    "src": "images/HSK_2.0/level6/来源.svg",
    "caption": "nguồn gốc"
  },
  "类似": {
    "file": "类似.svg",
    "src": "images/HSK_2.0/level6/类似.svg",
    "caption": "tương tự"
  },
  "领先": {
    "file": "领先.svg",
    "src": "images/HSK_2.0/level6/领先.svg",
    "caption": "dẫn đầu"
  },
  "忙碌": {
    "file": "忙碌.svg",
    "src": "images/HSK_2.0/level6/忙碌.svg",
    "caption": "bận rộn"
  },
  "模式": {
    "file": "模式.svg",
    "src": "images/HSK_2.0/level6/模式.svg",
    "caption": "mô hình, phương thức"
  },
  "目光": {
    "file": "目光.svg",
    "src": "images/HSK_2.0/level6/目光.svg",
    "caption": "tầm nhìn, ánh mắt"
  },
  "难得": {
    "file": "难得.svg",
    "src": "images/HSK_2.0/level6/难得.svg",
    "caption": "hiếm có, khó mà có được"
  },
  "哦": {
    "file": "哦.svg",
    "src": "images/HSK_2.0/level6/哦.svg",
    "caption": "ồ, à (thán từ tỏ ra hiểu hoặc bất ngờ)"
  },
  "品质": {
    "file": "品质.svg",
    "src": "images/HSK_2.0/level6/品质.svg",
    "caption": "phẩm chất, chất lượng"
  },
  "品种": {
    "file": "品种.svg",
    "src": "images/HSK_2.0/level6/品种.svg",
    "caption": "chủng loại, giống loài"
  },
  "屏幕": {
    "file": "屏幕.svg",
    "src": "images/HSK_2.0/level6/屏幕.svg",
    "caption": "màn hình"
  },
  "普及": {
    "file": "普及.svg",
    "src": "images/HSK_2.0/level6/普及.svg",
    "caption": "phổ cập, phổ biến"
  },
  "抢救": {
    "file": "抢救.svg",
    "src": "images/HSK_2.0/level6/抢救.svg",
    "caption": "cấp cứu, cứu chữa gấp"
  },
  "请教": {
    "file": "请教.svg",
    "src": "images/HSK_2.0/level6/请教.svg",
    "caption": "thỉnh giáo, hỏi ý kiến"
  },
  "区域": {
    "file": "区域.svg",
    "src": "images/HSK_2.0/level6/区域.svg",
    "caption": "khu vực, vùng"
  },
  "确保": {
    "file": "确保.svg",
    "src": "images/HSK_2.0/level6/确保.svg",
    "caption": "đảm bảo chắc chắn"
  },
  "人工": {
    "file": "人工.svg",
    "src": "images/HSK_2.0/level6/人工.svg",
    "caption": "nhân công, nhân tạo"
  },
  "擅长": {
    "file": "擅长.svg",
    "src": "images/HSK_2.0/level6/擅长.svg",
    "caption": "giỏi về, sở trường"
  },
  "设立": {
    "file": "设立.svg",
    "src": "images/HSK_2.0/level6/设立.svg",
    "caption": "thiết lập, thành lập"
  },
  "设置": {
    "file": "设置.svg",
    "src": "images/HSK_2.0/level6/设置.svg",
    "caption": "thiết lập, bố trí"
  },
  "社区": {
    "file": "社区.svg",
    "src": "images/HSK_2.0/level6/社区.svg",
    "caption": "khu dân cư, cộng đồng"
  },
  "生存": {
    "file": "生存.svg",
    "src": "images/HSK_2.0/level6/生存.svg",
    "caption": "sinh tồn"
  },
  "生物": {
    "file": "生物.svg",
    "src": "images/HSK_2.0/level6/生物.svg",
    "caption": "sinh vật"
  },
  "生肖": {
    "file": "生肖.svg",
    "src": "images/HSK_2.0/level6/生肖.svg",
    "caption": "con giáp"
  },
  "省会": {
    "file": "省会.svg",
    "src": "images/HSK_2.0/level6/省会.svg",
    "caption": "tỉnh lị, thủ phủ tỉnh"
  },
  "失误": {
    "file": "失误.svg",
    "src": "images/HSK_2.0/level6/失误.svg",
    "caption": "sai sót, sai lầm"
  },
  "时常": {
    "file": "时常.svg",
    "src": "images/HSK_2.0/level6/时常.svg",
    "caption": "thường, thường xuyên"
  },
  "实力": {
    "file": "实力.svg",
    "src": "images/HSK_2.0/level6/实力.svg",
    "caption": "thực lực"
  },
  "实施": {
    "file": "实施.svg",
    "src": "images/HSK_2.0/level6/实施.svg",
    "caption": "thi hành, thực thi"
  },
  "实行": {
    "file": "实行.svg",
    "src": "images/HSK_2.0/level6/实行.svg",
    "caption": "thực hiện"
  },
  "试验": {
    "file": "试验.svg",
    "src": "images/HSK_2.0/level6/试验.svg",
    "caption": "thử nghiệm"
  },
  "事故": {
    "file": "事故.svg",
    "src": "images/HSK_2.0/level6/事故.svg",
    "caption": "sự cố, tai nạn"
  },
  "事件": {
    "file": "事件.svg",
    "src": "images/HSK_2.0/level6/事件.svg",
    "caption": "sự kiện"
  },
  "事业": {
    "file": "事业.svg",
    "src": "images/HSK_2.0/level6/事业.svg",
    "caption": "sự nghiệp"
  },
  "书法": {
    "file": "书法.svg",
    "src": "images/HSK_2.0/level6/书法.svg",
    "caption": "thư pháp"
  },
  "束": {
    "file": "束.svg",
    "src": "images/HSK_2.0/level6/束.svg",
    "caption": "bó, chùm"
  },
  "思维": {
    "file": "思维.svg",
    "src": "images/HSK_2.0/level6/思维.svg",
    "caption": "tư duy"
  },
  "随意": {
    "file": "随意.svg",
    "src": "images/HSK_2.0/level6/随意.svg",
    "caption": "tùy ý, tự nhiên"
  },
  "统计": {
    "file": "统计.svg",
    "src": "images/HSK_2.0/level6/统计.svg",
    "caption": "thống kê"
  },
  "维持": {
    "file": "维持.svg",
    "src": "images/HSK_2.0/level6/维持.svg",
    "caption": "duy trì"
  },
  "舞蹈": {
    "file": "舞蹈.svg",
    "src": "images/HSK_2.0/level6/舞蹈.svg",
    "caption": "múa, vũ điệu"
  },
  "物业": {
    "file": "物业.svg",
    "src": "images/HSK_2.0/level6/物业.svg",
    "caption": "bất động sản, quản lý nhà"
  },
  "先进": {
    "file": "先进.svg",
    "src": "images/HSK_2.0/level6/先进.svg",
    "caption": "tiên tiến"
  },
  "现场": {
    "file": "现场.svg",
    "src": "images/HSK_2.0/level6/现场.svg",
    "caption": "hiện trường"
  },
  "现状": {
    "file": "现状.svg",
    "src": "images/HSK_2.0/level6/现状.svg",
    "caption": "hiện trạng"
  },
  "协议": {
    "file": "协议.svg",
    "src": "images/HSK_2.0/level6/协议.svg",
    "caption": "thỏa thuận, hiệp định"
  },
  "新郎": {
    "file": "新郎.svg",
    "src": "images/HSK_2.0/level6/新郎.svg",
    "caption": "chú rể"
  },
  "新娘": {
    "file": "新娘.svg",
    "src": "images/HSK_2.0/level6/新娘.svg",
    "caption": "cô dâu"
  },
  "心态": {
    "file": "心态.svg",
    "src": "images/HSK_2.0/level6/心态.svg",
    "caption": "tâm thế, trạng thái tâm lý"
  },
  "修建": {
    "file": "修建.svg",
    "src": "images/HSK_2.0/level6/修建.svg",
    "caption": "xây dựng"
  },
  "需求": {
    "file": "需求.svg",
    "src": "images/HSK_2.0/level6/需求.svg",
    "caption": "nhu cầu"
  },
  "选手": {
    "file": "选手.svg",
    "src": "images/HSK_2.0/level6/选手.svg",
    "caption": "tuyển thủ"
  },
  "压岁钱": {
    "file": "压岁钱.svg",
    "src": "images/HSK_2.0/level6/压岁钱.svg",
    "caption": "tiền lì xì"
  },
  "依据": {
    "file": "依据.svg",
    "src": "images/HSK_2.0/level6/依据.svg",
    "caption": "dựa theo, căn cứ"
  },
  "依靠": {
    "file": "依靠.svg",
    "src": "images/HSK_2.0/level6/依靠.svg",
    "caption": "dựa vào"
  },
  "意识": {
    "file": "意识.svg",
    "src": "images/HSK_2.0/level6/意识.svg",
    "caption": "ý thức"
  },
  "意味着": {
    "file": "意味着.svg",
    "src": "images/HSK_2.0/level6/意味着.svg",
    "caption": "có nghĩa là, ngụ ý rằng"
  },
  "饮食": {
    "file": "饮食.svg",
    "src": "images/HSK_2.0/level6/饮食.svg",
    "caption": "ăn uống"
  },
  "拥有": {
    "file": "拥有.svg",
    "src": "images/HSK_2.0/level6/拥有.svg",
    "caption": "sở hữu, có"
  },
  "用户": {
    "file": "用户.svg",
    "src": "images/HSK_2.0/level6/用户.svg",
    "caption": "người dùng"
  },
  "头": {
    "file": "头.svg",
    "src": "images/HSK_3.0/level2/头.svg",
    "caption": "đầu (danh từ, số lượng, tính từ)"
  },
  "量": {
    "file": "量.svg",
    "src": "images/HSK_3.0/level4/量.svg",
    "caption": "đo"
  },
  "哎呀": {
    "file": "哎呀.svg",
    "src": "images/HSK_3.0/level5/哎呀.svg",
    "caption": "ôi chao, ối (thán từ ngạc nhiên, tiếc)"
  },
  "安": {
    "file": "安.svg",
    "src": "images/HSK_3.0/level5/安.svg",
    "caption": "yên ổn, an toàn; lắp đặt"
  },
  "安全带": {
    "file": "安全带.svg",
    "src": "images/HSK_3.0/level5/安全带.svg",
    "caption": "dây an toàn"
  },
  "半夜": {
    "file": "半夜.svg",
    "src": "images/HSK_3.0/level5/半夜.svg",
    "caption": "nửa đêm"
  },
  "包装": {
    "file": "包装.svg",
    "src": "images/HSK_3.0/level5/包装.svg",
    "caption": "bao bì; đóng gói"
  },
  "宝": {
    "file": "宝.svg",
    "src": "images/HSK_3.0/level5/宝.svg",
    "caption": "báu vật; quý"
  },
  "保": {
    "file": "保.svg",
    "src": "images/HSK_3.0/level5/保.svg",
    "caption": "giữ, bảo vệ; bảo đảm"
  },
  "保安": {
    "file": "保安.svg",
    "src": "images/HSK_3.0/level5/保安.svg",
    "caption": "bảo vệ (người)"
  },
  "保质期": {
    "file": "保质期.svg",
    "src": "images/HSK_3.0/level5/保质期.svg",
    "caption": "hạn sử dụng"
  },
  "报警": {
    "file": "报警.svg",
    "src": "images/HSK_3.0/level5/报警.svg",
    "caption": "báo cảnh sát"
  },
  "暴雨": {
    "file": "暴雨.svg",
    "src": "images/HSK_3.0/level5/暴雨.svg",
    "caption": "mưa to, mưa bão"
  },
  "背后": {
    "file": "背后.svg",
    "src": "images/HSK_3.0/level5/背后.svg",
    "caption": "phía sau, sau lưng"
  },
  "本²": {
    "file": "本².svg",
    "src": "images/HSK_3.0/level5/本².svg",
    "caption": "cuốn (lượng từ)"
  },
  "本地": {
    "file": "本地.svg",
    "src": "images/HSK_3.0/level5/本地.svg",
    "caption": "bản địa, địa phương"
  },
  "比分": {
    "file": "比分.svg",
    "src": "images/HSK_3.0/level5/比分.svg",
    "caption": "tỷ số"
  },
  "必": {
    "file": "必.svg",
    "src": "images/HSK_3.0/level5/必.svg",
    "caption": "ắt hẳn, nhất định"
  },
  "闭幕式": {
    "file": "闭幕式.svg",
    "src": "images/HSK_3.0/level5/闭幕式.svg",
    "caption": "lễ bế mạc"
  },
  "变动": {
    "file": "变动.svg",
    "src": "images/HSK_3.0/level5/变动.svg",
    "caption": "thay đổi, biến động"
  },
  "便利店": {
    "file": "便利店.svg",
    "src": "images/HSK_3.0/level5/便利店.svg",
    "caption": "cửa hàng tiện lợi"
  },
  "别²": {
    "file": "别².svg",
    "src": "images/HSK_3.0/level5/别².svg",
    "caption": "đừng"
  },
  "饼": {
    "file": "饼.svg",
    "src": "images/HSK_3.0/level5/饼.svg",
    "caption": "bánh (dẹt, tròn)"
  },
  "病房": {
    "file": "病房.svg",
    "src": "images/HSK_3.0/level5/病房.svg",
    "caption": "phòng bệnh"
  },
  "病情": {
    "file": "病情.svg",
    "src": "images/HSK_3.0/level5/病情.svg",
    "caption": "bệnh tình"
  },
  "不利": {
    "file": "不利.svg",
    "src": "images/HSK_3.0/level5/不利.svg",
    "caption": "bất lợi"
  },
  "不幸": {
    "file": "不幸.svg",
    "src": "images/HSK_3.0/level5/不幸.svg",
    "caption": "bất hạnh, không may"
  },
  "不符": {
    "file": "不符.svg",
    "src": "images/HSK_3.0/level5/不符.svg",
    "caption": "không phù hợp, không khớp"
  },
  "不良": {
    "file": "不良.svg",
    "src": "images/HSK_3.0/level5/不良.svg",
    "caption": "không tốt, xấu"
  },
  "步行": {
    "file": "步行.svg",
    "src": "images/HSK_3.0/level5/步行.svg",
    "caption": "đi bộ"
  },
  "才²": {
    "file": "才².svg",
    "src": "images/HSK_3.0/level5/才².svg",
    "caption": "tài năng, nhân tài"
  },
  "彩色": {
    "file": "彩色.svg",
    "src": "images/HSK_3.0/level5/彩色.svg",
    "caption": "màu, nhiều màu"
  },
  "采用": {
    "file": "采用.svg",
    "src": "images/HSK_3.0/level5/采用.svg",
    "caption": "áp dụng, sử dụng"
  },
  "餐饮": {
    "file": "餐饮.svg",
    "src": "images/HSK_3.0/level5/餐饮.svg",
    "caption": "ăn uống, dịch vụ ăn uống"
  },
  "藏": {
    "file": "藏.svg",
    "src": "images/HSK_3.0/level5/藏.svg",
    "caption": "giấu, cất giấu; trốn"
  },
  "测": {
    "file": "测.svg",
    "src": "images/HSK_3.0/level5/测.svg",
    "caption": "đo, đo lường"
  },
  "测试": {
    "file": "测试.svg",
    "src": "images/HSK_3.0/level5/测试.svg",
    "caption": "kiểm tra, thử nghiệm"
  },
  "曾": {
    "file": "曾.svg",
    "src": "images/HSK_3.0/level5/曾.svg",
    "caption": "từng, đã từng"
  },
  "产": {
    "file": "产.svg",
    "src": "images/HSK_3.0/level5/产.svg",
    "caption": "sản xuất, sinh sản"
  },
  "产量": {
    "file": "产量.svg",
    "src": "images/HSK_3.0/level5/产量.svg",
    "caption": "sản lượng"
  },
  "长处": {
    "file": "长处.svg",
    "src": "images/HSK_3.0/level5/长处.svg",
    "caption": "điểm mạnh, sở trường"
  },
  "长度": {
    "file": "长度.svg",
    "src": "images/HSK_3.0/level5/长度.svg",
    "caption": "chiều dài"
  },
  "长久": {
    "file": "长久.svg",
    "src": "images/HSK_3.0/level5/长久.svg",
    "caption": "lâu dài"
  },
  "长期": {
    "file": "长期.svg",
    "src": "images/HSK_3.0/level5/长期.svg",
    "caption": "thời gian dài, dài hạn"
  },
  "长远": {
    "file": "长远.svg",
    "src": "images/HSK_3.0/level5/长远.svg",
    "caption": "lâu dài, dài hạn"
  },
  "超": {
    "file": "超.svg",
    "src": "images/HSK_3.0/level5/超.svg",
    "caption": "vượt quá, siêu"
  },
  "超出": {
    "file": "超出.svg",
    "src": "images/HSK_3.0/level5/超出.svg",
    "caption": "vượt quá"
  },
  "超速": {
    "file": "超速.svg",
    "src": "images/HSK_3.0/level5/超速.svg",
    "caption": "chạy quá tốc độ"
  },
  "车祸": {
    "file": "车祸.svg",
    "src": "images/HSK_3.0/level5/车祸.svg",
    "caption": "tai nạn giao thông"
  },
  "车辆": {
    "file": "车辆.svg",
    "src": "images/HSK_3.0/level5/车辆.svg",
    "caption": "xe cộ"
  },
  "车主": {
    "file": "车主.svg",
    "src": "images/HSK_3.0/level5/车主.svg",
    "caption": "chủ xe"
  },
  "沉": {
    "file": "沉.svg",
    "src": "images/HSK_3.0/level5/沉.svg",
    "caption": "chìm; nặng"
  },
  "称¹": {
    "file": "称¹.svg",
    "src": "images/HSK_3.0/level5/称¹.svg",
    "caption": "gọi là, xưng là"
  },
  "称²": {
    "file": "称².svg",
    "src": "images/HSK_3.0/level5/称².svg",
    "caption": "gọi là, xưng là"
  },
  "称为": {
    "file": "称为.svg",
    "src": "images/HSK_3.0/level5/称为.svg",
    "caption": "gọi là"
  },
  "成年¹": {
    "file": "成年¹.svg",
    "src": "images/HSK_3.0/level5/成年¹.svg",
    "caption": "trưởng thành, thành niên"
  },
  "城区": {
    "file": "城区.svg",
    "src": "images/HSK_3.0/level5/城区.svg",
    "caption": "khu nội thành"
  },
  "橙子": {
    "file": "橙子.svg",
    "src": "images/HSK_3.0/level5/橙子.svg",
    "caption": "quả cam"
  },
  "池": {
    "file": "池.svg",
    "src": "images/HSK_3.0/level5/池.svg",
    "caption": "ao, bể"
  },
  "充电": {
    "file": "充电.svg",
    "src": "images/HSK_3.0/level5/充电.svg",
    "caption": "sạc điện; bồi dưỡng thêm"
  },
  "充值": {
    "file": "充值.svg",
    "src": "images/HSK_3.0/level5/充值.svg",
    "caption": "nạp tiền"
  },
  "虫子": {
    "file": "虫子.svg",
    "src": "images/HSK_3.0/level5/虫子.svg",
    "caption": "sâu bọ, côn trùng"
  },
  "抽": {
    "file": "抽.svg",
    "src": "images/HSK_3.0/level5/抽.svg",
    "caption": "rút, rút ra; hút (thuốc)"
  },
  "初": {
    "file": "初.svg",
    "src": "images/HSK_3.0/level5/初.svg",
    "caption": "đầu, ban đầu; lần đầu"
  },
  "初期": {
    "file": "初期.svg",
    "src": "images/HSK_3.0/level5/初期.svg",
    "caption": "thời kỳ đầu"
  },
  "出售": {
    "file": "出售.svg",
    "src": "images/HSK_3.0/level5/出售.svg",
    "caption": "bán ra"
  },
  "出自": {
    "file": "出自.svg",
    "src": "images/HSK_3.0/level5/出自.svg",
    "caption": "xuất phát từ, trích từ"
  },
  "处": {
    "file": "处.svg",
    "src": "images/HSK_3.0/level5/处.svg",
    "caption": "sống chung, đối xử; xử lý"
  },
  "处于": {
    "file": "处于.svg",
    "src": "images/HSK_3.0/level5/处于.svg",
    "caption": "ở vào, nằm trong (tình trạng)"
  },
  "传": {
    "file": "传.svg",
    "src": "images/HSK_3.0/level5/传.svg",
    "caption": "truyền, đưa; lan truyền"
  },
  "窗台": {
    "file": "窗台.svg",
    "src": "images/HSK_3.0/level5/窗台.svg",
    "caption": "bậu cửa sổ"
  },
  "此后": {
    "file": "此后.svg",
    "src": "images/HSK_3.0/level5/此后.svg",
    "caption": "từ đó về sau"
  },
  "此前": {
    "file": "此前.svg",
    "src": "images/HSK_3.0/level5/此前.svg",
    "caption": "trước đó"
  },
  "此时": {
    "file": "此时.svg",
    "src": "images/HSK_3.0/level5/此时.svg",
    "caption": "lúc này"
  },
  "从不": {
    "file": "从不.svg",
    "src": "images/HSK_3.0/level5/从不.svg",
    "caption": "chưa bao giờ, không bao giờ"
  },
  "促销": {
    "file": "促销.svg",
    "src": "images/HSK_3.0/level5/促销.svg",
    "caption": "khuyến mãi"
  },
  "存放": {
    "file": "存放.svg",
    "src": "images/HSK_3.0/level5/存放.svg",
    "caption": "cất giữ, gửi"
  },
  "存款": {
    "file": "存款.svg",
    "src": "images/HSK_3.0/level5/存款.svg",
    "caption": "gửi tiền; tiền gửi tiết kiệm"
  },
  "打断": {
    "file": "打断.svg",
    "src": "images/HSK_3.0/level5/打断.svg",
    "caption": "ngắt lời, cắt ngang"
  },
  "打破": {
    "file": "打破.svg",
    "src": "images/HSK_3.0/level5/打破.svg",
    "caption": "làm vỡ; phá (kỷ lục)"
  },
  "大胆": {
    "file": "大胆.svg",
    "src": "images/HSK_3.0/level5/大胆.svg",
    "caption": "mạnh dạn, táo bạo"
  },
  "大多": {
    "file": "大多.svg",
    "src": "images/HSK_3.0/level5/大多.svg",
    "caption": "phần lớn, đa số"
  },
  "大会": {
    "file": "大会.svg",
    "src": "images/HSK_3.0/level5/大会.svg",
    "caption": "đại hội"
  },
  "大力": {
    "file": "大力.svg",
    "src": "images/HSK_3.0/level5/大力.svg",
    "caption": "ra sức, mạnh mẽ"
  },
  "大妈": {
    "file": "大妈.svg",
    "src": "images/HSK_3.0/level5/大妈.svg",
    "caption": "bác gái, cô (gọi phụ nữ lớn tuổi)"
  },
  "大米": {
    "file": "大米.svg",
    "src": "images/HSK_3.0/level5/大米.svg",
    "caption": "gạo"
  },
  "大脑": {
    "file": "大脑.svg",
    "src": "images/HSK_3.0/level5/大脑.svg",
    "caption": "đại não, bộ não"
  },
  "大批": {
    "file": "大批.svg",
    "src": "images/HSK_3.0/level5/大批.svg",
    "caption": "số lượng lớn, hàng loạt"
  },
  "大事": {
    "file": "大事.svg",
    "src": "images/HSK_3.0/level5/大事.svg",
    "caption": "việc lớn, chuyện lớn"
  },
  "大爷": {
    "file": "大爷.svg",
    "src": "images/HSK_3.0/level5/大爷.svg",
    "caption": "bác (gọi đàn ông lớn tuổi)"
  },
  "大于": {
    "file": "大于.svg",
    "src": "images/HSK_3.0/level5/大于.svg",
    "caption": "lớn hơn"
  },
  "大众": {
    "file": "大众.svg",
    "src": "images/HSK_3.0/level5/大众.svg",
    "caption": "đại chúng, quần chúng"
  },
  "代": {
    "file": "代.svg",
    "src": "images/HSK_3.0/level5/代.svg",
    "caption": "thay, thay mặt; thế hệ, đời"
  },
  "带动": {
    "file": "带动.svg",
    "src": "images/HSK_3.0/level5/带动.svg",
    "caption": "thúc đẩy, kéo theo"
  },
  "单": {
    "file": "单.svg",
    "src": "images/HSK_3.0/level5/单.svg",
    "caption": "đơn, một mình; tờ, phiếu"
  },
  "单一": {
    "file": "单一.svg",
    "src": "images/HSK_3.0/level5/单一.svg",
    "caption": "đơn nhất, đơn điệu"
  },
  "胆小": {
    "file": "胆小.svg",
    "src": "images/HSK_3.0/level5/胆小.svg",
    "caption": "nhát gan"
  },
  "当年": {
    "file": "当年.svg",
    "src": "images/HSK_3.0/level5/当年.svg",
    "caption": "năm đó, hồi đó"
  },
  "当中": {
    "file": "当中.svg",
    "src": "images/HSK_3.0/level5/当中.svg",
    "caption": "ở giữa; trong số"
  },
  "当成": {
    "file": "当成.svg",
    "src": "images/HSK_3.0/level5/当成.svg",
    "caption": "coi như, xem là"
  },
  "当作": {
    "file": "当作.svg",
    "src": "images/HSK_3.0/level5/当作.svg",
    "caption": "coi như, xem như"
  },
  "到期": {
    "file": "到期.svg",
    "src": "images/HSK_3.0/level5/到期.svg",
    "caption": "hết hạn, đến hạn"
  },
  "登": {
    "file": "登.svg",
    "src": "images/HSK_3.0/level5/登.svg",
    "caption": "trèo, leo lên; đăng"
  },
  "灯光": {
    "file": "灯光.svg",
    "src": "images/HSK_3.0/level5/灯光.svg",
    "caption": "ánh đèn"
  },
  "低头": {
    "file": "低头.svg",
    "src": "images/HSK_3.0/level5/低头.svg",
    "caption": "cúi đầu; chịu khuất phục"
  },
  "地面": {
    "file": "地面.svg",
    "src": "images/HSK_3.0/level5/地面.svg",
    "caption": "mặt đất, sàn"
  },
  "地下": {
    "file": "地下.svg",
    "src": "images/HSK_3.0/level5/地下.svg",
    "caption": "dưới đất, ngầm"
  },
  "点赞": {
    "file": "点赞.svg",
    "src": "images/HSK_3.0/level5/点赞.svg",
    "caption": "bấm thích, like"
  },
  "电动": {
    "file": "电动.svg",
    "src": "images/HSK_3.0/level5/电动.svg",
    "caption": "chạy điện"
  },
  "电器": {
    "file": "电器.svg",
    "src": "images/HSK_3.0/level5/电器.svg",
    "caption": "đồ điện"
  },
  "电商": {
    "file": "电商.svg",
    "src": "images/HSK_3.0/level5/电商.svg",
    "caption": "thương mại điện tử"
  },
  "电视台": {
    "file": "电视台.svg",
    "src": "images/HSK_3.0/level5/电视台.svg",
    "caption": "đài truyền hình"
  },
  "电子版": {
    "file": "电子版.svg",
    "src": "images/HSK_3.0/level5/电子版.svg",
    "caption": "bản điện tử"
  },
  "调¹": {
    "file": "调¹.svg",
    "src": "images/HSK_3.0/level5/调¹.svg",
    "caption": "điều động, thuyên chuyển"
  },
  "调研": {
    "file": "调研.svg",
    "src": "images/HSK_3.0/level5/调研.svg",
    "caption": "điều tra nghiên cứu, khảo sát"
  },
  "丢失": {
    "file": "丢失.svg",
    "src": "images/HSK_3.0/level5/丢失.svg",
    "caption": "đánh mất, thất lạc"
  },
  "动画": {
    "file": "动画.svg",
    "src": "images/HSK_3.0/level5/动画.svg",
    "caption": "phim hoạt hình"
  },
  "动人": {
    "file": "动人.svg",
    "src": "images/HSK_3.0/level5/动人.svg",
    "caption": "cảm động, lay động lòng người"
  },
  "豆浆": {
    "file": "豆浆.svg",
    "src": "images/HSK_3.0/level5/豆浆.svg",
    "caption": "sữa đậu nành"
  },
  "读音": {
    "file": "读音.svg",
    "src": "images/HSK_3.0/level5/读音.svg",
    "caption": "cách đọc, âm đọc"
  },
  "独自": {
    "file": "独自.svg",
    "src": "images/HSK_3.0/level5/独自.svg",
    "caption": "một mình"
  },
  "堵": {
    "file": "堵.svg",
    "src": "images/HSK_3.0/level5/堵.svg",
    "caption": "chặn, tắc"
  },
  "度": {
    "file": "度.svg",
    "src": "images/HSK_3.0/level5/度.svg",
    "caption": "độ (nhiệt độ, góc); mức độ"
  },
  "短处": {
    "file": "短处.svg",
    "src": "images/HSK_3.0/level5/短处.svg",
    "caption": "điểm yếu, khuyết điểm"
  },
  "短期": {
    "file": "短期.svg",
    "src": "images/HSK_3.0/level5/短期.svg",
    "caption": "ngắn hạn"
  },
  "躲": {
    "file": "躲.svg",
    "src": "images/HSK_3.0/level5/躲.svg",
    "caption": "trốn, tránh"
  },
  "儿女": {
    "file": "儿女.svg",
    "src": "images/HSK_3.0/level5/儿女.svg",
    "caption": "con cái"
  },
  "二手": {
    "file": "二手.svg",
    "src": "images/HSK_3.0/level5/二手.svg",
    "caption": "đồ cũ, đã qua sử dụng"
  },
  "二维码": {
    "file": "二维码.svg",
    "src": "images/HSK_3.0/level5/二维码.svg",
    "caption": "mã QR"
  },
  "发起": {
    "file": "发起.svg",
    "src": "images/HSK_3.0/level5/发起.svg",
    "caption": "khởi xướng, phát động"
  },
  "发音": {
    "file": "发音.svg",
    "src": "images/HSK_3.0/level5/发音.svg",
    "caption": "phát âm"
  },
  "罚": {
    "file": "罚.svg",
    "src": "images/HSK_3.0/level5/罚.svg",
    "caption": "phạt"
  },
  "番茄": {
    "file": "番茄.svg",
    "src": "images/HSK_3.0/level5/番茄.svg",
    "caption": "cà chua"
  },
  "反": {
    "file": "反.svg",
    "src": "images/HSK_3.0/level5/反.svg",
    "caption": "ngược, trái; phản đối"
  },
  "返回": {
    "file": "返回.svg",
    "src": "images/HSK_3.0/level5/返回.svg",
    "caption": "trở về, quay lại"
  },
  "防": {
    "file": "防.svg",
    "src": "images/HSK_3.0/level5/防.svg",
    "caption": "phòng, đề phòng"
  },
  "房屋": {
    "file": "房屋.svg",
    "src": "images/HSK_3.0/level5/房屋.svg",
    "caption": "nhà cửa, nhà ở"
  },
  "飞行": {
    "file": "飞行.svg",
    "src": "images/HSK_3.0/level5/飞行.svg",
    "caption": "bay"
  },
  "飞行员": {
    "file": "飞行员.svg",
    "src": "images/HSK_3.0/level5/飞行员.svg",
    "caption": "phi công"
  },
  "非洲": {
    "file": "非洲.svg",
    "src": "images/HSK_3.0/level5/非洲.svg",
    "caption": "châu Phi"
  },
  "分类": {
    "file": "分类.svg",
    "src": "images/HSK_3.0/level5/分类.svg",
    "caption": "phân loại"
  },
  "分离": {
    "file": "分离.svg",
    "src": "images/HSK_3.0/level5/分离.svg",
    "caption": "chia lìa, tách rời"
  },
  "分享": {
    "file": "分享.svg",
    "src": "images/HSK_3.0/level5/分享.svg",
    "caption": "chia sẻ"
  },
  "丰富多彩": {
    "file": "丰富多彩.svg",
    "src": "images/HSK_3.0/level5/丰富多彩.svg",
    "caption": "phong phú đa dạng, muôn màu muôn vẻ"
  },
  "福": {
    "file": "福.svg",
    "src": "images/HSK_3.0/level5/福.svg",
    "caption": "phúc, phước"
  },
  "副¹": {
    "file": "副¹.svg",
    "src": "images/HSK_3.0/level5/副¹.svg",
    "caption": "phó (chức vụ)"
  },
  "改天": {
    "file": "改天.svg",
    "src": "images/HSK_3.0/level5/改天.svg",
    "caption": "hôm khác, bữa khác"
  },
  "敢于": {
    "file": "敢于.svg",
    "src": "images/HSK_3.0/level5/敢于.svg",
    "caption": "dám, dũng cảm"
  },
  "刚好": {
    "file": "刚好.svg",
    "src": "images/HSK_3.0/level5/刚好.svg",
    "caption": "vừa vặn, vừa đúng lúc"
  },
  "高大": {
    "file": "高大.svg",
    "src": "images/HSK_3.0/level5/高大.svg",
    "caption": "cao lớn"
  },
  "高度": {
    "file": "高度.svg",
    "src": "images/HSK_3.0/level5/高度.svg",
    "caption": "độ cao; cao độ, rất"
  },
  "高科技": {
    "file": "高科技.svg",
    "src": "images/HSK_3.0/level5/高科技.svg",
    "caption": "công nghệ cao"
  },
  "高效": {
    "file": "高效.svg",
    "src": "images/HSK_3.0/level5/高效.svg",
    "caption": "hiệu quả cao"
  },
  "歌词": {
    "file": "歌词.svg",
    "src": "images/HSK_3.0/level5/歌词.svg",
    "caption": "lời bài hát"
  },
  "歌曲": {
    "file": "歌曲.svg",
    "src": "images/HSK_3.0/level5/歌曲.svg",
    "caption": "bài hát, ca khúc"
  },
  "隔": {
    "file": "隔.svg",
    "src": "images/HSK_3.0/level5/隔.svg",
    "caption": "cách, ngăn cách, cách quãng"
  },
  "各行各业": {
    "file": "各行各业.svg",
    "src": "images/HSK_3.0/level5/各行各业.svg",
    "caption": "các ngành các nghề, mọi ngành nghề"
  },
  "更换": {
    "file": "更换.svg",
    "src": "images/HSK_3.0/level5/更换.svg",
    "caption": "thay thế"
  },
  "公务员": {
    "file": "公务员.svg",
    "src": "images/HSK_3.0/level5/公务员.svg",
    "caption": "công chức"
  },
  "共享": {
    "file": "共享.svg",
    "src": "images/HSK_3.0/level5/共享.svg",
    "caption": "chia sẻ, dùng chung"
  },
  "古": {
    "file": "古.svg",
    "src": "images/HSK_3.0/level5/古.svg",
    "caption": "cổ, cổ xưa, ngày xưa"
  },
  "鼓": {
    "file": "鼓.svg",
    "src": "images/HSK_3.0/level5/鼓.svg",
    "caption": "trống; đánh trống; cổ vũ"
  },
  "古老": {
    "file": "古老.svg",
    "src": "images/HSK_3.0/level5/古老.svg",
    "caption": "cổ xưa"
  },
  "怪": {
    "file": "怪.svg",
    "src": "images/HSK_3.0/level5/怪.svg",
    "caption": "kỳ lạ; trách, trách móc"
  },
  "光线": {
    "file": "光线.svg",
    "src": "images/HSK_3.0/level5/光线.svg",
    "caption": "ánh sáng"
  },
  "广": {
    "file": "广.svg",
    "src": "images/HSK_3.0/level5/广.svg",
    "caption": "rộng, rộng rãi"
  },
  "贵姓": {
    "file": "贵姓.svg",
    "src": "images/HSK_3.0/level5/贵姓.svg",
    "caption": "quý tính, họ (cách hỏi lịch sự)"
  },
  "柜子": {
    "file": "柜子.svg",
    "src": "images/HSK_3.0/level5/柜子.svg",
    "caption": "tủ"
  },
  "国画": {
    "file": "国画.svg",
    "src": "images/HSK_3.0/level5/国画.svg",
    "caption": "tranh thủy mặc, quốc họa"
  },
  "国庆": {
    "file": "国庆.svg",
    "src": "images/HSK_3.0/level5/国庆.svg",
    "caption": "quốc khánh"
  },
  "过度": {
    "file": "过度.svg",
    "src": "images/HSK_3.0/level5/过度.svg",
    "caption": "quá mức, thái quá"
  },
  "含": {
    "file": "含.svg",
    "src": "images/HSK_3.0/level5/含.svg",
    "caption": "chứa, hàm chứa, ngậm"
  },
  "含量": {
    "file": "含量.svg",
    "src": "images/HSK_3.0/level5/含量.svg",
    "caption": "hàm lượng"
  },
  "含有": {
    "file": "含有.svg",
    "src": "images/HSK_3.0/level5/含有.svg",
    "caption": "chứa"
  },
  "汗水": {
    "file": "汗水.svg",
    "src": "images/HSK_3.0/level5/汗水.svg",
    "caption": "mồ hôi"
  },
  "好评": {
    "file": "好评.svg",
    "src": "images/HSK_3.0/level5/好评.svg",
    "caption": "đánh giá tốt, nhận xét tốt"
  },
  "好运": {
    "file": "好运.svg",
    "src": "images/HSK_3.0/level5/好运.svg",
    "caption": "may mắn, vận may"
  },
  "好转": {
    "file": "好转.svg",
    "src": "images/HSK_3.0/level5/好转.svg",
    "caption": "trở nên tốt hơn"
  },
  "合": {
    "file": "合.svg",
    "src": "images/HSK_3.0/level5/合.svg",
    "caption": "khép lại, đóng lại; hợp lại"
  },
  "盒饭": {
    "file": "盒饭.svg",
    "src": "images/HSK_3.0/level5/盒饭.svg",
    "caption": "cơm hộp"
  },
  "河流": {
    "file": "河流.svg",
    "src": "images/HSK_3.0/level5/河流.svg",
    "caption": "sông"
  },
  "厚度": {
    "file": "厚度.svg",
    "src": "images/HSK_3.0/level5/厚度.svg",
    "caption": "độ dày, bề dày"
  },
  "湖": {
    "file": "湖.svg",
    "src": "images/HSK_3.0/level5/湖.svg",
    "caption": "hồ"
  },
  "互动": {
    "file": "互动.svg",
    "src": "images/HSK_3.0/level5/互动.svg",
    "caption": "tương tác, giao lưu"
  },
  "户外": {
    "file": "户外.svg",
    "src": "images/HSK_3.0/level5/户外.svg",
    "caption": "ngoài trời"
  },
  "化": {
    "file": "化.svg",
    "src": "images/HSK_3.0/level5/化.svg",
    "caption": "hóa (-ize); tan chảy, biến đổi"
  },
  "话费": {
    "file": "话费.svg",
    "src": "images/HSK_3.0/level5/话费.svg",
    "caption": "cước điện thoại, tiền điện thoại"
  },
  "画面": {
    "file": "画面.svg",
    "src": "images/HSK_3.0/level5/画面.svg",
    "caption": "hình ảnh, khung hình, cảnh tượng"
  },
  "缓慢": {
    "file": "缓慢.svg",
    "src": "images/HSK_3.0/level5/缓慢.svg",
    "caption": "chậm rãi, chậm chạp"
  },
  "黄瓜": {
    "file": "黄瓜.svg",
    "src": "images/HSK_3.0/level5/黄瓜.svg",
    "caption": "dưa chuột, dưa leo"
  },
  "灰色": {
    "file": "灰色.svg",
    "src": "images/HSK_3.0/level5/灰色.svg",
    "caption": "màu xám"
  },
  "回收": {
    "file": "回收.svg",
    "src": "images/HSK_3.0/level5/回收.svg",
    "caption": "thu hồi, tái chế"
  },
  "伙": {
    "file": "伙.svg",
    "src": "images/HSK_3.0/level5/伙.svg",
    "caption": "nhóm, đám, tốp (lượng từ)"
  },
  "火锅": {
    "file": "火锅.svg",
    "src": "images/HSK_3.0/level5/火锅.svg",
    "caption": "lẩu"
  },
  "或是": {
    "file": "或是.svg",
    "src": "images/HSK_3.0/level5/或是.svg",
    "caption": "hoặc là, hay là"
  },
  "货物": {
    "file": "货物.svg",
    "src": "images/HSK_3.0/level5/货物.svg",
    "caption": "hàng hóa"
  },
  "机构": {
    "file": "机构.svg",
    "src": "images/HSK_3.0/level5/机构.svg",
    "caption": "cơ cấu, cơ quan, tổ chức"
  },
  "机器人": {
    "file": "机器人.svg",
    "src": "images/HSK_3.0/level5/机器人.svg",
    "caption": "người máy, rô-bốt"
  },
  "及": {
    "file": "及.svg",
    "src": "images/HSK_3.0/level5/及.svg",
    "caption": "và, cùng với"
  },
  "级": {
    "file": "级.svg",
    "src": "images/HSK_3.0/level5/级.svg",
    "caption": "cấp, bậc, mức độ"
  },
  "集": {
    "file": "集.svg",
    "src": "images/HSK_3.0/level5/集.svg",
    "caption": "tập (phim, sách); tập hợp"
  },
  "疾病": {
    "file": "疾病.svg",
    "src": "images/HSK_3.0/level5/疾病.svg",
    "caption": "căn bệnh"
  },
  "即将": {
    "file": "即将.svg",
    "src": "images/HSK_3.0/level5/即将.svg",
    "caption": "sớm"
  },
  "急需": {
    "file": "急需.svg",
    "src": "images/HSK_3.0/level5/急需.svg",
    "caption": "cần gấp, đang rất cần"
  },
  "挤": {
    "file": "挤.svg",
    "src": "images/HSK_3.0/level5/挤.svg",
    "caption": "chen chúc, đông đúc; vắt, nặn"
  },
  "纪录片": {
    "file": "纪录片.svg",
    "src": "images/HSK_3.0/level5/纪录片.svg",
    "caption": "phim tài liệu"
  },
  "技能": {
    "file": "技能.svg",
    "src": "images/HSK_3.0/level5/技能.svg",
    "caption": "kỹ năng"
  },
  "纪念日": {
    "file": "纪念日.svg",
    "src": "images/HSK_3.0/level5/纪念日.svg",
    "caption": "ngày kỷ niệm"
  },
  "计算机": {
    "file": "计算机.svg",
    "src": "images/HSK_3.0/level5/计算机.svg",
    "caption": "máy tính"
  },
  "家电": {
    "file": "家电.svg",
    "src": "images/HSK_3.0/level5/家电.svg",
    "caption": "đồ điện gia dụng"
  },
  "加热": {
    "file": "加热.svg",
    "src": "images/HSK_3.0/level5/加热.svg",
    "caption": "hâm nóng, làm nóng, gia nhiệt"
  },
  "加深": {
    "file": "加深.svg",
    "src": "images/HSK_3.0/level5/加深.svg",
    "caption": "làm sâu sắc thêm, sâu hơn"
  },
  "加速": {
    "file": "加速.svg",
    "src": "images/HSK_3.0/level5/加速.svg",
    "caption": "tăng tốc, đẩy nhanh"
  },
  "架": {
    "file": "架.svg",
    "src": "images/HSK_3.0/level5/架.svg",
    "caption": "chiếc, cỗ (máy bay, đàn); giá, kệ"
  },
  "驾照": {
    "file": "驾照.svg",
    "src": "images/HSK_3.0/level5/驾照.svg",
    "caption": "bằng lái xe"
  },
  "剪": {
    "file": "剪.svg",
    "src": "images/HSK_3.0/level5/剪.svg",
    "caption": "cắt, tỉa (bằng kéo)"
  },
  "建": {
    "file": "建.svg",
    "src": "images/HSK_3.0/level5/建.svg",
    "caption": "xây, xây dựng"
  },
  "键": {
    "file": "键.svg",
    "src": "images/HSK_3.0/level5/键.svg",
    "caption": "phím, nút bấm"
  },
  "渐渐": {
    "file": "渐渐.svg",
    "src": "images/HSK_3.0/level5/渐渐.svg",
    "caption": "dần dần"
  },
  "建造": {
    "file": "建造.svg",
    "src": "images/HSK_3.0/level5/建造.svg",
    "caption": "xây dựng"
  },
  "讲话": {
    "file": "讲话.svg",
    "src": "images/HSK_3.0/level5/讲话.svg",
    "caption": "nói chuyện, phát biểu; bài phát biểu"
  },
  "奖励": {
    "file": "奖励.svg",
    "src": "images/HSK_3.0/level5/奖励.svg",
    "caption": "khen thưởng, phần thưởng"
  },
  "讲述": {
    "file": "讲述.svg",
    "src": "images/HSK_3.0/level5/讲述.svg",
    "caption": "kể"
  },
  "降水": {
    "file": "降水.svg",
    "src": "images/HSK_3.0/level5/降水.svg",
    "caption": "lượng mưa, giáng thủy"
  },
  "交易": {
    "file": "交易.svg",
    "src": "images/HSK_3.0/level5/交易.svg",
    "caption": "giao dịch"
  },
  "脚步": {
    "file": "脚步.svg",
    "src": "images/HSK_3.0/level5/脚步.svg",
    "caption": "bước chân, nhịp bước"
  },
  "较": {
    "file": "较.svg",
    "src": "images/HSK_3.0/level5/较.svg",
    "caption": "so sánh"
  },
  "接收": {
    "file": "接收.svg",
    "src": "images/HSK_3.0/level5/接收.svg",
    "caption": "nhận, tiếp nhận"
  },
  "结": {
    "file": "结.svg",
    "src": "images/HSK_3.0/level5/结.svg",
    "caption": "kết quả; kết lại; thắt nút"
  },
  "今日": {
    "file": "今日.svg",
    "src": "images/HSK_3.0/level5/今日.svg",
    "caption": "hôm nay, ngày nay"
  },
  "紧": {
    "file": "紧.svg",
    "src": "images/HSK_3.0/level5/紧.svg",
    "caption": "chặt; gấp, gấp gáp"
  },
  "紧密": {
    "file": "紧密.svg",
    "src": "images/HSK_3.0/level5/紧密.svg",
    "caption": "chặt chẽ, mật thiết"
  },
  "近年来": {
    "file": "近年来.svg",
    "src": "images/HSK_3.0/level5/近年来.svg",
    "caption": "những năm gần đây"
  },
  "近期": {
    "file": "近期.svg",
    "src": "images/HSK_3.0/level5/近期.svg",
    "caption": "dạo gần đây, thời gian gần đây"
  },
  "近日": {
    "file": "近日.svg",
    "src": "images/HSK_3.0/level5/近日.svg",
    "caption": "mấy ngày gần đây, dạo gần đây"
  },
  "进一步": {
    "file": "进一步.svg",
    "src": "images/HSK_3.0/level5/进一步.svg",
    "caption": "hơn nữa"
  },
  "惊喜": {
    "file": "惊喜.svg",
    "src": "images/HSK_3.0/level5/惊喜.svg",
    "caption": "bất ngờ và vui mừng, niềm vui bất ngờ"
  },
  "静": {
    "file": "静.svg",
    "src": "images/HSK_3.0/level5/静.svg",
    "caption": "yên tĩnh, tĩnh lặng"
  },
  "久远": {
    "file": "久远.svg",
    "src": "images/HSK_3.0/level5/久远.svg",
    "caption": "xa xưa, lâu đời"
  },
  "橘子": {
    "file": "橘子.svg",
    "src": "images/HSK_3.0/level5/橘子.svg",
    "caption": "quả quýt, quả cam"
  },
  "据": {
    "file": "据.svg",
    "src": "images/HSK_3.0/level5/据.svg",
    "caption": "theo, căn cứ vào"
  },
  "距": {
    "file": "距.svg",
    "src": "images/HSK_3.0/level5/距.svg",
    "caption": "cách (khoảng cách, thời gian)"
  },
  "剧场": {
    "file": "剧场.svg",
    "src": "images/HSK_3.0/level5/剧场.svg",
    "caption": "nhà hát, rạp hát"
  },
  "具有": {
    "file": "具有.svg",
    "src": "images/HSK_3.0/level5/具有.svg",
    "caption": "có"
  },
  "开幕": {
    "file": "开幕.svg",
    "src": "images/HSK_3.0/level5/开幕.svg",
    "caption": "khai mạc"
  },
  "开通": {
    "file": "开通.svg",
    "src": "images/HSK_3.0/level5/开通.svg",
    "caption": "khai thông, thông tuyến, mở (dịch vụ)"
  },
  "开业": {
    "file": "开业.svg",
    "src": "images/HSK_3.0/level5/开业.svg",
    "caption": "khai trương, mở cửa kinh doanh"
  },
  "看作": {
    "file": "看作.svg",
    "src": "images/HSK_3.0/level5/看作.svg",
    "caption": "coi như, xem như"
  },
  "靠近": {
    "file": "靠近.svg",
    "src": "images/HSK_3.0/level5/靠近.svg",
    "caption": "tiếp cận"
  },
  "科研": {
    "file": "科研.svg",
    "src": "images/HSK_3.0/level5/科研.svg",
    "caption": "nghiên cứu khoa học"
  },
  "客服": {
    "file": "客服.svg",
    "src": "images/HSK_3.0/level5/客服.svg",
    "caption": "dịch vụ chăm sóc khách hàng, nhân viên hỗ trợ"
  },
  "客户": {
    "file": "客户.svg",
    "src": "images/HSK_3.0/level5/客户.svg",
    "caption": "khách hàng"
  },
  "空中": {
    "file": "空中.svg",
    "src": "images/HSK_3.0/level5/空中.svg",
    "caption": "không khí"
  },
  "口袋": {
    "file": "口袋.svg",
    "src": "images/HSK_3.0/level5/口袋.svg",
    "caption": "túi áo, túi quần, túi"
  },
  "库": {
    "file": "库.svg",
    "src": "images/HSK_3.0/level5/库.svg",
    "caption": "kho, kho chứa"
  },
  "宽度": {
    "file": "宽度.svg",
    "src": "images/HSK_3.0/level5/宽度.svg",
    "caption": "chiều rộng, độ rộng"
  },
  "老公": {
    "file": "老公.svg",
    "src": "images/HSK_3.0/level5/老公.svg",
    "caption": "chồng, ông xã (thân mật)"
  },
  "姥爷": {
    "file": "姥爷.svg",
    "src": "images/HSK_3.0/level5/姥爷.svg",
    "caption": "ông ngoại"
  },
  "乐趣": {
    "file": "乐趣.svg",
    "src": "images/HSK_3.0/level5/乐趣.svg",
    "caption": "niềm vui, sự thú vị"
  },
  "泪": {
    "file": "泪.svg",
    "src": "images/HSK_3.0/level5/泪.svg",
    "caption": "nước mắt, giọt lệ"
  },
  "类": {
    "file": "类.svg",
    "src": "images/HSK_3.0/level5/类.svg",
    "caption": "loại, loài; chủng loại"
  },
  "泪水": {
    "file": "泪水.svg",
    "src": "images/HSK_3.0/level5/泪水.svg",
    "caption": "nước mắt"
  },
  "离职": {
    "file": "离职.svg",
    "src": "images/HSK_3.0/level5/离职.svg",
    "caption": "thôi việc, nghỉ việc, từ chức"
  },
  "里头": {
    "file": "里头.svg",
    "src": "images/HSK_3.0/level5/里头.svg",
    "caption": "bên trong, trong"
  },
  "力": {
    "file": "力.svg",
    "src": "images/HSK_3.0/level5/力.svg",
    "caption": "sức, sức lực; lực"
  },
  "连接": {
    "file": "连接.svg",
    "src": "images/HSK_3.0/level5/连接.svg",
    "caption": "kết nối, nối liền"
  },
  "脸色": {
    "file": "脸色.svg",
    "src": "images/HSK_3.0/level5/脸色.svg",
    "caption": "sắc mặt, vẻ mặt"
  },
  "领": {
    "file": "领.svg",
    "src": "images/HSK_3.0/level5/领.svg",
    "caption": "nhận, lĩnh; dẫn đầu"
  },
  "领带": {
    "file": "领带.svg",
    "src": "images/HSK_3.0/level5/领带.svg",
    "caption": "cà vạt"
  },
  "领取": {
    "file": "领取.svg",
    "src": "images/HSK_3.0/level5/领取.svg",
    "caption": "nhận, lĩnh (tiền, đồ, chứng chỉ)"
  },
  "令": {
    "file": "令.svg",
    "src": "images/HSK_3.0/level5/令.svg",
    "caption": "khiến cho, làm cho"
  },
  "流感": {
    "file": "流感.svg",
    "src": "images/HSK_3.0/level5/流感.svg",
    "caption": "bệnh cúm, cúm mùa"
  },
  "留言": {
    "file": "留言.svg",
    "src": "images/HSK_3.0/level5/留言.svg",
    "caption": "để lại tin nhắn, lời nhắn"
  },
  "录": {
    "file": "录.svg",
    "src": "images/HSK_3.0/level5/录.svg",
    "caption": "ghi âm, thu hình; ghi chép"
  },
  "路人": {
    "file": "路人.svg",
    "src": "images/HSK_3.0/level5/路人.svg",
    "caption": "người qua đường"
  },
  "路线": {
    "file": "路线.svg",
    "src": "images/HSK_3.0/level5/路线.svg",
    "caption": "tuyến đường, lộ trình"
  },
  "旅行社": {
    "file": "旅行社.svg",
    "src": "images/HSK_3.0/level5/旅行社.svg",
    "caption": "công ty du lịch"
  },
  "买卖": {
    "file": "买卖.svg",
    "src": "images/HSK_3.0/level5/买卖.svg",
    "caption": "buôn bán, việc kinh doanh"
  },
  "毛笔": {
    "file": "毛笔.svg",
    "src": "images/HSK_3.0/level5/毛笔.svg",
    "caption": "bút lông (viết thư pháp)"
  },
  "没法儿": {
    "file": "没法儿.svg",
    "src": "images/HSK_3.0/level5/没法儿.svg",
    "caption": "hết cách, không có cách nào, không thể nào"
  },
  "玫瑰": {
    "file": "玫瑰.svg",
    "src": "images/HSK_3.0/level5/玫瑰.svg",
    "caption": "hoa hồng"
  },
  "美味": {
    "file": "美味.svg",
    "src": "images/HSK_3.0/level5/美味.svg",
    "caption": "món ngon; thơm ngon, mỹ vị"
  },
  "门诊": {
    "file": "门诊.svg",
    "src": "images/HSK_3.0/level5/门诊.svg",
    "caption": "khám bệnh ngoại trú, phòng khám ngoại trú"
  },
  "迷": {
    "file": "迷.svg",
    "src": "images/HSK_3.0/level5/迷.svg",
    "caption": "say mê; người hâm mộ; lạc (đường)"
  },
  "面²": {
    "file": "面².svg",
    "src": "images/HSK_3.0/level5/面².svg",
    "caption": "mặt, phía, phương diện"
  },
  "面向": {
    "file": "面向.svg",
    "src": "images/HSK_3.0/level5/面向.svg",
    "caption": "hướng tới, đối mặt; phục vụ cho"
  },
  "描述": {
    "file": "描述.svg",
    "src": "images/HSK_3.0/level5/描述.svg",
    "caption": "mô tả, miêu tả"
  },
  "名称": {
    "file": "名称.svg",
    "src": "images/HSK_3.0/level5/名称.svg",
    "caption": "tên gọi, danh xưng"
  },
  "命¹": {
    "file": "命¹.svg",
    "src": "images/HSK_3.0/level5/命¹.svg",
    "caption": "mạng sống, tính mạng; số mệnh"
  },
  "难度": {
    "file": "难度.svg",
    "src": "images/HSK_3.0/level5/难度.svg",
    "caption": "khó khăn"
  },
  "难以": {
    "file": "难以.svg",
    "src": "images/HSK_3.0/level5/难以.svg",
    "caption": "khó mà, khó lòng"
  },
  "男子": {
    "file": "男子.svg",
    "src": "images/HSK_3.0/level5/男子.svg",
    "caption": "người đàn ông, nam giới"
  },
  "闹": {
    "file": "闹.svg",
    "src": "images/HSK_3.0/level5/闹.svg",
    "caption": "ồn ào, náo nhiệt; làm ầm lên"
  },
  "闹钟": {
    "file": "闹钟.svg",
    "src": "images/HSK_3.0/level5/闹钟.svg",
    "caption": "đồng hồ báo thức"
  },
  "年初": {
    "file": "年初.svg",
    "src": "images/HSK_3.0/level5/年初.svg",
    "caption": "đầu năm"
  },
  "年夜饭": {
    "file": "年夜饭.svg",
    "src": "images/HSK_3.0/level5/年夜饭.svg",
    "caption": "bữa cơm tất niên (đêm 30 Tết)"
  },
  "女子": {
    "file": "女子.svg",
    "src": "images/HSK_3.0/level5/女子.svg",
    "caption": "người phụ nữ, nữ giới"
  },
  "拍摄": {
    "file": "拍摄.svg",
    "src": "images/HSK_3.0/level5/拍摄.svg",
    "caption": "bắn"
  },
  "派出所": {
    "file": "派出所.svg",
    "src": "images/HSK_3.0/level5/派出所.svg",
    "caption": "đồn công an, đồn cảnh sát"
  },
  "跑道": {
    "file": "跑道.svg",
    "src": "images/HSK_3.0/level5/跑道.svg",
    "caption": "đường chạy (điền kinh), đường băng"
  },
  "赔": {
    "file": "赔.svg",
    "src": "images/HSK_3.0/level5/赔.svg",
    "caption": "đền, bồi thường"
  },
  "陪伴": {
    "file": "陪伴.svg",
    "src": "images/HSK_3.0/level5/陪伴.svg",
    "caption": "đồng hành, ở bên cạnh, làm bạn"
  },
  "配": {
    "file": "配.svg",
    "src": "images/HSK_3.0/level5/配.svg",
    "caption": "phối, tương xứng, hợp với"
  },
  "配送": {
    "file": "配送.svg",
    "src": "images/HSK_3.0/level5/配送.svg",
    "caption": "giao hàng, vận chuyển"
  },
  "碰见": {
    "file": "碰见.svg",
    "src": "images/HSK_3.0/level5/碰见.svg",
    "caption": "tình cờ gặp, đụng mặt"
  },
  "批¹": {
    "file": "批¹.svg",
    "src": "images/HSK_3.0/level5/批¹.svg",
    "caption": "lô, mẻ, đợt"
  },
  "批²": {
    "file": "批².svg",
    "src": "images/HSK_3.0/level5/批².svg",
    "caption": "lô, mẻ, đợt"
  },
  "拼": {
    "file": "拼.svg",
    "src": "images/HSK_3.0/level5/拼.svg",
    "caption": "ghép lại, ráp; dốc sức, liều"
  },
  "品": {
    "file": "品.svg",
    "src": "images/HSK_3.0/level5/品.svg",
    "caption": "nếm, thưởng thức; phẩm chất"
  },
  "品牌": {
    "file": "品牌.svg",
    "src": "images/HSK_3.0/level5/品牌.svg",
    "caption": "nhãn hiệu"
  },
  "聘请": {
    "file": "聘请.svg",
    "src": "images/HSK_3.0/level5/聘请.svg",
    "caption": "mời, thuê (chuyên gia, giáo viên)"
  },
  "评": {
    "file": "评.svg",
    "src": "images/HSK_3.0/level5/评.svg",
    "caption": "đánh giá, bình phẩm, chấm điểm"
  },
  "凭借": {
    "file": "凭借.svg",
    "src": "images/HSK_3.0/level5/凭借.svg",
    "caption": "bằng"
  },
  "平台": {
    "file": "平台.svg",
    "src": "images/HSK_3.0/level5/平台.svg",
    "caption": "nền tảng"
  },
  "齐": {
    "file": "齐.svg",
    "src": "images/HSK_3.0/level5/齐.svg",
    "caption": "đều, cùng nhau, đầy đủ"
  },
  "其": {
    "file": "其.svg",
    "src": "images/HSK_3.0/level5/其.svg",
    "caption": "của nó, của họ; trong đó"
  },
  "气球": {
    "file": "气球.svg",
    "src": "images/HSK_3.0/level5/气球.svg",
    "caption": "bóng bay, bong bóng"
  },
  "签¹": {
    "file": "签¹.svg",
    "src": "images/HSK_3.0/level5/签¹.svg",
    "caption": "ký (tên)"
  },
  "签订": {
    "file": "签订.svg",
    "src": "images/HSK_3.0/level5/签订.svg",
    "caption": "ký hiệu"
  },
  "签名": {
    "file": "签名.svg",
    "src": "images/HSK_3.0/level5/签名.svg",
    "caption": "chữ ký"
  },
  "签字": {
    "file": "签字.svg",
    "src": "images/HSK_3.0/level5/签字.svg",
    "caption": "ký hiệu"
  },
  "前进": {
    "file": "前进.svg",
    "src": "images/HSK_3.0/level5/前进.svg",
    "caption": "tiến về phía trước"
  },
  "前来": {
    "file": "前来.svg",
    "src": "images/HSK_3.0/level5/前来.svg",
    "caption": "đến, tới tham dự"
  },
  "前往": {
    "file": "前往.svg",
    "src": "images/HSK_3.0/level5/前往.svg",
    "caption": "đi"
  },
  "强大": {
    "file": "强大.svg",
    "src": "images/HSK_3.0/level5/强大.svg",
    "caption": "mạnh mẽ"
  },
  "强度": {
    "file": "强度.svg",
    "src": "images/HSK_3.0/level5/强度.svg",
    "caption": "cường độ"
  },
  "亲": {
    "file": "亲.svg",
    "src": "images/HSK_3.0/level5/亲.svg",
    "caption": "thân thiết; người thân; hôn"
  },
  "亲朋好友": {
    "file": "亲朋好友.svg",
    "src": "images/HSK_3.0/level5/亲朋好友.svg",
    "caption": "bạn bè và người thân, thân bằng hảo hữu"
  },
  "亲情": {
    "file": "亲情.svg",
    "src": "images/HSK_3.0/level5/亲情.svg",
    "caption": "tình thân, tình cảm gia đình"
  },
  "亲人": {
    "file": "亲人.svg",
    "src": "images/HSK_3.0/level5/亲人.svg",
    "caption": "họ hàng"
  },
  "轻重": {
    "file": "轻重.svg",
    "src": "images/HSK_3.0/level5/轻重.svg",
    "caption": "mức độ nặng nhẹ, tầm quan trọng, chừng mực"
  },
  "情感": {
    "file": "情感.svg",
    "src": "images/HSK_3.0/level5/情感.svg",
    "caption": "cảm xúc"
  },
  "权": {
    "file": "权.svg",
    "src": "images/HSK_3.0/level5/权.svg",
    "caption": "quyền, quyền lợi, quyền lực"
  },
  "全力": {
    "file": "全力.svg",
    "src": "images/HSK_3.0/level5/全力.svg",
    "caption": "toàn bộ sức mạnh"
  },
  "全体": {
    "file": "全体.svg",
    "src": "images/HSK_3.0/level5/全体.svg",
    "caption": "toàn thể, tất cả"
  },
  "全新": {
    "file": "全新.svg",
    "src": "images/HSK_3.0/level5/全新.svg",
    "caption": "thương hiệu mới"
  },
  "群体": {
    "file": "群体.svg",
    "src": "images/HSK_3.0/level5/群体.svg",
    "caption": "quần thể, nhóm cộng đồng, tập thể"
  },
  "热量": {
    "file": "热量.svg",
    "src": "images/HSK_3.0/level5/热量.svg",
    "caption": "nhiệt lượng, lượng calo"
  },
  "人际": {
    "file": "人际.svg",
    "src": "images/HSK_3.0/level5/人际.svg",
    "caption": "giữa các cá nhân, quan hệ xã giao"
  },
  "人力": {
    "file": "人力.svg",
    "src": "images/HSK_3.0/level5/人力.svg",
    "caption": "nhân lực, sức người"
  },
  "人民": {
    "file": "人民.svg",
    "src": "images/HSK_3.0/level5/人民.svg",
    "caption": "mọi người"
  },
  "人群": {
    "file": "人群.svg",
    "src": "images/HSK_3.0/level5/人群.svg",
    "caption": "đám đông, dòng người"
  },
  "人体": {
    "file": "人体.svg",
    "src": "images/HSK_3.0/level5/人体.svg",
    "caption": "cơ thể con người"
  },
  "忍": {
    "file": "忍.svg",
    "src": "images/HSK_3.0/level5/忍.svg",
    "caption": "nhịn, nhẫn nhịn, chịu đựng"
  },
  "认": {
    "file": "认.svg",
    "src": "images/HSK_3.0/level5/认.svg",
    "caption": "nhận ra, nhận biết; nhận (lỗi)"
  },
  "如": {
    "file": "如.svg",
    "src": "images/HSK_3.0/level5/如.svg",
    "caption": "chẳng hạn như"
  },
  "如此": {
    "file": "如此.svg",
    "src": "images/HSK_3.0/level5/如此.svg",
    "caption": "như vậy, như thế này"
  },
  "如同": {
    "file": "如同.svg",
    "src": "images/HSK_3.0/level5/如同.svg",
    "caption": "như, giống như, tựa như"
  },
  "如下": {
    "file": "如下.svg",
    "src": "images/HSK_3.0/level5/如下.svg",
    "caption": "như sau, dưới đây"
  },
  "赛场": {
    "file": "赛场.svg",
    "src": "images/HSK_3.0/level5/赛场.svg",
    "caption": "đấu trường"
  },
  "沙子": {
    "file": "沙子.svg",
    "src": "images/HSK_3.0/level5/沙子.svg",
    "caption": "cát, hạt cát"
  },
  "删": {
    "file": "删.svg",
    "src": "images/HSK_3.0/level5/删.svg",
    "caption": "xóa, loại bỏ"
  },
  "扇": {
    "file": "扇.svg",
    "src": "images/HSK_3.0/level5/扇.svg",
    "caption": "quạt (gió)"
  },
  "山区": {
    "file": "山区.svg",
    "src": "images/HSK_3.0/level5/山区.svg",
    "caption": "vùng núi, miền núi"
  },
  "伤": {
    "file": "伤.svg",
    "src": "images/HSK_3.0/level5/伤.svg",
    "caption": "vết thương; làm bị thương, làm tổn thương"
  },
  "商家": {
    "file": "商家.svg",
    "src": "images/HSK_3.0/level5/商家.svg",
    "caption": "thương gia, người bán hàng, cửa hàng kinh doanh"
  },
  "商人": {
    "file": "商人.svg",
    "src": "images/HSK_3.0/level5/商人.svg",
    "caption": "thương nhân, người làm kinh doanh"
  },
  "赏": {
    "file": "赏.svg",
    "src": "images/HSK_3.0/level5/赏.svg",
    "caption": "thưởng thức, ngắm; ban thưởng"
  },
  "上传": {
    "file": "上传.svg",
    "src": "images/HSK_3.0/level5/上传.svg",
    "caption": "tải lên"
  },
  "上升": {
    "file": "上升.svg",
    "src": "images/HSK_3.0/level5/上升.svg",
    "caption": "tăng lên"
  },
  "上下": {
    "file": "上下.svg",
    "src": "images/HSK_3.0/level5/上下.svg",
    "caption": "lên và xuống"
  },
  "上涨": {
    "file": "上涨.svg",
    "src": "images/HSK_3.0/level5/上涨.svg",
    "caption": "tăng lên, tăng giá"
  },
  "烧": {
    "file": "烧.svg",
    "src": "images/HSK_3.0/level5/烧.svg",
    "caption": "đốt; nấu, nướng; sốt (bị sốt)"
  },
  "烧烤": {
    "file": "烧烤.svg",
    "src": "images/HSK_3.0/level5/烧烤.svg",
    "caption": "đồ nướng, món nướng (BBQ)"
  },
  "舍得": {
    "file": "舍得.svg",
    "src": "images/HSK_3.0/level5/舍得.svg",
    "caption": "sẵn sàng bỏ ra, không tiếc"
  },
  "深度": {
    "file": "深度.svg",
    "src": "images/HSK_3.0/level5/深度.svg",
    "caption": "độ sâu; chuyên sâu, sâu sắc"
  },
  "深厚": {
    "file": "深厚.svg",
    "src": "images/HSK_3.0/level5/深厚.svg",
    "caption": "sâu sắc, sâu đậm, thâm hậu"
  },
  "深入": {
    "file": "深入.svg",
    "src": "images/HSK_3.0/level5/深入.svg",
    "caption": "đi sâu vào, sâu sắc, sâu rộng"
  },
  "深远": {
    "file": "深远.svg",
    "src": "images/HSK_3.0/level5/深远.svg",
    "caption": "sâu xa, sâu rộng, lâu dài"
  },
  "升¹": {
    "file": "升¹.svg",
    "src": "images/HSK_3.0/level5/升¹.svg",
    "caption": "thăng, lên"
  },
  "升级": {
    "file": "升级.svg",
    "src": "images/HSK_3.0/level5/升级.svg",
    "caption": "nâng cấp"
  },
  "升温": {
    "file": "升温.svg",
    "src": "images/HSK_3.0/level5/升温.svg",
    "caption": "tăng nhiệt độ, nóng lên, ấm lên"
  },
  "省²": {
    "file": "省².svg",
    "src": "images/HSK_3.0/level5/省².svg",
    "caption": "tỉnh; tiết kiệm"
  },
  "省份": {
    "file": "省份.svg",
    "src": "images/HSK_3.0/level5/省份.svg",
    "caption": "tỉnh, tỉnh thành"
  },
  "胜": {
    "file": "胜.svg",
    "src": "images/HSK_3.0/level5/胜.svg",
    "caption": "thắng, chiến thắng"
  },
  "湿": {
    "file": "湿.svg",
    "src": "images/HSK_3.0/level5/湿.svg",
    "caption": "ướt, ẩm ướt"
  },
  "失恋": {
    "file": "失恋.svg",
    "src": "images/HSK_3.0/level5/失恋.svg",
    "caption": "thất tình"
  },
  "诗人": {
    "file": "诗人.svg",
    "src": "images/HSK_3.0/level5/诗人.svg",
    "caption": "nhà thơ"
  },
  "实验室": {
    "file": "实验室.svg",
    "src": "images/HSK_3.0/level5/实验室.svg",
    "caption": "phòng thí nghiệm"
  },
  "食用": {
    "file": "食用.svg",
    "src": "images/HSK_3.0/level5/食用.svg",
    "caption": "ăn, dùng làm thực phẩm"
  },
  "使得": {
    "file": "使得.svg",
    "src": "images/HSK_3.0/level5/使得.svg",
    "caption": "khiến cho, làm cho"
  },
  "式": {
    "file": "式.svg",
    "src": "images/HSK_3.0/level5/式.svg",
    "caption": "kiểu, dạng, phong cách"
  },
  "适当": {
    "file": "适当.svg",
    "src": "images/HSK_3.0/level5/适当.svg",
    "caption": "thích hợp"
  },
  "市民": {
    "file": "市民.svg",
    "src": "images/HSK_3.0/level5/市民.svg",
    "caption": "công dân"
  },
  "视为": {
    "file": "视为.svg",
    "src": "images/HSK_3.0/level5/视为.svg",
    "caption": "xem như, coi là"
  },
  "试用": {
    "file": "试用.svg",
    "src": "images/HSK_3.0/level5/试用.svg",
    "caption": "dùng thử; thử việc"
  },
  "适用": {
    "file": "适用.svg",
    "src": "images/HSK_3.0/level5/适用.svg",
    "caption": "có thể áp dụng"
  },
  "收集": {
    "file": "收集.svg",
    "src": "images/HSK_3.0/level5/收集.svg",
    "caption": "thu thập"
  },
  "收看": {
    "file": "收看.svg",
    "src": "images/HSK_3.0/level5/收看.svg",
    "caption": "theo dõi, đón xem (truyền hình, chương trình)"
  },
  "守": {
    "file": "守.svg",
    "src": "images/HSK_3.0/level5/守.svg",
    "caption": "giữ, canh giữ, tuân thủ"
  },
  "首次": {
    "file": "首次.svg",
    "src": "images/HSK_3.0/level5/首次.svg",
    "caption": "lần đầu tiên"
  },
  "手段": {
    "file": "手段.svg",
    "src": "images/HSK_3.0/level5/手段.svg",
    "caption": "có nghĩa là"
  },
  "售价": {
    "file": "售价.svg",
    "src": "images/HSK_3.0/level5/售价.svg",
    "caption": "giá bán"
  },
  "书房": {
    "file": "书房.svg",
    "src": "images/HSK_3.0/level5/书房.svg",
    "caption": "phòng đọc sách, phòng làm việc"
  },
  "熟人": {
    "file": "熟人.svg",
    "src": "images/HSK_3.0/level5/熟人.svg",
    "caption": "người quen"
  },
  "树木": {
    "file": "树木.svg",
    "src": "images/HSK_3.0/level5/树木.svg",
    "caption": "cây cối"
  },
  "摔": {
    "file": "摔.svg",
    "src": "images/HSK_3.0/level5/摔.svg",
    "caption": "ném"
  },
  "水分": {
    "file": "水分.svg",
    "src": "images/HSK_3.0/level5/水分.svg",
    "caption": "nước, độ ẩm"
  },
  "睡眠": {
    "file": "睡眠.svg",
    "src": "images/HSK_3.0/level5/睡眠.svg",
    "caption": "giấc ngủ"
  },
  "顺": {
    "file": "顺.svg",
    "src": "images/HSK_3.0/level5/顺.svg",
    "caption": "thuận, xuôi; tiện thể; suôn sẻ"
  },
  "四处": {
    "file": "四处.svg",
    "src": "images/HSK_3.0/level5/四处.svg",
    "caption": "khắp nơi, bốn phương, tứ phía"
  },
  "四周": {
    "file": "四周.svg",
    "src": "images/HSK_3.0/level5/四周.svg",
    "caption": "xung quanh, bốn bề"
  },
  "搜": {
    "file": "搜.svg",
    "src": "images/HSK_3.0/level5/搜.svg",
    "caption": "tìm kiếm, tra cứu"
  },
  "酸甜苦辣": {
    "file": "酸甜苦辣.svg",
    "src": "images/HSK_3.0/level5/酸甜苦辣.svg",
    "caption": "chua cay mặn ngọt, thăng trầm cuộc đời"
  },
  "随": {
    "file": "随.svg",
    "src": "images/HSK_3.0/level5/随.svg",
    "caption": "theo, tùy theo, đi theo"
  },
  "随后": {
    "file": "随后.svg",
    "src": "images/HSK_3.0/level5/随后.svg",
    "caption": "sau đó, tiếp theo đó"
  },
  "损害": {
    "file": "损害.svg",
    "src": "images/HSK_3.0/level5/损害.svg",
    "caption": "làm hại, tổn hại, thiệt hại"
  },
  "缩小": {
    "file": "缩小.svg",
    "src": "images/HSK_3.0/level5/缩小.svg",
    "caption": "thu hẹp, thu nhỏ"
  },
  "所¹": {
    "file": "所¹.svg",
    "src": "images/HSK_3.0/level5/所¹.svg",
    "caption": "nơi, sở (lượng từ tổ chức)"
  },
  "他人": {
    "file": "他人.svg",
    "src": "images/HSK_3.0/level5/他人.svg",
    "caption": "những người khác (đại từ)"
  },
  "台灯": {
    "file": "台灯.svg",
    "src": "images/HSK_3.0/level5/台灯.svg",
    "caption": "đèn bàn"
  },
  "谈话": {
    "file": "谈话.svg",
    "src": "images/HSK_3.0/level5/谈话.svg",
    "caption": "nói chuyện, trò chuyện, đàm đạo"
  },
  "特产": {
    "file": "特产.svg",
    "src": "images/HSK_3.0/level5/特产.svg",
    "caption": "đặc sản"
  },
  "特有": {
    "file": "特有.svg",
    "src": "images/HSK_3.0/level5/特有.svg",
    "caption": "đặc hữu, riêng biệt, vốn có"
  },
  "疼痛": {
    "file": "疼痛.svg",
    "src": "images/HSK_3.0/level5/疼痛.svg",
    "caption": "đau"
  },
  "提交": {
    "file": "提交.svg",
    "src": "images/HSK_3.0/level5/提交.svg",
    "caption": "gửi"
  },
  "提起": {
    "file": "提起.svg",
    "src": "images/HSK_3.0/level5/提起.svg",
    "caption": "nhắc đến, đề cập tới"
  },
  "提升": {
    "file": "提升.svg",
    "src": "images/HSK_3.0/level5/提升.svg",
    "caption": "nâng cao, cải thiện, đề bạt"
  },
  "体力": {
    "file": "体力.svg",
    "src": "images/HSK_3.0/level5/体力.svg",
    "caption": "sức mạnh thể chất"
  },
  "替": {
    "file": "替.svg",
    "src": "images/HSK_3.0/level5/替.svg",
    "caption": "thay, hộ, giúp"
  },
  "天上": {
    "file": "天上.svg",
    "src": "images/HSK_3.0/level5/天上.svg",
    "caption": "trên trời, bầu trời"
  },
  "填": {
    "file": "填.svg",
    "src": "images/HSK_3.0/level5/填.svg",
    "caption": "điền vào, lấp"
  },
  "甜品": {
    "file": "甜品.svg",
    "src": "images/HSK_3.0/level5/甜品.svg",
    "caption": "món tráng miệng, đồ ngọt"
  },
  "挑": {
    "file": "挑.svg",
    "src": "images/HSK_3.0/level5/挑.svg",
    "caption": "chọn, lựa chọn"
  },
  "挑选": {
    "file": "挑选.svg",
    "src": "images/HSK_3.0/level5/挑选.svg",
    "caption": "lựa chọn, tuyển chọn"
  },
  "调": {
    "file": "调.svg",
    "src": "images/HSK_3.0/level5/调.svg",
    "caption": "điều chỉnh, nêm nếm, phối trộn"
  },
  "跳高": {
    "file": "跳高.svg",
    "src": "images/HSK_3.0/level5/跳高.svg",
    "caption": "nhảy cao (môn điền kinh)"
  },
  "跳远": {
    "file": "跳远.svg",
    "src": "images/HSK_3.0/level5/跳远.svg",
    "caption": "nhảy xa (môn điền kinh)"
  },
  "贴": {
    "file": "贴.svg",
    "src": "images/HSK_3.0/level5/贴.svg",
    "caption": "cây gậy"
  },
  "铁路": {
    "file": "铁路.svg",
    "src": "images/HSK_3.0/level5/铁路.svg",
    "caption": "đường sắt"
  },
  "停留": {
    "file": "停留.svg",
    "src": "images/HSK_3.0/level5/停留.svg",
    "caption": "dừng lại, lưu lại"
  },
  "通行": {
    "file": "通行.svg",
    "src": "images/HSK_3.0/level5/通行.svg",
    "caption": "thông hành, lưu thông, đi lại"
  },
  "同": {
    "file": "同.svg",
    "src": "images/HSK_3.0/level5/同.svg",
    "caption": "cùng, cùng với; giống nhau"
  },
  "同一": {
    "file": "同一.svg",
    "src": "images/HSK_3.0/level5/同一.svg",
    "caption": "cùng một"
  },
  "投": {
    "file": "投.svg",
    "src": "images/HSK_3.0/level5/投.svg",
    "caption": "ném; bỏ (phiếu); đầu tư"
  },
  "图画": {
    "file": "图画.svg",
    "src": "images/HSK_3.0/level5/图画.svg",
    "caption": "bức tranh, tranh vẽ"
  },
  "图书": {
    "file": "图书.svg",
    "src": "images/HSK_3.0/level5/图书.svg",
    "caption": "sách, sách báo tư liệu"
  },
  "团队": {
    "file": "团队.svg",
    "src": "images/HSK_3.0/level5/团队.svg",
    "caption": "đội"
  },
  "推动": {
    "file": "推动.svg",
    "src": "images/HSK_3.0/level5/推动.svg",
    "caption": "thúc đẩy, đẩy mạnh"
  },
  "推进": {
    "file": "推进.svg",
    "src": "images/HSK_3.0/level5/推进.svg",
    "caption": "đẩy mạnh tiến độ, xúc tiến"
  },
  "退出": {
    "file": "退出.svg",
    "src": "images/HSK_3.0/level5/退出.svg",
    "caption": "rút lui, thoát ra"
  },
  "退还": {
    "file": "退还.svg",
    "src": "images/HSK_3.0/level5/退还.svg",
    "caption": "trả lại, hoàn lại"
  },
  "拖鞋": {
    "file": "拖鞋.svg",
    "src": "images/HSK_3.0/level5/拖鞋.svg",
    "caption": "dép lê, dép đi trong nhà"
  },
  "外部": {
    "file": "外部.svg",
    "src": "images/HSK_3.0/level5/外部.svg",
    "caption": "bên ngoài, phía ngoài"
  },
  "外观": {
    "file": "外观.svg",
    "src": "images/HSK_3.0/level5/外观.svg",
    "caption": "diện mạo bên ngoài, ngoại quan"
  },
  "外婆": {
    "file": "外婆.svg",
    "src": "images/HSK_3.0/level5/外婆.svg",
    "caption": "bà ngoại"
  },
  "外形": {
    "file": "外形.svg",
    "src": "images/HSK_3.0/level5/外形.svg",
    "caption": "hình dáng bên ngoài, ngoại hình"
  },
  "弯": {
    "file": "弯.svg",
    "src": "images/HSK_3.0/level5/弯.svg",
    "caption": "cong; cúi (người); khúc cua"
  },
  "围": {
    "file": "围.svg",
    "src": "images/HSK_3.0/level5/围.svg",
    "caption": "vây quanh, bao quanh"
  },
  "为²": {
    "file": "为².svg",
    "src": "images/HSK_3.0/level5/为².svg",
    "caption": "bị, do (cấu trúc bị động 为...所...)"
  },
  "违法": {
    "file": "违法.svg",
    "src": "images/HSK_3.0/level5/违法.svg",
    "caption": "vi phạm pháp luật, phạm pháp"
  },
  "喂²": {
    "file": "喂².svg",
    "src": "images/HSK_3.0/level5/喂².svg",
    "caption": "alô (chào điện thoại)"
  },
  "问卷": {
    "file": "问卷.svg",
    "src": "images/HSK_3.0/level5/问卷.svg",
    "caption": "bảng câu hỏi khảo sát"
  },
  "握": {
    "file": "握.svg",
    "src": "images/HSK_3.0/level5/握.svg",
    "caption": "nắm, cầm (tay)"
  },
  "无关": {
    "file": "无关.svg",
    "src": "images/HSK_3.0/level5/无关.svg",
    "caption": "không liên quan, không can dự"
  },
  "无限": {
    "file": "无限.svg",
    "src": "images/HSK_3.0/level5/无限.svg",
    "caption": "vô hạn, vô tận, không biên giới"
  },
  "无效": {
    "file": "无效.svg",
    "src": "images/HSK_3.0/level5/无效.svg",
    "caption": "vô hiệu, không có hiệu lực"
  },
  "舞台": {
    "file": "舞台.svg",
    "src": "images/HSK_3.0/level5/舞台.svg",
    "caption": "sân khấu"
  },
  "五颜六色": {
    "file": "五颜六色.svg",
    "src": "images/HSK_3.0/level5/五颜六色.svg",
    "caption": "đủ màu đủ sắc, rực rỡ sắc màu"
  },
  "物价": {
    "file": "物价.svg",
    "src": "images/HSK_3.0/level5/物价.svg",
    "caption": "giá"
  },
  "物品": {
    "file": "物品.svg",
    "src": "images/HSK_3.0/level5/物品.svg",
    "caption": "mục"
  },
  "西餐": {
    "file": "西餐.svg",
    "src": "images/HSK_3.0/level5/西餐.svg",
    "caption": "món tây, đồ ăn phương Tây"
  },
  "吸管": {
    "file": "吸管.svg",
    "src": "images/HSK_3.0/level5/吸管.svg",
    "caption": "ống hút"
  },
  "西装": {
    "file": "西装.svg",
    "src": "images/HSK_3.0/level5/西装.svg",
    "caption": "bộ vest, comple, âu phục"
  },
  "戏": {
    "file": "戏.svg",
    "src": "images/HSK_3.0/level5/戏.svg",
    "caption": "vở kịch, tuồng; kịch"
  },
  "先后": {
    "file": "先后.svg",
    "src": "images/HSK_3.0/level5/先后.svg",
    "caption": "lần lượt, trước sau; liên tiếp"
  },
  "闲": {
    "file": "闲.svg",
    "src": "images/HSK_3.0/level5/闲.svg",
    "caption": "rảnh rỗi, nhàn hạ"
  },
  "现代化": {
    "file": "现代化.svg",
    "src": "images/HSK_3.0/level5/现代化.svg",
    "caption": "hiện đại hóa"
  },
  "线路": {
    "file": "线路.svg",
    "src": "images/HSK_3.0/level5/线路.svg",
    "caption": "tuyến đường; mạch điện"
  },
  "乡": {
    "file": "乡.svg",
    "src": "images/HSK_3.0/level5/乡.svg",
    "caption": "thị trấn"
  },
  "乡村": {
    "file": "乡村.svg",
    "src": "images/HSK_3.0/level5/乡村.svg",
    "caption": "nông thôn"
  },
  "响声": {
    "file": "响声.svg",
    "src": "images/HSK_3.0/level5/响声.svg",
    "caption": "tiếng vang, âm thanh, tiếng động"
  },
  "相册": {
    "file": "相册.svg",
    "src": "images/HSK_3.0/level5/相册.svg",
    "caption": "cuốn album ảnh"
  },
  "向上": {
    "file": "向上.svg",
    "src": "images/HSK_3.0/level5/向上.svg",
    "caption": "hướng lên trên, vươn lên"
  },
  "消费者": {
    "file": "消费者.svg",
    "src": "images/HSK_3.0/level5/消费者.svg",
    "caption": "người tiêu dùng"
  },
  "销量": {
    "file": "销量.svg",
    "src": "images/HSK_3.0/level5/销量.svg",
    "caption": "doanh số bán hàng"
  },
  "小型": {
    "file": "小型.svg",
    "src": "images/HSK_3.0/level5/小型.svg",
    "caption": "cỡ nhỏ, loại nhỏ, mini"
  },
  "小于": {
    "file": "小于.svg",
    "src": "images/HSK_3.0/level5/小于.svg",
    "caption": "nhỏ hơn, bé hơn (<)"
  },
  "新人": {
    "file": "新人.svg",
    "src": "images/HSK_3.0/level5/新人.svg",
    "caption": "người mới (trong công ty); cô dâu chú rể"
  },
  "新型": {
    "file": "新型.svg",
    "src": "images/HSK_3.0/level5/新型.svg",
    "caption": "loại mới"
  },
  "信用": {
    "file": "信用.svg",
    "src": "images/HSK_3.0/level5/信用.svg",
    "caption": "uy tín, chữ tín, tín dụng"
  },
  "行程": {
    "file": "行程.svg",
    "src": "images/HSK_3.0/level5/行程.svg",
    "caption": "hành trình, lịch trình chuyến đi"
  },
  "行驶": {
    "file": "行驶.svg",
    "src": "images/HSK_3.0/level5/行驶.svg",
    "caption": "du lịch"
  },
  "行走": {
    "file": "行走.svg",
    "src": "images/HSK_3.0/level5/行走.svg",
    "caption": "đi bộ, bước đi"
  },
  "需": {
    "file": "需.svg",
    "src": "images/HSK_3.0/level5/需.svg",
    "caption": "cần, nhu cầu"
  },
  "学分": {
    "file": "学分.svg",
    "src": "images/HSK_3.0/level5/学分.svg",
    "caption": "tín chỉ (học tập)"
  },
  "学科": {
    "file": "学科.svg",
    "src": "images/HSK_3.0/level5/学科.svg",
    "caption": "môn học, ngành học, chuyên ngành"
  },
  "学年": {
    "file": "学年.svg",
    "src": "images/HSK_3.0/level5/学年.svg",
    "caption": "năm học, niên khóa"
  },
  "学者": {
    "file": "学者.svg",
    "src": "images/HSK_3.0/level5/学者.svg",
    "caption": "học giả, nhà nghiên cứu"
  },
  "雪糕": {
    "file": "雪糕.svg",
    "src": "images/HSK_3.0/level5/雪糕.svg",
    "caption": "kem que, kem"
  },
  "鸭子": {
    "file": "鸭子.svg",
    "src": "images/HSK_3.0/level5/鸭子.svg",
    "caption": "con vịt"
  },
  "沿": {
    "file": "沿.svg",
    "src": "images/HSK_3.0/level5/沿.svg",
    "caption": "men theo, dọc theo; mép, bờ"
  },
  "研发": {
    "file": "研发.svg",
    "src": "images/HSK_3.0/level5/研发.svg",
    "caption": "nghiên cứu và phát triển (R&D)"
  },
  "研制": {
    "file": "研制.svg",
    "src": "images/HSK_3.0/level5/研制.svg",
    "caption": "nghiên cứu chế tạo, phát triển"
  },
  "眼": {
    "file": "眼.svg",
    "src": "images/HSK_3.0/level5/眼.svg",
    "caption": "mắt; cái nhìn"
  },
  "眼泪": {
    "file": "眼泪.svg",
    "src": "images/HSK_3.0/level5/眼泪.svg",
    "caption": "nước mắt, giọt lệ"
  },
  "要不是": {
    "file": "要不是.svg",
    "src": "images/HSK_3.0/level5/要不是.svg",
    "caption": "nếu không phải vì, nếu không nhờ"
  },
  "药品": {
    "file": "药品.svg",
    "src": "images/HSK_3.0/level5/药品.svg",
    "caption": "thuốc men, dược phẩm"
  },
  "药物": {
    "file": "药物.svg",
    "src": "images/HSK_3.0/level5/药物.svg",
    "caption": "thuốc, dược chất"
  },
  "夜间": {
    "file": "夜间.svg",
    "src": "images/HSK_3.0/level5/夜间.svg",
    "caption": "ban đêm, đêm"
  },
  "夜市": {
    "file": "夜市.svg",
    "src": "images/HSK_3.0/level5/夜市.svg",
    "caption": "chợ đêm"
  },
  "医疗": {
    "file": "医疗.svg",
    "src": "images/HSK_3.0/level5/医疗.svg",
    "caption": "y tế, khám chữa bệnh"
  },
  "医学": {
    "file": "医学.svg",
    "src": "images/HSK_3.0/level5/医学.svg",
    "caption": "y học"
  },
  "移": {
    "file": "移.svg",
    "src": "images/HSK_3.0/level5/移.svg",
    "caption": "dời, chuyển, dịch chuyển"
  },
  "一次性": {
    "file": "一次性.svg",
    "src": "images/HSK_3.0/level5/一次性.svg",
    "caption": "dùng một lần"
  },
  "一代": {
    "file": "一代.svg",
    "src": "images/HSK_3.0/level5/一代.svg",
    "caption": "một thế hệ"
  },
  "一路": {
    "file": "一路.svg",
    "src": "images/HSK_3.0/level5/一路.svg",
    "caption": "suốt dọc đường, trên cả chặng đường"
  },
  "一路顺风": {
    "file": "一路顺风.svg",
    "src": "images/HSK_3.0/level5/一路顺风.svg",
    "caption": "thượng lộ bình an, thuận buồm xuôi gió"
  },
  "音量": {
    "file": "音量.svg",
    "src": "images/HSK_3.0/level5/音量.svg",
    "caption": "âm lượng, độ lớn âm thanh"
  },
  "引进": {
    "file": "引进.svg",
    "src": "images/HSK_3.0/level5/引进.svg",
    "caption": "du nhập, tiếp thu, nhập khẩu"
  },
  "应当": {
    "file": "应当.svg",
    "src": "images/HSK_3.0/level5/应当.svg",
    "caption": "nên, phải, cần phải"
  },
  "迎": {
    "file": "迎.svg",
    "src": "images/HSK_3.0/level5/迎.svg",
    "caption": "đón, nghênh đón; hướng về"
  },
  "影片": {
    "file": "影片.svg",
    "src": "images/HSK_3.0/level5/影片.svg",
    "caption": "bộ phim, phim điện ảnh"
  },
  "影视": {
    "file": "影视.svg",
    "src": "images/HSK_3.0/level5/影视.svg",
    "caption": "điện ảnh và truyền hình, phim ảnh"
  },
  "应对": {
    "file": "应对.svg",
    "src": "images/HSK_3.0/level5/应对.svg",
    "caption": "ứng phó, đối phó, xử lý"
  },
  "用法": {
    "file": "用法.svg",
    "src": "images/HSK_3.0/level5/用法.svg",
    "caption": "cách dùng, cách sử dụng"
  },
  "用力": {
    "file": "用力.svg",
    "src": "images/HSK_3.0/level5/用力.svg",
    "caption": "dùng sức"
  },
  "用品": {
    "file": "用品.svg",
    "src": "images/HSK_3.0/level5/用品.svg",
    "caption": "đồ dùng, vật dụng"
  },
  "优良": {
    "file": "优良.svg",
    "src": "images/HSK_3.0/level5/优良.svg",
    "caption": "ưu lương, xuất sắc, tốt đẹp"
  },
  "优质": {
    "file": "优质.svg",
    "src": "images/HSK_3.0/level5/优质.svg",
    "caption": "chất lượng cao, hảo hạng"
  },
  "由此": {
    "file": "由此.svg",
    "src": "images/HSK_3.0/level5/由此.svg",
    "caption": "từ đây, từ đó, do đó"
  },
  "邮寄": {
    "file": "邮寄.svg",
    "src": "images/HSK_3.0/level5/邮寄.svg",
    "caption": "gửi bưu điện, gửi bưu phẩm"
  },
  "邮票": {
    "file": "邮票.svg",
    "src": "images/HSK_3.0/level5/邮票.svg",
    "caption": "con tem, tem thư"
  },
  "油条": {
    "file": "油条.svg",
    "src": "images/HSK_3.0/level5/油条.svg",
    "caption": "quẩy, bánh quẩy"
  },
  "有害": {
    "file": "有害.svg",
    "src": "images/HSK_3.0/level5/有害.svg",
    "caption": "có hại"
  },
  "有力": {
    "file": "有力.svg",
    "src": "images/HSK_3.0/level5/有力.svg",
    "caption": "mạnh mẽ, đắc lực, có lực"
  },
  "有限": {
    "file": "有限.svg",
    "src": "images/HSK_3.0/level5/有限.svg",
    "caption": "có hạn, hữu hạn"
  },
  "有益": {
    "file": "有益.svg",
    "src": "images/HSK_3.0/level5/有益.svg",
    "caption": "có ích, có lợi"
  },
  "有助于": {
    "file": "有助于.svg",
    "src": "images/HSK_3.0/level5/有助于.svg",
    "caption": "có lợi cho, giúp ích cho, góp phần"
  },
  "雨水": {
    "file": "雨水.svg",
    "src": "images/HSK_3.0/level5/雨水.svg",
    "caption": "mưa"
  },
  "语文": {
    "file": "语文.svg",
    "src": "images/HSK_3.0/level5/语文.svg",
    "caption": "ngữ văn (môn học)"
  },
  "语音": {
    "file": "语音.svg",
    "src": "images/HSK_3.0/level5/语音.svg",
    "caption": "ngữ âm; tin nhắn thoại, cuộc gọi thoại"
  },
  "预测": {
    "file": "预测.svg",
    "src": "images/HSK_3.0/level5/预测.svg",
    "caption": "dự đoán, dự báo"
  },
  "预计": {
    "file": "预计.svg",
    "src": "images/HSK_3.0/level5/预计.svg",
    "caption": "dự tính, ước tính"
  },
  "预约": {
    "file": "预约.svg",
    "src": "images/HSK_3.0/level5/预约.svg",
    "caption": "đặt lịch hẹn trước, hẹn trước"
  },
  "原": {
    "file": "原.svg",
    "src": "images/HSK_3.0/level5/原.svg",
    "caption": "ban đầu, nguyên bản; gốc"
  },
  "原有": {
    "file": "原有.svg",
    "src": "images/HSK_3.0/level5/原有.svg",
    "caption": "vốn có, sẵn có từ trước"
  },
  "愿": {
    "file": "愿.svg",
    "src": "images/HSK_3.0/level5/愿.svg",
    "caption": "nguyện, mong muốn; chúc"
  },
  "约定": {
    "file": "约定.svg",
    "src": "images/HSK_3.0/level5/约定.svg",
    "caption": "thỏa thuận"
  },
  "运": {
    "file": "运.svg",
    "src": "images/HSK_3.0/level5/运.svg",
    "caption": "vận chuyển, chở; vận may"
  },
  "运费": {
    "file": "运费.svg",
    "src": "images/HSK_3.0/level5/运费.svg",
    "caption": "vận chuyển hàng hóa"
  },
  "在场": {
    "file": "在场.svg",
    "src": "images/HSK_3.0/level5/在场.svg",
    "caption": "có mặt, tại hiện trường"
  },
  "在内": {
    "file": "在内.svg",
    "src": "images/HSK_3.0/level5/在内.svg",
    "caption": "bao gồm cả, tính cả"
  },
  "在线": {
    "file": "在线.svg",
    "src": "images/HSK_3.0/level5/在线.svg",
    "caption": "trực tuyến"
  },
  "糟": {
    "file": "糟.svg",
    "src": "images/HSK_3.0/level5/糟.svg",
    "caption": "hỏng bét, tồi tệ, gay go"
  },
  "早期": {
    "file": "早期.svg",
    "src": "images/HSK_3.0/level5/早期.svg",
    "caption": "sớm"
  },
  "早晚": {
    "file": "早晚.svg",
    "src": "images/HSK_3.0/level5/早晚.svg",
    "caption": "sớm muộn; sáng tối"
  },
  "早已": {
    "file": "早已.svg",
    "src": "images/HSK_3.0/level5/早已.svg",
    "caption": "đã từ lâu, sớm đã"
  },
  "造": {
    "file": "造.svg",
    "src": "images/HSK_3.0/level5/造.svg",
    "caption": "làm, chế tạo, tạo dựng"
  },
  "增": {
    "file": "增.svg",
    "src": "images/HSK_3.0/level5/增.svg",
    "caption": "tăng, tăng thêm"
  },
  "增进": {
    "file": "增进.svg",
    "src": "images/HSK_3.0/level5/增进.svg",
    "caption": "tăng cường, nâng cao, làm sâu sắc thêm"
  },
  "增强": {
    "file": "增强.svg",
    "src": "images/HSK_3.0/level5/增强.svg",
    "caption": "tăng cường"
  },
  "赠": {
    "file": "赠.svg",
    "src": "images/HSK_3.0/level5/赠.svg",
    "caption": "tặng, biếu"
  },
  "赠送": {
    "file": "赠送.svg",
    "src": "images/HSK_3.0/level5/赠送.svg",
    "caption": "tặng, biếu tặng"
  },
  "炸": {
    "file": "炸.svg",
    "src": "images/HSK_3.0/level5/炸.svg",
    "caption": "rán, chiên (ngập dầu)"
  },
  "展出": {
    "file": "展出.svg",
    "src": "images/HSK_3.0/level5/展出.svg",
    "caption": "trưng bày, triển lãm"
  },
  "展示": {
    "file": "展示.svg",
    "src": "images/HSK_3.0/level5/展示.svg",
    "caption": "hiển thị"
  },
  "展现": {
    "file": "展现.svg",
    "src": "images/HSK_3.0/level5/展现.svg",
    "caption": "hiển thị"
  },
  "站台": {
    "file": "站台.svg",
    "src": "images/HSK_3.0/level5/站台.svg",
    "caption": "sân ga (ga tàu)"
  },
  "涨价": {
    "file": "涨价.svg",
    "src": "images/HSK_3.0/level5/涨价.svg",
    "caption": "tăng giá, lên giá"
  },
  "掌声": {
    "file": "掌声.svg",
    "src": "images/HSK_3.0/level5/掌声.svg",
    "caption": "tiếng vỗ tay, tràng pháo tay"
  },
  "账号": {
    "file": "账号.svg",
    "src": "images/HSK_3.0/level5/账号.svg",
    "caption": "tài khoản"
  },
  "折扣": {
    "file": "折扣.svg",
    "src": "images/HSK_3.0/level5/折扣.svg",
    "caption": "chiết khấu, giảm giá"
  },
  "真诚": {
    "file": "真诚.svg",
    "src": "images/HSK_3.0/level5/真诚.svg",
    "caption": "chân thành"
  },
  "珍贵": {
    "file": "珍贵.svg",
    "src": "images/HSK_3.0/level5/珍贵.svg",
    "caption": "quý giá"
  },
  "争": {
    "file": "争.svg",
    "src": "images/HSK_3.0/level5/争.svg",
    "caption": "tranh, tranh giành, dốc sức giành lấy"
  },
  "整整": {
    "file": "整整.svg",
    "src": "images/HSK_3.0/level5/整整.svg",
    "caption": "tròn, trọn vẹn, ròng rã"
  },
  "正如": {
    "file": "正如.svg",
    "src": "images/HSK_3.0/level5/正如.svg",
    "caption": "đúng như, giống như"
  },
  "证书": {
    "file": "证书.svg",
    "src": "images/HSK_3.0/level5/证书.svg",
    "caption": "giấy chứng nhận, văn bằng, chứng chỉ"
  },
  "支¹": {
    "file": "支¹.svg",
    "src": "images/HSK_3.0/level5/支¹.svg",
    "caption": "nhánh, cây (lượng từ)"
  },
  "知名": {
    "file": "知名.svg",
    "src": "images/HSK_3.0/level5/知名.svg",
    "caption": "nổi tiếng, có tiếng tăm"
  },
  "直播": {
    "file": "直播.svg",
    "src": "images/HSK_3.0/level5/直播.svg",
    "caption": "phát sóng trực tiếp, livestream"
  },
  "职场": {
    "file": "职场.svg",
    "src": "images/HSK_3.0/level5/职场.svg",
    "caption": "chốn công sở, môi trường làm việc"
  },
  "职工": {
    "file": "职工.svg",
    "src": "images/HSK_3.0/level5/职工.svg",
    "caption": "cán bộ công nhân viên, người lao động"
  },
  "执行": {
    "file": "执行.svg",
    "src": "images/HSK_3.0/level5/执行.svg",
    "caption": "thực hiện"
  },
  "止": {
    "file": "止.svg",
    "src": "images/HSK_3.0/level5/止.svg",
    "caption": "dừng lại, chấm dứt, ngưng"
  },
  "至": {
    "file": "至.svg",
    "src": "images/HSK_3.0/level5/至.svg",
    "caption": "đến"
  },
  "治": {
    "file": "治.svg",
    "src": "images/HSK_3.0/level5/治.svg",
    "caption": "chữa trị (bệnh); trị an, quản lý"
  },
  "制订": {
    "file": "制订.svg",
    "src": "images/HSK_3.0/level5/制订.svg",
    "caption": "xây dựng, lập ra, hoạch định (kế hoạch)"
  },
  "智能": {
    "file": "智能.svg",
    "src": "images/HSK_3.0/level5/智能.svg",
    "caption": "thông minh (smart, AI)"
  },
  "中华": {
    "file": "中华.svg",
    "src": "images/HSK_3.0/level5/中华.svg",
    "caption": "trung Quốc"
  },
  "中华民族": {
    "file": "中华民族.svg",
    "src": "images/HSK_3.0/level5/中华民族.svg",
    "caption": "dân tộc Trung Hoa"
  },
  "中级": {
    "file": "中级.svg",
    "src": "images/HSK_3.0/level5/中级.svg",
    "caption": "trung cấp"
  },
  "中期": {
    "file": "中期.svg",
    "src": "images/HSK_3.0/level5/中期.svg",
    "caption": "giai đoạn giữa, trung kỳ"
  },
  "中外": {
    "file": "中外.svg",
    "src": "images/HSK_3.0/level5/中外.svg",
    "caption": "trong và ngoài nước, Trung Quốc và nước ngoài"
  },
  "中药": {
    "file": "中药.svg",
    "src": "images/HSK_3.0/level5/中药.svg",
    "caption": "thuốc đông y, thuốc bắc"
  },
  "中医": {
    "file": "中医.svg",
    "src": "images/HSK_3.0/level5/中医.svg",
    "caption": "đông y, y học cổ truyền Trung Quốc"
  },
  "种子": {
    "file": "种子.svg",
    "src": "images/HSK_3.0/level5/种子.svg",
    "caption": "hạt giống"
  },
  "众多": {
    "file": "众多.svg",
    "src": "images/HSK_3.0/level5/众多.svg",
    "caption": "đông đảo, rất nhiều"
  },
  "种植": {
    "file": "种植.svg",
    "src": "images/HSK_3.0/level5/种植.svg",
    "caption": "trồng trọt, gieo trồng"
  },
  "周年": {
    "file": "周年.svg",
    "src": "images/HSK_3.0/level5/周年.svg",
    "caption": "tròn năm, kỷ niệm năm"
  },
  "主食": {
    "file": "主食.svg",
    "src": "images/HSK_3.0/level5/主食.svg",
    "caption": "món chính, lương thực chính"
  },
  "住房": {
    "file": "住房.svg",
    "src": "images/HSK_3.0/level5/住房.svg",
    "caption": "nhà ở"
  },
  "住宿": {
    "file": "住宿.svg",
    "src": "images/HSK_3.0/level5/住宿.svg",
    "caption": "chỗ ở, lưu trú, trọ lại"
  },
  "住址": {
    "file": "住址.svg",
    "src": "images/HSK_3.0/level5/住址.svg",
    "caption": "địa chỉ cư trú, nơi ở"
  },
  "注重": {
    "file": "注重.svg",
    "src": "images/HSK_3.0/level5/注重.svg",
    "caption": "chú ý đến"
  },
  "子女": {
    "file": "子女.svg",
    "src": "images/HSK_3.0/level5/子女.svg",
    "caption": "con cái"
  },
  "自身": {
    "file": "自身.svg",
    "src": "images/HSK_3.0/level5/自身.svg",
    "caption": "bản thân, chính mình"
  },
  "总部": {
    "file": "总部.svg",
    "src": "images/HSK_3.0/level5/总部.svg",
    "caption": "trụ sở chính, tổng bộ"
  },
  "总数": {
    "file": "总数.svg",
    "src": "images/HSK_3.0/level5/总数.svg",
    "caption": "tổng số"
  },
  "总体": {
    "file": "总体.svg",
    "src": "images/HSK_3.0/level5/总体.svg",
    "caption": "tổng thể, nhìn chung"
  },
  "租金": {
    "file": "租金.svg",
    "src": "images/HSK_3.0/level5/租金.svg",
    "caption": "tiền thuê (nhà, phòng)"
  },
  "族": {
    "file": "族.svg",
    "src": "images/HSK_3.0/level5/族.svg",
    "caption": "giới, nhóm người (như 上班族, 月光族); dân tộc"
  },
  "足够": {
    "file": "足够.svg",
    "src": "images/HSK_3.0/level5/足够.svg",
    "caption": "đủ"
  },
  "嘴巴": {
    "file": "嘴巴.svg",
    "src": "images/HSK_3.0/level5/嘴巴.svg",
    "caption": "miệng, mồm"
  },
  "最佳": {
    "file": "最佳.svg",
    "src": "images/HSK_3.0/level5/最佳.svg",
    "caption": "tốt nhất, tối ưu, xuất sắc nhất"
  },
  "作出": {
    "file": "作出.svg",
    "src": "images/HSK_3.0/level5/作出.svg",
    "caption": "đưa ra, tạo ra, cống hiến"
  }
};

/**
 * Returns illustration config for a word.
 * Fallback to intelligent POS-themed conceptual vector graphic.
 */
function getWordIllustration(word) {
  if (!word) return null;

  // 1. Direct word.image field (URL, base64 or inline SVG)
  if (word.image) {
    if (typeof word.image === 'string' && word.image.startsWith('<svg')) {
      return { type: 'svg', svg: word.image, caption: word.meaning || '' };
    }
    return { type: 'img', src: word.image, caption: word.meaning || '' };
  }

  const hanzi = (word.hanzi || word.word || '').trim();

  // 2. Pre-generated static AI illustrations from assets/images/illustrations/
  if (typeof STATIC_ILLUSTRATIONS_INDEX !== 'undefined' && STATIC_ILLUSTRATIONS_INDEX[hanzi]) {
    const item = STATIC_ILLUSTRATIONS_INDEX[hanzi];
    return {
      type: item.type || (item.file && item.file.endsWith('.svg') && !item.src ? 'svg' : 'img'),
      src: item.src || `assets/images/illustrations/${item.file}`,
      svg: item.svg,
      caption: item.caption || word.meaning || ''
    };
  }

  // 3. Preset curated illustrations
  if (WORD_ILLUSTRATIONS_DB[hanzi]) {
    return WORD_ILLUSTRATIONS_DB[hanzi];
  }

  // 4. Fallback: Sleek POS-Themed Conceptual Vector Graphic
  return generateAestheticFallback(word);
}

/**
 * Generates an aesthetic, modern conceptual vector motif based on Part of Speech (POS).
 * Completely eliminates raw character placeholders and generic "MINH HỌA" labels.
 */
function generateAestheticFallback(word) {
  const pos = getWordPartOfSpeech(word) || POS_TYPES.noun;
  const meaning = word.meaning || '';
  const code = pos.code || 'noun';

  let motifSvg = '';

  if (code === 'adj') {
    // Faceted Radiant Gem / Diamond (representing attributes, quality, radiance)
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gemGrad" x1="50" y1="60" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#10b981" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <path d="M64 78L82 54H118L136 78L100 146L64 78Z" fill="url(#gemGrad)" stroke="#065f46" stroke-width="2" />
      <path d="M82 54L100 78M118 54L100 78M64 78H136M82 78L100 146M118 78L100 146" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5" />
      <path d="M146 56L148 62L154 64L148 66L146 72L144 66L138 64L144 62Z" fill="#fef08a" />
      <path d="M54 124L55 128L59 129L55 130L54 134L53 130L49 129L53 128Z" fill="#fef08a" />
    </svg>`;
  } else if (code === 'verb') {
    // Dynamic Kinetic Action Vortex & Flight Arrow (representing motion, action, execution)
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vortexGrad" x1="45" y1="45" x2="155" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fb923c" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#f97316" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <path d="M52 100C52 73 73 52 100 52C124 52 144 69 147 92" stroke="url(#vortexGrad)" stroke-width="7" stroke-linecap="round" />
      <path d="M148 100C148 127 127 148 100 148C76 148 56 131 53 108" stroke="url(#vortexGrad)" stroke-width="7" stroke-linecap="round" />
      <path d="M138 88L148 94L156 82" fill="none" stroke="#f97316" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M62 112L52 106L44 118" fill="none" stroke="#ea580c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="100" cy="100" r="16" fill="#fb923c" fill-opacity="0.25" />
      <circle cx="100" cy="100" r="8" fill="#f97316" />
      <circle cx="100" cy="100" r="3" fill="#ffffff" />
    </svg>`;
  } else if (code === 'adv') {
    // Precision Meter Gauge / Radar (representing degree, frequency, manner)
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#f59e0b" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <path d="M54 135C45 112 50 84 68 66C86 48 114 43 137 52C150 58 160 68 166 82" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
      <circle cx="100" cy="115" r="10" fill="#1e293b" stroke="#f59e0b" stroke-width="3" />
      <line x1="100" y1="115" x2="132" y2="75" stroke="#ea580c" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="100" cy="115" r="3" fill="#ffffff" />
      <line x1="58" y1="100" x2="68" y2="100" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" />
      <line x1="100" y1="58" x2="100" y2="68" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" />
      <line x1="142" y1="100" x2="132" y2="100" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" />
    </svg>`;
  } else if (code === 'measure') {
    // Modular Stacking Measure Units / Blocks
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#f43f5e" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <rect x="56" y="116" width="88" height="28" rx="6" fill="#f43f5e" />
      <line x1="85" y1="116" x2="85" y2="144" stroke="#9f1239" stroke-width="2" stroke-dasharray="3 3" />
      <line x1="115" y1="116" x2="115" y2="144" stroke="#9f1239" stroke-width="2" stroke-dasharray="3 3" />
      <rect x="70" y="82" width="60" height="28" rx="6" fill="#fb7185" />
      <line x1="100" y1="82" x2="100" y2="110" stroke="#e11d48" stroke-width="2" stroke-dasharray="3 3" />
      <rect x="84" y="48" width="32" height="28" rx="6" fill="#fecdd3" />
    </svg>`;
  } else if (code === 'prep' || code === 'conj' || code === 'pron') {
    // Interlocking Nodes / Connection Bridge
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#14b8a6" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <line x1="64" y1="100" x2="136" y2="100" stroke="#14b8a6" stroke-width="5" stroke-linecap="round" />
      <path d="M64 100C78 72 122 72 136 100" stroke="#2dd4bf" stroke-width="3" stroke-dasharray="4 4" />
      <circle cx="64" cy="100" r="16" fill="#0d9488" stroke="#115e59" stroke-width="3" />
      <circle cx="64" cy="100" r="6" fill="#ffffff" />
      <circle cx="136" cy="100" r="16" fill="#14b8a6" stroke="#0f766e" stroke-width="3" />
      <circle cx="136" cy="100" r="6" fill="#ffffff" />
    </svg>`;
  } else {
    // Noun / Default: Isometric 3D Crystal Cube (representing objects, entities, concepts)
    motifSvg = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cubeTopGrad" x1="70" y1="55" x2="130" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#818cf8" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="currentColor" fill-opacity="0.03" />
      <circle cx="100" cy="100" r="74" stroke="#6366f1" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="4 4" />
      <path d="M100 55L144 80L100 105L56 80L100 55Z" fill="url(#cubeTopGrad)" stroke="#312e81" stroke-width="2" />
      <path d="M56 80L100 105V152L56 127V80Z" fill="#4338ca" stroke="#312e81" stroke-width="2" />
      <path d="M100 105L144 80V127L100 152V105Z" fill="#4f46e5" stroke="#312e81" stroke-width="2" />
      <circle cx="100" cy="105" r="4" fill="#c7d2fe" />
    </svg>`;
  }

  return {
    type: 'svg',
    isFallback: true,
    svg: motifSvg,
    caption: meaning || pos.label || 'Từ vựng HSK'
  };
}

/**
 * Dynamic Contextual Prompt Builder for AI Image Generation (DALL-E 3, Imagen 3, Gemini, Midjourney).
 * Automatically extracts real-world scenarios, human actions, or concrete physical objects
 * based on the word definition, part of speech, and contextual example sentences.
 *
 * @param {Object} word - Word item with hanzi, pinyin, meaning, part_of_speech/pos, and example sentences.
 * @returns {Object} Structured prompt metadata { prompt, style, visualSubject, negativePrompt }
 */
function buildContextualPrompt(word) {
  if (!word) return { prompt: '', style: '', visualSubject: '', negativePrompt: '' };

  const hanzi = (word.hanzi || word.word || '').trim();
  const pinyin = (word.pinyin || '').trim();
  const meaning = (word.meaning || '').trim();
  const pos = (typeof getWordPartOfSpeech === 'function' ? getWordPartOfSpeech(word) : null) || { code: 'noun', label: 'Danh từ', en: 'Noun' };
  const posCode = pos.code || 'noun';

  // Extract clean example context (without HTML tags like <u>...</u>)
  const exZh = (word.example_zh || word.example || '').replace(/<[^>]*>/g, '').trim();
  const exVi = (word.example_vi || '').replace(/<[^>]*>/g, '').trim();

  // Define visual scene anchor based on Part of Speech and concrete semantic role
  let actionScene = '';
  switch (posCode) {
    case 'verb':
      actionScene = `A rich, detailed scene-based real-world human action representing the exact definition of '${meaning}'. Show a stylized, expressive character actively performing the action with authentic body posture and emotion. Include environmental details and props (e.g. stage, room, tools, surfaces, lighting, foreground and background elements) to clearly establish the context of the action. Absolutely NO abstract symbols, geometric badges, or floating icons.`;
      break;
    case 'noun':
      actionScene = `A vivid, scene-based real-world environment or tangible physical object representing '${meaning}'. Place the subject in an authentic, tangible context with surrounding props, realistic surfaces, atmospheric depth, and spatial details rather than an isolated generic icon.`;
      break;
    case 'adj':
      actionScene = `A rich real-world scenario featuring an expressive character vividly embodying the state or emotion of '${meaning}'. Depict expressive facial emotion, dynamic body posture, and immersive atmospheric ambiance (e.g., dramatic lighting, weather, or room setting) making the concept immediately intuitive.`;
      break;
    case 'adv':
      actionScene = `An engaging storytelling visual scene depicting the manner, degree, or timing of '${meaning}' in a relatable everyday context with active characters and environmental props.`;
      break;
    case 'measure':
      actionScene = `A modular grouping of everyday tangible items demonstrating the counting unit concept of '${meaning}', stacked or arranged neatly in an authentic real-world scene.`;
      break;
    default:
      actionScene = `An intuitive, scene-based real-world scenario illustrating the communicative concept of '${meaning}' with characters, props, and environment.`;
  }

  // Include contextual scenario clue if example sentence is available
  let contextClue = '';
  if (exVi) {
    contextClue = ` Contextual real-world reference: '${exVi}'.`;
  } else if (exZh) {
    contextClue = ` Context reference: '${exZh}'.`;
  }

  // Strict visual style guidelines
  const visualStyle = 'Clean, friendly 2D flat cartoon or minimalist vector illustration with expressive contours, rich narrative depth, and full-bleed composition filling the container space. Dark-mode friendly color palette with deep slate navy background (#0f172a, #1e293b), muted blues, warm golden/amber glows (#f59e0b, #fbbf24), and energetic modern accents (#38bdf8, #10b981, #ec4899, #fb923c).';

  // Strict negative constraints
  const negativeConstraints = 'STRICT NEGATIVE CONSTRAINTS: Absolutely NO abstract symbols, NO logos, NO minimalist icons, NO geometric badges. Absolutely NO text, NO letters, NO words, NO subtitles, NO typography, NO Chinese characters, NO Hanzi, NO English words, NO pinyin, NO brand logos, NO Gemini logos, NO watermarks, NO 3D photorealistic rendering.';

  const fullPrompt = `${visualStyle} Subject: ${actionScene}${contextClue} Designed for language flashcard memory anchoring. ${negativeConstraints}`;

  return {
    prompt: fullPrompt,
    style: visualStyle,
    visualSubject: actionScene,
    contextClue: contextClue,
    negativePrompt: negativeConstraints
  };
}

// ==========================================================================
// Synapse Instant-Load Acceleration Engine: Multi-Tier SVG Cache & Preloader
// ==========================================================================
const SynapseSvgCache = (typeof window !== 'undefined' && window.SynapseSvgCache) ? window.SynapseSvgCache : new Map();
const SynapseInflightFetches = (typeof window !== 'undefined' && window.SynapseInflightFetches) ? window.SynapseInflightFetches : new Map();
const SYNAPSE_ILLU_CACHE_NAME = 'synapse-illustrations-v1';

/**
 * Normalizes input to an illustration src string.
 */
function extractIllustrationSrc(illuOrSrcOrWord) {
  if (!illuOrSrcOrWord) return '';
  if (typeof illuOrSrcOrWord === 'string') return illuOrSrcOrWord;
  if (illuOrSrcOrWord.src) return illuOrSrcOrWord.src;
  if (illuOrSrcOrWord.hanzi || illuOrSrcOrWord.word) {
    const illu = getWordIllustration(illuOrSrcOrWord);
    return (illu && illu.src) ? illu.src : '';
  }
  return '';
}

/**
 * Preload an individual illustration into browser RAM and persistent CacheStorage.
 * Returns a Promise that resolves with the raw SVG string if available.
 * @param {string|Object} illuOrSrc - Source path, illustration object, or word item.
 * @param {string} priority - 'high' | 'auto' | 'low'
 */
function preloadIllustration(illuOrSrc, priority = 'auto') {
  const src = extractIllustrationSrc(illuOrSrc);
  if (!src) return Promise.resolve(null);

  // 1. Tier 1: Instant RAM Cache (<0.05ms)
  if (SynapseSvgCache.has(src)) {
    return Promise.resolve(SynapseSvgCache.get(src));
  }

  // 2. Inflight deduplication to avoid redundant network requests
  if (SynapseInflightFetches.has(src)) {
    return SynapseInflightFetches.get(src);
  }

  const p = (async () => {
    try {
      // 3. Tier 2: Persistent CacheStorage check
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const illuCache = await caches.open(SYNAPSE_ILLU_CACHE_NAME);
          const cachedRes = await illuCache.match(src);
          if (cachedRes) {
            const cachedText = await cachedRes.text();
            if (cachedText && cachedText.includes('<svg')) {
              SynapseSvgCache.set(src, cachedText);
              return cachedText;
            }
          }
        } catch (_) {}
      }

      // 4. Tier 3: Fetch directly over network
      const isSvg = src.endsWith('.svg') || src.includes('.svg');
      const fetchOpts = { cache: 'force-cache' };
      if (priority === 'high' && 'priority' in Request.prototype) {
        fetchOpts.priority = 'high';
      }

      if (isSvg) {
        const res = await fetch(src, fetchOpts);
        if (res.ok) {
          const text = await res.text();
          if (text && text.includes('<svg')) {
            SynapseSvgCache.set(src, text);

            // Persist into CacheStorage in background
            if (typeof window !== 'undefined' && 'caches' in window) {
              caches.open(SYNAPSE_ILLU_CACHE_NAME).then(c => {
                c.put(src, new Response(text, {
                  headers: { 'Content-Type': 'image/svg+xml' }
                })).catch(() => {});
              }).catch(() => {});
            }
            return text;
          }
        }
      } else {
        // Non-SVG: Warm up browser image decoder
        const img = new Image();
        img.src = src;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      SynapseInflightFetches.delete(src);
    }
  })();

  SynapseInflightFetches.set(src, p);
  return p;
}

/**
 * Preload illustration for a single word with optional priority.
 */
function preloadSingleWordIllustration(word, priority = 'auto') {
  if (!word) return Promise.resolve(null);
  const illu = getWordIllustration(word);
  if (illu && illu.src) {
    return preloadIllustration(illu.src, priority);
  }
  return Promise.resolve(null);
}

/**
 * Batch preload illustrations for an array of words.
 */
function preloadWordsIllustrations(words, maxCount = 50) {
  if (!Array.isArray(words) || words.length === 0) return;
  const count = Math.min(words.length, maxCount);
  for (let i = 0; i < count; i++) {
    const w = words[i];
    if (w) preloadSingleWordIllustration(w, i < 5 ? 'high' : 'auto');
  }
}

/**
 * Predictive Sliding-Window Preloader for study mode:
 * Preloads the next 15 cards ahead and the previous 5 cards in background.
 */
function preloadNearbyIllustrations(wordList, activeFilteredOrder, currentIdx, lookahead = 15) {
  if (!Array.isArray(wordList) || !Array.isArray(activeFilteredOrder) || activeFilteredOrder.length === 0) return;
  const len = activeFilteredOrder.length;

  // Next cards: Top 5 with high priority, rest with auto priority
  for (let offset = 1; offset <= lookahead; offset++) {
    const nextIdx = (currentIdx + offset) % len;
    const w = wordList[activeFilteredOrder[nextIdx]];
    if (w) {
      preloadSingleWordIllustration(w, offset <= 5 ? 'high' : 'auto');
    }
  }

  // Previous 5 cards with high priority
  for (let offset = 1; offset <= 5; offset++) {
    const prevIdx = (currentIdx - offset + len) % len;
    const w = wordList[activeFilteredOrder[prevIdx]];
    if (w) {
      preloadSingleWordIllustration(w, 'high');
    }
  }
}

let activeDeckPreloadTimer = null;

/**
 * Progressive Deck Acceleration Engine:
 * 1. Immediate VIP Wave: Starting card + next 12 cards + previous 4 cards (High Priority).
 * 2. Sliding Horizon Wave: Next 25 cards (Auto Priority).
 * 3. Deck-Wide Stream: Concurrent non-blocking micro-batches via requestIdleCallback/setTimeout
 *    progressively caching 100% of the active level's illustrations into RAM.
 */
function preloadDeckIllustrations(wordList, startIdx = 0, filteredOrder = null) {
  if (!Array.isArray(wordList) || wordList.length === 0) return;
  if (activeDeckPreloadTimer) {
    clearTimeout(activeDeckPreloadTimer);
    activeDeckPreloadTimer = null;
  }

  const order = Array.isArray(filteredOrder) && filteredOrder.length > 0
    ? filteredOrder
    : Array.from({ length: wordList.length }, (_, i) => i);
  const len = order.length;
  const safeStart = ((startIdx % len) + len) % len;

  // 1. VIP Wave (Highest priority)
  const currentWord = wordList[order[safeStart]];
  if (currentWord) preloadSingleWordIllustration(currentWord, 'high');

  for (let offset = 1; offset <= 12; offset++) {
    const idx = (safeStart + offset) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'high');
  }

  for (let offset = 1; offset <= 4; offset++) {
    const idx = (safeStart - offset + len) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'high');
  }

  // 2. Horizon Wave (Next 25 cards)
  for (let offset = 13; offset <= 35; offset++) {
    const idx = (safeStart + offset) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'auto');
  }

  // 3. Progressive Background Deck Stream (all remaining cards)
  const pendingIndices = [];
  for (let i = 0; i < len; i++) {
    const circularOffset = (safeStart + i) % len;
    if (circularOffset > 35 && circularOffset < (len - 4)) {
      pendingIndices.push(order[circularOffset]);
    }
  }

  const BATCH_SIZE = 6;
  function processQueue() {
    if (pendingIndices.length === 0) return;
    const chunk = pendingIndices.splice(0, BATCH_SIZE);
    chunk.forEach(wIdx => {
      const w = wordList[wIdx];
      if (w) preloadSingleWordIllustration(w, 'auto');
    });

    if (pendingIndices.length > 0) {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(processQueue, { timeout: 1500 });
      } else {
        activeDeckPreloadTimer = setTimeout(processQueue, 35);
      }
    }
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(processQueue, { timeout: 1200 });
  } else {
    activeDeckPreloadTimer = setTimeout(processQueue, 50);
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.POS_TYPES = POS_TYPES;
  window.HSK_POS_DB = HSK_POS_DB;
  window.getWordPartOfSpeech = getWordPartOfSpeech;
  window.WORD_ILLUSTRATIONS_DB = WORD_ILLUSTRATIONS_DB;
  window.STATIC_ILLUSTRATIONS_INDEX = STATIC_ILLUSTRATIONS_INDEX;
  window.getWordIllustration = getWordIllustration;
  window.buildContextualPrompt = buildContextualPrompt;
  window.SynapseSvgCache = SynapseSvgCache;
  window.preloadIllustration = preloadIllustration;
  window.preloadSingleWordIllustration = preloadSingleWordIllustration;
  window.preloadWordsIllustrations = preloadWordsIllustrations;
  window.preloadNearbyIllustrations = preloadNearbyIllustrations;
  window.preloadDeckIllustrations = preloadDeckIllustrations;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    POS_TYPES,
    HSK_POS_DB,
    getWordPartOfSpeech,
    WORD_ILLUSTRATIONS_DB,
    STATIC_ILLUSTRATIONS_INDEX,
    getWordIllustration,
    buildContextualPrompt,
    generateAestheticFallback,
    SynapseSvgCache,
    preloadIllustration,
    preloadSingleWordIllustration,
    preloadWordsIllustrations,
    preloadNearbyIllustrations,
    preloadDeckIllustrations
  };
}
