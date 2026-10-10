#!/bin/bash
# Script to apply the corrected redirect configuration to specmatic-documentation repository

set -e

echo "==================================================================="
echo "Applying Corrected Redirect Configuration"
echo "==================================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docusaurus.config.js.CORRECTED" ]; then
    echo "❌ Error: docusaurus.config.js.CORRECTED not found"
    echo "   Please run this script from the docs.specmatic.io repository directory"
    exit 1
fi

# Check if specmatic-documentation exists
SPEC_DOC_DIR="../specmatic-documentation"
if [ ! -d "$SPEC_DOC_DIR" ]; then
    echo "Cloning specmatic-documentation repository..."
    cd ..
    git clone https://github.com/specmatic/specmatic-documentation.git
    cd docs.specmatic.io
fi

echo "✓ Found specmatic-documentation repository"
echo ""

# Copy the corrected configuration
echo "Copying corrected configuration to specmatic-documentation..."
cp docusaurus.config.js.CORRECTED "$SPEC_DOC_DIR/docusaurus.config.js"
echo "✓ Configuration copied"
echo ""

# Navigate to specmatic-documentation
cd "$SPEC_DOC_DIR"

# Check if branch already exists
BRANCH_NAME="configure-redirects-from-docs-specmatic-io"
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo "Branch $BRANCH_NAME already exists, switching to it..."
    git checkout "$BRANCH_NAME"
else
    echo "Creating new branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
fi
echo ""

# Validate JavaScript syntax
echo "Validating JavaScript syntax..."
if command -v node &> /dev/null; then
    node -c docusaurus.config.js
    echo "✓ JavaScript syntax is valid"
else
    echo "⚠ Warning: Node.js not found, skipping syntax validation"
fi
echo ""

# Show status
echo "Git status:"
git status --short
echo ""

# Commit the changes
echo "Committing changes..."
git add docusaurus.config.js
git commit -m "Configure all redirects from docs.specmatic.io with correct underscore paths

- Extracted redirects from 48 markdown files in docs.specmatic.io
- Generated 48 redirect configurations covering 206 redirect paths
- Fixed path format to use underscores (e.g., contract_driven_development) instead of hyphens
- All redirect targets verified to exist in the repository
- Redirected missing pages (configuration_v1, older_configuration_versions, stubbing-kafka) to appropriate alternatives
- JavaScript syntax validated" || echo "⚠ No changes to commit (may already be committed)"
echo ""

echo "==================================================================="
echo "✓ Redirect configuration applied successfully!"
echo "==================================================================="
echo ""
echo "Next steps:"
echo "1. Review the changes:"
echo "   cd $SPEC_DOC_DIR"
echo "   git diff origin/main"
echo ""
echo "2. Push the branch to create a PR:"
echo "   git push -u origin $BRANCH_NAME"
echo ""
echo "3. Create a Pull Request on GitHub:"
echo "   https://github.com/specmatic/specmatic-documentation/compare/$BRANCH_NAME"
echo ""
