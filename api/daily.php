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
    echo $token;
} else {
    $data = explode(";", file_get_contents("daily.txt"));

    if ($data[0] === date('Ymd')) {
        echo $data[1];
    } else {
        $fp = fopen("daily.txt", "w+");
    
        if (flock($fp, LOCK_EX)) {
            $content = fread($fp, filesize("daily.txt"));
    
            if ($data[0] === date('Ymd')) {
                echo $data[1];
            } else {
                $token = generateRandomString();
                fwrite($fp, date('Ymd') . ";" . $token);
                echo $token;
                fflush($fp);
            }
    
            flock($fp, LOCK_UN);
        } else {
            echo "Lock error";
        }
    
        fclose($fp);
    }
}