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
                # print(df.columns)
                df.columns = [rtn_attr_to_header(attr) for attr in df.columns]
                df.replace('None', np.nan, inplace=True)
                df.fillna("", inplace=True)
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return
            if model_name in ['Vendor', 'SKU', 'PSKU']:
                print(f'writting {model_name}')
                headers = list(globals().get(model_name).__annotations__.keys())
                headers = [rtn_attr_to_header(attr) for attr in headers]
                df = pd.DataFrame([dict(value) for value in db_model[model_name].values()])
                if model_name == 'PSKU':
                    df['skus'] = df['skus'].apply(lambda x: ' '.join(x))         
                df.columns = headers
                df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
                return
            # if model_name == 'Warehouse':
            #     print(f'writting {model_name}')
            #     headers = list(globals().get(model_name).__annotations__.keys())
            #     headers = [rtn_attr_to_header(attr) for attr in headers]
            #     print(f'headers: {headers}')
            #     print(df)
            #     # df.columns = headers
            #     # df.to_excel(MODELS_DIR + model_name + '.xlsx', index=False)
            #     return


    except Exception as e:
        print(f"An error occurred when writting to file: {str(e)}")
#dict_keys(['Zone', 
# 'Warehouse', 'Vendor', 'SKU', 'ProductTag', 'PaymentProcessingCountry', 'PaymentProcessingCard', 'PaymentPopCountry', 'PackagingWarehouse', 'PackagingVendor', 'PSKU', 
# 'WarehouseConfig', 
# 'Country', 'Shipping'])

def db_write_all():
    keys = db_model.keys()
    models = models_in_globals()
    for key in keys:
        write_to_xlsx(key, models)
    # return db_model