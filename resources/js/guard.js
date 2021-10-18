import React from 'react';
import { Route, Redirect, } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AdminGuard = ({
    path,
    component, 
    routeRedirect, 
    ...rest
}) => {
    const { isAuthenticated, isAdmin, } = useSelector(
        (state) => state.userAuth
    );

    return isAuthenticated === true && isAdmin === true ? (
        <Route exact path={path} component={component} {...rest} />
    ) : (
        <Redirect to={{pathname:routeRedirect}} />
    );
};

export const UserGuard = ({
    path,
    component, 
    routeRedirect, 
    ...rest
}) => {
    const { isAuthenticated, } = useSelector(
        (state) => state.userAuth
    );

    return isAuthenticated === true ? (
        <Route exact path={path} component={component} {...rest} />
    ) : (
        <Redirect to={{pathname:routeRedirect}} {...rest} />
    );
};