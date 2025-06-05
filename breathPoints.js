var geoLevelF = new Loca.GeoJSONSource({
    // data: [],
    // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_F.json',
    url: 'http://localhost:8080/datavis/csv/javascript/20170224.json'
});
var breathRed = new Loca.ScatterLayer({
    loca,
    zIndex: 113,
    opacity: 1,
    visible: true,
    zooms: [9, 22],
});
breathRed.setSource(geoLevelF);
breathRed.setStyle({
    color: 'rgba(243,56,175,0.1)',
    unit: 'meter',
    size: [500, 600],
    borderWidth: 0,
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
    duration: 500,
    animate: true,
});

// 黄色呼吸点
var geoLevelE = new Loca.GeoJSONSource({
    // data: [],
    // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_E.json',
    url: 'http://localhost:8080/datavis/csv/javascript/20170225.json'
});
var breathYellow = new Loca.ScatterLayer({
    loca,
    zIndex: 112,
    opacity: 1,
    visible: true,
    zooms: [9, 22],
});
breathYellow.setSource(geoLevelE);
breathYellow.setStyle({
    color: 'rgba(243,253,75,0.1)',
    unit: 'meter',
    size: [300, 500],
    borderWidth: 0,
//   texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
    duration: 4000,
    animate: true,
});

// 启动渲染动画
loca.animate.start();

var dat = new Loca.Dat();
dat.addLayer(scatter, ' 贴地');
dat.addLayer(breathRed, '红色');
dat.addLayer(breathYellow, '黄色');