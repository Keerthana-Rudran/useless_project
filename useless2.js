let currentUnit = {};
let selectedUnitData = {
    'banana': { name: 'bananas', icon: '🍌', size: 18, funFacts: ['Bananas are naturally radioactive!', 'A banana plant is not a tree!'] },
    'burger': { name: 'burgers', icon: '🍔', size: 10, funFacts: ['The biggest burger weighed 2,566 pounds!', 'Americans eat 50 billion burgers per year!'] },
    'hello-kitty': { name: 'Hello Kitties', icon: '😻', size: 15, funFacts: ['Hello Kitty is not actually a cat!', 'Hello Kitty has a pet cat named Charmmy Kitty!'] },
    'teeth': { name: 'teeth', icon: '🦷', size: 1, funFacts: ['Tooth enamel is the hardest substance in the human body!', 'Sharks can have up to 50,000 teeth in their lifetime!'] },
    'pizza': { name: 'pizza slices', icon: '🍕', size: 25, funFacts: ['The world\'s largest pizza was 13,580 square feet!', 'Hawaiians consume more spam than any other US state!'] },
    'unicorn': { name: 'unicorns', icon: '🦄', size: 120, funFacts: ['Scotland\'s national animal is the unicorn!', 'Unicorns were mentioned in ancient Greek natural history!'] }
};

function selectUnit(unit, icon, size) {
    currentUnit = {
        name: unit,
        icon: icon,
        size: size,
        data: selectedUnitData[unit]
    };
    
    showModal(unit);
}

function showModal(unit) {
    const modal = document.getElementById('unit-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalText = document.getElementById('modal-text');
    
    const unitData = selectedUnitData[unit];
    modalIcon.textContent = unitData.icon;
    modalText.innerHTML = `You selected <strong>${unitData.name}</strong>! Let's see how tall you are in ${unitData.name}! ${unitData.icon}`;
    
    modal.classList.remove('hidden');
    
    // Add sparkle effect
    createSparkles();
}

function closeModal() {
    const modal = document.getElementById('unit-modal');
    modal.classList.add('hidden');
    
    // Update page 2 content
    document.getElementById('selected-unit-name').textContent = currentUnit.data.name;
    
    // Switch to page 2
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

function calculateHeight() {
    const heightInput = document.getElementById('height-input');
    const unitSelect = document.getElementById('unit-select');
    const resultSection = document.getElementById('result-section');
    
    let heightInCm = parseFloat(heightInput.value);
    
    if (!heightInCm || heightInCm <= 0) {
        alert('Please enter a valid height! 🤔');
        return;
    }
    
    // Convert to centimeters if needed
    switch(unitSelect.value) {
        case 'ft':
            heightInCm = heightInCm * 30.48;
            break;
        case 'in':
            heightInCm = heightInCm * 2.54;
            break;
        // cm is default, no conversion needed
    }
    
    // Calculate result
    const result = Math.round((heightInCm / currentUnit.size) * 10) / 10;
    const wholeUnits = Math.floor(result);
    
    // Update result display
    document.getElementById('result-number').textContent = result;
    document.getElementById('result-unit').textContent = currentUnit.data.name;
    
    // Create visual representation
    createVisualResult(wholeUnits, currentUnit.data.icon);
    
    // Show result with animation
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add celebration effects
    celebrateResult();
}

function createVisualResult(count, icon) {
    const visualResult = document.getElementById('visual-result');
    let visualHTML = '';
    
    // Limit visual representation to prevent performance issues
    const displayCount = Math.min(count, 50);
    
    for(let i = 0; i < displayCount; i++) {
        visualHTML += `<span style="display: inline-block; animation: popIn ${0.1 * i}s ease-out forwards; transform: scale(0);">${icon}</span>`;
    }
    
    if(count > 50) {
        visualHTML += `<br><span style="font-size: 1.2rem; color: #ffeaa7;">...and ${count - 50} more ${currentUnit.data.name}!</span>`;
    }
    
    visualResult.innerHTML = visualHTML;
    
    // Add random fun fact
    const funFact = currentUnit.data.funFacts[Math.floor(Math.random() * currentUnit.data.funFacts.length)];
    visualHTML += `<br><br><div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 10px; margin-top: 15px; font-size: 1rem;"><strong>Fun Fact:</strong> ${funFact}</div>`;
    
    visualResult.innerHTML = visualHTML;
}

function resetGame() {
    // Reset form
    document.getElementById('height-input').value = '';
    document.getElementById('unit-select').value = 'cm';
    document.getElementById('result-section').classList.add('hidden');
    
    // Go back to page 1
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page1').classList.remove('hidden');
    
    // Reset current unit
    currentUnit = {};
    
    // Add reset animation
    document.querySelector('#page1 .container').style.animation = 'bounce 0.5s ease';
    setTimeout(() => {
        document.querySelector('#page1 .container').style.animation = '';
    }, 500);
}

function petCat(catElement) {
    catElement.classList.add('petted');
    
    // Create hearts effect
    createHearts(catElement);
    
    // Play purr sound (visual feedback)
    showPurrMessage(catElement);
    
    setTimeout(() => {
        catElement.classList.remove('petted');
    }, 500);
}

function createHearts(element) {
    for(let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = '1rem';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `heartFloat 1s ease-out forwards`;
        heart.style.left = element.offsetLeft + Math.random() * 50 + 'px';
        heart.style.top = element.offsetTop + 'px';
        heart.style.zIndex = '10000';
        
        element.parentElement.appendChild(heart);
        
        setTimeout(() => {
            if(heart.parentElement) {
                heart.parentElement.removeChild(heart);
            }
        }, 1000);
    }
}

function showPurrMessage(element) {
    const messages = ['Purr! 😸', 'Meow! 😺', 'So happy! 😻', 'More pets! 🐱', 'Nya~ 😽'];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'absolute';
    messageDiv.style.top = element.offsetTop - 40 + 'px';
    messageDiv.style.left = element.offsetLeft - 10 + 'px';
    messageDiv.style.background = 'rgba(255, 255, 255, 0.9)';
    messageDiv.style.padding = '5px 10px';
    messageDiv.style.borderRadius = '15px';
    messageDiv.style.fontSize = '0.8rem';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.color = '#2d3436';
    messageDiv.style.pointerEvents = 'none';
    messageDiv.style.zIndex = '10000';
    messageDiv.style.animation = 'fadeInOut 2s ease forwards';
    
    element.parentElement.appendChild(messageDiv);
    
    setTimeout(() => {
        if(messageDiv.parentElement) {
            messageDiv.parentElement.removeChild(messageDiv);
        }
    }, 2000);
}

function createSparkles() {
    for(let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.fontSize = Math.random() * 1 + 0.5 + 'rem';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = `sparkleFloat ${Math.random() * 2 + 1}s ease-out forwards`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if(sparkle.parentElement) {
                sparkle.parentElement.removeChild(sparkle);
            }
        }, 3000);
    }
}

