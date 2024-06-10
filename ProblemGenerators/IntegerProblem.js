/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class IntegerProblem {
    constructor(problemSize, operation, groupingSize, elementPrefix, allowUnlimitedBits = false) {
        this.problemSize = problemSize;     // how many bits?
        this.operation = operation;
        this.groupingSize = groupingSize;   // how many digits between digit separators?
        this.elementPrefix = elementPrefix;
        this.allowUnlimitedBits = allowUnlimitedBits;
        this.problemArea = document.getElementById(elementPrefix + "_problem");
        this.operatorArea = document.getElementById(elementPrefix + "_operator");
        this.answerField = document.getElementById(elementPrefix + "_answer");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        this.operands = []
        switch (operation) {
            case Operations.Invert:
                this.operands.length = 1;
                this.numberOfIntermediateSteps = 2;
                break;
            case Operations.And:
            case Operations.Or:
            case Operations.Xor:
                this.operands.length = 2;
                this.numberOfIntermediateSteps = 3;
                break;
            case Operations.LeftShift:
            case Operations.LogicalRightShift:
            case Operations.ArithmeticRightShift:
                this.operands.length = 2;
                this.numberOfIntermediateSteps = 2;
                break;
            case Operations.Addition:
                this.operands.length = 2;
                this.numberOfIntermediateSteps = 4;
                break;
            case Operations.Subtraction:
                this.operands.length = 2;
                this.numberOfIntermediateSteps = 6;
                break;
            case Operations.Multiplication:
            case Operations.Division:
                this.operands.length = 2;
                this.numberOfIntermediateSteps = 4;
                break;
            case Operations.UserSelected:
                this.operands.length = 2;
                if ([Operations.LeftShift, Operations.LogicalRightShift, Operations.ArithmeticRightShift]
                    .includes(Symbol.for(document.getElementById(elementPrefix + "_user_selection0").value))) {
                    this.numberOfIntermediateSteps = 2;
                    this.shiftAmount = document.getElementById(elementPrefix + "_amount");
                } else if ([Operations.And, Operations.Or, Operations.Xor]
                    .includes(Symbol.for(document.getElementById(elementPrefix + "_user_selection0").value))) {
                    this.numberOfIntermediateSteps = 3;
                } else {
                    alert("UserSelected operation for an unexpected operation set!")
                }
                break;
            default:
                alert(operation + "is not yet implemented!");
                return;
        }
        this.intermediateSteps = [];
        for (let i = 0; i < this.numberOfIntermediateSteps; i++) {
            let intermediateStep = document.getElementById(elementPrefix + "_intermediate" + i);
            this.intermediateSteps.push(intermediateStep);
            intermediateStep.onkeydown = (event) => this.handleKeyPressInIntermediateStep(event, i);
        }
        this.answerField.onkeydown = this.handleKeyPressInAnswer.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.intermediateSteps[0].onblur = (event) => this.checkInitialConversion(event, 0);
        if (this.operands.length === 2) {
            this.intermediateSteps[1].onblur = (event) => this.checkInitialConversion(event, 1);
        }
        this.intermediateSteps[this.numberOfIntermediateSteps - 1].onblur = this.checkPenultimateAnswer.bind(this);
        if (operation === Operations.UserSelected) {
            let i = 0;
            let selectionButton;
            do {
                selectionButton = document.getElementById(elementPrefix + "_user_selection" + i);
                if (selectionButton != null) {
                    selectionButton.onchange = this.setOperation.bind(this);
                    if (i === 0) {
                        selectionButton.click();
                    }
                }
                i++;
            } while (selectionButton !== null);
        } else {
            this.generateProblem();
        }
    }

    computeAnswer() {
        switch (this.operation) {
            case Operations.Invert:
                return ~this.operands[0];
            case Operations.And:
                return this.operands[0] & this.operands[1];
            case Operations.Or:
                return this.operands[0] | this.operands[1];
            case Operations.Xor:
                return this.operands[0] ^ this.operands[1];
            case Operations.LeftShift:
                return (this.operands[0] << this.operands[1]);
            case Operations.LogicalRightShift:
                return (this.operands[0] >> this.operands[1]);
            case Operations.ArithmeticRightShift:
                return (signExtend(this.operands[0], this.problemSize) >> this.operands[1]);
            case Operations.Addition:
                return (this.operands[0] + this.operands[1]);
            case Operations.Subtraction:
                return (this.operands[0] - this.operands[1]);
            case Operations.Multiplication:
                return (this.operands[0] * this.operands[1]);
            case Operations.Division:
                return Math.floor(this.operands[0] / this.operands[1]);
            default:
                alert("computeAnswer has not yet implemented " + this.operation.valueOf().toString() + "!");
                return null;
        }
    }

    generateProblem() {
        this.problemArea.innerHTML = "Compute:&nbsp;&nbsp;";
        for (let i = 0; i < this.operands.length; i++) {
            if (i === this.operands.length - 1
                && [Operations.LeftShift, Operations.LogicalRightShift, Operations.ArithmeticRightShift].includes(this.operation)) {
                this.operands[i] = Math.floor(Math.random() * (this.problemSize + 1));
                this.shiftAmount.innerHTML = this.operands[i];
            } else {
                this.operands[i] = Math.floor(Math.random() * (1 << this.problemSize));
            }
            let valueString = this.operands[i].toString(16).toUpperCase().padStart(this.problemSize / 4, "0");
            if (this.groupingSize > 0) {
                valueString = insertDigitSeparators(valueString, this.groupingSize);
            }
            if (i === this.operands.length - 1) {
                this.problemArea.innerHTML += OpSymbols.get(this.operation) + " ";
                if ([Operations.LeftShift, Operations.LogicalRightShift, Operations.ArithmeticRightShift].includes(this.operation)) {
                    this.problemArea.innerHTML += this.operands[1];
                } else {
                    this.problemArea.innerHTML += "0x" + valueString + " ";
                }
            } else {
                this.problemArea.innerHTML += "0x" + valueString + " ";
            }
        }
        this.operatorArea.innerHTML = OpSymbols.get(this.operation) + "&nbsp;";
        this.answerField.value = "";
        this.feedbackArea.innerHTML = "&nbsp;";
        for (let i = 0; i < this.numberOfIntermediateSteps; i++) {
            this.intermediateSteps[i].value = "";
        }
        this.unlimited_bits_answer = this.computeAnswer();
        this.answer = this.allowUnlimitedBits ? this.unlimited_bits_answer : this.unlimited_bits_answer & maskForLowerBits(this.problemSize);
    }

    setOperation(event) {
        this.operation = Symbol.for(event.target.value);
        this.generateProblem();
    }

    checkInitialConversion(event, operandNumber) {
        let valueString = this.intermediateSteps[operandNumber].value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.intermediateSteps[operandNumber].value = valueString.padStart(this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else if (value !== this.operands[operandNumber]) {
            this.feedbackArea.innerHTML = `0x${this.operands[operandNumber].toString(16)} != 0b${valueString}`;
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkPenultimateAnswer(event) {
        let stepNumber = this.numberOfIntermediateSteps - 1;
        let valueString = this.intermediateSteps[stepNumber].value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.intermediateSteps[stepNumber].value = valueString.padStart(this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else if (value !== this.answer) {
            if (parseInt(reverse(valueString), 2) === this.answer) {
                this.feedbackArea.innerHTML = `You entered the answer backwards. You entered ${valueString}, but the answer is ${reverse(valueString)}.`
            } else if (!this.allowUnlimitedBits && value === this.unlimited_bits_answer) {
                this.feedbackArea.innerHTML = `You made the correct computation but didn't limit the answer to ${this.problemSize} bits.`
            } else if (this.allowUnlimitedBits && value === (this.answer & maskForLowerBits(this.problemSize))) {
                this.feedbackArea.innerHTML = `Your answer matches the lower ${this.problemSize} bits of the correct answer. This problem allows unlimited bits in the answer.`
            } else {     // TODO: what else can we do to diagnose the problem?
                this.feedbackArea.innerHTML = `0b${valueString} is not correct.`;
            }
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkAnswer(event) {
        let answerString = this.answerField.value;
        if (answerString.substring(0, 2).toLowerCase() === "0x") {
            // handleKeyPress() should not allow this to happen, but it doesn't hurt to program defensively
            answerString = answerString.substring(2);
        }
        answerString = answerString.replaceAll("'", "");
        let answer = parseInt(answerString, 16);
        if (answer === this.answer) {
            this.feedbackArea.innerHTML = "Correct!";
        } else {
            // let's see if we can diagnose the problem
            if (isNaN(answer)) {
                // also should be made impossible by handleKeyPress()
                this.feedbackArea.innerHTML = `${answerString} is not a valid base-16 value. Try again.`;
            } else if (parseInt(reverse(answerString), 16) === this.answer) {
                this.feedbackArea.innerHTML = `You entered the answer backwards. You entered ${answerString}, but the answer is ${reverse(answerString)}.`
            } else if (!this.allowUnlimitedBits && answer === this.unlimited_bits_answer) {
                this.feedbackArea.innerHTML = `You made the correct computation but didn't limit the answer to ${this.problemSize} bits.`
            } else if (this.allowUnlimitedBits && answer === (this.answer & maskForLowerBits(this.problemSize))) {
                this.feedbackArea.innerHTML = `Your answer matches the lower ${this.problemSize} bits of the correct answer. This problem allows unlimited bits in the answer.`
            } else if (this.intermediateSteps[this.numberOfIntermediateSteps - 1].value.length > 0) {
                let intermediateAnswerString = this.intermediateSteps[this.numberOfIntermediateSteps - 1].value;
                if (intermediateAnswerString.substring(0, 2).toLowerCase() === "0b") {
                    intermediateAnswerString = intermediateAnswerString.substring(2);
                }
                intermediateAnswerString = intermediateAnswerString.replaceAll("'", "");
                let intermediateAnswer = parseInt(intermediateAnswerString, 2);
                if (intermediateAnswer !== answer) {
                    this.feedbackArea.innerHTML = `0b${this.intermediateSteps[this.numberOfIntermediateSteps - 1].value} != 0x${this.answerField.value}`;
                }
            } else {
                // we couldn't diagnose the problem
                this.feedbackArea.innerHTML = "0x" + answerString + " is not correct. Try again.";
            }
        }
    }

    handleKeyPressInIntermediateStep(event, intermediateStep) {
        if (event.key.length === 1 && event.key !== '\'') {             // ignore non-character keys and digit separators
            if (!["0", "1"].includes(event.key)) {
                this.feedbackArea.innerHTML = `${event.key} is not a base-2 digit.`;
                setTimeout(() => {
                    let partialAnswer = this.intermediateSteps[intermediateStep].value;
                    this.intermediateSteps[intermediateStep].value = partialAnswer.substring(0, partialAnswer.length - 1);
                    this.feedbackArea.innerHTML = "&nbsp;";
                }, 1000);
            }
        }
    }

    handleKeyPressInAnswer(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        } else if (event.key.length === 1 && event.key !== '\'') {      // ignore non-character keys and digit separators
            let digit = parseInt(event.key.toUpperCase(), 16);
            if (isNaN(digit)) {
                this.feedbackArea.innerHTML = `${event.key} is not a base-16 digit.`;
                setTimeout(() => {
                    let partialAnswer = this.answerField.value;
                    this.answerField.value = partialAnswer.substring(0, partialAnswer.length - 1);
                    this.feedbackArea.innerHTML = "&nbsp;";
                }, 1000);
            }
        }
    }
}


class OverflowProblem extends IntegerProblem {
    constructor(problemSize, operation, groupingSize, elementPrefix, numberEncoding) {
        super(problemSize, operation, groupingSize, elementPrefix, false);
        this.numberEncoding = numberEncoding;
        this.intermediateSteps[2].onblur = (event) => this.checkInitialCarryIn(event);
        if (operation === Operations.Subtraction) {
            this.intermediateSteps[3].onblur = (event) => this.checkReExpression(event, 0);
            this.intermediateSteps[4].onblur = (event) => this.checkReExpression(event, 1);
        }
        let i = 0;
        let overflowAnswer;
        do {
            overflowAnswer = document.getElementById(elementPrefix + "_overflow" + i);
            if (overflowAnswer !== null) {
                overflowAnswer.onchange = this.checkOverflow.bind(this);
            }
            i++;
        } while (overflowAnswer !== null);
    }

    generateProblem() {
        super.generateProblem();
        let i = 0;
        let overflowAnswer;
        do {
            overflowAnswer = document.getElementById(this.elementPrefix + "_overflow" + i);
            if (overflowAnswer !== null) {
                overflowAnswer.checked = false;
            }
            i++
        } while (overflowAnswer !== null);
    }

    checkInitialCarryIn(event) {
        let carryIn = this.intermediateSteps[2].value;
        if (carryIn.length === 0) {
            return;
        }
        if (this.operation === Operations.Addition && carryIn !== "0") {
            this.feedbackArea.innerHTML = "The initial carry-in during addition is always 0."
        } else if (this.operation === Operations.Subtraction && carryIn !== "1") {
            this.feedbackArea.innerHTML = "When converting subtraction to addition, the initial carry-in becomes 1."
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkReExpression(event, operandNumber) {
        if (this.operation !== Operations.Subtraction) {
            return;
        }
        let valueString = this.intermediateSteps[operandNumber + 3].value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.intermediateSteps[operandNumber + 3].value = valueString.padStart(this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        let operand = this.operands[operandNumber];
        let errorMessage = "When converting subtraction to addition, ";
        if (operandNumber === 0) {
            errorMessage += "the first operand remains unchanged."
        } else if (operandNumber === 1) {
            operand = ~operand & maskForLowerBits(this.problemSize);
            errorMessage += "take the bitwise complement of the second operand."
        }
        if (value !== operand) {
            this.feedbackArea.innerHTML = errorMessage;
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkAnswer(event) {
        super.checkAnswer(event);
        let signMask = 1 << (this.problemSize - 1);
        if (this.feedbackArea.innerHTML === "Correct!") {
            this.feedbackArea.innerHTML +=
                " 0x" + this.operands[0].toString(16).toUpperCase()
                + " " + OpSymbols.get(this.operation)
                + " 0x" + this.operands[1].toString(16).toUpperCase()
                + " = 0x" + this.answer.toString(16).toUpperCase()
                + " (or, " + (this.numberEncoding === NumberEncoding.TwosComplement && (this.operands[0] & signMask) !== 0 ? this.operands[0] - (1 << this.problemSize) : this.operands[0]) + "<sub>10</sub> "
                + OpSymbols.get(this.operation) + " "
                + (this.numberEncoding === NumberEncoding.TwosComplement && (this.operands[1] & signMask) !== 0 ? this.operands[1] - (1 << this.problemSize) : this.operands[1]) + "<sub>10</sub> = "
                + (this.numberEncoding === NumberEncoding.TwosComplement && (this.answer & signMask) !== 0 ? this.answer - (1 << this.problemSize) : this.answer) + "<sub>10</sub>)";
        }
    }

    checkOverflow(event) {
        let overflowChoice = (event.target.value.toLowerCase() === "true");
        let overflow;
        if (this.numberEncoding === NumberEncoding.UnsignedInteger) {
            if (this.operation === Operations.Addition) {
                overflow = (this.answer < this.operands[0]);
            } else if (this.operation === Operations.Subtraction) {
                overflow = (this.answer > this.operands[0]);
            }
        } else if (this.numberEncoding === NumberEncoding.TwosComplement) {
            let signMask = 1 << (this.problemSize - 1);
            if (this.operation === Operations.Addition) {
                overflow = ((this.operands[0] & signMask) === (this.operands[1] & signMask)) && ((this.operands[0] & signMask) !== (this.answer & signMask));
            } else if (this.operation === Operations.Subtraction) {
                overflow = ((this.operands[0] & signMask) === (~this.operands[1] & signMask)) && ((this.operands[0] & signMask) !== (this.answer & signMask));
            }
        }
        if (overflow === overflowChoice) {
            this.feedbackArea.innerHTML = `Correct! Overflow ${overflow ? "did" : "did not"} occur.`
        } else {
            this.feedbackArea.innerHTML = `Incorrect -- overflow ${overflow ? "did" : "did not"} occur.`
        }
    }
}


class PowerOfTwoProblem extends IntegerProblem {
    constructor(problemSize, operation, groupingSize, elementPrefix) {
        super(problemSize, operation, groupingSize, elementPrefix);
        if (this.operation === Operations.Multiplication) {
            this.numberOfIntermediateSteps = 5;
        }
        if (this.operation === Operations.Division) {
            this.numberOfIntermediateSteps = 4;
        }
        this.intermediateSteps = [];
        for (let i = 0; i < this.numberOfIntermediateSteps; i++) {
            let intermediateStep = document.getElementById(elementPrefix + "_intermediate" + i);
            this.intermediateSteps.push(intermediateStep);
        }
        this.intermediateSteps[1].onkeydown = null;
        this.intermediateSteps[2].onkeydown = null;
        this.intermediateSteps[2].onblur = this.checkOperator.bind(this);
        if (this.operation === Operations.Multiplication) {
            this.intermediateSteps[3].onkeydown = (event) => this.handleKeyPressInIntermediateStep(event, 3);
            this.intermediateSteps[3].onblur = this.checkAntePenultimateAnswer.bind(this);
        }
        this.intermediateSteps[this.numberOfIntermediateSteps - 1].onkeydown = (event) => this.handleKeyPressInIntermediateStep(event, 4);
        this.intermediateSteps[this.numberOfIntermediateSteps - 1].onblur = this.checkPenultimateAnswer.bind(this);
    }

    generateProblem() {
        super.generateProblem();
        this.operatorArea.innerHTML = "&nbsp;";
        let shiftAmount = Math.floor(Math.random() * this.problemSize) + 1;
        this.operands[1] = (1 << shiftAmount);
        let valueString = this.operands[0].toString(16).toUpperCase().padStart(this.problemSize / 4, "0");
        if (this.groupingSize > 0) {
            valueString = insertDigitSeparators(valueString, this.groupingSize);
        }
        this.problemArea.innerHTML = "Compute:&nbsp;&nbsp;0x" + valueString + " " + OpSymbols.get(this.operation) + " 0x";
        valueString = this.operands[1].toString(16).toUpperCase().padStart(this.problemSize / 4, "0");
        if (this.groupingSize > 0) {
            valueString = insertDigitSeparators(valueString, this.groupingSize);
        }
        this.problemArea.innerHTML += valueString;
        for (let i = 0; i < this.numberOfIntermediateSteps; i++) {
            this.intermediateSteps[i].value = "";
        }
        this.unlimited_bits_answer = this.computeAnswer();
        this.answer = this.unlimited_bits_answer & maskForLowerBits(this.problemSize);
    }

    checkOperator(event) {
        let operator = this.intermediateSteps[2].value;
        if (operator.length === 0) {
            return;
        }
        if (this.operation === Operations.Multiplication && operator !== "<<") {
            this.feedbackArea.innerHTML = "Use left-shift when multiplying by a power of two.";
        } else if (this.operation === Operations.Division && operator !== ">>") {
            this.feedbackArea.innerHTML = "Use right-shift when dividing by a power of two.";
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkInitialConversion(event, operandNumber) {
        if (operandNumber === 0) {
            super.checkInitialConversion(event, operandNumber);
        } else {
            let valueString = this.intermediateSteps[operandNumber].value;
            if (valueString.length === 0) {
                return; // nothing to check
            }
            let valueStringWithoutSeparators = valueString.replaceAll("'", "");
            let correctShiftAmount = Math.floor(Math.log2(this.operands[operandNumber]));
            let shiftAmount = parseInt(valueStringWithoutSeparators, 10);
            if (shiftAmount === correctShiftAmount) {
                this.feedbackArea.innerHTML = "&nbsp;";
            } else {
                if ((valueStringWithoutSeparators.substring(0, 2).toLowerCase() === "0b") || (valueStringWithoutSeparators.substring(0, 2).toLowerCase() === "0x")) {
                    valueStringWithoutSeparators = valueStringWithoutSeparators.substring(2);
                }
                if (parseInt(valueStringWithoutSeparators, 16) === correctShiftAmount) {
                    this.feedbackArea.innerHTML = "Your shift amount is expressed in hexadecimal. For clarity, consider expressing the shift amount in decimal.";
                } else if (parseInt(valueStringWithoutSeparators, 2) === correctShiftAmount) {
                    this.feedbackArea.innerHTML = "Your shift amount is expressed in binary. For clarity, consider expressing the shift amount in decimal.";
                } else {
                    this.feedbackArea.innerHTML = `lg(${this.operands[operandNumber]}) != ${shiftAmount}`
                }
            }
        }
    }

    checkAntePenultimateAnswer(event) {
        let stepNumber = this.numberOfIntermediateSteps - 2;
        let valueString = this.intermediateSteps[stepNumber].value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else if (value !== this.unlimited_bits_answer) {
            if (parseInt(reverse(valueString), 2) === this.allowUnlimitedBits) {
                this.feedbackArea.innerHTML = `You entered the answer backwards. You entered ${valueString}, but the answer is ${reverse(valueString)}.`
            } else if (value === this.answer) {
                this.feedbackArea.innerHTML = `Your unlimited-bit result matches the answer for the ${this.problemSize}-bit result.`
            } else {     // TODO: what else can we do to diagnose the problem?
                this.feedbackArea.innerHTML = `0b${valueString} is not correct.`;
            }
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkAnswer(event) {
        super.checkAnswer(event);
        if (this.feedbackArea.innerHTML === "Correct!") {
            this.feedbackArea.innerHTML +=
                " 0x" + this.operands[0].toString(16).toUpperCase()
                + " " + OpSymbols.get(this.operation)
                + " 0x" + this.operands[1].toString(16).toUpperCase()
                + " = 0x" + this.unlimited_bits_answer.toString(16).toUpperCase()
                + " (or, " + this.operands[0] + "<sub>10</sub> "
                + OpSymbols.get(this.operation) + " "
                + this.operands[1] + "<sub>10</sub> = "
                + this.unlimited_bits_answer + "<sub>10</sub>)";
            if (this.operation === Operations.Multiplication) {
                this.feedbackArea.innerHTML += ", but when limited to " + this.problemSize + " bits, the product is "
                    + "0x" + this.answer.toString(16).toUpperCase()
                    + " = " + this.answer + "<sub>10</sub>";
            }
        }
    }
}

class LongMultiplication extends IntegerProblem {
    constructor(problemSize, groupingSize, elementPrefix, allowUnlimitedBits = false) {
        super(problemSize, Operations.Multiplication, groupingSize, elementPrefix, allowUnlimitedBits);
        this.numberOfIntermediateSteps = problemSize + 3;
        this.intermediateSteps = [];
        for (let i = 0; i < this.numberOfIntermediateSteps; i++) {
            let intermediateStep = document.getElementById(elementPrefix + "_intermediate" + i);
            this.intermediateSteps.push(intermediateStep);
            intermediateStep.onkeydown = (event) => this.handleKeyPressInIntermediateStep(event, i);
            if (1 < i && i < this.numberOfIntermediateSteps - 1) {
                intermediateStep.onblur = (event) => this.checkIntermediateProduct(event, i);
            }
        }
        this.intermediateSteps[this.numberOfIntermediateSteps - 1].onblur = this.checkPenultimateAnswer.bind(this);
    }

    generateProblem() {
        super.generateProblem();
        for (let i = 2; i < this.numberOfIntermediateSteps - 1; i++) {
            document.getElementById(this.elementPrefix + "_intermediate_problem" + i).innerHTML = "&nbsp;"
        }
        this.correctConversions = [false, false];
    }

    populateIntermediateMultiplications() {
        let initialConversionFinished = this.correctConversions[0] && this.correctConversions[1];
        for (let i = 2; i < this.numberOfIntermediateSteps - 1; i++) {
            let intermediateProblemSpace = document.getElementById(this.elementPrefix + "_intermediate_problem" + i);
            if (initialConversionFinished) {
                let multiplierBitPosition = i - 2;
                let multiplicand = this.operands[0].toString(2).padStart(this.problemSize, "0");
                let multiplier = (this.operands[1] & (1 << multiplierBitPosition)).toString(2).padStart(this.problemSize, "0");
                intermediateProblemSpace.innerHTML = "0b" + multiplicand + " × 0b" + multiplier;
            } else {
                intermediateProblemSpace.innerHTML = "&nbsp;";
            }
        }
    }

    checkInitialConversion(event, operandNumber) {
        super.checkInitialConversion(event, operandNumber);
        this.correctConversions[operandNumber] = (this.feedbackArea.innerHTML === "&nbsp;" && this.intermediateSteps[operandNumber].value.length > 0);
        this.populateIntermediateMultiplications();
    }

    checkIntermediateProduct(event, stepNumber) {
        let multiplierBitPosition = stepNumber - 2;
        let valueString = this.intermediateSteps[stepNumber].value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.intermediateSteps[stepNumber].value = valueString.padStart(2 * this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else if (value !== this.operands[0] * (this.operands[1] & (1 << multiplierBitPosition))) {
            let multiplicand = this.operands[0].toString(2).padStart(this.problemSize, "0");
            let multiplier = (this.operands[1] & (1 << multiplierBitPosition)).toString(2).padStart(this.problemSize, "0");
            this.feedbackArea.innerHTML = `0b${multiplicand} × 0b${multiplier} != 0b${this.intermediateSteps[stepNumber].value}`;
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkAnswer(event) {
        super.checkAnswer(event);
        if (this.feedbackArea.innerHTML === "Correct!") {
            this.feedbackArea.innerHTML +=
                " 0x" + this.operands[0].toString(16).toUpperCase()
                + " " + OpSymbols.get(this.operation)
                + " 0x" + this.operands[1].toString(16).toUpperCase()
                + " = 0x" + this.unlimited_bits_answer.toString(16).toUpperCase()
                + " (or, " + this.operands[0] + "<sub>10</sub> "
                + OpSymbols.get(this.operation) + " "
                + this.operands[1] + "<sub>10</sub> = "
                + this.unlimited_bits_answer + "<sub>10</sub>)";
        }
    }
}
