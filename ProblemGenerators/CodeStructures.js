/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

class CodeStructureProblem {
    constructor(elementPrefix) {
        this.elementPrefix = elementPrefix;
        this.originalCodeArea = document.getElementById(elementPrefix + "_original_code");
        this.gotoCodeArea = document.getElementById(elementPrefix + "_goto_code");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        this.checkButton.onclick = this.checkAnswer.bind(this);
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.generateProblem();
    }

    codeStructures = [
        new Conditional(),
        new DoLoop(),
        new WhileLoop(),
    ]

    generateProblem() {
        this.feedbackArea.innerHTML = "&nbsp;";
        this.codeStructure = this.codeStructures[Math.floor(Math.random() * this.codeStructures.length)];
        this.codeStructure.generateProblem(this.originalCodeArea, this.gotoCodeArea, this.elementPrefix);
    }

    checkAnswer() {
        this.codeStructure.checkAnswer(this.feedbackArea);
    }
}


class CodeStructure {
    constructor() {
        if (this.constructor === CodeStructure) {
            alert("CodeStructure should be treated as an abstract class.");
            throw new Error("CodeStructure should be treated as an abstract class.");
        }
    }

    loremIpsumCode = [
        "loremIpsum()",
        "dolor()",
        "sitAmet()",
        "consectetur()",
        "adipiscingElit()",
        "sedDoEiusmod()",
        "temporIncididunt()",
        "utLaboreEtDolore()",
        "magnaAliqua()",
        "utEnim()",
        "adMinimVeniam()",
        "quisNostrud()",
        "exercitation()",
        "ullamcoLaboris()",
        "nisiUtAliquip()",
    ];

    comparators = [     // i's negated comparator is at (i + comparators.length / 2) % comparators.length
        "<", "<=", "==",
        ">=", ">", "!=",
    ];

    comparatorDropdowns = [];

    labelDropdowns = [];

    setVariableAndComparator() {
        this.variable = metaVariables[Math.floor(Math.random() * metaVariables.length)];
        this.comparatorIndex = Math.floor(Math.random() * this.comparators.length);
        this.comparisonValue = Math.floor(Math.random() * 100) - 50;
    }

    generateLoremIpsumPartitions(indexStart, indexEnd, numberOfPartitions) {
        this.loremIpsumPartitions = [];
        let partitionsRemaining = numberOfPartitions;
        let index = indexStart;
        while (partitionsRemaining > 0) {
            let partition = [];
            let endOfPartition = Math.floor(Math.random() * 3) + index + 1;
            while (index < endOfPartition) {
                partition.push(`${this.loremIpsumCode[index]};\n`);
                index++;
            }
            this.loremIpsumPartitions.push(partition);
            partitionsRemaining--;
        }
    }

    generateDropdowns(numberOfLabels, numberOfComparators, elementPrefix) {
        this.comparatorDropdowns = [];
        this.labelDropdowns = [];
        for (let i = 0; i < numberOfComparators; i++) {
            let comparatorDropdown = document.createElement("select");
            comparatorDropdown.name = elementPrefix + "_comparatorDropdown";
            comparatorDropdown.id = elementPrefix + "_comparatorDropdown";
            comparatorDropdown.correctValue = "<=>";
            let option = document.createElement("option");
            option.text = "<=>";
            option.setAttribute("align", "center");
            comparatorDropdown.add(option);
            this.comparators.forEach((comparator) => {
                option = document.createElement("option");
                option.text = comparator;
                option.setAttribute("align", "center");
                comparatorDropdown.add(option);
            });
            this.comparatorDropdowns.push(comparatorDropdown);
        }
        for (let i = 0; i < numberOfLabels; i++) {
            let labelDropdown = document.createElement("select");
            labelDropdown.name = elementPrefix + "labelDropdown" + i;
            labelDropdown.id = elementPrefix + "labelDropdown" + i;
            labelDropdown.correctValue = "label";
            let option = document.createElement("option");
            option.text = "label";
            option.setAttribute("align", "center");
            labelDropdown.add(option);
            for (let j = 0; j < numberOfLabels; j++) {
                option = document.createElement("option");
                option.text = `L${j + 1}`;
                option.setAttribute("align", "center");
                labelDropdown.add(option);
            }
            this.labelDropdowns.push(labelDropdown);
        }
    }

