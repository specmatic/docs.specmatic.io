---
layout: default
title: Rules
nav_exclude: true
search_exclude: true
---

# Rules

- [Rules](#rules)
    - [R1001](#r1001)
    - [R1002](#r1002)
    - [R1003](#r1003)
    - [R2001](#r2001)
    - [R2002](#r2002)
    - [R2003](#r2003)
    - [R3000](#r3000)
    - [R3001](#r3001)
    - [R3002](#r3002)
    - [R3003](#r3003)
    - [R3004](#r3004)


### R1001

Value mismatch

Suppose the spec says this:

```yaml
paths:
  /approvals/{id}:
    get:
      responses:
        '200':
          description: Approval status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApprovalStatus'
components:
  schemas:
    ApprovalStatus:
      type: object
      properties:
        status:
          type: string
          const: APPROVED
      required:
        - status
```

Expected response payload:

```json
{
  "status": "APPROVED"
}
```

_Note: The same expectation applies to requests reaching a Specmatic mock, or when validating examples as per the spec._

If the actual response contains:

```json
{
  "status": "PENDING"
}
```

Specmatic raises R1001 because the response breaks the `const` rule declared in the schema.

Why this is a problem

Downstream systems depend on the enumerated value to drive business flows. Returning an unexpected value confuses consumers and causes conditional logic to fail.

How it can be fixed

Return the exact value mandated by the contract.

Corrected response:

```json
{
  "status": "APPROVED"
}
```

### R1002

Type mismatch

Suppose the spec says this:

```yaml
paths:
  /customers:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CustomerReference'
      responses:
        '201':
          description: Customer created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerReference'
components:
  schemas:
    CustomerReference:
      type: object
      properties:
        customerId:
          type: integer
      required:
        - customerId
```

Expected request payload:

```json
{
  "customerId": 12345
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "customerId": "12345"
}
```

Specmatic raises R1002 because the field is a string instead of the integer type that the contract specifies.

Why this is a problem

Type mismatches break deserialization and validation logic, often causing requests to be rejected or data to be stored incorrectly.

How it can be fixed

Send the value using the data type defined in the specification.

Corrected request:

```json
{
  "customerId": 12345
}
```

### R1003

Constraint violation

Suppose the spec says this:

```yaml
paths:
  /orders:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderIdentifier'
      responses:
        '201':
          description: Order created
components:
  schemas:
    OrderIdentifier:
      type: object
      properties:
        orderId:
          type: string
          pattern: ^INV-[0-9]{6}$
      required:
        - orderId
```

Expected request payload:

```json
{
  "orderId": "INV-000001"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "orderId": "INV-1"
}
```

Specmatic raises R1003 because the value fails the regular-expression constraint declared for `orderId`.

Why this is a problem

Constraint violations lead to inconsistent identifiers and cause downstream services to reject the payload or misroute it.

How it can be fixed

Emit values that meet every constraint defined in the schema.

Corrected request:

```json
{
  "orderId": "INV-000001"
}
```

### R2001

Missing required property

Suppose the spec says this:

```yaml
paths:
  /contacts:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Contact'
      responses:
        '201':
          description: Contact created
components:
  schemas:
    Contact:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string
          format: email
```

Expected request payload:

```json
{
  "name": "Leela Fry",
  "email": "leela@example.com"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "name": "Leela Fry"
}
```

Specmatic raises R2001 because the required `email` property is missing.

Why this is a problem

Consumers expect required fields to be present so that essential processing (like sending notifications) can proceed without guessing or defaulting.

How it can be fixed

Always include every property listed in the `required` array.

Corrected request:

```json
{
  "name": "Leela Fry",
  "email": "leela@example.com"
}
```

### R2002

Missing optional property

Suppose the spec says this:

```yaml
paths:
  /users:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfile'
      responses:
        '201':
          description: User created
components:
  schemas:
    UserProfile:
      type: object
      required:
        - username
      properties:
        username:
          type: string
        nickname:
          type: string
          description: Required when SSO integration is enabled.
      example:
        username: bender
        nickname: "Bender Bending Rodríguez"
```

Expected request payload (when SSO is enabled):

```json
{
  "username": "bender",
  "nickname": "Bender Bending Rodríguez"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "username": "bender"
}
```

Specmatic raises R2002 because the interaction scenario (SSO enabled) describes `nickname`, yet the request omits it.

Why this is a problem

Scenario-specific optional fields still carry essential context. Omitting them when required by the example or description leads to incomplete user profiles.

How it can be fixed

Include optional properties whenever the documented scenario dictates their presence.

Corrected request:

```json
{
  "username": "bender",
  "nickname": "Bender Bending Rodríguez"
}
```

### R2003

Unknown property

Suppose the spec says this:

```yaml
paths:
  /entities/{id}:
    get:
      responses:
        '200':
          description: Entity details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/KnownFieldsOnly'
components:
  schemas:
    KnownFieldsOnly:
      type: object
      additionalProperties: false
      properties:
        id:
          type: integer
```

Expected response payload:

```json
{
  "id": 42
}
```

_Note: The same expectation applies to requests reaching a Specmatic mock, or when validating examples as per the spec._

If the actual response contains:

```json
{
  "id": 42,
  "unexpected": true
}
```

Specmatic raises R2003 because the payload introduces `unexpected`, which the contract forbids via `additionalProperties: false`.

Why this is a problem

Undocumented fields create ambiguity—clients might ignore them or throw errors, leading to unpredictable integrations.

How it can be fixed

Send only the properties defined in the contract, or extend the specification before emitting extra fields.

Corrected response:

```json
{
  "id": 42
}
```

### R3000

Discriminator mismatch

Suppose the spec says this:

```yaml
paths:
  /payments:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Payment'
      responses:
        '202':
          description: Payment accepted
components:
  schemas:
    Payment:
      type: object
      oneOf:
        - $ref: '#/components/schemas/CardPayment'
        - $ref: '#/components/schemas/BankTransferPayment'
      discriminator:
        propertyName: type
        mapping:
          card: '#/components/schemas/CardPayment'
          bank-transfer: '#/components/schemas/BankTransferPayment'
    CardPayment:
      type: object
      required:
        - type
        - cardNumber
      properties:
        type:
          type: string
          const: card
        cardNumber:
          type: string
    BankTransferPayment:
      type: object
      required:
        - type
        - accountNumber
      properties:
        type:
          type: string
          const: bank-transfer
        accountNumber:
          type: string
```

Expected request payload:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "type": "bank-transfer",
  "cardNumber": "4111111111111111"
}
```

Specmatic raises R3000 because the discriminator points to the `BankTransferPayment` schema while the payload fields belong to the card branch.

Why this is a problem

Polymorphic contracts rely on discriminators to choose the correct schema. A mismatch means the payload cannot be validated or processed correctly.

How it can be fixed

Set the discriminator to the branch that matches the payload structure.

Corrected request:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

### R3001

Missing discriminator

Suppose the spec says this:

```yaml
paths:
  /payments:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Payment'
      responses:
        '202':
          description: Payment accepted
components:
  schemas:
    Payment:
      type: object
      required:
        - type
      oneOf:
        - $ref: '#/components/schemas/CardPayment'
        - $ref: '#/components/schemas/BankTransferPayment'
      discriminator:
        propertyName: type
```

Expected request payload:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "cardNumber": "4111111111111111"
}
```

Specmatic raises R3001 because the discriminator property `type` is absent, leaving the validator unable to pick a schema.

Why this is a problem

Without the discriminator, polymorphic payloads cannot be resolved to a concrete schema, so validation has no reference point.

How it can be fixed

Include the discriminator property specified by the contract alongside branch-specific fields.

Corrected request:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

### R3002

Property not in any schema options

Suppose the spec says this:

```yaml
paths:
  /payments:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              oneOf:
                - $ref: '#/components/schemas/CardPayment'
                - $ref: '#/components/schemas/BankTransferPayment'
      responses:
        '202':
          description: Payment accepted
components:
  schemas:
    CardPayment:
      type: object
      required:
        - type
        - cardNumber
      properties:
        type:
          type: string
          const: card
        cardNumber:
          type: string
    BankTransferPayment:
      type: object
      required:
        - type
        - wireReference
      properties:
        type:
          type: string
          const: bank-transfer
        wireReference:
          type: string
```

Expected request payload (card branch):

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "type": "card",
  "wireReference": "ABC123"
}
```

Specmatic raises R3001 because `wireReference` belongs to the bank transfer schema, yet the discriminator selects the card branch.

Why this is a problem

Mixing properties from different schema options means no branch can validate the payload, leaving the consumer unsure how to interpret it.

How it can be fixed

Send only the properties defined for the selected schema option.

Corrected request:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

### R3003

Property matches no schema option

Suppose the spec says this:

```yaml
paths:
  /payments:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CardPayment'
      responses:
        '202':
          description: Payment accepted
components:
  schemas:
    CardPayment:
      type: object
      required:
        - type
        - cardNumber
      properties:
        type:
          type: string
          const: card
        cardNumber:
          type: string
          pattern: ^\d{16}$
```

Expected request payload:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

_Note: The same validation applies when a contract test matches the response coming from the application to the spec, or when validating examples as per the spec._

If the actual request contains:

```json
{
  "type": "card",
  "cardNumber": "123"
}
```

Specmatic raises R3002 because the provided values fail to satisfy the constraints of any schema option; the card branch rejects the short number, while other branches expect different discriminators.

Why this is a problem

When no schema option matches, the consumer cannot map the payload to a valid business object, so processing stops.

How it can be fixed

Adjust the values so they comply with at least one schema option's requirements.

Corrected request:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

### R3004

No matching schema option

Suppose the spec says this:

```yaml
paths:
  /payments/{paymentId}:
    get:
      responses:
        '200':
          description: Payment details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'
components:
  schemas:
    Payment:
      type: object
      oneOf:
        - $ref: '#/components/schemas/CardPayment'
        - $ref: '#/components/schemas/BankTransferPayment'
      discriminator:
        propertyName: type
        mapping:
          card: '#/components/schemas/CardPayment'
          bank-transfer: '#/components/schemas/BankTransferPayment'
```

Expected response payload (card option):

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

_Note: The same expectation applies to requests reaching a Specmatic mock, or when validating examples as per the spec._

If the actual response contains:

```json
{
  "type": "crypto",
  "wallet": "xyz"
}
```

Specmatic raises R3003 because the discriminator references an option (`crypto`) that the specification does not define.

Why this is a problem

Unsupported discriminator values leave consumers without a schema to validate against, so the payload cannot be trusted or processed.

How it can be fixed

Return a payload that matches a documented option, or extend the specification with a new schema before using the new discriminator.

Corrected response:

```json
{
  "type": "card",
  "cardNumber": "4111111111111111"
}
```

