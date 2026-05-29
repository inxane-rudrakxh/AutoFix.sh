from fastapi import APIRouter, HTTPException, Query
from models import Deployment, DeploymentDetail, PaginatedDeployments
from services.state import deployment_service as _service

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.get("", response_model=PaginatedDeployments)
async def list_deployments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> PaginatedDeployments:
    return await _service.list(page=page, page_size=page_size)


@router.get("/{deployment_id}", response_model=DeploymentDetail)
async def get_deployment(deployment_id: str) -> DeploymentDetail:
    result = await _service.get(deployment_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Deployment '{deployment_id}' not found")
    return result