    generateLabeledCodeBlock(codePre, variable, comparatorIndex, comparisonValue, labelStart,
                             loremIpsumPartitions, loremIpsumPartitionStart,
                             comparatorDropdowns, comparatorDropdownStart,
                             labelDropdowns, labelDropdownStart) {
        let labelNumber = labelStart;
        let partitionNumber = loremIpsumPartitionStart;
        let code = document.createElement("code");
        code.innerHTML += `L${labelNumber++}:\n`;
        loremIpsumPartitions[partitionNumber++].forEach((line) => {
            code.innerHTML += "    " + line;
        });
        codePre.appendChild(code);
        return [labelNumber, partitionNumber, comparatorDropdownStart, labelDropdownStart];
    }

    generateProblem(originalCodeArea, gotoCodeArea, elementPrefix) {
        originalCodeArea.innerHTML = "";
        gotoCodeArea.innerHTML = "";
        this.generateDropdowns(4, 2, elementPrefix);
        this.setVariableAndComparator();
    }

    diagnoseMistake(comparatorsAreCorrect, labelsAreCorrect, feedbackArea) {
        alert("diagnoseMistake needs to be implemented in CodeStructure's subclasses.");
        throw new Error("diagnoseMistake needs to be implemented in CodeStructure's subclasses.");
    }

    checkAnswer(feedbackArea) {
        let comparatorsAreCorrect = this.comparatorDropdowns.reduce(
            (accumulator, comparatorDropdown) => accumulator && comparatorDropdown.value === comparatorDropdown.correctValue,
            true
        );
        let labelsAreCorrect = this.labelDropdowns.reduce(
            (accumulator, labelDropdown) => accumulator && labelDropdown.value === labelDropdown.correctValue,
            true
        );
        if (comparatorsAreCorrect && labelsAreCorrect) {
            feedbackArea.innerHTML = "Correct!";
        } else {
            this.diagnoseMistake(comparatorsAreCorrect, labelsAreCorrect, feedbackArea);
        }
    }
}


