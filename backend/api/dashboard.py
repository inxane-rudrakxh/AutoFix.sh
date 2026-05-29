from fastapi import APIRouter
from models import DashboardMetrics
from services.db import get_db_connection

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
async def get_metrics() -> DashboardMetrics:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Active Deployments (or repositories having active runs)
    cursor.execute(
        "SELECT COUNT(*) as count FROM deployments WHERE status IN ('monitoring', 'analyzing', 'generating_fix', 'validating')"
    )
    active = cursor.fetchone()["count"]
    
    # Healed Deployments
    cursor.execute("SELECT COUNT(*) as count FROM deployments WHERE status = 'healed'")
    healed = cursor.fetchone()["count"]
    
    # Failed Deployments
    cursor.execute("SELECT COUNT(*) as count FROM deployments WHERE status = 'failed'")
    failed = cursor.fetchone()["count"]
    
    # Total Completed
    total_completed = healed + failed
    pass_rate = (healed / total_completed * 100) if total_completed > 0 else 0.0
    
    # Mean Time to Heal (average of sandbox_duration for healed fixes)
    cursor.execute("SELECT AVG(sandbox_duration) as avg_duration FROM fixes WHERE status = 'healed'")
    avg_duration = cursor.fetchone()["avg_duration"]
    mean_time_to_heal = int(avg_duration) if avg_duration is not None else 0
    
    conn.close()
    
    return DashboardMetrics(
        deploymentHealth=round(pass_rate, 1),
        activeRepositories=active,
        aiFixesLast24h=healed,
        meanTimeToHeal=mean_time_to_heal
    )
