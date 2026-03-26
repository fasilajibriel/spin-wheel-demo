const itemWeights = {
    "Keychain": 35,
    "Tshirt": 30,
    "Umbrella": 25,
    "Try Again": 10,
    "Pen": 5,
    "Notebook": 5,
    "Totebag": 5,
    "Mug": 5,
    "Thank you": 5
};

const availableItems = Object.keys(itemWeights);

function getItemToSpin() {
    let totalWeight = 0;
    availableItems.forEach(item => {
        totalWeight += itemWeights[item];
    });
    let random = Math.random() * totalWeight;
    let selection = availableItems.at(-1);
    for (const item of availableItems) {
        const weight = itemWeights[item];
        if (random < weight) {
            selection = item;
            break;
        }
        random -= weight;
    }
    return selection;
}

const results = {};
const runs = 100000;
for (let i = 0; i < runs; i++) {
    const res = getItemToSpin();
    results[res] = (results[res] || 0) + 1;
}

const totalWeight = Object.values(itemWeights).reduce((a, b) => a + b, 0);
console.log("Distribution after " + runs + " runs (Total weight: " + totalWeight + "):");
const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
sorted.forEach(([item, count]) => {
    const percentage = (count / runs * 100).toFixed(1);
    const expected = (itemWeights[item] / totalWeight * 100).toFixed(1);
    console.log(`${item.padEnd(12)}: ${count} (${percentage}%) - Expected: ~${expected}%`);
});
