from db import db_model, DATA_DIR, MODELS_DIR, MODELS_DIR, MODELS_DIR 
import pandas as pd
import os
import numpy as np
from models import *
from db import db_model
from data_imports.db_init import models_in_globals
from data_imports.get_data import *

def rtn_attr_to_header(attr):
    # print('attr:', attr)
    if attr.endswith('_'):
        attr = attr[:-1] + '%'
    
    attr = attr.replace('_', ' ')
    attr = attr.strip().title()
    return attr

def write_to_xlsx(model_name, models):
    try:
        if model_name not in ['Shipping', 'Country', 'WarehouseConfig']:
            if model_name == 'Zone':
                print(f'writting {model_name}')
                df = pd.DataFrame.from_dict(db_model[model_name], orient='index').transpose()
                df.columns = [rtn_attr_to_header(attr) for attr in df.columns]
                df.replace('None', np.nan, inplace=True)
                df.fillna("", inplace=True)
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return
            if model_name in ['Vendor', 'SKU', 'PSKU', 'PaymentProcessingCountry', 'PaymentProcessingCard', 'ProductTag']:
                print(f'writting {model_name}')
                headers = list(globals().get(model_name).__annotations__.keys())
                headers = [rtn_attr_to_header(attr) for attr in headers]
                df = pd.DataFrame([dict(value) for value in db_model[model_name].values()])
                if model_name == 'PSKU':
                    df['skus'] = df['skus'].apply(lambda x: ' '.join(x))         
                df.columns = headers
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return
            if model_name == 'Warehouse':
                print(f'writting {model_name}')
                all = []
                for warehouse in db_model[model_name]:
                    for product in db_model[model_name][warehouse]:
                        inst = {**db_model[model_name][warehouse][product], 'product_tag': product}
                        all.append(inst)
                df = pd.DataFrame(all)
                df.columns = [rtn_attr_to_header(attr) for attr in df.columns]
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return
            if model_name == 'PackagingWarehouse':
                print(f'writting {model_name}')
                df = pd.DataFrame([dict(value) for value in db_model[model_name]])
                df.columns = [rtn_attr_to_header(attr) for attr in df.columns]
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return 
            
    except Exception as e:
        print(f"An error occurred when writting to file: {str(e)}")

def db_write_all():
    keys = db_model.keys()
    models = models_in_globals()
    for key in keys:
        write_to_xlsx(key, models)
    try:
        warehouseConfig = db_model['WarehouseConfig']
        print(f'writting WarehouseConfig')
        all = []
        for name_id, tag in warehouseConfig.items():
            countries_to_ship = tag.get('countries_to_ship', [])
            origin = tag.get('origin', [])
            product_tag_all = tag.get('products', [])
            product_tag = []
            for product in product_tag_all:
                keys = product
                product_tag.append(keys)
            all.append({'name_id': name_id, 'origin': origin, 'product_tag': product_tag, 'countries_to_ship': countries_to_ship})
        df = pd.DataFrame(all)
        df['product_tag'] = df['product_tag'].apply(lambda x: ' '.join(x))
        df['countries_to_ship'] = df['countries_to_ship'].apply(lambda x: ' '.join(x))  
        df['origin'] = df['origin'].apply(lambda x: ' '.join(x))
        df.columns = [rtn_attr_to_header(attr) for attr in df.columns]
        df.to_excel(MODELS_DIR + 'WarehouseConfig' + '.xlsx', index=False)
            
    except Exception as e:
        print(f"Error no WarehouseConfig Found: {str(e)}")
        