from pydantic import BaseModel
import pandas as pd

class PaymentProcessingCard(BaseModel):
    name_id: str
    rate_: float
    fee: float
    
    @property
    def total_fee(self):
        return self.rate_ * self.fee #tbc
    

class PaymentProcessingCountry(BaseModel):
    name_id: str
    sales_fee_: float
    sales_fee: float
    
    @property
    def exchange_rate(self):
        return self.sales_fee_ * self.sales_fee #tbc
    
    @property
    def pp_fee_rate(self):
        return self.sales_fee_ * self.sales_fee #tbc
    
class PaymentPopCountry:
    pass