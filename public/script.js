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
            // 使用本地API端点，减少外部API调用的延迟
            const response = await fetch('/generate-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ englishName })
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            displayResults(data.names);
        } catch (error) {
            console.error('Error:', error);
            
            // 获取更详细的错误信息
            let errorMessage = '未知错误';
            
            try {
                // 尝试解析错误响应中的详细信息
                if (error.message.includes('fetch')) {
                    errorMessage = '网络连接错误，请检查您的网络连接';
                } else if (error.response) {
                    // 服务器返回的错误信息
                    const data = error.response.data;
                    errorMessage = data.details || data.message || data.error || error.message;
                } else {
                    errorMessage = error.message;
                }
            } catch (e) {
                // 如果解析失败，使用原始错误信息
                errorMessage = error.message;
            }
            
            // 显示友好的错误提示
            alert(`生成中文名时出错: ${errorMessage}\n请稍后再试或联系管理员`);
            
            // 在控制台输出详细错误信息，方便调试
            console.error('详细错误信息:', error);
        } finally {
            // Hide loading spinner
            loadingElement.style.display = 'none';
        }
    }

    function displayResults(names) {
        // 使用文档片段减少DOM重绘次数
        const fragment = document.createDocumentFragment();
        
        // 预先构建HTML字符串，减少DOM操作
        let cardsHTML = '';
        
        // 创建名字卡片
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'name-card';
            
            // 使用模板字符串一次性设置HTML内容
            nameCard.innerHTML = `
                <div class="chinese-name">${name.chinese}</div>
                <div class="pinyin">${name.pinyin}</div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>English Meaning</strong>:</div>
                    <div class="meaning-content english-meaning">${name.englishMeaning || name.meaning}</div>
                </div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>中文含义</strong>:</div>
                    <div class="meaning-content chinese-meaning">${name.chineseMeaning || name.meaning}</div>
                </div>
            `;
            
            // 添加到文档片段
            fragment.appendChild(nameCard);
        });
        
        // 清空容器并一次性添加所有卡片
        nameCardsContainer.innerHTML = '';
        nameCardsContainer.appendChild(fragment);
        
        // 显示结果区域
        resultsSection.style.display = 'block';
        
        // 使用requestAnimationFrame优化滚动性能
        requestAnimationFrame(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});