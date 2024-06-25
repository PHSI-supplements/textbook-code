/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

function selectInstructionSet(elementPrefix) {
    let selectionValue = null;
    let i = 0;
    while (selectionValue === null) {
        let button = document.getElementById(elementPrefix + "_selection" + i);
        if (button !== null && button.checked) {
            selectionValue = Symbol.for(button.value);
        }
        i += 1;
    }
    return selectionValue;
}


function selectContentParameters(instructionSet, preferredScale = -1) {
    let scale = preferredScale === -1 ? Math.floor(Math.random() * 4) : preferredScale;
    let baseRegisters = []
    let indexRegisters = [];
    switch (instructionSet) {
        case InstructionSet.IA32:
            baseRegisters = ["%eax", "%ebx", "%esp", "%ebp"];
            indexRegisters = ["%esi", "%edi", "%ecx", "%edx"];
            break;
        case InstructionSet.x86_64:
            baseRegisters = ["%rax", "%rbx", "%rsp", "%rbp"];
            indexRegisters = ["%rsi", "%rdi", "%rcx", "%rdx"];
            break;
        case InstructionSet.T32:
            baseRegisters = ["R0", "R1", "R3", "R6"];
            indexRegisters = ["R2", "R4", "R5", "R7"];
            break;
        case InstructionSet.A64:
            baseRegisters = ["X0", "X1", "X3", "X6"];
            indexRegisters = ["X2", "X4", "X5", "X7"];
            break;
        default:
            alert("Unknown instruction set: " + instructionSet.toString());
            console.error("Unknown instruction set: " + instructionSet.toString());
    }
    let address = new Address(instructionSet, baseRegisters, indexRegisters, scale);
    let knownContents = new Map([
        [address.baseRegister, address.baseAddress],
    ]);
    if (address.indexRegister !== null) {
        knownContents.set(address.indexRegister, address.index);
    }
    let leastAddress = address.baseAddress - 2 * (1 << scale);
    let greatestAddress = address.baseAddress + 7 * (1 << scale);
    return {address, baseRegisters, indexRegisters, leastAddress, greatestAddress, knownContents};
}


function createContent(addressRegisters, dataRegisters, leastAddress, greatestAddress, knownContents, scale) {
    let contents = new Map();
    addressRegisters.forEach((register) => contents.set(register, 0x4000 + (1 << scale) * Math.floor(Math.random() * 0x8000 / (1 << scale))));
    dataRegisters.forEach((register) => contents.set(register, Math.floor(Math.random() * 256)));
    for (let address = leastAddress; address <= greatestAddress; address += (1 << scale)) {
        contents.set(address, Math.floor(Math.random() * 256));
    }
    knownContents.keys().forEach((key) => contents.set(key, knownContents.get(key)));
    return contents;
}


function displayContents(table, contents, registerNames, leastAddress, greatestAddress, scale) {
    table.innerHTML = "";
    // const tableBody = document.createElement("tbody");
    let row = document.createElement("tr");
    let cell = document.createElement("th");
    cell.setAttribute("align", "center");
    let cellContent = document.createTextNode("Registers");
    cell.appendChild(cellContent);
    row.appendChild(cell);
    cell = document.createElement("th");
    cell.setAttribute("align", "center");
    cellContent = document.createTextNode("Contents");
    cell.appendChild(cellContent);
    row.appendChild(cell);
    cell = document.createElement("th");
    cell.setAttribute("width", "50");
    row.appendChild(cell);
    cell = document.createElement("th");
    cell.setAttribute("align", "center");
    cellContent = document.createTextNode("Addresses");
    cell.appendChild(cellContent);
    row.appendChild(cell);
    cell = document.createElement("th");
    cell.setAttribute("align", "center");
    cellContent = document.createTextNode("Contents");
    cell.appendChild(cellContent);
    row.appendChild(cell);
    table.appendChild(row);
    let i = 0;
    let address = greatestAddress;
    while (i < registerNames.length || address >= leastAddress) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.setAttribute("align", "right");
        if (i < registerNames.length) {
            cellContent = document.createTextNode(registerNames[i]);
            cell.appendChild(cellContent);
        }
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.setAttribute("align", "right");
        if (i < registerNames.length) {
            cellContent = document.createTextNode("0x" + contents.get(registerNames[i]).toString(16).toUpperCase());
            cell.appendChild(cellContent);
        }
        row.appendChild(cell);
        cell = document.createElement("td");
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.setAttribute("align", "right");
        if (address >= leastAddress) {
            cellContent = document.createTextNode("0x" + address.toString(16).toUpperCase());
            cell.appendChild(cellContent);
        }
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.setAttribute("align", "right");
        if (address >= leastAddress) {
            cellContent = document.createTextNode("0x" + contents.get(address).toString(16).toUpperCase());
            cell.appendChild(cellContent);
        }
        row.appendChild(cell);
        table.appendChild(row);
        address -= (1 << scale);
        i++;
    }
}


