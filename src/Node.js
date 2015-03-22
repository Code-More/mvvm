var Node = cm.Node = function(ele, modelType, expr) {
  this.ele = ele;
  this.ele.cmNode = this;
  this.modelType = modelType;
  this.expr = expr;
};

var TextNode = function(ele, expr) {
  Node.call(this, ele, 'TEXT_NODE', expr);
};