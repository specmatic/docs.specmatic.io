## Troubleshooting

> **Tip:** If you encounter issues during setup or login, check the following common problems:

### SAML Configuration Issues

- **Invalid Entity ID or Reply URL**: Double-check that the values from Specmatic Insights exactly match what's configured in {{ include.idp_product_name }}.
- **Metadata URL not accessible**: Ensure the {{ include.idp_metadata_url_name }} from {{ include.idp_product_name }} is publicly accessible and correctly copied.
- **Certificate issues**: If using custom certificates, verify they are valid and properly configured.

### User Access Issues

- **User not assigned**: Ensure users are assigned to the application in {{ include.idp_product_name }} (Step 6).
- **User attributes missing**: Verify that required user attributes (email, name) are being sent in the SAML response.
- **User doesn't exist in Specmatic Insights**: Some SSO configurations require users to be pre-created in the target application.

### Authentication Flow Issues

- **Redirect loops**: Check that the Reply URL in {{ include.idp_product_name }} exactly matches the Assertion Consumer Service URL from Specmatic Insights.
- **Invalid SAML response**: Use browser developer tools to inspect SAML responses for error messages.
- **Clock skew**: Ensure system clocks are synchronized between {{ include.idp_product_name }} and Specmatic Insights servers.

### Testing and Validation

- **Use SAML tracer tools**: Browser extensions like SAML-tracer can help debug SAML authentication flows.
- **Check {{ include.idp_product_name }} sign-in logs**: Review the sign-in logs in {{ include.idp_product_name }} admin center for error details.
- **Verify Specmatic Insights logs**: Check application logs for SAML processing errors.

For additional help with SAML SSO configuration, consult the [Specmatic Insights documentation](/enterprise_onboarding/insights.html) or contact [Specmatic support](https://support.specmatic.io/support/login).
## Troubleshooting

> **Tip:** If you encounter issues during setup or login, check the following common problems:

### SAML Configuration Issues

- **Invalid Entity ID or Reply URL**: Double-check that the values from Specmatic Insights exactly match what's configured in {{ include.idp_product_name }}.
- **Metadata URL not accessible**: Ensure the {{ include.idp_metadata_url_name }} from {{ include.idp_product_name }} is publicly accessible and correctly copied.
- **Certificate issues**: If using custom certificates, verify they are valid and properly configured.

### User Access Issues

- **User not assigned**: Ensure users are assigned to the application in {{ include.idp_product_name }} (Step 6).
- **User attributes missing**: Verify that required user attributes (email, name) are being sent in the SAML response.
- **User doesn't exist in Specmatic Insights**: Some SSO configurations require users to be pre-created in the target application.

### Authentication Flow Issues

- **Redirect loops**: Check that the Reply URL in {{ include.idp_product_name }} exactly matches the Assertion Consumer Service URL from Specmatic Insights.
- **Invalid SAML response**: Use browser developer tools to inspect SAML responses for error messages.
- **Clock skew**: Ensure system clocks are synchronized between {{ include.idp_product_name }} and Specmatic Insights servers.

### Testing and Validation

- **Use SAML tracer tools**: Browser extensions like SAML-tracer can help debug SAML authentication flows.
- **Check {{ include.idp_product_name }} sign-in logs**: Review the sign-in logs in {{ include.idp_product_name }} admin center for error details.
- **Verify Specmatic Insights logs**: Check application logs for SAML processing errors.

For additional help with SAML SSO configuration, consult the [Specmatic Insights documentation](/enterprise_onboarding/insights.html) or contact [Specmatic support](https://support.specmatic.io/support/login).
