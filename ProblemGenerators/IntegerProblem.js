/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class IntegerProblem {
    intermediateSteps;

    constructor(problemSize, operation, groupingSize, elementPrefix) {
        this.problemSize = problemSize;     // how many bits?
        this.operation = operation;
        this.groupingSize = groupingSize;   // how many digits between digit separators?
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
                return ~this.operands[0] & maskForLowerBits(this.problemSize);
            case Operations.And:
                return this.operands[0] & this.operands[1];
            case Operations.Or:
                return this.operands[0] | this.operands[1];
            case Operations.Xor:
                return this.operands[0] ^ this.operands[1];
            case Operations.LeftShift:
                return (this.operands[0] << this.operands[1]) & maskForLowerBits(this.problemSize);
            case Operations.LogicalRightShift:
                return (this.operands[0] >> this.operands[1]) & maskForLowerBits(this.problemSize);
            case Operations.ArithmeticRightShift:
                return (signExtend(this.operands[0], this.problemSize) >> this.operands[1]) & maskForLowerBits(this.problemSize);
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
        this.answer = this.computeAnswer();
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
        let operandNumber = this.numberOfIntermediateSteps - 1;
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
        } else if (value !== this.answer) {     // TODO: can we work on diagnosing the problem here?
            this.feedbackArea.innerHTML = `0b${valueString} is not correct.`;
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
                this.feedbackArea.innerHTML = `You entered the answer backwards. You entered ${answerString}, but the answer is ${reverse(answerString)}`
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