function celebrateResult() {
    // Create confetti effect
    for(let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        const confettiTypes = ['🎉', '🎊', '⭐', '🌟', '💫', '🎈'];
        confetti.textContent = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
        confetti.style.position = 'fixed';
        confetti.style.fontSize = Math.random() * 1.5 + 0.5 + 'rem';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-50px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s ease-out forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if(confetti.parentElement) {
                confetti.parentElement.removeChild(confetti);
            }
        }, 5000);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        to {
            transform: scale(1);
        }
    }
    
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0.5);
            opacity: 0;
        }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-10px); }
    }
    
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 1;
        }
        50% {
            transform: translateY(-30px) rotate(180deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-60px) rotate(360deg) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add some fun interactions on load
document.addEventListener('DOMContentLoaded', function() {
    // Make floating elements interactive
    const floatingElements = document.querySelectorAll('.float-element');
    floatingElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                this.style.animation = 'float 6s ease-in-out infinite';
                this.style.transform = '';
            }, 500);
        });
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            const calculateBtn = document.getElementById('calculate-btn');
            if(calculateBtn && !calculateBtn.disabled && !document.getElementById('page2').classList.contains('hidden')) {
                calculateHeight();
            }
        }
        
        if(e.key === 'Escape') {
            const modal = document.getElementById('unit-modal');
            if(!modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });
    
    // Add welcome sparkles
    setTimeout(createSparkles, 500);
});

// Easter egg: Konami code
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiSequence.push(e.code);
    if(konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if(konamiSequence.join(',') === konamiCode.join(',')) {
        // Secret rainbow mode
        document.body.style.animation = 'gradientShift 0.5s ease infinite';
        createSparkles();
        setTimeout(() => {
            alert('🌈 RAINBOW MODE ACTIVATED! 🌈\nYou found the secret! The cats are extra happy now! 😸');
        }, 100);
        konamiSequence = [];
    }
});

// Fun fact: Make cats meow when clicked multiple times quickly
let catClickCount = 0;
let catClickTimer = null;

function trackCatClicks() {
    catClickCount++;
    
    if(catClickTimer) {
        clearTimeout(catClickTimer);
    }
    
    if(catClickCount >= 5) {
        // Easter egg: All cats start meowing
        const cats = document.querySelectorAll('.cat');
        cats.forEach((cat, index) => {
            setTimeout(() => {
                showPurrMessage(cat);
                petCat(cat);
            }, index * 200);
        });
        catClickCount = 0;
    }
    
    catClickTimer = setTimeout(() => {
        catClickCount = 0;
    }, 2000);
}