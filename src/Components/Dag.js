import React, { Component } from 'react';
import Graph from './Graph';
import Spring from '../Layout/Spring';
import Raphael from '../Renderer/Raphael';
import Queue from './Queue';
import $ from 'jquery'

class Dag extends Component {


  componentDidMount(){
      this.parseJson();
  }

  parseJson() {
    try {

     $.getJSON("data/graph.json", function(json) {
       var graph = new Graph();
       var visited = {}
       var start_node = json.nodes[0]
       var queue = new Queue
       for (var i=0; i <  json.nodes.length; ++i ) {
         var node = json.nodes[i];
         visited[node.id] =false
         var func = Function("arg", node.body);
         var arg = node.arg
         if( node.true_id != null ) {
           graph.addEdge(node.id,node.true_id,func,arg,node.true_id,node.false_id);
           visited[node.true_id] =false
         }
         if( node.false_id != null ) {
           graph.addEdge(node.id,node.false_id,func,arg,node.true_id,node.false_id);
           visited[node.false_id] = false
         }
         if ( node.true_id == null && node.false_id == null) {
           graph.addNodeWithFunc(node.id,func,arg,node.true_id,node.false_id);
         }
       }
       queue.enqueue(graph.getNode(start_node.id))


       if ( graph.isCyclic(queue,visited)) {
         alert("The directed acyclic graph cannot have cycles!")
       }
       else {
         var layouter = new Spring(graph);
         layouter.layout();
         var renderer = new Raphael("#paper", graph, 400, 300);
         renderer.draw();
         graph.startExecution(graph.getNode(start_node.id))
       }

     }
     );
    } catch (err) {
      console.log(err,"failed to parse the graph data")
    }
  }

  render() {
    return (
      <div className="Projects">
         <div id="paper"> </div>
      </div>
    );
  }
}

export default Dag;
