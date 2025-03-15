/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class StructProblem {
    constructor(elementPrefix, wordSize = 64) {
        this.declarationArea = document.getElementById(elementPrefix + "_declaration");
        this.questionArea = document.getElementById(elementPrefix + "_question");
        this.answerField = document.getElementById(elementPrefix + "_answer");
        this.answerPrefixArea = document.getElementById(elementPrefix + "_answer_prefix");
        this.answerSuffixArea = document.getElementById(elementPrefix + "_answer_suffix");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        if (wordSize === 32) {
            this.wordSize = wordSize;
            this.availableTypes = [
                Types.Char, Types.Short, Types.Int, Types.Long,
                Types.Float, Types.Pointer
            ];
            this.maximumSizeTypes = [Types.Int, Types.Long, Types.Float, Types.Pointer];
        } else if (wordSize === 64) {
            this.wordSize = wordSize;
            this.availableTypes = [
                Types.Char, Types.Short, Types.Int, Types.Long,
                Types.Float, Types.Double, Types.Pointer
            ];
            this.maximumSizeTypes = [Types.Long, Types.Double, Types.Pointer];
        } else {
            alert(`Type sizes for ${wordSize} systems is not defined for this practice problem generator.`);
            console.error(`Type sizes for ${wordSize} systems is not defined for this practice problem generator.`);
        }
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.answerField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        this.generateProblem();
    }

    generateProblem() {
        this.feedbackArea.innerHTML = "&nbsp;";
        this.answerField.value = "";
        this.answerPrefixArea.innerHTML = "";
        this.answerSuffixArea.innerHTML = "";
        this.fieldNames = [];
        this.sizesOfFields = [];
        this.interFieldPadding = [];
        this.sizeOfStruct = 0;
        let typeSizes;
        if (this.wordSize === 32) {
            typeSizes = TypeSizes32Bit;
        } else if (this.wordSize === 64) {
            typeSizes = TypeSizes64Bit;
        }
        this.numberOfFields = Math.floor(Math.random() * 4) + 3;
        let structName = metaVariables[Math.floor(Math.random() * metaVariables.length)];
        this.declarationArea.innerHTML = "struct " + structName + " {<br>";
        for (let i = 0; i < this.numberOfFields; i++) {
            let type;
            if (i === this.numberOfFields - 1) {
                type = this.maximumSizeTypes[Math.floor(Math.random() * this.maximumSizeTypes.length)];
            } else {
                type = this.availableTypes[Math.floor(Math.random() * this.availableTypes.length)];
            }
            let variableName;
            do {
                variableName = metaVariables[Math.floor(Math.random() * metaVariables.length)];
            } while (variableName === structName || this.fieldNames.includes(variableName));
            this.fieldNames.push(variableName);
            let fieldSize = typeSizes.get(type);
            this.sizesOfFields.push(fieldSize);
            let padding = fieldSize - (this.sizeOfStruct % fieldSize);
            if (padding === fieldSize) {
                padding = 0;
            }
            this.interFieldPadding.push(padding);
            // this.declarationArea.innerHTML += "// " + padding + " bytes of padding\n";
            this.sizeOfStruct += padding + fieldSize;
            this.declarationArea.innerHTML += "    ";
            this.declarationArea.innerHTML += (type === Types.Pointer) ? this.availableTypes[Math.floor(Math.random() * (this.availableTypes.length - 1))].description + " *" : type.description + " ";
            this.declarationArea.innerHTML += variableName + ";";
            // this.declarationArea.innerHTML += " // " + fieldSize + " bytes -- size is " + this.sizeOfStruct + " bytes";
            this.declarationArea.innerHTML += "\n";
        }
        let wordSizeInBytes = this.wordSize / 8;
        this.baseAddress = 0x4000 + wordSizeInBytes * Math.floor(Math.random() * (0x8000 / wordSizeInBytes));
        this.fieldOfInterest = this.fieldNames[Math.floor(Math.random() * this.fieldNames.length)];
        this.declarationArea.innerHTML += "};"
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                // address of a field
                this.questionArea.innerHTML = `If an instance of <code>struct ${structName}</code> has a base address of 0x${this.baseAddress.toString(16).toUpperCase()}, what is the address of the <code>${this.fieldOfInterest}</code> field?`;
                this.answerPrefixArea.innerHTML = "0x";
                break;
            case 1:
                // size of the struct
                this.questionArea.innerHTML = `How many bytes (total) must be allocated for an instance of <code>struct ${structName}</code>?`;
                this.answerSuffixArea.innerHTML = " bytes";
                break;
            case 2:
                // how much padding?
                this.questionArea.innerHTML = `How many bytes of padding are in an instance of <code>struct ${structName}</code>?`;
                this.answerSuffixArea.innerHTML = " bytes of padding";
                break;
        }
    }

    checkAnswer() {
        let answerString = this.answerField.value;
        if (this.questionArea.innerHTML.includes("address")) {          // address of a field
            if (answerString.substring(0, 2).toLowerCase() === "0x") {
                answerString = answerString.substring(2);
            }
            let answerStringWithoutSeparators = answerString.replaceAll("'", "");
            let answerValue = parseInt(answerStringWithoutSeparators, 16);
            let displacementWithPadding = 0;
            let displacementWithoutPadding = 0;
            let i = 0;
            while (this.fieldNames[i] !== this.fieldOfInterest) {
                displacementWithoutPadding += this.sizesOfFields[i];
                displacementWithPadding += this.sizesOfFields[i] + this.interFieldPadding[i + 1];
                i++;
            }
            if (answerValue === this.baseAddress + displacementWithPadding) {
                this.feedbackArea.innerHTML = "Correct!";
            } else if (answerValue === this.baseAddress + displacementWithoutPadding) {
                this.feedbackArea.innerHTML = "Don't forget to account for padding.";
            } else {
                this.feedbackArea.innerHTML = `0x${answerString} is not correct.`;
            }
        } else if (this.questionArea.innerHTML.includes("allocated")    // size of the struct
            || this.questionArea.innerHTML.includes("padding")) {       // how much padding?

            let fieldAggregateSize = this.sizesOfFields.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
            let paddingSize = this.interFieldPadding.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
            let size = paddingSize;
            if (this.questionArea.innerHTML.includes("allocated")) {
                size += fieldAggregateSize;
            }
            let answerString = this.answerField.value;
            let answerStringWithoutSeparators = answerString.replaceAll("'", "");
            let answerValue = parseInt(answerStringWithoutSeparators, 10);
            if (answerStringWithoutSeparators.substring(0, 2).toLowerCase() === "0x"
                || answerStringWithoutSeparators.toLowerCase().includes("a")
                || answerStringWithoutSeparators.toLowerCase().includes("b")
                || answerStringWithoutSeparators.toLowerCase().includes("c")
                || answerStringWithoutSeparators.toLowerCase().includes("d")
                || answerStringWithoutSeparators.toLowerCase().includes("e")
                || answerStringWithoutSeparators.toLowerCase().includes("f")) {
                answerValue = parseInt(answerStringWithoutSeparators, 16);
            }
            if (answerValue === size) {
                this.feedbackArea.innerHTML = "Correct!";
            } else if (answerValue === size - paddingSize) {
                this.feedbackArea.innerHTML = "Don't forget to account for padding.";
            } else {
                this.feedbackArea.innerHTML = `${answerString} is not correct.`;
            }
        } else {
            alert("Unexpected question");
            console.error("Unexpected question");
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        }
    }
}


