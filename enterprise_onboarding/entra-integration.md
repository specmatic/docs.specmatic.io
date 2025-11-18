---
layout: default
title: Configuring SAML SSO with Microsoft Entra
parent: Enterprise Onboarding
nav_order: 3
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
2. Navigate to **Entra ID** > **Enterprise Applications** in the left sidebar.
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

   ![Entra SAML Configuration](/enterprise_onboarding/entra/01-entra-saml-config.png)

5. Click **Save**.

## Step 4: Get Entra Configuration Details

1. From the **SAML Certificates** section, copy the **App Federation Metadata URL**.

   ![Federation Metadata URL](/enterprise_onboarding/entra/02-federation-metadata-url.png)

2. From the **Set up Specmatic Insights** section, copy the **Microsoft Entra Identifier**.

   ![Microsoft Entra Identifier](/enterprise_onboarding/entra/03-microsoft-entra-identifier.png)

## Step 5: Configure Specmatic Insights

1. In your Specmatic Insights instance, navigate to the SAML SSO configuration section.
2. Paste the **App Federation Metadata URL** into the **Metadata URL** field.

   ![Specmatic Insights Metadata URL](/enterprise_onboarding/entra/04-specmatic-insights-metadata-url.png)

3. Paste the **Microsoft Entra Identifier** into the **Issuer URL** field.

   ![Specmatic Insights Issuer URL](/enterprise_onboarding/entra/05-specmatic-insights-issuer-url.png)

4. Enable SAML SSO and save the configuration.

## Next Steps

After completing the configuration, test the SAML SSO integration by attempting to log in to Specmatic Insights using your Microsoft Entra credentials.
