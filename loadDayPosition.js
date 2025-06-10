
const startDate = new Date("2017-02-23");
const endDate = new Date("2017-04-26");

let scatter_dict = {}
let geo_dict = {}
let scatter_setting = {}
let visible_list = {}
let now_list = {}
let color_dict = {}
let color_full_dict = {}
let color_chart_dict = {}

function getRandomInt() {
    min = 128;
    max = 255;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseDayData(d) {
    return {
        time: d3.timeParse("%Y-%m-%d")(d.date),
        count: +d.count
    };
}

function parseHourData(d) {
    return {
        time: d3.timeParse("%H")(+d.hour),
        count: +d.count
    };
}
function parsePhone(d) {
    return {
        id: d.id,
        value: +d.value
    };
}

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;
    var geo = new Loca.GeoJSONSource({
        // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road.json',
        // url: 'http://localhost:8080/datavis/csv/javascript/' + formatted + '.json'
        url: 'csv/javascript/' + formatted + '.json'
    });
    geo_dict[formatted] = geo
    var setting = {
        zIndex: 111,
        opacity: 1,
        visible: false,
        zooms: [9, 22],
    };
    var scatter = new Loca.ScatterLayer(setting);
    scatter_setting[formatted] = setting;
    scatter_dict[formatted] = scatter
    scatter.setSource(geo);
    color_dict[formatted] = 'rgba(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt();
    color_chart_dict[formatted] = color_dict[formatted];
    color_full_dict[formatted] = color_dict[formatted];
    color_dict[formatted] = color_dict[formatted] + ',0.1)';
    color_chart_dict[formatted] = color_chart_dict[formatted] + ',0.7)';
    color_full_dict[formatted] = color_full_dict[formatted] + ',1.0)';
    scatter.setStyle({
        // color: 'rgba(' + (day * 14)%256 + ',' + (day * 33)%256 + ',' + (day * 54)%256 + ',0.1)',
        color: color_dict[formatted],
        unit: 'meter',
        size: [300, 500],
        borderWidth: 0,
    });
    visible_list[formatted] = false;
    now_list[formatted] = false;
    loca.add(scatter);
    // console.log(formatted);
}


