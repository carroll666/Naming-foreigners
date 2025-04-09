document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const englishNameInput = document.getElementById('english-name');
    const loadingElement = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const nameCardsContainer = document.getElementById('name-cards');

    generateBtn.addEventListener('click', generateChineseNames);

    async function generateChineseNames() {
        const englishName = englishNameInput.value.trim();
        
        if (!englishName) {
            alert('Please enter your English name');
            return;
        }

        // Show loading spinner
        loadingElement.style.display = 'flex';
        resultsSection.style.display = 'none';
        nameCardsContainer.innerHTML = '';
        
        try {
            // 直接调用DeepSeek R1 API
            const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer bfa7609c-a5ec-4d2f-b28f-64b5b986a618'
                },
                body: JSON.stringify({
                    model: "deepseek-r1-250120",
                    messages: [
                        {
                            role: "system",
                            content: `你是一个专业的中文名字生成专家，擅长为外国人起有文化内涵的中文名。
                            请按照以下步骤为用户生成中文名：
                            1. 将输入的英文名拆分成姓和名
                            2. 为姓和名分别通过谐音组合成中文，并赋予中文含义
                            3. 将中文组合成中文姓名
                            4. 每个名字都应该有谐音和寓意的混合，体现中国文化，并有一定的幽默感
                            5. 生成的名字可以是两字或三字
                            6. 为每个名字提供拼音、英文含义解释和中文含义解释
                            
                            请生成3个不同的中文名字选项，每个选项包含：
                            - 中文名字
                            - 拼音
                            - 英文含义解释
                            - 中文含义解释
                            
                            返回格式必须是JSON格式，格式如下：
                            {
                              "names": [
                                {
                                  "chinese": "中文名1",
                                  "pinyin": "Zhōng Wén Míng",
                                  "englishMeaning": "English meaning explanation",
                                  "chineseMeaning": "中文含义解释"
                                },
                                {
                                  "chinese": "中文名2",
                                  "pinyin": "Zhōng Wén Míng",
                                  "englishMeaning": "English meaning explanation",
                                  "chineseMeaning": "中文含义解释"
                                },
                                {
                                  "chinese": "中文名3",
                                  "pinyin": "Zhōng Wén Míng",
                                  "englishMeaning": "English meaning explanation",
                                  "chineseMeaning": "中文含义解释"
                                }
                              ]
                            }`
                        },
                        {
                            role: "user",
                            content: `请为英文名"${englishName}"生成3个有趣且有文化内涵的中文名。`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                    timeout: 60
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            
            // 解析API返回的内容
            let names = [];
            try {
                // 尝试从AI回复中提取JSON
                const content = data.choices[0].message.content;
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                
                if (jsonMatch) {
                    const parsedData = JSON.parse(jsonMatch[0]);
                    names = parsedData.names;
                } else {
                    throw new Error('无法从API响应中提取JSON数据');
                }
            } catch (parseError) {
                console.error('解析API响应时出错:', parseError);
                throw new Error('无法解析API返回的数据，请重试');
            }
            
            displayResults(names);
        } catch (error) {
            console.error('Error:', error);
            alert(`生成中文名时出错: ${error.message}`);
        } finally {
            // Hide loading spinner
            loadingElement.style.display = 'none';
        }
    }

    function displayResults(names) {
        // Clear previous results
        nameCardsContainer.innerHTML = '';
        
        // Create a card for each name
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'name-card';
            
            nameCard.innerHTML = `
                <div class="chinese-name">${name.chinese}</div>
                <div class="pinyin">${name.pinyin}</div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>English Meaning</strong>:</div>
                    <div class="meaning-content english-meaning">${name.englishMeaning}</div>
                </div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>中文含义</strong>:</div>
                    <div class="meaning-content chinese-meaning">${name.chineseMeaning}</div>
                </div>
            `;
            
            nameCardsContainer.appendChild(nameCard);
        });
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Scroll to results section
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});