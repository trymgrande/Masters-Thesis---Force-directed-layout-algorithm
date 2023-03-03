// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3 from "d3";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph

// interface Node {
//     // TODO
// }
//
// interface Link {
//     // TODO
// }

function generateRandomGraph() {
    let nodes = [];
    for (let i = 0; i < 100; i++) {
        let newName = (Math.random() + 1).toString(36).substring(7);
        let newNode = {id: newName, group: 5, incomingLinks: 0};
        nodes.push(newNode);
    }

    let links = [];
    function getRandomNodeIndex() {return Math.floor(Math.random() * nodes.length)}
    for (let i = 0; i < nodes.length*2; i++) {
        let sourceName = nodes[getRandomNodeIndex()].id;
        let targetName = nodes[getRandomNodeIndex()].id;
        let newLink = {source: sourceName, target: targetName, value: 1};
        links.push(newLink);
    }
    return {nodes: nodes, links: links};
}

function generateCustomGraph() { // TODO: class for nodes and/or edges?
    let nodes = []; // TODO: refactor into [{id: 0, name: "open borders" ... }]
    // node: id (name), group 5, description, bar (float)
    let ids = ["open borders", "welfare state objection", "benefits to immigrant-receiving countries", "global benefits", "benefits to immigrant-sending countries", "benefits to immigrants", "brain drain", "proportion of people", "burden for taxpayers", "need of the provisions", "cuisine diversity", "immigrant labor", "double world GDP", "end of poverty", "one world", "innovation case for open borders", "peace case for open borders", "ghosts versus zombies", "remittance", "develop high skills", "constrained in their policy", "benefits to migrants", "concrete benefits to migrants", "stated and revealed preferences", "losing skilled people", "acquire skills, without migrating", "developed to the developing", "partial migration"];
    for (let i = 0; i < ids.length; i++) {
        let newNode = {id: ids[i], group: 5, incomingLinks: 0, outgoingLinks: 0, pageRank: -1};
        nodes.push(newNode);
    }

    let links = [];
    // TODO: refactor into [{source: "x", target: "y"}]
    let linksNames = [["proportion of people", "welfare state objection"], ["burden for taxpayers", "welfare state objection"], ["need of the provisions", "welfare state objection"], ["welfare state objection", "benefits to immigrant-receiving countries"], ["cuisine diversity", "benefits to immigrant-receiving countries"], ["immigrant labor", "benefits to immigrant-receiving countries"], ["benefits to immigrant-receiving countries", "open borders"], ["global benefits", "open borders"], ["double world GDP", "global benefits"], ["end of poverty", "global benefits"], ["one world", "global benefits"], ["innovation case for open borders", "global benefits"], ["peace case for open borders", "global benefits"], ["benefits to migrants", "open borders"], ["stated and revealed preferences", "benefits to migrants"], ["concrete benefits to migrants", "benefits to migrants"], ["benefits to immigrant-sending countries", "open borders"], ["ghosts versus zombies", "benefits to immigrant-sending countries"], ["remittance", "benefits to immigrant-sending countries"], ["develop high skills", "benefits to immigrant-sending countries"], ["constrained in their policy", "benefits to immigrant-sending countries"], ["brain drain", "benefits to immigrant-sending countries"], ["losing skilled people", "brain drain"], ["acquire skills, without migrating", "brain drain"], ["developed to the developing", "brain drain"], ["partial migration", "brain drain"]];
    for (let i = 0; i < linksNames.length; i++) {
        let sourceName = linksNames[i][0];
        let	targetName = linksNames[i][1];
        let newLink = {source: sourceName, target: targetName, value: 1, strength: 1};
        links.push(newLink);
    }
    return {nodes: nodes, links: links};
}


function setLinksPerNode(graph) {
    let nodes = graph.nodes;
    let links = graph.links;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < links.length; j++) {
            if (links[j].target === nodes[i].id) {
                nodes[i].incomingLinks = nodes[i].incomingLinks + 1;
            }
            if (links[j].source === nodes[i].id) {
                nodes[i].outgoingLinks = nodes[i].outgoingLinks + 1;
            }
        }
    }
    graph = {nodes: nodes, links: links};
    return graph;
}

