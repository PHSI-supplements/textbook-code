/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class ArrayDimensionProblem {
    constructor(getInstructionSet, elementPrefix) {
        this.getInstructionSet = getInstructionSet;
        this.elementPrefix = elementPrefix;
        this.assemblyArea = document.getElementById(elementPrefix + "_assembly");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.mAnswerField = document.getElementById(elementPrefix + "_M_answer");
        this.nAnswerField = document.getElementById(elementPrefix + "_N_answer");
        this.mAnswerField.onkeydown = this.handleKeyPress.bind(this);
        this.nAnswerField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton = document.getElementById(elementPrefix + "_check");
        this.checkButton.onclick = this.checkAnswer.bind(this);
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.generateProblem();
    }

    x86InstructionTemplates = [
        [], [], [],
        [
            "leaXX    (ROW, ROW, 2), DESTINATION",
            "addXX    COLUMN, DESTINATION",
        ],                                                      // 3
        [
            // "movXX    ROW, DESTINATION",
            // "salXX    $2, DESTINATION",
            // addXX    COLUMN, DESTINATION",
            "leaXX    (COLUMN, ROW, 4), DESTINATION",
        ],                                                      // 4
        [
            "leaXX    (ROW, ROW, 4), DESTINATION",
            "addXX    COLUMN, DESTINATION",
        ],                                                      // 5
        [
            "leaXX    (ROW, ROW, 2), DESTINATION",
            // "salXX    $1, DESTINATION",
            // "addXX    COLUMN, DESTINATION",
            "leaXX    (COLUMN, DESTINATION, 2), DESTINATION",
        ],                                                      // 6
        [
            // "leaXX    0(,ROW, 8), DESTINATION",
            // "subXX    ROW, DESTINATION",
            // "addXX    COLUMN, DESTINATION",
            "leaXX    (COLUMN ,ROW, 8), DESTINATION",
            "subXX    ROW, DESTINATION",
        ],                                                      // 7
        [
            // "movXX    ROW, DESTINATION",
            // "salXX    $3, DESTINATION",
            // "addXX    COLUMN, DESTINATION",
            "leaXX    (COLUMN, ROW, 8), DESTINATION",
        ],                                                      // 8
        [
            "leaXX    (ROW, ROW, 8), DESTINATION",
            "addXX    COLUMN, DESTINATION",
        ],                                                      // 9
    ]

    a64InstructionTemplates = [
        [], [], [],
        [
            "add     DESTINATION, ROW, ROW, lsl 1",
            "add     DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 3
        [
            // "lsl     DESTINATION, ROW, 2",
            // "add     DESTINATION, DESTINATION, COLUMN",
            "add     DESTINATION, COLUMN, ROW, lsl 2",
        ],                                                      // 4
        [
            "add     DESTINATION, ROW, ROW, lsl 2",
            "add     DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 5
        [
            "add     DESTINATION, ROW, ROW, lsl 1",
            // "lsl     DESTINATION, DESTINATION, 1",
            // "add     DESTINATION, DESTINATION, COLUMN",
            "add     DESTINATION, COLUMN, DESTINATION, lsl 1",
        ],                                                      // 6
        [
            // "lsl     DESTINATION, ROW, 3",
            // "sub     DESTINATION, DESTINATION, ROW",
            // "add     DESTINATION, DESTINATION, COLUMN",
            "add     DESTINATION, COLUMN, ROW, lsl 3",
            "sub     DESTINATION, DESTINATION, ROW",
        ],                                                      // 7
        [
            // "lsl     DESTINATION, ROW, 3",
            // "add     DESTINATION, DESTINATION, COLUMN",
            "add     DESTINATION, COLUMN, ROW, lsl 3",
        ],                                                      // 8
        [
            "add     DESTINATION, ROW, ROW, lsl 3",
            "add     DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 9
    ]

    t32InstructionTemplates = [
        [], [], [],
        [
            "lsls    DESTINATION, ROW, #1",
            "adds    DESTINATION, DESTINATION, ROW",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 3
        [
            "lsls    DESTINATION, ROW, #2",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 4
        [
            "lsls    DESTINATION, ROW, #2",
            "adds    DESTINATION, DESTINATION, ROW",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 5
        [
            "lsls    DESTINATION, ROW, #1",
            "adds    DESTINATION, DESTINATION, ROW",
            "lsls    DESTINATION, ROW, #1",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 6
        [
            "lsls    DESTINATION, ROW, #3",
            "subs    DESTINATION, DESTINATION, ROW",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 7
        [
            "lsls    DESTINATION, ROW, #3",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 8
        [
            "lsls    DESTINATION, ROW, #3",
            "adds    DESTINATION, DESTINATION, ROW",
            "adds    DESTINATION, DESTINATION, COLUMN",
        ],                                                      // 9
    ]

    placeArgumentsInRegisters() {
        let instructionSet = this.getInstructionSet(this.elementPrefix);
        let setupCode = "";
        switch (instructionSet) {
            case InstructionSet.x86_64:
                this.xRegister = "%rdi";
                this.yRegister = "%rsi";
                this.aRegister = "%rdx";
                this.bRegister = "%rcx";
                this.mExpressionRegister = "%r8";
                this.nExpressionRegister = "%r9";
                this.teardownCode = "<code>    ret</code><br>"
                this.comment = "#";
                break;
            case InstructionSet.A64:
                this.xRegister = "x0";
                this.yRegister = "x1";
                this.aRegister = "x2";
                this.bRegister = "x3";
                this.mExpressionRegister = "x4";
                this.nExpressionRegister = "x5";
                this.teardownCode = "<code>    ret</code><br>"
                this.comment = "//";
                break;
            case InstructionSet.IA32:
                // TODO: double-check these
                this.xRegister = "%edi";
                this.yRegister = "%esi";
                this.aRegister = "%edx";
                this.bRegister = "%ecx";
                this.mExpressionRegister = "%ebx";
                this.nExpressionRegister = "%ebp";
                this.comment = "#";
                setupCode += "<code>    pushl   %edi</code><br>";
                setupCode += "<code>    pushl   %esi</code><br>";
                setupCode += "<code>    pushl   %ebx</code><br>";
                setupCode += "<code>    pushl   %ebp</code><br>";
                setupCode += "<code>    movl    20(%esp), %edi</code><br>"
                setupCode += "<code>    movl    24(%esp), %esi</code><br>"
                setupCode += "<code>    movl    28(%esp), %edx</code><br>"
                setupCode += "<code>    movl    32(%esp), %ecx</code><br>"
                this.teardownCode = "<code>    popl    %ebp</code><br>";
                this.teardownCode += "<code>    popl    %ebx</code><br>";
                this.teardownCode += "<code>    popl    %esi</code><br>";
                this.teardownCode += "<code>    popl    %edi</code><br>";
                this.teardownCode += "<code>    ret</code><br>"
                break;
            case InstructionSet.T32:
                this.xRegister = "r0";
                this.yRegister = "r1";
                this.aRegister = "r2";
                this.bRegister = "r3";
                this.mExpressionRegister = "r4";
                this.nExpressionRegister = "r5";
                this.comment = "//";
                setupCode += "<code>    push    {r4, r5, lr}</code><br>"
                this.teardownCode = "<code>    pop     {r4, r5, pc}</code><br>";
                break;
            default:
                alert(`Unexpected instructionSet: ${instructionSet}`);
                console.error(`Unexpected instructionSet: ${instructionSet}`);
        }
        setupCode += `<code>                                    ${this.comment} NOTES</code><br>`;
        setupCode += `<code>                                    ${this.comment} x in ${this.xRegister}   y in ${this.yRegister}   A in ${this.aRegister}   B in ${this.bRegister}</code><br>`;
        return setupCode;
    }

    computeIndex(baseAddressRegister, rowRegister, columnRegister, numberOfColumns, destinationRegister) {
        let instructionTemplates;
        let sizeModifier = "";
        let instructionSet = this.getInstructionSet(this.elementPrefix);
        switch (instructionSet) {
            case InstructionSet.x86_64:
            case InstructionSet.IA32:
                instructionTemplates = this.x86InstructionTemplates;
                sizeModifier = instructionSet === InstructionSet.x86_64 ? "q" : "l";
                break;
            case InstructionSet.A64:
                instructionTemplates = this.a64InstructionTemplates;
                break;
            case InstructionSet.T32:
                instructionTemplates = this.t32InstructionTemplates;
                break;
            default:
                alert(`Unexpected instruction set: ${instructionSet}`);
                console.error(`Unexpected instruction set: ${instructionSet}`);
        }
        let code = [];
        instructionTemplates[numberOfColumns].forEach((line) =>
            code.push(line
                .replaceAll("XX", sizeModifier)
                .replaceAll("ROW", rowRegister)
                .replaceAll("COLUMN", columnRegister)
                .replaceAll("DESTINATION", destinationRegister)
            )
        );
        // add HTML
        let htmlCode = "";
        code.forEach((line) => htmlCode += "<code>    " + line.padEnd(32) + this.comment + " </code><input type='text' size='40'><br>");
        return htmlCode;
    }

    generateProblem() {
        this.mAnswerField.value = "";
        this.nAnswerField.value = "";
        this.feedbackArea.innerHTML = "&nbsp;";
        this.M = Math.floor(Math.random() * 7) + 3;
        this.N = Math.floor(Math.random() * 7) + 3;
        this.assemblyArea.innerHTML = "<code>foo:</code><br>";
        this.assemblyArea.innerHTML += this.placeArgumentsInRegisters();
        this.assemblyArea.innerHTML += this.computeIndex(this.aRegister, this.xRegister, this.yRegister, this.N, this.nExpressionRegister);
        this.assemblyArea.innerHTML += this.computeIndex(this.bRegister, this.yRegister, this.xRegister, this.M, this.mExpressionRegister);
        let instructionSet = this.getInstructionSet(this.elementPrefix);
        let code = [];
        switch (instructionSet) {
            case InstructionSet.x86_64:
            case InstructionSet.IA32:
                let sizeModifier = instructionSet === InstructionSet.x86_64 ? "q" : "l";
                let sizeOfLong = instructionSet === InstructionSet.x86_64 ? 8 : 4;
                let destinationRegister = instructionSet === InstructionSet.x86_64 ? "%rax" : "%eax";
                code.push(`mov${sizeModifier}    (${this.aRegister}, ${this.nExpressionRegister}, ${sizeOfLong}), ${destinationRegister}`);
                code.push(`add${sizeModifier}    (${this.bRegister}, ${this.mExpressionRegister}, ${sizeOfLong}), ${destinationRegister}`);
                break;
            case InstructionSet.A64:
                code.push(`ldr     ${this.aRegister}, [${this.aRegister}, ${this.nExpressionRegister}, lsl 3]`);
                code.push(`ldr     ${this.bRegister}, [${this.bRegister}, ${this.mExpressionRegister}, lsl 3]`);
                code.push(`add     x0, ${this.aRegister}, ${this.bRegister}`);
                break;
            case InstructionSet.T32:
                code.push(`lsls    ${this.nExpressionRegister}, ${this.nExpressionRegister}, #2`)
                code.push(`ldr     ${this.aRegister}, [${this.aRegister}, ${this.nExpressionRegister}]`);
                code.push(`lsls    ${this.mExpressionRegister}, ${this.mExpressionRegister}, #2`)
                code.push(`ldr     ${this.bRegister}, [${this.bRegister}, ${this.mExpressionRegister}]`);
                code.push(`adds    r0, ${this.aRegister}, ${this.bRegister}`);
                break;
            default:
                alert(`Unexpected instruction set: ${instructionSet}`);
                console.error(`Unexpected instruction set: ${instructionSet}`);
        }
        code.forEach((line) => this.assemblyArea.innerHTML += "<code>    " + line.padEnd(32) + this.comment + " </code><input type='text' size='40'><br>");
        this.assemblyArea.innerHTML += this.teardownCode;
    }

    checkAnswer() {
        let m = parseInt(this.mAnswerField.value);
        let n = parseInt(this.nAnswerField.value);
        if (isNaN(m) || isNaN(n)) {
            this.feedbackArea.innerHTML = "";
            if (isNaN(m)) {
                this.feedbackArea.innerHTML += `${this.mAnswerField.value} is not a valid number. `;
            }
            if (isNaN(n)) {
                this.feedbackArea.innerHTML += `${this.nAnswerField.value} is not a valid number.`;
            }
            return;
        }
        if (m === this.M && n === this.N) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (m === this.N && n === this.M) {
            this.feedbackArea.innerHTML = `You have the answers reversed. M=${this.M} and N=${this.N}.`;
        } else if (m === this.M) {
            this.feedbackArea.innerHTML = `M=${m} is correct; however, N is not ${n}.`;
        } else if (n === this.N) {
            this.feedbackArea.innerHTML = `N=${n} is correct; however, M is not ${m}.`;
        } else {
            this.feedbackArea.innerHTML = "Neither M nor N are correct.";
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            if (event.target === this.mAnswerField && this.nAnswerField.value.length === 0) {
                this.nAnswerField.focus();
            } else if (event.target === this.nAnswerField && this.mAnswerField.value.length === 0) {
                this.mAnswerField.focus();
            } else {
                this.checkButton.click();
            }
        }
    }
}