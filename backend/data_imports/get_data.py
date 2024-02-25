from pydantic import BaseModel, Field
import pandas as pd

#if ends with %, check to see there is no space before it
def rtn_header_to_attr(header):
    if header.endswith('IF'):
        header = header[:-2]
        
    header = header.lower().strip()
    header = header.replace(' ', '_')

    if header.endswith('%'):
        header = header[:-1] + '_'
    
    return header

def read_excel_to_json(file, sheet):
    df = pd.read_excel(file, sheet_name=sheet)
    get_attr = []
    for i in df.columns.tolist():
        if not i.startswith('/'):
            get_attr.append(rtn_header_to_attr(i))
    
    df = df.drop(columns=[col for col in df.columns if col.startswith('/')])
    df.columns = get_attr
    
    data = []
    for _, row in df.iterrows():
        ptr = {attr: row[attr] for attr in get_attr if not pd.isna(row[attr])}
        if not ptr:
            break
        data.append(ptr)

    return data, get_attr