class Address {
    constructor(instructionSet, possibleBaseRegisters, possibleIndexRegisters, scale) {
        this.instructionSet = instructionSet;
        this._baseAddress = 0x4000 + 8 * Math.floor(Math.random() * 0x1000);
        this._baseRegister = possibleBaseRegisters[Math.floor(Math.random() * possibleBaseRegisters.length)];
        let addressingMode = Math.floor(Math.random() * 7); // 0 = simple; 1-3 = displacement; 4-6 = indexed
        switch (addressingMode) {
            case 0:
                this._index = 0;
                this._indexRegister = null;
                break;
            case 1:
            case 2:
            case 3:
                this._index = Math.floor(Math.random() * 8) - 2;
                this._indexRegister = null;
                break;
            case 4:
            case 5:
            case 6:
                this._index = Math.floor(Math.random() * 8);
                this._indexRegister = possibleIndexRegisters[Math.floor(Math.random() * possibleIndexRegisters.length)];
                break;
            default:
                console.error("Unexpected addressing mode: " + addressingMode);
        }
        this._scale = scale;
        this._displacement = this._index * (1 << scale);
    }

    get resolvedAddress() {
        return this._baseAddress + this._displacement;
    }

    get baseAddress() {
        return this._baseAddress;
    }

    get index() {
        return this._index;
    }

    get scale() {
        return this._scale;
    }

    get displacement() {
        return this._displacement;
    }

    get baseRegister() {
        return this._baseRegister;
    }

    get indexRegister() {
        return this._indexRegister;
    }

    toString() {
        let problemStringComponents = ["", "", this._baseRegister, "", "", ""];
        if (this.instructionSet === InstructionSet.IA32 || this.instructionSet === InstructionSet.x86_64) {
            problemStringComponents[1] = "(";
            problemStringComponents[5] = ")";
        } else if (this.instructionSet === InstructionSet.T32 || this.instructionSet === InstructionSet.A64) {
            problemStringComponents[1] = "[";
            problemStringComponents[5] = "]";
        } else {
            alert("Unknown instruction set: " + this.instructionSet.toString());
            console.error("Unknown instruction set: " + this.instructionSet.toString());
        }
        if (this._indexRegister !== null) {                  // Indexed mode
            problemStringComponents[3] = `, ${this._indexRegister}`;
            if (this._scale > 0) {
                if (this.instructionSet === InstructionSet.IA32 || this.instructionSet === InstructionSet.x86_64) {
                    problemStringComponents[4] = `, ${1 << this._scale}`;
                } else if (this.instructionSet === InstructionSet.T32 || this.instructionSet === InstructionSet.A64) {
                    problemStringComponents[4] = `, lsl ${this._scale}`;
                }
            }
        } else if (this._displacement !== 0) {                 // Displacement mode
            if (this.instructionSet === InstructionSet.IA32 || this.instructionSet === InstructionSet.x86_64) {
                problemStringComponents[0] = this._displacement.toString();
            } else if (this.instructionSet === InstructionSet.T32 || this.instructionSet === InstructionSet.A64) {
                problemStringComponents[3] = ", #" + this._displacement.toString();
            }
        } else {                                            // Simple mode
            // Nothing more to do
        }
        return problemStringComponents.join("");
    }
}


class AddressingModeProblem {
    constructor(getInstructionSet, elementPrefix) {
        this.getInstructionSet = getInstructionSet;
        this.elementPrefix = elementPrefix;
        this.addressField = document.getElementById(elementPrefix + "_address");
        this.contentField = document.getElementById(elementPrefix + "_content");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.addressField.onkeydown = this.handleKeyPress.bind(this);
        this.contentField.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        this.generateProblem();
    }