class Conditional extends CodeStructure {
    generateOriginalCode(codeArea, indentLevel, variable, comparatorIndex, comparisonValue, hasElse, loremIpsumPartitionStart = 0) {
        let partitionNumber = loremIpsumPartitionStart;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        codeArea.innerHTML += `${"    ".repeat(indentLevel)}if (${variable} ${this.comparators[comparatorIndex]} ${comparisonValue}) {\n`;
        indentLevel++;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        if (hasElse) {
            indentLevel--;
            codeArea.innerHTML += "    ".repeat(indentLevel) + "} else {\n";
            indentLevel++;
            this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
                codeArea.innerHTML += "    ".repeat(indentLevel) + line;
            });
        }
        indentLevel--;
        codeArea.innerHTML += "    ".repeat(indentLevel) + "}\n";
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
    }

    generateGotoCode(codePre, variable, comparatorIndex, comparisonValue, loremIpsumPartitions, thenCodeGenerator, hasElse,
                     comparatorDropdowns = this.comparatorDropdowns, labelDropdowns = this.labelDropdowns, labelStart = 1, loremIpsumPartitionStart = 0) {
        let labelNumber = labelStart;
        let partitionNumber = loremIpsumPartitionStart;
        let comparatorDropdownNumber = 0;
        let labelDropdownNumber = 0;
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            comparatorDropdowns, comparatorDropdownNumber,
            labelDropdowns, labelDropdownNumber);
        let code = document.createElement("code");
        code.innerHTML += `    if (${variable} `;
        codePre.appendChild(code);
        comparatorDropdowns[comparatorDropdownNumber].correctValue = this.comparators[(comparatorIndex + this.comparators.length / 2) % this.comparators.length];
        codePre.appendChild(comparatorDropdowns[comparatorDropdownNumber++]);
        code = document.createElement("code");
        code.innerHTML += ` ${comparisonValue}) goto `;
        codePre.appendChild(code);
        labelDropdowns[labelDropdownNumber].correctValue = `L${labelNumber + 1}`;
        codePre.appendChild(labelDropdowns[labelDropdownNumber++]);
        code = document.createElement("code");
        code.innerHTML += ";\n";
        codePre.appendChild(code);
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = thenCodeGenerator(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            comparatorDropdowns, comparatorDropdownNumber,
            labelDropdowns, labelDropdownNumber);
        if (hasElse) {
            code = document.createElement("code");
            code.innerHTML += "    goto "
            codePre.appendChild(code);
            labelDropdowns[labelDropdownNumber].correctValue = `L${labelNumber + 1}`;
            codePre.appendChild(labelDropdowns[labelDropdownNumber++]);
            code = document.createElement("code");
            code.innerHTML += ";\n";
            codePre.appendChild(code);
            [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
                codePre, variable, comparatorIndex, comparisonValue, labelNumber,
                loremIpsumPartitions, partitionNumber,
                comparatorDropdowns, comparatorDropdownNumber,
                labelDropdowns, labelDropdownNumber);
        }
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            comparatorDropdowns, comparatorDropdownNumber,
            labelDropdowns, labelDropdownNumber);
    }

    generateProblem(originalCodeArea, gotoCodeArea, elementPrefix) {
        super.generateProblem(originalCodeArea, gotoCodeArea, elementPrefix);
        this.hasElse = (Math.floor(Math.random() * 3) > 0);
        this.generateLoremIpsumPartitions(0, this.loremIpsumCode.length, this.hasElse ? 4 : 3);
        this.generateOriginalCode(originalCodeArea, 0, this.variable, this.comparatorIndex, this.comparisonValue, this.hasElse);
        this.generateGotoCode(gotoCodeArea, this.variable, this.comparatorIndex, this.comparisonValue, this.loremIpsumPartitions, this.generateLabeledCodeBlock, this.hasElse);
    }

    diagnoseMistake(comparatorsAreCorrect, labelsAreCorrect, feedbackArea) {
        if (labelsAreCorrect && !comparatorsAreCorrect) {
            if (this.comparatorDropdowns[0].value === this.comparators[this.comparatorIndex]) {
                feedbackArea.innerHTML = "In the \"if/then\" recipe, you need to negate the original comparator."
            } else if (this.comparatorDropdowns[0].value === "<=>") {
                feedbackArea.innerHTML = "All drop-down menus need a selection."
            } else {
                feedbackArea.innerHTML = `<code>${this.comparatorDropdowns[0].value}</code> is not the negation of <code>${this.comparators[this.comparatorIndex]}</code>.`
            }
        } else if (!labelsAreCorrect && comparatorsAreCorrect) {
            if (this.labelDropdowns[0].value === "label"
                || (this.hasElse && this.labelDropdowns[1].value === "label")) {
                feedbackArea.innerHTML = "All drop-down menus need a selection."
            } else {
                feedbackArea.innerHTML = "You have the correct comparator, but one or more of the <code>goto</code> targets are incorrect."
            }
        } else if (this.comparatorDropdowns[0].value === "<=>"
            || this.labelDropdowns[0].value === "label"
            || (this.hasElse && this.labelDropdowns[1].value === "label")) {
            feedbackArea.innerHTML = "All drop-down menus need a selection."
        } else {
            feedbackArea.innerHTML = `Try comparing the code that executes in your solution with the code that executes in original code when ${this.variable} is ${this.comparisonValue - 1}, ${this.comparisonValue}, and ${this.comparisonValue + 1}.`;
        }
    }
}


class DoLoop extends CodeStructure {
    generateOriginalCode(codeArea, indentLevel, variable, comparatorIndex, comparisonValue, loremIpsumPartitionStart = 0) {
        let partitionNumber = loremIpsumPartitionStart;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        codeArea.innerHTML += `${"    ".repeat(indentLevel)}do {\n`;
        indentLevel++;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        indentLevel--;
        codeArea.innerHTML += `${"    ".repeat(indentLevel)}} while (${variable} ${this.comparators[comparatorIndex]} ${comparisonValue});\n`;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
    }

