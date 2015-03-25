var cm = s.cm = {};

cm.options = {
  syntax: {
    bindSyntaxLeft: "{{",
    bindSyntaxRight: "}}",
    bindSyntaxRegexp: /\{{2}\s*([a-zA-Z0-9_]*)\s*\}{2}/g
  }
};

cm.bootstrap = function(ele, model) {
  var compiler = new Compiler(ele);

  model._startBind(compiler);
};

cm.createModel = function(props) {
  return new Model(props);
};