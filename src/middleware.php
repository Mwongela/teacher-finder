<?php


$mw = function ($request, $response, $next) {

    if (!isset($_SESSION['user'])) {

        return $response->withRedirect('/teacher-finder/public/login/');

    }

    return $next($request, $response);
};