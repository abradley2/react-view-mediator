import React from 'react';

// LAYOUTS

const mainLayout = "<div><div id='content-region'></div></div>";

const sidebarLayout = "<div><div id='content-region'></div><div id='sidebar-region'></div></div>";

export const Layouts = {
  'MainLayout': mainLayout,
  'SidebarLayout': sidebarLayout
};

// VIEWS

class HomeView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (<div>Home View</div>);
  }
}

class PostView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (<div>Post View</div>);
  }
}

class SidebarView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (<div>Sidebar View</div>);
  }
}

export const Views = {
  'HomeView': HomeView,
  'PostView': PostView,
  'SidebarView': SidebarView
};
