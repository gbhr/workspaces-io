from typing import List, Optional, Mapping
import json

import click
from pydantic import BaseModel

from fastapi_minio_workspaces import schemas


class Config(BaseModel):
    token: Optional[str]
    s3tokens: Mapping[str, schemas.S3TokenDB]


def make() -> Config:
    return Config(s3tokens={})


def save_config(c: Config, p: str):
    with open(p, "w") as out:
        out.write(c.json())


def load_config(c: str) -> Config:
    try:
        return Config(**json.loads(c))
    except:
        return make()


def resolve_token(c: Config, query: str) -> Optional[schemas.S3TokenDB]:
    """
    validate a workspace string, see if I have it locally
    """
    pass
