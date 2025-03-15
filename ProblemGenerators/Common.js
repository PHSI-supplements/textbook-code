/*
 * Random Problem Generators (c) 2020-24 Christopher A. Bohn
 */

const radixNames = ["",
    "unary", "binary", "ternary", "quaternary",
    "quinary", "senary", "septenary", "octal",
    "nonary", "decimal", "undecimal", "duodecimal",
    "tridecimal", "tetradecimal", "pentadecimal", "hexadecimal",
    "heptadecimal", "octodecimal", "enneadecimal", "vigesimal",
    "unvigesimal", "duovigesimal", "trivigesimal", "tetravigesimal",
    "pentavigesimal", "hexavigesimal", "heptavigesimal", "octovigesimal",
    "enneavigesimal", "trigesimal", "untrigesimal", "duotrigesimal",
    "tritrigesimal", "tetratrigesimal", "pentatrigesimal", "hexatrigesimal"
];

const radixPrefixes = ["",
    "", "0b", "", "",
    "", "", "", "0",
    "", "", "", "",
    "", "", "", "0x",
    "", "", "", "",
    "", "", "", "",
    "", "", "", "",
    "", "", "", "",
    "", "", "", ""
];

metaVariables = [
    "foo", "bar", "baz", "plugh", "xyzzy", "quux", "thud",
    "grault", "garply", "corge", "fred", "waldo", "blep"
];

const Operations = {
    UserSelected: Symbol.for("UserSelected"),
    Addition: Symbol.for("Addition"),
    Subtraction: Symbol.for("Subtraction"),
    Multiplication: Symbol.for("Multiplication"),
    Division: Symbol.for("Division"),
    Invert: Symbol.for("Invert"),
    And: Symbol.for("And"),
    Or: Symbol.for("Or"),
    Xor: Symbol.for("Xor"),
    LeftShift: Symbol.for("LeftShift"),
    LogicalRightShift: Symbol.for("LogicalRightShift"),
    ArithmeticRightShift: Symbol.for("ArithmeticRightShift"),
}

const OpSymbols = new Map([
    [Operations.Addition, "+"],
    [Operations.Subtraction, "-"],
    [Operations.Multiplication, "×"],
    [Operations.Division, "÷"],
    [Operations.Invert, "~"],
    [Operations.And, "&"],
    [Operations.Or, "|"],
    [Operations.Xor, "^"],
    [Operations.LeftShift, "<<"],
    [Operations.LogicalRightShift, ">>"],
    [Operations.ArithmeticRightShift, ">>"],
]);

const NumberEncoding = {
    UnsignedInteger: Symbol.for("UnsignedInteger"),
    TwosComplement: Symbol.for("TwosComplement"),
    QuarterPrecision: Symbol.for("QuarterPrecision"),
}

const InstructionSet = {
    IA32: Symbol.for("IA32"),
    x86_64: Symbol.for("x86_64"),
    A64: Symbol.for("A64"),
    T32: Symbol.for("T32"),
}

const Types = {
    Char: Symbol.for("char"),
    Short: Symbol.for("short"),
    Int: Symbol.for("int"),
    Long: Symbol.for("long"),
    Float: Symbol.for("float"),
    Double: Symbol.for("double"),
    Pointer: Symbol.for("pointer"),
}

const TypeSizes32Bit = new Map([
    [Types.Char, 1],
    [Types.Short, 2],
    [Types.Int, 4],
    [Types.Long, 4],
    [Types.Float, 4],
    [Types.Double, 8],
    [Types.Pointer, 4],
]);

const TypeSizes64Bit = new Map([
    [Types.Char, 1],
    [Types.Short, 2],
    [Types.Int, 4],
    [Types.Long, 8],
    [Types.Float, 4],
    [Types.Double, 8],
    [Types.Pointer, 8],
]);



function insertDigitSeparators(valueString, groupingSize) {
    let valueCharacters = valueString.split('');
    let radixPoint = valueCharacters.findIndex((c) => c === '.');
    // integer portion
    let startingIndex = ((radixPoint === -1) ? valueString.length : radixPoint) - groupingSize;
    let terminatingIndex = (valueCharacters[0] === "-" ? 1 : 0);
    for (let i = startingIndex; i > terminatingIndex; i -= groupingSize) {
        valueCharacters.splice(i, 0, "'");
    }
    // fractional portion
    if (radixPoint !== -1) {
        // might've shifted from earlier insertion
        let radixPoint = valueCharacters.findIndex((c) => c === '.');
        let insertions = 0;
        for (let i = radixPoint + groupingSize + 1; i < valueString.length + insertions; i += (groupingSize + 1)) {
            if (!valueCharacters.join('').substring(i - (groupingSize - 1), i + 1).match(/^[A-Za-z0-9]+$/)) {
                break;
            }
            valueCharacters.splice(i, 0, "'");
            insertions++;
        }
    }
    return valueCharacters.join('');
}

function reverse(string) {
    return string.split('').reverse().join('');
}

function signExtend(value, originalSize) {
    let sizeOfInteger = 32;
    return (value << (sizeOfInteger - originalSize)) >> (sizeOfInteger - originalSize);
}

function maskForLowerBits(finalSize) {
    return (1 << finalSize) - 1;
}

function parseBinaryFloat(string) {
    let valueString = string.trim();
    if (valueString.length === 0) {
        return 0.0;
    }
    let isNegative = false;
    if (valueString[0] === "-") {
        isNegative = true;
        valueString = valueString.substring(1);
    } else if (valueString[0] === "+") {
        valueString = valueString.substring(1);
    }
    valueString = valueString.trim();
    if (valueString.substring(0, 2).toLowerCase() === "0b") {
        valueString = valueString.substring(2);
    }
    if (valueString === "Infinity") {
        return (isNegative ? -1 : 1) * Infinity;
    }
    let valueCharacters = valueString.replaceAll("'", "").split('');
    let radixPoint = valueCharacters.findIndex((c) => c === '.');
    let integerString, fractionString;
    if (radixPoint === -1) {
        integerString = valueString;
        fractionString = "0";
    } else if (radixPoint === 0) {
        integerString = "0";
        fractionString = valueString.substring(1);
    } else {
        integerString = valueString.substring(0, radixPoint);
        fractionString = valueString.substring(radixPoint + 1);
    }
    let validationString = integerString.replaceAll("0", "").replaceAll("1", "")
        + fractionString.replaceAll("0", "").replaceAll("1", "");
    if (validationString.length > 0) {
        return NaN;
    } else {
        let integer = parseInt(integerString, 2);
        let fraction = parseInt(fractionString, 2) / (1 << fractionString.length);
        return (isNegative ? -1 : 1) * (integer + fraction);
    }
}

function selectSymbolFromRadioButton(elementPrefix) {
    // TODO: Can the chapter 2 practice problems for bitwise operations and bitshifts be adapted to use this function?
    if (elementPrefix === undefined) {
        alert("When calling selectInstructionSet(), you must provide an elementPrefix");
        console.error("When calling selectInstructionSet(), you must provide an elementPrefix");
    }
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
