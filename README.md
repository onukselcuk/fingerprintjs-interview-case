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