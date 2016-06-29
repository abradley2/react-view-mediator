var React = require('react'),
    ReactDOM = require('react-dom'),
    util = require('./util');

var assign = util.assign,
    values = util.values,
    mapObject = util.mapObject,
    omit = util.omit

/**
 * A ViewKey is the string by which the ReactViewMediator references a view.
 * These are set in the constructor and then used in all its view switching methods.
 * @typedef ViewKey
 * @type {string}
 */

/**
 * Create a ReactViewMediator
 * @param {Object} config
 * @param {string} config.layout The string should be valid html, supplying dom
 *   nodes with unique id's to be used as containers components.
 * @param {Object.<ViewKey, ReactComponent>} config.views
 * @param {string} config.el A valid query selector string, ex: "#app-container"
 * @example var rvm = new ReactViewMediator({
 *   // query selector string for the dom node the ViewMediator will manage
 *   el: '#application-region',
 *
 *   // String representing html of the layout
 *   layout: `<div>
 *     <div id='main-region'></div>
 *     <div id='sidebar-region'></div>
 *   </div>`
 *
 *   // 'NameOfView': <JsxComponentForView/>
 *   views: {
 *    'HomeView': class HomeView extends React.Component { .. },
 *    'PostView': class PostView extends React.Component { .. }
 *   }
 * });
 */
function ReactViewMediator (config) {
    this.config = config
    this.layout = config.layout
    this.el = config.el
    this.element = document.querySelector(this.el)
    this.views = this._createFactories(config.views)

    this._layoutIsRendered = false
    this._hasMounted = false
}

assign(ReactViewMediator.prototype, {

    _createFactories: function (views) {
        var retVal = {}
        mapObject(views, function (factory, name) {
            retVal[name] = {
                node: null,
                ref: null,
                isRendered: false,
                factory: React.createFactory(factory)
            }
        }, this)
        return retVal;
    },

    _renderLayout: function () {
        this.element = document.querySelector(this.el)
        this.element.innerHTML = this.layout
    },

    _removeView: function (view) {
        ReactDOM.unmountComponentAtNode( this.views[view].node )
        this.views[view].node = null
        this.views[view].ref = null
        this.views[view].isRendered = false
    },

    _renderView: function (view, container, props) {
        this.views[view].node = this.element.querySelector(container);
        this.views[view].isRendered = true;
        this.views[view].ref = ReactDOM.render(
            this.views[view].factory(props || null),
            this.views[view].node
        )
    },

    removeViews: function (views) {
        if (typeof views === 'string') views = [views]
        views.forEach(function (view) {
            if (this.views[view].isRendered) this._removeView(view)
        }, this)
    },

    renderViews: function (config) {
        var props = config.props || {}

        mapObject(config.views, function (view, region) {
            this._renderView(view, region, props[view] || null)
        }, this)
    },

    /**
     *  render is the main function for using the ReactViewMediator. It sews together the internal .renderViews and .renderLayout function, so you generally do not need to use these individually.
     *  @param {Object} renderConfig
     *  @param {NameKey} renderConfig.layout The layout you wish to render. Should be a string refferring to its layoutNameKey assigned in the constructor
     *  @param {Object.<querySelectorString, ViewKey>} renderConfig.views
     *  @param {Object.<ViewKey, ReactComponentProps>} renderConfig.params
     *  @example reactViewMediator.render({
     *    views: {
     *      '#content-region': 'GridView',
     *      '#sidebar-region': 'SidebarView'
     *    },
     *    props: {
     *      'GridView': { listId: 4, columns: ['title', 'author'] }
     *    }
     *  });
     */
    render: function (renderConfig) {
        var viewsToRender = values(renderConfig.views),
            viewsToRemove = Object.keys(
                omit(this.views, viewsToRender)
            )

        if (!this._layoutIsRendered) {
            this._renderLayout()
        }

        this.removeViews(viewsToRemove)
        this.renderViews(renderConfig)
    }

})

module.exports = ReactViewMediator
