          
            var  boundingboxwidth = 100;
            var  boundingboxheight = 100;

            var triangles = [[[3,3],[2,1],[1,2]], [[3,3],[4,5],[5,2]],
            [[2,4],[1,2],[3,3]],
            [[4,5],[2,4],[3,3]],
            [[3,3],[3,1],[5,2]],
            [[6,5],[4,5],[5,2]],
            [[3,3],[2,1],[3,1]]];

            

            bbox = {
              xl: 0,
              xr: boundingboxwidth,
              yt: 0,
              yb: boundingboxheight
            };
             document.write("blah blah1");

            	var edges = []; //initializing an array of all edges in the delaunay triangulation
            	var alreadySearched = [[]]; //initializing an array of already searched points
                 //alreadySearched.length=1;
            	var sites = []; //initializing an array of sites (voronoi cells)
            	var edge =[] ;// referring to each edge in the delaunay triangulation
            	var point =[] ; // to refer to each point in the delaunay triangulation
            	var adjacent = [] ; // list of adjacent vertices to a point (vertices that share an edge with this point)
              var segment = [];

              for(triangle of triangles){ 
                 //STEP 1: for each triangle in the triangulation, we call function generateEdges as we want a list of edges in the triangulation
                 edges = edges.concat(edges, generateEdges(triangle)); // edges (list of all edges) = edges + the_edges(edges of 1 triangle)
            	} 

            //STEP 2: For each point of each edge, we find its adjacent points. Then, we store the point and its adjacent points in site. The function contained checks if starting point Va of edge has not already been searched. If point has already been searched for its adjacent vertices(neighbours), it will be present in the list alreadySearched

            var z=0;
            

            for( var i = 0 ; i < edges.length ; i++){ 

                	edge = edges[i]; //edge:  [[3,3],[1,2]] = [Va,Vb]. Edges is the list of edges

                   if( !contained(alreadySearched, edge[0]) ) { 

                		point = edge[0]; //Va =[x,y]
                		adjacent = getAdjacentPoints(point, edges);
                      //document.write("point is: " +point);
                		alreadySearched.push(point); //since we have already searched for the neighbours of this point, we push it in already searched their neigbours' list of points.
                		sites[z]=[];
                    sites[z].push(point); // siteS contains a point and its adjacent vertices

                      for( var k=0; k< adjacent.length ; k++)
                         sites[z].push(adjacent[k]);

                      z++;
                   }  


                }


              /*Step 3: for each point, we find the circumcenters of all the triangles around that point. we return the circumcenters in counterclockwise order

              final output is VoronoiCells. below, point/site refers to each point from the delaunay triangulation

              VoronoiCells = [[point/site1, VoronoiVertex1.1, VoronoiVertex1.2, VoronoiVertex1.3, so on],[point/site2, VoronoiVertex2.1, VoronoiVertex2.2, VoronoiVertex2.3, ...],[point/site3, VoronoiVertex3.1, VoronoiVertex3.2, VoronoiVertex3.3, ...]]
                 
              */
              document.write("blah blah2");

                 var point = []; // the site point
                 var point1 = []; // point1 and point2 form a triangle with site point
                 var point2 = [];
                 var thirdVertex = [];
                 var indexOfPoint1 = 0;
                 var startingVertex = [];
                 var chosen = [];
                 var test = 0;
                 var c = [];
                 var VoronoiCells = [];
                 var AdjacentVertices = [];
                 var number_adjacentvertices;
                 var firstEdge = [];
                 var secondEdge = [];
                 var isLeft;
                 var isRight;

                 var x;
                 var y;
                 var  va_xvalue;
                 var  va_yvalue;
                 var  vb_yvalue;
                 var vb_xvalue;
                

               /* for(var r =  0 ; r < sites.length ; r++) {

                   point[0] = sites[r][0][0];
                   point[1] = sites[r][0][1];
                   VoronoiCells[r] = [];
                   VoronoiCells[r].push(point);
                   //document.write("site point is:"+point);
                   AdjacentVertices=[];
                   number_adjacentVerticesOfPoint=sites[r].length;

                   for(var m = 1; m < number_adjacentVerticesOfPoint; m++ ){
                     AdjacentVertices.push(sites[r][m]);   
                  }

                  chosen[0] = AdjacentVertices[0][0]; //chosen first adjacent Vertice of point
                  chosen[1] = AdjacentVertices[0][1]; 
                   // document.write("\nfirst adjacent vertex chosen is :   "+chosen);

                       if(AdjacentVertices.length < 1){ // this will happen if there is only one point or zero points.
                        test = 1;
                        VoronoiCells[r].push([bbox.xr, bbox.yt]);
                        VoronoiCells[r].push([bbox.xl, bbox.yt]);
                        VoronoiCells[r].push([bbox.xl, bbox.yb]);
                        VoronoiCells[r].push([bbox.xr, bbox.yb]); // pushing the bounding box vertices in the VoronoiCells
                        }

                      if(AdjacentVertices.length ==1){ // this will happen if there is no triangle yet. A point has only one adjacent point.
                           test = 1; // need to make a line and see where it intersects the bounding box, those two intersection points shall be pushed in for both the voronoi cells sites
                           var bisector_twopoints = compute_bisector(point,chosen);
                       }

                        
                        var nextvertices =[];

                       while(AdjacentVertices.length >=1){
                       
                           firstEdge = [point,chosen];
                          // document.write("\n firstEdge is :"+firstEdge+"\n");
                           point1[0] = chosen[0];
                           point1[1] = chosen[1];
                            //document.write("\n  point1 is :"+chosen+"\n");
                           //find the triangle(s) that contain both the points: point and chosen
                           nextvertices =[];
                           nextvertices[0]=[];
                           nextvertices[1]=[]; 

                           nextvertices[0].push(-20000);
                           nextvertices[0].push(-20000);
                           nextvertices[1].push(-20000);
                           nextvertices[1].push(-20000);

                           //document.write("\n nextvertice[0] is :"+nextvertices[1][0]+"nextvertice[1] is :"+nextvertices[1]+"\n");

                           //document.write("\n firstEdge is :"+firstEdge+"\n");
                          
                           nextvertices[0][0] = getAdjacentTriangles(firstEdge)[0][0];
                           nextvertices[0][1] = getAdjacentTriangles(firstEdge)[0][1];
                           nextvertices[1][0] = getAdjacentTriangles(firstEdge)[1][0];
                           nextvertices[1][1] = getAdjacentTriangles(firstEdge)[1][1];

                          // document.write("\n After getAdjacentTriangles is implemented on firstEdge, nextvertice[0] is : "+nextvertices[0]+" AND nextvertice[1] is :"+nextvertices[1]+"\n");


                            
                           if((nextvertices[0][0]!= -20000) && (nextvertices[0][1]!= -20000) && 
                              (nextvertices[1][0]!=-20000) && (nextvertices[1][1]!=-20000) ){
                            
          
                            va_xvalue = firstEdge[0][0]; //setting vertex Va to object so to be passed to positionFromSegment function
                            va_yvalue = firstEdge[0][1];

                            vb_xvalue = firstEdge[1][0]; //setting vertex Vb to object so to be passed to positionFromSegment function
                            vb_yvalue = firstEdge[1][1];

                            xvalue = nextvertices[0][0];
                            yvalue = nextvertices[0][1];

                            isRight = positionFromSegment({x: xvalue, y: yvalue} , {va: {x: va_xvalue, y: va_yvalue}, vb: {x: vb_xvalue, y: vb_yvalue}});

                            if( isRight==1 ){ 
                               secondEdge = [ point, nextvertices[0] ];
                               thirdVertex[0] = nextvertices[0][0];
                               thirdVertex[1] = nextvertices[0][1]; 
                               
                            }

                            else if( isRight != 1) {
                              xvalue = nextvertices[1][0];
                              yvalue = nextvertices[1][1];
                         
                              isRight = positionFromSegment({x: xvalue, y: yvalue} , {va: {x: va_xvalue, y: va_yvalue}, vb: {x: vb_xvalue, y: vb_yvalue}});
                              
                              if( isRight == 1 ) { 
                               secondEdge = [ point, nextvertices[1] ];
                               thirdVertex[0] = nextvertices[1][0];
                               thirdVertex[1] = nextvertices[1][1]; 
                              // document.write("\n thirdVertex is :"+ thirdVertex +"\n"); 
                      
                              }
                              
                         } //finishes  elseif( isRight !=1)
                      }
                         
                      else if(nextvertices[0][0]!=-20000 && nextvertices[0][1]!=-20000 && 
                              nextvertices[1][0]==-20000 && nextvertices[1][1]==-20000){
                           //if you retrieve only one one entry in nextvertices, that is the next vertice
                           
                           thirdVertex[0] = nextvertices[0][0]; 
                           thirdVertex[1] = nextvertices[0][1]; 
                           secondEdge = [ point, thirdVertex ];
                        }

                     else if(nextvertices[0][0]==-20000 && nextvertices[0][1]==-20000 && 
                              nextvertices[1][0]==-20000 && nextvertices[1][1]==-20000){
                            //you are done  as you dont receive any vertex
                         }
                        

                         point2[0] = thirdVertex[0];
                         point2[1] = thirdVertex[1];
                        
                          
                         //document.write("\npoint is : "+point+" and point 1 is: "+point1 +" and point2 is: "+point2+"\n");
                         c = findCircumcenter(point, point1, point2);
                          VoronoiCells[r].push(c);
                          //copying value of secondEdge to firstEdge by setting chosen as thirdVertex

                          chosen[0]=thirdVertex[0];
                          chosen[1]=thirdVertex[1];
      
                          //deleting point1. Chosen will now be point1
                         indexOfPoint1 = findIndex(point1,AdjacentVertices);
                         AdjacentVertices.splice(indexOfPoint1,1);

                   }
                }
                */

                //document.write();
                
