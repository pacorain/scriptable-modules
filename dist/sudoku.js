/**
 * Given a target, possible digits, and the number of cells that need to use those digits to
 * add up to the target, print all of the possible combinations.
 *
 * For example, if trying to reach 10 with 2 cells, and the possible digits in the cells are 
 * 1, 2, 3, 5, 7, and 8, the possible combinations are [2, 8] and [3, 7].
**/ 
function printCombos(digits, numCells, target) {
  let candidates = getCandidates(digits, numCells);
  for (var candidate of candidates) {
    if (sum(candidate) == target) {
      console.log(candidate.join(', '));
    }
  }
}

/**
 * Gets subsets of `digits` of length `numCells`
**/
function getCandidates(digits, numCells) {
  /* Ignore candidates where there aren't enough digits */
  if (numCells > digits.length) {
    return []  
  } 
  /* If there are just enough digits, return them */
  if (numCells == digits.length) {
    return [digits]
  }
  /* If there is one more digit than cells, return all combinations of the digits */
  if (numCells == digits.length - 1) {
    var candidates = [];
    for (var digit of digits) {
      var newArray = digits.slice(0);
      newArray.splice(digits.indexOf(digit), 1);
      candidates.push(newArray);
    }
    return candidates
  }
  /* If we only need one cell, return the digits */
  if (numCells == 1) {
    return digits.map((digit) => [digit])
  }
  /* Otherwise, recursively get the candidates */
  var candidates = [];
  for (var i = 0; i < digits.length; i++) {
    var digit = digits[i];
    var otherDigits = digits.slice(i + 1);
    var otherCandidates = getCandidates(otherDigits, numCells - 1);
    for (var otherCandidate of otherCandidates) {
      candidates.push([digit].concat(otherCandidate));
    }

  }
  return candidates
}

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

module.exports = {
    printCombos
};
