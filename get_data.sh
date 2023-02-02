#!/usr/bin/sh

rtl_433 -F json:read_new.json -T 120
mv read_new.json read.json
