from pydantic import BaseModel
from typing import List


class ProductTag(BaseModel):
    name_id: str
    # bundle: List['ProductTag'] = []

    