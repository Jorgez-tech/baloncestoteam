#!/bin/bash
# Script to delete the backup/antes-recuperacion branch
# Issue #5: Eliminar rama backup/antes-recuperacion

echo "🗑️  Deleting backup branch: backup/antes-recuperacion"
echo "This script will delete the remote branch that is no longer needed."
echo ""

# Check if the branch exists
if git ls-remote --heads origin backup/antes-recuperacion | grep -q backup/antes-recuperacion; then
    echo "✅ Branch backup/antes-recuperacion exists on remote"
    
    # Delete the remote branch
    echo "🔄 Deleting remote branch..."
    git push origin --delete backup/antes-recuperacion
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deleted remote branch backup/antes-recuperacion"
    else
        echo "❌ Failed to delete remote branch backup/antes-recuperacion"
        echo "Please ensure you have proper permissions and authentication."
        exit 1
    fi
else
    echo "ℹ️  Branch backup/antes-recuperacion does not exist on remote"
fi

echo ""
echo "📋 Remaining branches:"
git branch -r