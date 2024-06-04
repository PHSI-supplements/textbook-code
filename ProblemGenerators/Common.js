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
]

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
    [Operations.Multiplication, "*"],
    [Operations.Division, "/"],
    [Operations.Invert, "~"],
    [Operations.And, "&"],
    [Operations.Or, "|"],
    [Operations.Xor, "^"],
    [Operations.LeftShift, "<<"],
    [Operations.LogicalRightShift, ">>"],
    [Operations.ArithmeticRightShift, ">>"],
]);

function insertDigitSeparators(valueString, groupingSize) {
    let valueCharacters = valueString.split('');
    for (let i = valueString.length - groupingSize; i > 0; i -= groupingSize) {
        valueCharacters.splice(i, 0, "'");
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
