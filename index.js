const BfProgram = require("./brainfuck");

const code = `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`;

(async () => {
    let program = new BfProgram(code);
    await program.run();

    process.exit();
})();

