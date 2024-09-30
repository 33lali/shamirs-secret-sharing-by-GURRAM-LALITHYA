const fs = require('fs');

// Function to read and parse a JSON file
const readTestCase = (fileName) => {
  const data = fs.readFileSync(fileName, 'utf-8');
  return JSON.parse(data);
};

// Function to decode values based on the provided base
const decodeValue = (base, value) => parseInt(value, base);

// Lagrange interpolation to find the constant term
const lagrangeInterpolate = (xValues, yValues, xTarget) => {
  return xValues.reduce((sum, xi, i) => {
    let product = yValues[i];
    xValues.forEach((xj, j) => {
      if (i !== j) {
        product *= (xTarget - xj) / (xi - xj);
      }
    });
    return sum + product;
  }, 0);
};

// Function to solve the problem for a test case
const solveTestCase = (testCase) => {
  const { n, k } = testCase.keys;

  // Extract and decode points
  const xValues = [];
  const yValues = [];

  Object.keys(testCase).forEach((key) => {
    if (!isNaN(key)) {
      const base = parseInt(testCase[key].base, 10);
      const value = testCase[key].value;
      xValues.push(parseInt(key, 10));
      yValues.push(decodeValue(base, value));
    }
  });

  // Solve using Lagrange interpolation to find the constant term at x = 0
  const secret = Math.round(lagrangeInterpolate(xValues, yValues, 0));
  return secret;
};

// Function to check for wrong points (used in second test case)
const findWrongPoints = (xValues, yValues) => {
  return xValues.reduce((wrongPoints, xi, i) => {
    const yInterpolated = lagrangeInterpolate(
      xValues.filter((_, j) => j !== i),
      yValues.filter((_, j) => j !== i),
      xi
    );

    if (Math.round(yInterpolated) !== yValues[i]) {
      wrongPoints.push({ x: xi, y: yValues[i] });
    }
    return wrongPoints;
  }, []);
};

// Main function to handle both test cases
const main = () => {
  // Test case 1
  const testCase1 = readTestCase('testcase1.json');
  const secret1 = solveTestCase(testCase1);
  console.log('Secret for Test Case 1:', secret1);

  // Test case 2
  const testCase2 = readTestCase('testcase2.json');
  const secret2 = solveTestCase(testCase2);
  console.log('Secret for Test Case 2:', secret2);

  // Check for wrong points in test case 2
  const { keys, ...points } = testCase2;
  const xValues = Object.keys(points).map(key => parseInt(key, 10));
  const yValues = Object.keys(points).map(key => decodeValue(points[key].base, points[key].value));
  const wrongPoints = findWrongPoints(xValues, yValues);

  console.log('Wrong Points in Test Case 2:', wrongPoints.length ? wrongPoints : 'None');
};

// Run the main function
main();
