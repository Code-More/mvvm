describe('Compiler', function() {
  it('should get a new instance', function() {
    var p = document.createElement('p');

    document.body.appendChild(p);

    var compiler = new cm.Compiler(p);

    expect(compiler).toBeTruthy();
  });

  it('should have correct model nodes', function() {
    var div = document.createElement('div');

    var p = document.createElement('p');
    p.innerHTML = '{{test}}';

    var input = document.createElement('input');
    input.setAttribute('cm-model', 'test');

    div.appendChild(input);
    div.appendChild(p);

    var compiler = new cm.Compiler(div);

    expect(compiler.modelNodes.length).toBe(2);
  });
});