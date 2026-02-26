# Deprecation Policy

## Purpose
To safely sunset old features with clear migration paths.

## Deprecation Lifecycle

### Phase 1: Announce (MINOR version)
- Mark feature as `@deprecated` in code
- Add console warning when used
- Update CHANGELOG.md with sunset date
- Provide migration guide
- Set sunset date (minimum 4 weeks away)

### Phase 2: Support (multiple minor versions)
- Feature still works but warns
- Monitor usage via logs
- Help users migrate

### Phase 3: Remove (MAJOR version)
- Delete feature
- Update CHANGELOG.md
- Release as v(N+1).0.0

## Guidelines
1. **Always deprecate before removing** (except: security/critical bugs)
2. **Give 4+ weeks notice** (minimum)
3. **Document migration path** (show old → new code)
4. **Update CHANGELOG.md** in each phase

## Current Deprecations
- (none yet)
