---
layout: default
title: Configuring SAML SSO with Microsoft Entra
parent: Configuring SAML SSO
nav_order: 1
---

# Configuring SAML SSO with Microsoft Entra

This guide walks you through setting up SAML Single Sign-On (SSO) between Microsoft Entra ID and Specmatic Insights.

## Prerequisites

- Administrative access to Microsoft Entra ID
- Administrative access to your Specmatic Insights instance

## Step 1: Get SAML Configuration Values from Specmatic Insights

1. In your [Specmatic Insights instance](https://insights.specmatic.io), navigate to the [SAML SSO configuration](https://insights.specmatic.io/dashboard/settings/sso-configuration) section.
2. Copy the following values, which you'll need for the Entra configuration:
   - **Service Provider Entity ID**: `https://insights.specmatic.io/saml2/<RANDOM_CHARACTERS>`
   - **Assertion Consumer Service URL/SSO Redirect URL**: `https://insights.specmatic.io/login/saml2/sso/<RANDOM_CHARACTERS>`

## Step 2: Create Enterprise Application in Entra

1. Log in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
2. Navigate to **Entra ID** > **Enterprise Apps** in the left sidebar.
3. Click **New Application**.
4. Select **Create your own application**.
5. Enter the application name (e.g., "Specmatic Insights").
6. Select **Integrate any other application you don't find in the gallery (Non-gallery)**.
7. Click **Create**.

## Step 3: Configure SAML SSO in Entra

1. In your newly created application, go to **Single sign-on**.
2. Select **SAML** as the single sign-on method.
3. In the **Basic SAML Configuration** section, click **Edit**.
4. Enter the values you copied from Specmatic Insights in Step 1:
   - **Identifier (Entity ID)**: `https://insights.specmatic.io/saml2/<RANDOM_CHARACTERS>`
   - **Reply URL (Assertion Consumer Service URL)**: `https://insights.specmatic.io/login/saml2/sso/<RANDOM_CHARACTERS>`

   ![Entra SAML Configuration](/enterprise_onboarding/SSO/entra/01-entra-saml-config.png)
   *Figure 1: Configuring Basic SAML Settings in Microsoft Entra*

5. Click **Save**.

## Step 4: Get Entra Configuration Details and Configure Specmatic Insights

1. From the **SAML Certificates** section, copy the **App Federation Metadata URL**.

   ![Federation Metadata URL](/enterprise_onboarding/SSO/entra/02-federation-metadata-url.png)
   *Figure 2: Copy the App Federation Metadata URL from the SAML Certificates section*

3. Paste the **App Federation Metadata URL** from Microsoft Entra into the **Metadata URL** field in Specmatic Insights.

   ![Specmatic Insights Metadata URL](/enterprise_onboarding/SSO/entra/04-specmatic-insights-metadata-url.png)
   *Figure 3: Paste the App Federation Metadata URL into the Metadata URL field in Specmatic Insights*

4. From the **Set up Specmatic Insights** section from Microsoft Entra, copy the **Microsoft Entra Identifier**

   ![Microsoft Entra Identifier](/enterprise_onboarding/SSO/entra/03-microsoft-entra-identifier.png)
   *Figure 4: Copy the Microsoft Entra Identifier from the Set up Specmatic Insights section*

5. Paste the **Microsoft Entra Identifier** into the **Issuer URL** field in Specmatic Insights.

   ![Specmatic Insights Issuer URL](/enterprise_onboarding/SSO/entra/05-specmatic-insights-issuer-url.png)
   *Figure 5: Paste the Microsoft Entra Identifier into the Issuer URL field in Specmatic Insights*

6. Enable SAML SSO and save the configuration.

## Next Steps

After completing the configuration, test the SAML SSO integration by attempting to log in to Specmatic Insights using your Microsoft Entra credentials.