document.write("blah blah3");
//var ip = { x : null, y : null} ;
var p1 ={x:1, y:2};
var q1 ={x:3, y:3};
var p2 ={x:3, y:1};
var q2 ={x:5, y:2};
var t = doIntersect(p1, q1, p2, q2);
document.write("\n value of t is: "+t);
 //var ip = { x : 19, y : 19} ;

    var ip = getIntersectionWithBoundingBox([3,1], [5,2], [3,3], bbox);
document.write("\n value of ip.x is: "+ ip.x +" and ip.y is : "+ip.y);

            

               //FUNCTIONS


            	function generateEdges(triangle){ //to generate all the edges in the delaunay triangulation
            		var the_edges = [];
                var segment = [];
                var a,b,c ;        
                a = triangle[0];  //the point a=[x,y]of a triangle abc
            		b = triangle[1];  //the point b of triangle abc
            		c = triangle[2];  //the point c of triangle abc

                segment= [a, b];
                the_edges.push(segment);

                segment= [b, c];
                the_edges.push(segment);

                segment= [c, a];
                the_edges.push(segment);

        
                return the_edges;  //the_edges contains the three edges ab, bc and ca of triangle abc
                   }


            	function contained(arr, p){ //checks if point [x,y] is present in array arr [[x1,y1],[x1,y1],[x1,y1]]

                 for( var j = 0 ; j < arr.length ; j++){
                  if( (p[0] == arr[j][0]) && (p[1] == arr[j][1]) ) return true;
               }
               return false;

            }



            function findIndex(point , arrayofpoints){
             for(var a =0; a < arrayofpoints.length ; a++){
               if(point[0] == arrayofpoints[a][0] && point[1] == arrayofpoints[a][1]) return a;
            }
            return -1;

            }





            	function getAdjacentPoints(point , edges){ //to find the adjacent vertices of point from the list of all edges in the triangulation
            		var adjPoints = [];
                var e;

                for(e of edges){

                  if(e[0][0]==point[0] && e[0][1]==point[1] && !contained(adjPoints,e[1])) adjPoints.push(e[1]); 
            			// if the edge's starting point edge[0] is same as the point being considered, then the ending point edge[1] of edge is adjacent vertice of point.
            			else if(e[1][0]==point[0] && e[1][1]==point[1] && !contained(adjPoints,e[0])) adjPoints.push(e[0]);
            		}
                return adjPoints;
             }




                 /* Given a point and a segment, determines in which side of the segment such point is located
                    @return    -1 if the point is on the left side of the segment
                  *             0 if the point is on the segment
                  *            +1 if the point is on the right side of the segment
                       function positionFromSegment(point, segment) {
                      var pa = segment[0];
                      var pb = segment[1];
                      var determinant = (pb[0] - pa[0]) * (point[1] - pa[1]) - (pb[1] - pa[1]) * (point[1] - pa[1]);
                      return Math.sign(determinant);
                   } */

                   function positionFromSegment(point, segment){

                    var pa = segment.va;
                    var pb = segment.vb;

                    var determinant = (pb.x - pa.x) * (point.y - pa.y) - (pb.y - pa.y) * (point.x - pa.x) ;

                    return Math.sign(determinant);
                 }




                 function findCircumcenter(p1, p2, p3) {
                    //document.write("\n The points given for finding circumcenter are = p1: "+p1+"  p2: "+p2+"  p3: "+p3+"\n");
                    var x1, y1 , x, y;
                    var circumcenter = [];

                    if(p1[1]!=p2[1] && p2[1]!=p3[1] && p3[1]!=p1[1] && p1[0]!=p2[0] && p2[0]!=p3[0] && p3[0]!=p1[0] ) {

                      var bisector1 = compute_bisector(p1,p2);
                      var bisector2 = compute_bisector(p1,p3);
                      var found_circumcenter= compute_circumcenter(bisector1, bisector2);
                     // document.write(" \n Normal Case, found circumcenter: "+found_circumcenter+"\n \n");
                      return found_circumcenter;
                   }

                   else if(p1[1]==p2[1] && p1[0]==p3[0]){ //right angled triangle
                      circumcenter[0]=(p1[0]+p2[0])/2;
                      circumcenter[1]=(p1[1]+p3[1])/2;
                      //document.write(" \n Right angled triangle case 1, found circumcenter: "+circumcenter+"\n \n");
                      return circumcenter;
                   }

                   else if(p2[1]==p3[1] && p2[0]==p1[0]){ //right angled triangle
                      circumcenter[0]=(p2[0]+p3[0])/2;
                      circumcenter[1]=(p2[1]+p1[1])/2;
                      //document.write(" \n Right angled triangle case 2, found circumcenter: "+circumcenter+"\n \n");
                      return circumcenter;
                   }

                  else if(p3[1]==p1[1] && p3[0]==p2[0]){ //right angled triangle
                   circumcenter[0]=(p2[0]+p3[0])/2;
                   circumcenter[1]=(p2[1]+p1[1])/2;
                   //document.write(" \n Right angled triangle case 3, found circumcenter: "+circumcenter+"\n \n");
                   return circumcenter;
                }
                else if(p1[1]==p2[1] && p1[0]!=p3[0] && p2[0]!=p3[0]){
                 circumcenter[0]=(p1[0]+p2[0])/2;
                 x = circumcenter[0];
                 x1 = (p1[0]+p3[0])/2;
                 y1 = (p1[1]+p3[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p1,p3);
                 circumcenter[1] = compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 1 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p2[1]==p3[1] && p2[0]!=p1[0] && p3[0]!=p1[0]){
                 circumcenter[0]=(p2[0]+p3[0])/2;
                 x = circumcenter[0];
                 x1 = (p2[0]+p1[0])/2;
                 y1 = (p2[1]+p1[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p2,p1);
                 circumcenter[1] = compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 2 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p3[1]==p1[1] && p3[0]!=p2[0] && p1[0]!=p2[0]){
                 circumcenter[0]=(p3[0]+p1[0])/2;
                 x = circumcenter[0];
                 x1 = (p3[0]+p2[0])/2;
                 y1 = (p3[1]+p2[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p3,p2);
                 circumcenter[1] = compute_y_coordinate(bisector, x, x1, y1);
                 //document.write(" \n 2 points have same y coordinate, case 3 found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p1[0]==p3[0] && p1[1]!=p2[1] && p3[1]!=p2[1]){
                 circumcenter[1]=(p3[1]+p1[1])/2;
                 y = circumcenter[1];
                 x1 = (p2[0]+p3[0])/2;
                 y1 = (p2[1]+p3[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p3,p2);
                 circumcenter[0] = compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 1. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p2[0]==p1[0] && p2[1]!=p3[1] && p1[1]!=p3[1]){
                 circumcenter[1]=(p1[1]+p2[1])/2;
                 y = circumcenter[1];
                 x1 = (p3[0]+p1[0])/2;
                 y1 = (p3[1]+p1[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p1,p3);
                 circumcenter[0] = compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 2. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }
              else if(p3[0]==p2[0] && p3[1]!=p1[1] && p2[1]!=p1[1]){
                 circumcenter[1]=(p2[1]+p3[1])/2;
                 y = circumcenter[1];
                 x1 = (p1[0]+p2[0])/2;
                 y1 = (p1[1]+p2[1])/2;
                 var bisector = {};
                 bisector = compute_bisector(p2,p1);
                 //document.write("The slope of bisector of "+p1+" and "+p2+"is" )
                 circumcenter[0] = compute_x_coordinate(bisector, y, x1, y1);
                 //document.write(" \n 2 points have same x coordinate, case 3. Found circumcenter: "+circumcenter+"\n \n");
                 return circumcenter;
              }

            }



                 function compute_y_coordinate(bisector, x, x1, y1){ // when we have slope, x, x1 and x2. Applying formula m = (y-y1)/(x-x1)
                    var m = bisector.slope;
                    var y = (m*(x - x1)) + y1;
                    return y;
                 }




                 function compute_x_coordinate(bisector, y, x1, y1){
                    var m = bisector.slope;
                    var x = ((y - y1)/m) + x1;
                    return x;
                 }




                 function compute_bisector(p1, p2) {

            		var mid_x = (p2[0] + p1[0]) / 2 ;  //  p1 and p2 are 2 points, mid_x is the average of their x coordinates
            		var mid_y = (p2[1] + p1[1]) / 2 ;   // mid_y is the average of their y coordinates


                  var slope = [(p2[1] - p1[1]), (p2[0] - p1[0])] ; 
                  var neg_rec_slope = -slope[1] / slope[0] ; 

                  /* We use the line formula y = mx + b  to get the value b*/
                  var b = mid_y - neg_rec_slope * mid_x ;

                  var bisector = {
            	   	slope: neg_rec_slope, //m
            	  	y_axis_cut: b  //b
            	  };
                
                return bisector;
             }





            function compute_circumcenter(bisector1, bisector2) { // the two bisector lines are y= m1x + b1 and y = m2x + b2

               var circumcenter=[];
               circumcenter[0] = (bisector2.y_axis_cut - bisector1.y_axis_cut)/(bisector1.slope - bisector2.slope); // x = (b2 - b1)/(m1 - m2)
               circumcenter[1] = ( (bisector1.y_axis_cut * bisector2.slope) - (bisector2.y_axis_cut * bisector1.slope))/(bisector2.slope - bisector1.slope);
                // y= (b1*m2 - b2*m1)/m2-m1

               return circumcenter;
            }


      function checkIfPointsAreEqual(p1, p2){

             //document.write("\ninside : p1 "+p1);
            //document.write("\ninside , p2: "+p2);
            return (p1[0] == p2[0]) && (p1[1] == p2[1]);
          }



       function getThirdPointAlongTheTriangle(tr, edge)
          { 
            //document.write("\ninside getThirdPointAlongTheTriangle: edge "+edge);
            //document.write("\ninside getThirdPointAlongTheTriangle, tr: "+tr);
            //document.write(tr[0]);

            if(this.checkIfPointsAreEqual(tr[0], edge[0]))
            {
              if(this.checkIfPointsAreEqual(tr[1], edge[1])) return tr[2];
              else{
                if(this.checkIfPointsAreEqual(tr[2], edge[1])) return tr[1];
                else return null;
              }
            }
            else
            {
              if(this.checkIfPointsAreEqual(tr[1], edge[0]))
              {
                if(this.checkIfPointsAreEqual(tr[0], edge[1])) return tr[2];
                else
                {
                  if(this.checkIfPointsAreEqual(tr[2], edge[1])) return tr[0];
                  else return null;
                }
              }
              else
              {
                if(this.checkIfPointsAreEqual(tr[2], edge[0]))
                {
                  if(this.checkIfPointsAreEqual(tr[0], edge[1])) return tr[1];
                  else
                  {
                    if(this.checkIfPointsAreEqual(tr[1], edge[1])) return tr[0];
                    else return null;
                  }
                }
                else
                {
                  return null;
                }
              }
            }
          }



           function getAdjacentTriangles(edge)
          {
            
            var the_third_Vertex = [];
            for(var i = 0; i < triangles.length; i++)
            {
              var point = this.getThirdPointAlongTheTriangle(triangles[i], edge);
              
              if(point != null)
              {
                the_third_Vertex.push(point);
              }
            }
            
            
            return the_third_Vertex;
          }

// Given three colinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment( p,  q, r){

    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
        q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y))
       return true;
 
    return false;
}
 
// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
 function orientation( p, q,  r){

    var val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);
 
    if (val == 0) return 0;  // colinear
 
    return (val > 0)? 1: 2; // clock or counterclock wise
}
 
// The function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2)
{
    // Find the four orientations needed for general and
    // special cases
    var o1 = orientation(p1, q1, p2);
    var o2 = orientation(p1, q1, q2);
    var o3 = orientation(p2, q2, p1);
    var o4 = orientation(p2, q2, q1);
 
    // General case
    if (o1 != o2 && o3 != o4)
        return true;
 
    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;
 
    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
 
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
 
     // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;
 
    return false; // Doesn't fall in any of the above cases
 }

//edge is formed by pq. bisector is the bisector of edge pq. 
//circumcenter is the circumcenter of triangle formed by points: p or point1,q or point2 and point3

  function findIntersectionPoint(bisector, x1 , y1, x2, y2){

  var ip = { x : null, y : null} ;
  var m = bisector.slope;
  var b = bisector.y_axis_cut;
  var m1 = (y2 - y1)/(x2 - x1);
  ip.x = (y1 - (m1*x1) - b)/(m - m1);
  ip.y = (( m1 *b) - (y1 * m) + (m1 * m *x1 ) )/(m1 - m);
  return ip;
  }


  function intersection(bisector, p, q, bbox, circumcenter){
    
    var is_this_intersection_point_correct;
    var ip1 = { x : null, y : null} ;
    var ip2 = { x : null, y : null} ;
    var ip3 = { x : null, y : null} ;
    var ip4 = { x : null, y : null} ;
 
    ip1 =  findIntersectionPoint(bisector, bbox.xl , bbox.yb, bbox.xr, bbox.yb); // intersection with first line [xl,yb],[xr,yb] of bounding box
    ip2 =  findIntersectionPoint(bisector, bbox.xr , bbox.yb, bbox.xr, bbox.yt); // with second line [xr,yb],[xr,yt] of bounding box
    ip3 =  findIntersectionPoint(bisector, bbox.xr , bbox.yt, bbox.xl, bbox.yt); // with first line [xr,yt],[xl,yt] of bounding box
    ip4 =  findIntersectionPoint(bisector, bbox.xl , bbox.yt, bbox.xl, bbox.yb); // with first line [xl,yt],[xl,yb] of bounding box
    
    document.write(ip1.x + " " + ip1.y + "\n");

    document.write(ip2.x + " " + ip2.y + "\n");
    document.write(ip3.x + " " + ip3.y + "\n");
    document.write(ip4.x + " " + ip4.y + "\n");
    //only if line segment formed by [circumcenter, point of intersection with the edge] intersects the edge pq is the intersection point correct

    var c ={ x: circumcenter[0], y : circumcenter[1] };

    if(ip1.x !=null && ip1.y !=null ){
    is_this_intersection_point_correct = doIntersect(c, ip1 ,p, q );
    if(is_this_intersection_point_correct) return ip1; 
    }

    if(ip2.x !=null && ip2.y !=null ){
    is_this_intersection_point_correct = doIntersect(c, ip2 ,p, q );
    if(is_this_intersection_point_correct) return ip2; 
    }


    if(ip3.x !=null && ip3.y !=null ){
    is_this_intersection_point_correct = doIntersect(c, ip3 ,p, q );
    if(is_this_intersection_point_correct) return ip3; 
    }


    if(ip4.x !=null && ip4.y !=null ){
    is_this_intersection_point_correct = doIntersect(c, ip4 ,p, q );
    if(is_this_intersection_point_correct) return ip4;  //ip is returned in object form 
    }
  }

/* point1 is in the form [p1x,p1y] and point2 is in the form [p2x,p2y].
boundary edge is formed by point1 and point2 */
function getIntersectionWithBoundingBox(point1, point2, point3, bbox) { 

  var ip = { x : null, y : null} ;
  //document.write("\n inside getIntersectionWithBoundingBox \n");

  var bisector,circumcenter_edgecases;
  var p ={x: point1[0], y: point1[1]};
  var q ={x: point2[0], y: point2[1]};
  bisector = compute_bisector(point1, point2);
  circumcenter_edgecases = findCircumcenter(point1, point2, point3);
  //document.write(bisector + "circumcenter edges " + circumcenter_edgecases);
   ip = intersection(bisector, p, q, bbox, circumcenter_edgecases); 
   document.write("\n inside getIntersectionWithBoundingBox \n" + ip.x + " "+ip.y);
   return ip;

   } 
       

