

# Configuring SAML SSO with {{ include.idp_product_name }}

This guide walks you through setting up SAML Single Sign-On (SSO) between {{ include.idp_product_name }} and Specmatic Insights.


## Prerequisites

- Administrative access to {{ include.idp_product_name }}
- Administrative access to your Specmatic Insights instance

## Step 1: Get SAML Configuration Values from Specmatic Insights

1. In your [Specmatic Insights instance](https://insights.specmatic.io), navigate to the [SAML SSO configuration](https://insights.specmatic.io/dashboard/settings/sso-configuration) section.
2. Copy the following values, which you'll need for the {{ include.idp_product_name }} configuration:
   - **Service Provider Entity ID**: `https://insights.specmatic.io/saml2/<RANDOM_CHARACTERS>`
   - **Assertion Consumer Service URL/SSO Redirect URL**: `https://insights.specmatic.io/login/saml2/sso/<RANDOM_CHARACTERS>`