class ArrayProblem {
    constructor(elementPrefix, wordSize = 64) {
        if (this.constructor === ArrayProblem) {
            alert("ArrayProblem should be treated as an abstract class.");
            throw new Error("ArrayProblem should be treated as an abstract class.");
        }
        this.elementPrefix = elementPrefix;
        this.declarationArea = document.getElementById(elementPrefix + "_declaration");
        this.questionArea = document.getElementById(elementPrefix + "_question");
        if (wordSize === 32) {
            this.wordSize = wordSize;
            this.typeSizes = TypeSizes32Bit;
        } else if (wordSize === 64) {
            this.wordSize = wordSize;
            this.typeSizes = TypeSizes64Bit;
        } else {
            alert(`Type sizes for ${wordSize} systems is not defined for this practice problem generator.`);
            console.error(`Type sizes for ${wordSize} systems is not defined for this practice problem generator.`);
        }
        this.availableTypes = [Types.Char, Types.Short, Types.Int, Types.Long];
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        tryAgainButton.onclick = this.generateProblem.bind(this);
    }

    characterizeArrayProblem() {
        alert("characterizeArrayProblem needs to be implemented in ArrayProblem's subclasses.");
        throw new Error("characterizeArrayProblem needs to be implemented in ArrayProblem's subclasses.");
        return "array indexed to specific element";
    }

