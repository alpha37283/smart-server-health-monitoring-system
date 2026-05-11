# agent/collector/containerization/docker_client.py

try:
    import docker
except ImportError:
    docker = None


# Shared singleton client
_docker_client = None


def get_docker_client():
    """
    Return shared Docker client instance.

    Returns:
        docker.client.DockerClient | None
    """

    global _docker_client

    # Docker SDK not installed
    if docker is None:
        return None

    # Reuse existing client
    if _docker_client is not None:
        return _docker_client

    try:
        _docker_client = docker.from_env()

        # Validate daemon connection
        _docker_client.ping()

        return _docker_client

    except Exception:
        _docker_client = None
        return None