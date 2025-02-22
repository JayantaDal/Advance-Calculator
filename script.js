let display = document.getElementById('display');
let currentExpression = '';
let memory = 0;

function append(value) {
    currentExpression += value;
    display.textContent = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
    memory = 0; // Reset memory on clear
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    display.textContent = currentExpression || '0';
}

function calculate() {
    try {
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
    } catch (error) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    currentExpression += memory;
    display.textContent = currentExpression;
}

function memoryAdd() {
    try {
        memory += math.evaluate(currentExpression || '0');
    } catch (error) {
        display.textContent = 'Error';
    }
}

function memorySubtract() {
    try {
        memory -= math.evaluate(currentExpression || '0');
    } catch (error) {
        display.textContent = 'Error';
    }
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
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
});