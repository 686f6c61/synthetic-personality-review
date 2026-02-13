# Manual Assisted Verification Sweep (2026-02-12)

## Scope

Focused review of unresolved non-duplicate entries after automated verification.

- Initial unresolved set: 20
- Resolved during manual-assisted pass: 3
- Remaining unresolved: 17

## Recovered Entries

| Article | Action | Evidence |
|---|---|---|
| 25 | Re-mapped to canonical source and deduplicated | Original URL (ResearchGate) returned 403; title has exact match in arXiv (`2307.16180`) already represented in corpus. |
| 105 | Verified | arXiv metadata title is a high semantic match; source entry used placeholder author text, so author overlap was not a reliable discriminator. |
| 149 | Verified via DOI override | DOI metadata (`10.1145/3725853`) provides matching acronym/title pattern, year alignment, and overlapping author identity. |

## Remaining Unresolved Entries (Need Manual Primary-Source Trace)

These entries still point to arXiv IDs whose metadata resolves to unrelated papers.

- 129, 131, 132, 133, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148

### Why they remain unresolved

- arXiv IDs resolve successfully but to semantically unrelated titles.
- Crossref title search produced nearest-neighbor matches, but author mismatch and/or weak semantic overlap make automatic recovery unsafe.
- To avoid false inclusion in a public reference corpus, these remain excluded until direct primary-source evidence is found.

## Recommendation for Final Recovery

For each unresolved item, require at least one of:

1. Exact (or near-exact) title match on a primary source with year compatibility and at least partial author overlap.
2. DOI from a trusted publisher/venue matching title intent and metadata consistency.
3. Proceedings URL (ACL/OpenReview/ACM/IEEE/Nature etc.) that confirms paper identity.

## Artifacts

- Candidate search dump: `reports/verification/manual-candidate-search.json`
- Canonical dataset: `data/articles.canonical.json`
- Removed ledger: `data/articles.removed.json`
