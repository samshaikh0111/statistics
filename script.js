function goToStep2() {
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
}

function goToStep3() {
    const dataType = document.getElementById("dataType").value;
    document.getElementById("step-2").style.display = "none";
    document.getElementById("step-3").style.display = "block";

    // Show/hide inputs based on data type
    if (dataType === "ungrouped") {
        document.getElementById("frequency-input").style.display = "none";
        document.getElementById("class-intervals").style.display = "none";
    } else if (dataType === "discrete") {
        document.getElementById("frequency-input").style.display = "block";
        document.getElementById("class-intervals").style.display = "none";
    } else if (dataType === "continuous") {
        document.getElementById("frequency-input").style.display = "block";
        document.getElementById("class-intervals").style.display = "block";
    }
}

function calculate() {
    const operation = document.getElementById("operation").value;
    const dataType = document.getElementById("dataType").value;

    const dataPoints = document.getElementById("dataPoints").value.split(',').map(Number);
    const frequencies = document.getElementById("frequencies").value ? document.getElementById("frequencies").value.split(',').map(Number) : null;
    const lowerLimits = document.getElementById("lowerLimits").value ? document.getElementById("lowerLimits").value.split(',').map(Number) : null;
    const upperLimits = document.getElementById("upperLimits").value ? document.getElementById("upperLimits").value.split(',').map(Number) : null;

    let result = "";

    if (operation === "mean") {
        if (dataType === "ungrouped") {
            result = `Mean: ${(dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length).toFixed(2)}`;
        } else if (dataType === "discrete") {
            const totalFreq = frequencies.reduce((a, b) => a + b, 0);
            const weightedSum = dataPoints.map((dp, i) => dp * frequencies[i]).reduce((a, b) => a + b, 0);
            result = `Mean: ${(weightedSum / totalFreq).toFixed(2)}`;
        } else if (dataType === "continuous") {
            const midpoints = lowerLimits.map((l, i) => (l + upperLimits[i]) / 2);
            const totalFreq = frequencies.reduce((a, b) => a + b, 0);
            const weightedSum = midpoints.map((mp, i) => mp * frequencies[i]).reduce((a, b) => a + b, 0);
            result = `Mean: ${(weightedSum / totalFreq).toFixed(2)}`;
        }
    } else if (operation === "median") {
        if (dataType === "ungrouped") {
            const sortedData = dataPoints.sort((a, b) => a - b);
            const n = sortedData.length;
            result = n % 2 === 0
                ? `Median: ${((sortedData[n / 2 - 1] + sortedData[n / 2]) / 2).toFixed(2)}`
                : `Median: ${sortedData[Math.floor(n / 2)].toFixed(2)}`;
        } else if (dataType === "discrete" || dataType === "continuous") {
            const cumulativeFrequencies = frequencies.map((_, i) => frequencies.slice(0, i + 1).reduce((a, b) => a + b));
            const totalFreq = cumulativeFrequencies[cumulativeFrequencies.length - 1];
            const medianClassIndex = cumulativeFrequencies.findIndex((cf) => cf >= totalFreq / 2);
            if (dataType === "discrete") {
                result = `Median: ${dataPoints[medianClassIndex]}`;
            } else {
                const l = lowerLimits[medianClassIndex];
                const f = frequencies[medianClassIndex];
                const cfPrev = cumulativeFrequencies[medianClassIndex - 1] || 0;
                const h = upperLimits[medianClassIndex] - lowerLimits[medianClassIndex];
                result = `Median: ${(l + ((totalFreq / 2 - cfPrev) / f) * h).toFixed(2)}`;
            }
        }
    } else if (operation === "mode") {
        if (dataType === "ungrouped") {
            const freqMap = {};
            dataPoints.forEach((value) => (freqMap[value] = (freqMap[value] || 0) + 1));
            const maxFreq = Math.max(...Object.values(freqMap));
            const modes = Object.keys(freqMap).filter((key) => freqMap[key] === maxFreq);
            result = `Mode: ${modes.join(", ")}`;
        } else if (dataType === "discrete" || dataType === "continuous") {
            const maxFreq = Math.max(...frequencies);
            const modeClassIndex = frequencies.findIndex((f) => f === maxFreq);
            if (dataType === "discrete") {
                result = `Mode: ${dataPoints[modeClassIndex]}`;
            } else {
                const l = lowerLimits[modeClassIndex];
                const f1 = frequencies[modeClassIndex];
                const f0 = frequencies[modeClassIndex - 1] || 0;
                const f2 = frequencies[modeClassIndex + 1] || 0;
                const h = upperLimits[modeClassIndex] - lowerLimits[modeClassIndex];
                result = `Mode: ${(l + ((f1 - f0) / ((f1 - f0) + (f1 - f2))) * h).toFixed(2)}`;
            }
        }
    }

    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerText = result;
}
