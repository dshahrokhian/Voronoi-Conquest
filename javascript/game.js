// Interface vars
var level;
// $.getJSON('levels/level1.json', function(data) {
// 	level = data
// });

level = {
	image: {
		"file": "westeros.jpg",
		"width": 800,
		"height": 600
	},
	colors: ["aqua","red"],
	conquerPoints: [
	{"x": 625, "y" : 317},
	{"x": 95,  "y" : 361},
	{"x": 147, "y" : 293},
	{"x": 321, "y" : 329},
	{"x": 480, "y" : 250},
	{"x": 188, "y" : 138},
	{"x": 675, "y" : 414},
	{"x": 164, "y" : 170},	
	{"x": 700, "y" : 500},
	{"x": 50,  "y" : 50},	
	{"x": 100, "y" : 100},
	{"x": 180, "y" : 20},
	{"x": 60,  "y" : 580},	
	{"x": 100, "y" : 500},
	{"x": 180, "y" : 450},
	{"x": 200, "y" : 380},	
	{"x": 580, "y" : 500},
	{"x": 480, "y" : 590},
	{"x": 400, "y" : 480},
	{"x": 770, "y" : 580},
	{"x": 700, "y" : 25},
	{"x": 425, "y" : 100},
	{"x": 275, "y" : 80},
	{"x": 445, "y" : 555},
	{"x": 678, "y" : 150}
	]
}

var bboxWidth = level.image.width
var	bboxHeight = level.image.height

var	bbox = {
	xl: 0,
	xr: this.bboxWidth,
	yt: 0,
	yb: this.bboxHeight
};

var colors = level.colors
var NOT_CONQUERED = -1
var CONQUERED_BY_PLAYER1 = 0
var CONQUERED_BY_PLAYER2 = 1

var conquerImages = {}
conquerImages[NOT_CONQUERED] = "neutral.png"
conquerImages[CONQUERED_BY_PLAYER1] = "player1.png"
conquerImages[CONQUERED_BY_PLAYER2] = "player2.png"


// Core vars
var	sites = []

var	voronoi
var pointLocation

var	svg

// Game vars
var nTurns = 8
var currentTurn = 0
var pl1TurnsLeft = 4
var pl2TurnsLeft = 4
var conquest

