# Ready-to-Use docusaurus.config.js

## Quick Instructions

Simply copy the contents of `READY_TO_USE_docusaurus.config.js` and paste it into your specmatic-documentation repository as `docusaurus.config.js`.

## What's Included

✅ **48 redirect configurations**  
✅ **216 redirect paths** (all with both .html and non-.html versions)  
✅ **Correct underscore paths** (e.g., `contract_driven_development` not `contract-driven-development`)  
✅ **All targets verified** to exist in specmatic-documentation  
✅ **JavaScript syntax validated**

## Path Format

All redirect paths use **underscores** to match the actual file structure in specmatic-documentation:

- ✅ `/docs/contract_driven_development/backward_compatibility/`
- ✅ `/docs/enterprise_onboarding/license_key/`
- ✅ `/docs/features/hooks/hooks_to_modify_specs/`
- ✅ `/docs/features/json_schema/anyOf_support/`

## Redirect Examples

Each redirect has both .html and non-.html versions:

```javascript
{
  from: [
    '/backward_compatibility',
    '/backward_compatibility.html',
    '/documentation/backward_compatibility',
    '/documentation/backward_compatibility.html',
    '/documentation/tutorials/backward_compatibility',
    '/documentation/tutorials/backward_compatibility.html'
  ],
  to: '/docs/contract_driven_development/backward_compatibility/'
}
```

## How to Use

1. Open `READY_TO_USE_docusaurus.config.js` in this repository
2. Copy the entire file contents
3. In your specmatic-documentation repository, open (or create) `docusaurus.config.js`
4. Paste the contents
5. Save the file
6. Done!

## File Location

The file is ready at:
```
/home/runner/work/docs.specmatic.io/docs.specmatic.io/READY_TO_USE_docusaurus.config.js
```

Or download from the GitHub PR in this branch: `copilot/configure-redirects-from-docs`

## Notes

- All redirect targets have been verified to exist in the specmatic-documentation repository
- Missing pages (configuration_v1, older_configuration_versions, stubbing-kafka) are redirected to appropriate alternatives
- The file includes all necessary Docusaurus configuration, not just redirects
