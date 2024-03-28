from pydantic import BaseModel, Field
from typing import Optional, List

class Vendor(BaseModel):
    name_id: str
    origin: str
    vendor_tag: Optional[str] = ""
    pp_rate_: Optional[float]
    exchange_rate_: Optional[float]
    
   
    def get_skus(self):
        from db import db_model
        sku = [i for i in db_model['SKU'].values() if i.vendor_id == self.name_id]
        return sku

    def get_json(self):
        details = {
            'name_id': self.name_id,
            'origin': self.origin,
            'pp_rate_': self.pp_rate_,
            'exchange_rate_': self.exchange_rate_,
            'skus': self.get_skus()
        }
        return details
    
    
#if ending with _ indicates %, otherwise is a flat fee
