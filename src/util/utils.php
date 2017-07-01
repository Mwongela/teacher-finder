<?php

class Utils
{
    /**
     * Encrypting password
     * @param password
     * @returns salt and encrypted password
     */
    public static function hashSSHA($password)
    {

        $salt = sha1(rand());
        $salt = substr($salt, 0, 10);
        $encrypted = base64_encode(sha1($password . $salt, true) . $salt);
        $hash = array("salt" => $salt, "encrypted" => $encrypted);
        return $hash;
    }

    /**
     * @param $salt
     * @param $password
     * @return string
     */
    public static function checkhashSSHA($salt, $password) {

        $hash = base64_encode(sha1($password . $salt, true) . $salt);
        return $hash;
    }
}