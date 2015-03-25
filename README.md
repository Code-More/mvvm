#mvvm

A simplest js mvvm framework.

###example

```
<!DOCTYPE html>
<html>
  <head>
    <title>mvvm example</title>
    <script src="../index.js"></script>
  </head>
  <body>
    <h1>{{welcome}}. I'm {{name}}!</h1>
    <p>{{ words }}</p>
    <label>Your Name: </label>
    <input type="text" cm-model="name"/>
    <div>
      <label>You say: </label>
      <textarea cm-model="words"></textarea>      
    </div>
    <script>
      var obj = {};
      
      var model = cm.createModel({
        welcome: "Hello, world!",
        name :"oyyd"
      });

      cm.bootstrap(document.body, model);

      model.props.name = "abc";
    </script>
  </body>
</html>
```