    generateProblem() {
        let {
            address,
            baseRegisters,
            indexRegisters,
            leastAddress,
            greatestAddress,
            knownContents
        } = selectContentParameters(this.getInstructionSet(this.elementPrefix));
        this.address = address;
        if (this.address.indexRegister === null && this.address.displacement === 0) {       // simple addressing mode
            let shift = Math.floor(Math.random() * 8) - 6;
            leastAddress += shift * (1 << this.address.scale);
            greatestAddress += shift * (1 << this.address.scale);
        }
        this.registerNames = baseRegisters.concat(indexRegisters).sort();
        let table = document.getElementById(this.elementPrefix + "_data");
        this.contents = createContent(baseRegisters, indexRegisters, leastAddress, greatestAddress, knownContents, this.address.scale);
        displayContents(table, this.contents, this.registerNames, leastAddress, greatestAddress, this.address.scale);
        let problemArea = document.getElementById(this.elementPrefix + "_problem");
        problemArea.innerHTML = this.address.toString();
        this.feedbackArea.innerHTML = "&nbsp;";
        this.addressField.value = "";
        this.contentField.value = "";
    }

    checkAnswer() {
        let addressString = this.addressField.value;
        let addressValue;
        if (addressString.length > 0) {
            let addressStringWithoutSeparators = addressString.replaceAll("'", "");
            addressValue = parseInt(addressStringWithoutSeparators, 16);
        }
        let contentString = this.contentField.value;
        let contentValue;
        if (contentString.length > 0) {
            let contentStringWithoutSeparators = contentString.replaceAll("'", "");
            contentValue = parseInt(contentStringWithoutSeparators, 16);
        }
        if (addressValue === this.address.resolvedAddress && contentValue === this.contents.get(addressValue)) {
            this.feedbackArea.innerHTML = "Correct!";
        } else if (this.registerNames.includes(addressString)) {
            this.feedbackArea.innerHTML = "The address should be a memory address, not a register.";
        } else if (isNaN(addressValue || isNaN(contentValue))) {
            this.feedbackArea.innerHTML = "Be sure to express your answers in hexadecimal.";
        } else {
            this.feedbackArea.innerHTML = "";
            if (addressString.length === 0 && contentString.length === 0) {
                this.feedbackArea.innerHTML = "Don't forget to identify the address and the content.";
            }
            if (addressString.length > 0) {
                if (addressValue === this.address.resolvedAddress) {
                    this.feedbackArea.innerHTML = `0x${addressString} is the correct address. `;
                    if (contentString.length === 0) {
                        this.feedbackArea.innerHTML += `Don't forget to identify the content at 0x${addressString}.`;
                    }
                } else {
                    if (addressValue === this.address.baseAddress) {
                        this.feedbackArea.innerHTML = `0x${addressString} is the base address address. You need to `;
                        if (this.address.indexRegister === null) {
                            this.feedbackArea.innerHTML += "add the displacement.";
                        } else if (this.address.scale > 0) {
                            this.feedbackArea.innerHTML += "apply the scaled index.";
                        } else {
                            this.feedbackArea.innerHTML += "apply the index.";
                        }
                    } else if (this.address.indexRegister !== null && addressValue === this.address.baseAddress + this.address.index) {
                        this.feedbackArea.innerHTML = `0x${addressString} is obtained by adding the unscaled index to the base address; you need to apply the scaled index.`;
                    } else if (this.address.displacement < 0 && addressValue === this.address.baseAddress - this.address.displacement) {
                        this.feedbackArea.innerHTML = "The displacement is negative; the address should be less than the base address.";
                    } else if (this.address.indexRegister === null && addressValue === this.address.baseAddress + parseInt(this.address.displacement.toString(), 16)) {
                        this.feedbackArea.innerHTML = `The displacement is not ${this.address.displacement}<sub>16</sub>. The displacement is ${this.address.displacement}<sub>10</sub>, which is ${this.address.displacement.toString(16)}<sub>16</sub>.`;
                    } else {
                        this.feedbackArea.innerHTML = `0x${addressString} is not the correct address. `;
                    }
                }
            }
            if (contentString.length > 0) {
                let alternateContent = this.contents.get(addressValue);
                if (addressString.length === 0 && contentValue === this.contents.get(this.address.resolvedAddress)) {
                    this.feedbackArea.innerHTML += `0x${contentString} is the correct content, but you forgot to identify the address that the content is at.`
                } else if (contentValue === this.contents.get(this.address.resolvedAddress)) {
                    this.feedbackArea.innerHTML += `0x${contentString} is the content of the correct address, but not of 0x${addressString}.`;
                } else if (contentValue === alternateContent) {
                    this.feedbackArea.innerHTML += `0x${contentString} is the correct content for 0x${addressString}, but not of the correct address.`;
                } else {
                    this.feedbackArea.innerHTML += `0x${contentString} is not the correct content.`;
                    // TODO - diagnose problem if possible
                }
            }
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        }
    }
}


