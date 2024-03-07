from data_imports.get_data import *
from models import *



'''
grab all warehouses, see which directory exist of the warehouse
go into directory, split the file to get courier,
see sheets to see types of shipping
parse data into appropiate model
'''




def shipping_courier(file, name):
    dataframe, attr = read_excel_to_json_sheet(file, name)
    tmp = ShippingTable(name_id=name)

    for data in dataframe:
        weight = data['weight_kg']
        result = {}
        for key, value in data.items():
            if 'zone' in key:
                result[key] = value
        tmp.price_zone[weight] = (result)

    return tmp


def parse_shipping_table(xcel_file, name, *sheets):
    shipping = Shipping(name_id=name)
    for i in sheets:
        for value in i:
            table = shipping_courier(xcel_file, value)
            shipping.append_shipping_table(table)
    return shipping
