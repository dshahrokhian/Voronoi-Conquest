var  boundingboxwidth = 100;
      var  boundingboxheight = 100;

      var triangles = [[[3,3],[2,1],[1,2]],
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
                //document.write("                       point is: " +point);
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
          // document.write("   SITES:   "+ sites);
           var point = []; // the site point
           var point1 = []; // point1 and point2 form a triangle with site point
           var point2 = [];
           var indexOfChosen = 0;
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

         /* isRight = positionFromSegment({x: 3 , y:1 } , {va: {x: 3, y: 3}, vb: {x: 2, y: 1}}); // 
          isLeft = positionFromSegment({x: 3, y: 1} , {va: {x: 3, y: 3}, vb: {x: 2, y: 4}});
          document.write("\nisleft is "+isLeft +" and isRight is"+isRight+"\n\n") */

          for(var r =  0 ; r < sites.length ; r++) {

             point = sites[r][0];
             VoronoiCells[r] = [];
             VoronoiCells[r].push(point);
             document.write("    site is:   "+VoronoiCells);
             AdjacentVertices=[];
             number_adjacentvertices=sites[r].length;

             for(var m = 1; m < number_adjacentvertices; m++ ){
               AdjacentVertices.push(sites[r][m]);
               //document.write("    adjacent vertices are :   "+ AdjacentVertices);
            }

            startingVertex = AdjacentVertices[0];
            chosen = AdjacentVertices[0];

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
                     //var intersectingPoints = findIntersectionWithBoundingBox(bisector_twopoints, [[xr][yt]],[[xl][yt]],[[xl][yb]],[[xr][yb]]); 
                    // make function findIntersectionWithBoundingBox
                 }

                 var nextvertices =[[],[]];
                 var x;
                 var y;
                 var  va_xvalue;
                 var  va_yvalue;
                 var  vb_yvalue;
                 var vb_xvalue;
                    searchTrianglesForNextVertices([3,3], [2,1], nextvertices);
                    document.write("\n HERE EEEEEE \n \n \nAfter searchtriangles has been done: \n nextvertices[0] is now"+nextvertices[0]+"\n");
                     document.write("\n and nextvertices[1] is now"+nextvertices[1]+"\n");


                 while(AdjacentVertices.length >1){
                     firstEdge = [point,chosen];
                     document.write("\n firstEdge is :"+firstEdge+"Chosen is :"+chosen+"\n");
                     point1[0] = chosen[0];
                     point1[1] = chosen[1];
                     //find the triangle(s) that contain both the points: point and chosen

                     nextvertices[0][0]= -50000;
                     nextvertices[0][1]= -50000;
                     nextvertices[1][0] = -50000;
                     nextvertices[1][1] = -50000;

                     searchTrianglesForNextVertices(point, chosen, nextvertices);
                     //document.write("\n nextvertice[0] is :"+nextvertices[0]+"nextvertice[1] is :"+nextvertices[1]+"\n");

                     if(nextvertices[0][0]!=-50000 && nextvertices[0][1]!=-50000 && 
                        nextvertices[1][0]!=-50000 && nextvertices[1][1]!=-50000){
                      //if nextvertices.length>1, then you must choose the next vertice. Choose the vertice that is right to firstEdge
    
                      va_xvalue = firstEdge[0][0];
                      va_yvalue = firstEdge[0][1];
                      vb_xvalue = firstEdge[1][0];
                      vb_yvalue = firstEdge[1][1];

                      xvalue = nextvertices[0][0];
                      yvalue = nextvertices[0][1];

                      isRight = positionFromSegment({x: xvalue, y: yvalue} , {va: {x: va_xvalue, y: va_yvalue}, vb: {x: vb_xvalue, y: vb_yvalue}});

                      if( isRight==1 ){ 
                         secondEdge = [ point, nextvertices[0] ];
                         chosen[0] = nextvertices[0][0];
                         chosen[1] = nextvertices[0][1]; 
                         document.write("\n chosen is :"+ chosen +"\n"); 
                      }

                      else if( isRight != 1) {
                        xvalue = nextvertices[1][0];
                        yvalue = nextvertices[1][1];
                   
                        isRight = positionFromSegment({x: xvalue, y: yvalue} , {va: {x: va_xvalue, y: va_yvalue}, vb: {x: vb_xvalue, y: vb_yvalue}});
                        
                        if( isRight == 1 ) { 
                         secondEdge = [ point, nextvertices[1] ];
                         chosen[0] = nextvertices[1][0];
                         chosen[1] = nextvertices[1][1]; 
                
                        }
                   } //finishes  elseif( isRight !=1)
                }
                   
                else if(nextvertices[0][0]!=-50000 && nextvertices[0][1]!=-50000 && 
                        nextvertices[1][0]==-50000 && nextvertices[1][1]==-50000){
                     //if you retrieve only one one entry in nextvertices, that is the next vertice
                     secondEdge = [ point, nextvertices[0] ];
                     document.write("\n only found one nextvertice> second edge is :"+ secondEdge +"\n");
                     chosen[0] = nextvertices[0][0]; 
                     chosen[1] = nextvertices[0][1]; 
                        // document.write("\n c Chosen is: "+chosen);
                  }

               else if(nextvertices[0][0]==-50000 && nextvertices[0][1]==-50000 && 
                        nextvertices[1][0]==-50000 && nextvertices[1][1]==-50000){
                      //you are done 
                   }


                   indexOfChosen = findIndex(point1,AdjacentVertices);
                   AdjacentVertices.splice(indexOfChosen,1); //deleting the first point in AdjacentVertices

                   point2[0] = chosen[0];
                   point2[1] = chosen[1];
                    document.write("\n chosen should be going to point2. Chosen is: "+chosen+" and point2 is: "+point2+"\n");
                   document.write("\npoint is : "+point+" and point 1 is: "+point1 +" and point2 is: "+point2+"\n");
                   c = findCircumcenter(point, point1, point2);
                   VoronoiCells[r].push(c);
                         // document.write("      and CORRECT circumcenter is : "+c);

                /*if(AdjacentVertices.length == 1 && test == 0){ //to handle the last adjacent point and connect it to the starting vertex to form a triangle
                   c = findCircumcenter(point, AdjacentVertices[0], startingVertex);
                   VoronoiCells[r].push(c);}*/

             }
          }

      //document.write("  \n  and VoronoiCell vertices for site 1 are  \n: "+VoronoiCells[0]+ "\n");
      /*document.write("  \n  and VoronoiCell vertices for site 2 are  \n: "+VoronoiCells[1]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 3 are  \n: "+VoronoiCells[2]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 4 are  \n: "+VoronoiCells[3]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 5 are  \n: "+VoronoiCells[4]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 6 are  \n: "+VoronoiCells[5]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 7 are  \n: "+VoronoiCells[6]+ "\n");
      document.write("  \n  and VoronoiCell vertices for site 8 are  \n: "+VoronoiCells[7]+ "\n"); */


      //findCircumcenter([3,3], [4,5], [2,1]);

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

                //document.write("                               ");
               //document.write(the_edges);
               //document.write("                               ");
               //document.write("                               ");
               //there are repeated edges because some edges are shared between two triangles

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
              document.write("\n The points given for finding circumcenter are = p1: "+p1+"  p2: "+p2+"  p3: "+p3+"\n");
              var x1, y1 , x, y;
              var circumcenter = [];

              if(p1[1]!=p2[1] && p2[1]!=p3[1] && p3[1]!=p1[1] && p1[0]!=p2[0] && p2[0]!=p3[0] && p3[0]!=p1[0] ) {

                var bisector1 = compute_bisector(p1,p2);
                var bisector2 = compute_bisector(p1,p3);
                var found_circumcenter= compute_circumcenter(bisector1, bisector2);
                document.write(" \n Normal Case, found circumcenter: "+found_circumcenter+"\n \n");
                return found_circumcenter;
             }

             else if(p1[1]==p2[1] && p1[0]==p3[0]){ //right angled triangle
                circumcenter[0]=(p1[0]+p2[0])/2;
                circumcenter[1]=(p1[1]+p3[1])/2;
                document.write(" \n Right angled triangle case 1, found circumcenter: "+circumcenter+"\n \n");
                return circumcenter;
             }

             else if(p2[1]==p3[1] && p2[0]==p1[0]){ //right angled triangle
                circumcenter[0]=(p2[0]+p3[0])/2;
                circumcenter[1]=(p2[1]+p1[1])/2;
                document.write(" \n Right angled triangle case 2, found circumcenter: "+circumcenter+"\n \n");
                return circumcenter;
             }

            else if(p3[1]==p1[1] && p3[0]==p2[0]){ //right angled triangle
             circumcenter[0]=(p2[0]+p3[0])/2;
             circumcenter[1]=(p2[1]+p1[1])/2;
             document.write(" \n Right angled triangle case 3, found circumcenter: "+circumcenter+"\n \n");
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
           document.write(" \n 2 points have same y coordinate, case 1 found circumcenter: "+circumcenter+"\n \n");
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
           document.write(" \n 2 points have same y coordinate, case 2 found circumcenter: "+circumcenter+"\n \n");
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
           document.write(" \n 2 points have same y coordinate, case 3 found circumcenter: "+circumcenter+"\n \n");
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
           document.write(" \n 2 points have same x coordinate, case 1. Found circumcenter: "+circumcenter+"\n \n");
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
           document.write(" \n 2 points have same x coordinate, case 2. Found circumcenter: "+circumcenter+"\n \n");
           return circumcenter;
        }
        else if(p3[0]==p2[0] && p3[1]!=p1[1] && p2[1]!=p1[1]){
           circumcenter[1]=(p2[1]+p3[1])/2;
           y = circumcenter[1];
           x1 = (p1[0]+p2[0])/2;
           y1 = (p1[1]+p2[1])/2;
           var bisector = {};
           bisector = compute_bisector(p2,p1);
           document.write("The slope of bisector of "+p1+" and "+p2+"is" )
           circumcenter[0] = compute_x_coordinate(bisector, y, x1, y1);
           document.write(" \n 2 points have same x coordinate, case 3. Found circumcenter: "+circumcenter+"\n \n");
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
          /*   document.write("bisector_slope: "+bisector.slope);
          document.write('     ');
          document.write("bisector_yaxiscut: "+bisector.y_axis_cut);
          document.write('     '); */
          
          return bisector;
       }





      function compute_circumcenter(bisector1, bisector2) { // the two bisector lines are y= m1x + b1 and y = m2x + b2

         var circumcenter=[];
         circumcenter[0] = (bisector2.y_axis_cut - bisector1.y_axis_cut)/(bisector1.slope - bisector2.slope); // x = (b2 - b1)/(m1 - m2)
         circumcenter[1] = ( (bisector1.y_axis_cut * bisector2.slope) - (bisector2.y_axis_cut * bisector1.slope))/(bisector2.slope - bisector1.slope);
          // y= (b1*m2 - b2*m1)/m2-m1

        /* document.write("\n");
         document.write("circumcenter x: "+circumcenter[0]);
         document.write('     ');
         document.write(circumcenter[1]);
         document.write('     '); */
         return circumcenter;
      }
   

      function searchTrianglesForNextVertices(point, chosen, nextvertices){

         document.write("\ni am searching for the third vertex. i have first vertex "+point+" and second vertex "+chosen);

         for(var p=0; p< triangles.length ; p++){
 

               if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 1: point at 0 and chosen at 1
                  chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1]  ){
                  document.write("\ni go in case 1 with p as"+p+"\n");


         
                 document.write("BLAHHHsecond vertex of triangle is"+triangles[0][1]);



                  document.write("\n the other vertice of triangle is:"+triangles[p][2]);
                  nextvertices[0][0]=triangles[p][2][0];
                  nextvertices[0][1]=triangles[p][2][1];
                  document.write("\n before setting the other nextvertice,we have nextvertices[0][1] as:"+nextvertices[0]);


                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 1.1 point at 0 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                        nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];

                      }
                     if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 1.2 point at 1 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 1.3 point at 1 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&    //case 1.4 point at 2 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&   //case 1.5 point at 2 and chosen at 1
                    chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                      }
                   document.write("\nim setting both nextvertices to: \n");
                   document.write("\ni nextvertices[0]:"+nextvertices[0]+" and nextvertices[1] is"+nextvertices[1]+" \n");
                  return nextvertices;
               }


