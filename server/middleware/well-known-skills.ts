/**
 * Redirects the well-known skills discovery path to the canonical /skill route,
 * which serves the content with correct UTF-8 encoding.
 *
 * @see https://github.com/cloudflare/agent-skills-discovery-rfc
 */
export default defineEventHandler((event) => {
  if (event.method !== "GET") return;

  if (getRequestURL(event).pathname === "/.well-known/skills/filedrop/SKILL.md") {
    return sendRedirect(event, "/skill", 301);
  }
});
