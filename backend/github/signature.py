"""HMAC SHA-256 signature verification for GitHub webhooks."""

import hashlib
import hmac


def verify_signature(body: bytes, signature_header: str, secret: str) -> bool:
    """
    Verify a GitHub webhook payload against its X-Hub-Signature-256 header.

    Args:
        body: Raw request body bytes
        signature_header: Value of X-Hub-Signature-256 header (e.g. "sha256=abc123...")
        secret: GitHub App webhook secret

    Returns:
        True if signature is valid, False otherwise
    """
    if not signature_header.startswith("sha256="):
        return False

    expected_sig = signature_header[len("sha256="):]
    actual_sig = hmac.new(
        key=secret.encode("utf-8"),
        msg=body,
        digestmod=hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_sig, actual_sig)
