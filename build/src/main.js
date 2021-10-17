"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const api_latencies_json_1 = (0, tslib_1.__importDefault)(require("./api_latencies.json"));
const filePath = path.join(__dirname, '/transactions.csv');
const f = fs.readFileSync(filePath, { encoding: 'utf-8' });
const splitted = f.split('\n');
const headers = splitted.shift().split(',');
const json = [];
splitted.forEach(function (d) {
    const tmp = {};
    const row = d.split(',');
    for (let i = 0; i < headers.length; i++) {
        if (i === 1) {
            tmp[headers[1]] = +row[1];
        }
        else {
            tmp[headers[i]] = row[i];
        }
    }
    json.push(tmp);
});
function prioritize(transactions, totalTime = 1000) {
    transactions.sort((a, b) => {
        return (b.amount / api_latencies_json_1.default[b.bank_country_code] -
            a.amount / api_latencies_json_1.default[a.bank_country_code]);
    });
    let tempTotalTime = 0;
    let i = 0;
    while (tempTotalTime < totalTime) {
        const transactionTime = api_latencies_json_1.default[transactions[i].bank_country_code];
        tempTotalTime += transactionTime;
        if (tempTotalTime > totalTime) {
            tempTotalTime = tempTotalTime - transactionTime;
            break;
        }
        i++;
    }
    console.log('Total Time: ', tempTotalTime);
    const maxTransactions = transactions.slice(0, i);
    const maxTransactionsAmountArray = maxTransactions.map((cur) => cur.amount);
    const maxTotalTransactionValue = maxTransactionsAmountArray.reduce((prev, curr) => {
        return prev + curr;
    }, 0);
    console.log(`Max Transaction Value in ${totalTime}ms`, maxTotalTransactionValue);
    return maxTransactions;
}
console.log(prioritize(json, 90));
//# sourceMappingURL=main.js.map