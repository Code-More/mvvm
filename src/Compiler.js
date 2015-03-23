// iterate DOM and find models
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
};