    generateProblem() {
        this.feedbackArea.innerHTML = "&nbsp;";
        this.elementType = this.availableTypes[Math.floor(Math.random() * this.availableTypes.length)];
        this.arrayName = metaVariables[Math.floor(Math.random() * metaVariables.length)];
        let sizeOfElement = this.typeSizes.get(this.elementType);
        this.baseAddress = 0x4000 + sizeOfElement * Math.floor(Math.random() * (0x8000 / sizeOfElement));
        this.specificElement = this.characterizeArrayProblem();
        this.questionArea.innerHTML = `If the base address of the <code>${this.arrayName}</code> array is 0x${this.baseAddress.toString(16).toUpperCase()}, what is the address of <code>${this.specificElement}</code>?`;
    }

    checkArrayIndexing(baseAddress, index, sizeOfElement, answerField, correctFeedback, forgotToMultiplyFeedback, incorrectFeedback) {
        let answerString = answerField.value;
        if (answerString.substring(0, 2).toLowerCase() === "0x") {
            answerString = answerString.substring(2);
        }
        let answerStringWithoutSeparators = answerString.replaceAll("'", "");
        let answerValue = parseInt(answerStringWithoutSeparators, 16);
        let offset = index * sizeOfElement;
        let correctAddress = baseAddress + offset;
        if (answerValue === correctAddress) {
            this.feedbackArea.innerHTML = correctFeedback;
        } else if (answerValue === baseAddress + index) {
            this.feedbackArea.innerHTML = forgotToMultiplyFeedback;
        } else {
            let baseAddressMisinterpretedAsDecimal = parseInt(this.baseAddress.toString(16), 10);   // might be NaN
            let offsetMisinterpretedDecimalAsHexadecimal = parseInt(offset.toString(10), 16);
            if ((answerValue === baseAddressMisinterpretedAsDecimal + offset)
                || (answerValue === parseInt((baseAddressMisinterpretedAsDecimal + offset).toString(10), 16))) {
                this.feedbackArea.innerHTML = `You appear to have treated 0x${this.baseAddress.toString(16)} as ${this.baseAddress.toString(16)}<sub>10</sub>.`
            } else if (answerValue === baseAddress + offsetMisinterpretedDecimalAsHexadecimal) {
                this.feedbackArea.innerHTML = "You appear to have added a decimal offset to a hexadecimal base address without converting the offset to hexadecimal.";
            } else {
                this.feedbackArea.innerHTML = incorrectFeedback;
            }
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        }
    }
}


class OneDimensionalArrayProblem extends ArrayProblem {
    constructor(elementPrefix, wordSize = 64) {
        super(elementPrefix, wordSize);
        this.answerField = document.getElementById(elementPrefix + "_answer");
        this.answerField.onkeydown = this.handleKeyPress.bind(this);
        // this.checkButton.onclick = this.checkAnswer.bind(this);
        this.checkButton.onclick = () => this.checkArrayIndexing(
            this.baseAddress, this.elementOfInterest, this.typeSizes.get(this.elementType),
            this.answerField,
            "Correct!",
            "Don't forget to multiply the index by the size of the element.",
            `0x${this.answerField.value} is not correct.`
        )
        this.generateProblem();
    }

    characterizeArrayProblem() {
        let numberOfElements = Math.floor(Math.random() * 13) + 3;
        this.elementOfInterest = Math.floor(Math.random() * numberOfElements);
        this.declarationArea.innerHTML = `${this.elementType.description} ${this.arrayName}[${numberOfElements}];`;
        return `${this.arrayName}[${this.elementOfInterest}]`;
    }

    generateProblem() {
        super.generateProblem();
        this.answerField.value = "";
    }
}


class NestedArrayProblem extends ArrayProblem {
    constructor(elementPrefix, wordSize = 64) {
        super(elementPrefix, wordSize);
        this.rowSizeField = document.getElementById(elementPrefix + "_row_size");
        this.rowAddressField = document.getElementById(elementPrefix + "_row_address");
        this.elementAddressField = document.getElementById(elementPrefix + "_element_address");
        this.rowSizeField.onblur = this.checkRowSize.bind(this);
        this.rowSizeField.onkeydown = this.handleKeyPress.bind(this);
        this.rowAddressField.onblur = this.checkRowAddress.bind(this);
        this.rowAddressField.onkeydown = this.handleKeyPress.bind(this);
        this.elementAddressField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkElementAddress.bind(this);
        this.generateProblem();
    }

