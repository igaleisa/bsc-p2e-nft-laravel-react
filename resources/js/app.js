/*!

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect, generatePath  } from "react-router-dom";
import {store} from './redux/CreateStore';
import {Provider} from 'react-redux';

import AdminLayout from "@/layouts/Admin.js"
import UserLayout from "@/layouts/User.js"

import "@/assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import "@/app.css";

const hist = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/admin" component={AdminLayout} />
          <Route path="/" component={UserLayout} />
          <Redirect from="/" to="/" />
        </Switch>
      </Router>
    </Provider>,  
  document.getElementById("root")
);
