```bash
# 1) Create artifact branch
git checkout --orphan artifact/prod-2025-08-17
# 2) Add files & commit
npm run pull:prod
git add production-snapshot ARTIFACT_SNAPSHOT_README.md scripts/
git commit -m "chore: add production snapshot artifact-prod-2025-08-17"
# 3) Tag and push
git tag artifact-prod-2025-08-17
git push origin artifact/prod-2025-08-17 --tags

# Deploy this branch on your host to quickly use the working snapshot.
# Later, reconcile proper source from the original live commit.
```