class InstructionProblem {
    constructor(getInstructionSet, elementPrefix) {
        this.getInstructionSet = getInstructionSet;
        this.elementPrefix = elementPrefix;
        this.destinationPrefix = document.getElementById(elementPrefix + "_destination_prefix");
        this.destinationAnswer = document.getElementById(elementPrefix + "_destination");
        this.contentAnswer = document.getElementById(elementPrefix + "_content");
        this.feedbackArea = document.getElementById(elementPrefix + "_feedback");
        this.checkButton = document.getElementById(elementPrefix + "_check");
        let tryAgainButton = document.getElementById(elementPrefix + "_again");
        this.destinationTypeArea = document.getElementById(elementPrefix + "_destination_type");
        this.destinationTypeButtons = [document.createElement("input"), document.createElement("input")];
        this.destinationTypeLabels = [document.createElement("label"), document.createElement("label")];
        let button = document.createElement("input");
        this.destinationTypeButtons[0].setAttribute("type", "radio");
        this.destinationTypeButtons[0].setAttribute("name", this.elementPrefix + "_destinationType");
        this.destinationTypeButtons[0].setAttribute("id", this.elementPrefix + "_destinationType_register");
        this.destinationTypeButtons[0].setAttribute("value", "register");
        this.destinationTypeLabels[0].appendChild(button);
        this.destinationTypeLabels[0].innerHTML = "register";
        this.destinationTypeButtons[1] = document.createElement("input");
        this.destinationTypeButtons[1].setAttribute("type", "radio");
        this.destinationTypeButtons[1].setAttribute("name", this.elementPrefix + "_destinationType");
        this.destinationTypeButtons[1].setAttribute("id", this.elementPrefix + "_destinationType_memory");
        this.destinationTypeButtons[1].setAttribute("value", "memory");
        this.destinationTypeLabels[1].appendChild(button);
        this.destinationTypeLabels[1].innerHTML = "memory";
        this.destinationAnswer.onkeydown = this.handleKeyPress.bind(this);
        this.contentAnswer.onkeydown = this.handleKeyPress.bind(this);
        this.checkButton.onclick = this.checkAnswer.bind(this);
        tryAgainButton.onclick = this.generateProblem.bind(this);
        this.destinationTypeButtons[0].onchange = this.setDestinationTypeSelection.bind(this);
        this.destinationTypeButtons[1].onchange = this.setDestinationTypeSelection.bind(this);
        this.generateProblem();
    }

