/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class RadixConversionProblem {

    constructor(problemSize, initialRadix, finalRadix, groupingSize, elementPrefix) {
        this.problemSize = problemSize;     // how many bits?
        this.initialRadix = initialRadix;
        this.finalRadix = finalRadix;
        this.groupingSize = groupingSize;   // how many digits between digit separators?
        this.elementPrefix = elementPrefix;
        this.problemArea = document.getElementById(elementPrefix + "_problem");
        this.answerField = document.getElementById(elementPrefix + "_answer");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        document.getElementById(elementPrefix + "_prefix").innerHTML = radixPrefixes[finalRadix];
        this.answerField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.generateProblem();
    }

    problemValueToString() {
        let valueString = this.value.toString(this.initialRadix).toUpperCase();
        if ([1, 2, 4, 8, 16, 32].includes(this.initialRadix)) {
            // we'll zero-extend when and only when the radix is a power-of-two
            valueString = valueString.padStart(this.problemSize / Math.log2(this.initialRadix), "0");
        }
        return valueString;
    }

    generateProblem() {
        this.value = Math.floor(Math.random() * (1 << this.problemSize));
        let valueString = this.problemValueToString();
        if (this.groupingSize > 0) {
            valueString = insertDigitSeparators(valueString, this.groupingSize);
        }
        this.problemArea.innerHTML = "Convert " + radixPrefixes[this.initialRadix] + valueString + " from " + radixNames[this.initialRadix] + " to " + radixNames[this.finalRadix] + ":";
        this.answerField.value = "";
        this.feedbackArea.innerHTML = "&nbsp;";
    }

    checkAnswer() {
        let answerString = this.answerField.value;
        if ((this.finalRadix === 16 && answerString.substring(0, 2).toLowerCase() === "0x")
            || (this.finalRadix === 2 && answerString.substring(0, 2).toLowerCase() === "0b")) {
            // handleKeyPress() should not allow this to happen, but it doesn't hurt to program defensively
            answerString = answerString.substring(2);
        }
        answerString = answerString.replaceAll("'", "");
        let answer = parseInt(answerString, this.finalRadix);
        if (answer === this.value) {
            this.feedbackArea.innerHTML = "Correct!";
        } else {
            // let's see if we can diagnose the problem
            if (isNaN(answer)) {
                // also should be made impossible by handleKeyPress()
                this.feedbackArea.innerHTML = `${answerString} is not a valid base-${this.finalRadix} value. Try again.`;
            } else if (parseInt(reverse(answerString), this.finalRadix) === this.value) {
                this.feedbackArea.innerHTML = `You entered the answer backwards. You entered ${answerString}, but the answer is ${reverse(answerString)}`
            } else {
                // we couldn't diagnose the problem
                this.feedbackArea.innerHTML = answerString + " is not correct. Try again.";
            }
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        } else if (event.key.length === 1 && event.key !== '\'') {      // ignore non-character keys and digit separators
            let digit = parseInt(event.key.toUpperCase(), this.finalRadix);
            if (isNaN(digit)) {
                this.feedbackArea.innerHTML = `${event.key} is not a base-${this.finalRadix} digit.`;
                setTimeout(() => {
                    let partialAnswer = this.answerField.value;
                    this.answerField.value = partialAnswer.substring(0, partialAnswer.length - 1);
                    this.feedbackArea.innerHTML = "&nbsp;";
                }, 1000);
            }
        }
    }
}


class GuidedConversionToDecimal extends RadixConversionProblem {
    constructor(problemSize, initialRadix, groupingSize, elementPrefix) {
        super(problemSize, initialRadix, 10, groupingSize, elementPrefix);
        let problemStringLength = this.problemValueToString().length;
        for (let i = 0; i < problemStringLength; i++) {
            let prompt = document.getElementById(this.elementPrefix + "_prompt" + i);
            prompt.innerHTML = `bit<sub>${i}</sub>`;            // TODO: assumes initially binary
            let digitField = document.getElementById(this.elementPrefix + "_digit" + i);
            digitField.onblur = (event) => this.handleFocusLossInDigit(event, i);
            let weightField = document.getElementById(this.elementPrefix + "_weight" + i);
            weightField.onblur = (event) => this.handleFocusLossInWeight(event, i);
            let contributionField = document.getElementById(this.elementPrefix + "_contribution" + i);
            contributionField.onblur = (event) => this.handleFocusLossInContribution(event, i);
        }
    }

