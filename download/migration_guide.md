---
layout: default
title: Qontract to Specmatic
parent: Download
nav_exclude: true
search_exclude: true
---
Migration Guide - Qontract to Specmatic
=======================================

`Qontract` has been renamed to `Specmatic`.

Here are a few considerations you will need to keep in mind.

`.spec` is the new extension for contract files. When using proxy mode, Postman conversion, stub conversion or WSDL conversion, contracts will have the `.spec` extension. The `.qontract` extension is still supported, so existing contracts do not need to be renamed.

Here is a list of things that have changed.
1. The binary is now named `specmatic.jar`.
   1. Any staging environment wrapper scripts referring to `qontract.jar` will now need to refer to `specmatic.jar`.
   2. Local wrappers or aliases referring to `qontract.jar` will need to be updated.
   3. CI scripts referring to `qontract.jar` will need to be updated.
2. `QontractJUnitSupport` has become `SpecmaticJUnitSupport`.
3. `qontract-core` has become `specmatic-core`.
4. `qontract.json` needs to be renamed to `specmatic.json`.
5. A few XML names have changed (e.g. `qontract_type` is now `specmatic_type`) so WSDLs may have to be regenerated.
