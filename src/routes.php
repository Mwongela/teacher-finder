<?php

require __DIR__ . '/util/utils.php';
require __DIR__ . '/models/user.php';

$app->get('/login/', function ($request, $response, $args) {
    return $this->view->render($response, 'login.twig', $args);
});

$app->post('/login/', function ($request, $response, $args) {

    $params = $request->getParsedBody();

    $username = $params['username'];
    $password = $params['password'];

    $user = User::where('username', $username)->first();

    if ($user) {

        $computed_hash = Utils::checkhashSSHA($user->salt, $password);

        if ($computed_hash === $user->password_hash) {

            unset($user->password_hash);
            unset($user->salt);

            return $response
                ->withJson([
                        'status' => true,
                        'user' => $user
                    ]);

        } else {
            return $response
                ->withJson([
                        'status' => false,
                        'message' => 'Wrong user password'
                    ]);
        }

    } else {

        return $response
            ->withStatus(404)
            ->withJson([
                    'status' => false,
                    'message' => 'User not found'
                ]);
    }
});

$app->post('/d_login/', function ($request, $response, $args) {

    $params = $request->getParsedBody();

    $username = $params['username'];
    $password = $params['password'];

    $user = User::where('username', $username)->first();

    if ($user) {

        $computed_hash = Utils::checkhashSSHA($user->salt, $password);

        if ($computed_hash === $user->password_hash) {

            unset($user->password_hash);
            unset($user->salt);

            $_SESSION['user'] = ['username' => $user->username, 'user_id' => $user->id];
            return $response->withRedirect('/teacher-finder/public/');

        } else {
            return $this->view->render($response, 'login.twig', [
                'error' => 'Wrong password'
            ]);
        }

    } else {

        return $this->view->render($response, 'login.twig', [
            'error' => 'Username not found'
        ]);
    }
});

$app->post('/register/', function ($request, $response, $args) {

    $params = $request->getParsedBody();

    if (isset($params['username']) && isset($params['password']) && isset($params['role'])) {

        $username = $params['username'];
        $password = $params["password"];
        $role = $params["role"];

        $hash = Utils::hashSSHA($password);

        $user = new User();
        $user->username = $username;
        $user->password_hash = $hash['encrypted'];
        $user->salt = $hash['salt'];
        $user->role = $role;

        $user->save();

        unset($user->password_hash);
        unset($user->salt);

        return $response->withStatus(201)->withJson($user);

    } else {

        return $response->withJson([
                'status' => false,
                'message' => 'Parameters missing']);
    }
});

$app->get('/logout/', function ($request, $response, $args) {

    session_unset();
    session_destroy();

    return $response->withRedirect("/teacher-finder/public/");
});

$app->get('/', function ($request, $response, $args) {

    $user = $_SESSION['user'];

    return $this->view->render($response, 'dashboard.twig', [
        'username' => $user["username"]
    ]);
})->add($mw);

$app->get('/teachers/', function ($request, $response, $args) {

    $user = $_SESSION['user'];

    return $this->view->render($response, 'teachers.twig', [
        'username' => $user["username"]
    ]);
})->add($mw);

$app->get('/students/', function ($request, $response, $args) {

    $user = $_SESSION['user'];

    return $this->view->render($response, 'students.twig', [
        'username' => $user["username"]
    ]);
})->add($mw);

$app->get('/sale_items/', function ($request, $response, $args) {

    $user = $_SESSION['user'];

    return $this->view->render($response, 'sale_items.twig', [
        'username' => $user["username"]
    ]);
})->add($mw);
