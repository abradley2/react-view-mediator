'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createFactories(views) {
  var retVal = {};
  (0, _util.mapObject)(views, function (factory, name) {
    retVal[name] = {
      node: null,
      ref: null,
      isRendered: false,
      factory: _react2.default.createFactory(factory)
    };
  });
  return retVal;
}

function createLayouts(layouts) {
  var retVal = {};
  (0, _util.mapObject)(layouts, function (html, layout) {
    retVal[layout] = {
      html: html,
      isRendered: false
    };
  });
  return retVal;
}

/** Class representing a ReactViewMediator. */

var ReactViewMediator = (function () {

  /**
   *  A NameKey is the string by which the ReactViewMediator references either a view or a layout.
   *  These are set in the constructor and then used in all its view/layout manipulation methods.
   *  @typedef NameKey
   *  @type {string}
   */

  /**
   *  Create a ReactViewMediator
   *  @param {Object} config
   *  @param {Object.<NameKey, string>} config.layouts The string shuold be valid html, supplying dom nodes with unique id's to be used as containers for rendered components.
   *  @param {Object.<NameKey, ReactComponent>} config.views
   *  @param {string} config.el A valid query selector string, ex: "#app-container"
   *  @example var rvm = new ReactViewMediator({
   *    // query selector string for the dom node the ViewMediator will manage
   *    el: '#application-region',
   *
   *    // 'NameOfLayout': "<div>...string representing html of layout...</div>"
   *    layouts: {
   *      'DefaultLayout': "<div><div id='#main-region'></div><div id='#sidebar-region'></div></div>"
   *    },
   *
   *    // 'NameOfView': <JsxComponentForView/>
   *    views: {
   *     'HomeView': class HomeView extends React.Component { .. },
   *     'PostView': class PostView extends React.Component { .. }
   *    }
   *  });
   */

  function ReactViewMediator(config) {
    _classCallCheck(this, ReactViewMediator);

    this.layout = null;
    this.layouts = createLayouts(config.layouts);
    this.views = createFactories(config.views);
    this.el = document.querySelector(config.el);
  }

  /**
   *  <b>This method is mainly for internal purposes and shouldn't need to be used often.</b><br/>
   *  renderLayout will remove all mounted components, and then switch the layout
   *  if the one being rendered is different than the previous. If the layout being
   *  rendered is the same as the previous, then it will do nothing. It will appropriately
   *  mark the .isRendered attribute of layouts internally to keep track of this.
   *  @param {string} layout The layout NameKey of the layout to render.
   */

  _createClass(ReactViewMediator, [{
    key: 'renderLayout',
    value: function renderLayout(layout) {
      if (this.layout !== layout) this.layouts[layout].isRendered = false;

      if (!this.layouts[layout].isRendered) {
        if (this.layout) this.remove();
        this.layout = layout;
        this.el.innerHTML = this.layouts[layout].html;
        this.layouts[layout].isRendered = true;
        return this.layouts[layout];
      } else return false;
    }

    /**
     *  <b>This method is mainly for internal purposes and shouldn't need to be used often.</b><br/>
     *  Unmounts the component(s) of each view specified by their NameKey(s)
     *  @param {NameKey|NameKey[]} views
     */

  }, {
    key: 'removeViews',
    value: function removeViews(views) {
      var _this = this;

      if (typeof views === 'string') views = [views];
      views.forEach(function (view) {
        if (_this.views[view].isRendered) {
          _reactDom2.default.unmountComponentAtNode(_this.views[view].node);
          _this.views[view].node = null;
          _this.views[view].ref = null;
          _this.views[view].isRendered = false;
        }
      });
    }

    /**
     *  <b>This method is mainly for internal purposes and shouldn't need to be used often.</b><br/>
     *  renderViews mounts the appropriate components to designated dom nodes (via query selector string).
     *  It is often best to use .render() instead of this as calling .renderViews() will not call .removeViews() to cleanup and unmount components beforehand.
     *  @param {Object.<querySelectorString, NameKey>} newViews The new views to render. The object properties are query-selector strings for the node you wish to mount them at. Be sure your current layout facilitates this.
     *  @param {Object.<NameKey, ReactComponentProps>} params The params to pass to the rendered views. Be sure the params are wrapped in an object literal as these directly become the component's "props" attribute.
     *  @example reactViewMediator.renderViews(
     *    {
     *      '#content-region': 'PostView',
     *      '#navigation-region': 'NavigationView'
     *    },
     *    {
     *      'PostView': { postId: 6, initialMode: 'collapsed' }
     *    }
     *  );
     */

  }, {
    key: 'renderViews',
    value: function renderViews(newViews, params) {
      var _this2 = this;

      (0, _util.mapObject)(newViews, function (newView, region) {
        _this2.views[newView].node = _this2.el.querySelector(region);
        _this2.views[newView].isRendered = true;

        _this2.views[newView].ref = _reactDom2.default.render(_this2.views[newView].factory(params ? params[newView] : null), _this2.views[newView].node);
      });
    }

    /**
     *  render is the main function for using the ReactViewMediator. It sews together the internal .renderViews and .renderLayout function, so you generally do not need to use these individually.
     *  @param {Object} renderConfig
     *  @param {NameKey} renderConfig.layout The layout you wish to render. Should be a string refferring to its layoutNameKey assigned in the constructor
     *  @param {Object.<querySelectorString, NameKey>} renderConfig.views
     *  @param {Object.<NameKey, ReactComponentProps>} renderConfig.params
     *  @example reactViewMediator.render({
     *    layout: 'DefaultLayout',
     *    views: {
     *      '#content-region': 'GridView',
     *      '#sidebar-region': 'SidebarView'
     *    },
     *    params: {
     *      'GridView': { listId: 4, columns: ['title', 'author'] }
     *    }
     *  });
     */

  }, {
    key: 'render',
    value: function render(renderConfig) {
      this.renderLayout(renderConfig.layout);
      this.removeViews(Object.keys((0, _util.omit)(this.views, (0, _util.values)(renderConfig.views))));
      this.renderViews(renderConfig.views, renderConfig.params);
    }

    /**
     *  unmounts all the components being used by the ViewMediator and
     *  also removes the layout, emptying its html.
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.removeViews(Object.keys(this.views));
      this.el.innerHTML = null;
      this.layouts[this.layout].isRendered = false;
      this.layout = null;
    }
  }]);

  return ReactViewMediator;
})();

exports.default = ReactViewMediator;