    characterizeArrayProblem() {
        let numberOfRows = Math.floor(Math.random() * 13) + 3;
        this.numberOfColumns = 1 << (Math.floor(Math.random() * 4) + 2);
        this.rowOfInterest = Math.floor(Math.random() * numberOfRows);
        this.columnOfInterest = Math.floor(Math.random() * this.numberOfColumns);
        this.declarationArea.innerHTML = `${this.elementType.description} ${this.arrayName}[${numberOfRows}][${this.numberOfColumns}];`;
        return `${this.arrayName}[${this.rowOfInterest}][${this.columnOfInterest}]`;
    }

    generateProblem() {
        super.generateProblem();
        this.rowSizeField.value = "";
        this.rowAddressField.value = "";
        this.elementAddressField.value = "";
        this.questionArea.innerHTML = `If the base address of the <code>${this.arrayName}</code> array is 0x${this.baseAddress.toString(16).toUpperCase()}, what is the address of <code>${this.arrayName}[${this.rowOfInterest}][${this.columnOfInterest}]?</code>`;
        let rowCode = document.getElementById(this.elementPrefix + "_row");
        let elementCode = document.getElementById(this.elementPrefix + "_element");
        rowCode.innerHTML = `${this.arrayName}[${this.rowOfInterest}]`;
        elementCode.innerHTML = `${this.arrayName}[${this.rowOfInterest}][${this.columnOfInterest}]`;
    }

    checkRowSize() {
        let answerString = this.rowSizeField.value;
        if (answerString.length === 0) {
            return;
        }
        let answerStringWithoutSeparators = answerString.replaceAll("'", "");
        let answerValue = parseInt(answerStringWithoutSeparators, 10);
        if (answerStringWithoutSeparators.substring(0, 2).toLowerCase() === "0x"
            || answerStringWithoutSeparators.toLowerCase().includes("a")
            || answerStringWithoutSeparators.toLowerCase().includes("b")
            || answerStringWithoutSeparators.toLowerCase().includes("c")
            || answerStringWithoutSeparators.toLowerCase().includes("d")
            || answerStringWithoutSeparators.toLowerCase().includes("e")
            || answerStringWithoutSeparators.toLowerCase().includes("f")) {
            answerValue = parseInt(answerStringWithoutSeparators, 16);
        }
        let correctSize = this.typeSizes.get(this.elementType) * this.numberOfColumns;
        if (answerValue === correctSize) {
            this.feedbackArea.innerHTML = "&nbsp;";
        } else if (answerValue === this.numberOfColumns) {
            this.feedbackArea.innerHTML = "To get the size of a row, multiply the number of columns by the size of an element.";
        } else if (answerValue === this.typeSizes.get(this.elementType) * this.columnOfInterest) {
            this.feedbackArea.innerHTML = `A row has ${this.numberOfColumns} elements, not ${this.columnOfInterest}.`
        } else {
            this.feedbackArea.innerHTML = `A row is not ${answerValue} bytes.`;
        }
    }

    checkRowAddress() {
        let rowSize = this.typeSizes.get(this.elementType) * this.numberOfColumns;
        this.checkArrayIndexing(this.baseAddress, this.rowOfInterest, rowSize, this.rowAddressField,
            "&nbsp;",
            "Don't forget to multiply the row index by the size of a row.",
            `0x${this.rowAddressField.value} is not the correct base address of <code>${this.arrayName}[${this.rowOfInterest}]</code>.<br>Don't forget that since ${rowSize} is a power of two, ${this.rowOfInterest}&nbsp;×&nbsp;${rowSize} = ${this.rowOfInterest}&nbsp<<&nbsp;lg(${rowSize}).`
        );
    }

    checkElementAddress() {
        let rowSize = this.typeSizes.get(this.elementType) * this.numberOfColumns;
        let rowBaseAddress = this.baseAddress + this.rowOfInterest * rowSize;
        this.checkArrayIndexing(rowBaseAddress, this.columnOfInterest, this.typeSizes.get(this.elementType),
            this.elementAddressField,
            `The address of <code>${this.arrayName}[${this.rowOfInterest}][${this.columnOfInterest}]</code> is correct!`,
            "Don't forget to multiply the column index by the size of an element",
            `0x${this.elementAddressField.value} is not the correct address of <code>${this.arrayName}[${this.rowOfInterest}][${this.columnOfInterest}]</code>.`
        );
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            if (event.target === this.rowSizeField) {
                this.rowAddressField.focus();
            } else if (event.target === this.rowAddressField) {
                this.elementAddressField.focus();
            } else {
                this.checkButton.click();
            }
        }
    }
}