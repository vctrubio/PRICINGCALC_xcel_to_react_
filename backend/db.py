from data_imports.get_data import *
from models import *
from db_shipping import init_shipping_db
from db_init import files_in_dir

DATA_DIR = '../dataDir/'
MODELS_DIR = f'{DATA_DIR}Models/'
SHIPPING_DIR = f'{DATA_DIR}shipping/'
WAREHOUSE_DIR_DEFAULT = 'WarehouseMain/'

available_shippins = []

# models = ['Vendor', 'SKU', 'Packaging' 'PSKU', 'Warehouse', 'PackagingWarehouse', 'PackagingVendor']
# lst = ['Warehouse']
lst = ['Vendor', 'SKU', 'ProductTag', 'PSKU', 'Warehouse']


try:
    my_lst = files_in_dir(MODELS_DIR)
    for i in my_lst:
        print(f'AddingSuccesfully {i} to lst')
except Exception as e:
    raise RuntimeError("An error occurred when calling files_in_dir") from e


db_model = {} 
def do_psku(instance):
    global db_model
    product_tag = instance.product_tag #.lower() but also need to change it in the productDB
   
    try:
        ProductTag = db_model['ProductTag'][product_tag]
    except:
        print(f'ProductTag not found: {product_tag}')
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
    
def do_shipping(instance):
    return


ptr_model = None
for name in lst:
    dataframe, attr = read_excel_to_json('data_imports/DB_SEEDING.xlsx', name)
    ptr_model = locals()[name]
    if name not in db_model:
        db_model[name] = {}
    
    # we need try if else here
    for data in dataframe:
        # print(f'Adding {name} to data: ', data)
        
        instance = ptr_model(**data)

        if hasattr(instance, 'name_id'):
            
            if name == 'PSKU':
                if do_psku(instance):
                    db_model[name][instance.name_id] = instance
                    
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

def add_zones():
    global db_model
    zone_a = ['Spain', 'France', 'Germany', 'Italy', 'Portugal']
    zone_b = ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina']
    zone_c = ['China', 'Japan', 'Korea', 'Taiwan', 'Singapore']

    db_model['Zone'] = {}
    db_model['Zone']['A'] = zone_a
    db_model['Zone']['B'] = zone_b
    db_model['Zone']['C'] = zone_c
        
add_zones()
init_shipping_db('data_imports/Shipping_DHL.xlsx', 'express', 'standard')
init_shipping_db('data_imports/Shipping_Fedex.xlsx', 'express', 'standard')
init_shipping_db('data_imports/Shipping_Correos.xlsx', 'express', 'standard')


    
#db_model['CLASS']['NAME ID']
