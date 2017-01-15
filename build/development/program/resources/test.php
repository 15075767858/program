<?php
$redis = new Redis() or $redis = false;
$redis->connect("127.0.0.1", 6379);

for ($i = 1000601; $i < 1001601; $i++) {

    $redis->hSet($i, "Object_Name", "1");
}
