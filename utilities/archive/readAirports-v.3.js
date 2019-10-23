const csv = require('async-csv');
const fs = require('fs').promises;

(async() => {
  // Read file from disk:
  const csvString = await fs.readFile('./airports.dat', 'utf-8');

  // Convert CSV string into rows:
  const rows = await csv.parse(csvString)
  console.log(rows)
})();