//CASE2
           
               if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 2: point at 0 and chosen at 2
                  chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                  document.write("i go in case 2");

                  nextvertices[0][0]=triangles[p][1][0];
                  nextvertices[0][1]=triangles[p][1][1];

                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 2.1 point at 0 and chosen at 1
                      chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];

                      }
                     if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.2 point at 1 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.3 point at 1 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&    //case 2.4 point at 2 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&   //case 2.5 point at 2 and chosen at 1
                    chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                      }

                  return nextvertices;
               }


              //CASE 3

               if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 3: point at 1 and chosen at 0
                  chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                  document.write("i go in case 3");

                  nextvertices[0][0]=triangles[p][2][0];
                  nextvertices[0][1]=triangles[p][2][1];

                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 3.1 point at 0 and chosen at 1
                      chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];

                      }
                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 3.2 point at 0 and chosen at 2
                     chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                        nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.3 point at 1 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&    //case 2.4 point at 2 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&   //case 2.5 point at 2 and chosen at 1
                    chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                      }

                  return nextvertices;
               }

               //CASE 4
                if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] && //case 4: point at 2 and chosen at 0
                  chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                  document.write("i go in case 4");

                  nextvertices[0][0]=triangles[p][1][0];
                  nextvertices[0][1]=triangles[p][1][1];

                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 3.1 point at 0 and chosen at 1
                      chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];

                      }
                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 3.2 point at 0 and chosen at 2
                     chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                        nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.3 point at 1 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                  
                      }
                     if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] &&    //case 2.4 point at 1 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&   //case 2.5 point at 2 and chosen at 1
                    chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                      }

                  return nextvertices;
               }

               //CASE 5

                if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] && // point at 2 and chosen at 1
                  chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                  document.write("i go in case 5");

                  nextvertices[0][0]=triangles[p][0][0];
                  nextvertices[0][1]=triangles[p][0][1];

                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 3.1 point at 0 and chosen at 1
                      chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];

                      }
                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 3.2 point at 0 and chosen at 2
                     chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                        nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.3 point at 1 and chosen at 2
                      chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&    //case 2.4 point at 2 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                  
                      }
                     if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] &&   //case 2.5 point at 1 and chosen at 0
                    chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][2][0];
                         nextvertices[1][1]=triangles[p][2][1];
                      }

                  return nextvertices;
               }

               //case 6
                if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && // point at 1 and chosen at 2
                  chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                  document.write("i go in case 6");

                  nextvertices[0][0]=triangles[p][0][0];
                  nextvertices[0][1]=triangles[p][0][1];

                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] &&  //case 3.1 point at 0 and chosen at 1
                      chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                        nextvertices[1][0]=triangles[p][2][0];
                        nextvertices[1][1]=triangles[p][2][1];

                      }
                     if(point[0] == triangles[p][0][0] && point[1] == triangles[p][0][1] && //case 3.2 point at 0 and chosen at 2
                     chosen[0] == triangles[p][2][0] && chosen[1] == triangles[p][2][1] ){
                        nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                      }
                      if(point[0] == triangles[p][1][0] && point[1] == triangles[p][1][1] && //case 2.3 point at 1 and chosen at 0
                      chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][2][0];
                         nextvertices[1][1]=triangles[p][2][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&    //case 2.4 point at 2 and chosen at 0
                     chosen[0] == triangles[p][0][0] && chosen[1] == triangles[p][0][1] ){
                         nextvertices[1][0]=triangles[p][1][0];
                        nextvertices[1][1]=triangles[p][1][1];
                  
                      }
                     if(point[0] == triangles[p][2][0] && point[1] == triangles[p][2][1] &&   //case 2.5 point at 2 and chosen at 1
                    chosen[0] == triangles[p][1][0] && chosen[1] == triangles[p][1][1] ){
                         nextvertices[1][0]=triangles[p][0][0];
                         nextvertices[1][1]=triangles[p][0][1];
                      }

                  return nextvertices;
               }
    
            

         }//forloop
      }//function ends