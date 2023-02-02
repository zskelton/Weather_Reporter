#!/usr/bin/sh

rtl_433 -F json:data.updating.json -T 120
mv data.updating.json data.json
