const onlyNumbersRegex = /^[0-9]$/;
const onlySpecialOperatorsRegex = /^(|\%|\(|\))$/;
const onlyAritmeticOperatorsRegex = /^(\+|\-|\*|\/|\×|\÷)$/;

const screenResult = document.querySelector('.calculator__screen__result');
const screenHistoric = document.querySelector('.calculator__screen__historic');

class Calculator {
    total = '';
    current = '';
    accumulator = '';

    operator = '';
    historic = '';
    screen = {};

    constructor(screen) {
        this.screen = screen;
    }

    process(key) {
        if (onlyNumbersRegex.test(key)) return this.setNumber(key);
        if (onlyAritmeticOperatorsRegex.test(key)) return this.setAritimeticOperator(key);
        if (key == 'Backspace') return this.setRemove();
        if (key == 'Enter' || key == '=') return this.setCalculate();
        if (key == 'c' || key == 'C') return this.setClear();
    }

    setNumber(number) {
        number = parseInt(number);

        this.operator == '' ? this.accumulator += number : this.current += number;
        let previusTotal = this.total == '0' ? '' : this.total;

        this.total = previusTotal + number;
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

        let numberWithValueDefault = this.accumulator == '' ? '0' : this.accumulator;
        let operatorWithSpaces = this.operator == '' ? '' : ` ${this.operator} `;

        this.total = numberWithValueDefault + operatorWithSpaces + this.current;
        this.render();
    }

    setAritimeticOperator(operator) {
        if (this.accumulator != 0) {
            this.operator == '' ? this.operator = operator : this.calculate(), this.operator = operator;
            this.total += ` ${operator} `;

            this.render();
        }
    }

    setHistoric(num1, num2) {
        this.historic = `${num1} ${this.operator} ${num2} =`;
    }

    setCalculate() {
        if (this.current != '') this.calculate();
    }

    setClear() {
        this.total = '0';
        this.current = '';
        this.accumulator = '';
        this.operator = '';
        this.historic = '';

        this.render();
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
            case '×':
            case '*':
                this.accumulator = this.total = num1 * num2;
                break;
        }

        this.reset();
        this.render();
    }

    reset() {
        this.current = '';
        this.operator = '';
    }

    render() {
        this.screen.historic.innerHTML = this.historic;
        this.screen.result.innerHTML = this.total;
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