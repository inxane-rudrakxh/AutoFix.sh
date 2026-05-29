"""
Global state instances.
These instances hold the in-memory state of the application.
In a production app, this would be backed by a database (e.g. Postgres or SQLite).
"""

from services.deployment_service import DeploymentService
from services.fix_service import FixService
from services.log_service import LogService

deployment_service = DeploymentService()
fix_service = FixService()
log_service = LogService()