    generateProblem() {
        super.generateProblem();
        let problemStringLength = this.problemValueToString().length;
        for (let i = 0; i < problemStringLength; i++) {
            let digitField = document.getElementById(this.elementPrefix + "_digit" + i);
            digitField.value = "";
            let weightField = document.getElementById(this.elementPrefix + "_weight" + i);
            weightField.value = "";
            let contributionField = document.getElementById(this.elementPrefix + "_contribution" + i);
            contributionField.value = "";
            let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + i);
            feedbackArea.innerHTML = "&nbsp;";
        }
    }

    handleFocusLossInDigit(event, digitPosition) {
        let digitField = document.getElementById(this.elementPrefix + "_digit" + digitPosition);
        let digit = parseInt(digitField.value, this.initialRadix);  // TODO: handle initialRadix digit *or* finalRadix value
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (digitField.value.length !== 0) {
            if (isNaN(digit)) {
                feedbackArea.innerHTML = `${digitField.value} is not a base-${this.initialRadix} digit.`;
                digitField.value = "";
                digitField.focus();
            } else {
                let valueString = this.value.toString(this.initialRadix).padStart(this.problemSize * 2 / this.initialRadix, "0");
                let stringPosition = valueString.length - 1 - digitPosition;
                let correctDigitString = valueString.substring(stringPosition, stringPosition + 1);
                let correctDigitValue = parseInt(correctDigitString, this.initialRadix);
                if (digit !== correctDigitValue) {
                    feedbackArea.innerHTML = `${digitField.value} is not the correct base-${this.initialRadix} digit.`;
                    digitField.value = "";
                    digitField.focus();
                }
            }
        }
    }

    handleFocusLossInWeight(event, digitPosition) {
        let weightField = document.getElementById(this.elementPrefix + "_weight" + digitPosition);
        let weight = parseInt(weightField.value, this.finalRadix);
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (weightField.value.length !== 0) {
            if (isNaN(weight) || weight !== this.initialRadix ** digitPosition) {
                feedbackArea.innerHTML = isNaN(weight)
                    ? `${weightField.value} is not a base-${this.finalRadix} value.`
                    : `${this.initialRadix}<sup>${digitPosition}</sup> ≠ ${weight}`;
                weightField.value = "";
                weightField.focus();
            }
        }
    }

    handleFocusLossInContribution(event, digitPosition) {
        let digitField = document.getElementById(this.elementPrefix + "_digit" + digitPosition);
        let digit = parseInt(digitField.value, this.initialRadix);
        let weightField = document.getElementById(this.elementPrefix + "_weight" + digitPosition);
        let weight = parseInt(weightField.value, this.finalRadix);
        let contributionField = document.getElementById(this.elementPrefix + "_contribution" + digitPosition);
        let contribution = parseInt(contributionField.value, this.finalRadix);
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (contributionField.value.length !== 0) {
            if (isNaN(contribution) || contribution !== digit * weight) {
                feedbackArea.innerHTML = isNaN(contribution)
                    ? `${contributionField.value} is not a base-${this.finalRadix} value.`
                    : `${digit}<sub>${this.initialRadix}</sub> × ${weight}<sub>${this.finalRadix}</sub> ≠ ${contribution}<sub>${this.finalRadix}</sub>`;
                contributionField.value = "";
                contributionField.focus();
            }
        }
    }
}


class GuidedConversionFromDecimal extends RadixConversionProblem {
    constructor(problemSize, finalRadix, groupingSize, elementPrefix, operation) {
        super(problemSize, 10, finalRadix, groupingSize, elementPrefix);
        this.operation = operation;
        for (let i = 0; i < problemSize; i++) {     // TODO: assumes finally binary
            let resultField = document.getElementById(this.elementPrefix + "_result" + i);
            resultField.onblur = (event) => this.handleFocusLossInResult(event, i);
            if (this.operation === Operations.Subtraction) {
                let operatorField = document.getElementById(this.elementPrefix + "_operator" + i);
                operatorField.onblur = (event) => this.handleFocusLossInOperation(event, i);
                let operandField = document.getElementById(this.elementPrefix + "_operand" + i);
                operandField.onblur = (event) => this.handleFocusLossInOperation(event, i);
            } else if (operation === Operations.Division) {
                let remainderField = document.getElementById(this.elementPrefix + "_remainder" + i);
                remainderField.onblur = (event) => this.handleFocusLossInRemainder(event, i);
            }
        }
    }

    performArithmetic(leftOperand, rightOperand) {
        switch (this.operation) {
            case Operations.Subtraction:
                return leftOperand - rightOperand;
            case Operations.Division:
                return Math.floor(leftOperand / rightOperand);
            default:
                return NaN;
        }
    }

