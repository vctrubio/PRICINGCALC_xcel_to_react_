from pydantic import BaseModel

class PackagingWarehouse(BaseModel):
    name_id: str # link to product tag
    cost_of_packaging: float
    
class PackagingVendor(BaseModel):
    vendor_id: str 
    product_tag: str # link to product tag
    cost_of_packaging: float
    
    