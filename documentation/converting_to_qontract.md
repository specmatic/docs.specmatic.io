---
layout: default
title: Convert Stubs and Postman Collections
parent: Documentation
nav_order: 9
---
Convert Stubs and Postman Collections
=====================================

Qontract can convert stub data and [Postman](https://www.postman.com) collections into Qontract files.

## Importing a stub file

`qontract import stub -o <qontract file>.json <stub file>.json`

The stub file here must be in the format understood by the `qontract stub` command. Here to, the resulting qontract will be written into "qontract file.json" as specified in the command.

You can read more about the format in the [command line documentation](/documentation/command_line.html#http-stub-file-format).

## Importing a Postman collection

`qontract import postman -o <qontract file>.json <postman collection file>.json`

This command will read the postman collection, and write the new qontract file into "qontract file.json" as specified in the command.

To see the qontract on standard output instead, just omit `-o filename.json`.
