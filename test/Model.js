describe('Model', function() {
  it('should return a new instance', function() {
    var model = cm.createModel({
      name: 'test'
    });

    expect(model).toBeTruthy();
  });

  it('should have initialized props', function() {
    var model = cm.createModel({
      'test': '123'
    });

    expect(model.props['test']).toBe('123');
  });

  it('should have added props', function() {
    var model = cm.createModel();

    model.addProp('test', '123');

    expect(model.props['test']).toBe('123');
  });

  it('textNode should have text "123"', function() {
    var model = cm.createModel({
      'test': '123'
    });

    var p = document.createElement('p');
    p.textContent = '{{test}}';

    document.body.appendChild(p);

    cm.bootstrap(p, model);

    expect(p.textContent).toBe('123');
  });

  it('node value should change with model', function() {
    var model = cm.createModel({
      'test': '123'
    });

    var p = document.createElement('p');
    p.textContent = '{{test}}';

    document.body.appendChild(p);

    cm.bootstrap(p, model);

    expect(p.textContent).toBe('123');

    model.props.test = 'test';

    expect(p.textContent).toBe('test');
  });
});