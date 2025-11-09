---
layout: default
title: Enterprise Onboarding
nav_order: 6
has_children: true
has_toc: false
---

# Onboarding Resources for Enterprise Users

<!-- TOC -->
* [Onboarding Resources for Enterprise Users](#onboarding-resources-for-enterprise-users)
  * [Getting started](#getting-started)
  * [Specmatic Insights & Licensing Setup Options](#specmatic-insights--licensing-setup-options)
    * [1\. License Setup Options](#1-license-setup-options)
      * [Option A: Offline License (No Insights Integration)](#option-a-offline-license-no-insights-integration)
      * [Option B: Use Specmatic Insights](#option-b-use-specmatic-insights-)
    * [2\. User Provisioning Options (for Insights Users)](#2-user-provisioning-options-for-insights-users-)
      * [SSO Integration](#sso-integration)
      * [Manual (Backend) User Provisioning](#manual-backend-user-provisioning)
    * [3\. Recommended Approach for New Customers](#3-recommended-approach-for-new-customers-)
    * [Summary of the Options](#summary-of-the-options)
  * [Provisioning and Using Specmatic License Keys](#provisioning-and-using-specmatic-license-keys)
  * [Insights Set Up Guide](#insights-set-up-guide)
<!-- TOC -->

## Getting started
On successful completion of the [POC](https://specmatic.io/2-week-signup/), and once your organisation issues the Purchase Order, we can start onboarding your users on the platform.

As an Enterprise, the main decision you have to make is how you would like to onboard your users.

## Specmatic Insights & Licensing Setup Options

Specmatic offers flexible options for setting up **Insights** and managing **licenses** based on your organisation’s security and infrastructure requirements.

### 1\. License Setup Options

#### Option A: Offline License (No Insights Integration)

 * A single organisation-wide license is provided.
 * The license is embedded within the Docker image and shared across all users, including CI environments.
 * Please refer to the [Offline License Setup Guide](/enterprise_onboarding/offline_license_set_up.html) for detailed instructions.
 * **Note:** Individual user-level usage tracking is not available in this mode.

####  Option B: Use Specmatic Insights 

Gain visibility into license usage and user activity through Specmatic Insights.

You can choose between:

1.  **Self-Hosted Insights (On-Premises)** – host and manage the Insights instance within your infrastructure.

2.  **Specmatic Hosted Insights (SaaS)** – use our secure cloud-hosted Insights service.


###  2\. User Provisioning Options (for Insights Users) 

If you’re using Specmatic Insights, there are two ways to onboard users:

#### SSO Integration

  *   Users can sign in directly using your organisation’s Single Sign-On (SSO).
  *   Ideal for enterprises with established identity management systems via SAML

#### Manual (Backend) User Provisioning

  *   Share a list of user email IDs with the Specmatic team.
  *   We will create accounts and send each user their login credentials via email.

###  3\. Recommended Approach for New Customers 

For organisations **without immediate InfoSec clearance**:

1.  Start with the **Specmatic Hosted Insights (SaaS)** setup.

2.  Use **manual user provisioning** by sharing an email list for account creation.

3.  In parallel, begin your **InfoSec clearance** process.

4.  Once approved, you can **migrate to SSO** or **switch to a self-hosted Insights instance** if desired.

### Summary of the Options

| Mode            | Deployment                    | Description                                                                             | User Provisioning Options       | Usage Tracking                           | Pros                                                                                                              | Cons                                                                                                                                                                                                                                         | Recommended For                                                 |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Offline License | Not Applicable                | One blanket license embedded in Docker and shared across all users and CI environments. | Not Applicable                  | ❌ None (no per-user data)                |  \* Easiest setup<br> \* No external dependencies                                                                 |  \* No usage analytics<br> \* No user-level control<br> \* Not suited for enterprise tracking<br> \* Everytime a new version of Specmatic Docker is released, new docker image would need to be built and pushed to internal Docker registry | Air-gapped or restricted environments needing an offline setup. |
| Insights        | On-Prem                       | Self-host the Insights service within your infrastructure.                              | SSO integration                 | ✅ Fine-grained per-user & group tracking |  \* Full control over data & infra<br> \* Integrates with internal systems<br> \* Enables detailed usage insights |  \* Requires infra provisioning & maintenance<br> \* Longer initial setup<br> \* Customer is responsible for regularly updating and maintaining Insights server                                                                              | Enterprises with strict InfoSec or data residency requirements. |
| Insights        | SaaS<br>(Hosted by Specmatic) | Use Specmatic’s secure cloud-hosted Insights service.                                   | Manual (email-based) onboarding | ✅ Fine-grained per-user & group tracking |  \* Fastest setup<br> \* Fully managed by Specmatic                                                               |  \* Contract Test run and API Spec meta-data is saved in the cloud                                                                                                                                                                           | Most new customers.                                             |
| Insights        | SaaS<br>(Hosted by Specmatic) | Use Specmatic’s secure cloud-hosted Insights service.                                   | SSO integration                 | ✅ Fine-grained per-user & group tracking |  \* Fully managed by Specmatic<br>  \* Easy to scale                                                              |  \* Contract Test run and API Spec meta-data is saved in the cloud<br> \* May need InfoSec clearance for production rollout                                                                                                                  | Customers with InfoSec clearance.                               |

## [Provisioning and Using Specmatic License Keys](/enterprise_onboarding/license_key.html)

## [Insights Set Up Guide](/enterprise_onboarding/insights.html)