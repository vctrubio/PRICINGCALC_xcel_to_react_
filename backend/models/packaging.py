from pydantic import BaseModel


class Packaging(BaseModel):
    int_id: int
    product_tag: str # link to product tag
    dim_weight: float
    cost_of_packaging: float
    
