import os
from models import *


def models_in_globals():
    global_symbols = globals()

    defined_classes = [value for key, value in global_symbols.items(
    ) if isinstance(value, type) and key != 'BaseModel']
    class_names = [class_obj.__name__ for class_obj in defined_classes]
    return class_names


def files_in_dir(dir, file_ending, globals):
    init = [f for f in os.listdir(dir) if os.path.isfile(os.path.join(dir, f)) and f.endswith(str(file_ending))]
    if len(init) != len(set(init)):
        raise ValueError('Duplicate file names found in models directory. Please remove duplicates. |CASE INSeNSITIVE|')
     
    if globals:
        hot_models = models_in_globals()
        rtn = []

        for i in init:
            tmp = i.replace('.xlsx', '')
            if tmp.lower() in map(str.lower, hot_models):
                rtn.append(tmp)
        return rtn
    
    return init
