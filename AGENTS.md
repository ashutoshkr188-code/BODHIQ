<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Professional Git & GitHub Workflow Rules

1. **Branching Strategy**:
   - Never commit directly to `main` for non-trivial changes or multi-step tasks.
   - Use descriptive feature/fix branch names: `fix/<issue-name>`, `feat/<feature-name>`, `refactor/<scope>`, `sec/<audit-remediation>`.
2. **Incremental & Atomic Commits**:
   - Make logical, incremental, single-responsibility commits.
   - Do not bundle unrelated changes (e.g. separate auth fixes from UI styling or infrastructure config).
3. **Commit Message Standard (Conventional Commits)**:
   - Format: `<type>(<scope>): <short summary>`
   - Types: `feat`, `fix`, `sec`, `docs`, `refactor`, `style`, `test`, `chore`.
   - Body: Provide detailed rationale for non-trivial architectural or security changes.
4. **Clean Status & Version Control Discipline**:
   - Verify `git status` and `git diff` before committing.
   - Never commit secrets, credentials, or ephemeral SQLite WAL/SHM runtime artifacts (`*.db-wal`, `*.db-shm`). Ensure `.gitignore` handles them.

