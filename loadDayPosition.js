
const startDate = new Date("2017-02-23");
const endDate = new Date("2017-04-26");

let scatter_dict = {}
let geo_dict = {}
let scatter_setting = {}
let visible_list = {}
let now_list = {}

function getRandomInt() {
    min = 128;
    max = 255;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    scatter.setStyle({
        // color: 'rgba(' + (day * 14)%256 + ',' + (day * 33)%256 + ',' + (day * 54)%256 + ',0.1)',
        color: 'rgba(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ',0.1)',
        unit: 'meter',
        size: [300, 500],
        borderWidth: 0,
    });
    visible_list[formatted] = false;
    now_list[formatted] = false;
    loca.add(scatter);
    console.log(formatted);
}


setInterval(() => {
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
            console.log(now_list);
        }
    }
    for (const value in now_list) {
        if (now_list[value] != visible_list[value]) {
            if (now_list[value]) {
                visible_list[value] = true;
                // scatter_setting[value].visible = true;
                scatter_dict[value].show();
            } else {
                visible_list[value] = false;
                // scatter_setting[value].visible = false;
                scatter_dict[value].hide();
            }
            // scatter_dict[value].setData(scatter_setting[value]);
            // scatter_dict[value].update();
            // var scatter = new Loca.ScatterLayer(scatter_setting[value]);
            // scatter.setSource(geo_dict[value]);
            // scatter.setStyle({
            //     color: 'rgba(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ',0.1)',
            //     unit: 'meter',
            //     size: [300, 500],
            //     borderWidth: 0,
            // });
            // loca.add(scatter);
        }
    }
}, 200);