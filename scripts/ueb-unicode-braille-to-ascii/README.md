# UEB-unicode-braille-to-ascii

This does what it says, it converts unicode braille to the ascii braille format and back. We have included the tables we used to do the conversion in braille-encoding-converter.js

## Getting Started

### Prerequisites

Node should be at least version 8.11

### Installing

If just working on the package locally

```
npm i ueb-unicode-braille-to-ascii
```

## Deployment

When adding this package into another node project add this to the package.json devDependencies.

```JSON
"dependencies": {
    "ueb-unicode-braille-to-ascii" : "<version>",
}
```

With `<version>` being replaced with the most up to date release of this package. 

To get this puppy going require the braille-encoding converter and call the function of interest on the string you want to convert
For example 

```Javascript
const converter = require("ueb-unicode-braille-to-ascii")

const asciiBraille = converter.unicodeToASCII(someUnicodeBrailleVariable)
const unicodeBraille = converter.asciiToUnicode(asciiBraille)
```

You can also use the tables by 

```JS
const converter = require("ueb-unicode-braille-to-ascii")

const asciiToUnicodeTable = converter.asciiBrailleToUnicodeTable
const unicodeToASCIITable = converter.unicodeBrailleToASCIITable
```

## Development

If you want to add a braille encoding translation:
    Add a table and a function to braille-encoding-converter.js that takes in a string and converts it to the desired form.
    Update the export in braille-encoding-converter.js
    Update the test.js to have a test for your new encoding
    ?????
    Profit!

Have a look at braille-encoding-converter to see how we did unicode to ASCII and back. 

## Running the tests

Run `npm test` to run tests.
