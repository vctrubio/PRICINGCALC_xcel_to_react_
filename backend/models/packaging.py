from pydantic import BaseModel


class PackagingWarehouse(BaseModel):
    name_id: str 
    product_tag: str # link to product tag
    dim_weight: float
    cost_of_packaging: float
    
class PackagingVendor(BaseModel):
    name_id: str
    product_tag: str # link to product tag
    dim_weight: float
    cost_of_packaging: float
    
    