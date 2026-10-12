# Agent Memory - HSK Flashcards Generator

## Git Workflow Rules

- Work directly on the existing `main` branch.
- Do not create new branches unless I explicitly ask.
- Do not create pull requests unless I explicitly ask.
- Do not merge branches unless I explicitly ask.
- Do not rename branches or change remote settings.
- Do not run GitHub PR workflows.

## Commit Rules

- Do not commit automatically after every change.
- Only create a commit when I explicitly ask.
- When I ask for a commit, commit directly on `main`.
- Keep commits small and focused.

## Dangerous Git Commands

Before running any of these commands, stop and ask me first:

- `git reset`
- `git rebase`
- `git clean`
- `git checkout`
- `git restore`
- `git push --force`
- any command that may delete files, rewrite history, or discard local changes

## Development Style

- Make changes directly in the current working tree.
- Keep edits simple and incremental.
- Do not rewrite the whole project unless I explicitly ask.
- Follow the existing code style and file structure.
- After finishing, summarize:
  - what files changed
  - what behavior changed
  - what tests or checks were run

## Project Preference

This is a personal project. I prefer a simple single-branch workflow because I do not want to review pull requests for every small change. Read AGENTS.md first and follow it strictly. This project uses only one branch: main.
