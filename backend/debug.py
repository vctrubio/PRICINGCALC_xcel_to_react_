from data_imports.get_data import *

from db import db_model
from models import *
from calculation import calculate, parse_total_cost, calculate_options
from db_write import db_write_all

def models_in_globals():
    global_symbols = globals()
    defined_classes = [value for key, value in global_symbols.items() if isinstance(value, type) and key != 'BaseModel']
    class_names = [class_obj.__name__ for class_obj in defined_classes]

    for i in defined_classes:
        print(f'Found {i}')
        
    return class_names

db_write_all()