    generateProblem() {
        super.generateProblem();
        let valueField;
        for (let i = 0; i < this.problemSize; i++) {     // TODO: assumes finally binary
            valueField = document.getElementById(this.elementPrefix + "_value" + i);
            valueField.innerHTML = "";
            let resultField = document.getElementById(this.elementPrefix + "_result" + i);
            resultField.value = "";
            if (this.operation === Operations.Subtraction) {
                let operatorField = document.getElementById(this.elementPrefix + "_operator" + i);
                operatorField.value = "";
                let operandField = document.getElementById(this.elementPrefix + "_operand" + i);
                operandField.value = "";
            } else if (this.operation === Operations.Division) {
                let remainderField = document.getElementById(this.elementPrefix + "_remainder" + i);
                remainderField.value = "";
            }
            let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + i);
            feedbackArea.innerHTML = "&nbsp;";
        }
        valueField = document.getElementById(this.elementPrefix + "_value0");
        valueField.innerHTML = this.value.toString(this.initialRadix);
    }

    handleFocusLossInOperation(event, digitPosition) {
        let operatorField = document.getElementById(this.elementPrefix + "_operator" + digitPosition);
        let operator = operatorField.value;
        let operandField = document.getElementById(this.elementPrefix + "_operand" + digitPosition);
        let operand = parseInt(operandField.value, this.initialRadix);
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (operator.length !== 0) {
            if (operator !== "<" && operator !== "-") {
                feedbackArea.innerHTML = `Inappropriate operator: ${operator}. Use '<' or '-'.`
                operatorField.value = "";
                operatorField.focus();
            }
        }
        if (operandField.value.length !== 0) {
            if (isNaN(operand)) {
                feedbackArea.innerHTML = `${operandField.value} is not a base-${this.initialRadix} value.`;
                operandField.value = "";
                operandField.focus();
            } else {
                let exponent;
                if (digitPosition === 0) {
                    exponent = this.problemSize - 1;
                    let minimalExponent = Math.floor(Math.log2(this.value));
                    if (operand !== 2 ** exponent && operand === 2 ** minimalExponent) {
                        exponent = minimalExponent;
                    }
                } else {
                    let previousOperandField = document.getElementById(this.elementPrefix + "_operand" + (digitPosition - 1));
                    let previousOperand = parseInt(previousOperandField.value, this.initialRadix);
                    exponent = Math.log2(previousOperand / 2);
                }
                let expectedValue = exponent >= 0 ? 2 ** exponent : 0;
                if (operand !== expectedValue) {
                    feedbackArea.innerHTML = `${this.finalRadix}<sup>${exponent}</sup> ≠ ${operand}`
                    operandField.innerHTML = ""
                    operandField.focus();
                } else if (operator === "<") {
                    let valueField = document.getElementById(this.elementPrefix + "_value" + digitPosition);
                    let value = parseInt(valueField.innerHTML, this.initialRadix);
                    if (value >= operand) {
                        feedbackArea.innerHTML = `${value} &ge; ${operand}`
                        operatorField.value = "";
                        operatorField.focus();
                    } else if (digitPosition < this.problemSize - 1) {     // TODO: assumes finally binary
                        let nextValueField = document.getElementById(this.elementPrefix + "_value" + (digitPosition + 1));
                        nextValueField.innerHTML = valueField.innerHTML;
                    }
                }
            }
        }
    }

    handleFocusLossInResult(event, digitPosition) {
        let valueField = document.getElementById(this.elementPrefix + "_value" + digitPosition);
        let value = parseInt(valueField.innerHTML, this.initialRadix);
        let operand;
        let operatorSymbol;
        if (this.operation === Operations.Subtraction) {
            let operandField = document.getElementById(this.elementPrefix + "_operand" + digitPosition);
            operand = parseInt(operandField.value, this.initialRadix);
            operatorSymbol = "-";
        } else if (this.operation === Operations.Division) {
            operand = 2;
            operatorSymbol = "÷";
        } else {
            operand = NaN;
            operatorSymbol = "?";
        }
        let resultField = document.getElementById(this.elementPrefix + "_result" + digitPosition);
        let result = parseInt(resultField.value, this.initialRadix);
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (resultField.value.length !== 0) {
            if (isNaN(result) || result !== this.performArithmetic(value, operand)) {
                feedbackArea.innerHTML = isNaN(result)
                    ? `${resultField.value} is not a base-${this.initialRadix} value.`
                    : `${value} ${operatorSymbol} ${operand} ≠ ${result}`;
                resultField.value = "";
                resultField.focus();
            } else {
                if (this.operation === Operations.Subtraction && result < 0) {   // note that result cannot be negative when operation == Division
                    feedbackArea.innerHTML = "This difference is negative";
                    if (digitPosition < this.problemSize - 1) {     // TODO: assumes finally binary
                        let nextValueField = document.getElementById(this.elementPrefix + "_value" + (digitPosition + 1));
                        nextValueField.innerHTML = valueField.innerHTML;
                    }
                } else {
                    if (digitPosition < this.problemSize - 1) {     // TODO: assumes finally binary
                        let nextValueField = document.getElementById(this.elementPrefix + "_value" + (digitPosition + 1));
                        nextValueField.innerHTML = resultField.value;
                    }
                }
            }
        }
    }

    handleFocusLossInRemainder(event, digitPosition) {
        let valueField = document.getElementById(this.elementPrefix + "_value" + digitPosition);
        let value = parseInt(valueField.innerHTML, this.initialRadix);
        let remainderField = document.getElementById(this.elementPrefix + "_remainder" + digitPosition);
        let remainder = parseInt(remainderField.value, this.finalRadix);  // TODO: handle finalRadix digit *or* initialRadix value
        let feedbackArea = document.getElementById(this.elementPrefix + "_feedback" + digitPosition);
        feedbackArea.innerHTML = "&nbsp;";
        if (remainderField.value.length !== 0) {
            if (isNaN(remainder) || remainder !== value % 2) {
                feedbackArea.innerHTML = isNaN(remainder)
                    ? `${remainderField.value} is not a base-${this.finalRadix} digit.`
                    : `${remainder} is not the correct remainder.`;
                remainderField.value = "";
                remainderField.focus();
            }
        }
    }
}
