---
layout: default
title: Rules
nav_exclude: true
search_exclude: true
---

# Rules

### R1001

**Type mismatch**

The value type does not match the expected type defined in the specification.

**Why this is a problem**

Type mismatches cause validation failures and make clients/providers interpret data incorrectly.

Example:

```yaml
type: object
required:
  - price
properties:
  price:
    type: number
```

Response from provider during a contract test:

```json
{"price": "9.99"}
```

When validating the response from the provider, `price` is a string instead of a number, so the contract test reports a type mismatch.

**How this can be resolved**

- Update the provider to return a numeric `price`, not a string.
- If the string is correct, update the specification to accept a string type.

### R1002

**Value mismatch**

The value does not match the expected value defined in the specification.

**Why this is a problem**

Exact-value expectations (like enums or consts) are used to guarantee fixed semantics; mismatches break downstream logic.

Example:

```yaml
type: object
required:
  - status
properties:
  status:
    type: string
    enum: [created, confirmed]
```

Request from consumer to stub:

```json
{"status": "pending"}
```

During validation of the request from consumer to stub, `status` is not one of the allowed enum values, so a value mismatch is reported.

**How this can be resolved**

- Send a value that matches the specification enum.
- If the new value is valid, update the specification enum to include it.

### R1003

**Constraint violation**

The value does not satisfy the constraints defined in the specification.

**Why this is a problem**

Constraints like length, pattern, or range protect clients and providers from invalid or out-of-bounds data.

Example:

```yaml
type: object
required:
  - username
properties:
  username:
    type: string
    minLength: 6
```

Request from consumer to stub:

```json
{"username": "amy"}
```

The request from consumer to stub is validated and fails because `username` is shorter than the minimum length.

**How this can be resolved**

- Provide values that satisfy the constraint (e.g., a longer `username`).
- If the constraint is too strict, relax it in the specification.

### R2001

**Missing required property**

A required property defined in the specification is missing.

**Why this is a problem**

Required properties are essential for processing; missing them can make behavior ambiguous or incorrect.

Example:

```yaml
type: object
required:
  - email
properties:
  email:
    type: string
  name:
    type: string
```

Request from consumer to stub:

```json
{"name": "Maya"}
```

Request validation fails because `email` is required but missing.

**How this can be resolved**

- Include all required properties in the payload.
- If the property should not be required, update the specification.

### R2002

**Missing optional property**

An optional property defined in the specification is missing.

**Why this is a problem**

In strict validation modes where optional properties are treated as mandatory, missing optional data can hide partial responses.

Example:

```yaml
type: object
required:
  - id
properties:
  id:
    type: integer
  description:
    type: string
```

Response from provider during a contract test (with optional fields treated as mandatory):

```json
{"id": 101}
```

When optional fields are enforced, the missing `description` is reported as an optional property missing violation.

**How this can be resolved**

- Provide the optional property when running with strict key checking.
- If strict checking is not intended, run with the default optional behavior.
- If the property should be required, mark it as required in the specification.

### R2003

**Unknown property**

A property was found that is not defined in the specification.

**Why this is a problem**

Unexpected properties can signal drift between provider behavior and the specification, and may not be handled by clients.

Example:

```yaml
type: object
additionalProperties: false
required:
  - id
properties:
  id:
    type: integer
  status:
    type: string
```

Payload being validated:

```json
{"id": 5, "status": "active", "extra": "debug"}
```

During response validation, `extra` is not defined and `additionalProperties: false` disallows it, so an unknown property violation is reported.

**How this can be resolved**

- Remove unexpected properties from the payload.
- If the property is valid, add it to the specification or allow additional properties.

### R3001

**Discriminator mismatch**

The value provided does not match the discriminator defined in the specification.

**Why this is a problem**

Discriminators determine which schema applies; an unknown discriminator value makes the payload ambiguous.

Example:

```yaml
oneOf:
  - $ref: "#/components/schemas/Cat"
  - $ref: "#/components/schemas/Dog"
discriminator:
  propertyName: type
  mapping:
    Cat: "#/components/schemas/Cat"
    Dog: "#/components/schemas/Dog"
components:
  schemas:
    Cat:
      type: object
      required:
        - type
        - whiskers
      properties:
        type:
          type: string
        whiskers:
          type: integer
    Dog:
      type: object
      required:
        - type
        - bark
      properties:
        type:
          type: string
        bark:
          type: boolean
```

