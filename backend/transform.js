function slimTag(tag) {
    return { id: tag.id, attributes: { name: tag.attributes?.name, group: tag.attributes?.group } };
}

function slimDescription(description = {}) {
    const key = description.en ? 'en' : description.th ? 'th' : Object.keys(description)[0];
    return key ? { [key]: String(description[key]).slice(0, 2000) } : {};
}

function slimManga(manga) {
    const attributes = manga.attributes || {};
    const cover = (manga.relationships || []).find((relation) => relation.type === 'cover_art');
    return {
        id: manga.id,
        type: manga.type,
        attributes: {
            title: attributes.title,
            altTitles: attributes.altTitles || [],
            description: slimDescription(attributes.description),
            status: attributes.status,
            year: attributes.year,
            tags: (attributes.tags || []).map(slimTag),
        },
        relationships: cover ? [{ type: 'cover_art', attributes: { fileName: cover.attributes?.fileName } }] : [],
    };
}

const transformMangaList = (raw) => ({
    data: (raw.data || []).map(slimManga),
    total: raw.total,
    limit: raw.limit,
    offset: raw.offset,
});

const transformRandom = (raw) => ({ data: raw.data ? slimManga(raw.data) : null });

const transformGenres = (raw) => ({
    data: (raw.data || []).filter((tag) => tag.attributes?.group === 'genre').map(slimTag),
});

const transformStats = (mangaId) => (raw) => ({
    statistics: { [mangaId]: { follows: raw.statistics?.[mangaId]?.follows ?? null } },
});

module.exports = { transformMangaList, transformRandom, transformGenres, transformStats };
