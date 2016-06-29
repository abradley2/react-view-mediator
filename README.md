# React View Mediator
Depends on React 0.13.0 or greater, and ReactDOM.

Tested to work with the latest versions of react (15.0 and higher)

To install:
`npm install --save react-view-mediator`

### Purpose

The React View Mediator is my solution for managing which top-level
"View Components" are mounted and unmounted to the DOM in response
to events and routing.

### Setup

Your app should have one instance of the view mediator. It takes a single
configuration object with three parameters:

1. **el**: the query string that tells the mediator which dom node it should apply the layout and mount subsequent View Components to.
2. **layout**: a string of valid html that supplies the container elements for
View Components
3. **views**: an object with [name : React.Component] key-value pairs. The name is the string by which the mediator references the associated View Component.

_Per esempio_
```
import Home from '../components/Home'
import Page from '../components/Page'
import Sidebar from '../components/Sidebar'

var mediator = new ReactViewMediator({
    el: 'body',

    layout: `<div>
        <div id ='sidebar-container'></div>
        <div id='content-container'></div>
    </div>`,

    views: {
        'Home': Home,
        'Page': Page,
        'Sidebar': Sidebar
    }
})
```
