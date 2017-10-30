React JS project on DAG execution
=================================
Please install the following the npm packages to begin with. 

```
npm install -g raphael
npm install -g node-sass
```

Execute the following command to create the main.css from main.scss file.

```
cd public
node-sass -o css css/main.scss
npm start
```
The npm start will start the application which will read the graph.json from the
public/data directory, and will render a DAG also the nodes that are executed by changing
the color of the nodes. 

By clicking on the nodes will bring up the details of each of the node. 

