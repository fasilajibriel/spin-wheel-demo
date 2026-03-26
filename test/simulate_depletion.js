const itemWeights = {
    "Totebag": 35,
    "Umbrella": 35,
    "Tshirt": 30,
    "Try Again": 10,
    "Pen": 7,
    "Keychain": 7,
    "Notebook": 3,
    "Mug": 3,
    "Thank you": 5
};

const initialStock = {
    "Tshirt": 7,
    "Mug": 5,
    "Notebook": 5,
    "Keychain": 3,
    "Pen": 3,
    "Umbrella": 13,
    "Totebag": 10
};

function getItemToSpin(currentStock) {
    const availableItems = [];
    const options = [...Object.keys(currentStock), "Try Again", "Thank you"];

    options.forEach(item => {
        if (currentStock[item] === undefined || currentStock[item] > 0) {
            availableItems.push(item);
        }
    });

    let totalWeight = 0;
    const weightsMap = {};
    availableItems.forEach(item => {
        let weight;
        if (currentStock[item] !== undefined) {
            weight = currentStock[item];
        } else {
            weight = itemWeights[item] || 5;
        }
        weightsMap[item] = weight;
        totalWeight += weight;
    });

    let random = Math.random() * totalWeight;
    let selection = availableItems.at(-1);

    for (const item of availableItems) {
        const weight = weightsMap[item];
        if (random < weight) {
            selection = item;
            break;
        }
        random -= weight;
    }

    if (currentStock[selection] !== undefined) {
        currentStock[selection]--;
    }
    return selection;
}

function runSimulation() {
    let stock = { ...initialStock };
    let spins = 0;
    let limit = 1000; // Total spins to try
    let wins = {};

    console.log("Starting simulation with stock:", stock);
    console.log("Weights:", itemWeights);
    console.log("---------------------------------------");

    const depletionOrder = [];
    while (spins < limit) {
        const winner = getItemToSpin(stock);
        wins[winner] = (wins[winner] || 0) + 1;
        spins++;

        if (stock[winner] === 0 && !depletionOrder.includes(winner)) {
            depletionOrder.push(winner);
        }

        const remainingItems = Object.values(stock).reduce((a, b) => a + b, 0);
        if (remainingItems === 0) break;
    }

    console.log(`Simulation ended after ${spins} spins.`);
    console.log("Depletion Order (First to run out -> Last):");
    depletionOrder.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
    });
    console.log("---------------------------------------");
    console.log("Final Win Distribution:");
    Object.entries(wins).sort((a,b) => b[1] - a[1]).forEach(([item, count]) => {
        console.log(`${item.padEnd(12)}: ${count} wins`);
    });

    console.log("---------------------------------------");
    console.log("Remaining stock (should all be 0):", stock);
}

runSimulation();
