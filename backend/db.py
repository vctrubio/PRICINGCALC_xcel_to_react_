import os
from data_imports.get_data import *
from models import *
from db_shipping import parse_shipping_table
from db_init import files_in_dir
from models import Warehouse

DATA_DIR = '../dataDir/'
MODELS_DIR = f'{DATA_DIR}Models/'
SHIPPING_DIR = f'{DATA_DIR}Shipping/'
WAREHOUSE_DIR_DEFAULT = 'Warehouse Main/'

db_model = {} 

try:
    my_lst = files_in_dir(MODELS_DIR, file_ending='.xlsx', globals=True)
    my_lst.sort(reverse=True)
except Exception as e:
    raise RuntimeError("An error occurred when calling files_in_dir") from e


def do_psku(instance):
    global db_model
    product_tag = instance.product_tag #.lower() but also need to change it in the productDB
   
    try:
        ProductTag = db_model['ProductTag'][product_tag]
    except:
        print(f'ProductTag not found: {product_tag}') #product tag should be added to list if not exist?¿
        return False
    try:
        for i in instance.skus:
            if i not in db_model['SKU']:
                print(f'SKU not found: {i}')
                return False
    except:
        print(f'PSKU: {instance.name_id} has no SKUs')
        return False
    
    return True

def do_zone(dataframe, attr):
    zones = [a for a in attr if 'zone' in a]
    map_zone = {z.capitalize(): [d.get(z) for d in dataframe if d.get(z) is not None] for z in zones}
    db_model['Zone'] = map_zone
 

def do_warehouse_linking():
    db_model['WarehouseConfig'] = {}
    warehouse_dataframe, attr = read_excel_to_json(MODELS_DIR + 'WarehouseConfig.xlsx')
    # print(f'hellomother: {warehouse_dataframe}')
    for data in warehouse_dataframe:
        if data['name_id'] in db_model['Warehouse']:
            db_model['WarehouseConfig'][data['name_id']] = {}
            for key, value in data.items():
                if key != 'name_id':
                    db_model['WarehouseConfig'][data['name_id']][key] = value.split(' ')

            
def do_shipping_db(full_path, courier, warehouse):
    if not 'Shipping' in db_model:
        db_model['Shipping'] = {}   

    #OK so, do we want the same DHL rates for warehouse X and Y?
    #OR, do we do that, 
    # if (courier in db_model['Shipping']):
    #     db_model['Shipping'][courier].warehouses.append(warehouse)
    #     print(f'Warehouse {warehouse} added to {courier}')
    #     print(f'We need to think about this....')
    #     return 
    
    type_courier = pd.ExcelFile(full_path + '/' + courier, engine='openpyxl').sheet_names
    shipping = parse_shipping_table(full_path + '/' + courier, courier[:-5], type_courier)
    db_model['Shipping'][shipping.name_id] = shipping


def do_shipping():
    all_wh = [f for f in os.listdir(SHIPPING_DIR) if os.path.isdir(os.path.join(SHIPPING_DIR, f))]
    for warehouse in all_wh:
        full_path = SHIPPING_DIR + warehouse
        my_lst = files_in_dir(full_path, globals=False, file_ending='.xlsx')
        for courier in my_lst:
            # print(f'shipping... {courier} ... belogning to {warehouse}')
            do_shipping_db(full_path, courier, warehouse)


def do_country_list():
    look_up = 'countries_to_ship'
    countries = {}
    all_countries = []
    for name, warehouse in db_model['WarehouseConfig'].items():
        value = db_model['WarehouseConfig'][name].get(look_up)
        if value is not None:
            all_countries.append(value)

    set_countries = set(country for sublist in all_countries for country in sublist if len(country) > 1) 
    
    for zone_name, zone in db_model['Zone'].items():
        for z in zone:
            if z in set_countries:
                countries[z] = zone_name
                set_countries.remove(z)
                
    for leftover in set_countries:
        countries[leftover] = 'Zone_0'             
    
    db_model['Country'] = {k: countries[k] for k in sorted(countries)}
                
    #ok so, if country is defined in warehouse, but not in zone then we are not adding it....  
    #we can have a function to see all countries that do not exist, and ask for zone confirmation first and then we can add it to the dict      
   
    
ptr_model = None
for name in my_lst:
    if name == 'PaymentPopCountry':
        try:
            df = pd.read_excel(MODELS_DIR + name + '.xlsx')
            db_model[name] = df.set_index('Country')
        except:
            print('Column Country not found in PaymentPopCountry.xlsx')
        continue
       
    dataframe, attr = read_excel_to_json(MODELS_DIR + name + '.xlsx')
    # print(f'hellomyniger {attr} : {name}')
    ptr_model = locals()[name]
    
    if name not in db_model and name != 'PackagingWarehouse' and name != 'PackagingVendor':
        db_model[name] = {}
    else:
        db_model[name] = []
    
    if name == 'Zone':
        do_zone(dataframe, attr)
    else:
        for data in dataframe:
            instance = ptr_model(**data)

            if hasattr(instance, 'name_id'):
                if name == 'PSKU':
                    if do_psku(instance):
                        db_model[name][instance.name_id] = instance
                        # print(f'PSKU: {db_model[name][instance.name_id]} added to db')
                elif name == 'Warehouse':
                    name_id = instance.name_id
                    key = instance.product_tag
                    values = {k: v for k, v in instance if k != 'product_tag'}
                    if name not in db_model:
                        db_model[name] = {}
                    if name_id not in db_model[name]:
                        db_model[name][name_id] = {}
                    db_model[name][name_id][key] = values
            
                else:
                    db_model[name][instance.name_id] = instance
                    
            elif hasattr(instance, 'int_id'):
                db_model[name][instance.int_id] = instance
            
            else:
                if name == 'PackagingVendor':
                    db_model[name].append(instance)
                if name == 'PackagingWarehouse':
                    db_model[name].append(instance)

do_shipping()
do_warehouse_linking()
do_country_list()

#WAREHouseCONFIG to do and link in the front end.

#db_model['CLASS']['NAME ID']

'''
Shipping & Warehouse

'''