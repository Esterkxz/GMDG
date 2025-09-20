const unicodeBrailleToASCIITable = {
    "⠀": " ",
    "⠀": "`",
    "⠁": "A",
    "⠂": "1",
    "⠃": "B",
    "⠄": "'",
    "⠅": "K",
    "⠆": "2",
    "⠇": "L",
    "⠈": "@",
    "⠉": "C",
    "⠊": "I",
    "⠋": "F",
    "⠌": "/",
    "⠍": "M",
    "⠎": "S",
    "⠏": "P",
    "⠐": "\"",
    "⠑": "E",
    "⠒": "3",
    "⠓": "H",
    "⠔": "9",
    "⠕": "O",
    "⠖": "6",
    "⠗": "R",
    "⠘": "^",
    "⠙": "D",
    "⠚": "J",
    "⠛": "G",
    "⠜": ">",
    "⠝": "N",
    "⠞": "T",
    "⠟": "Q",
    "⠠": ",",
    "⠡": "*",
    "⠢": "5",
    "⠣": "<",
    "⠤": "-",
    "⠥": "U",
    "⠦": "8",
    "⠧": "V",
    "⠨": ".",
    "⠩": "%",
    "⠪": "[",
    "⠪": "{",
    "⠫": "$",
    "⠬": "+",
    "⠭": "X",
    "⠮": "!",
    "⠯": "&",
    "⠰": ";",
    "⠱": ":",
    "⠲": "4",
    "⠳": "\\",
    "⠴": "0",
    "⠵": "Z",
    "⠶": "7",
    "⠷": "(",
    "⠸": "_",
    "⠹": "?",
    "⠺": "W",
    "⠻": "]",
    "⠻": "}",
    "⠼": "#",
    "⠽": "Y",
    "⠾": ")",
    "⠿": "="
}

const unicodeBrailleToASCIILowerCaseTable = {
    "⠀": " ",
    "⠀": "`",
    "⠁": "a",
    "⠂": "1",
    "⠃": "b",
    "⠄": "'",
    "⠅": "k",
    "⠆": "2",
    "⠇": "l",
    "⠈": "@",
    "⠉": "c",
    "⠊": "i",
    "⠋": "f",
    "⠌": "/",
    "⠍": "m",
    "⠎": "s",
    "⠏": "p",
    "⠐": "\"",
    "⠑": "e",
    "⠒": "3",
    "⠓": "h",
    "⠔": "9",
    "⠕": "o",
    "⠖": "6",
    "⠗": "r",
    "⠘": "^",
    "⠙": "d",
    "⠚": "j",
    "⠛": "g",
    "⠜": ">",
    "⠝": "n",
    "⠞": "t",
    "⠟": "q",
    "⠠": ",",
    "⠡": "*",
    "⠢": "5",
    "⠣": "<",
    "⠤": "-",
    "⠥": "u",
    "⠦": "8",
    "⠧": "v",
    "⠨": ".",
    "⠩": "%",
    "⠪": "[",
    "⠪": "{",
    "⠫": "$",
    "⠬": "+",
    "⠭": "x",
    "⠮": "!",
    "⠯": "&",
    "⠰": ";",
    "⠱": ":",
    "⠲": "4",
    "⠳": "\\",
    "⠴": "0",
    "⠵": "z",
    "⠶": "7",
    "⠷": "(",
    "⠸": "_",
    "⠹": "?",
    "⠺": "w",
    "⠻": "]",
    "⠻": "}",
    "⠼": "#",
    "⠽": "y",
    "⠾": ")",
    "⠿": "="
}

const asciiBrailleToUnicodeTableConverter = () => Object.keys(unicodeBrailleToASCIITable).reduce((accumulator, current) => {
    accumulator[unicodeBrailleToASCIITable[current]] = current
    return accumulator
}, {})

const lowerCaseAsciiBrailleToUnicodeTableConverter = () => Object.keys(unicodeBrailleToASCIILowerCaseTable).reduce((accumulator, current) => {
    accumulator[unicodeBrailleToASCIILowerCaseTable[current]] = current
    return accumulator
}, {})

const asciiBrailleToUnicodeTable = asciiBrailleToUnicodeTableConverter()
const lowerCaseAsciiBrailleToUnicodeTable = lowerCaseAsciiBrailleToUnicodeTableConverter()

const asciiBrailleToUnicode = toTranslate => toTranslate.split('')
    .map(c => asciiBrailleToUnicodeTable[c] ? asciiBrailleToUnicodeTable[c] : c).join('')
const lowerCaseAsciiBrailleToUnicode = toTranslate => toTranslate.split('')
    .map(c => lowerCaseAsciiBrailleToUnicodeTable[c] ? lowerCaseAsciiBrailleToUnicodeTable[c] : c).join('')

const unicodeBrailleToASCII = toTranslate => toTranslate.split('')
    .map(c => unicodeBrailleToASCIITable[c] ? unicodeBrailleToASCIITable[c] : c).join('')
const unicodeBrailleToASCIILowerCase = toTranslate => toTranslate.split('')
    .map(c => unicodeBrailleToASCIILowerCaseTable[c] ? unicodeBrailleToASCIILowerCaseTable[c] : c).join('')

const caseFreeASCIIBrailleToUnicode = toTranslate => toTranslate.split('')
    .map(c => unicodeBrailleToASCIITable[c] ? unicodeBrailleToASCIITable[c] : c)
    .map(c => lowerCaseAsciiBrailleToUnicodeTable[c] ? lowerCaseAsciiBrailleToUnicodeTable[c] : c).join('')

if (typeof module !== 'undefined') module.exports = {
    "unicodeToASCII": unicodeBrailleToASCII,
    "unicodeToASCIITable": unicodeBrailleToASCIITable,
    "asciiToUnicode": asciiBrailleToUnicode,
    "asciiToUnicodeTable": asciiBrailleToUnicodeTable,
    "UnicodeToASCIILowerCase": unicodeBrailleToASCIILowerCase,
    "UnicodeToASCIILowerCaseTable": unicodeBrailleToASCIILowerCaseTable,
    "lowerCaseAsciiToUnicode": lowerCaseAsciiBrailleToUnicode,
    "lowerCaseAsciiToUnicodeTable": lowerCaseAsciiBrailleToUnicodeTable,
    "caseFreeASCIIBrailleToUnicode": caseFreeASCIIBrailleToUnicode
}