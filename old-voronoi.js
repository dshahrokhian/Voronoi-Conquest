var Voronoi;

/* Usage: var voronoi = new Voronoi()
		  var faces = voronoi.compute(sites)
		  // The x value of the third point in the second face:
		  var point = faces[1].points[2].x
 */
Voronoi = {

	/* Object used to represent the faces of the voronoi diagram
	 * 
	 * Usage: var face = new Face(points)
     *   	  // The x value of the third point:
     *        var point = face.points[2].x
     * 
     * @param site : the site of the face
     * @param points : the points representing the boundary of the face
     */
	var Face = function(site, points) {
		this.site = site
		this.points = points
	}

	/* Generates the voronoi diagram from the set of sites 
	 * 
	 * @parameter sites : the array of sites from which we want to generate the Voronoi Diagram.
	 * 					  Each element of this array is an object with the pattern
	 						"{x,y}"
	 					  This means that for accesing the x-value of the second site you should do
	 					  	"sites[1].x"
		 	@parameter bbox :  the bounding box, used in order to define the boundaries of the outern
		 	rectangle, which defines the plane in which the points are located. It has the following pattern:
		 	
		 	bbox = {
				xl: 0,
				xr: bounding box width,
				yt: 0,
				yb: bounding box height
			};

	 	@returns an array of Voronoi faces. The points of the face are in counterclockwise order.
	 			 the faces are in the same order as the input sites (face[i] belongs to the site[i])
	 */
	compute: function(sites, bbox) {
		/* TODO */
	}
}

/* Calculates the bisector given the segment defined by the Points
p1 and p2*/
function bisector(p1, p2) {

	var mid_x = (p2.x + p1.x) / 2
	var mid_y = (p2.y + p1.y) / 2
	var slope = [(p2.y - p1.y), (p2.x - p1.x)]
	var neg_rec_slope = -slope[1] / slope[0]

	/* We use the line formula y = mx + b  to get the value b*/
	var b = mid_y - neg_rec_slope * mid_x

	var bisector = {
		slope: neg_rec_slope,
		y_axis_cut: b
	};

	return bisector;
}