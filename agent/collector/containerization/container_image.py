# agent/collector/containerization/container_image.py

import time

from .docker_client import get_docker_client

from datetime import datetime, timezone


# Image pull tracking

_image_pull_counts = {}


def update_image_pull_frequency(client):
    """
    Track image pull events using
    Docker Events API.
    """

    global _image_pull_counts

    try:

        events = client.events(
            decode=True,
            since=int(time.time()) - 5
        )

        for event in events:

            try:

                if event.get("Type") != "image":
                    continue

                action = (
                    event.get("Action", "")
                    .lower()
                )

                # pull events
                if "pull" not in action:
                    continue

                image_id = (
                    event.get("id", "")[:12]
                )

                if not image_id:
                    continue

                _image_pull_counts[image_id] = (
                    _image_pull_counts.get(
                        image_id,
                        0
                    ) + 1
                )

            except Exception:
                continue

    except Exception:
        pass


def calculate_image_age_days(created_timestamp):
    """
    Calculate image age in days.
    """

    if not created_timestamp:
        return None

    try:

        # Remove nanoseconds if present
        created_timestamp = (
            created_timestamp.split(".")[0]
            + "Z"
        )

        created_time = datetime.strptime(
            created_timestamp,
            "%Y-%m-%dT%H:%M:%SZ"
        )

        created_time = created_time.replace(
            tzinfo=timezone.utc
        )

        current_time = datetime.now(
            timezone.utc
        )

        age_days = (
            current_time - created_time
        ).days

        return age_days

    except Exception:
        return None



def get_image_pull_frequency(image_id):
    """
    Return image pull frequency.
    """

    return _image_pull_counts.get(
        image_id,
        0
    )


# Image metrics

def get_total_images(images):
    """
    Count total images.
    """

    return len(images)


def get_dangling_images(images):
    """
    Count dangling images.
    """

    dangling_count = 0

    for image in images:

        try:

            tags = image.tags

            if not tags or tags == ["<none>:<none>"]:
                dangling_count += 1

        except Exception:
            continue

    return dangling_count


def calculate_latest_tag_usage(images):
    """
    Count images using latest tag.
    """

    latest_count = 0

    for image in images:

        try:

            tags = image.tags

            for tag in tags:

                if tag.endswith(":latest"):
                    latest_count += 1

        except Exception:
            continue

    return latest_count


def calculate_duplicate_image_count(images):
    """
    Count duplicate/redundant images
    based on shared repo tags.
    """

    tag_groups = {}

    for image in images:

        try:

            tags = image.tags

            for tag in tags:

                tag_groups[tag] = (
                    tag_groups.get(tag, 0) + 1
                )

        except Exception:
            continue

    duplicate_count = 0

    for count in tag_groups.values():

        if count > 1:
            duplicate_count += (count - 1)

    return duplicate_count



def build_image_metrics(image):
    """
    Build metrics for single image.
    """

    try:

        image_id = image.short_id
        image_tags = image.tags

        image_size_bytes = (
            image.attrs.get("Size", 0)
        )

        created_timestamp = (image.attrs.get("Created"))

        image_age_days = calculate_image_age_days(created_timestamp)

        metrics = {

            "image_id": image_id,

            "image_tags": image_tags,

            "image_size_bytes":
                image_size_bytes,

            "image_pull_frequency":
                get_image_pull_frequency(
                    image_id
                ),

            "image_age_days":
                image_age_days,
        }

        return metrics

    except Exception:
        return None


def get_container_image_metrics(client):
    """
    Collect image metrics.
    """

    metrics = []

    try:

        images = client.images.list()

    except Exception:
        return {
            "total_images": 0,
            "dangling_images": 0,
            "images": []
        }

    # update image pull cache
    update_image_pull_frequency(client)

    for image in images:

        image_metrics = build_image_metrics(
            image
        )

        if image_metrics:
            metrics.append(image_metrics)

    duplicate_image_count = (calculate_duplicate_image_count(images))


    latest_tag_usage = (calculate_latest_tag_usage(images))

    return {

        "total_images": get_total_images(images),

        "dangling_images": get_dangling_images(images),

        "duplicate_image_count": duplicate_image_count, 

        "latest_tag_usage": latest_tag_usage,
        
        "images": metrics
    }


# Collector

async def collect_container_images(event_bus):
    """
    Collect container image metrics.
    """

    client = get_docker_client()

    if client is None:

        event = {
            "timestamp": time.time(),
            "type": "container_image_metrics",
            "data": {
                "runtime_available": False,
                "total_images": 0,
                "dangling_images": 0,
                "images": []
            }
        }

        await event_bus.publish(event)
        return

    metrics = get_container_image_metrics(
        client
    )

    event = {
        "timestamp": time.time(),
        "type": "container_image_metrics",
        "data": {

            "runtime_available": True,

            "total_images": metrics["total_images"],

            "dangling_images": metrics["dangling_images"],

            "duplicate_image_count": metrics["duplicate_image_count"],

            "latest_tag_usage": metrics["latest_tag_usage"],
            
            "images": metrics["images"]
        }
    }

    print(". . . Container Image Data collected . . .")

    await event_bus.publish(event)