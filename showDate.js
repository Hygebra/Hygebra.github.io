// d3.select("#calendar").property("value", "");
//      // 读取自定义属性 value
// const originalText = d3.select("#calendar").text();       // 获取原始 textContent

// d3.select("#calendar")
// .datum(
//     d3.select("#calendar").property("value") !== null ?
//      (d3.select("#calendar").property("value").length === 0 ?
//     originalText : "点击选择显示日期：" + d3.select("#calendar").property("value")) : 
//     originalText
// )
// .join("#calendar")
// .text(d => d);
const el = d3.select("#calendar");
function update() {
    const val = el.property("value");
    el.text(val != null ? (val.length > 0 ? "点击选择显示日期：" + val : "点击选择显示日期：无") : "点击选择显示日期：无");
}

// 启动监听器：只监听属性变化中的 "value"
el.on("input", update);
update();