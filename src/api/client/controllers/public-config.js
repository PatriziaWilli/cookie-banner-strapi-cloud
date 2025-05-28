'use strict';

module.exports = {
  async findByDomain(ctx) {
    const { domain } = ctx.query;

    if (!domain) {
      return ctx.badRequest("Missing domain parameter");
    }

    const clients = await strapi.entityService.findMany("api::client.client", {
      filters: { site_url: { $containsi: domain } },
      populate: { cookies: true },
    });

    if (!clients || clients.length === 0) {
      return ctx.notFound("Client not found");
    }

    const client = clients[0];

    ctx.send({
      client: client.name,
      cookies: client.cookies.map((c) => ({
        name: c.name,
        category: c.category,
        duration: c.duration,
        provider: c.provider,
        service: c.service,
        active: c.active,
      })),
    });
  },
};