const svg = d3.select("#chart"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = { top: 40, right: 120, bottom: 50, left: 50 },
    chartWidth = width - margin.left - margin.right,
    chartHeight = height - margin.top - margin.bottom;

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleTime().range([0, chartWidth]);
const y = d3.scaleLinear().range([chartHeight, 0]);

const xAxis = g.append("g")
    .attr("transform", `translate(0,${chartHeight})`);

const yAxis = g.append("g");


const sample_svg = d3.select("#chart");
const sample_g = sample_svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// 图例组
const legend = sample_g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${chartWidth + 10}, 0)`);


let margint = 1;
const svg2 = d3.select("#rightBottomChart")
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;")
      .attr("text-anchor", "middle"),
    width2 = +svg2.attr("width"),
    height2 = +svg2.attr("height"),
    margin2 = { top: 40, right: 120, bottom: 50, left: 50 },
    chartWidth2 = width2 - margin2.left - margin2.right,
    chartHeight2 = height2 - margin2.top - margin2.bottom;

const g2 = svg2.append("g").attr("transform", `translate(${margin2.left},${margin2.top})`);

function parseDayData(d) {
    return {
        time: d3.timeParse("%Y-%m-%d")(d.date),
        count: +d.count
    };
}

function parseHourData(d) {
    return {
        time: d3.timeParse("%H")(+d.hour),
        count: +d.count
    };
}

// 生成不同颜色的函数
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function updateChart(dataCollection, isOverview) {
    // 清除旧的元素
    g.selectAll(".area").remove();
    g.selectAll(".axis-label").remove();
    legend.selectAll("*").remove();
    let isTest = false;
    // console.log(dataCollection);
    // [{date:'', data = [(24)]}
    // 总览模式
    if (isOverview) {
        x.domain(d3.extent(dataCollection, d => d.time));
        y.domain([0, d3.max(dataCollection, d => d.count)]);

        xAxis.transition().call(d3.axisBottom(x).ticks(d3.timeWeek.every(1)));
        yAxis.transition().call(d3.axisLeft(y));

        const area = d3.area()
            .x(d => x(d.time))
            .y0(chartHeight)
            .y1(d => y(d.count))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(dataCollection)
            .attr("class", "area")
            .attr("fill", "skyblue")
            .attr("stroke", "dimgray")
            .attr("d", area);
    } else if (isTest) {
        let newData = [];
        let stackKeys = [];
        dataCollection.forEach((dayData, index) => {
            dayData.data.forEach((clock, index) => {
                if (stackKeys.includes(clock.time) == false) {
                    stackKeys.push(clock.time);
                }
            });
        });
        stackKeys.forEach(k => newData.push({}));
        dataCollection.forEach((dayData, index) => {
            dayData.data.forEach((clock, index) => {
                // console.log(clock);
                newData[clock.time][dayData.date] = clock.count;
            });
        });
        // console.log(newData);
        // 创建堆叠器
        const stack = d3.stack()
            .keys(stackKeys)
            .offset(d3.stackOffsetWiggle); // 核心：实现“河流”效果的 offset

        const series = stack(newData);

        // X 和 Y 比例尺
        const x = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min(series, layer => d3.min(layer, d => d[0])),
                d3.max(series, layer => d3.max(layer, d => d[1]))
            ])
            .range([height, 0]);

        // 颜色比例尺
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // 面积生成器
        const area = d3.area()
            .x((d, i) => x(i))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            // .curve(d3.curveBasis)
            ;

        // 画图
        svg.selectAll("path")
            .data(series)
            .enter().append("path")
            .attr("d", area)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

    } else {
        // 叠加模式
        // 获取所有数据的时间范围
        const allTimes = dataCollection.flatMap(d => d.data).map(d => d.time);
        // console.log(d3.extent(allTimes));
        x.domain(d3.extent(allTimes));
        y.domain([0, d3.max(dataCollection.flatMap(d => d.data), d => d.count)]);

        xAxis.transition().call(d3.axisBottom(x).ticks(d3.timeHour.every(1)));
        yAxis.transition().call(d3.axisLeft(y));

        // 为每组数据创建区域
        dataCollection.forEach((dayData, index) => {
            const area = d3.area()
                .x(d => x(d.time))
                .y0(chartHeight)
                .y1(d => y(d.count))
                .curve(d3.curveMonotoneX);

            g.append("path")
                .datum(dayData.data)
                .attr("class", "area")
                // .attr("fill", colorScale(index))
                // .attr("stroke", colorScale(index))
                .attr("fill", color_chart_dict[dayData.date])
                .attr("stroke", color_chart_dict[dayData.date])
                .attr("d", area);

            // 添加图例
            legend.append("rect")
                .attr("x", 0)
                .attr("y", index * 20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color_chart_dict[dayData.date]);

            legend.append("text")
                .attr("x", 20)
                .attr("y", index * 20 + 12)
                .attr("fill", "rgba(255,255,255,1)")
                .text(dayData.date);
        });
    }
}

// 加载总览数据
function loadOverview() {
    d3.csv("message_count_by_day.csv", parseDayData).then(data => {
        updateChart(data, true);
    });
}

// 加载单日数据
function loadSingleDay(dateStr) {
    d3.csv(`daily_hours/${item}.csv`, parseHourData).then(data => {
        updateChart([{ date: item, data: data }], false);
    });
}

// 加载所有单日数据（用于叠加模式）
function loadAllDays() {
    const start = new Date("2017-02-23");
    const end = new Date("2017-04-26");
    const promises = [];
    const dateArray = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const isoDate = d.toISOString().slice(0, 10);
        dateArray.push(isoDate);
        promises.push(d3.csv(`daily_hours/${isoDate}.csv`, parseHourData));
    }

    Promise.all(promises).then(dataArray => {
        const allDayData = dataArray.map((data, index) => ({
            date: dateArray[index],
            data: data
        }));
        updateChart(allDayData, false);
    });
}

// 初始化选择器
// const dateSelector = d3.select("#dateSelector");
// const start = new Date("2017-02-23");
// const end = new Date("2017-04-26");


// // 添加"111"选项用于叠加模式
// dateSelector.append("option").attr("value", "all-days").text("111 - 所有天叠加");

// // 添加单日选择选项
// for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//     const isoDate = d.toISOString().slice(0,10);
//     dateSelector.append("option").attr("value", isoDate).text(isoDate);
// }

// dateSelector.on("change", function() {
//     const selected = this.value;
//     if (selected === "overview") {
//         loadOverview();
//     } else if (selected === "all-days") {
//         loadAllDays();
//     } else {
//         loadSingleDay(selected);
//     }
// });

// 初始化加载总览
// loadOverview();

function for_color(d) {
    const group = d => d.id.split(".")[0]; // "util" of "flare.util.Strings"
    console.log(d.data);
    console.log(group(d.data));
    return color_chart_dict[group(d.data)];
}

const phone11data = [];

setInterval(() => {
    const dateSelector = d3.select("#dateSelector");
    const start = new Date("2017-02-23");
    const end = new Date("2017-04-26");
    const ca = d3.select("#calendar");
    if (ca.property("value") == null) {
        ca.property("value", "");
    }
    const now_set = ca.property("value").split(",");
    for (const value in now_list) {
        now_list[value] = false;
    }
    for (const vv of now_set) {
        var value = vv.trim();
        if (value.length > 0) {
            now_list[value] = true;
            // console.log(now_list);
        }
    }

    const promises = [];
    const promises2 = [];
    const dateArray = [];
    let isChanged = false;
    for (const value in now_list) {
        if (now_list[value] != visible_list[value]) {
            isChanged = true;
            if (now_list[value]) {// enable
                visible_list[value] = true;
                scatter_dict[value].show();
            } else {//disable
                visible_list[value] = false;
                scatter_dict[value].hide();
            }
        }
        if (now_list[value]) {
            dateArray.push(value);
            promises.push(d3.csv(`daily_hours/${value}.csv`, parseHourData));
            promises2.push(d3.csv(`csv/phone11/${value}.csv`, parsePhone));
        }
    }
    // console.log(dateArray);
    Promise.all(promises).then(dataArray => {
        const allDayData = dataArray.map((data, index) => ({
            date: dateArray[index],
            data: data
        }));
        updateChart(allDayData, false);
    });
    if (isChanged) {
        let phone11data = [];
        let fileList = [];
        for (const value in now_list) {
            if (now_list[value]) {
                fileList.push(`csv/phone11/${value}.csv`);
            }
        }

        Promise.all(
            fileList.map((file, index) => {
                return d3.csv(file);
            })
        ).then(results => {
            for (const data of results) {
                data.forEach(d => {
                    phone11data.push({"id": d.id, "value": +d.value});
                });
            }
            let margin = 1;
            let name = d => d.id.split(".")[1]; // "Strings" of "flare.util.Strings"
            let group = d => d.id.split(".")[0]; // "util" of "flare.util.Strings"
            let names = d => d.id.split(".");//d => name(d).split(/(?=[A-Z][a-z])|\s+/g); // ["Legend", "Item"] of "flare.vis.legend.LegendItems"

            // Specify the number format for values.
            const format = d3.format(",d");

            // Create a categorical color scale.
            const color = d3.scaleOrdinal(d3.schemeTableau10);

            // Create the pack layout.
            const pack = d3.pack()
                .size([width2 - margin * 2, height2 - margin * 2])
                .padding(1);
            g2.selectAll("*").remove();
            // Compute the hierarchy from the (flat) data; expose the values
            // for each node; lastly apply the pack layout.
            let root = pack(d3.hierarchy({ children: phone11data })
                .sum(d => d.value));
            // g2.selectAll(".area").remove();
            // g2.selectAll(".axis-label").remove();
            console.log(phone11data);
            console.log(d3.hierarchy({ children: phone11data }));
            console.log(root);
            // Place each (leaf) node according to the layout’s x and y values.
            let node = g2
                .selectAll()
                .data(root.leaves())
                .join("g")
                .attr("transform", d => `translate(${d.x},${d.y})`);

            // Add a title.
            node.append("title")
                .text(d => `${d.data.id}\n${format(d.value)}`);

            // Add a filled circle.
            node.append("circle")
                .attr("fill-opacity", 0.9)
                // .attr("fill", d => color(group(d.data)))
                .attr("fill", d => color_full_dict[group(d.data)])
                .attr("r", d => d.r);

            // Add a label.
            let text = node.append("text")
                .attr("clip-path", d => `circle(${d.r})`);

            // Add a tspan for each CamelCase-separated word.
            text.selectAll()
                .data(d => names(d.data))
                .join("tspan")
                .attr("x", 0)
                .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
                .text(d => d);

            // Add a tspan for the node’s value.
            text.append("tspan")
                .attr("x", 0)
                .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
                .attr("fill-opacity", 0.7)
                .text(d => format(d.value));
        });
    }

    // 初始化选择器
}, 500);