var React = require('react'),
    R = React.createElement

// LAYOUT
var layout = `<div id='app-container'>
    <div id='main-region'></div>
    <div id='secondary-region'></div>
</div>`

// VIEW ONE
var ViewOne = React.createClass({

    render: function () {
        return R('div', {}, [
            R('h3', {key: 0}, 'View One'),
            R('h4', {key: 1}, 'The first of the views')
        ])
    }

})

// VIEW TWO
var ViewTwo = React.createClass({

    render: function () {
        return R('div', {}, [
            R('h3', {key: 0}, 'View Two'),
            R('h3', {key: 1}, 'The last of the views')
        ])
    }

})

module.exports = {
    el: 'body',
    layout: layout,
    views: {
        'ViewOne': ViewOne,
        'ViewTwo': ViewTwo
    }
}