    generateLabeledDoLoop(codePre, variable, comparatorIndex, comparisonValue, labelStart,
                          loremIpsumPartitions, loremIpsumPartitionStart,
                          comparatorDropdowns, comparatorDropdownStart,
                          labelDropdowns, labelDropdownStart) {
        let labelNumber = labelStart;
        let partitionNumber = loremIpsumPartitionStart;
        let comparatorDropdownNumber = comparatorDropdownStart;
        let labelDropdownNumber = labelDropdownStart;
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
        let code = document.createElement("code");
        code.innerHTML += `L${labelNumber++}:\n`;
        code.innerHTML += `    if (${variable} `;
        codePre.appendChild(code);
        comparatorDropdowns[comparatorDropdownNumber].correctValue = this.comparators[comparatorIndex];
        codePre.appendChild(comparatorDropdowns[comparatorDropdownNumber++]);
        code = document.createElement("code");
        code.innerHTML += ` ${comparisonValue}) goto `;
        codePre.appendChild(code);
        labelDropdowns[labelDropdownNumber].correctValue = `L${labelNumber - 2}`;
        codePre.appendChild(labelDropdowns[labelDropdownNumber++]);
        code = document.createElement("code");
        code.innerHTML += ";\n";
        codePre.appendChild(code);
        return [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber];
    }

    generateGotoCode(codePre, variable, comparatorIndex, comparisonValue, loremIpsumPartitions, labelStart = 1, loremIpsumPartitionStart = 0) {
        let labelNumber = labelStart;
        let partitionNumber = loremIpsumPartitionStart;
        let comparatorDropdownNumber = 0;
        let labelDropdownNumber = 0;
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledDoLoop(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
        let code = document.createElement("code");
        code.innerHTML += `L${labelNumber++}:\n`;
        loremIpsumPartitions[partitionNumber++].forEach((line) => {
            code.innerHTML += "    " + line;
        });
        codePre.appendChild(code);
    }

    generateProblem(originalCodeArea, gotoCodeArea, elementPrefix) {
        super.generateProblem(originalCodeArea, gotoCodeArea, elementPrefix);
        this.generateLoremIpsumPartitions(0, this.loremIpsumCode.length, 3);
        this.generateOriginalCode(originalCodeArea, 0, this.variable, this.comparatorIndex, this.comparisonValue);
        this.generateGotoCode(gotoCodeArea, this.variable, this.comparatorIndex, this.comparisonValue, this.loremIpsumPartitions);
    }

    diagnoseMistake(comparatorsAreCorrect, labelsAreCorrect, feedbackArea) {
        if (labelsAreCorrect && !comparatorsAreCorrect
            && (this.comparatorDropdowns[0].value === this.comparators[(this.comparatorIndex + this.comparators.length / 2) % this.comparators.length])) {
            feedbackArea.innerHTML = "In the \"do-loop\" recipe, you need to preserve the original comparator."
        } else if (this.comparatorDropdowns[0].value === "<=>"
            || this.labelDropdowns[0].value === "label"
            || (this.hasElse && this.labelDropdowns[1].value === "label")) {
            feedbackArea.innerHTML = "All drop-down menus need a selection."
        } else {
            feedbackArea.innerHTML = `Try comparing the code that executes in your solution with the code that executes in original code when ${this.variable} is ${this.comparisonValue - 1}, ${this.comparisonValue}, and ${this.comparisonValue + 1}.`;
        }
    }
}


class WhileLoop extends CodeStructure {
    generateOriginalCode(codeArea, indentLevel, variable, comparatorIndex, comparisonValue, loremIpsumPartitionStart = 0) {
        let partitionNumber = loremIpsumPartitionStart;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        codeArea.innerHTML += `${"    ".repeat(indentLevel)}while (${variable} ${this.comparators[comparatorIndex]} ${comparisonValue}) {\n`;
        indentLevel++;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
        indentLevel--;
        codeArea.innerHTML += `${"    ".repeat(indentLevel)}}\n`;
        this.loremIpsumPartitions[partitionNumber++].forEach((line) => {
            codeArea.innerHTML += "    ".repeat(indentLevel) + line;
        });
    }

