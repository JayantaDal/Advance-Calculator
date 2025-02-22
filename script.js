let display = document.getElementById('display');
let currentExpression = '';
let memory = 0;

if (!display) {
    console.error('Display element not found. Check your HTML.');
}

function append(value) {
    if (!display) return;
    currentExpression += value;
    display.textContent = currentExpression || '0';
    console.log('Appended:', value, 'Current Expression:', currentExpression);
}

function clearDisplay() {
    if (!display) return;
    currentExpression = '';
    display.textContent = '0';
    memory = 0; // Reset memory on clear
    console.log('Display cleared');
}

function backspace() {
    if (!display) return;
    currentExpression = currentExpression.slice(0, -1);
    display.textContent = currentExpression || '0';
    console.log('Backspace applied, Current Expression:', currentExpression);
}

function calculate() {
    if (!display) return;
    try {
        if (typeof math === 'undefined') {
            throw new Error('mathjs is not loaded');
        }

        // Handle percentage: If % is present, apply it to the last number
        let expression = currentExpression;
        if (expression.includes('%')) {
            let parts = expression.split('%');
            if (parts.length > 1) {
                let numberBeforePercent = parts[0].trim();
                let numberAfterPercent = parts.length > 1 ? parts[1].trim() : '';
                let percentValue = math.evaluate(numberBeforePercent) / 100;
                if (numberAfterPercent) {
                    let result = percentValue * math.evaluate(numberAfterPercent);
                    expression = result.toString();
                } else {
                    expression = percentValue.toString();
                }
            }
        }

        // Replace common symbols for mathjs
        expression = expression.replace('×', '*').replace('÷', '/').replace('^', '**');
        let result = math.evaluate(expression);
        currentExpression = result.toString();
        display.textContent = currentExpression;
        console.log('Calculated result:', currentExpression);
    } catch (error) {
        display.textContent = 'Error';
        currentExpression = '';
        console.error('Calculation error:', error.message);
        alert('Error in calculation. Check your expression or ensure mathjs is loaded.');
    }
}

function memoryClear() {
    memory = 0;
    console.log('Memory cleared');
}

function memoryRecall() {
    if (!display) return;
    currentExpression += memory;
    display.textContent = currentExpression;
    console.log('Memory recalled, Current Expression:', currentExpression);
}

function memoryAdd() {
    if (!display) return;
    try {
        if (typeof math === 'undefined') {
            throw new Error('mathjs is not loaded');
        }
        memory += math.evaluate(currentExpression || '0');
        console.log('Memory added, New memory value:', memory);
    } catch (error) {
        console.error('Memory add error:', error.message);
        alert('Error adding to memory. Check your expression or ensure mathjs is loaded.');
    }
}

function memorySubtract() {
    if (!display) return;
    try {
        if (typeof math === 'undefined') {
            throw new Error('mathjs is not loaded');
        }
        memory -= math.evaluate(currentExpression || '0');
        console.log('Memory subtracted, New memory value:', memory);
    } catch (error) {
        console.error('Memory subtract error:', error.message);
        alert('Error subtracting from memory. Check your expression or ensure mathjs is loaded.');
    }
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (!display) return;
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        append(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        append(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
    } else if (e.key === '(' || e.key === ')') {
        append(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key.toLowerCase() === 'c') {
        clearDisplay();
    }
    console.log('Key pressed:', e.key);
});
