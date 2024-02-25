from pydantic import BaseModel
from typing import List, Tuple, Dict
from .warehouse import Warehouse


class Zone(BaseModel):
    int_id: str
    country_list: list[str] = []
    
    def get_zone(self, country):
        for i in self.country_list:
            if i == country:
                return self.int_id
        return None
    

class ShippingTable(BaseModel):
    name_id: str #type xpres or standard
    origin: List[str] = [] #origin country list
    price_zone: Dict[int, Dict] = {} #weight, zone, price

    def get_quote(self, weight):
        weights = list(filter(lambda w: w >= weight, self.price_zone.keys()))
        
        if not weights:
            max_key = max(self.price_zone.keys())
            #need to implement +kg per price
            return self.price_zone[max_key]

        max_weight = min(weights)
        return self.price_zone[max_weight]
        
        
class Shipping(BaseModel):
    name_id: str #DHL
    zones: list[Zone] = [] #what zones it coveres #not completed methods
    shipping_table: Dict[str, ShippingTable] = {}
    
    def get_price(self, country, weight):
        zone = self.get_zone(country)
        if zone:
            for i in self.shipping_table:
                if i.weight_kg == weight:
                    return i.price_zone[zone]
        return None
    
    def get_zone(self, country):
        for i in self.zones:
            if i.get_zone(country):
                return i.get_zone(country)
        return None
    
    def append_zone(self, zone: Zone):
        self.zones.append(zone)
    
    def append_shipping_table(self, shipping_table: ShippingTable):
        self.shipping_table[shipping_table.name_id] = shipping_table
    
    def get_shipping_quote(self, carrier, weight):
        try:
            #find origin in list before, otherwise raise does not ship to zone ect.
            return self.shipping_table[carrier].get_quote(weight)
        except:
            print(f'Carrier: {carrier} not found')
    
    
    def get_json(self):
        details = {
            'int_id': self.int_id,
            'zones': self.zones,
            'shipping_table': self.shipping_table
        }
        return details
    
#db_model['Shipping']['name_id']
#i = db_model['Shipping']['DHL'].shipping_table[TYPE].get_quote(KG)