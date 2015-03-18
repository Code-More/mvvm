(function(s) {
  var cm = s.cm = {};

  cm.options = {
    syntax: {
      bindSyntaxLeft: "{{",
      bindSyntaxRight: "}}",
      bindSyntaxRegexp: /\{{2}\s*([a-zA-Z0-9_]*)\s*\}{2}/g
    }
  };

  //two way data binding
  cm.Binder = function() {

  };

  var Model = cm.Model = function(props) {
    for (var name in props) {
      this[name] = props[name];
    }

    if (typeof this._startBind !== 'function') {
      Model.prototype._startBind = function(compiler) {
        for (prop in compiler.modelNodes) {
          var node = compiler.modelNodes[prop];

          if (!(node.expr in this)) {
            this[node.expr] = undefined;
          }

          if ((this[node.expr] === null) || (typeof this[node.expr] === 'undefined')) {
            node.textContent = "";
          }

          node.textContent = this[node.expr];
        }
      };
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
    if (typeof this.compileHTML !== 'function') {
      Compiler.prototype._compile = function(ele) {
        for (var i = 0; i < ele.childNodes.length; i++) {
          var node = ele.childNodes[i];
          this._createModelNode(node);
          if (node.childNodes && node.childNodes.length > 0) {
            this._compile(node);
          }
        }
      };

      Compiler.prototype.compileHTML = function() {
        this._compile(this.ele);

        return this.modelNodes;
      };

      Compiler.prototype._isModelNode = function(node) {};

      Compiler.prototype._createModelNode = function(node) {
        if (node.nodeType !== 3) {
          return;
        }

        var regRes = null,
          preNode = null,
          nextNode = null,
          modelNode = null,
          reg = cm.options.syntax.bindSyntaxRegexp;

        while (regRes = reg.exec(node.textContent)) {
          var start = reg.lastIndex - regRes[0].length;

          modelNode = document.createTextNode("");
          modelNode.expr = regRes[1];
          preNode = document.createTextNode(node.textContent.substr(0, start));
          nextNode = document.createTextNode(node.textContent.substr(reg.lastIndex));

          var parent = node.parentNode;
          parent.insertBefore(preNode, node);
          parent.insertBefore(modelNode, node);
          parent.insertBefore(nextNode, node);

          this.modelNodes.push(modelNode);
          parent.removeChild(node);
          return;
        }
      };
    }

    // initialization
    this.compileHTML();
  };

  cm.bootstrap = function(ele, model) {
    var compiler = new Compiler(ele);

    console.log(compiler.modelNodes);
    window.list = compiler.modelNodes;

    model._startBind(compiler);
  };

  cm.createModel = function(props) {
    return new Model(props);
  };

})(window);