    generateConventionalWhileLoop(codePre, variable, comparatorIndex, comparisonValue, loremIpsumPartitions, doLoop, labelStart = 1, loremIpsumPartitionStart = 0) {
        let labelNumber = labelStart;
        let partitionNumber = loremIpsumPartitionStart;
        let comparatorDropdownNumber = 1;
        let labelDropdownNumber = 0;
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
        let code = document.createElement("code");
        code.innerHTML = "    goto ";
        codePre.appendChild(code);
        this.labelDropdowns[labelDropdownNumber].correctValue = `L${labelNumber + 1}`;
        codePre.appendChild(this.labelDropdowns[labelDropdownNumber++]);
        code = document.createElement("code");
        code.innerHTML += ";\n";
        codePre.appendChild(code);
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = doLoop.generateLabeledDoLoop(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
        [labelNumber, partitionNumber, comparatorDropdownNumber, labelDropdownNumber] = this.generateLabeledCodeBlock(
            codePre, variable, comparatorIndex, comparisonValue, labelNumber,
            loremIpsumPartitions, partitionNumber,
            this.comparatorDropdowns, comparatorDropdownNumber,
            this.labelDropdowns, labelDropdownNumber);
    }

    generateGuardedDoLoop(codePre, variable, comparatorIndex, comparisonValue, loremIpsumPartitions, ifThen, doLoop, labelStart = 1, loremIpsumPartitionStart = 0) {
        ifThen.generateGotoCode(
            codePre, variable, comparatorIndex, comparisonValue,
            loremIpsumPartitions, doLoop.generateLabeledDoLoop.bind(ifThen), false,
            this.comparatorDropdowns, this.labelDropdowns
        );
        let originalCorrectValue = this.labelDropdowns[0].correctValue;
        this.labelDropdowns[0].correctValue = `${originalCorrectValue[0]}${parseInt(originalCorrectValue.substring(1)) + 1}`;
    }

    generateProblem(originalCodeArea, gotoCodeArea, elementPrefix) {
        super.generateProblem(originalCodeArea, gotoCodeArea, elementPrefix);
        let ifThen = new Conditional();
        let doLoop = new DoLoop();
        this.generateLoremIpsumPartitions(0, this.loremIpsumCode.length, 3);
        this.generateOriginalCode(originalCodeArea, 0, this.variable, this.comparatorIndex, this.comparisonValue);
        this.useGuardedDoLoop = (Math.floor(Math.random() * 2) === 1);
        this.useGuardedDoLoop = true;
        if (this.useGuardedDoLoop) {
            this.generateGuardedDoLoop(gotoCodeArea, this.variable, this.comparatorIndex, this.comparisonValue, this.loremIpsumPartitions, ifThen, doLoop);
        } else {
            this.generateConventionalWhileLoop(gotoCodeArea, this.variable, this.comparatorIndex, this.comparisonValue, this.loremIpsumPartitions, doLoop);
        }
    }

    diagnoseMistake(comparatorsAreCorrect, labelsAreCorrect, feedbackArea) {
        feedbackArea.innerHTML = "";
        if (
            (this.useGuardedDoLoop && this.comparatorDropdowns[0].value === "<=>")
            || (this.comparatorDropdowns[1].value === "<=>")
            || (this.labelDropdowns[0].value === "label")
            || (this.labelDropdowns[1].value === "label")
        ) {
            feedbackArea.innerHTML += "All drop-down menus need a selection. ";
        } else {
            if (comparatorsAreCorrect) {
                feedbackArea.innerHTML += "The comparator(s) are correct. ";
            } else {
                if (this.comparatorDropdowns[0].value === this.comparators[this.comparatorIndex]) {
                    feedbackArea.innerHTML += "In a \"guarded do-loop\", the first comparator is from the \"if-then\" recipe and should be negated. ";
                } else if (this.useGuardedDoLoop) {
                    feedbackArea.innerHTML += "The first comparator is not correct. ";
                }
                if (this.comparatorDropdowns[1].value === this.comparators[(this.comparatorIndex + this.comparators.length / 2) % this.comparators.length]) {
                    feedbackArea.innerHTML += "The comparator at the end is from the \"do-loop\" recipe and should be the original (non-negated) comparator. "
                } else {
                    feedbackArea.innerHTML += "The comparator at the end is not correct. ";
                }
            }
            if (labelsAreCorrect) {
                feedbackArea.innerHTML += "The <code>goto</code> targets are correct.<br>";
            } else {
                feedbackArea.innerHTML += "One or more <code>goto</code> targets are not correct.<br>";
            }
            feedbackArea.innerHTML += "Try comparing the code that executes in the original code and in the <code>goto</code>-style code when:<br>";
            feedbackArea.innerHTML += ` - (${this.variable} ${this.comparators[this.comparatorIndex]} ${this.comparisonValue}) is initially false, and when it's initially true<br>`;
            feedbackArea.innerHTML += ` - (${this.variable} ${this.comparators[this.comparatorIndex]} ${this.comparisonValue}) is true on subsequent iterations, and when it's false on subsequent iterations<br>`;
        }
    }
}