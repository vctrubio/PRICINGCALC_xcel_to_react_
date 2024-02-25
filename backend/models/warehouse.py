from pydantic import BaseModel
from typing import List
import enum

class ProductTag(enum.Enum):
    TAG1 = 1
    TAG2 = 2

class Warehouse(BaseModel):
    name_id: str
    origin: str
    product_tag: str
    unit_fee: int
    storage_fee: int
    pick_and_pack_fee: int
    custom_fee: int
    skus: List = [] # to be replaced with available shipping countries

    
    # avaliable_shipping_couriers: List[Shipping] = []
    
    def append_sku(self, sku: str):
        self.skus.append(sku)

#calculate the total cost