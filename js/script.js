// luckywheel animation with Greensock  ---------------------------------

$(document).ready(function () {
    //  Setup variables
    var wheel = $(".wheel"),
        active = $(".active"),
        currentRotation,
        lastRotation = 0,
        tolerance,
        $btnPlay = $("#btnPlay");

    // Inventory Configuration
    const inventoryConfig = {
        "2026-03-24": { "Tshirt": 5, "Mug": 5, "Notebook": 5, "Keychain": 5, "Pen": 5, "Umbrella": 5, "Totebag": 5 },
        "2026-03-25": { "Tshirt": 5, "Mug": 5, "Notebook": 5, "Keychain": 5, "Pen": 5, "Umbrella": 5, "Totebag": 5 },
        "2026-03-26": { "Tshirt": 5, "Mug": 5, "Notebook": 5, "Keychain": 5, "Pen": 5, "Umbrella": 5, "Totebag": 5 }
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
    function getInventory() {
        const today = new Date().toISOString().split('T')[0];
        const activeDate = inventoryConfig[today] ? today : "2026-03-24";
        let saved = localStorage.getItem('spin_inventory_' + activeDate);
        if (saved) return { date: activeDate, items: JSON.parse(saved) };
        return { date: activeDate, items: { ...inventoryConfig[activeDate] } };
    }

    function saveInventory(date, items) {
        localStorage.setItem('spin_inventory_' + date, JSON.stringify(items));
    }

    function getItemToSpin() {
        const currentData = getInventory();
        const availableItems = [];
        for (let item in currentData.items) {
            if (currentData.items[item] > 0) availableItems.push(item);
        }
        availableItems.push("Try Again", "Thank you");
        const selection = availableItems[Math.floor(Math.random() * availableItems.length)];
        if (currentData.items[selection] !== undefined) {
            currentData.items[selection]--;
            saveInventory(currentData.date, currentData.items);
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
