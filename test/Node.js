describe('Node', function() {
  it('TextNode input could change model', function() {
    var input = document.createElement('input');
    input.setAttribute('cm-model', 'test');

    document.body.appendChild(input);

    var model = cm.createModel({
      'test': '123'
    });

    cm.bootstrap(input, model);

    expect(input.value).toBe('123');

    //TODO: changing input.value doesn't trigger onkeyup event.
    // input.value = '234';        

    // expect(model.props['test']).toBe('234');
  });
});