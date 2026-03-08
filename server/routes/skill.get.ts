/**
 * GET /skill
 *
 * Serves the Agent Skills definition with correct UTF-8 encoding.
 * The content is bundled from server/assets/SKILL.md via Nitro's
 * storage layer, so it works on Cloudflare Workers at runtime.
 *
 * Also serves as the canonical URL referenced by the well-known
 * discovery endpoint (/.well-known/skills/index.json).
 *
 * @see https://agentskills.io/specification
 * @see https://github.com/cloudflare/agent-skills-discovery-rfc
 */
export default defineEventHandler(async (event) => {
  const storage = useStorage("assets:server");
  const content = await storage.getItem("SKILL.md");

  if (!content) {
    throw createError({ statusCode: 500, statusMessage: "Skill definition not found" });
  }

  setHeader(event, "content-type", "text/markdown; charset=utf-8");

  return content;
});
