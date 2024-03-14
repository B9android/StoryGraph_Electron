/*
function createGraph() {
    var width = 400, height = 400
    var nodes = [{}, {}, {}, {}, {}]
  
    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width/2, height/2))
      .on('tick', ticked);
  
    function ticked() {
      var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        });
    }

    let graph_container = d3.select("#graph-container")
    let div = graph_container.append("div")
    div.append("h2").text("Graph:")

    let svg = div
        .append("svg")
        .attr("width", width)
        .attr("height", height)
  }

*/

/*
function createGraph() {
    const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#graph-container")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(function(data) {
        const link = svg
            .selectAll("line")
            .data(data.links)
            .join("line")
                .style("stroke", "#aaa")

        const node = svg
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
                .attr("r", 20)
                .style("fill", "#69b3a2")

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink()
                .id(function(d) { return d.id })
                .links(data.links)
            )
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width/2, height/2))
            .on("end", ticked);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x+6; })
                .attr("cy", function(d) { return d.y-6; });
        }
    });
}
*/



async function createGraph() {
    const data = await d3.json("data.json")
    console.log(data)

    function chart() {
        // Specify the dimensions of the chart.
        const width = 928;
        const height = 600;
      
        // Specify the color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);
      
        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = data.links.map(d => ({...d}));
        const nodes = data.nodes.map(d => ({...d}));
      
        // Create a simulation with several forces.
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);
      
        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");
      
        // Add a line for each link, and a circle for each node.
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
          .selectAll()
          .data(links)
          .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));
      
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
          .selectAll()
          .data(nodes)
          .join("circle")
            .attr("r", 5)
            .attr("fill", d => color(d.group));
      
        node.append("title")
            .text(d => d.id);
      
        // Add a drag behavior.
        node.call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
      
        // Set the position attributes of links and nodes each time the simulation ticks.
        function ticked() {
          link
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);
      
          node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
        }
      
        // Reheat the simulation when drag starts, and fix the subject position.
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
      
        // Update the subject (dragged node) position during drag.
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
      
        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }
      
        // When this cell is re-run, stop the previous simulation. (This doesn’t
        // really matter since the target alpha is zero and the simulation will
        // stop naturally, but it’s a good practice.)
        //invalidation.then(() => simulation.stop());
      
        return svg.node();
      }

      d3.select("#graph-container").append(() => chart())
}