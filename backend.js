const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const debug = false;
const bits = 8;
const bottomLimit = 2 ** bits / 2 * -1;
const topLimit = 2 ** bits / 2 - 1;

let memory = [];
let pointer = 0;

const Execute = new class {
    async parse (statement) {
        if (debug) {
            console.log(statement);
            console.log(memory);
            console.log(pointer);
        }

        switch (statement) {
            case ">":
                this.incrementPtr();
                break;
            case "<":
                this.decrementPtr();
                break;
            case "+":
                this.increment();
                break;
            case "-":
                this.decrement();
                break;
            case ".":
                this.out();
                break;
            case ",":
                await this.in();
                break;
            default:
                await statement.execute();
        }
    }

    incrementPtr () {
        pointer++;
    }

    decrementPtr () {
        if (pointer <= 0) return;
        pointer--;
    }

    increment () {
        if (memory[pointer] === undefined) {
            memory[pointer] = 1;
            return;
        }

        if (memory[pointer] === topLimit) {
            memory[pointer] = bottomLimit;
            return;
        }

        memory[pointer]++;
    }

    decrement () {
        if (memory[pointer] === undefined) {
            memory[pointer] = -1;
            return;
        }

        if (memory[pointer] === bottomLimit) {
            memory[pointer] = topLimit;
            return;
        }

        memory[pointer]--;
    }

    out () {
        console.log(String.fromCharCode(memory[pointer] ?? 0));
    }

    async in () {
        memory[pointer] = (await new Promise(resolve => {
            rl.question("Enter char: ", (str) => {
                resolve(str);
            });
        })).charCodeAt(0);
    }
}();

class Loop {
    constructor (statements) {
        this.statements = statements;
    }

    async execute () {
        while (memory[pointer] !== 0) {
            for (let key in this.statements) {
                await Execute.parse(this.statements[key]);
            }
        }
    }
}

module.exports = {
    Execute,
    Loop
};