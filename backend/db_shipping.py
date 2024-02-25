from data_imports.get_data import *
from models import *


def shipping_courier(file, name):
    dataframe, attr = read_excel_to_json(file, name)
    tmp = ShippingTable(name_id=name)
    origin = []

    for data in dataframe:
        weight = data['weight_kg']
        # if data['origin']:
        #     origin.append(data['origin'])
        result = {}
        for key, value in data.items():
            if 'zone' in key:
                result[key] = value
        tmp.price_zone[weight] = (result)

    tmp.origin = origin
    return tmp


def parse_shipping_table(xcel_file, *sheets):
    name = xcel_file.split('_')[2].split('.')[0]
    shipping = Shipping(name_id=name)
    for i in sheets:
        for value in i:
            table = shipping_courier(xcel_file, value)
            shipping.append_shipping_table(table)
    return shipping


def init_shipping_db(filename='data_imports/Shipping_DHL.xlsx', *args):
    from db import db_model
    if not 'Shipping' in db_model:
        db_model['Shipping'] = {}

    shipping = parse_shipping_table(filename, args)
    db_model['Shipping'][shipping.name_id] = shipping
