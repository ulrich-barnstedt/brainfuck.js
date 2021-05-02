const {Execute, Loop} = require("./backend");

class Program {
    constructor (code) {
        this.statements = code.split("");
    }

    async run () {
        this.preProcess();
        await this.execute();
    }

    filter () {
        const valid = [">", "<", "+", "-", ".", ",", "[", "]"];
        this.statements = this.statements.filter(char => valid.includes(char));
    }

    preProcess () {
        this.filter();

        let ast = [];
        let loopAccumulator = [];
        let depth = -1;

        this.statements.forEach(statement => {
            if (statement === "[") {
                depth++;
                return;
            }

            if (statement === "]") {
                depth--;
                statement = new Loop(loopAccumulator.pop());
            }

            if (depth === -1) ast.push(statement);
            if (depth > -1) {
                if (loopAccumulator[depth] === undefined) {
                    loopAccumulator[depth] = [];
                }

                loopAccumulator[depth].push(statement);
            }
        })

        this.statements = ast;
    }

    async execute () {
        for (let key in this.statements) {
            await Execute.parse(this.statements[key]);
        }
    }
}

module.exports = Program;