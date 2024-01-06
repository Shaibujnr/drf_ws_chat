from django.db import models
from uuid import UUID, uuid4


class Message(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4)
    message = models.TextField()
    from_uuid = models.UUIDField()
    to_uuid = models.UUIDField()
    delivered_on = models.DateTimeField(null=True)
    seen_on = models.DateTimeField(null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
