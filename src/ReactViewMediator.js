import React from 'react';
import ReactDOM from 'react-dom';

import {values, mapObject, omit} from './util.js';

function createFactories(views) {
  var retVal = {};
  mapObject(views, (factory, name) => {
    retVal[name] = {
      node: null,
      ref: null,
      isRendered: false,
      factory: React.createFactory(factory)
    };
  });
  return retVal;
}

function createLayouts(layouts){
  var retVal = {};
  mapObject(layouts, (html, layout) => {
    retVal[layout] = {
      html: html,
      isRendered: false
    };
  });
  return retVal;
}

/** Class representing a ReactViewMediator. */
export default class ReactViewMediator {

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
  constructor(config){
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
  renderLayout(layout){
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
  removeViews(views){
    if (typeof views === 'string') views = [views];
    views.forEach( (view) => {
      if (this.views[view].isRendered){
        ReactDOM.unmountComponentAtNode(this.views[view].node);
        this.views[view].node = null;
        this.views[view].ref = null;
        this.views[view].isRendered = false;
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
  renderViews(newViews, params){

    mapObject(newViews, (newView, region) => {
      this.views[newView].node = this.el.querySelector(region);
      this.views[newView].isRendered = true;

      this.views[newView].ref = ReactDOM.render(
        this.views[newView].factory(params ? params[newView] : null),
        this.views[newView].node
      );
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
  render(renderConfig){
    this.renderLayout(renderConfig.layout);
    this.removeViews(
      Object.keys(
        omit(
          this.views,
          values(renderConfig.views)
        )
      )
    );
    this.renderViews(renderConfig.views, renderConfig.params);
  }

  /**
   *  unmounts all the components being used by the ViewMediator and
   *  also removes the layout, emptying its html.
   */
  remove(){
    this.removeViews(Object.keys(this.views));
    this.el.innerHTML = null;
    this.layouts[this.layout].isRendered = false;
    this.layout = null;
  }

}
