(function(s) {
  var cm = s.cm = {};

  cm.options = {
    syntax: {
      bindSyntaxLeft: "{{",
      bindSyntaxRight: "}}",
      bindSyntaxRegexp: /(\{){2}.*(\}){2}/
    }
  };

  //two way data binding
  cm.Binder = function() {

  };

  var Model = cm.Model = function(props) {
    this.props = props;

    if (!this.startBind) {
      Model.prototype = {};
      Model.prototype.constructor = Model;
      Model.prototype.startBind = function() {};
    }
  };

  var Node = cm.Node = function(ele, modelType) {
    this.ele = ele;
    this.modelType = modelType;
  };

  // iterate DOM and find models
  var Compiler = cm.Compiler = function(ele) {
    // properties
    this.ele = ele;
    this.modelNodes = [];

    // methods
    if (!this.compileHTML) {
      this.prototype.compileHTML = function() {
        this._compile(this.ele);

        return this.modelNodes;
      };

      this.prototype._isModelNode = function(node) {
        if (node.nodeType === 3 && )
      };

      this.prototype._compile = function(ele) {
        for (var i in ele.childNodes) {
          var node = ele.childNodes[i];

          if (this._isModelNode(node)) {

          }
        }
      };
    }

    // initialization
    this.compileHTML();
  };

  cm.bootstrap = function(ele, model) {

  };

  cm.createModel = function(props) {
    return new Model(props);
  };

})(window);