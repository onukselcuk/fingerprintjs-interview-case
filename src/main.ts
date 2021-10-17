// Node packages for file system
import fs = require('fs');
import path = require('path');

import apiLatencies from './api_latencies.json';

const filePath = path.join(__dirname, '/transactions.csv');
// Read CSV
const f = fs.readFileSync(filePath, { encoding: 'utf-8' });

// Split on row
const splitted = f.split('\n');

// Get first row for column headers
const headers = splitted.shift().split(',');

const json = [];
splitted.forEach(function (d) {
  // Loop through each row
  const tmp = {};
  const row = d.split(',');
  for (let i = 0; i < headers.length; i++) {
    if (i === 1) {
      tmp[headers[1]] = +row[1];
    } else {
      tmp[headers[i]] = row[i];
    }
  }
  // Add object to list
  json.push(tmp);
});

type Transaction = {
  id: string;
  amount: number;
  bank_country_code: string;
};

function prioritize(
  transactions: Transaction[],
  totalTime = 1000,
): Transaction[] {
  // sort transactions according to amount that can be processed in 1ms
  transactions.sort((a, b) => {
    return (
      b.amount / apiLatencies[b.bank_country_code] -
      a.amount / apiLatencies[a.bank_country_code]
    );
  });

  let tempTotalTime = 0;
  let i = 0;

  // loop through transactions to find max transactions that can be
  // processed in totalTime (default is 1000ms)
  while (tempTotalTime < totalTime) {
    const transactionTime = apiLatencies[transactions[i].bank_country_code];

    tempTotalTime += transactionTime;

    if (tempTotalTime > totalTime) {
      tempTotalTime = tempTotalTime - transactionTime;
      break;
    }
    i++;
  }

  console.log('Total Time: ', tempTotalTime);

  // get a subset or all of transactions that can be processed in totalTime
  const maxTransactions = transactions.slice(0, i);

  // get an array of amount properties
  const maxTransactionsAmountArray = maxTransactions.map((cur) => cur.amount);

  // calculate total processable amount of transactions in totalTime
  const maxTotalTransactionValue = maxTransactionsAmountArray.reduce(
    (prev, curr) => {
      return prev + curr;
    },
    0,
  );

  console.log(
    `Max Transaction Value in ${totalTime}ms`,
    maxTotalTransactionValue,
  );

  return maxTransactions;
}

console.log(prioritize(json,90));
