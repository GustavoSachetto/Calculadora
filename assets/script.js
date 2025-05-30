const onlyNumbersRegex = /^[0-9]$/;
const onlySpecialOperatorsRegex = /^(\%|\.)$/;
const onlyAritmeticOperatorsRegex = /^(\+|\-|\*|\/|\×|\÷|\\|\^)$/;

const screenResult = document.querySelector('.calculator__screen__result');
const screenHistoric = document.querySelector('.calculator__screen__historic');

class Calculator {
    total = '';
    current = '';
    accumulator = '';
    limitOfNumbers = 8;

    operator = '';
    historic = '';
    screen = {};

    constructor(screen) {
        this.screen = screen;
    }

    process(key) {
        if (onlyNumbersRegex.test(key)) return this.setNumber(key);
        if (onlyAritmeticOperatorsRegex.test(key)) return this.setAritimeticOperator(key);
        if (onlySpecialOperatorsRegex.test(key)) return this.setSpecialOperator(key);
        if (key == 'Backspace') return this.setRemove();
        if (key == 'Enter' || key == '=') return this.setCalculate();
        if (key == 'c' || key == 'C') return this.setClear();
    }

    setCurrent(number) {
        if (this.current.length <= this.limitOfNumbers) this.current += number;
    }

    setAccumulator(number) {
        if (this.accumulator.length <= this.limitOfNumbers) this.accumulator += number;
    }

    setNumber(number) {
        number = parseInt(number);

        this.operator == '' 
            ? this.setAccumulator(number) 
            : this.setCurrent(number);

        this.render();
    }

    setRemove() {
        if (this.current != '') {
            this.current = this.current.toString().replace(/.$/, '');
        } else if (this.operator != '') {
            this.operator = this.operator.toString().replace(/.$/, '');
        } else { 
            this.accumulator = this.accumulator.toString().replace(/.$/, '');
        }

        this.render();
    }

    setAritimeticOperator(operator) {
        if (this.accumulator != 0) {
            this.operator == '' ? this.operator = operator : this.calculate(), this.operator = operator;
            this.total += ` ${operator} `;

            this.render();
        }
    }

    setSpecialOperator(operator) {
        switch (operator) {
            case '%':
                this.setCalculateWithPorcentage();
                break;
            case '.': 
                this.setFloatPoint();
                break;
        }
        
        this.render();
    }

    setFloatPoint() {
        if (this.current != '' && !this.current.includes('.')) {
            this.current += '.';
            this.total += '.';
        } else if (this.operator == '' && !this.accumulator.includes('.')) {
            this.accumulator += '.';
            this.total += '.';
        }
    }

    setHistoric(num1, num2) {
        this.historic = `${num1} ${this.operator} ${num2} =`;
    }

    setClear() {
        this.total = '0';
        this.current = '';
        this.accumulator = '';
        this.operator = '';
        this.historic = '';

        this.render();
    }

    setCalculate() {
        if (this.current != '') this.calculate();
    }

    setCalculateWithPorcentage() {
        if (this.current != '') this.calculateWithPorcentage();
    }

    alertCalculateNotAllowed() {
        alert('Descupe mas infelizmente esse calculo não será possivel'); 
        this.setClear();
    }

    calculate() {
        let num1 = parseFloat(this.accumulator);
        let num2 = parseFloat(this.current == '' ? 0 : this.current);
        
        this.setHistoric(num1, num2);

        switch (this.operator) {
            case '+':
                this.accumulator = this.total = num1 + num2;
                break;
            case '-':
                this.accumulator = this.total = num1 - num2;
                break;
            case '/':
            case '÷':
                this.accumulator = this.total = num1 / num2;
                break;
            case '\\':
                this.accumulator = this.total = (num1 / num2) | 0;
                break;
            case '^':
                num2 < 10 ? this.accumulator = this.total = num1 ** num2 : this.alertCalculateNotAllowed();
                break;
            case '×':
            case '*':
                this.accumulator = this.total = num1 * num2;
                break;
        }

        this.reset();
        this.render();
    }

    calculateWithPorcentage() {
        this.current = (this.accumulator * this.current) / 100;
        this.calculate();
    }

    loadTotalOnScreen() {
        let numberWithValueDefault = this.accumulator == '' ? '0' : this.accumulator;
        let operatorWithSpaces = this.operator == '' ? '' : ` ${this.operator} `;

        this.total = numberWithValueDefault + operatorWithSpaces + this.current;
    }

    reset() {
        this.current = '';
        this.operator = '';
    }

    render() {
        this.loadTotalOnScreen();

        this.screen.historic.innerHTML = this.historic;
        this.screen.result.innerHTML = this.total;
        this.screen.result.setAttribute('title', this.total);
    }
}

let calculator = new Calculator({ 
    historic: screenHistoric, 
    result: screenResult
});

document.addEventListener('keydown', (event) => {
    calculator.process(event.key);
});

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (event) => {
        calculator.process(event.target.innerHTML);
    });
});