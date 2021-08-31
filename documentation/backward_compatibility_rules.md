---
layout: default
title: Backward Compatibility Rules
parent: Documentation
nav_order: 19
---

Backward Compatibility Rules
============================

There are a few simple rules, and a couple of exceptions.

- Requests: do not add mandatories (e.g. adding a new mandatory field, making an optional field mandatory)
- Responses: do not remove mandatories (e.g. remove a mandatory field, make a mandatory field optional)
- Do not change value types (e.g. int to string)

## Requests

Do not add mandatories.

| Operation | Verdict | Reason |
|-----------|---------|--------|
| Add a mandatory key | **incompatible** | Existing consumers must send a key that they were not sending before. |
| Add an optional key | compatible | Existing consumers are not sending this key anyway, but new consumers may do so. |
| Remove a mandatory key | **incompatible** (exception) | *EXCEPTION* Consumers can send the key but server will henceforth ignore it, which could break consumers assumptions. |
| Remove an optional key | **incompatible** (exception) | If consumers choose to send the key, the server will now ignore it, which could break consumers assumptions. |
| Optional key becomes mandatory | **incompatible** | Consumers who were not sending this key before will now be expected to send it. |
| Mandatory key becomes optional | compatible | Consumers who were not sending this key before will now be expected to send it. |

## Responses

Do not remove mandatories.

| Operation | Verdict | Reason |
|-----------|---------|--------|
| Add a mandatory key | compatible | Older consumers were not expecting this key and will ignore it. |
| Add an optional key | compatible | Older consumers were not expecting this key and will ignore it. The server may or may not send it, and consumers should be prepared for either. |
| Remove a mandatory key | **incompatible** | Older consumers were expecting this key, but henceforth the response will not contain it. |
| Remove an optional key | **incompatible** | In some cases, the server used to send this in the response. Henceforth it never will. |
| Optional key becomes mandatory | compatbile | Sometimes the server didn't send this key. But henceforth, the server will always send this key. Consumers who ignored it before can continue doing so. Consumers who checked for it before have code to handle it. |
| Mandatory key becomes optional | **incompatible** | It's possible that the server will not send this key. Some consumers may be expecting it, but will not be receiving it henceforth. |
