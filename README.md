# fingerprintjs-interview-case

- **Question: Write a prioritize function body, which returns a subset of transactions that have the maximum total USD.**
```ts
function prioritize(
  transactions: Transaction[]
): Transaction[] {
    // sort transactions according to amount that can be processed in 1ms
    transactions.sort((a, b) => {
        return (
            b.amount / apiLatencies[b.bank_country_code] -
            a.amount / apiLatencies[a.bank_country_code]
        );
    });
    return transactions
}
```  
- **Question: What's is the max USD value that can be processed in 1 second?**
  - _$35289.20_
- **Question: Modify the prioritize function to also accept the totalTime in milliseconds (default=1000ms). Your implementation should correctly prioritize based on the totalTime argument.**
```ts
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
```
- **Question: What is the max USD value that can be processed in 50ms, 60ms, 90ms?**
  - In 50ms => _$3637.98_
  - In 60ms => _$4362.01_
  - In 90ms => _$6870.48_

### Usage

```sh
npm install
npm run build
npm start
```