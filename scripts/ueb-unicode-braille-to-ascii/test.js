const converter = require('./index')

const allUnicode = "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿"
const allASCII = " A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)="

const partiallyUntranslatableUnicode = "⠀⠁⠂⠃a"

test('Translating all unicode chars to equivalent ascii chars with a hand rolled function',() => {
  expect(converter.unicodeToASCII(allUnicode)).toBe(allASCII)
});

test('Translating all ASCII braille equivalent chars to unicode braille with a hand rolled function',() => {
  expect(converter.asciiToUnicode(allASCII)).toBe(allUnicode)
});

test('Untranslatable values should not be thrown out', () => {
  expect(converter.unicodeToASCII(partiallyUntranslatableUnicode)).toBe(" A1Ba")
});