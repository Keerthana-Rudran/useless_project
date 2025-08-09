// Height Measurement Fun - JavaScript

class HeightMeasurement {
    constructor() {
        this.selectedObject = '';
        this.objectHeight = 0;
        this.userHeight = 0;
        this.unit = 'cm';
        this.customHeight = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFunFacts();
        this.createMoreBackgroundElements();
    }

    bindEvents() {
        // Object card selection
        document.querySelectorAll('.object-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectObject(e));
        });

        // Popup buttons
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculate());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closePopup());

        // Navigation buttons
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());
        document.getElementById('downloadBtn').addEventListener('click', (e) => this.handleDownload(e));

        // Close download message
        document.getElementById('closeMessageBtn').addEventListener('click', () => this.closeDownloadMessage());

        // Enter key support
        document.getElementById('heightInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
    }

    createMoreBackgroundElements() {
        const background = document.getElementById('animatedBackground');
        
        // Create multiple instances of space elements for more dynamic effect
        const elements = ['🛸', '👽', '🪐', '☄️', '⭐', '✨', '🚀', '🌟', '💫'];
        
        for (let i = 0; i < 30; i++) {
            const element = document.createElement('div');
            const emoji = elements[Math.floor(Math.random() * elements.length)];
            element.textContent = emoji;
            element.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 1.5 + 1}rem;
                opacity: ${Math.random() * 0.6 + 0.3};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                animation: randomFloat ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * -20}s;
            `;
            background.appendChild(element);
        }
    }

    selectObject(e) {
        const card = e.currentTarget;
        this.selectedObject = card.dataset.object;
        let height = parseFloat(card.dataset.height);

        // Handle custom heights for new objects:
        if (card.dataset.height === 'custom') {
            switch(this.selectedObject) {
                case 'bacteria':
                    height = 0.000001; // 1 micron = 0.000001 cm
                    break;
                case 'mushroom':
                    height = 10; // 15 cm average mushroom height
                    break;
                case 'moon':
                    height = 3476000000; // 384,400 km in cm (distance to moon)
                    break;
                default:
                    height = 1; // fallback default
            }
        }

        this.objectHeight = height;

        this.showPopup();
    }

    showPopup() {
        document.getElementById('heightPopup').classList.add('active');
        document.getElementById('heightInput').focus();
    }

    closePopup() {
        document.getElementById('heightPopup').classList.remove('active');
        document.getElementById('heightInput').value = '';
    }

    calculate() {
        const heightInput = document.getElementById('heightInput').value;
        const unit = document.getElementById('unitSelect').value;

        if (!heightInput || heightInput <= 0) {
            alert('Please enter a valid height!');
            return;
        }

        this.userHeight = parseFloat(heightInput);
        this.unit = unit;

        // Convert user height to cm for calculation
        let heightInCm = this.convertToCm(this.userHeight, this.unit);
        
        // Handle custom height case
        if (this.selectedObject === 'my own height') {
            this.customHeight = heightInCm;
        }

        this.showResult(heightInCm);
        this.closePopup();
    }

    convertToCm(height, unit) {
        switch(unit) {
            case 'inches':
                return height * 2.54;
            case 'feet':
                return height * 30.48;
            case 'meters':
                return height * 100;
            default:
                return height;
        }
    }

    showResult(heightInCm) {
        let result;
        let objectIcon;

        if (this.selectedObject === 'my own height') {
            result = 1;
            objectIcon = '👤';
        } else {
            result = heightInCm / this.objectHeight;
            objectIcon = this.getObjectIcon(this.selectedObject);
        }

        const resultText = this.formatResult(result, this.selectedObject);
        const funFact = this.getFunFact(this.selectedObject);

        document.getElementById('resultIcon').textContent = objectIcon;
        document.getElementById('resultText').innerHTML = resultText;
        document.getElementById('funFact').innerHTML = `<strong>Fun Fact:</strong><br>${funFact}`;

        // Switch to result page
        document.getElementById('page1').classList.remove('active');
        document.getElementById('page2').classList.add('active');
    }

    formatResult(result, objectName) {
        if (objectName === 'my own height') {
            return `You are exactly <span style="color: #ff006e;">1 you</span> tall!<br>
                    <span style="color: #06ffa5; font-size: 0.8rem;">That's ${this.userHeight} ${this.unit} or ${this.customHeight.toFixed(1)} cm</span>`;
        }

        const roundedResult = Math.round(result * 100) / 100;
        
        if (result < 0.01) {
            return `You are <span style="color: #ff006e;">0.01 ${objectName}s</span> tall!<br>
                    <span style="color: #06ffa5; font-size: 0.8rem;">You're really tiny compared to a ${objectName}!</span>`;
        } else if (result > 1000000) {
            return `You are <span style="color: #ff006e;">${(result/1000000).toFixed(2)} million ${objectName}s</span> tall!<br>
                    <span style="color: #06ffa5; font-size: 0.8rem;">That's astronomically tall!</span>`;
        } else if (result > 1000) {
            return `You are <span style="color: #ff006e;">${(result/1000).toFixed(2)} thousand ${objectName}s</span> tall!<br>
                    <span style="color: #06ffa5; font-size: 0.8rem;">That's a lot of ${objectName}s!</span>`;
        } else {
            return `You are <span style="color: #ff006e;">${roundedResult} ${objectName}s</span> tall!<br>
                    <span style="color: #06ffa5; font-size: 0.8rem;">Stacking ${Math.floor(roundedResult)} ${objectName}s would reach your height!</span>`;
        }
    }

    getObjectIcon(objectName) {
        const icons = {
            'banana': '🍌',
            'hello kitty': '🐱',
            'tooth': '🦷',
            'poop': '💩',
            'apple': '🍎',
            'burger': '🍔',
            'pencil': '✏️',
            'chick': '🐣',
            'mount everest': '🏔️',
            'eiffel tower': '🗼',
            'blue whale': '🐋',
            'my own height': '👤',
            'bacteria': '🦠',
            'mushroom': '🍄',
            'moon': '🌝'
        };
        return icons[objectName] || '❓';
    }

    setupFunFacts() {
        this.funFacts = {
            'banana': 'Bananas are berries, but strawberries aren\'t! A single banana plant can produce up to 240 bananas at once.',
            'hello kitty': 'Hello Kitty\'s full name is Kitty White and she\'s supposedly from London! She has a pet cat named Charmmy Kitty.',
            'tooth': 'Your tooth enamel is the hardest substance in your body - even harder than bone! Sharks can have up to 50,000 teeth in their lifetime.',
            'poop': 'The Great Wall of China used rice as mortar! Ancient builders mixed rice flour with slaked lime to create super-strong mortar.',
            'apple': 'Apples float in water because they\'re 25% air! There are over 7,500 varieties of apples grown worldwide.',
            'burger': 'The hamburger was invented in 1900 by Louis Lassen in Connecticut! Americans eat about 50 billion burgers per year.',
            'pencil': 'The average pencil can draw a line 35 miles long! The yellow color became standard because the best graphite came from China, and yellow is associated with royalty there.',
            'chick': 'Baby chicks can learn their names and come when called, just like puppies! They start communicating with their mothers while still in the egg.',
            'mount everest': 'Mount Everest grows about 4mm taller each year due to tectonic plate movement! The mountain is also known as Sagarmatha in Nepali.',
            'eiffel tower': 'The Eiffel Tower can grow 6 inches taller in summer due to thermal expansion! It was originally intended to be temporary and almost torn down in 1909.',
            'blue whale': 'A blue whale\'s heart alone weighs as much as a car! Their tongue can weigh as much as an elephant, and they can eat up to 4 tons of krill per day.',
            'my own height': 'You are absolutely unique! No one else in the world has exactly the same height, weight, and proportions as you do right now.',
            'bacteria': 'Bacteria are microscopic, single-celled organisms that live almost everywhere on Earth. Some can survive extreme conditions like radiation and heat!',
            'mushroom': 'Mushrooms are more closely related to animals than plants! The largest living organism is a mushroom colony in Oregon spanning over 2,200 acres.',
            'moon': 'The Moon is about 384,400 km away from Earth and affects our tides. It\'s the only celestial body humans have visited so far!'
        };
    }

    getFunFact(objectName) {
        return this.funFacts[objectName] || 'That\'s an interesting choice for measurement!';
    }

    handleDownload(e) {
        e.preventDefault();
        
        // Show the custom popup message
        this.showDownloadMessage();
    }

    showDownloadMessage() {
        document.getElementById('downloadMessagePopup').classList.add('active');
    }

    closeDownloadMessage() {
        document.getElementById('downloadMessagePopup').classList.remove('active');
    }

    goBack() {
        document.getElementById('page2').classList.remove('active');
        document.getElementById('page1').classList.add('active');
        
        // Reset values
        this.selectedObject = '';
        this.objectHeight = 0;
        this.userHeight = 0;
        this.customHeight = 0;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeightMeasurement();
});

// Add some fun interactions
document.addEventListener('mousemove', (e) => {
    // Create trailing effect for cursor
    if (Math.random() > 0.95) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            pointer-events: none;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: #ff006e;
            border-radius: 50%;
            z-index: 9999;
            animation: fadeOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }
});


// Add CSS for trail animation and random float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
    
    @keyframes randomFloat {
        0% {
            transform: translate(0px, 0px) rotate(0deg);
        }
        25% {
            transform: translate(50px, -30px) rotate(90deg);
        }
        50% {
            transform: translate(-30px, 40px) rotate(180deg);
        }
        75% {
            transform: translate(40px, -20px) rotate(270deg);
        }
        100% {
            transform: translate(0px, 0px) rotate(360deg);
        }
    }
`;

document.head.appendChild(style);



