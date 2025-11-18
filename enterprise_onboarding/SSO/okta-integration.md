---
layout: default
title: Configuring SAML SSO with Okta
parent: Configuring SAML SSO
nav_order: 2
---

{% include sso-integration-intro.md idp_product_name="Okta" %}

## Step 2: Create SAML Application in Okta

1. Log in to your Okta Admin Console.
2. Navigate to **Applications** > **Applications**.
3. Click **Create App Integration**.
4. Select **SAML 2.0** and click **Next**.
5. Enter the application name (e.g., "Specmatic Insights") and click **Next**.
6. In the **SAML Settings** section, enter the values you copied from Specmatic Insights in Step 1:
   - **Single sign on URL**: `https://insights.specmatic.io/login/saml2/sso/<RANDOM_CHARACTERS>`
   - Ensure that the **Use this for Recipient URL and Destination URL** option is checked.
   - **Audience URI (SP Entity ID)**: `https://insights.specmatic.io/saml2/<RANDOM_CHARACTERS>`

    ![Okta SAML Settings](/enterprise_onboarding/SSO/okta/01-okta-saml-config.png)
  *Figure 1: Configuring SAML Settings in Okta*
7. Ensure that the following attribute statements are configured:
   - **Name ID Format**: `Unspecified`
   - **Application Username**: `Email`
8. Click **Next**, then **Finish** to create the application.


## Step 3. Get Okta Configuration Details and Configure Specmatic Insights

1. In your Okta application, go to the **Sign On** tab.
2. Copy the **Metadata URL** from the **SAML 2.0** section of the Okta application.
3. Paste the **Metadata URL** URL from Okta into the **Metadata URL** field in Specmatic Insights SSO configuration.
4. Copy the **Issuer** from the **SAML 2.0** section of the Okta application.
5. Paste the **Issuer** into the **Identity Provider Entity ID** field in Specmatic Insights SSO configuration.
6. Enable SAML SSO and save the configuration.

## Step 4: Assign Users to the Okta Application

1. In your Okta application, go to the **Assignments** tab.
2. Click **Assign** and choose **Assign to People** or **Assign to Groups**
3. Select the users or groups that should have access to Specmatic Insights.
4. Click **Assign** to confirm the assignments.
5. Click **Done** to finish the assignment process.

## Step 5: Test the SAML SSO Integration

{% include sso-integration-test-steps.md idp_product_name="Okta" %}

{% include sso-integration-troubleshooting-checklist.md
   idp_product_name="Okta"
   idp_metadata_url_name="Metadata URL" %}