var VoronoiGame = {

	init : function() {

		// Game box

		svg = d3.select("#game")
		.append("svg")
		.attr("width", window.bboxWidth)
		.attr("height", window.bboxHeight)
		.attr("style", "cursor:crosshair; margin:0 auto;")
		.attr("border", 0)
		.on("click", function() {

			var coordinates = d3.mouse(this)

			if (!VoronoiGame.contains(sites,coordinates)) {

				if(currentTurn < nTurns)
				{
					VoronoiGame.addSite(coordinates);

					if(currentTurn%2 == 0)
					{
						pl1TurnsLeft--;
					}
					else
					{
						pl2TurnsLeft--;
					}

					var scoresPlayers = VoronoiGame.calculateScores(conquest);
					setPlayers(pl1TurnsLeft, scoresPlayers[CONQUERED_BY_PLAYER1], pl2TurnsLeft, scoresPlayers[CONQUERED_BY_PLAYER2], (currentTurn+1)%2);	
				}

				if (currentTurn == nTurns-1) {
					setTimeout(function(){ 
						var winner = VoronoiGame.calculateWinner(conquest)
						alert(winner + " wins! Refresh the page to start a new game.") 
					}, 500);
				}

				if(currentTurn >= nTurns) {
					alert("Game over! Refresh the page to start a new game.");
				}

				currentTurn++;
			}
		});

		svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", window.bboxWidth)
		.attr("height", window.bboxHeight)	
		.style("stroke", "black")
		.style("fill", "none")
		.style("stroke-width", 0);

		this.recompute(sites)
	},

	addSite : function(coordinates) {

		var xVal = coordinates[0]
		var yVal = coordinates[1]
		
		sites.push({x: xVal, y: yVal})
		this.recompute(sites)
	},

	recompute : function(sites) {

		voronoi = new Voronoi()
		pointLocation = new PointLocation()

		// Clear svg
		svg.selectAll(["line","circle","image"]).remove()

		// Recompute the diagram and draw it
		var diagram = window.voronoi.compute(sites, window.bbox)
		conquest = this.computeConquest(diagram.cells, level.conquerPoints)
		
		this.drawSites(sites)
		this.drawConqueredPoints(conquest)
		this.drawEdges(diagram.edges)
	},

	computeConquest : function(cells, conquerPoints) {

		var areas = []

		for(var i = 0; i < cells.length; i++) {

			var cell = cells[i]
			var areaVertices = []

			for(halfedge of cell.halfedges) {
				areaVertices.push(halfedge.getStartpoint())
			}

			areas.push({id: this.indexOf(cell.site, sites), points: areaVertices})
		}

		var conqueredPoints = []

		for (var i = 0; i < conquerPoints.length; i++) {
			
			var conquerPoint = conquerPoints[i]
			var siteId = pointLocation.getLocation(conquerPoint, areas, window.bbox)

			conqueredPoints.push({"siteId": siteId,"coordinates": conquerPoint})
		}

		return conqueredPoints
	},

	drawSites : function(sites) {

		for(var i = 0; i < sites.length; i++) {
			
			var site = sites[i]

			svg.append("circle")
			.attr("cx",site.x)
			.attr("cy",site.y)
			.attr("r", 4)
			.attr("fill", colors[i%2])
		}
	},

	drawConqueredPoints : function(points) {

		for(var i = 0; i < points.length; i++) {
			
			var point = points[i]

			var siteId = point.siteId
			var coord = point.coordinates

			var image;

			if (siteId == NOT_CONQUERED) {
				image = conquerImages[NOT_CONQUERED]
			} else {
				image = conquerImages[siteId % 2]
			}

			svg.append("svg:image")
			.attr("xlink:href", "images/conquer/" + image)
			.attr("x", coord.x-15)
			.attr("y", coord.y-15)
			.attr("width", "30")
			.attr("height", "30");
		}
	},

	drawEdges : function(edges) {

		for(var i = 0; i < edges.length; i++) {

			var edge = edges[i];

			svg.append("line")
			.attr("x1", edge.va.x)
			.attr("y1", edge.va.y)
			.attr("x2", edge.vb.x)
			.attr("y2", edge.vb.y)
			.attr("stroke", "#ac00e6")
			.attr("stroke-width", 4)
		}
	},

	contains : function(array, coordinates) {

		var found = false;

		for(var i = 0; i < array.length && !found; i++) {

			var point = array[i]

			if (coordinates[0] == point.x && coordinates[1] == point.y) {
				found = true;
			}
		}

		return found;
	},

	indexOf : function(site1, sites) {

		var index = -1

		for (var i = 0; i < sites.length && index == -1; i++) {

			var site2 = sites[i]

			if (site1.x == site2.x && site1.y == site2.y) {
				index = i
			}
		}

		return index
	},

	calculateScores: function(points)
	{
		var scores = [0,0]
		
		for(var i = 0; i < points.length; i++) {
			
			var point = points[i]

			var siteId = point.siteId
			var coord = point.coordinates

			if (siteId != NOT_CONQUERED) {
				scores[siteId % 2]++
			}
		}

		return scores;
	},

	calculateWinner : function(points) {

		var winner = ""

		var scores = [0,0]
		
		for(var i = 0; i < points.length; i++) {
			
			var point = points[i]

			var siteId = point.siteId
			var coord = point.coordinates

			if (siteId != NOT_CONQUERED) {
				scores[siteId % 2]++
			}
		}

		if (scores[CONQUERED_BY_PLAYER1] > scores[CONQUERED_BY_PLAYER2]) {
			winner = getCookie("player1Name");
		} else {
			winner = getCookie("player2Name");
		}

		return winner
	}
}