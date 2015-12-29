# React View Mediator
Depends on React 0.14.0 or greater, and ReactDOM.

### Purpose

ReactViewMediator is my solution for using React components as views, and then
gluing them to any 'application-controller' solution (in particular, I favor
the Backbone Router). The biggest annoyances in doing this: keeping track of what
views are rendered, what node they are rendered to,
and unmounting those views from their node when they are no longer needed.

The ReactViewMediator's `.render()` function mounts a list of your desired views to a
designated element in your selected layout, and can also send those views props. Ideally, you
should be able to manage all the views of your React application with just this class and method.

For example:

```
reactViewMediator.render({
  layout: 'DefaultLayout',
  views: {
    '#sidebar-region': 'SidebarView',
    '#content-region': 'PostView'
  },
  params: {
    'PostView': {
      'postId': 643
    }
  }
});
```

First, the ReactViewMediator will unmount any components that aren't to be rendered
in this call. So if you previously rendered 'HomeView', it will be unmounted. Changing to
a new layout from the one previously rendered unmounts all currently mounted components.

Then, the ReactViewMediator will render each view in it's associated region. If params
are specified with that view, they will be passed to it as props.

### Examples

Creating a new instance of the ReactViewMediator:
```
var rvm = new ReactViewMediator({
  // query selector string for the dom node the ViewMediator will manage
  el: '#application-region',

  // 'NameOfLayout': "<div>...string representing html of layout...</div>"
  layouts: {
    'DefaultLayout': "<div><div id='#main-region'></div><div id='#sidebar-region'></div></div>"
  },

  // 'NameOfView': React.Component
  views: {
    'HomeView': class HomeView extends React.Component { .. },
    'PostView': class PostView extends React.Component { .. }
  }
});
```

For reasons of sanity, you probably don't want to have all your components written
in-line in a constructor function. Here is an example project structure:
```
+-- main.js
+-- _views
|   +-- HomeView.jsx
|   +-- PostView.jsx
+-- _layouts
|   +-- default.html
```

Then to initialize:
```
var rvm = new ReactViewMediator({
  layouts: {
    'DefaultLayout': require('./layouts/default.html')
  },
  views: {
    'HomeView': require('./views/HomeView.jsx'),
    'PostView': require('./views/PostView.jsx')
  }
});
```


Here is how I typically use the ReactViewMediator alongside the Backbone Router:
```
Backbone.Router.extend({

  routes: {

    '/': function(){
      rvm.render({
        layout: 'DefaultLayout',
        views: {
          '#main-region': 'HomeView'
        }
      });
    },

    '/post/:id': function(id){
      rvm.render({
        layout: 'DefaultLayout',  
        views: {
          '#main-region': 'PostView',
          '#sidebar-region': 'SidebarView'
        },
        params: {
          'PostView': {postId: id}
        }
      });
    }

  }
});
```


### Api Documentation

All documentation is included in the source.
See `./src/ReactViewMediator.js`

### Gotchas

_**Use as a top level manager, do not nest**_  

Only use ReactViewMediator at the **top level** as intended. For layouts it directly edits the html outside of React. This is fine but if contained inside another React component this will cause issues.

_**Specify everything that should be rendered each time**_  

Everytime you call `.render()` all your component-views will be unmounted unless they are specified in the renderConfig. This is intentional. The ReactViewMediator is designed so that preferably the only method you ever need to call is `.render()`

So if you render a view, and then click on a link which then renders the same view with another view on the side, you must specify the original view, even when you render the second view.

Step 1:
```
reactViewMediator.render({
  layout: 'DefaultLayout',
  views: {
    '#content-region': 'PostView'
  }
});
```

Step 2:
```
reactViewMediator.render({
  layout: 'DefaultLayout',
  views: {
    '#content-region': 'PostView',
    '#sidebar-region': 'SideBarView'
  }
});
```

If you don't specify PostView in the second call it will be removed. I found this pattern most effective since it made no assumptions that rendering triggers/actions are aware of the current state of the application.

1. React by nature does not "double render" so this issue is taken care of
2. The ReactViewMediator does not assume it doesn't need to do anything to a View if it is being rendered a second time without unmounting between. Otherwise, this would result in the unwanted behavior of a view not being re-rendered when you pass it different props in the `renderConfig.params` object.

_**You cannot render the same view twice in the same render call**_  
This will not work:
```
// BAD :(
rvm.render({
  layout: 'DefaultLayout',
  views: {
    '#left-region': 'Accordion',
    '#right-region': 'Accordion'
  }
});
```

You can work around this by simply giving a component an alias, but I suggest against this. The ReactViewMediator is meant for top-level 'view-component', and most of the time when you have duplicate components rendered at the same time, these are not 'top-level' and are better nested in a 'view-component'.
