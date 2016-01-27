var Voronoi;


var bboxWidth = 800
var	bboxHeight = 600
var x = 0
var y = 0


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

/* Usage: var voronoi = new Voronoi()
		  var faces = voronoi.compute(sites)
		  // The x value of the third point in the second face:
		  var point = faces[1].points[2].x
 */



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
};

var Triangle = function(points) 
{
	this.p1 = points[0]
	this.p2 = points[1]
	this.p3 = points[2]
};

var triangulation = [];

var edgesOfTriangulation = [];


Voronoi = {



		//to generate all the edges in the delaunay triangulation
		generateEdges: function(triangle)
		{ 
           var edges = [];

            var e1 = [triangle.p1, triangle.p2];
            var e2 = [triangle.p2, triangle.p3];
            var e3 = [triangle.p3, triangle.p1];

            edges = [e1, e2, e3];

            return edges;
        },


        checkIfPointsAreEqual: function(p1, p2)
        {
            return (p1[0] == p2[0]) && (p1[1] == p2[1]);
        },


        checkIfEdgesAreEqual: function(e1, e2)
        {
        	if(this.checkIfPointsAreEqual(e1[0], e2[0]) && this.checkIfPointsAreEqual(e1[1], e2[1]))
        	{
        		return true;
        	}
        	else
        	{
        		if(this.checkIfPointsAreEqual(e1[0], e2[1]) && this.checkIfPointsAreEqual(e1[1], e2[0]))
	        	{
	        		return true;
	        	}
	        	else
	        	{
	        		return false;
	        	}
        	}
        },

        removeDuplicateEdges: function(edgeList)
        {
        	var dedges = [];

        	for(var i = 0; i < edgeList.length - 1; i++)
        		for(var j = i+1; j < edgeList.length; j++)
        		{
        			if(this.checkIfEdgesAreEqual(edgeList[i], edgeList[j]))
        			{
        				dedges.push(edgeList[i]);
        			}
        		}

        	for(var k = 0; k < dedges.length; k++)
        	{
        		var index = edgeList.indexOf(dedges[k]);
        		edgeList.splice(index, 1);
        	}
        	return edgeList;
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



        getAdjacentTriangles: function(edge, triangulation)
        {
            
        	var adjVertices = [];

            for(var i = 0; i < triangulation.length; i++)
            {
              var point = this.getThirdPointAlongTheTriangle(triangulation[i], edge);
              
              if(point != null)
              {
                	adjVertices.push(point);
              }
            }
            
            
            return adjVertices;
        },



        compute_circumcenter: function(bisector1, bisector2) 
        { // the two bisector lines are y= m1x + b1 and y = m2x + b2

            var circumcenter=[];

            circumcenter[0] = (bisector2.y_axis_cut - bisector1.y_axis_cut)/(bisector1.slope - bisector2.slope); 
            // x = (b2 - b1)/(m1 - m2)
            circumcenter[1] = ( (bisector1.y_axis_cut * bisector2.slope) - (bisector2.y_axis_cut * bisector1.slope))/(bisector2.slope - bisector1.slope);
            // y= (b1*m2 - b2*m1)/m2-m1

            return circumcenter;
         },


        compute_bisector: function(p1, p2) 
        {

            var mid_x = (p2[0] + p1[0]) / 2 ;  //  p1 and p2 are 2 points, mid_x is the average of their x coordinates
            var mid_y = (p2[1] + p1[1]) / 2 ;   // mid_y is the average of their y coordinates


            var slope = [(p2[1] - p1[1]), (p2[0] - p1[0])] ; 
            var neg_rec_slope = -slope[1] / slope[0] ; 

            /*
            document.write("<br> Slope of compute_bisector" + slope);
            document.write("<br> Neg rec of compute_bisector" + neg_rec_slope);
            */

            /* We use the line formula y = mx + b  to get the value b*/
            var b = mid_y - neg_rec_slope * mid_x ;

            var bisector = {
            	slope: neg_rec_slope, //m
            	y_axis_cut: b  //b
            };
                
            return bisector;
        },


        compute_y_coordinate: function(bisector, x, x1, y1)
        { // when we have slope, x, x1 and x2. Applying formula m = (y-y1)/(x-x1)
            var m = bisector.slope;
            var y = (m*(x - x1)) + y1;
            return y;
        },


        compute_x_coordinate: function(bisector, y, x1, y1)
        {
            var m = bisector.slope;
            var x = ((y - y1)/m) + x1;
            return x;
        },


        findCircumcenter: function(p1, p2, p3) 
        {
                    
            var x1, y1 , x, y;
            var circumcenter = [];

            if(p1[1]!=p2[1] && p2[1]!=p3[1] && p3[1]!=p1[1] && p1[0]!=p2[0] && p2[0]!=p3[0] && p3[0]!=p1[0] ) {

                    var bisector1 = this.compute_bisector(p1,p2);
                    var bisector2 = this.compute_bisector(p1,p3);
                    var found_circumcenter= this.compute_circumcenter(bisector1, bisector2);
                    return found_circumcenter;
            }

            else if(p1[1]==p2[1] && p1[0]==p3[0]){ //right angled triangle
                    circumcenter[0]=(p1[0]+p2[0])/2;
                    circumcenter[1]=(p1[1]+p3[1])/2;
                    return circumcenter;
             }

            else if(p2[1]==p3[1] && p2[0]==p1[0]){ //right angled triangle
                    circumcenter[0]=(p2[0]+p3[0])/2;
                    circumcenter[1]=(p2[1]+p1[1])/2;
                    return circumcenter;
            }

            else if(p3[1]==p1[1] && p3[0]==p2[0]){ //right angled triangle
                   circumcenter[0]=(p2[0]+p3[0])/2;
                   circumcenter[1]=(p2[1]+p1[1])/2;
                   return circumcenter;
            }
            
            else if(p1[1]==p2[1] && p1[0]!=p3[0] && p2[0]!=p3[0]){
                 circumcenter[0]=(p1[0]+p2[0])/2;
                 x = circumcenter[0];
                 x1 = (p1[0]+p3[0])/2;
                 y1 = (p1[1]+p3[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p1,p3);
                 circumcenter[1] = this.compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 1 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }

             else if(p2[1]==p3[1] && p2[0]!=p1[0] && p3[0]!=p1[0]){
                 circumcenter[0]=(p2[0]+p3[0])/2;
                 x = circumcenter[0];
                 x1 = (p2[0]+p1[0])/2;
                 y1 = (p2[1]+p1[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p2,p1);
                 circumcenter[1] = this.compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 2 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }

              else if(p3[1]==p1[1] && p3[0]!=p2[0] && p1[0]!=p2[0]){
                 circumcenter[0]=(p3[0]+p1[0])/2;
                 x = circumcenter[0];
                 x1 = (p3[0]+p2[0])/2;
                 y1 = (p3[1]+p2[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p3,p2);
                 circumcenter[1] = this.compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 3 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p1[0]==p3[0] && p1[1]!=p2[1] && p3[1]!=p2[1]){
                 circumcenter[1]=(p3[1]+p1[1])/2;
                 y = circumcenter[1];
                 x1 = (p2[0]+p3[0])/2;
                 y1 = (p2[1]+p3[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p3,p2);
                 circumcenter[0] = this.compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 1. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p2[0]==p1[0] && p2[1]!=p3[1] && p1[1]!=p3[1]){
                 circumcenter[1]=(p1[1]+p2[1])/2;
                 y = circumcenter[1];
                 x1 = (p3[0]+p1[0])/2;
                 y1 = (p3[1]+p1[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p1,p3);
                 circumcenter[0] = this.compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 2. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p3[0]==p2[0] && p3[1]!=p1[1] && p2[1]!=p1[1]){
                 circumcenter[1]=(p2[1]+p3[1])/2;
                 y = circumcenter[1];
                 x1 = (p1[0]+p2[0])/2;
                 y1 = (p1[1]+p2[1])/2;
                 var bisector = {};
                 bisector = this.compute_bisector(p2,p1);
                 //document.write("The slope of bisector of "+p1+" and "+p2+"is" )
                 circumcenter[0] = this.compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 3. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }

    	},


    	removeDuplicatePoints: function(pointList)
        {
        	var dpoints = [];

        	for(var i = 0; i < pointList.length - 1; i++)
        		for(var j = i+1; j < pointList.length; j++)
        		{
        			if(this.checkIfPointsAreEqual(pointList[i], pointList[j]))
        			{
        				dpoints.push(pointList[i]);
        			}
        		}

        	for(var k = 0; k < dpoints.length; k++)
        	{
        		var index = pointList.indexOf(dpoints[k]);
        		pointList.splice(index, 1);
        	}
        	return pointList;
        },

        // Given three colinear points p, q, r, the function checks if
		// point q lies on line segment 'pr'
		 onSegment: function( p, q, r){

		    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
		        q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y))
		       return true;
		 
		    return false;
		},

 
		// To find orientation of ordered triplet (p, q, r).
		// The function returns following values
		// 0 --> p, q and r are colinear
		// 1 --> Clockwise
		// 2 --> Counterclockwise
		 orientation: function( p, q,  r){

		    var val = (q.y - p.y) * (r.x - q.x) -
		              (q.x - p.x) * (r.y - q.y);
		 
		    if (val == 0) return 0;  // colinear
		 
		    return (val > 0)? 1: 2; // clock or counterclock wise
		},

 
		// The function that returns true if line segment 'p1q1'
		// and 'p2q2' intersect.
		doIntersect: function(p1, q1, p2, q2)
		{
		    // Find the four orientations needed for general and
		    // special cases
		    var o1 = this.orientation(p1, q1, p2);
		    var o2 = this.orientation(p1, q1, q2);
		    var o3 = this.orientation(p2, q2, p1);
		    var o4 = this.orientation(p2, q2, q1);
		 
		    // General case
		    if (o1 != o2 && o3 != o4)
		        return true;
		 
		    // Special Cases
		    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
		    if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;
		 
		    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
		    if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;
		 
		    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
		    if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;
		 
		     // p2, q2 and q1 are colinear and q1 lies on segment p2q2
		    if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;
		 
		    return false; // Doesn't fall in any of the above cases
		 },


		//edge is formed by pq. bisector is the bisector of edge pq. 
		//circumcenter is the circumcenter of triangle formed by points: p or point1,q or point2 and point3

		findIntersectionPoint: function(bisector, x1 , y1, x2, y2)
		{

			//document.write("<br/>Inside intersection point: " + x1 + " " + y1 + " " + x2 + " " + y2);

			//document.write(" bisector is " + bisector.slope + " " + bisector.y_axis_cut);
		  var ip = { x : null, y : null} ;
		  var m = bisector.slope;
		  var b = bisector.y_axis_cut;

		  if(x1 == x2)
		  {
		  	//vertical line
		  	//x1 can be x or bboxwidth
		  	ip.x = x1;
		  	ip.y = m*x1 + b;
		  }

		  else
		  {
			  var m1 = (y2 - y1)/(x2 - x1);
		



		 // document.write(" m : " + m + " b: " + b + " m1 " + m1);

		  ip.x = (y1 - (m1*x1) - b)/(m - m1);
		  ip.y = (( m1 *b) - (y1 * m) + (m1 * m *x1 ) )/(m1 - m);

		  
		}

		//document.write("<br> IP is"  + ip.x + " " + ip.y + "<br>");
		  return ip;
		},


        area_of_triangle: function( x1, y1, x2, y2, x3, y3){

         return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
        },

 
        /* function to check whether point P(x, y) lies inside the triangle formed 
        by A(x1, y1), B(x2, y2) and C(x3, y3) */

     isPointInsideTriangle: function(x1, y1, x2, y2, x3, y3, x, y)
     {   

             var Area_Triangle = this.area_of_triangle(x1, y1, x2, y2, x3, y3); // Calculating the area of triangle ABC 

             var Area1 = this.area_of_triangle(x, y, x2, y2, x3, y3); // Calculating the area of triangle PBC   
                                                     
             var Area2 = this.area_of_triangle(x1, y1, x, y, x3, y3); // Calculating the area of triangle PAC   
 
             var Area3 = this.area_of_triangle(x1, y1, x2, y2, x, y); // Calculating the area of triangle PAB 
   
             return (Area_Triangle == (Area1 + Area2 + Area3)); // Checking if the sum of Area1, Area2 and Area3 is same as Area_Triangle
       }

    intersection: function(bisector, p, q, r, bbox, circumcenter)
    {
      
      var is_this_intersection_point_correct;
      var ip1 = { x : null, y : null} ;
      var ip2 = { x : null, y : null} ;
      var ip3 = { x : null, y : null} ;
      var ip4 = { x : null, y : null} ;
   
      ip1 =  this.findIntersectionPoint(bisector, bbox.xl , bbox.yb, bbox.xr, bbox.yb); // intersection with first line [xl,yb],[xr,yb] of bounding box
      ip2 =  this.findIntersectionPoint(bisector, bbox.xr , bbox.yb, bbox.xr, bbox.yt); // with second line [xr,yb],[xr,yt] of bounding box
      ip3 =  this.findIntersectionPoint(bisector, bbox.xr , bbox.yt, bbox.xl, bbox.yt); // with first line [xr,yt],[xl,yt] of bounding box
      ip4 =  this.findIntersectionPoint(bisector, bbox.xl , bbox.yt, bbox.xl, bbox.yb); // with first line [xl,yt],[xl,yb] of bounding box

     //only if line segment formed by [circumcenter, point of intersection with the edge] intersects the edge pq is the intersection point correct

      var c ={ x: circumcenter[0], y : circumcenter[1] };

      if(ip1.x !=null && ip1.y !=null && ip1.x >= x && ip1.x <= bboxWidth && ip1.y >= y && ip1.y <= bboxHeight){

      if(!isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ) {
              is_this_intersection_point_correct = !this.doIntersect(c, ip1 ,p, r ) && !this.doIntersect(c, ip1 ,q, r );
              if(is_this_intersection_point_correct) return ip1; 
         }

        if(isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ) { //circumcenter is inide the triangle pqr
              is_this_intersection_point_correct = this.doIntersect(c, ip1 ,p, q );
              if(is_this_intersection_point_correct) return ip1; 
         }  
      }

      if(ip2.x !=null && ip2.y !=null && ip2.x >= x && ip2.x <= bboxWidth && ip2.y >= y && ip2.y <= bboxHeight){

        if(!isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ){
           is_this_intersection_point_correct = !this.doIntersect(c, ip2 ,p, r ) && !this.doIntersect(c, ip2 ,q, r );
           if(is_this_intersection_point_correct) return ip2; 
       }

        if(isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ) { //circumcenter is inide the triangle pqr
              is_this_intersection_point_correct = this.doIntersect(c, ip2 ,p, q );
              if(is_this_intersection_point_correct) return ip2; 
         }


      }


      if(ip3.x !=null && ip3.y !=null && ip3.x >= x && ip3.x <= bboxWidth && ip3.y >= y && ip3.y <= bboxHeight){

       if(!isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ){
           is_this_intersection_point_correct = !this.doIntersect(c, ip3 ,p, r ) && !this.doIntersect(c, ip3 ,q, r );
           if(is_this_intersection_point_correct) return ip3; 
       }

      if(isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ) { //circumcenter is inide the triangle pqr
              is_this_intersection_point_correct = this.doIntersect(c, ip3 ,p, q );
              if(is_this_intersection_point_correct) return ip3; 
         }
      }


      if(ip4.x !=null && ip4.y !=null && ip4.x >= x && ip4.x <= bboxWidth && ip4.y >= y && ip4.y <= bboxHeight){

            if(!isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ){
              is_this_intersection_point_correct = !this.doIntersect(c, ip4 ,p, r ) && !this.doIntersect(c, ip4 ,q, r );
              if(is_this_intersection_point_correct) return ip4;  //ip is returned in object form 

            }
        
        if(isPointInsideTriangle(p.x, p.y, q.x, q.y, r.x, r.y, c.x, c.y) ) { //circumcenter is inide the triangle pqr
              is_this_intersection_point_correct = this.doIntersect(c, ip4 ,p, q );
              if(is_this_intersection_point_correct) return ip4; 
         }
      }
  }



	/* point1 is in the form [p1x,p1y] and point2 is in the form [p2x,p2y].
	boundary edge is formed by point1 and point2 */
	 getIntersectionWithBoundingBox: function(point1, point2, point3, bbox) { 

	 //document.write("<br> Points: " + point1 + " " + point2 + " " + point3);

	  var ip = { x : null, y : null} ;

	  var bisector,circumcenter_edgecases;
	  var p ={x: point1[0], y: point1[1]};
	  var q ={x: point2[0], y: point2[1]};
	  var r ={x: point3[0], y: point3[1]};

	  bisector = this.compute_bisector(point1, point2);

	  circumcenter_edgecases = this.findCircumcenter(point1, point2, point3);

	  //document.write("circumcenter " + circumcenter_edgecases);

	  ip = this.intersection(bisector, p, q, r, bbox, circumcenter_edgecases); 

	  return ip;

	},
      


    		/* Generates the voronoi diagram from the set of sites 
	 * 
	 * @parameter sites : the array of sites from which we want to generate the Voronoi Diagram.
	 * 					  Each element of this array is an object with the pattern
	 						"{x,y}"
	 					  This means that for accesing the x-value of the second site you should do
	 					  	"sites[1].x"
	 	@returns an array of Voronoi faces. The points of the face are in counterclockwise order.
	 			 the faces are in the same order as the input sites (face[i] belongs to the site[i])
	 */
	 
		compute: function(sites, bbox) {	

            if(sites.length == 0)
                return [];

			var triangulation = [];
			var VoronoiCells = [];


			for(var k = 0; k < sites.length; k++)
			{
				VoronoiCells[k] = []
				VoronoiCells[k].push([sites[k].x, sites[k].y]);
			}

			if(sites.length == 1)
			{
				VoronoiCells[0].push([bbox.xr, bbox.yt]);
                VoronoiCells[0].push([bbox.xl, bbox.yt]);
                VoronoiCells[0].push([bbox.xl, bbox.yb]);
                VoronoiCells[0].push([bbox.xr, bbox.yb]);

				return VoronoiCells;
			}

			if(sites.length == 2)
			{
				//There are only two points
				var bisector = this.compute_bisector(sites[0], sites[1]);

				var ip1 = { x : null, y : null} ;
			    var ip2 = { x : null, y : null} ;
			    var ip3 = { x : null, y : null} ;
			    var ip4 = { x : null, y : null} ;
			 
			    ip1 =  this.findIntersectionPoint(bisector, bbox.xl , bbox.yb, bbox.xr, bbox.yb); // intersection with first line [xl,yb],[xr,yb] of bounding box
			    ip2 =  this.findIntersectionPoint(bisector, bbox.xr , bbox.yb, bbox.xr, bbox.yt); // with second line [xr,yb],[xr,yt] of bounding box
			    ip3 =  this.findIntersectionPoint(bisector, bbox.xr , bbox.yt, bbox.xl, bbox.yt); // with first line [xr,yt],[xl,yt] of bounding box
			    ip4 =  this.findIntersectionPoint(bisector, bbox.xl , bbox.yt, bbox.xl, bbox.yb); // with first line [xl,yt],[xl,yb] of bounding box

			     if(ip1.x !=null && ip1.y !=null && ip1.x >= x && ip1.x <= bboxWidth && ip1.y >= y && ip1.y <= bboxHeight)
			     {
			     	VoronoiCells[0].push([ip1.x, ip1.y]);
			     	VoronoiCells[1].push([ip1.x, ip1.y]);
			     }

			   	    if(ip2.x !=null && ip2.y !=null && ip2.x >= x && ip2.x <= bboxWidth && ip2.y >= y && ip2.y <= bboxHeight){
						VoronoiCells[0].push([ip2.x, ip2.y]);
			     	VoronoiCells[1].push([ip2.x, ip2.y]);
	    			}


			    if(ip3.x !=null && ip3.y !=null && ip3.x >= x && ip3.x <= bboxWidth && ip3.y >= y && ip3.y <= bboxHeight){
			    	VoronoiCells[0].push([ip3.x, ip3.y]);
			     	VoronoiCells[1].push([ip3.x, ip3.y]);
			    }


			    if(ip4.x !=null && ip4.y !=null && ip4.x >= x && ip4.x <= bboxWidth && ip4.y >= y && ip4.y <= bboxHeight){
			    	VoronoiCells[0].push([ip4.x, ip4.y]);
			     	VoronoiCells[1].push([ip4.x, ip4.y]);
			    }

                //alert(VoronoiCells);
                return VoronoiCells;


			}


            triangulation = Delaunay.addSites(sites)

            /*
            svg = d3.select("body")
            .append("svg")
            .attr("width", 1000)
            .attr("height", 1000)
            .attr("border", 1);

            var temp = triangulation;

            for(i = 0; i < temp.length; i++)
            {
                var coordinates = temp[i].p1 + " " + temp[i].p2 + " " + temp[i].p3;
                svg.append("polygon")
                .attr("points", coordinates)
                .attr("stroke","red")
                .attr("stroke-width",2)
                .attr("fill", "none");
            }*/
    
			var edgesTr = [];

			for(var i = 0; i < triangulation.length; i++)
			{
				 var trianglesEdges = this.generateEdges(triangulation[i]);
				 edgesTr.push(trianglesEdges[0]);
				 edgesTr.push(trianglesEdges[1]);
				 edgesTr.push(trianglesEdges[2]);
			}

			edgesTr = this.removeDuplicateEdges(edgesTr);

			for(var j = 0; j <edgesTr.length; j++)
			{
				var adjP = this.getAdjacentTriangles(edgesTr[j], triangulation);

				if(adjP.length == 2)
				{
					var circ1 = this.findCircumcenter(edgesTr[j][0], edgesTr[j][1], adjP[0]),
						circ2 = this.findCircumcenter(edgesTr[j][0], edgesTr[j][1], adjP[1]);

					for(var k = 0; k < sites.length; k++)
					{
						if(this.checkIfPointsAreEqual(VoronoiCells[k][0], edgesTr[j][0]) || this.checkIfPointsAreEqual(VoronoiCells[k][0], edgesTr[j][1]))
						{
							VoronoiCells[k].push(circ1);
							VoronoiCells[k].push(circ2);
						}
					}
				}

				else
				{
					var ip = { x : null, y : null} ;
					ip = this.getIntersectionWithBoundingBox(edgesTr[j][0], edgesTr[j][1], adjP[0], bbox);
					for(var k = 0; k < sites.length; k++)
					{
						if(this.checkIfPointsAreEqual(VoronoiCells[k][0], edgesTr[j][0]) || this.checkIfPointsAreEqual(VoronoiCells[k][0], edgesTr[j][1]))
						{
							VoronoiCells[k].push([ip.x, ip.y]);
						}
					}

				}

			}

			if(sites.length == 3)
			{
                var p1 = [sites[0].x, sites[0].y],
                    p2 = [sites[1].x, sites[1].y],
                    p3 = [sites[2].x, sites[2].y];

				var circ3 = this.findCircumcenter(p1, p2, p3);

				VoronoiCells[0].push(circ3);
				VoronoiCells[1].push(circ3);
				VoronoiCells[2].push(circ3);

                console.log(VoronoiCells)
			}

			
			for(var k = 0; k< sites.length; k++)
			{
				VoronoiCells[k] = this.removeDuplicatePoints(VoronoiCells[k]);
			}

            //sitemin min sitemax max
            var minmaxl1 = this.findMinimumAndMaximumPointsAlongLine([0, 0], [800, 0], VoronoiCells),
                minmaxl2 = this.findMinimumAndMaximumPointsAlongLine([0, 0], [0, 600], VoronoiCells),
                minmaxl3 = this.findMinimumAndMaximumPointsAlongLine([0, 600], [800, 600], VoronoiCells),
                minmaxl4 = this.findMinimumAndMaximumPointsAlongLine([800, 0], [800, 600], VoronoiCells);

            for(var k = 0; k< sites.length; k++)
            {
                if(minmaxl1 != null)
                {
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl1[0]))
                    {
                        VoronoiCells.push([0, 0])
                    } 
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl1[1]))
                    {
                        VoronoiCells.push([800, 0])
                    }
                }

                if( minmaxl2 != null)
                {
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl2[0]))
                    {
                        VoronoiCells.push([0, 0])
                    }
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl2[1]))
                    {
                        VoronoiCells.push([0, 600])
                    }
                }


                if( minmaxl3 != null)
                {
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl3[0]))
                    {
                        VoronoiCells.push([0, 600])
                    }
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl3[1]))
                    {
                        VoronoiCells.push([800, 600])
                    }
                }

                if( minmaxl4 != null)
                {
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl4[0]))
                    {
                        VoronoiCells.push([800, 0])
                    }
                    if(this.checkIfPointsAreEqual(VoronoiCells[k][0], minmaxl4[1]))
                    {
                        VoronoiCells.push([800, 600])
                    }
                }
                
            }


            /*
            console.log(minmaxl1)
            console.log(minmaxl2)
            console.log(minmaxl3)
            console.log(minmaxl4)*/

			return VoronoiCells;

		},



        //p1 can be 0, 0 or 0, 600 or 800, 0
        //p2 can be 800, 0 or 0, 600 or 800, 600

        findMinimumAndMaximumPointsAlongLine: function(p1, p2, vCells)
        {
            var min, max, sitemin = [-20000, -20000], sitemax = [20000, 20000];

            if(p1[0] == p2[0])
            {
                var x = p1[0]
                //same x, this means vertical line

                min = p2[1]
                max = p1[1]

                for(var i = 0; i<vCells.length; i++)
                {
                    var siteCell = vCells[i]
                    for(var j = 1; j < siteCell.length; j++)
                    {
                        var cell = siteCell[j]
                        if(cell[0] == x )
                        {
                            if(cell[1] < min)
                            {
                                min = cell[1]
                                sitemin = siteCell[0]
                            }

                            if(cell[1] > max)
                            {
                                max = cell[1]
                                sitemax = siteCell[0]
                            }
                        }

                    }
                }
            }
            else
            {
                //same y, this means horizontal line
                var y = p1[1]

                min = p2[0]
                max = p1[0]

                for(var i = 0; i<vCells.length; i++)
                {
                    var siteCell = vCells[i]
                    for(var j = 1; j < siteCell.length; j++)
                    {
                        var cell = siteCell[j]
                        if(cell[1] == y )
                        {
                            if(cell[0] < min)
                            {
                                min = cell[0]
                                sitemin = siteCell[0]
                            }

                            if(cell[0] > max)
                            {
                                max = cell[0]
                                sitemax = siteCell[0]
                            }
                        }

                    }
                }
            }

            return [sitemin, sitemax]
        }

}

