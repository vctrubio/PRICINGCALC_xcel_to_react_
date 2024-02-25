from pydantic import BaseModel


class Order(BaseModel):
    '''GEN 
    the glue. when you have a package and need a delievery
    is this b2b drop shipping in qunatity
    or is it to my warehouse, from my warehouse
    
    '''
    int_id: str
    packaging_id: int
    shipping_id: int
    quantity: int
    b2b: bool ##b2b or b2c (if falst warehouse)
    
