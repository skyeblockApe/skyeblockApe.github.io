# Deployment release rule

Before every production deployment of this site:

1. Increment the visible site version in both `index.html` and `interior-review.html`.
2. Set the release date to the actual deployment date in `YYYY-MM-DD` format.
3. Keep the footer release label, `<meta name="version">`, and homepage JSON-LD `dateModified` synchronized.
4. Bump static asset query versions when HTML, CSS, or JavaScript changes require cache invalidation.
5. Verify the version and date on desktop and mobile before deploying.
