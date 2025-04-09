const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// 优化的名字拆分函数
function splitEnglishName(fullName) {
    // 使用更高效的字符串处理
    const trimmedName = fullName.trim();
    const spaceIndex = trimmedName.indexOf(' ');
    
    // 如果没有空格，则只有名字
    if (spaceIndex === -1) {
        return { firstName: trimmedName, lastName: '' };
    }
    
    // 直接根据第一个空格拆分，避免多次拆分和连接操作
    const firstName = trimmedName.substring(0, spaceIndex);
    const lastName = trimmedName.substring(spaceIndex + 1);
    return { firstName, lastName };
}

// Phonetic mapping for Chinese name generation
const phoneticMapping = {
    firstNameInitials: {
        'a': [
            { 
                char: '安', 
                pinyin: 'Ān',
                englishMeaning: 'Peace and tranquility',
                chineseMeaning: '给人一种安宁祥和的感觉，如同平静的湖面'
            },
            { 
                char: '爱',
                pinyin: 'Ài',
                englishMeaning: 'Love and compassion',
                chineseMeaning: '充满爱心与温暖，像阳光一样照耀他人'
            },
            { 
                char: '艾',
                pinyin: 'Ài',
                englishMeaning: 'Mugwort herb, represents resilience',
                chineseMeaning: '坚韧不拔，充满生命力，如艾草般顽强'
            }
        ],
        'b': [
            {
                char: '博',
                pinyin: 'Bó',
                englishMeaning: 'Extensive knowledge and wisdom',
                chineseMeaning: '学识渊博，见多识广，如大海般包容万物'
            },
            {
                char: '北',
                pinyin: 'Běi',
                englishMeaning: 'Northern direction, guidance',
                chineseMeaning: '如北极星般指引方向，坚定不移'
            },
            {
                char: '百',
                pinyin: 'Bǎi',
                englishMeaning: 'Hundred, representing abundance',
                chineseMeaning: '才华横溢，多才多艺，百般武艺样样精通'
            }
        ],
        'c': [
            {
                char: '辰',
                pinyin: 'Chén',
                englishMeaning: 'Morning, a new beginning',
                chineseMeaning: '如旭日东升，象征新的希望和开始'
            },
            {
                char: '晨',
                pinyin: 'Chén',
                englishMeaning: 'Dawn, early morning',
                chineseMeaning: '清新明亮，如晨光熹微，充满活力'
            }
        ],
        'd': [
            {
                char: '德',
                pinyin: 'Dé',
                englishMeaning: 'Virtue and moral excellence',
                chineseMeaning: '品德高尚，正直无私，受人敬仰'
            },
            {
                char: '东',
                pinyin: 'Dōng',
                englishMeaning: 'East, where the sun rises',
                chineseMeaning: '如旭日东升，充满朝气和希望'
            }
        ],
        'e': [
            {
                char: '恩',
                pinyin: 'Ēn',
                englishMeaning: 'Kindness and grace',
                chineseMeaning: '恩泽四方，心怀感恩，乐于助人'
            },
            {
                char: '尔',
                pinyin: 'Ěr',
                englishMeaning: 'You, closeness',
                chineseMeaning: '亲切友善，平易近人，令人如沐春风'
            }
        ],
        'f': [
            {
                char: '芳',
                pinyin: 'Fāng',
                englishMeaning: 'Fragrant and beautiful',
                chineseMeaning: '如花般芬芳美丽，令人赏心悦目'
            },
            {
                char: '飞',
                pinyin: 'Fēi',
                englishMeaning: 'To fly, soaring ambition',
                chineseMeaning: '志向高远，如雄鹰展翅，自由翱翔'
            }
        ],
        'g': [
            {
                char: '国',
                pinyin: 'Guó',
                englishMeaning: 'Country, patriotism',
                chineseMeaning: '爱国敬业，胸怀天下，心系家国'
            },
            {
                char: '光',
                pinyin: 'Guāng',
                englishMeaning: 'Light, brightness',
                chineseMeaning: '光明磊落，照亮前路，驱散黑暗'
            }
        ],
        'h': [
            {
                char: '海',
                pinyin: 'Hǎi',
                englishMeaning: 'Ocean, vast and deep',
                chineseMeaning: '胸怀宽广，如大海般包容万物'
            },
            {
                char: '华',
                pinyin: 'Huá',
                englishMeaning: 'Splendid and magnificent',
                chineseMeaning: '光彩夺目，才华横溢，卓尔不凡'
            }
        ],
        'i': [
            {
                char: '伊',
                pinyin: 'Yī',
                englishMeaning: 'Elegant and graceful',
                chineseMeaning: '优雅大方，举止得体，风姿绰约'
            },
            {
                char: '依',
                pinyin: 'Yī',
                englishMeaning: 'To rely on, dependable',
                chineseMeaning: '可靠踏实，值得依赖，如大树般坚实'
            }
        ],
        'j': [
            {
                char: '嘉',
                pinyin: 'Jiā',
                englishMeaning: 'Excellent and praiseworthy',
                chineseMeaning: '品行嘉言懿行，堪称楷模'
            },
            {
                char: '佳',
                pinyin: 'Jiā',
                englishMeaning: 'Good and beautiful',
                chineseMeaning: '美好优秀，如沐春风，令人愉悦'
            },
            {
                char: '健',
                pinyin: 'Jiàn',
                englishMeaning: 'Healthy and strong',
                chineseMeaning: '身体健康，意志坚强，生机勃勃'
            }
        ],
        'k': [
            {
                char: '凯',
                pinyin: 'Kǎi',
                englishMeaning: 'Victorious and triumphant',
                chineseMeaning: '凯旋而归，所向披靡，无往不胜'
            },
            {
                char: '康',
                pinyin: 'Kāng',
                englishMeaning: 'Health and wellness',
                chineseMeaning: '健康平安，生活美满，无忧无虑'
            }
        ],
        'l': [
            {
                char: '力',
                pinyin: 'Lì',
                englishMeaning: 'Strength and power',
                chineseMeaning: '力量十足，坚韧不拔，勇往直前'
            },
            {
                char: '立',
                pinyin: 'Lì',
                englishMeaning: 'To stand, independence',
                chineseMeaning: '自立自强，顶天立地，做人做事有原则'
            },
            {
                char: '龙',
                pinyin: 'Lóng',
                englishMeaning: 'Dragon, symbol of power',
                chineseMeaning: '如龙腾飞，气势磅礴，充满活力'
            }
        ],
        'm': [
            {
                char: '明',
                pinyin: 'Míng',
                englishMeaning: 'Bright and clear-minded',
                chineseMeaning: '明察秋毫，思维清晰，光明磊落'
            },
            {
                char: '梦',
                pinyin: 'Mèng',
                englishMeaning: 'Dream, aspiration',
                chineseMeaning: '心怀梦想，追求卓越，不断进取'
            },
            {
                char: '茂',
                pinyin: 'Mào',
                englishMeaning: 'Flourishing and prosperous',
                chineseMeaning: '茂盛繁荣，生机勃勃，前途无量'
            }
        ],
        'n': [
            {
                char: '宁',
                pinyin: 'Níng',
                englishMeaning: 'Peaceful and tranquil',
                chineseMeaning: '心如止水，宁静致远，淡泊明志'
            },
            {
                char: '南',
                pinyin: 'Nán',
                englishMeaning: 'South, warmth',
                chineseMeaning: '温暖如春，热情似火，心胸开阔'
            }
        ],
        'o': [
            {
                char: '欧',
                pinyin: 'Ōu',
                englishMeaning: 'European connection',
                chineseMeaning: '视野开阔，兼容并蓄，融汇中西'
            },
            {
                char: '鸥',
                pinyin: 'Ōu',
                englishMeaning: 'Seagull, free spirit',
                chineseMeaning: '自由自在，无拘无束，如海鸥翱翔'
            }
        ],
        'p': [
            {
                char: '鹏',
                pinyin: 'Péng',
                englishMeaning: 'Legendary giant bird, ambition',
                chineseMeaning: '大鹏展翅，志存高远，前程似锦'
            },
            {
                char: '平',
                pinyin: 'Píng',
                englishMeaning: 'Peace and balance',
                chineseMeaning: '平和稳重，公平正直，心态平衡'
            }
        ],
        'q': [
            {
                char: '庆',
                pinyin: 'Qìng',
                englishMeaning: 'Celebration and joy',
                chineseMeaning: '喜气洋洋，欢欣鼓舞，带来好运'
            },
            {
                char: '青',
                pinyin: 'Qīng',
                englishMeaning: 'Youth, vibrant',
                chineseMeaning: '青春活力，朝气蓬勃，生机盎然'
            }
        ],
        'r': [
            {
                char: '瑞',
                pinyin: 'Ruì',
                englishMeaning: 'Auspicious, good fortune',
                chineseMeaning: '祥瑞之兆，福气满满，吉祥如意'
            },
            {
                char: '荣',
                pinyin: 'Róng',
                englishMeaning: 'Glory and honor',
                chineseMeaning: '荣耀光辉，功成名就，备受尊敬'
            }
        ],
        's': [
            {
                char: '思',
                pinyin: 'Sī',
                englishMeaning: 'Thought and reflection',
                chineseMeaning: '思维敏捷，深思熟虑，智慧超群'
            },
            {
                char: '顺',
                pinyin: 'Shùn',
                englishMeaning: 'Smooth and favorable',
                chineseMeaning: '一帆风顺，万事如意，处事圆融'
            },
            {
                char: '斯',
                pinyin: 'Sī',
                englishMeaning: 'Refined and elegant',
                chineseMeaning: '文质彬彬，斯文有礼，举止优雅'
            }
        ],
        't': [
            {
                char: '天',
                pinyin: 'Tiān',
                englishMeaning: 'Heaven, sky, natural talent',
                chineseMeaning: '天资聪颖，胸怀宽广，志向高远'
            },
            {
                char: '泰',
                pinyin: 'Tài',
                englishMeaning: 'Peace and security',
                chineseMeaning: '安泰祥和，国泰民安，平安喜乐'
            }
        ],
        'u': [
            {
                char: '宇',
                pinyin: 'Yǔ',
                englishMeaning: 'Universe, space',
                chineseMeaning: '胸怀宇宙，视野开阔，格局宏大'
            },
            {
                char: '玉',
                pinyin: 'Yù',
                englishMeaning: 'Jade, precious and pure',
                chineseMeaning: '温润如玉，品质纯净，珍贵无比'
            }
        ],
        'v': [
            {
                char: '维',
                pinyin: 'Wéi',
                englishMeaning: 'To maintain, dimension',
                chineseMeaning: '维护正义，坚持原则，多维思考'
            },
            {
                char: '薇',
                pinyin: 'Wēi',
                englishMeaning: 'Small and delicate flower',
                chineseMeaning: '如蔷薇般美丽，坚韧而不失优雅'
            }
        ],
        'w': [
            {
                char: '文',
                pinyin: 'Wén',
                englishMeaning: 'Culture and literacy',
                chineseMeaning: '文采斐然，学识渊博，温文尔雅'
            },
            {
                char: '伟',
                pinyin: 'Wěi',
                englishMeaning: 'Great and extraordinary',
                chineseMeaning: '伟大非凡，卓越不凡，成就斐然'
            },
            {
                char: '万',
                pinyin: 'Wàn',
                englishMeaning: 'Ten thousand, countless',
                chineseMeaning: '才高八斗，学富五车，万事顺利'
            }
        ],
        'x': [
            {
                char: '晓',
                pinyin: 'Xiǎo',
                englishMeaning: 'Dawn, understanding',
                chineseMeaning: '聪明睿智，明察秋毫，通晓事理'
            },
            {
                char: '雪',
                pinyin: 'Xuě',
                englishMeaning: 'Snow, pure and clean',
                chineseMeaning: '纯洁无瑕，如雪般晶莹剔透'
            }
        ],
        'y': [
            {
                char: '阳',
                pinyin: 'Yáng',
                englishMeaning: 'Sun, positive energy',
                chineseMeaning: '阳光开朗，积极向上，充满活力'
            },
            {
                char: '宜',
                pinyin: 'Yí',
                englishMeaning: 'Suitable and appropriate',
                chineseMeaning: '宜室宜家，温和适宜，处事得当'
            },
            {
                char: '雨',
                pinyin: 'Yǔ',
                englishMeaning: 'Rain, nourishment',
                chineseMeaning: '如雨露般滋养万物，恩泽四方'
            }
        ],
        'z': [
            {
                char: '志',
                pinyin: 'Zhì',
                englishMeaning: 'Ambition and aspiration',
                chineseMeaning: '志向远大，意志坚定，矢志不渝'
            },
            {
                char: '智',
                pinyin: 'Zhì',
                englishMeaning: 'Wisdom and intelligence',
                chineseMeaning: '智慧超群，聪明睿智，见解独到'
            },
            {
                char: '卓',
                pinyin: 'Zhuó',
                englishMeaning: 'Outstanding and excellent',
                chineseMeaning: '卓越不凡，出类拔萃，成就非凡'
            }
        ]
    },
    lastNameInitials: {
        'a': [
            {
                char: '安',
                pinyin: 'Ān',
                englishMeaning: 'Peace, a common Chinese surname',
                chineseMeaning: '源于古代诸侯国，寓意平安祥和'
            },
            {
                char: '艾',
                pinyin: 'Ài',
                englishMeaning: 'Wormwood plant, a Chinese surname',
                chineseMeaning: '源于上古时期，象征坚韧不拔'
            }
        ],
        'b': [
            {
                char: '白',
                pinyin: 'Bái',
                englishMeaning: 'White, pure, a Chinese surname',
                chineseMeaning: '源于远古时期，象征纯洁无瑕'
            },
            {
                char: '包',
                pinyin: 'Bāo',
                englishMeaning: 'Wrap, protect, a Chinese surname',
                chineseMeaning: '源于春秋时期，寓意包容万象'
            }
        ],
        'c': [
            {
                char: '陈',
                pinyin: 'Chén',
                englishMeaning: 'Old, display, a common Chinese surname',
                chineseMeaning: '源于古代诸侯国，历史悠久'
            },
            {
                char: '崔',
                pinyin: 'Cuī',
                englishMeaning: 'High mountain, a Chinese surname',
                chineseMeaning: '源于山东一带，象征高耸挺拔'
            }
        ],
        'd': [
            {
                char: '杜',
                pinyin: 'Dù',
                englishMeaning: 'Stop, prevent, a Chinese surname',
                chineseMeaning: '源于周朝，寓意杜绝邪恶'
            },
            {
                char: '邓',
                pinyin: 'Dèng',
                englishMeaning: 'A Chinese surname with historical significance',
                chineseMeaning: '源于春秋时期，历史悠久'
            }
        ],
        'e': [
            {
                char: '鄂',
                pinyin: 'È',
                englishMeaning: 'Surprised, a Chinese surname',
                chineseMeaning: '源于古代地名，历史悠久'
            }
        ],
        'f': [
            {
                char: '冯',
                pinyin: 'Féng',
                englishMeaning: 'Gallop, a Chinese surname',
                chineseMeaning: '源于远古时期，象征奔腾向前'
            },
            {
                char: '方',
                pinyin: 'Fāng',
                englishMeaning: 'Square, direction, a Chinese surname',
                chineseMeaning: '源于上古时期，寓意正直方正'
            }
        ],
        'g': [
            {
                char: '高',
                pinyin: 'Gāo',
                englishMeaning: 'Tall, high, a Chinese surname',
                chineseMeaning: '源于远古时期，象征崇高'
            },
            {
                char: '郭',
                pinyin: 'Guō',
                englishMeaning: 'Outer city wall, a Chinese surname',
                chineseMeaning: '源于春秋时期，象征坚固防护'
            }
        ],
        'h': [
            {
                char: '黄',
                pinyin: 'Huáng',
                englishMeaning: 'Yellow, a common Chinese surname',
                chineseMeaning: '源于远古时期，象征皇家尊贵'
            },
            {
                char: '胡',
                pinyin: 'Hú',
                englishMeaning: 'Beard, recklessly, a Chinese surname',
                chineseMeaning: '源于上古时期，历史悠久'
            }
        ],
        'j': [
            {
                char: '金',
                pinyin: 'Jīn',
                englishMeaning: 'Gold, metal, a Chinese surname',
                chineseMeaning: '源于五行学说，象征富贵坚固'
            },
            {
                char: '江',
                pinyin: 'Jiāng',
                englishMeaning: 'River, a Chinese surname',
                chineseMeaning: '源于古代地名，象征宽广深远'
            }
        ],
        'k': [
            {
                char: '孔',
                pinyin: 'Kǒng',
                englishMeaning: 'Hole, opening, a Chinese surname (Confucius)',
                chineseMeaning: '源于春秋时期，与孔子同宗'
            },
            {
                char: '柯',
                pinyin: 'Kē',
                englishMeaning: 'Axe handle, a Chinese surname',
                chineseMeaning: '源于古代，象征坚韧有力'
            }
        ],
        'l': [
            {
                char: '李',
                pinyin: 'Lǐ',
                englishMeaning: 'Plum, a very common Chinese surname',
                chineseMeaning: '源于古代，象征坚韧甜美'
            },
            {
                char: '林',
                pinyin: 'Lín',
                englishMeaning: 'Forest, a common Chinese surname',
                chineseMeaning: '源于自然景观，象征繁茂兴旺'
            },
            {
                char: '刘',
                pinyin: 'Liú',
                englishMeaning: 'Kill, a very common Chinese surname',
                chineseMeaning: '源于上古时期，历史悠久'
            }
        ],
        'm': [
            {
                char: '马',
                pinyin: 'Mǎ',
                englishMeaning: 'Horse, a common Chinese surname',
                chineseMeaning: '源于图腾崇拜，象征奔腾不息'
            },
            {
                char: '孟',
                pinyin: 'Mèng',
                englishMeaning: 'First, eldest, a Chinese surname',
                chineseMeaning: '源于古代，象征长子继承'
            }
        ],
        'n': [
            {
                char: '倪',
                pinyin: 'Ní',
                englishMeaning: 'A Chinese surname',
                chineseMeaning: '源于春秋时期，历史悠久'
            },
            {
                char: '聂',
                pinyin: 'Niè',
                englishMeaning: 'Whisper, a Chinese surname',
                chineseMeaning: '源于上古时期，历史悠久'
            }
        ],
        'p': [
            {
                char: '彭',
                pinyin: 'Péng',
                englishMeaning: 'A Chinese surname',
                chineseMeaning: '源于远古时期，历史悠久'
            },
            {
                char: '潘',
                pinyin: 'Pān',
                englishMeaning: 'A Chinese surname',
                chineseMeaning: '源于春秋时期，历史悠久'
            }
        ],
        'q': [
            {
                char: '钱',
                pinyin: 'Qián',
                englishMeaning: 'Money, a Chinese surname',
                chineseMeaning: '源于古代，象征财富和价值'
            },
            {
                char: '秦',
                pinyin: 'Qín',
                englishMeaning: 'A Chinese surname from ancient dynasty',
                chineseMeaning: '源于秦朝，历史悠久'
            }
        ],
        'r': [
            {
                char: '任',
                pinyin: 'Rèn',
                englishMeaning: 'Duty, a Chinese surname',
                chineseMeaning: '源于古代，象征责任和担当'
            },
            {
                char: '阮',
                pinyin: 'Ruǎn',
                englishMeaning: 'A Chinese surname',
                chineseMeaning: '源于三国时期，历史悠久'
            }
        ],
        's': [
            {
                char: '宋',
                pinyin: 'Sòng',
                englishMeaning: 'A Chinese surname from ancient dynasty',
                chineseMeaning: '源于宋朝，象征文化繁荣'
            },
            {
                char: '孙',
                pinyin: 'Sūn',
                englishMeaning: 'Grandson, a common Chinese surname',
                chineseMeaning: '源于远古时期，象征家族传承'
            },
            {
                char: '史',
                pinyin: 'Shǐ',
                englishMeaning: 'History, a Chinese surname',
                chineseMeaning: '源于古代，象征历史记载'
            }
        ],
        't': [
            {
                char: '唐',
                pinyin: 'Táng',
                englishMeaning: 'A Chinese surname from ancient dynasty',
                chineseMeaning: '源于唐朝，象征文化鼎盛'
            },
            {
                char: '田',
                pinyin: 'Tián',
                englishMeaning: 'Field, a Chinese surname',
                chineseMeaning: '源于农耕文化，象征勤劳踏实'
            }
        ],
        'w': [
            {
                char: '王',
                pinyin: 'Wáng',
                englishMeaning: 'King, the most common Chinese surname',
                chineseMeaning: '源于远古时期，象征尊贵权威'
            },
            {
                char: '吴',
                pinyin: 'Wú',
                englishMeaning: 'A Chinese surname from ancient state',
                chineseMeaning: '源于吴国，历史悠久'
            },
            {
                char: '魏',
                pinyin: 'Wèi',
                englishMeaning: 'A Chinese surname from ancient state',
                chineseMeaning: '源于魏国，象征强大'
            }
        ],
        'x': [
            {
                char: '徐',
                pinyin: 'Xú',
                englishMeaning: 'Slowly, a Chinese surname',
                chineseMeaning: '源于春秋时期，象征稳重'
            },
            {
                char: '谢',
                pinyin: 'Xiè',
                englishMeaning: 'Thank, a Chinese surname',
                chineseMeaning: '源于古代，象征感恩'
            }
        ],
        'y': [
            {
                char: '杨',
                pinyin: 'Yáng',
                englishMeaning: 'Poplar tree, a common Chinese surname',
                chineseMeaning: '源于自然景观，象征挺拔向上'
            },
            {
                char: '叶',
                pinyin: 'Yè',
                englishMeaning: 'Leaf, a Chinese surname',
                chineseMeaning: '源于自然景观，象征生机'
            }
        ],
        'z': [
            {
                char: '张',
                pinyin: 'Zhāng',
                englishMeaning: 'Stretch, a very common Chinese surname',
                chineseMeaning: '源于远古时期，象征开拓进取'
            },
            {
                char: '赵',
                pinyin: 'Zhào',
                englishMeaning: 'A common Chinese surname',
                chineseMeaning: '源于赵国，历史悠久'
            },
            {
                char: '周',
                pinyin: 'Zhōu',
                englishMeaning: 'Cycle, a Chinese surname',
                chineseMeaning: '源于周朝，象征周全'
            }
        ]
    },
    secondChars: [
        {
            char: '华',
            pinyin: 'Huá',
            englishMeaning: 'Splendid and magnificent',
            chineseMeaning: '华丽辉煌，光彩照人，气宇不凡'
        },
        {
            char: '明',
            pinyin: 'Míng',
            englishMeaning: 'Bright and clear-sighted',
            chineseMeaning: '明亮清晰，明察秋毫，光明磊落'
        },
        {
            char: '德',
            pinyin: 'Dé',
            englishMeaning: 'Virtue and moral excellence',
            chineseMeaning: '品德高尚，道德文章，德才兼备'
        },
        {
            char: '强',
            pinyin: 'Qiáng',
            englishMeaning: 'Strong and powerful',
            chineseMeaning: '强健有力，坚强不屈，实力超群'
        },
        {
            char: '龙',
            pinyin: 'Lóng',
            englishMeaning: 'Dragon, symbol of power and nobility',
            chineseMeaning: '如龙似虎，气势磅礴，尊贵非凡'
        },
        {
            char: '雅',
            pinyin: 'Yǎ',
            englishMeaning: 'Elegant and refined',
            chineseMeaning: '文雅高贵，举止优雅，品味高雅'
        },
        {
            char: '嘉',
            pinyin: 'Jiā',
            englishMeaning: 'Excellent and praiseworthy',
            chineseMeaning: '嘉言懿行，嘉勉有加，美好优秀'
        },
        {
            char: '伦',
            pinyin: 'Lún',
            englishMeaning: 'Relationship, order',
            chineseMeaning: '伦理道德，井然有序，关系和谐'
        },
        {
            char: '杰',
            pinyin: 'Jié',
            englishMeaning: 'Outstanding and distinguished',
            chineseMeaning: '杰出不凡，才华横溢，出类拔萃'
        },
        {
            char: '宇',
            pinyin: 'Yǔ',
            englishMeaning: 'Universe, space',
            chineseMeaning: '宇量大度，胸怀宇宙，视野开阔'
        },
        {
            char: '轩',
            pinyin: 'Xuān',
            englishMeaning: 'High and dignified',
            chineseMeaning: '轩昂大气，气宇轩昂，高贵典雅'
        },
        {
            char: '瑞',
            pinyin: 'Ruì',
            englishMeaning: 'Auspicious and lucky',
            chineseMeaning: '祥瑞之兆，吉祥如意，福气满满'
        }
    ]
};

