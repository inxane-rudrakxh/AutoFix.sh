from fastapi import APIRouter, HTTPException
from models import FixSummary, FixDetail
from services.state import fix_service as _service

router = APIRouter(prefix="/fixes", tags=["fixes"])


@router.get("", response_model=list[FixDetail])
async def list_fixes() -> list[FixDetail]:
    return await _service.list()


@router.get("/{fix_id}", response_model=FixDetail)
async def get_fix(fix_id: str) -> FixDetail:
    result = await _service.get(fix_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Fix '{fix_id}' not found")
    return result
