from db import db_model
from models import PSKU
from pydantic import BaseModel

class Calculate(BaseModel):
    warehouse_name: str
    pskus: list[str]
    shipping_selection: dict
    zone: str

class CalcOptions(BaseModel):
    objective_margin: float
    tax: float
    marketing: float
    country_input: str #this will find pp consumer


def get_packaging_by_warehouse(product_tag):
    #if packaging vendor exist.... try first. else
    for pt in db_model['PackagingWarehouse']:
        if (pt.product_tag == product_tag):
            return pt.cost_of_packaging
    raise Exception(f'PackaginWarehouse product tag no found: {product_tag}')

def csv_pskus(pskus):
    lst = []
    for psku in pskus:
        try:
            sku = db_model['PSKU'][psku]
            ptr = {
                'product_tag': sku.product_tag,
                'sku_id': sku.name_id,
                'packaging': get_packaging_by_warehouse(sku.product_tag),
                'total_weight': sku.total_weight,
                'total_cogs': sku.total_cogs,
            }
            lst.append(ptr)
        except Exception as e:
            print(f"Error: No SKU found with SKU {psku}")
            continue  # Skip to the next iteration    
        
    return lst
      
def csv_warehouses(warehouse, product_tag):
    try:
        wh = db_model['Warehouse'][warehouse][product_tag]
        ptr = {
            'warehouse_id': wh['name_id'],
            'product_tag': product_tag,
            'unit_fee': wh['unit_fee'],
            'storage_fee': wh['storage_fee'],
            'pick_and_pack_fee': wh['pick_and_pack_fee'],
            'custom_fee': wh['custom_fee'],
        }
        return ptr
    except Exception as e:
        print(e)
    return 
   
def get_shipping_item(courier, warehouse):
    if courier is None:
        raise Exception("No courier provided")
     
    for i in db_model['Shipping']:
        if (i.name_id == courier and i.warehouse == warehouse):
            return i
    raise Exception(f'Shipping item not found: {courier} and {warehouse}')

def csv_shipping(courier, type_, quote_by_zone, zone):
    try:
        return {
            'Courier': courier,
            'Type': type_,
            'Zone': zone,
            'ShippingPrice': quote_by_zone[zone]
        }
    except:
        raise Exception("Error in csv_shipping. No zone in shipping quote.")

def parse_total_cost(dict):
    return round((dict['total_cogs'] + dict['packaging'] + dict['unit_fee'] + dict['storage_fee'] + 
        dict['pick_and_pack_fee'] + dict['custom_fee'] + 
        float(dict['ShippingPrice'].replace(',', '.'))), 2)


def calculate(warehouse_name, pskus, shipping_selection, zone):
    skus_names =[s for s in pskus] 
    lst = []
    try:
        csv_skus = csv_pskus(skus_names)
        for sku in csv_skus:
            wh = csv_warehouses(warehouse_name, sku['product_tag'])
            shipping_item = get_shipping_item(shipping_selection['courier'], wh['warehouse_id'])
            shipping_quote = shipping_item.shipping_table[shipping_selection['type']].get_quote(sku['total_weight'])
            shipping = csv_shipping( shipping_selection['courier'], shipping_selection['type'], shipping_quote, zone)
            merge_dict = {**sku, **wh, **shipping}
            lst.append(merge_dict)
    except Exception as e:
        print(f'Error when calculate(ing): {str(e)}')
    return lst
    
def calculate_options(om, tax, marketing, country):
    try:
        ptr_country = db_model['PaymentProcessingCountry'][country]
        ptr_country.sales_fee_
        ptr_country.sales_fee
        return (1 - om - tax - marketing ) # - ptr_country['pp_rate_'] - ptr_country['exchange_rate_'] - ptr_country['exchange_fee'])
    except Exception as e:
        print(f'Error in calculating options: {str(e)}')
        
        

    # sku = PSKU(skus_names[0])
    # print(f'total {skus_names[0].get_total_cost()}')