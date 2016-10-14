#!/usr/bin/env bash

read -p "input a val:"  val
echo $val
git add .
git commit -m $val
