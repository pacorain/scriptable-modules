# sudoku module

A small script to help me solve [Killer Sudoku](https://en.wikipedia.org/wiki/Killer_sudoku).

One of the strategies to solving a Killer sudoku puzzle is eliminating possibilities that cannot
be used to solve a cage. As a simple example, a cage that has a sum of 10 and only two cells
cannot contain a 5. 

The module exports a function that takes a list of possible numbers, the number of cells in the 
cage, and the target sum. The function prints out a list of all possible combinations of numbers.

## Usage

Here is an example scriptable script to use the module:

```javascript
const digits = '2678'.split('').map((digit) => parseInt(digit))
const numCells = 3
const target = 17

const { printCombos } = importModule('modules/sudoku')

printCombos(digits, numCells, target)
```