// luckywheel animation with Greensock  ---------------------------------

$(document).ready(function () {
    //  Setup variables
    var wheel = $(".wheel"),
        active = $(".active"),
        currentRotation,
        lastRotation = 0,
        tolerance,
        $btnPlay = $("#btnPlay");

    // Inventory Configuration (Simplified: Single source of truth)
    const inventoryConfig = {
        "Tshirt": 7, "Mug": 5, "Notebook": 5, "Keychain": 3, "Pen": 3, "Umbrella": 13, "Totebag": 10
    };

    // The Source of Truth: Sectors Array
    const sectors = [
        "Tshirt", "Mug", "Notebook", "Keychain", "Pen",
        "Umbrella", "Totebag", "Try Again", "Thank you"
    ];

    const colors = [
        "#ff4b2b", "#00d2ff", "#1d976c", "#ff8c00", "#9d50bb",
        "#2193b0", "#f12711", "#f5af19", "#00b09b", "#ee0979"
    ];

    // --- Dynamic Wheel Generation ---
    function drawWheel() {
        const sectorContainer = $(".sectors");
        const labelContainer = $(".labels");
        const numSectors = sectors.length;
        const anglePerSector = 360 / numSectors;

        sectorContainer.empty();
        labelContainer.empty();

        sectors.forEach((name, i) => {
            const startAngle = i * anglePerSector;
            const endAngle = (i + 1) * anglePerSector;
            const centerAngle = startAngle + (anglePerSector / 2);

            // Create SVG Path for Sector
            const pathData = createArcPath(365, 365, 328.1, startAngle - 90, endAngle - 90);
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("fill", colors[i % colors.length]);
            path.setAttribute("id", "_sector_" + (i + 1));
            sectorContainer.append(path);

            // Create Text Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            // Position: Rotate to center of sector, translate out, then rotate 90 for radial text
            const transform = `rotate(${centerAngle}) translate(0, -240) rotate(90)`;
            text.setAttribute("transform", `translate(365, 365) ${transform}`);
            text.textContent = name;
            labelContainer.append(text);
        });
    }

    function createArcPath(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    }

    // Initialize Wheel
    drawWheel();

    // --- Inventory & Logic ---
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

    function getInventory() {
        const key = 'spin_inventory_v1';
        let saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
        return { ...inventoryConfig };
    }

    function saveInventory(items) {
        localStorage.setItem('spin_inventory_v1', JSON.stringify(items));
    }

    function getItemToSpin() {
        const currentItems = getInventory();
        const availableItems = [];

        // 1. Collect all possible options
        // Inventory items + static options ("Try Again", "Thank you")
        const options = [...Object.keys(currentItems), "Try Again", "Thank you"];

        // 2. Filter options that have stock (if they are in inventory)
        options.forEach(item => {
            if (currentItems[item] === undefined || currentItems[item] > 0) {
                availableItems.push(item);
            }
        });

        // 3. Calculate dynamic weights
        // Weight = current stock for items, or fixed base weight for static options
        let totalWeight = 0;
        const weightsMap = {};

        availableItems.forEach(item => {
            let weight;
            if (currentItems[item] !== undefined) {
                // The more stock we have, the more likely it is to land on it
                weight = currentItems[item];
            } else {
                // Static options use their base weights
                weight = itemWeights[item] || 5;
            }
            weightsMap[item] = weight;
            totalWeight += weight;
        });

        // 4. Weighted selection
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

        // 5. Update inventory if applicable
        if (currentItems[selection] !== undefined) {
            currentItems[selection]--;
            saveInventory(currentItems);
        }
        return selection;
    }

    // --- Animation ---
    var indicator = new TimelineMax();
    var spinWheel = new TimelineMax();

    indicator.to(active, .13, { rotation: -10, transformOrigin: "65% 36%", ease: Power1.easeOut })
        .to(active, .13, { rotation: 3, ease: Power4.easeOut })
        .add("end");

    function spinToItem() {
        const winner = getItemToSpin();
        const numSectors = sectors.length;
        const anglePerSector = 360 / numSectors;

        const eligibleSectors = [];
        sectors.forEach((item, index) => {
            if (item === winner) eligibleSectors.push(index + 1);
        });
        const targetSectorIndex = eligibleSectors[Math.floor(Math.random() * eligibleSectors.length)] - 1;

        // Indicator is at ~60deg. 
        // Sector i center angle is (i + 0.5) * anglePerSector
        const centerAngle = (targetSectorIndex + 0.5) * anglePerSector;
        const targetRotation = 60 - centerAngle;

        const finalRotation = targetRotation + (360 * 5) + (lastRotation - (lastRotation % 360));
        lastRotation = finalRotation;

        spinWheel.clear();
        spinWheel.to(wheel, 5, {
            rotation: finalRotation,
            transformOrigin: "50% 50%",
            ease: Power4.easeOut,
            onUpdate: function () {
                currentRotation = Math.round(this.target[0]._gsTransform.rotation);
                tolerance = currentRotation - lastRotation;
                if (Math.round(currentRotation) % anglePerSector <= tolerance) {
                    if (indicator.progress() > .2 || indicator.progress() === 0) {
                        indicator.play(0);
                    }
                }
            },
            onComplete: function () {
                alert("Congratulations! You landed on: " + winner);
            }
        });
    }

    $btnPlay.click(function () {
        spinToItem();
    });
});