Request from consumer to stub:

```json
{"type": "Parrot", "beakLength": 10}
```

The discriminator value does not match any mapping, so validation of the request from consumer to stub reports a discriminator mismatch.

**How this can be resolved**

- Use a discriminator value that maps to a defined schema.
- If a new subtype is needed, add it to the specification and discriminator mapping.

### R3002

**Invalid discriminator setup**

The discriminator property defined in the specification is missing from the subschemas.

**Why this is a problem**

If subschemas do not define the discriminator property, validation cannot reliably select the correct schema.

Example:

```yaml
oneOf:
  - $ref: "#/components/schemas/Cat"
  - $ref: "#/components/schemas/Dog"
discriminator:
  propertyName: type
  mapping:
    Cat: "#/components/schemas/Cat"
    Dog: "#/components/schemas/Dog"
components:
  schemas:
    Cat:
      type: object
      required:
        - whiskers
      properties:
        whiskers:
          type: integer
    Dog:
      type: object
      required:
        - bark
      properties:
        bark:
          type: boolean
```

Request from consumer to stub:

```json
{"type": "Cat", "whiskers": 3}
```

The discriminator is declared, but neither subschema defines the `type` property, so the discriminator setup is invalid.

**How this can be resolved**

- Add the discriminator property to each subschema and mark it required.
- Ensure the discriminator mapping values align with the schema definitions.

### R3003

**Missing discriminator**

The discriminator property defined in the specification is missing.

**Why this is a problem**

Without the discriminator property, a composed schema cannot determine which subschema should apply.

Example:

```yaml
oneOf:
  - $ref: "#/components/schemas/Cat"
  - $ref: "#/components/schemas/Dog"
discriminator:
  propertyName: type
  mapping:
    Cat: "#/components/schemas/Cat"
    Dog: "#/components/schemas/Dog"
components:
  schemas:
    Cat:
      type: object
      required:
        - type
        - whiskers
      properties:
        type:
          type: string
        whiskers:
          type: integer
    Dog:
      type: object
      required:
        - type
        - bark
      properties:
        type:
          type: string
        bark:
          type: boolean
```

Request from consumer to stub:

```json
{"whiskers": 3}
```

The payload lacks the discriminator property `type`, so validation reports a missing discriminator.

**How this can be resolved**

- Include the discriminator property in the payload.
- If the discriminator is not needed, remove it and adjust the composed schema.

### R3004

**Property not in any schema options**

The property is not defined in any available schema options.

**Why this is a problem**

With `anyOf`, a property that does not exist in any option indicates the payload does not match the allowed shapes.

Example:

```yaml
anyOf:
  - $ref: "#/components/schemas/OptionA"
  - $ref: "#/components/schemas/OptionB"
components:
  schemas:
    OptionA:
      type: object
      properties:
        a:
          type: string
    OptionB:
      type: object
      properties:
        b:
          type: number
```

Request payload being validated:

```json
{"c": 10}
```

During validation of the request from consumer to stub, `c` is not present in any `anyOf` option, so the property not in any schema options violation is reported.

**How this can be resolved**

- Send a payload that matches at least one `anyOf` option.
- If `c` is valid, add it to one of the option schemas or add another option.

### R3005

**Property matches no schema option**

The property does not satisfy any available schema options.

**Why this is a problem**

Even if a property exists in multiple options, it must still satisfy at least one option's constraints.

Example:

```yaml
anyOf:
  - $ref: "#/components/schemas/StringOption"
  - $ref: "#/components/schemas/NumberOption"
components:
  schemas:
    StringOption:
      type: object
      properties:
        common:
          type: string
    NumberOption:
      type: object
      properties:
        common:
          type: number
```

Request from consumer to stub:

```json
{"common": true}
```

The property exists in both options but does not match either type, so validation reports no matching schema option.

**How this can be resolved**

- Provide a value that satisfies one of the schema options.
- If boolean is valid, update the specification to allow it.
