from pydantic import BaseModel
from typing import List
import enum

class Warehouse(BaseModel):
    name_id: str
    origin: str
    product_tag: str
    unit_fee: int
    storage_fee: int
    pick_and_pack_fee: int
    custom_fee: int

    def append_sku(self, sku: str):
        self.skus.append(sku)



class WarehouseConfig(BaseModel):
    name_id: str
    # countries_to_ship: List[str] = []
    # shipping_couriers: List[str] = []
    def append_country(self, country: str):
        self.countries_to_ship.append(country)
    
    def append_courier(self, courier: str):
        self.shipping_couriers.append(courier)
    