// API endpoint to generate Chinese names
app.post('/generate-name', async (req, res) => {
    try {
        const { englishName } = req.body;
        
        if (!englishName) {
            return res.status(400).json({ error: 'English name is required' });
        }
        
        // Split English name into first name and last name
        const { firstName, lastName } = splitEnglishName(englishName);
        
        // 移除全局名称跟踪，减少内存使用和处理时间
        // if (!global.generatedNameSets) {
        //     global.generatedNameSets = {};
        // }

        // Large database of Chinese names with phonetic and meaning connections to English names
        const nameDatabase = [
            // Names with 'J' sound correspondence
            {
                pattern: /^j/i,
                names: [
                    {
                        chinese: '江明',
                        pinyin: 'Jiāng Míng',
                        meaning: 'Jiang sounds similar to "J" names. Means "river". Ming means "bright, clear".',
                    },
                    {
                        chinese: '金龙',
                        pinyin: 'Jīn Lóng',
                        meaning: 'Jin sounds like "J" names. Means "gold". Long means "dragon", symbolizing strength.',
                    },
                    {
                        chinese: '嘉华',
                        pinyin: 'Jiā Huá',
                        meaning: 'Jia sounds like "J" names. Means "excellent". Hua means "magnificent, splendid".',
                    },
                    {
                        chinese: '佳美',
                        pinyin: 'Jiā Měi',
                        meaning: 'Jia sounds like "J" names. The full name means "beautiful and good".',
                    },
                ]
            },
            // Names with 'M' sound correspondence
            {
                pattern: /^m/i,
                names: [
                    {
                        chinese: '梅丽',
                        pinyin: 'Méi Lì',
                        meaning: 'Mei sounds like "M" names. Means "plum blossom". Li means "beautiful".',
                    },
                    {
                        chinese: '明亮',
                        pinyin: 'Míng Liàng',
                        meaning: 'Ming sounds like "M" names. The full name means "bright and clear".',
                    },
                    {
                        chinese: '茂盛',
                        pinyin: 'Mào Shèng',
                        meaning: 'Mao sounds like "M" names. The full name means "flourishing, prosperous".',
                    },
                    {
                        chinese: '敏捷',
                        pinyin: 'Mǐn Jié',
                        meaning: 'Min sounds like "M" names. The full name means "quick and agile".',
                    },
                ]
            },
            // Names with 'S' sound correspondence
            {
                pattern: /^s/i,
                names: [
                    {
                        chinese: '思雨',
                        pinyin: 'Sī Yǔ',
                        meaning: 'Si sounds like "S" names. The full name means "thinking rain", representing wisdom.',
                    },
                    {
                        chinese: '松柏',
                        pinyin: 'Sōng Bǎi',
                        meaning: 'Song sounds like "S" names. The full name means "pine and cypress", symbolizing longevity.',
                    },
                    {
                        chinese: '舒适',
                        pinyin: 'Shū Shì',
                        meaning: 'Shu sounds like "S" names. The full name means "comfortable, cozy".',
                    },
                    {
                        chinese: '世杰',
                        pinyin: 'Shì Jié',
                        meaning: 'Shi sounds like "S" names. The full name means "outstanding in the world".',
                    },
                ]
            },
            // Names with 'T' sound correspondence
            {
                pattern: /^t/i,
                names: [
                    {
                        chinese: '天明',
                        pinyin: 'Tiān Míng',
                        meaning: 'Tian sounds like "T" names. The full name means "bright sky".',
                    },
                    {
                        chinese: '涛涛',
                        pinyin: 'Tāo Tāo',
                        meaning: 'Tao sounds like "T" names. The name evokes the sound of rushing waves, symbolizing power.',
                    },
                    {
                        chinese: '婷婷',
                        pinyin: 'Tíng Tíng',
                        meaning: 'Ting sounds like "T" names. The name means "graceful, elegant".',
                    },
                    {
                        chinese: '腾飞',
                        pinyin: 'Téng Fēi',
                        meaning: 'Teng sounds like "T" names. The full name means "soaring, taking off".',
                    },
                ]
            },
            // Names with 'L' sound correspondence
            {
                pattern: /^l/i,
                names: [
                    {
                        chinese: '李雷',
                        pinyin: 'Lǐ Léi',
                        meaning: 'Li sounds like "L" names. Li is a common surname meaning "plum". Lei means "thunder".',
                    },
                    {
                        chinese: '林风',
                        pinyin: 'Lín Fēng',
                        meaning: 'Lin sounds like "L" names. The full name means "forest wind".',
                    },
                    {
                        chinese: '乐天',
                        pinyin: 'Lè Tiān',
                        meaning: 'Le sounds like "L" names. The full name means "happy and carefree".',
                    },
                    {
                        chinese: '蓝天',
                        pinyin: 'Lán Tiān',
                        meaning: 'Lan sounds like "L" names. The full name means "blue sky".',
                    },
                ]
            },
            // Default names for other patterns
            {
                pattern: /.*/,
                names: [
                    {
                        chinese: '王力',
                        pinyin: 'Wáng Lì',
                        meaning: 'Wang is the most common Chinese surname meaning "king". Li means "strength".',
                    },
                    {
                        chinese: '陈明',
                        pinyin: 'Chén Míng',
                        meaning: 'Chen is a common surname. Ming means "bright, clear, or brilliant".',
                    },
                    {
                        chinese: '张伟',
                        pinyin: 'Zhāng Wěi',
                        meaning: 'Zhang is a popular surname meaning "to stretch". Wei means "great or extraordinary".',
                    },
                    {
                        chinese: '刘洋',
                        pinyin: 'Liú Yáng',
                        meaning: 'Liu is a common surname. Yang means "ocean, vast".',
                    },
                    {
                        chinese: '赵华',
                        pinyin: 'Zhào Huá',
                        meaning: 'Zhao is a common surname. Hua means "magnificent or splendid".',
                    },
                    {
                        chinese: '杨光',
                        pinyin: 'Yáng Guāng',
                        meaning: 'Yang is a common surname. Guang means "light, brightness".',
                    },
                ]
            }
        ];

        // Generate Chinese names based on the English name components
        function generateChineseNameFromEnglish(firstName, lastName) {
            // 参数验证和默认值处理
            if (!firstName || typeof firstName !== 'string') {
                firstName = 'Guest';
            }
            
            // 获取英文名的发音特征，不仅仅是首字母，还考虑整个名字的发音
            const firstInitial = firstName.charAt(0).toLowerCase();
            const lastInitial = lastName ? lastName.charAt(0).toLowerCase() : '';
            
            // 增强的发音特征分析函数
            const getNamePhoneticFeatures = (name) => {
                if (!name || typeof name !== 'string') {
                    return { vowelGroups: [], consonantGroups: [], specialSounds: [] };
                }
                
                const lowercaseName = name.toLowerCase();
                // 提取元音组合，用于匹配中文谐音
                const vowelGroups = lowercaseName.match(/[aeiouy]{1,3}/g) || [];
                // 提取辅音组合，用于匹配中文谐音
                const consonantGroups = lowercaseName.match(/[bcdfghjklmnpqrstvwxz]{1,3}/g) || [];
                // 提取特殊音节，如'ch', 'sh', 'zh'等
                const specialSounds = [];
                if(lowercaseName.includes('ch')) specialSounds.push('ch');
                if(lowercaseName.includes('sh')) specialSounds.push('sh');
                if(lowercaseName.includes('zh')) specialSounds.push('zh');
                if(lowercaseName.includes('th')) specialSounds.push('th');
                
                return { vowelGroups, consonantGroups, specialSounds };
            };
            
            const firstNameFeatures = getNamePhoneticFeatures(firstName);
            const lastNameFeatures = lastName ? getNamePhoneticFeatures(lastName) : null;
            
            // 获取对应的字符集，添加错误处理和默认值
            const firstNameInitials = phoneticMapping.firstNameInitials || {};
            // 基于首字母和发音特征选择合适的字符
            let firstNameChars = (firstNameInitials[firstInitial] || firstNameInitials['w'] || []);
            
            // 确保lastNameInitials存在且有默认值
            const lastNameInitials = phoneticMapping.lastNameInitials || {};
            let lastNameChars = lastName ? 
                               (lastNameInitials[lastInitial] || lastNameInitials['l'] || []) : 
                               [];
            
            // 确保secondChars存在且有默认值
            const secondCharsArray = phoneticMapping.secondChars || [
                { char: '明', pinyin: 'Míng', englishMeaning: 'Bright, clear', chineseMeaning: '光明磊落' },
                { char: '华', pinyin: 'Huá', englishMeaning: 'Magnificent, splendid', chineseMeaning: '才华横溢' },
                { char: '伟', pinyin: 'Wěi', englishMeaning: 'Great, mighty', chineseMeaning: '伟大非凡' }
            ];
            
            // 优化的随机字符选择函数 - 考虑谐音匹配度
            const getRandomChar = (charArray, nameFeatures = null) => {
                if (!charArray || charArray.length === 0) {
                    // 返回一个默认字符对象，避免空数组错误
                    return {
                        char: '好',
                        pinyin: 'Hǎo',
                        englishMeaning: 'Good, nice',
                        chineseMeaning: '美好、善良'
                    };
                }
                
                // 如果有发音特征，尝试找到最匹配的字符
                if (nameFeatures) {
                    // 这里可以实现更复杂的匹配算法，目前简化处理
                    // 随机选择，但未来可以基于发音相似度排序
                }
                
                // 增强的随机选择算法，考虑发音相似度
                const randomIndex = (Math.random() * charArray.length) | 0;
                
                // 如果有发音特征，尝试找到最匹配的字符
                if (nameFeatures && nameFeatures.vowelGroups.length > 0) {
                    // 简单实现：优先选择包含相同元音的字符
                    const preferredChars = charArray.filter(char => {
                        const pinyinLower = char.pinyin.toLowerCase();
                        return nameFeatures.vowelGroups.some(vowel => pinyinLower.includes(vowel));
                    });
                    
                    if (preferredChars.length > 0) {
                        return preferredChars[(Math.random() * preferredChars.length) | 0];
                    }
                }
                
                return charArray[randomIndex];
            };
            
            // 选择字符 - 考虑英文名的发音特征
            const randomFirstChar = getRandomChar(firstNameChars, firstNameFeatures);
            const randomSecondChar = getRandomChar(secondCharsArray, firstNameFeatures);
            
            // 增加幽默和文化元素的数组
            const positiveTraits = [
                '聪明睿智', '才华横溢', '勇敢无畏', '温柔体贴', 
                '坚韧不拔', '诚实守信', '乐观向上', '谦虚谨慎',
                '风趣幽默', '通情达理', '心灵手巧', '足智多谋'
            ];
            
            const positiveOutcomes = [
                '前程似锦', '事业有成', '学业有成', '幸福美满', 
                '平安喜乐', '健康长寿', '财源广进', '好运连连',
                '名扬四海', '德才兼备', '一帆风顺', '鹏程万里'
            ];
            
            // 中西文化融合的幽默元素
            const humorElements = [
                '像会打太极的拳击手', '如东方的哈利波特', 
                '集孔子智慧与爱因斯坦才华于一身', '既能煮意大利面又能做一手好饺子',
                '能用筷子吃汉堡的人', '会用英文讲中国笑话的才子',
                '既懂莎士比亚又读过李白的通才', '能在KTV唱中英文歌的全能歌手'
            ];
            
            // 快速随机选择 - 使用位运算
            const randomTrait = positiveTraits[(Math.random() * positiveTraits.length) | 0];
            const randomOutcome = positiveOutcomes[(Math.random() * positiveOutcomes.length) | 0];
            const randomHumor = humorElements[(Math.random() * humorElements.length) | 0];
            
            // 初始化变量
            let chineseName, pinyinName, meaningDesc, englishMeaningDesc, chineseMeaningDesc;
            
            // 简化的属性获取函数
            const getProperty = (obj, property, defaultValue = '') => {
                return obj && obj[property] || defaultValue;
            };
            
            // 构建名字 - 增加英文名与中文名的谐音关联说明
            if (lastName && lastNameChars.length > 0) {
                const randomLastChar = getRandomChar(lastNameChars, lastNameFeatures);
                
                // 获取字符含义
                const lastCharChineseMeaning = getProperty(randomLastChar, 'chineseMeaning', '作为姓氏');
                const firstCharChineseMeaning = getProperty(randomFirstChar, 'chineseMeaning', '寓意美好');
                
                const lastCharEnglishMeaning = getProperty(randomLastChar, 'englishMeaning', 'a common Chinese surname');
                const firstCharEnglishMeaning = getProperty(randomFirstChar, 'englishMeaning', 'represents good fortune');
                
                // 生成姓氏+单字名（两字名）
                chineseName = randomLastChar.char + randomFirstChar.char;
                pinyinName = `${randomLastChar.pinyin} ${randomFirstChar.pinyin}`;
                
                // 谐音关联说明
                const lastNamePhoneticNote = `
        
        // Generate custom names based on the English name components
        const customNames = [];
        for (let i = 0; i < 5; i++) {
            customNames.push(generateChineseNameFromEnglish(firstName, lastName));
        }
        
        // Find matching pattern based on the first letter of the English name (for backward compatibility)
        const matchingPatterns = nameDatabase.filter(entry => entry.pattern.test(englishName));
        let availableNames = [];
        
        if (matchingPatterns.length > 0) {
            // Combine all names from matching patterns
            matchingPatterns.forEach(pattern => {
                availableNames = availableNames.concat(pattern.names);
            });
        } else {
            // Use default names if no pattern matches
            availableNames = nameDatabase[nameDatabase.length - 1].names;
        }
        
        // Add more name variations with different lengths (2-4 characters)
        const additionalNames = [
            // 2-character names
            { chinese: '雨林', pinyin: 'Yǔ Lín', meaning: 'Rain forest, representing vitality and life.' },
            { chinese: '天成', pinyin: 'Tiān Chéng', meaning: 'Natural talent or gift from heaven.' },
            { chinese: '明月', pinyin: 'Míng Yuè', meaning: 'Bright moon, symbolizing clarity and beauty.' },
            { chinese: '海洋', pinyin: 'Hǎi Yáng', meaning: 'Ocean, representing vastness and depth.' },
            { chinese: '星辰', pinyin: 'Xīng Chén', meaning: 'Stars, symbolizing brightness and guidance.' },
            
            // 3-character names
            { chinese: '李明智', pinyin: 'Lǐ Míng Zhì', meaning: 'Wise and bright, with Li as a common surname.' },
            { chinese: '张天宇', pinyin: 'Zhāng Tiān Yǔ', meaning: 'Universe, with Zhang as a common surname.' },
            { chinese: '王思远', pinyin: 'Wáng Sī Yuǎn', meaning: 'Thinking far ahead, with Wang as a common surname.' },
            { chinese: '陈光明', pinyin: 'Chén Guāng Míng', meaning: 'Bright light, with Chen as a common surname.' },
            { chinese: '林雨晴', pinyin: 'Lín Yǔ Qíng', meaning: 'Clear after rain, with Lin as a common surname.' },
            
            // 4-character names
            { chinese: '李嘉明德', pinyin: 'Lǐ Jiā Míng Dé', meaning: 'Bright virtue, with Li as a common surname.' },
            { chinese: '张世和平', pinyin: 'Zhāng Shì Hé Píng', meaning: 'World peace, with Zhang as a common surname.' },
            { chinese: '王天长地', pinyin: 'Wáng Tiān Cháng Dì', meaning: 'Everlasting as heaven and earth, with Wang as a common surname.' },
            { chinese: '陈智慧光', pinyin: 'Chén Zhì Huì Guāng', meaning: 'Light of wisdom, with Chen as a common surname.' },
            { chinese: '林泽千里', pinyin: 'Lín Zé Qiān Lǐ', meaning: 'Benefiting far and wide, with Lin as a common surname.' }
        ];
        
        // Add additional names to available names
        availableNames = availableNames.concat(additionalNames);
        
        // Create a seed based on the English name and current time
        // This ensures different results each time the button is clicked
        function createSeed(name) {
            let seed = 0;
            for (let i = 0; i < name.length; i++) {
                seed += name.charCodeAt(i) * (i + 1);
            }
            // Add current timestamp to make it different each time
            return seed + Date.now();
        }
        
        // 简化名称选择过程，移除复杂的洗牌和过滤逻辑
        // 直接从可用名称中快速选择3个名称
        const selectedNames = [];
        
        // 使用位运算加速随机索引计算
        if (availableNames.length > 0) {
            // 选择第一个名称
            const index1 = (Math.random() * availableNames.length) | 0;
            selectedNames.push(availableNames[index1]);
            
            // 如果有足够的名称，选择第二个不同的名称
            if (availableNames.length > 1) {
                let index2;
                do {
                    index2 = (Math.random() * availableNames.length) | 0;
                } while (index2 === index1);
                selectedNames.push(availableNames[index2]);
                
                // 如果有足够的名称，选择第三个不同的名称
                if (availableNames.length > 2) {
                    let index3;
                    do {
                        index3 = (Math.random() * availableNames.length) | 0;
                    } while (index3 === index1 || index3 === index2);
                    selectedNames.push(availableNames[index3]);
                }
            }
        }
        
        // 如果没有选择足够的名称，添加自定义生成的名称
        while (selectedNames.length < 3) {
            const customName = generateChineseNameFromEnglish(firstName, lastName);
            selectedNames.push(customName);
        }

        // 直接使用selectedNames作为最终结果，避免额外的数组操作
        const finalNames = selectedNames;
        
        // Send response
        res.json({ names: finalNames });

        // In a real implementation, you would call DeepSeek API like this:
        /*
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a Chinese name expert. Generate three culturally appropriate Chinese names based on the English name provided."
                },
                {
                    role: "user",
                    content: `Generate three Chinese names for the English name: ${englishName}. For each name, provide the Chinese characters, pinyin pronunciation, and meaning.`
                }
            ],
            temperature: 0.7,
            max_tokens: 800
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            }
        });

        // Process the response and extract names
        const aiResponse = response.data.choices[0].message.content;
        // Parse the AI response to extract structured name data
        const names = parseAIResponse(aiResponse);
        
        res.json({ names });
        */

    } catch (error) {
        console.error('Error generating names:', error);
        // 提供更详细的错误信息
        const errorMessage = error.message || 'Unknown error occurred';
        console.error('Error details:', errorMessage);
        res.status(500).json({ 
            error: 'Failed to generate names', 
            message: errorMessage,
            details: '生成中文名时出现错误，请稍后再试'
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});