function findNode(id, graph) {
    for (let i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].id === id) {
            return graph.nodes[i];
        }
    }
    return null;
}

function findIncomingNodes(node, graph) {
    let incomingNodes = [];
    let links = graph.links;
    let nodes = graph.nodes;
    for (let i = 0; i < links.length; i++) {
        if (links[i].target === node.id) {
            incomingNodes.push(findNode(links[i].source, graph))
        }
    }
    return incomingNodes;
}

function calculatePageRank(graph, iterations = 100, initialValue = 100) {
    /**
     * PR(A) = (incoming) => prev_PR(B)/B_out + prev_PR(C)/C_out
     */

    // set initial value
    for (let k = 0; k < graph.nodes.length; k++) {
        graph.nodes[k].pageRank = initialValue/graph.nodes.length;
    }

    // main calculation
    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < graph.nodes.length; j++) {
            let incomingNodes = findIncomingNodes(graph.nodes[j], graph);
            let pageRankIncomingValues = incomingNodes.map(incomingNode =>
                (incomingNode.pageRank/incomingNode.outgoingLinks===Number.POSITIVE_INFINITY ? incomingNode.pageRank : incomingNode.pageRank/incomingNode.outgoingLinks));
            if (pageRankIncomingValues.length !== 0) {
                let pageRank = pageRankIncomingValues.reduce((accumulator, value) => accumulator + value, 0);
                graph.nodes[j].pageRank = pageRank
            }
        }
    }

    // normalize sizes
    for (let i = 0; i < graph.nodes.length; i++) {
        // if (graph.nodes[i].pageRank < 1) {
        // 	graph.nodes[i].pageRank = 1;
        // }
        // else {
        graph.nodes[i].pageRank = Math.log(graph.nodes[i].pageRank)*10;
        // }
    }
    return {nodes: graph.nodes, links: graph.links};
}

// TODO for coloring
// const medianPageRank = calculateMeanPageRank()

let graph = generateCustomGraph();

graph = setLinksPerNode(graph);

graph = calculatePageRank(graph);

console.log(graph);