    generateInstruction(address, baseRegisters, indexRegisters) {
        let registers = baseRegisters.concat(indexRegisters);
        let instructionSet = this.getInstructionSet();
        let operations = ["move", "load", "store", "pointer", "add", "subtract"];
        let instructions = [];
        let argumentCounts = [];
        let immediatePrefix;
        switch (instructionSet) {
            case InstructionSet.IA32:
            case InstructionSet.x86_64:
                instructions = ["movq", "movq", "movq", "leaq", "addq", "subq"];
                argumentCounts = [2, 2, 2, 2, 2, 2];
                immediatePrefix = "$";
                break;
            case InstructionSet.T32:
            case InstructionSet.A64:
                instructions = ["mov", "ldr", "str", "add", "add", "sub"];
                argumentCounts = [2, 2, 2, 3, 3, 3];
                immediatePrefix = "#";
                break;
            default:
                alert("Unknown instruction set: " + instructionSet.toString());
                console.error("Unknown instruction set: " + instructionSet.toString());
        }
        let instructionIndex = Math.floor(Math.random() * instructions.length);
        this.operation = operations[instructionIndex];
        this.numberOfArguments = argumentCounts[instructionIndex];
        this.sources = [];
        switch (this.operation) {
            case "move":
                do {
                    this.destination = registers[Math.floor(Math.random() * registers.length)];
                } while (this.destination === "%rsp" || this.destination === "%esp" || this.destination === "R15");    // don't let the stack pointer be the destination
                // the source can be an immediate value or a register
                if (Math.floor(Math.random() * 2) === 0) {
                    this.sources.push(immediatePrefix + "0x" + Math.floor(Math.random() * 256).toString(16).toUpperCase());
                } else {
                    this.sources.push("");
                    do {
                        this.sources[this.sources.length - 1] = registers[Math.floor(Math.random() * registers.length)];
                    } while (this.sources[this.sources.length - 1] === this.destination);
                }
                break;
            case "load":
                do {
                    this.destination = registers[Math.floor(Math.random() * registers.length)];
                } while (this.destination === "%rsp" || this.destination === "%esp" || this.destination === "R15");
                this.sources.push(address.toString());
                break;
            case "store":
                this.destination = address.toString();
                this.sources.push(registers[Math.floor(Math.random() * registers.length)]);
                break;
            case "pointer":
                do {
                    this.destination = registers[Math.floor(Math.random() * registers.length)];
                } while (this.destination === "%rsp" || this.destination === "%esp" || this.destination === "R15");
                if (instructionSet === InstructionSet.T32 || instructionSet === InstructionSet.A64) {
                    this.sources.push(address.baseRegister);
                    if (address.indexRegister === null) {
                        this.sources.push(address.displacement);
                    } else if (address.scale > 0) {
                        this.sources.push(`${address.indexRegister}, lsl ${address.scale}`);
                    } else {
                        this.sources.push(address.indexRegister)
                    }
                } else {
                    this.sources.push(address.toString());
                }
                break;
            case "add":
            case "subtract":
                // x86 can have at most one argument be a memory location; Arm cannot
                let argumentCouldBeMemory = (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64);
                if (!argumentCouldBeMemory || Math.floor(Math.random() * 2) === 0) {
                    do {
                        this.destination = registers[Math.floor(Math.random() * registers.length)];
                    } while (this.destination === "%rsp" || this.destination === "%esp" || this.destination === "R15");
                } else {
                    this.destination = address.toString();
                    argumentCouldBeMemory = false;
                }
                for (let i = 0; i < this.numberOfArguments - 1; i++) {
                    let argumentCouldBeImmediate = (i === this.numberOfArguments - 2);
                    this.sources[i] = null;
                    while (this.sources[i] === null) {
                        switch (Math.floor(Math.random() * 3)) {
                            case 0:
                                if (argumentCouldBeMemory) {
                                    this.sources[i] = address.toString();
                                    argumentCouldBeMemory = false;
                                }
                                break;
                            case 1:
                                if (argumentCouldBeImmediate) {
                                    this.sources[i] = immediatePrefix + "0x" + Math.floor(Math.random() * 256).toString(16).toUpperCase();
                                }
                                break;
                            case 2:
                                this.sources[i] = indexRegisters[Math.floor(Math.random() * indexRegisters.length)];
                                break;
                        }
                    }
                }
                break;
            default:
                alert("Unknown operation: " + this.operation);
                console.error("Unknown operation: " + this.operation);
        }
        let addComma = false;
        this.instruction = instructions[instructionIndex] + "&nbsp;&nbsp;";
        if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64 || this.operation === "store") {
            for (let i = 0; i < this.numberOfArguments - 1; i++) {
                if (addComma) {
                    this.instruction += ",&nbsp";
                }
                this.instruction += this.sources[i];     // TODO: generalize the number of this.sources;
                addComma = true;
            }
        }
        if (addComma) {
            this.instruction += ",&nbsp";
        }
        this.instruction += this.destination;
        if ((instructionSet === InstructionSet.T32 || instructionSet === InstructionSet.A64) && this.operation !== "store") {
            for (let i = 0; i < this.numberOfArguments - 1; i++) {
                this.instruction += ",&nbsp" + this.sources[i];
            }
        }
    }

    generateProblem() {
        let instructionSet = this.getInstructionSet(this.elementPrefix);
        let {
            address,
            baseRegisters,
            indexRegisters,
            leastAddress,
            greatestAddress,
            knownContents
        } = selectContentParameters(instructionSet, 3);     // TODO: make the preferred scale 2 if IA32 or T32
        this.address = address;
        this.registerNames = baseRegisters.concat(indexRegisters).sort();
        let table = document.getElementById(this.elementPrefix + "_data");
        this.contents = createContent(baseRegisters, indexRegisters, leastAddress, greatestAddress, knownContents, this.address.scale);
        displayContents(table, this.contents, this.registerNames, leastAddress, greatestAddress, this.address.scale);
        this.generateInstruction(address, baseRegisters, indexRegisters);
        let problemArea = document.getElementById(this.elementPrefix + "_problem");
        problemArea.innerHTML = `<code>${this.instruction}&nbsp;</code>`;
        this.feedbackArea.innerHTML = "&nbsp;";
        this.destinationPrefix.innerHTML = "";
        this.destinationTypeButtons[0].checked = false;
        this.destinationTypeButtons[1].checked = false;
        this.destinationAnswer.value = "";
        this.contentAnswer.value = "";
        let destinationTypeNodes = Array.from(this.destinationTypeArea.childNodes);
        destinationTypeNodes.forEach((element) => {
            this.destinationTypeArea.removeChild(element)
        })
        if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64) {
            this.destinationTypeArea.appendChild(this.destinationTypeLabels[0]);
            this.destinationTypeArea.appendChild(this.destinationTypeButtons[0]);
            this.destinationTypeArea.appendChild(document.createElement("br"));
            this.destinationTypeArea.appendChild(this.destinationTypeLabels[1]);
            this.destinationTypeArea.appendChild(this.destinationTypeButtons[1]);
        }
        if (instructionSet === InstructionSet.T32 || instructionSet === InstructionSet.A64) {
            if (this.destination[0] === "[") {
                this.destinationPrefix.innerHTML = "0x";
            } else {
                this.destinationPrefix.innerHTML = "";
            }
        }
    }

    checkAnswer() {
        let instructionSet = this.getInstructionSet(this.elementPrefix);
        let destinationTypeSelection = this.destinationTypeButtons[0].checked ? this.destinationTypeLabels[0].innerHTML : null;
        destinationTypeSelection = this.destinationTypeButtons[1].checked ? this.destinationTypeLabels[1].innerHTML : destinationTypeSelection;
        let destinationString = this.destinationAnswer.value;
        let destinationValue = null;
        if (destinationString.substring(0, 2).toLowerCase() === "0x") {
            destinationString = destinationString.substring(2);
        }
        let destinationStringWithoutSeparators = destinationString.replaceAll("'", "");
        // destinationValue = parseInt(destinationStringWithoutSeparators, 16);
        // let destinationIsAddress = (!isNaN(destinationValue));
        let destinationIsAddress = true;
        let invalidRegisterName = false;
        destinationStringWithoutSeparators.split("").forEach((character) => {
            if (!(/[0-9a-fA-F]/.test(character))) {
                destinationIsAddress = false;
            }
        });
        if (destinationIsAddress) {
            destinationValue = parseInt(destinationStringWithoutSeparators, 16);
        } else {
            if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64) {
                if ([2, 3].includes(destinationString.length) && destinationString[0] !== '%') {
                    destinationString = "%" + destinationString;
                }
                if (destinationString.length < 3 || destinationString.length > 4) {
                    invalidRegisterName = true;
                }
            }
            if (instructionSet === InstructionSet.T32 || instructionSet === InstructionSet.A64) {
                if (destinationString.length < 2 || destinationString.length > 3 || !["R", "W", "X", "r", "w", "x"].includes(destinationString[0])) {
                    invalidRegisterName = true;
                }
            }
        }
        let contentString = this.contentAnswer.value;
        if (contentString.substring(0, 2).toLowerCase() === "0x") {
            contentString = contentString.substring(2);
        } else if (contentString.substring(0, 3).toLowerCase() === "-0x") {
            contentString = "-" + contentString.substring(3);
        }
        let contentStringWithoutSeparators = contentString.replaceAll("'", "");
        let contentValue = parseInt(contentStringWithoutSeparators, 16);
        let correctDestinationValue;
        let correctDestinationIsAddress;
        if ([")", "]"].includes(this.destination[this.destination.length - 1])) {
            correctDestinationValue = this.address.resolvedAddress;
            correctDestinationIsAddress = true;
        } else {
            correctDestinationValue = this.destination;
            correctDestinationIsAddress = false;
        }
        if (destinationString.length > 0) {
            if (destinationIsAddress && correctDestinationIsAddress) {
                if (destinationValue === correctDestinationValue) {
                    this.feedbackArea.innerHTML = "The destination is correct! ";
                } else {
                    this.feedbackArea.innerHTML = "The destination is not the correct address. ";
                }
            } else if (!destinationIsAddress && !correctDestinationIsAddress) {
                if (destinationString.toUpperCase() === this.destination.toUpperCase()) {
                    this.feedbackArea.innerHTML = "The destination is correct! ";
                } else if (invalidRegisterName) {
                    this.feedbackArea.innerHTML = `${destinationString} is not a valid register. `;
                } else {
                    let actualRegisterSize;
                    let expectedRegisterSize;
                    let usesVirtualRegister = false;
                    if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.T32) {
                        expectedRegisterSize = 32;
                        actualRegisterSize = 32;
                    }
                    if (instructionSet === InstructionSet.x86_64 || instructionSet === InstructionSet.A64) {
                        expectedRegisterSize = 64;
                        actualRegisterSize = 64;
                    }
                    if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64) {
                        if ((destinationString.toUpperCase().replaceAll("R", "E") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("R", "") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("R", "").replaceAll("X", "L") === this.destination.toUpperCase())) {
                            actualRegisterSize = 64;
                            usesVirtualRegister = true;
                        } else if ((destinationString.toUpperCase().replaceAll("E", "R") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("E", "") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("E", "").replaceAll("X", "L") === this.destination.toUpperCase())) {
                            actualRegisterSize = 32;
                            usesVirtualRegister = true;
                        } else if (destinationString.length === 3) {
                            if (destinationString.toUpperCase().substring(1) === this.destination.toUpperCase().substring(2)) {
                                actualRegisterSize = 16;
                                usesVirtualRegister = true;
                            } else if ((destinationString.toUpperCase().replaceAll("L", "X").substring(1) === this.destination.toUpperCase().substring(2))
                                || (destinationString.toUpperCase().replaceAll("H", "X").substring(1) === this.destination.toUpperCase().substring(2))) {
                                actualRegisterSize = 8;
                                usesVirtualRegister = true;
                            }
                        }
                    } else if (instructionSet === InstructionSet.A64) {
                        if (destinationString.toUpperCase().replaceAll("X", "W") === this.destination.toUpperCase()) {
                            actualRegisterSize = 64;
                            usesVirtualRegister = true;
                        } else if ((destinationString.toUpperCase().replaceAll("W", "X") === this.destination.toUpperCase())) {
                            actualRegisterSize = 32;
                            usesVirtualRegister = true;
                        }
                    }
                    if (usesVirtualRegister) {
                        this.feedbackArea.innerHTML = `${destinationString} is a ${actualRegisterSize}-bit register; you want the ${expectedRegisterSize}-bit register ${this.destination}. `;
                    } else if ((instructionSet === InstructionSet.T32)
                        && ((destinationString.toUpperCase().replaceAll("X", "R") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("W", "R") === this.destination.toUpperCase()))) {
                        this.feedbackArea.innerHTML = destinationString + " is an A64 register; you want the T32 register " + this.destination + ". ";
                    } else if ((instructionSet === InstructionSet.A64)
                        && ((destinationString.toUpperCase().replaceAll("R", "X") === this.destination.toUpperCase())
                            || (destinationString.toUpperCase().replaceAll("R", "W") === this.destination.toUpperCase()))) {
                        this.feedbackArea.innerHTML = destinationString + " is a T32 register; you want the A64 register " + this.destination + ". ";
                    } else {
                        this.feedbackArea.innerHTML = "The destination is not the correct register. ";
                    }
                }
            } else if (!destinationIsAddress && correctDestinationIsAddress) {
                if (invalidRegisterName) {
                    if (destinationString.toUpperCase() === this.destination.toUpperCase()) {
                        this.feedbackArea.innerHTML = `While ${destinationString} is the destination argument in the instruction, you need to dereference the pointer and provide an address. `;
                    } else if (destinationTypeSelection === "memory") {
                        this.feedbackArea.innerHTML = "You indicated that the destination should be a memory location, but the destination is neither an address nor does it resolve to the correct address. ";
                    } else if (/[(\[].*[)\]]/.test(destinationString)) {
                        this.feedbackArea.innerHTML = `You appear to have intended to express a memory argument, but you need to provide an address. `;
                    } else {
                        this.feedbackArea.innerHTML = `${destinationString} is not a valid destination. `
                    }
                } else {
                    this.feedbackArea.innerHTML = `The destination you provided is the register ${destinationString}, but the correct destination is a memory location. `;
                    if (destinationTypeSelection === "memory") {
                        this.feedbackArea.innerHTML += "You indicated that the destination should be a memory location; perhaps you meant to dereference a pointer. ";
                    }
                }
            } else {    // destinationIsAddress && !correctDestinationIsAddress
                this.feedbackArea.innerHTML = `The destination you provided is the memory address 0x${destinationString}, but the correct destination is a register. `;
                if (this.destinationTypeSelection === "register") {
                    this.feedbackArea.innerHTML += `You indicated that the destination should be a register; perhaps you inadvertently dereferenced a pointer. `;
                }
            }
        } else {
            this.feedbackArea.innerHTML = "Don't forget to provide the destination. ";
        }
        let correctContent;
        let operands = [];
        if (this.sources.length === 1) {
            operands.push(this.destination);
            operands.push(this.sources[0]);
        } else {
            operands.push(this.sources[0]);
            operands.push(this.sources[1]);
        }
        for (let i = 0; i < operands.length; i++) {
            if (operands[i].substring(0, 2) === "0x") {
                operands[i] = parseInt(operands[i], 16);
            } else if (operands[i].substring(1, 3) === "0x") {
                operands[i] = parseInt(operands[i].substring(1), 16);
            } else if (this.registerNames.includes(operands[i])) {
                operands[i] = this.contents.get(operands[i]);
            } else if (this.operation === "pointer") {
                // Arm
                if (operands[i].includes("lsl")) {
                    let register = operands[i].split(",")[0].trim();
                    let shiftAmount = parseInt(operands[i][operands[i].length - 1]);
                    operands[i] = this.contents.get(register) << shiftAmount;
                }
                // x86
                if (operands[i][operands[i].length - 1] === ")") {
                    operands[i] = this.address.resolvedAddress;
                }
            } else {
                operands[i] = this.contents.get(this.address.resolvedAddress);
            }
        }
        switch (this.operation) {
            case "move":
            case "load":
            case "store":
                correctContent = operands[1];
                break;
            case "pointer":
                if (instructionSet === InstructionSet.IA32 || instructionSet === InstructionSet.x86_64) {
                    correctContent = operands[1];
                }
                if (instructionSet === InstructionSet.T32 || instructionSet === InstructionSet.A64) {
                    correctContent = operands[0] + operands[1];
                }
                break;
            case "add":
                correctContent = operands[0] + operands[1];
                break;
            case "subtract":
                correctContent = operands[0] - operands[1];
                break;
            default:
                alert("Unknown operation: " + this.operation);
                console.error("Unknown operation: " + this.operation);
        }
        if (contentString.length > 0) {
            if (contentValue === correctContent) {
                this.feedbackArea.innerHTML += "The content is correct!";
            } else if (((contentStringWithoutSeparators.length < 13) && ((contentValue - (2 ** (contentStringWithoutSeparators.length * 4))) === correctContent))
                || (/^f*f$/.test(contentStringWithoutSeparators.substring(0, contentStringWithoutSeparators.length - 10)) && ((parseInt(contentStringWithoutSeparators.substring(contentStringWithoutSeparators.length - 12), 16) - (2 ** (12 * 4))) === correctContent))) {
                this.feedbackArea.innerHTML += `The content is correct when using ${contentStringWithoutSeparators.length / 2} bytes for the answer!`;
            } else if (isNaN(contentValue)) {
                this.feedbackArea.innerHTML += `The content must be a valid number; 0x${contentString} is not a valid number.`;
            } else if (contentValue === -correctContent && this.operation === "subtract") {
                this.feedbackArea.innerHTML += `0x${contentString} is not correct, but 0x${correctContent.toString(16)} is; double-check your operand order.`;
            } else if (this.operation === "pointer" && contentValue === this.contents.get(correctContent)) {
                this.feedbackArea.innerHTML += `0x${contentString} is the content of  memory at address 0x${correctContent.toString(16).toUpperCase()}; however, only the pointer (without dereferencing) should be placed in the destination.`;
            } else if (this.operation === "load" && this.contents.get(contentValue) === correctContent) {
                this.feedbackArea.innerHTML += `0x${contentString} is the source address; you need to dereference the pointer and copy the content of memory at 0x${contentString} into the destination.`;
            } else {
                this.feedbackArea.innerHTML += `0x${contentString} is not the correct content.`;
            }
        } else {
            this.feedbackArea.innerHTML += "Don't forget to provide the content that will be placed in the destination.";
        }
    }

    setDestinationTypeSelection(event) {
        this.destinationTypeSelection = event.target.value;
        if (this.destinationTypeSelection === "memory") {
            this.destinationPrefix.innerHTML = "0x";
        } else if ((this.getInstructionSet() === InstructionSet.IA32 || this.getInstructionSet() === InstructionSet.x86_64) && this.destinationTypeSelection === "register") {
            this.destinationPrefix.innerHTML = "%";
        } else {
            this.destinationPrefix.innerHTML = "";
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.checkButton.click();
        }
    }
}