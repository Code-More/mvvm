(function(s){var cm = s.cm = {};

cm.options = {
  syntax: {
    bindSyntaxLeft: "{{",
    bindSyntaxRight: "}}",
    bindSyntaxRegexp: /\{{2}\s*([a-zA-Z0-9_]*)\s*\}{2}/g
  }
};

cm.bootstrap = function(ele, model) {
  var compiler = new Compiler(ele);

  console.log(compiler.modelNodes);
  window.list = compiler.modelNodes;

  model._startBind(compiler);
};

cm.createModel = function(props) {
  return new Model(props);
};//two way data binding
cm.Binder = function(name, value, node) {

};var Model = cm.Model = function(props) {
  this.props = {};
  this.compiler = null;
  this.isStart = false;

  if (typeof this._startBind !== 'function') {
    Model.prototype._destroy = function() {
      this.props = null;
      this.isStart = false;
    };

    Model.prototype._startBind = function(compiler) {
      this.compiler = compiler;
      for (prop in this.compiler.modelNodes) {
        var node = this.compiler.modelNodes[prop];
        var model = this;

        if (!(node.expr in this.props)) {
          this.props[node.expr] = undefined;
          this.addProp(node.expr, null);
        }

        // if node is a input text
        if (node instanceof TextNode) {
          if ((this.props[node.expr] === null) ||
            (typeof this.props[node.expr] === 'undefined')) {

            node.ele.value = '';
          } else {
            node.ele.value = this.props[node.expr];
          }

          // TODO: this will erase all exist functions which may be
          // not what we want.
          node.ele.onkeyup = function() {
            model.props[this.cmNode.expr] = this.value;
          };
        } else {
          // it's display nodes          
          if ((this.props[node.expr] === null) ||
            (typeof this.props[node.expr] === 'undefined')) {

            node.textContent = '';
          }

          node.textContent = this.props[node.expr];
        }
      }

      this.isStart = true;
    };

    Model.prototype._digest = function() {
      console.log('digest');

      if (!this.isStart) {
        return;
      }

      for (prop in this.props) {
        if (this.props[prop] !== this.props['_last' + prop]) {
          this.props['_last' + prop] = this.props[prop];
          for (var i in this.compiler.modelNodes) {
            var node = this.compiler.modelNodes[i];
            if (node.expr === prop) {
              if (node instanceof TextNode) {
                node.ele.value = this.props[prop];
                continue;
              }

              node.textContent = this.props[prop];
            }
          }
        }
      }
    };

    var _digest = this._digest.bind(this);

    Model.prototype.addProp = function(name, value) {
      Object.defineProperty(this.props, name, {
        get: function() {
          return this['_' + name];
        },
        set: function(newValue) {
          this['_' + name] = newValue;
          _digest();
        },
        enumerable: true,
        configurable: true
      });

      this.props[name] = value;
      this.props['_last' + name] = value;
    };
  }

  for (var name in props) {
    this.addProp(name, props[name]);
  }
};var Node = cm.Node = function(ele, modelType, expr) {
  this.ele = ele;
  this.ele.cmNode = this;
  this.modelType = modelType;
  this.expr = expr;
};

var TextNode = function(ele, expr) {
  Node.call(this, ele, 'TEXT_NODE', expr);
};// iterate DOM and find model nodes
var Compiler = cm.Compiler = function(ele) {
  // properties
  this.ele = ele;
  this.modelNodes = [];

  // methods
  if (typeof this.compileHTML !== 'function') {
    Compiler.prototype._destroy = function() {
      this.ele = null;
      this.modelNodes = null;
    };

    Compiler.prototype._compile = function(ele) {
      for (var i = 0; i < ele.childNodes.length; i++) {
        var node = ele.childNodes[i];
        this._checkDisplayModel(node);
        this._checkModel(node);
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

    Compiler.prototype._checkModel = function(node) {
      if (node.nodeType === 3) {
        return;
      }

      // if it's `input text`
      if (node.nodeName === 'INPUT' && node.type === 'text' &&
        node.attributes['cm-model']) {

        this.modelNodes.push(new TextNode(node, node.attributes['cm-model'].value));
        return;
      }

      // if it's textarea
      if (node.nodeName === 'TEXTAREA' && node.attributes['cm-model']) {
        this.modelNodes.push(new TextNode(node, node.attributes['cm-model'].value));
        return;
      }
    };

    Compiler.prototype._checkDisplayModel = function(node) {
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
};})(window);