function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
}, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    // nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    invalidation, // when this promise resolves, stop the simulation
    nodepageRank = d => d.pageRank, // number of incoming links for the node
}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
    const I = d3.map(nodes, nodepageRank).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i], pageRank: I[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody().strength(-300);
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);


    const simulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center",  d3.forceCenter(100))
            // .force("x", d3.forceX())
            // .force("y", d3.forceY())
            // .tick(6)
            // .stop()
            .on("tick", ticked)
            // .on("tick", t => console.log("tick"))
            .tick(100)
        // .stop()
    ;



    // const svg = d3.create("svg")
    const svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // def for the arrow
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr('refX', 10) // shift arrows off initial position
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // old link
    // const link = svg.append("g")
    // 	.attr('id', 'link')
    // 	.attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
    // 	.attr("stroke-opacity", linkStrokeOpacity)
    // 	.attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
    // 	.attr("stroke-linecap", linkStrokeLinecap)
    // 	.selectAll("line")
    // 	.data(links)
    // 	.join("line")
    // 	;

    // link connected to the arrow
    const link = svg.selectAll("line.link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", "#000")
        .attr('marker-end', d => "url(#arrowhead)") // sets arrowhead position
        .style("stroke-width", 2);



    const node = svg.append("g")
        // .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth*nodepageRank)
        .selectAll("circle")
        .attr( "class", "node" )

        // .style("fill", d => 'green')
        // .style( "stroke", '#111' )
        // .style( "stroke-width", '2' )
        .data(nodes)
        .join("circle")
        .on('click', e => console.log(simulation.find(e.x, e.y)))
        .attr("fill", d => d.pageRank > 15 ? '#FB9224' : '#002E58') // TODO color map
        // .attr("r", nodeRadius)
        .attr("r", nodepageRank)
        .call(drag(simulation))
    ;

    const text = svg.selectAll("text")
        .data( nodes )
        .enter().append( "text" )
        // .call( force.drag )
        .text(d => d.pageRank > 15 ? d.id : '');
    // .call(drag(simulation));

    // more text stuff, may be unnecessary
    // const node = svg.selectAll(".node");
    // node.append( "title" )
    // 	.text( (d) => d.id );


    // // zoom and pan
    // let zoom = d3.zoom()
    // // .scaleExtent([1,2])
    // // .translateExtent([[-width, -height], [width, height]])
    // .on('zoom', handleZoom);

    // d3.select('svg')
    // 	.call(zoom);


    // needed to freeze simulation
    // link
    // 	.attr("x1", d => d.source.x)
    // 	.attr("y1", d => d.source.y)
    // 	.attr("x2", d => d.target.x)
    // 	.attr("y2", d => d.target.y)
    // 	;
    //
    // node
    // 	.attr("cx", d => d.x)
    // 	.attr("cy", d => d.y);

    // node text

    // node.append("text")
    // 	// .attr("x", function(d) { return x(d) - 3; })
    // 	// .attr("y", 5 / 2)
    // 	// .attr("dy", ".35em")
    // 	// .text(function(d) { return d; });
    // 	.text(function(d, i) { return d.id;})

    // var bar = chart.selectAll("g")
    // 	.data(nodes)
    // 	.enter().append("g")
    // 	.attr("transform", function(d, i) { return "translate(0," + i * 2 + ")"; });

    // // bar.append("rect")
    // // 	.attr("width", x)
    // // 	.attr("height", barHeight - 1);

    // bar.append("text")
    // 	.attr("x", function(d) { return x(d) - 3; })
    // 	.attr("y", 2 / 2)
    // 	.attr("dy", ".35em")
    // 	.text(function(d) { return d; });



    if (W) link.attr("stroke-width", ({index: i}) => W[i]);
    if (L) link.attr("stroke", ({index: i}) => L[i]);
    // if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (T) node.append("title").text(({index: i}) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function ticked() {
        let zoom = d3.zoom()
            // .scaleExtent([1,2])
            // .translateExtent([[-width, -height], [width, height]])
            .on('zoom', handleZoom);

        d3.select('svg')
            .call(zoom);


        link
            // .attr("x1", d => d.source.x)
            // .attr("y1", d => d.source.y)
            // .attr("x2", d => d.target.x)
            // .attr("y2", d => d.target.y)
            // .attr( "d", d => "M" + d.source.x + "," + d.source.y + ", " + d.target.x + "," + d.target.y)
            .attr('d', function (d) {
                const deltaX = d.target.x - d.source.x,
                    deltaY = d.target.y - d.source.y,
                    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                    normX = deltaX / distance,
                    normY = deltaY / distance,
                    sourcePadding = 0,
                    targetPadding = d.target.pageRank,
                    sourceX = d.source.x + (sourcePadding * normX),
                    sourceY = d.source.y + (sourcePadding * normY),
                    targetX = d.target.x - (targetPadding * normX),
                    targetY = d.target.y - (targetPadding * normY),
                    midX = (targetX - sourceX) / 2 + sourceX,
                    midY = (targetY - sourceY) / 2 + sourceY;

                return 'M' + sourceX + ',' + sourceY + 'L' + midX + ',' + midY + 'L' + targetX + ',' + targetY;
            });

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr( "x", (d) => d.x - 5 )
            .attr( "y", (d) => d.y + 5 )


    }

    // let data = [], zoom_width = 600, zoom_height = 400, numPoints = 100;


    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    function handleZoom(e) {
        d3.select('svg')
            .attr('transform', e.transform);
    }



    return Object.assign(svg.node(), {scales: {color}});
}


let chart = ForceGraph(
    graph, {
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.pageRank}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: 800,
        height: 600,
        invalidation: null, // a promise to stop the simulation when the cell is re-run
        nodepageRank: d => (d.pageRank)
    }
)

// svg html embedding
var element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
chart.appendChild(element);
// var name = document.getElementById("svg-container").;
// console.log("name: " + name)