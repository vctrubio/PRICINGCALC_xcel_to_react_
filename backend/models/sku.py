from pydantic import BaseModel, validator
from .vendor import Vendor
from .producttag import ProductTag
from typing import Optional, List
import json

class SKU(BaseModel): 
    name_id: str
    vendor_id: str
    description: Optional[str]
    cogs: float
    first_mile: Optional[float] = 0
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

    def weight(self):
        return self.weight_kg
    
    def get_pp_supplier(self):
        vendor = self.vendor()
        if vendor is None:
            return None
        return self.cogs * vendor.pp_rate_ / 100
    
    def get_exchange_fee(self):
        vendor = self.vendor()
        if vendor is None:
            return None
        return self.cogs * self.vendor().exchange_rate_ / 100

    def get_total_cost(self):
        vendor = self.vendor()
        if vendor is None:
            return None
        return self.get_pp_supplier() + self.get_exchange_fee() + self.cogs + self.first_mile

    def get_json(self):
        vendor = self.vendor()
        details = {
            'vendor_id': self.vendor_id,
            'name_id': self.name_id,
            'description': self.description,
            'cogs': self.cogs,
            'first_mile': self.first_mile,
            'vendor': vendor,
            'weight_kg': self.weight_kg,
            'pp_rate_': vendor.pp_rate_ if vendor else None,
            '_pp_supplier': self.get_pp_supplier(),
            '_exchange_rate': vendor.exchange_rate_ if vendor else None,
            '_exchange_fee': self.get_exchange_fee(),
            '_total_cost': self.get_total_cost(),
        }
        return details

class PSKU(BaseModel):
    name_id: str
    product_tag: str
    skus: list[str] = []
    description: Optional[str] = None 

    @property
    def total_cogs(self):
        return sum(self.sku_to_sku(sku).get_total_cost() for sku in self.skus)
    
    @property
    def total_weight(self):
        return sum(self.sku_to_sku(sku).weight() for sku in self.skus)
    
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
    
    def sku_to_sku(cls, sku_id: str):
        from db import db_model
        try:
            return db_model['SKU'][sku_id]
        except Exception as e:
            print(e)
            return None  # Return None if SKU is not found
    #we need to get all warehouse ids for this sku

    def get_json(self):
        details = {
            'name_id': self.name_id,
            'product_tag': self.product_tag,
            'skus': self.skus,
            'description': self.description,
            '_total_cogs': round(self.total_cogs, 2),
            '_total_weight': self.total_weight,
        }
        return details