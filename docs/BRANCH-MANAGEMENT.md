# Branch Management - Basketball Team

## Current Branch Status

### Active Branches
- **main** (7ae30705) - Primary development branch
- **copilot/fix-5** (e445ff62) - Current feature branch for issue fixes
- **chore/limpieza-rutas-estructura** (e18b4284) - Code cleanup and structure improvements

### Branches to be Deleted
- **backup/antes-recuperacion** (d5a48464) - **SCHEDULED FOR DELETION**

## Branch Deletion Instructions

### Issue #5: Delete backup/antes-recuperacion branch

**Reason**: The `backup/antes-recuperacion` branch is a temporary backup that is no longer needed.

**Manual Deletion** (requires repository admin privileges):
```bash
# Delete the remote branch
git push origin --delete backup/antes-recuperacion
```

**Automated Deletion** (using the provided script):
```bash
# Run the deletion script
./scripts/delete-backup-branch.sh
```

### Branch Cleanup Policy

1. **Backup branches**: Should be deleted after successful recovery/migration
2. **Feature branches**: Should be deleted after merging to main
3. **Hotfix branches**: Should be deleted after deployment
4. **Experimental branches**: Should be deleted if no longer active

### Verification

After deletion, verify with:
```bash
git ls-remote --heads origin
```

The `backup/antes-recuperacion` branch should no longer appear in the list.

---
**Last Updated**: $(date)
**Related Issue**: #5