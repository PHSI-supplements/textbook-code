/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class IEEE754Problem {
    constructor(elementPrefix, includeNormals = true, includeSubnormals = false, includeSpecials = false, problemSize = 8, groupingSize = 4) {
        if (this.constructor === IEEE754Problem) {
            alert("IEEE754Problem should be treated as an abstract class.");
            throw new Error("IEEE754Problem should be treated as an abstract class.");
        }
        // TODO: handle the scientific notation fields for NaN & Infinity
        this.problemSize = problemSize;     // how many bits?
        this.groupingSize = groupingSize;   // how many digits between digit separators?
        this.includeNormals = includeNormals;
        this.includeSubnormals = includeSubnormals;
        this.includeSpecials = includeSpecials;
        this.mapElements(elementPrefix);
        this.generateProblem();
    }

    mapElements(elementPrefix) {
        this.problemArea = document.getElementById(elementPrefix + "_problem");
        this.binaryVectorField = document.getElementById(elementPrefix + "_binary_vector");
        this.signBitField = document.getElementById(elementPrefix + "_sign_bit");
        this.EField = document.getElementById(elementPrefix + "_E");
        this.fractionField = document.getElementById(elementPrefix + "_fraction");
        this.significandField = document.getElementById(elementPrefix + "_significand");
        this.exponentField = document.getElementById(elementPrefix + "_exponent");
        this.answerField = document.getElementById(elementPrefix + "_answer");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        this.binaryVectorField.onblur = this.checkBinaryVector.bind(this);
        this.signBitField.onblur = this.checkSignBit.bind(this);
        this.EField.onblur = this.checkEField.bind(this);
        this.fractionField.onblur = this.checkFraction.bind(this);
        this.significandField.onblur = this.checkScientificNotation.bind(this);
        this.exponentField.onblur = this.checkScientificNotation.bind(this);
        this.answerField.onkeydown = this.handleKeyPressInAnswer.bind(this)
        this.checkButton.onclick = this.checkAnswer.bind(this);
        tryAgainButton.onclick = this.generateProblem.bind(this);
    }

    displayProblem() {
        this.problemArea.innerHTML = "&nbsp;";
        this.feedbackArea.innerHTML = "&nbsp;";
        this.binaryVectorField.value = "";
        this.signBitField.value = "";
        this.EField.value = "";
        this.fractionField.value = "";
        this.significandField.value = "";
        this.exponentField.value = "";
        this.answerField.value = "";
    }

    generateNumber(includeNormals, includeSubnormals, includeSpecials) {
        // We'll treat 0 as subnormal, even though it technically isn't
        this.signBitSize = 1;
        switch (this.problemSize) {
            case 8:
                this.exponentFieldSize = 4;
                this.fractionFieldSize = 3;
                this.IEEE754Format = "Quarter Precision";
                break;
            case 16:
                this.exponentFieldSize = 5;
                this.fractionFieldSize = 10;
                this.IEEE754Format = "Half Precision";
                break;
            case 32:
                this.exponentFieldSize = 8;
                this.fractionFieldSize = 23;
                this.IEEE754Format = "Single Precision";
                break;
            // case 64:
            //     this.exponentFieldSize = 11;
            //     this.fractionFieldSize = 52;
            //     this.IEEE754Format = "Double Precision";
            //     break;
            // case 128:
            //     this.exponentFieldSize = 15;
            //     this.fractionFieldSize = 112;
            //     this.IEEE754Format = "Quadruple Precision";
            //     break;
            default:
                alert(`${this.problemSize}-bit floating point problems are not supported.`);
                throw new Error(`${this.problemSize}-bit floating point problems are not supported.`);
        }
        // Sign
        this.signBit = Math.floor(Math.random() * (this.signBitSize + 1));
        // Exponent
        this.bias = (1 << (this.exponentFieldSize - 1)) - 1;
        let subnormalE = 0;
        let specialE = (1 << this.exponentFieldSize) - 1;
        if (includeNormals) {
            let minimumE = includeSubnormals ? subnormalE : subnormalE + 1;
            let maximumE = includeSpecials ? specialE : specialE - 1;
            do {
                this.E = Math.floor(Math.random() * (maximumE + 1));
            } while (this.E < minimumE);
        } else if (includeSubnormals && !includeSpecials) {
            this.E = subnormalE;
        } else if (!includeSubnormals && includeSpecials) {
            this.E = specialE;
        } else if (includeSubnormals && includeSpecials) {
            this.E = (Math.floor(Math.random() * 2) === 0) ? subnormalE : specialE;
        } else {
            alert("Must include at least one of: Normals, Subnormals, Specials.");
            throw new Error("Must include at least one of: Normals, Subnormals, Specials.");
        }
        // Significand
        if (this.E === subnormalE || this.E === specialE) {
            // let's make it 50/50 between zero/nonzero, and 50/50 between infinity/NaN
            if (Math.floor(Math.random() * 2) === 0) {
                this.fraction = 0;
            } else {
                do {
                    this.fraction = Math.floor(Math.random() * (1 << this.fractionFieldSize));
                } while (this.fraction === 0);
            }
        } else {
            this.fraction = Math.floor(Math.random() * (1 << this.fractionFieldSize));
        }
        this.isNegative = (this.signBit === 1);
        this.exponent = (this.E === subnormalE) ? 1 - this.bias : this.E - this.bias;
        let integer = (this.E === subnormalE) ? 0 : 1;
        this.significand = integer + (this.fraction / (1 << this.fractionFieldSize));
        if (this.E === specialE) {
            this.number = (this.isNegative ? -1 : 1) * ((this.fraction === 0) ? Infinity : NaN);
        } else {
            this.number = (this.isNegative ? -1 : 1) * this.significand * (2 ** this.exponent);
        }
        this.IEEE754Vector = parseInt(this.signBit + this.E.toString(2).padStart(this.exponentFieldSize, "0") + this.fraction.toString(2).padStart(this.fractionFieldSize, "0"), 2);
    }

    generateProblem() {
        this.generateNumber(this.includeNormals, this.includeSubnormals, this.includeSpecials);
        this.displayProblem();
    }

    checkBinaryVector(event) {
        alert("checkBinaryVector needs to be implemented in IEEE754Problem's subclasses.");
        throw new Error("checkBinaryVector needs to be implemented in IEEE754Problem's subclasses.");
    }

    checkSignBit(event) {
        let signBit = this.signBitField.value;
        if (signBit.length === 0) {
            return;
        }
        if (!["0", "1"].includes(signBit)) {
            this.feedbackArea.innerHTML = "The sign bit should be 0 or 1.";
        } else if (this.signBit && (signBit !== "1")) {
            this.feedbackArea.innerHTML = "The value is negative; the sign bit should be 1."
        } else if (!this.signBit && (signBit !== "0")) {
            this.feedbackArea.innerHTML = "The value is positive; the sign bit should be 0."
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkEField(event) {
        let EString = this.EField.value;
        if (EString.length === 0) {
            return;
        }
        if (EString.substring(0, 2).toLowerCase() === "0b") {
            EString = EString.substring(2);
        }
        let EStringWithoutSeparators = EString.replaceAll("'", "");
        this.EField.value = EString.padStart(this.exponentFieldSize + EString.length - EStringWithoutSeparators.length, "0");
        let E = parseInt(EStringWithoutSeparators, 2);
        if (isNaN(E)) {
            this.feedbackArea.innerHTML = `${E} is not a valid base-2 value.`
        } else if (E !== this.E) {
            this.feedbackArea.innerHTML = `0b${E.toString(2).padStart(this.exponentFieldSize, "0")} is not the correct E.`
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkFraction(event) {
        let fractionString = this.fractionField.value;
        if (fractionString.length === 0) {
            return;
        }
        if (fractionString.substring(0, 2).toLowerCase() === "0b") {
            fractionString = fractionString.substring(2);
        }
        let fractionStringWithoutSeparators = fractionString.replaceAll("'", "");
        this.fractionField.value = fractionString.padStart(this.fractionFieldSize + fractionString.length - fractionStringWithoutSeparators.length, "0");
        let fraction = parseInt(fractionStringWithoutSeparators, 2);
        if (isNaN(fraction)) {
            this.feedbackArea.innerHTML = `${fraction} is not a valid base-2 value.`
        } else if (fraction !== this.fraction) {
            this.feedbackArea.innerHTML = `0b${fraction.toString(2).padStart(this.fractionFieldSize, "0")} is not the correct fraction.`
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkScientificNotation(event) {
        if (event.target.value.length === 0) {
            return;
        }
        this.feedbackArea.innerHTML = "&nbsp;";
        let significandString = this.significandField.value;
        let exponentString = this.exponentField.value;
        let significand = parseBinaryFloat(significandString.replaceAll("'", ""));
        let exponent = parseInt(exponentString.replaceAll("'", ""), 10);
        if (significand === ((this.isNegative ? -1 : 1) * this.significand) && exponent === this.exponent) {
            return;
        }
        if (significand === ((this.isNegative ? -1 : 1) * this.significand) && exponentString.length === 0) {
            return;
        }
        if (significandString.length === 0 && exponent === this.exponent) {
            return;
        }
        if (isNaN(significand) && significandString.length !== 0) {
            significand = parseFloat(significandString.replaceAll("'", ""));
            if (isNaN(significand)) {
                this.feedbackArea.innerHTML = `${significand} is not a valid base-2 significand.`
            } else if (significand === ((this.isNegative ? -1 : 1) * this.significand) && exponentString.length === 0) {
                this.feedbackArea.innerHTML = `${significandString}<sub>10</sub> is the correct significand, but you should express it in binary.`
            } else if (significand === ((this.isNegative ? -1 : 1) * this.significand) && exponent === this.exponent) {
                this.feedbackArea.innerHTML = `${significandString}<sub>10</sub> × 2<sup>${exponent}</sup> is correct, but you should express the significand in binary.`
            } else {
                this.feedbackArea.innerHTML = "You should express the significand in binary.";
            }
            return;
        }
        if (isNaN(exponent) && exponentString.length !== 0) {
            this.feedbackArea.innerHTML = `${exponent} is not a valid base-10 value.`
            return;
        }
        if (significand * (2 ** exponent) === this.number) {
            if (this.E === 0) {
                this.feedbackArea.innerHTML = `You need to subnormalize ${significandString}<sub>2</sub> × 2<sup>${exponentString}</sup>.`
            } else {
                this.feedbackArea.innerHTML = `You need to normalize ${significandString}<sub>2</sub> × 2<sup>${exponentString}</sup>.`
            }
            return;
        }
        if (significandString.length > 0) {
            if (this.isNegative && significandString[0] !== "-") {
                this.feedbackArea.innerHTML = "The significand should be negative.";
                return;
            } else if (!this.isNegative && significandString[0] === "-") {
                this.feedbackArea.innerHTML = "The significand should be positive.";
                return;
            }
        }
        exponent = parseInt(exponentString.replaceAll("'", ""), 2);
        if (significand === ((this.isNegative ? -1 : 1) * this.significand) && exponent === this.exponent) {
            this.feedbackArea.innerHTML = `${significandString}<sub>2</sub> × 2<sup>${exponent}</sup> is correct, but you should express the exponent in decimal for clarity.`;
            return;
        }
        if (significandString.length > 0 && exponentString.length > 0) {
            this.feedbackArea.innerHTML = `${significandString}<sub>2</sub> × 2<sup>${exponentString}</sup> is not correct.`;
        }
    }

    checkAnswer(event) {
        alert("checkAnswer needs to be implemented in IEEE754Problem's subclasses.");
        throw new Error("checkAnswer needs to be implemented in IEEE754Problem's subclasses.");
    }

    handleKeyPressInAnswer(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        }
    }
}


class FloatingPointToFixedPointProblem extends IEEE754Problem {
    constructor(elementPrefix, includeNormals = true, includeSubnormals = false, includeSpecials = false, problemSize = 8, groupingSize = 4) {
        super(elementPrefix, includeNormals, includeSubnormals, includeSpecials, problemSize, groupingSize);
    }

    displayProblem() {
        super.displayProblem();
        this.problemArea.innerHTML = `Convert 0x${insertDigitSeparators(this.IEEE754Vector.toString(16).toUpperCase().padStart(this.problemSize / 4, "0"), this.groupingSize)} from ${this.IEEE754Format} Floating Point to Binary Fixed Point`;
    }

    checkBinaryVector(event) {
        let valueString = this.binaryVectorField.value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.binaryVectorField.value = valueString.padStart(this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else if (value !== this.IEEE754Vector) {
            this.feedbackArea.innerHTML = `0x${this.IEEE754Vector.toString(16).padStart(this.problemSize / 4, "0")} != 0b${valueString}`;
        } else {
            this.feedbackArea.innerHTML = "&nbsp;";
        }
    }

    checkAnswer(event) {
        let valueString = this.answerField.value;
        if (valueString.length === 0) {
            return;
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        if (valueString.substring(1, 3).toLowerCase() === "0b") {
            valueString = valueString[0] + valueString.substring(3);
        }
        let value = parseBinaryFloat(valueString.replaceAll("'", ""));
        if (value === this.number) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (value === -this.number) {
            if (value < 0) {
                this.feedbackArea.innerHTML = "The value is negative; it should be positive.";
            } else {
                this.feedbackArea.innerHTML = "The value is positive; it should be negative.";
            }
        } else if (isNaN(value) && isNaN(this.number)) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (isNaN(value)) {
            value = parseFloat(valueString);
            if (value === this.number) {
                this.feedbackArea.innerHTML = `${valueString}<sub>10</sub> is the correct value, but you need to express it in binary.`;
            } else {
                this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value. Try again.`;
            }
        } else {
            this.feedbackArea.innerHTML = `${valueString}<sub>2</sub> is not correct.`;
        }
    }
}


class FixedPointToFloatingPointProblem extends IEEE754Problem {
    constructor(elementPrefix, includeNormals = true, includeSubnormals = false, includeSpecials = false, problemSize = 8, groupingSize = 4) {
        super(elementPrefix, includeNormals, includeSubnormals, includeSpecials, problemSize, groupingSize);
        // TODO: handle fraction for NaN
    }

    displayProblem() {
        super.displayProblem();
        let valueString = insertDigitSeparators(this.number.toString(2), this.groupingSize);
        if (!valueString.includes(".")) {
            valueString += ".0";    // TODO: Don't do this for NaN & Infinity
        }
        this.problemArea.innerHTML = `Convert ${valueString}<sub>2</sub> from Binary Fixed Point to ${this.IEEE754Format} Floating Point`;
    }

    checkBinaryVector(event) {
        let valueString = this.binaryVectorField.value;
        if (valueString.length === 0) {
            return; // nothing to check
        }
        if (valueString.substring(0, 2).toLowerCase() === "0b") {
            valueString = valueString.substring(2);
        }
        let valueStringWithoutSeparators = valueString.replaceAll("'", "");
        this.binaryVectorField.value = valueString.padStart(this.problemSize + valueString.length - valueStringWithoutSeparators.length, "0");
        let value = parseInt(valueStringWithoutSeparators, 2);
        if (value === this.IEEE754Vector) {
            this.feedbackArea.innerHTML = "&nbsp;";
        } else if (isNaN(value)) {
            this.feedbackArea.innerHTML = `${valueString} is not a valid base-2 value.`
        } else {
            let signBitMask = 1 << (this.fractionFieldSize + this.exponentFieldSize);
            let exponentMask = ((1 << this.exponentFieldSize) - 1) << this.fractionFieldSize;
            let fractionMask = (1 << this.fractionFieldSize) - 1;
            if ((value & (exponentMask | fractionMask)) === (this.IEEE754Vector & (exponentMask | fractionMask))) {
                this.feedbackArea.innerHTML = "The bit vector's sign bit is incorrect.";
            } else if ((value & (signBitMask | fractionMask)) === (this.IEEE754Vector & (signBitMask | fractionMask))) {
                this.feedbackArea.innerHTML = "The bit vector's E field is incorrect.";
            } else if ((value & (signBitMask | exponentMask)) === (this.IEEE754Vector & (signBitMask | exponentMask))) {
                this.feedbackArea.innerHTML = "The bit vector's fraction field is incorrect.";
            } else if ((value & signBitMask) === (this.IEEE754Vector & signBitMask)) {
                this.feedbackArea.innerHTML = "The bit vector's E field and fraction field are incorrect.";
            } else if ((value & exponentMask) === (this.IEEE754Vector & exponentMask)) {
                this.feedbackArea.innerHTML = "The bit vector's sign bit and fraction field are incorrect.";
            } else if ((value & fractionMask) === (this.IEEE754Vector & fractionMask)) {
                this.feedbackArea.innerHTML = "The bit vector's sign bit and E field are incorrect.";
            } else {
                this.feedbackArea.innerHTML = `0b${valueString} is incorrect.`;
            }
        }
    }

    checkAnswer(event) {
        let vectorString = this.answerField.value;
        if (vectorString.length === 0) {
            return;
        }
        if (vectorString.substring(0, 2).toLowerCase() === "0x") {
            vectorString = vectorString.substring(2);
        }
        let vector = parseInt(vectorString.replaceAll("'", ""), 16);
        if (vector === this.IEEE754Vector) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (isNaN(vector)) {
            this.feedbackArea.innerHTML = `${vectorString} is not a valid hexadecimal bit vector.`
        } else if (this.binaryVectorField.value.length > 0) {
            let binaryVectorString = this.binaryVectorField.value;
            if (binaryVectorString.substring(0, 2).toLowerCase() === "0b") {
                binaryVectorString = binaryVectorString.substring(2);
            }
            binaryVectorString = binaryVectorString.replaceAll("'", "");
            let binaryVector = parseInt(binaryVectorString, 2);
            if (binaryVector !== vector) {
                this.feedbackArea.innerHTML = `0b${this.binaryVectorField.value} != 0x${this.answerField.value}`;
            }
        } else {
            this.feedbackArea.innerHTML = "0x" + vectorString + " is not correct. Try again.";
        }
    }
}


class Rounding {
    constructor(elementPrefix, initialFractionSize, finalFractionSize, groupingSize) {
        if (finalFractionSize > initialFractionSize) {
            alert("The final fraction size must be at least the initial fraction size. We recommend that the final fraction size exceed the initial fraction size by at least 2.");
            throw new Error("The final fraction size must be at least the initial fraction size. We recommend that the final fraction size exceed the initial fraction size by at least 2.");
        }
        this.initialFractionSize = initialFractionSize;
        this.finalFractionSize = finalFractionSize;
        this.groupingSize = groupingSize;
        this.mapElements(elementPrefix);
        this.generateProblem();
    }

    mapElements(elementPrefix) {
        this.initialFractionArea = document.getElementById(elementPrefix + "_initial_fraction");
        this.initialExponentArea = document.getElementById(elementPrefix + "_initial_exponent");
        this.finalFractionField = document.getElementById(elementPrefix + "_final_fraction");
        this.finalExponentArea = document.getElementById(elementPrefix + "_final_exponent");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        this.finalFractionField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        tryAgainButton.onclick = this.generateProblem.bind(this);
    }

    generateProblem() {
        let exponent = Math.floor(Math.random() * 21) - 10;
        this.initialExponentArea.innerHTML = exponent.toString();
        this.finalExponentArea.innerHTML = exponent.toString();
        this.finalFractionField.value = "";
        this.feedbackArea.innerHTML = "&nbsp;";
        // now the interesting part
        this.finalFraction = Math.floor(Math.random() * (1 << this.finalFractionSize));
        // equal chances of "less than halfway", "more than halfway", "exactly halfway, round down", "exactly halfway, round up"
        let roundingUp;
        let roundingOption = Math.floor(Math.random() * 4);
        let trailingFraction;
        let trailingFractionSize = this.initialFractionSize - this.finalFractionSize;
        let halfway = (1 << (trailingFractionSize - 1));
        switch (roundingOption) {
            case 0:
                // less than halfway
                roundingUp = false;
                trailingFraction = Math.floor(Math.random() * halfway);
                break;
            case 1:
                // more than halfway
                roundingUp = true;
                trailingFraction = Math.floor(Math.random() * (halfway - 1)) + halfway + 1;
                break;
            case 2:
                // exactly halfway, round down
                roundingUp = false;
                trailingFraction = halfway;
                this.finalFraction = this.finalFraction & ~0x1;
                break;
            case 3:
                // exactly halfway, round up
                roundingUp = true;
                trailingFraction = halfway;
                this.finalFraction = this.finalFraction | 0x1;
                break;
            default:
                // shouldn't happen, but we'll just make this "no rounding necessary"
                roundingUp = false;
                trailingFraction = 0;
        }
        if (roundingUp && this.finalFraction === (1 << this.finalFractionSize) - 1) {
            // we're going to remove the problem of rounding into the integer portion
            this.finalFraction = this.finalFraction & ~(1 << (this.finalFractionSize - 1));
        }
        let initialFraction = (this.finalFraction << trailingFractionSize) + trailingFraction;
        if (roundingUp) {
            this.finalFraction += 1;
        }
        this.initialFractionArea.innerHTML = insertDigitSeparators("." + initialFraction.toString(2).padStart(this.initialFractionSize, "0"), this.groupingSize).substring(1);
    }

    checkAnswer(event) {
        let fractionString = this.finalFractionField.value;
        let fractionStringWithoutSeparators = fractionString.replaceAll("'", "");
        while (fractionStringWithoutSeparators.length < this.finalFractionSize) {
            fractionString += "0";
            fractionStringWithoutSeparators += "0";
        }
        this.finalFractionField.value = fractionString;
        let fraction = parseInt(fractionStringWithoutSeparators, 2);
        if (fraction === this.finalFraction) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (isNaN(fraction)) {
            this.feedbackArea.innerHTML = `${fractionString} isn't in binary.`
        } else if (fractionStringWithoutSeparators.length > this.finalFractionSize) {
            this.feedbackArea.innerHTML = "Round the fraction so there are only three bits to the right of the binary point."
        } else {
            this.feedbackArea.innerHTML = `1.${fractionString}<sub>2</sub> × 2<sup>${this.finalExponentArea.innerHTML}</sup> is not correct.`
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        } else if (event.key.length === 1 && event.key !== '\'') {      // ignore non-character keys and digit separators
            let digit = parseInt(event.key.toUpperCase(), 2);
            if (isNaN(digit)) {
                this.feedbackArea.innerHTML = `${event.key} is not a base-2 digit.`;
                setTimeout(() => {
                    let partialAnswer = this.finalFractionField.value;
                    this.finalFractionField.value = partialAnswer.substring(0, partialAnswer.length - 1);
                    this.feedbackArea.innerHTML = "&nbsp;";
                }, 1000);
            }
        }
    }
}