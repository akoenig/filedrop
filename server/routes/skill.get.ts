/**
 * GET /skill
 *
 * Redirects to the canonical well-known skills path as defined by
 * the Agent Skills Discovery RFC.
 *
 * @see https://github.com/cloudflare/agent-skills-discovery-rfc
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, "/.well-known/skills/filedrop/SKILL.md", 301);
});
