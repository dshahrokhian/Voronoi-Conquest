// Interface vars
var Delaunay

var bboxWidth = 800
var	bboxHeight = 600
var x = 100
var y = 100


/* ## Usage: var bbox = {
	xl: {initial x value, e.g. 0},
	xr: {bounding box's width},
	yt: {initial y value, e.g. 0},
	yb: {bounding box's height}
};
*/

var	bbox = {
	xl: this.x,
	xr: this.bboxWidth,
	yt: this.y,
	yb: this.bboxHeight
};


/* Object used to represent the triangles form the Delaunay Triangulation 
 * Usage: var triangle = new Triangle(points)
 *		  // The x value of the third point:
 *		  var point = triangle.p3[0]
*/
var Triangle = function(points) 
{
	this.p1 = points[0]
	this.p2 = points[1]
	this.p3 = points[2]
};

var triangulation = [];
//triangulation.push(new Triangle(Delaunay.outterTriangle(bbox)));


/* Usage:
		  var triangles = Delaunay.compute(sites)
		  // The x value of the third point in the second triangle:
		  var point = triangles[1].p3[0]
*/

Delaunay = 
{
		//Incremental construction

		//The first step for computing a delaunay triangulation is to compute the outter triangle
		//Since we have a bounding box, where the points will be placed in, we can computer the outter triangle
		//as one containing the bounding box
		outterTriangle: function(bbox)
		{ 
			var p1 = [bbox.xl - 10*(bbox.yb + bbox.xr), bbox.yt + 10*(bbox.yb + bbox.xr)],
				p2 = [bbox.xl + 10*(bbox.xr + bbox.yt), bbox.yt + 10*(bbox.yb + bbox.xr)],
				p3 = [bbox.xl + bbox.xr*0.5, bbox.yt - 10*(bbox.xr + bbox.yt)];

			return [p1, p2, p3];
		},

		//Next, we have to find the triangle containing the newly added point
		//For this, we are testing the triangles by calculating the barycentric coordinates
		/*
		det(T) = (y2-y3)(x1-x3) + (x3-x2)(y1-y3)
		alpha = ((y2-y3)(x-x3) + (x3-x2)(y-y3))/det(T)
		beta = ((y3-y1)(x-x3) + (x1-x3)(y-y3))/det(T)
		gamma = 1 - alpha - beta

		reference: https://en.wikipedia.org/wiki/Barycentric_coordinate_system#Conversion_between_barycentric_and_Cartesian_coordinates

		Determining location of point r(x,y) with respect to the triangle
		0 < alpha, beta, gamma < 1 -> lies inside the triangle
		For a point lying on the edge, one of the coordinates:
		alpha, beta, gamma = 0, while the others lie in the open interval (0,1)
		Otherwise, r is outside of the triangle
		*/
		getBarycentricCoordinates: function(tr, p)
		{
			//x=0, y=1
			var det = (tr.p2[1] - tr.p3[1])*(tr.p1[0] - tr.p3[0]) + (tr.p3[0] - tr.p2[0])*(tr.p1[1] - tr.p3[1]);
			var alpha = ((tr.p2[1] - tr.p3[1])*(p[0] - tr.p3[0]) + (tr.p3[0] - tr.p2[0])*(p[1] - tr.p3[1]))/det;
			var beta = ((tr.p3[1] - tr.p1[1])*(p[0] - tr.p3[0]) + (tr.p1[0] - tr.p3[0]) *(p[1] - tr.p3[1]))/det;
			var gama = 1.0 - alpha - beta;

			return [alpha, beta, gama];
		},


		//Check if the given point is inside the triangle
		isContained: function(tr, p)
		{
			var coord = this.getBarycentricCoordinates(tr, p);

			var alpha = coord[0],
				beta = coord[1],
				gama = coord[2];

			if(0 < alpha && alpha < 1 && 0 < beta && beta < 1 && 0 < gama && gama < 1)
				return true;
			else
				return false;
		},


		//Check if the given point is on the edges of the triangle
		isOnTheEdges: function(tr, p)
		{
			var coord = this.getBarycentricCoordinates(tr, p);

			var alpha = coord[0],
				beta = coord[1],
				gamma = coord[2];

			if(alpha == 0 || beta == 0 || gamma == 0)
				return true;
			else
				return false;

		},
		

		//Check if the added edges are legal by doing the incircle test: determinant test
		/* |1 x1 y1 x1^2 + y1^2|
		   |1 x2 y2 x2^2 + y2^2|
		   |1 x3 y3 x3^2 + y3^2|
		   |1 x  y  x^2  + y^2 |
		and
		   |1 x1 y1|
		   |1 x2 y2|
		   |1 x3 y3|
		We need both determinants to make sure that the order in which we process the points
		is not relevant. 
		Thus, the point is inside the circle if the determinants have opposite signs.

		Reference: https://www.cs.duke.edu/courses/fall08/cps230/Lectures/L-21.pdf
		*/

		//tr is one of the newly added triangles and p is the point on the adjacent triangle
		inCircleTest: function(tr, p)
		{
			//calculate the determinant using math.js library

			var pointMatrix = math.matrix([
				[1, tr.p1[0], tr.p1[1], tr.p1[0]*tr.p1[0] + tr.p1[1]*tr.p1[1]],
				[1, tr.p2[0], tr.p2[1], tr.p2[0]*tr.p2[0] + tr.p2[1]*tr.p2[1]],
				[1, tr.p3[0], tr.p3[1], tr.p3[0]*tr.p3[0] + tr.p3[1]*tr.p3[1]],
				[1, 	p[0], 	  p[1], p[0]*p[0] + p[1]*p[1]]
				]);

			var triangleMatrix = math.matrix([
				[1, tr.p1[0], tr.p1[1]],
				[1, tr.p2[0], tr.p2[1]],
				[1, tr.p3[0], tr.p3[1]]
				])

			var detPoint = math.det(pointMatrix);
			var detTriangle = math.det(triangleMatrix);

			if(detPoint*detTriangle < 0)
				return true;
			else
				return false;
		},


		//This is checking is the 2 given points correspond to the same location
		checkIfPointsAreEqual: function(p1, p2)
		{
			return (p1[0] == p2[0]) && (p1[1] == p2[1]);
		},


		//This checks if 2 given triangles have any point in common
		checkIfTrianglesHaveCommonPoint: function(tr, outter)
		{
			if(this.checkIfPointsAreEqual(tr.p1, outter.p1) || this.checkIfPointsAreEqual(tr.p1, outter.p2) || this.checkIfPointsAreEqual(tr.p1, outter.p3))
			{
				return true;
			}
			else
			{
				if(this.checkIfPointsAreEqual(tr.p2, outter.p1) || this.checkIfPointsAreEqual(tr.p2, outter.p2) || this.checkIfPointsAreEqual(tr.p2, outter.p3))
				{
					return true;
				}
				else
				{
					if(this.checkIfPointsAreEqual(tr.p3, outter.p1) || this.checkIfPointsAreEqual(tr.p3, outter.p2) || this.checkIfPointsAreEqual(tr.p3, outter.p3))
					{
						return true;
					}
					else
					{
						return false;
					}
				}
			}
		},


		//Given a triangle and an edge, get the third point of the triangle
		getThirdPointAlongTheTriangle: function(tr, edge)
		{	
			if(this.checkIfPointsAreEqual(tr.p1, edge[0]))
			{
				if(this.checkIfPointsAreEqual(tr.p2, edge[1])) return tr.p3;
				else{
					if(this.checkIfPointsAreEqual(tr.p3, edge[1])) return tr.p2;
					else return null;
				}
			}
			else
			{
				if(this.checkIfPointsAreEqual(tr.p2, edge[0]))
				{
					if(this.checkIfPointsAreEqual(tr.p1, edge[1])) return tr.p3;
					else
					{
						if(this.checkIfPointsAreEqual(tr.p3, edge[1])) return tr.p1;
						else return null;
					}
				}
				else
				{
					if(this.checkIfPointsAreEqual(tr.p3, edge[0]))
					{
						if(this.checkIfPointsAreEqual(tr.p1, edge[1])) return tr.p2;
						else
						{
							if(this.checkIfPointsAreEqual(tr.p2, edge[1])) return tr.p1;
							else return null;
						}
					}
					else
					{
						return null;
					}
				}
			}
		},


		//We need to get the adjacent triangle along the edge, with p being the third point of the triangle.
		getAdjacentTriangle: function(edge, p)
		{
			var i;
			for(i = 0; i < triangulation.length; i++)
			{
				var point = this.getThirdPointAlongTheTriangle(triangulation[i], edge);

				if(point != null)
				{
					if(!this.checkIfPointsAreEqual(point, p))
					{
						//alert(triangulation[i].p1 + " " + triangulation[i].p2 + " " + triangulation[i].p3);
						return [triangulation[i], point];
					}
				}
			}
			
			return null;
		},


		//Given the triangle, find on what edge the point is
		//We check for every two points of the triangle and the given points if they are collinear
		//This can be done is the determinant is 0
		/*
		   |1 x1 y1|
		   |1 x2 y2|
		   |1 x3 y3|
		*/
		getEdgeAndPointInTriangle: function(tr, p)
		{
			var matrix12 = math.matrix([
				[1, tr.p1[0], tr.p1[1]],
				[1, tr.p2[0], tr.p2[1]],
				[1, p[0],	  p[1]]
				]);

			var matrix23 = math.matrix([
				[1, tr.p2[0], tr.p2[1]],
				[1, tr.p3[0], tr.p3[1]],
				[1, p[0],	  p[1]]
				]);

			if(math.det(matrix12) == 0)
			{
				return [[tr.p1, tr.p2], tr.p3];
			}
			else
			{
				if(math.det(matrix23) == 0)
				{
					return [[tr.p2, tr.p3], tr.p1];
				}
				else
				{
					return [[tr.p3, tr.p1], tr.p2];
				}
			}

		},


		//Flip the edges when illegal
		legalizeEdge: function(edge, p, tr)
		{
			var adjTrAndP = this.getAdjacentTriangle(edge, p);

			if(adjTrAndP != null)
			{
				var adjTr = adjTrAndP[0],
					adjP = adjTrAndP[1];

				if(this.inCircleTest(tr, adjP))
				{
					var index1 = triangulation.indexOf(tr);
					triangulation.splice(index1, 1);

					var index2 = triangulation.indexOf(adjTr);
					triangulation.splice(index2, 1);

					var tr1 = new Triangle([p, adjP, edge[0]]), 
						tr2 = new Triangle([p, adjP, edge[1]]);

					triangulation.push(tr1);
					triangulation.push(tr2);

					//legalize newly added edges
					this.legalizeEdge([adjP, edge[0]], p, tr1);
					this.legalizeEdge([adjP, edge[1]], p, tr2);

				}

			}

		},
		

		//To remove all triangles that have a connection to the outter vertices
		removeOutterTriangle: function(oldTriangulation)
		{
			var outter = new Triangle(this.outterTriangle(bbox)), 
				i = 0, j;			

			var tempTriangulation = []

			
			for(j = 0; j < oldTriangulation.length; j++)
			{
				tempTriangulation.push(new Triangle([oldTriangulation[j].p1, oldTriangulation[j].p2, oldTriangulation[j].p3]));
			}

			i = 0;

			while(i < tempTriangulation.length)
			{
				if(this.checkIfTrianglesHaveCommonPoint(tempTriangulation[i], outter))
				{
					tempTriangulation.splice(i, 1);
				}
				else
				{
					i++;
				}
			}

			return tempTriangulation;
		},


		/*
		This method adds one point to the Delaunay triangulation
		*/
		addSite: function(site)
		{
			var i;

			var found = false;

			for(i = 0; (i <  triangulation.length && !found); i++)
			{
				if(this.isContained(triangulation[i], site))
				{
					//This means that the point is inside the triangle
					//We need to delete the triangle, and insert the other 3
					//Then legalize the edges
					var triangle =  triangulation[i];

					//Delete the old triangle
					triangulation.splice(i, 1);

					//Create the new triangles
					var tr1 = new Triangle([site, triangle.p1, triangle.p2]),
						tr2 = new Triangle([site, triangle.p2, triangle.p3]),
						tr3 = new Triangle([site, triangle.p3, triangle.p1]);

					triangulation.push(tr1);
					triangulation.push(tr2);
					triangulation.push(tr3);

					//Legalize the newly added edges
					this.legalizeEdge([triangle.p1, triangle.p2], site, tr1);					
					this.legalizeEdge([triangle.p2, triangle.p3], site, tr2);
					this.legalizeEdge([triangle.p3, triangle.p1], site, tr3);

					found = true;
				}
				else
				{
					if(this.isOnTheEdges(triangulation[i], site))
					{
						//This means that the point is on the edge
						//We need to find the adjacent triangle along that edge
						//Delete the 2 triangles, and insert the other 4
						//Then legalize the edges

						//We first need to get the edge where the point is
						var triangle = triangulation[i];

						var eP = this.getEdgeAndPointInTriangle(triangle, site);
						var siteEdge = eP[0],
							otherPoint = eP[1];

						var adjTrianPoint = this.getAdjacentTriangle(siteEdge, otherPoint);

						var adjTr = adjTrianPoint[0],
							adjPt = adjTrianPoint[1];

						//Delete the 2 adjacent triangles
						triangulation.splice(i, 1);
						var index = triangulation.indexOf(adjTr);
						triangulation.splice(index, 1);

						//Add the newly formed 4 triangles
						var tr1 = new Triangle([site, siteEdge[0], otherPoint]),
							tr2 = new Triangle([site, siteEdge[0], adjPt]),
							tr3 = new Triangle([site, siteEdge[1], otherPoint]),
							tr4 = new Triangle([site, siteEdge[1], adjPt]);

						triangulation.push(tr1);						
						triangulation.push(tr2);
						triangulation.push(tr3);						
						triangulation.push(tr4);

						this.legalizeEdge([siteEdge[0], otherPoint], site, tr1);					
						this.legalizeEdge([siteEdge[0], adjPt], site, tr2);
						this.legalizeEdge([siteEdge[1], otherPoint], site, tr3);
						this.legalizeEdge([siteEdge[1], adjPt], site, tr4);

						found = true;
					}

				}
			}

			return this.removeOutterTriangle(triangulation);
		}

	/* Generates the delaunay triangulation from the set of sites 
	 * 
	 * @parameter sites : the array of sites from which we want to generate the Delaunay Triangulation.
	 * 					  Each element of this array is an object with the pattern
	 						"{x,y}"
	 					  This means that for accesing the x-value of the second site you should do
	 					  	"sites[1].x"
	 	@returns an array of Delaunay triangles. The points of the triangle are in counterclockwise order.
	 */
	 /*
	compute: function(sites) {
	}*/
}

triangulation.push(new Triangle(Delaunay.outterTriangle(bbox)));