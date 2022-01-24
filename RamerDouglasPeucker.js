/**
 * Decimate a curve of line segment connected points to a similar;y shaped curve with fewer points.
 * Reference: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
 * 
 * @param {2D Array} points            An array of '[x, y]' points. 
 * @param {Number}   episilonTolerance The tolerance at which a point is removed from the line segment.
 * 
 * @return {2D Array}
 */
function rdp(points, episilonTolerance) {
    let maxDist = 0;
    let index = 0;

    for (let i = 1; i < (points.length - 1); i++) {
        let dist = getPerpDist(points[i], [points[1], points[points.length - 1]]);
        
        if (dist > maxDist) {
            index = i;
            maxDist = dist;
        }
    }

    if (maxDist > episilonTolerance) {
        return [...rdp(points.slice(0, index), episilonTolerance), ...rdp(points.slice(index, points.length), episilonTolerance)];
    }

    return [points[0], points[points.length - 1]];
}

/**
 * Calculate the perpendicular distance between a point and a line segment.
 * Reference: https://stackoverflow.com/a/6853926/15786030
 * 
 * @param {Array}    point A point '[x, y].'
 * @param {2D Array} line  A line segment '[[x1, y1], [x2. y2]].'
 * 
 * @return {Number}
 */
 function getPerpDist(point, line) {
    var dot = (point[0] - line[0][0]) * (line[1][0] - line[0][0]) + (point[1] - line[0][1]) * (line[1][1] - line[0][1]);
    var len_sq = (line[1][0] - line[0][0]) * (line[1][0] - line[0][0]) + (line[1][1] - line[0][1]) * (line[1][1] - line[0][1]);
    var param = -1;

    if (len_sq != 0) { // In case of line length 0.
        param = dot / len_sq;
    }

    if (param < 0) {
        return Math.sqrt((point[0] - line[0][0]) * (point[0] - line[0][0]) + (point[1] - line[0][1]) * (point[1] - line[0][1]));
    }
    else if (param > 1) {
        return Math.sqrt((point[0] - line[1][0]) * (point[0] - line[1][0]) + (point[1] - line[1][1]) * (point[1] - line[1][1]));
    }

    return Math.sqrt((point[0] - (line[0][0] + param * (line[1][0] - line[0][0]))) * (point[0] - (line[0][0] + param * (line[1][0] - line[0][0]))) + (point[1] - (line[0][1] + param * (line[1][1] - line[0][1]))) * (point[1] - (line[0][1] + param * (line[1][1] - line[0][1]))));
}

/**
 * Generate a random integer between 'min' and 'max' inclusively.
 * 
 * @param {Number} min The floor for which generating random numbers will not go below. 
 * @param {Number} max The ceiling for which generating random numbers will not go above. 
 * 
 * @return {Number}
 */
function getRandInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Generate a 'numPoints' number of pairs of points for a graph. Sort the x-axis values such that the x-axis labels will be in proper increasing order.
 * Return the x-values (for labels), followed by the data pairs '[x, y]' (for data).
 * 
 * @param {Number} numPoints The number of pairs of points to generate.
 * @param {Number} xCeiling  The x-axis ceiling for which generating random numbers will not go above. 
 * @param {Number} yCeiling  The y-axis ceiling for which generating random numbers will not go above. 
 * 
 * @return {3D Array}
 */
function generateRandPoints(numPoints, xCeiling, yCeiling) {
    if (numPoints < xCeiling) {
        numPoints = xCeiling;
    }

    let xAxisLabel = [];
    let yAxisData = [];

    while (xAxisLabel.length < numPoints) {
        let randNum = getRandInt(0, xCeiling);

        if (xAxisLabel.indexOf(randNum) === -1) {
            xAxisLabel.push(randNum);

            randNum = getRandInt(0, yCeiling);
            yAxisData.push(randNum);
        }
    }

    let xAxisLabelSorted = xAxisLabel.sort(function(xAxisLabelSorted, yAxisData) {
        return (xAxisLabelSorted - yAxisData);
    });

    return [xAxisLabelSorted, xAxisLabelSorted.map((e, i) => [e, yAxisData[i]])];
}

/**
 * Create and return a chart configuration based on a set of points and other parameters.
 * 
 * @param {2D Array} points The points to create a graph with.
 * @param {String}   color  The x-axis ceiling for which generating random numbers will not go above.
 * 
 * @return {Object}
 */
function makeChartConfig(labels, dataPairs, color = '#f86485', chartLabel) {
    let data = {
        labels: labels,
        datasets: [{
            label: chartLabel,
            backgroundColor: color,
            borderColor: color,
            data: dataPairs
        }]
    };

    let config = {
        type: 'line',
        data: data,
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            animation: {
                duration: 0
            },
            maintainAspectRatio: false
        }
    };

    return config;
}


window.onload = function() {
    const slider = document.getElementById('slider');
    const epsilon = document.getElementById('epsilon');    
    const makeChart = document.getElementById('make-chart');
    const numPointsInput = document.getElementById("num-points");

    let chart1;
    let chart2;
    let chartData;

    let chartMade = false;

    makeChart.onclick = function makeCharts() {
        let numPoints = numPointsInput.value;

        if (!numPoints || (2 <= numPoints && numPoints <= 10000)) {
            chartMade = true;

            if (chart1) {
                chart1.destroy();
                chart2.destroy();
            }

            if (!numPoints) {
                chartData = generateRandPoints(100, 100, 100);
            }
            else {
                chartData = generateRandPoints(numPoints, numPoints, 100);
            }

            chart1 = new Chart(
                document.getElementById('chart1'),
                makeChartConfig(chartData[0], chartData[1], 'rgb(255, 99, 132)', 'Without RDP Tolerance')
            );
            chart2 = new Chart(
                document.getElementById('chart2'),
                makeChartConfig(chartData[0], rdp(chartData[1], epsilon.value), '#2e51c7', 'With RDP Tolerance')
            );
        }
        else {
            alert("Number must be in range of 2 and 10,000");
        }
    }

    numPointsInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            makeChart.click();
        }
    });

    slider.oninput = function() {
        epsilon.value = parseFloat(this.value).toFixed(1);

        remakeChart2();
    }

    epsilon.onblur = function() {
        epsilon.value = parseFloat(this.value).toFixed(1);

        if (epsilon.value < 0.1) {
            epsilon.value = 0.1;
        }
        else if (epsilon.value > 100) {
            epsilon.value = 100;
        }

        slider.value = epsilon.value;

        remakeChart2();
    }

    epsilon.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            epsilon.value = parseFloat(this.value).toFixed(1);

            if (epsilon.value < 0.1) {
                epsilon.value = 0.1;
            }
            else if (epsilon.value > 100) {
                epsilon.value = 100;
            }

            slider.value = epsilon.value;

            remakeChart2();
        }
    });

    function remakeChart2() {
        if (chartMade == true) {
            chart2.destroy();

            chart2 = new Chart(
                document.getElementById('chart2'),
                makeChartConfig(chartData[0], rdp(chartData[1], epsilon.value), '#2e51c7', 'With RDP Tolerance')
            );
        }
    }
}
