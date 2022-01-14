Copy paste below text into a file with name "service.yaml". This, as you can see, uses the Gherkin syntax to describe a basic GET request. 

    ---
    openapi: "3.0.1"
    info:
      title: "Contract for the petstore service"
      version: "1"
    paths:
      /pets/{petid}:
        get:
          summary: "Should be able to get a pet by petId"
          parameters:
            - name: "petid"
              in: "path"
              required: true
              schema:
                type: "number"
          responses:
            "200":
              description: "Should be able to get a pet by petId"
              content:
                application/json:
                  schema:
                    required:
                      - "id"
                      - "name"
                      - "status"
                      - "type"
                    properties:
                      id:
                        type: "number"
                      name:
                        type: "string"
                      type:
                        type: "string"
                      status:
                        type: "string"
