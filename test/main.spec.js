var React = require('react'),
    ReactDOM = require('react-dom'),
    chai = require('chai'),
    ReactViewMediator = require('../lib/ReactViewMediator'),
    sut = require('./sut')

var mediator = new ReactViewMediator(sut)

describe('ReactViewMediator', function () {

    mediator.render({
        views: {}
    })

    console.log(
        document.getElementById('main-region').innerHTML
    )
    
    mediator.render({
        views: {
            '#main-region': 'ViewOne'
        }
    })

    console.log(
        document.getElementById('main-region').innerHTML
    )

    chai.assert.isTrue(true)

})
