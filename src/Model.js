var Model = cm.Model = function(props) {
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
};