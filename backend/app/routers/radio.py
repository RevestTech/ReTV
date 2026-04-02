import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas import (
    RadioStationOut, RadioSearchParams, PaginatedRadio,
    RadioTagOut, RadioCountryOut,
)
from app.services.radio_service import (
    search_radio, get_radio_tags, get_radio_countries,
)

router = APIRouter(prefix="/api/radio", tags=["radio"])


@router.get("/stations", response_model=PaginatedRadio)
async def list_radio_stations(
    query: str | None = Query(None, description="Search term"),
    tag: str | None = Query(None),
    country: str | None = Query(None),
    language: str | None = Query(None),
    working_only: bool = Query(False),
    status: str | None = Query(None, description="Filter by health status: verified, live, or hide_offline"),
    page: int = Query(1, ge=1),
    per_page: int = Query(40, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    params = RadioSearchParams(
        query=query, tag=tag, country=country,
        language=language, working_only=working_only,
        status=status, page=page, per_page=per_page,
    )
    stations, total = await search_radio(db, params)
    return PaginatedRadio(
        stations=[RadioStationOut.model_validate(s) for s in stations],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=math.ceil(total / per_page) if total else 0,
    )


@router.get("/tags", response_model=list[RadioTagOut])
async def list_radio_tags(db: AsyncSession = Depends(get_db)):
    return await get_radio_tags(db)


@router.get("/countries", response_model=list[RadioCountryOut])
async def list_radio_countries(db: AsyncSession = Depends(get_db)):
    rows = await get_radio_countries(db)
    return [
        RadioCountryOut(country=r.country, country_code=r.country_code, station_count=r.station_count)
        for r in rows
    ]
