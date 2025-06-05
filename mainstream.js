data = FileAttachment("unemployment.csv").csv({typed: true})

Plot.plot({
  marginLeft: 60,
  y: {grid: true},
  color: {legend: true, columns: 6},
  marks: [
    Plot.areaY(data, {x: "date", y: "unemployed", fill: "industry", offset: "wiggle"})
  ]
})
