import logging

import httpx
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.models import RadioStation
from app.schemas import RadioSearchParams

logger = logging.getLogger(__name__)

RADIO_API = "https://de1.api.radio-browser.info"


async def fetch_radio_json(path: str, params: dict | None = None) -> list[dict]:
    async with httpx.AsyncClient(timeout=60, headers={"User-Agent": "ReTV/1.0"}) as client:
        resp = await client.get(f"{RADIO_API}{path}", params=params)
        resp.raise_for_status()
        return resp.json()


async def sync_radio_stations(db: AsyncSession) -> int:
    """Fetch top radio stations from Radio Browser API."""
    logger.info("Starting radio station sync...")
    count = 0
    batch_size = 10000
    offset = 0
    max_stations = 50000

    while offset < max_stations:
        data = await fetch_radio_json("/json/stations/search", {
            "limit": batch_size,
            "offset": offset,
            "order": "votes",
            "reverse": "true",
            "hidebroken": "true",
        })

        if not data:
            break

        for item in data:
            station_id = item.get("stationuuid", "")
            if not station_id:
                continue

            stmt = pg_insert(RadioStation).values(
                id=station_id,
                name=item.get("name", "").strip(),
                url=item.get("url", ""),
                url_resolved=item.get("url_resolved", ""),
                homepage=item.get("homepage", ""),
                favicon=item.get("favicon", ""),
                tags=item.get("tags", ""),
                country=item.get("country", ""),
                country_code=(item.get("countrycode", "") or "").upper(),
                state=item.get("state", ""),
                language=item.get("language", ""),
                codec=item.get("codec", ""),
                bitrate=item.get("bitrate", 0) or 0,
                votes=item.get("votes", 0) or 0,
                last_check_ok=bool(item.get("lastcheckok", 0)),
            ).on_conflict_do_update(
                index_elements=["id"],
                set_={
                    "name": item.get("name", "").strip(),
                    "url": item.get("url", ""),
                    "url_resolved": item.get("url_resolved", ""),
                    "homepage": item.get("homepage", ""),
                    "favicon": item.get("favicon", ""),
                    "tags": item.get("tags", ""),
                    "country": item.get("country", ""),
                    "country_code": (item.get("countrycode", "") or "").upper(),
                    "state": item.get("state", ""),
                    "language": item.get("language", ""),
                    "codec": item.get("codec", ""),
                    "bitrate": item.get("bitrate", 0) or 0,
                    "votes": item.get("votes", 0) or 0,
                    "last_check_ok": bool(item.get("lastcheckok", 0)),
                },
            )
            await db.execute(stmt)
            count += 1

        await db.commit()
        logger.info("Synced radio batch: offset=%d, got=%d", offset, len(data))
        offset += batch_size

        if len(data) < batch_size:
            break

    logger.info("Radio sync complete: %d stations", count)
    return count


async def search_radio(db: AsyncSession, params: RadioSearchParams):
    query = select(RadioStation)
    count_query = select(func.count(RadioStation.id))

    if params.query:
        pattern = f"%{params.query}%"
        cond = or_(
            RadioStation.name.ilike(pattern),
            RadioStation.tags.ilike(pattern),
        )
        query = query.where(cond)
        count_query = count_query.where(cond)

    if params.tag:
        query = query.where(RadioStation.tags.ilike(f"%{params.tag}%"))
        count_query = count_query.where(RadioStation.tags.ilike(f"%{params.tag}%"))

    if params.country:
        query = query.where(RadioStation.country_code == params.country.upper())
        count_query = count_query.where(RadioStation.country_code == params.country.upper())

    if params.language:
        query = query.where(RadioStation.language.ilike(f"%{params.language}%"))
        count_query = count_query.where(RadioStation.language.ilike(f"%{params.language}%"))

    if params.working_only:
        query = query.where(RadioStation.last_check_ok == True)
        count_query = count_query.where(RadioStation.last_check_ok == True)

    total = (await db.execute(count_query)).scalar() or 0

    offset = (params.page - 1) * params.per_page
    query = query.order_by(RadioStation.votes.desc()).offset(offset).limit(params.per_page)

    result = await db.execute(query)
    stations = result.scalars().all()
    return stations, total


async def get_radio_tags(db: AsyncSession, limit: int = 60):
    """Get top tags with station counts by splitting comma-separated tags."""
    all_stations = await db.execute(
        select(RadioStation.tags).where(RadioStation.tags != "")
    )
    tag_counts: dict[str, int] = {}
    for (tags_str,) in all_stations:
        for tag in tags_str.split(","):
            tag = tag.strip().lower()
            if tag and len(tag) > 1:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

    sorted_tags = sorted(tag_counts.items(), key=lambda x: -x[1])[:limit]
    return [{"name": t, "station_count": c} for t, c in sorted_tags]


async def get_radio_countries(db: AsyncSession):
    result = await db.execute(
        select(
            RadioStation.country,
            RadioStation.country_code,
            func.count(RadioStation.id).label("station_count"),
        )
        .where(RadioStation.country != "")
        .group_by(RadioStation.country, RadioStation.country_code)
        .having(func.count(RadioStation.id) > 0)
        .order_by(func.count(RadioStation.id).desc())
    )
    return result.all()


async def get_radio_stats(db: AsyncSession):
    total = (await db.execute(select(func.count(RadioStation.id)))).scalar() or 0
    working = (await db.execute(
        select(func.count(RadioStation.id)).where(RadioStation.last_check_ok == True)
    )).scalar() or 0
    return {"total": total, "working": working}
