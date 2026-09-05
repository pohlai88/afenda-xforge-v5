# Agents: Claude Code, Cursor, Codex

The loop attaches to your editor's agent through its own hooks. init writes the configuration; this page shows what it wrote and what each hook sends and receives, so you can audit it.
On this page

## Claude Code
`.claude/settings.json`
.claude/settings.json
`{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|compact|clear",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/node_modules/@usefragments/cli/dist/loop.js\" hook --agent claude --event SessionStart"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {`

Show 18 more lines

Claude Code hook eventsEvent
Loop step
What the agent receives

SessionStartcardthe card as additional context
PostToolUse on a writecheckfindings for that file as additional context, phrased as replace <raw> with <Fragment>
Stopprovenothing when the diff is clean; a block with the findings and the repair command when it is not

In (Claude Code, `Write` tool):
in
`{"hook_event_name":"PostToolUse","cwd":"<repo>","tool_name":"Write",
 "tool_input":{"file_path":"<repo>/apps/cloud/src/prod-smoke/ProdSmokeGovernance.tsx"}}`

Out (what the agent reads next):
out
`{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":
 "apps/cloud/src/prod-smoke/ProdSmokeGovernance.tsx:9 FUI1004 Bespoke <button> has a library equivalent. Swap to <Button> from @usefragments/ui. → Replace <button> with <Button>\napps/cloud/src/prod-smoke/ProdSmokeGovernance.tsx:12 FUI2005 Raw color #ff00aa on inline `color`. Use a CSS variable instead. → no fix"}}`

Recorded 2026-09-02 on the Fragments repository; the Cursor `postToolUse` payload carries the same text under `additional_context`.

## Cursor
`.cursor/hooks.json`
.cursor/hooks.json
`{
  "version": 1,
  "hooks": {
    "sessionStart": [
      { "command": "node ./node_modules/@usefragments/cli/dist/loop.js hook --agent cursor --event sessionStart" }
    ],
    "postToolUse": [
      { "command": "node ./node_modules/@usefragments/cli/dist/loop.js hook --agent cursor --event postToolUse" }
    ],
    "stop": [{ "command": "node ./node_modules/@usefragments/cli/dist/loop.js hook --agent cursor --event stop" }]
  }
}`

Cursor hook eventsEvent
Loop step
What the agent receives

sessionStartcardadditional_context
postToolUsecheckadditional_context with findings for the edited file
stopprovefollowup_message with the findings, at most once per session

## Codex
`npx @usefragments/cli hook install --agent codex` writes `.codex/hooks.json` with the same three events. SessionStart prints the card to stdout; PostToolUse and Stop use the Claude Code protocol. Codex loads project hooks only after you trust them: run `/hooks` in Codex and approve the file.
.codex/hooks.json
`{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|compact|clear",
        "hooks": [
          {
            "type": "command",
            "command": "node ./node_modules/@usefragments/cli/dist/loop.js hook --agent codex --event SessionStart"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "apply_patch|Write|Edit",
        "hooks": [
          {`

Show 18 more lines

## Budgets
The loop is on the write path, so it is fast or it is off.
Loop step budgetsStep
Budget
Measured

card≤ 100 ms64 ms mean (hyperfine, 20 runs)
check on save≤ 300 ms p9538 ms mean warm (daemon), 568 ms cold in-process
prove on stop≤ 1 s230 ms mean warm on this repository (git diff dominates); 622 ms in-process on a 10-file fixture
network calls0asserted by test

A resident daemon holds the compiled manifest; the hook is a thin client. If the daemon is not running, the hook runs in process and starts it.

## Proving the chain
`npx @usefragments/cli doctor`

`doctor` fires each hook with a real payload and prints what the agent would receive. Green means every step above works on this machine.

## Next steps
- The loopFive minutes from init to a first correction.
- MCPLocal search, get, check, tokens — and the hosted endpoint.
- CLIGenerated command reference.

Design system governance for agents and CI
Governed byFragments

- Docs
- Components
- Pricing
- GitHub
- npm
- Changelog
- Terms
- Privacy