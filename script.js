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
        loadingElement.style.display = 'block';
        resultsSection.style.display = 'none';
        
        try {
            // Call our local server API
            const response = await fetch('http://localhost:3001/generate-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ englishName })
            });

            if (!response.ok) {
                throw new Error('Server responded with an error');
            }

            const data = await response.json();
            displayResults(data.names);
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error generating your Chinese names. Please try again later.');
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
            
            // 确保使用englishMeaning和chineseMeaning分别显示英文和中文含义
            nameCard.innerHTML = `
                <div class="chinese-name">${name.chinese}</div>
                <div class="pinyin">${name.pinyin}</div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>English Meaning</strong>:</div>
                    <div class="meaning-content english-meaning">${name.englishMeaning || ""}</div>
                </div>
                <div class="meaning-section">
                    <div class="meaning-title"><strong>中文含义</strong>:</div>
                    <div class="meaning-content chinese-meaning">${name.chineseMeaning || ""}</div>
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