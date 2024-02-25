from pydantic import BaseModel, Field
from .vendor import Vendor
from .producttag import ProductTag
from typing import Optional, List
import json


class SKU(BaseModel): 
    name_id: str
    vendor_id: str
    description: Optional[str]
    cogs: int
    first_mile: Optional[int] = 0
    weight_kg: Optional[float] = None
    
    
    def __init__(self, **data):
        super().__init__(**data)
        
    def vendor(self)-> Vendor:
        from db import db_model
        try:
            vendors = db_model['Vendor']
            return vendors[self.vendor_id]
        except Exception as e:
            print(e)

    # get pp suplier cost
    def get_pp_supplier(self):
        return self.cogs * self.vendor().pp_rate_ / 100 
    
    # get exchnage fee
    def get_exchange_fee(self):
        return self.cogs * self.vendor().exchange_rate_ / 100

    # get total cost
    def get_total_cost(self):
        return self.get_pp_supplier() + self.get_exchange_fee() + self.cogs +self.first_mile
        return self.cogs +self.first_mile
    
    def get_json(self):
        details = {
            'vendor_id': self.vendor_id,
            'name_id': self.name_id,
            'description': self.description,
            'cogs': self.cogs,
            'first_mile': self.first_mile,
            'vendor': self.vendor(),
            'weight': self.weight_kg,
            'pp_rate': self.vendor().pp_rate_,
            'pp_supplier': self.get_pp_supplier(),
            'exchange_rate': self.vendor().exchange_rate_,
            'exchange_fee': self.get_exchange_fee(),
            'total_cost': self.get_total_cost(),
        }
        return details

class PSKU(BaseModel):
    name_id: str
    product_tag: str
    skus: list[str] = []
    description: Optional[str] = None 
    
    def __init__(self, name_id: str, skus: str, product_tag:None, description:None):
        if product_tag is not None:
            super().__init__(name_id=name_id, product_tag=product_tag, description=description)
        else:
            super().__init__(name_id=name_id)
        self.skus = self.get_skus(skus)
    
    def append_sku(self, sku: SKU):
        if sku.name_id not in self.skus:
            self.skus.append(sku.name_id)
        else:
            raise Exception('SKU already exists') 
      
    def get_skus(self, sku):
        if (type(sku) == list):
            sku = ' '.join(sku)
        skus = sku.split()
        return skus
        #for i in skus: if sku is not present in db, throw error
    
    @classmethod
    def sku_to_sku(cls, sku_id: str):
        from db import db_model
        try:
            return db_model['SKU'][sku_id]
        except Exception as e:
            print(e)
            return None  # Return None if SKU is not found

    @property
    def description(self) -> str:
        return ", ".join(self.sku_to_sku(sku).description for sku in self.skus)

    @property
    def cogs(self) -> int:
        return sum(self.sku_to_sku(sku).cogs for sku in self.skus)

    @property
    def first_mile(self) -> int:
        return sum(self.sku_to_sku(sku).first_mile for sku in self.skus)
   
    @property
    def weight_kg(self) -> float:
        return sum(self.sku_to_sku(sku).weight_kg for sku in self.skus)
    
    @property
    def total(self) -> float:
        return sum(self.sku_to_sku(sku).get_total_cost() for sku in self.skus)

    def get_json(self):
        details = {
            'name_id': self.name_id,
            'product_tag': self.product_tag,
            'skus': self.skus,
            'total_cost': self.total,
            'cogs': self.cogs,
            'first_mile': self.first_mile,
            'weight_kg': self.weight_kg,
        }
        return details
    
    #we need to get all warehouse ids for this sku