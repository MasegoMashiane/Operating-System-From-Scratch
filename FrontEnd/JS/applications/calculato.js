// Integrated calculator for OS emulator
import { cpu } from "../CPU.js";
import { ctors } from "../CPU.js";

// Expression evaluator (shunting-yard -> RPN) - keeping the safe evaluation logic
function tokenize(expr) {
    const tokens = [];
    const re = /\s*([0-9]*\.?[0-9]+|[()+-/*])\s*/g;
    let m;
    let lastWasOperator = true;
    
    while((m = re.exec(expr)) !== null) {
        let t = m[1];
        if((t === '+' || t === '-') && lastWasOperator) {
            const next = re.exec(expr.slice(re.lastIndex));
            if(next && /^[0-9]*\.?[0-9]+$/.test(next[1])) {
                const combined = t + next[1];
                tokens.push(combined);
                re.lastIndex += next.index + next[0].length - (m[0].length - m[1].length);
                lastWasOperator = false;
                continue;
            } else {
                tokens.push(t);
                lastWasOperator = true;
                continue;
            }
        }
        tokens.push(t);
        lastWasOperator = /[+\-/*\(]/.test(t);
    }
    return tokens;
}

function toRPN(tokens) {
    const out = [];
    const ops = [];
    const prec = {'+': 1, '-': 1, '*': 2, '/': 2};
    const isOp = t => t === '+' || t === '-' || t === '*' || t === '/';
    
    for(const t of tokens) {
        if(isOp(t)) {
            while(ops.length && isOp(ops[ops.length-1]) && prec[ops[ops.length-1]] >= prec[t]) {
                out.push(ops.pop());
            }
            ops.push(t);
        } else if(t === '(') {
            ops.push(t);
        } else if(t === ')') {
            while(ops.length && ops[ops.length-1] !== '(') {
                out.push(ops.pop());
            }
            if(ops.length === 0) throw new Error('Mismatched parentheses');
            ops.pop();
        } else {
            if(isNaN(Number(t))) throw new Error('Invalid token: ' + t);
            out.push(t);
        }
    }
    
    while(ops.length) {
        const op = ops.pop();
        if(op === '(' || op === ')') throw new Error('Mismatched parentheses');
        out.push(op);
    }
    return out;
}

function evalRPN(rpn) {
    const stack = [];
    for(const t of rpn) {
        if(t === '+' || t === '-' || t === '*' || t === '/') {
            if(stack.length < 2) throw new Error('Malformed expression');
            const b = stack.pop();
            const a = stack.pop();
            let res;
            switch(t) {
                case '+': res = a + b; break;
                case '-': res = a - b; break;
                case '*': res = a * b; break;
                case '/': 
                    if(b === 0) throw new Error('Division by zero');
                    res = a / b; 
                    break;
            }
            stack.push(res);
        } else {
            stack.push(Number(t));
        }
    }
    if(stack.length !== 1) throw new Error('Malformed expression');
    return stack[0];
}

function safeEvaluate(expr) {
    if(typeof expr !== 'string') throw new Error('Expression must be a string');
    if(!/^[-+0-9/*.()\s]*$/.test(expr)) throw new Error('Invalid characters in expression');
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}

// Enhanced Calculator class that integrates with OS
export class EnhancedCalculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.displayValue = '0';
        this.lastResult = null;
        this.isExpressionMode = false;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.displayValue;
        }
    }

    reset() {
        this.displayValue = '0';
        this.lastResult = null;
        this.isExpressionMode = false;
        this.updateDisplay();
    }

    handleInput(value) {
        try {
            if (value === 'C') {
                this.reset();
            } else if (value === '=') {
                this.equals();
            } else if (value === '±') {
                this.toggleSign();
            } else if (value === '%') {
                this.percentage();
            } else if (value === 'CPU') {
                this.copyToCPU();
            } else if (value >= '0' && value <= '9' || value === '.') {
                this.inputDigit(value);
            } else if (['+', '-', '*', '/'].includes(value)) {
                this.inputOperator(value);
            } else if (['(', ')'].includes(value)) {
                this.inputParenthesis(value);
            }
        } catch (error) {
            this.displayValue = 'Error';
            this.updateDisplay();
            setTimeout(() => this.reset(), 2000);
        }
    }

    inputDigit(digit) {
        if (this.displayValue === '0' || this.displayValue === 'Error') {
            this.displayValue = digit;
        } 
        else {
            this.displayValue += digit;
        }
        this.isExpressionMode = true;
        this.updateDisplay();
    }

    inputOperator(operator) {
        // Convert display symbols to calculation symbols
        const opMap = { '÷': '/', '×': '*', '−': '-' };
        const calcOp = opMap[operator] || operator;
        
        if (this.displayValue === '0') {
            this.displayValue = '0' + calcOp;
        } else {
            this.displayValue += calcOp;
        }
        this.isExpressionMode = true;
        this.updateDisplay();
    }

    inputParenthesis(paren) {
        if (this.displayValue === '0') {
            this.displayValue = paren;
        }else{
        this.displayValue += paren;}
        this.isExpressionMode = true;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.isExpressionMode) {
            // In expression mode, add unary minus
            this.displayValue += '(-';
        } else {
            // Simple number toggle
            if (this.displayValue.startsWith('-')) {
                this.displayValue = this.displayValue.slice(1);
            } else if (this.displayValue !== '0') {
                this.displayValue = '-' + this.displayValue;
            }
        }
        this.updateDisplay();
    }

    percentage() {
        if (!this.isExpressionMode) {
            const num = parseFloat(this.displayValue);
            this.displayValue = String(num / 100);
            this.updateDisplay();
        }
    }

    equals() {
        try {
            const result = safeEvaluate(this.displayValue);
            const formatted = Number.isInteger(result) 
                ? String(result) 
                : String(parseFloat(result.toPrecision(12))).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
            
            this.lastResult = Number(formatted);
            this.displayValue = formatted;
            this.isExpressionMode = false;
            this.updateDisplay();
            return this.lastResult;
        } catch (error) {
            throw error;
        }
    }

    // Integration with CPU system
    copyToCPU() {
        if (this.lastResult === null) {
            console.log('No result to copy to CPU');
            return false;
        }

        // Try to copy to AX register using CPU system
        try {
            if (ctors && ctors.copy2ax) {
                ctors.copy2ax(this.lastResult);
                console.log(`Copied ${this.lastResult} to CPU AX register`);
                return true;
            } else if (cpu && cpu.ax !== undefined) {
                cpu.ax = this.lastResult;
                console.log(`Copied ${this.lastResult} to CPU AX register`);
                return true;
            }
        } catch (error) {
            console.error('Failed to copy to CPU:', error);
        }
        return false;
    }
}