const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Function to split English name into first name and last name
function splitEnglishName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    } else {
        const lastName = parts.pop();
        const firstName = parts.join(' ');
        return { firstName, lastName };
    }
}

// Phonetic mapping for Chinese name generation
const phoneticMapping = {
    firstNameInitials: {
        'a': [
            { 
                char: '安', 
                pinyin: 'Ān',
                englishMeaning: 'Peaceful, Quiet',
                chineseMeaning: '安静、平安'
            },
            { 
                char: '爱',
                pinyin: 'Ài',
                englishMeaning: 'Love, Affection',
                chineseMeaning: '爱心、关爱'
            },
            // 为所有字符添加英文翻译
        ],
        'b': [
            {
                char: '博',
                pinyin: 'Bó',
                englishMeaning: 'Erudite, Extensive',
                chineseMeaning: '博学、渊博'
            },
            // 更新其他字母的映射数据
        ],
        // 更新剩余字母的映射数据
    }
};

// 在生成名字时正确分配两个字段
const generatedNames = selectedChars.map(char => ({
    chinese: nameStructure,
    pinyin: pinyinStructure,
    englishMeaning: char.englishMeaning || 'No translation',
    chineseMeaning: char.chineseMeaning || '无含义'
}));

// API endpoint to generate Chinese names
app.post('/generate-name', async (req, res) => {
    try {
        const { englishName } = req.body;
        
        if (!englishName) {
            return res.status(400).json({ error: 'English name is required' });
        }
        
        // Split English name into first name and last name
        const { firstName, lastName } = splitEnglishName(englishName);
        
        // Track previously generated names to avoid duplicates
        if (!global.generatedNameSets) {
            global.generatedNameSets = {};
        }

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
            // Get first character of first name and last name for phonetic matching
            const firstInitial = firstName.charAt(0).toLowerCase();
            const lastInitial = lastName ? lastName.charAt(0).toLowerCase() : '';
            
            // Get phonetic matches for first name and last name
            const firstNameChars = phoneticMapping.firstNameInitials[firstInitial] || 
                                   phoneticMapping.firstNameInitials['w']; // Default to 'w' if no match
            
            const lastNameChars = lastName ? 
                                  (phoneticMapping.lastNameInitials[lastInitial] || 
                                   phoneticMapping.lastNameInitials['l']) : // Default to 'l' if no match
                                  [];
            
            // Randomly select characters for the name
            const randomFirstChar = firstNameChars[Math.floor(Math.random() * firstNameChars.length)];
            const randomSecondChar = phoneticMapping.secondChars[Math.floor(Math.random() * phoneticMapping.secondChars.length)];
            
            let chineseName = '';
            let pinyinName = '';
            let meaningDesc = '';
            
            // If we have a last name, use it as the surname
            if (lastName && lastNameChars.length > 0) {
                const randomLastChar = lastNameChars[Math.floor(Math.random() * lastNameChars.length)];
                chineseName = randomLastChar.char + randomFirstChar.char + randomSecondChar.char;
                pinyinName = `${randomLastChar.pinyin} ${randomFirstChar.pinyin} ${randomSecondChar.pinyin}`;
                meaningDesc = `"${randomLastChar.char}"${randomLastChar.meaning}，"${randomFirstChar.char}"${randomFirstChar.meaning}，"${randomSecondChar.char}"${randomSecondChar.meaning}。整体谐音"${lastName} ${firstName}"，寓意才华横溢、前程似锦。`;
            } else {
                // If no last name, create a two-character name
                chineseName = randomFirstChar.char + randomSecondChar.char;
                pinyinName = `${randomFirstChar.pinyin} ${randomSecondChar.pinyin}`;
                meaningDesc = `"${randomFirstChar.char}"${randomFirstChar.meaning}，"${randomSecondChar.char}"${randomSecondChar.meaning}。整体谐音"${firstName}"，寓意才华横溢、前程似锦。`;
            }
            
            // 分离英文含义和中文含义
            const englishMeaningDesc = `"${randomFirstChar.char}" means ${randomFirstChar.meaning.replace(/[，。]/g, ', ')}, "${randomSecondChar.char}" means ${randomSecondChar.meaning.replace(/[，。]/g, ', ')}. The name sounds similar to "${firstName}${lastName ? ' ' + lastName : ''}" and symbolizes talent and bright future.`;
            
            return {
                chinese: chineseName,
                pinyin: pinyinName,
                meaning: meaningDesc,
                englishMeaning: englishMeaningDesc,
                chineseMeaning: meaningDesc
            };
        }
        
        // Generate custom names based on the English name components
        const customNames = [];
        for (let i = 0; i < 3; i++) {
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
        
        // Shuffle based on the seed
        function shuffleArray(array, seed) {
            const shuffled = [...array];
            const random = (max) => {
                seed = (seed * 9301 + 49297) % 233280;
                return Math.floor((seed / 233280) * max);
            };
            
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = random(i + 1);
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        // Get a seed from the English name and current time
        const seed = createSeed(englishName);
        
        // Shuffle the names
        availableNames = shuffleArray(availableNames, seed);
        
        // Get previously generated names for this English name
        const previouslyGenerated = global.generatedNameSets[englishName] || [];
        
        // Filter out previously generated names
        const newAvailableNames = availableNames.filter(name => 
            !previouslyGenerated.some(prevName => prevName.chinese === name.chinese)
        );
        
        // If we've used all names, reset the history for this English name
        let namesToUse = newAvailableNames;
        if (newAvailableNames.length < 3) {
            // Reset history and use all names
            delete global.generatedNameSets[englishName];
            namesToUse = availableNames;
        }
        
        // Select 3 names with different lengths (try to get one of each length: 2, 3, and 4 characters)
        const selectedNames = [];
        const namesByLength = {
            2: namesToUse.filter(name => name.chinese.length === 2),
            3: namesToUse.filter(name => name.chinese.length === 3),
            4: namesToUse.filter(name => name.chinese.length === 4)
        };
        
        // Try to select one name of each length if available
        for (const length of [2, 3, 4]) {
            if (namesByLength[length].length > 0 && selectedNames.length < 3) {
                const randomIndex = Math.floor(Math.random() * namesByLength[length].length);
                selectedNames.push(namesByLength[length][randomIndex]);
                
                // Remove the selected name from namesToUse to avoid duplicates
                const index = namesToUse.findIndex(name => name.chinese === namesByLength[length][randomIndex].chinese);
                if (index !== -1) namesToUse.splice(index, 1);
            }
        }
        
        // If we still need more names, add random ones from the remaining available names
        while (selectedNames.length < 3 && namesToUse.length > 0) {
            const randomIndex = Math.floor(Math.random() * namesToUse.length);
            selectedNames.push(namesToUse[randomIndex]);
            namesToUse.splice(randomIndex, 1);
        }
        
        // Update the history of generated names for this English name
        if (!global.generatedNameSets[englishName]) {
            global.generatedNameSets[englishName] = [];
        }
        global.generatedNameSets[englishName] = [...global.generatedNameSets[englishName], ...selectedNames];

        // Combine custom names with selected names from database
        const combinedNames = [...customNames, ...selectedNames];
        
        // Select top 3 names to return
        const finalNames = combinedNames.slice(0, 3);
        
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
        res.status(500).json({ error: 'Failed to generate names' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});