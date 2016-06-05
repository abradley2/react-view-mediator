import chai from 'chai';

import ReactDOM from 'react-dom';
import {Views, Layouts} from './sut.jsx';
import ReactViewMediator from '../index.js';

var sut = new ReactViewMediator({
  'el': 'body',
  'layouts': Layouts,
  'views': Views
});

describe('viewMediator', function(){

  it('should create an instance of the ViewMediator', function(){

    chai.assert.isObject(sut, 'The ViewMediator is properly created');

  });

  it('should correctly render a view and a layout', function(){

    sut.render({
      'layout': 'MainLayout',
      'views': {
        '#content-region': 'HomeView'
      }
    });

    chai.assert.isTrue(sut.views['HomeView'].isRendered);
    chai.assert.isTrue(sut.layouts['MainLayout'].isRendered);
    chai.assert.isDefined(ReactDOM.findDOMNode(sut.views['HomeView'].ref));

  });

  it('should successfully replace views in the same layout', function(){

    sut.render({
      'layout': 'MainLayout',
      'views': {
        '#content-region': 'PostView'
      }
    });

    chai.assert.isFalse(sut.views['HomeView'].isRendered);
    chai.assert.isNull(sut.views['HomeView'].ref);

    chai.assert.isTrue(sut.views['PostView'].isRendered);
    chai.assert.isTrue(sut.layouts['MainLayout'].isRendered);
    chai.assert.isDefined(ReactDOM.findDOMNode(sut.views['PostView'].ref));

  });


  it('should remove views', function(){

    sut.render({
      'layout': 'MainLayout',
      'views': {
        '#content-region': 'PostView'
      }
    });


    chai.assert.isDefined(ReactDOM.findDOMNode(sut.views['PostView'].ref))

    sut.removeViews('PostView');

    chai.assert.isFalse(sut.views['PostView'].isRendered);
    chai.assert.isNull(sut.views['PostView'].ref);
    chai.assert.isNull(ReactDOM.findDOMNode(sut.views['PostView'].ref));

  });

  it('should pass props/params to rendered views', function(){

  });

});
