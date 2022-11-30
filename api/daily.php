<?php

function generateRandomString() {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 20; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

if (!file_exists("daily.txt") || filesize("daily.txt") === 0) {
    $token = generateRandomString();
    file_put_contents("daily.txt", date('Ymd') . ";" . $token);
    echo $token . ";";
} else {
    $data = explode(";", file_get_contents("daily.txt"));
    $yesterday = "";
    if (count($data) > 2) {
        $yesterday = $data[2];
    }

    if ($data[0] === date('Ymd')) {
        echo $data[1] . ";" . $yesterday;
    } else {
        $fp = fopen("daily.txt", "w+");
    
        if (flock($fp, LOCK_EX)) {
            $content = fread($fp, filesize("daily.txt"));
    
            if ($data[0] === date('Ymd')) {
                echo $data[1] . ";" . $yesterday;
            } else {
                $token = generateRandomString();
                fwrite($fp, date('Ymd') . ";" . $token . ";" . $data[1]); // Current date ; Current puzzle ; Yesterday puzzle
                echo $token . ";" . $data[0];
                fflush($fp);
            }
    
            flock($fp, LOCK_UN);
        } else {
            header("HTTP/1.1 409 Conflict");
            echo "Lock error";
        }
    
        fclose($fp);
    }
}