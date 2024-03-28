import os
import signal
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, File, UploadFile, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models import Vendor, SKU, PSKU, Warehouse, ProductTag, PackagingWarehouse, PackagingVendor, PaymentProcessingCard, PaymentProcessingCountry
from db import db_model
from db_write import db_write_all
from calculation import calculate, parse_total_cost, calculate_options
from init import stop

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WarehouseConfigParams(BaseModel):
    key: Optional[str] = None
    value: Optional[List[str]] = None

@app.get("/")
async def get_disposable_models():
    lst = [model for model in db_model]
    return {'Models': lst}

@app.get("/exit")
async def exit():
    await stop()
    return {"message": "Exiting..."}

@app.get("/save")
async def save():
    db_write_all()
    # exit()
    return {"message": "Saving..."}
 
@app.post("/upload")
async def upload_file(file: UploadFile = File(...),  filename: str = Form(...)):
    print(f"Uploading file: {filename}")
    parent_directory = os.path.dirname(os.getcwd())
    directory = os.path.join(parent_directory, 'dataDir/Models')
    file_location = f"{directory}/{filename}"
    try:
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        return {"info": "file uploaded successfully"}
    except Exception as e:
        print(f"Error uploading file: {e}")
        return {"error": "Internal Server Error"}

@app.post("/calculate")
async def custom(item: dict, option: dict):
    rtn = calculate(item['warehouse_name'], item['pskus'], item['shipping_selection'], item['zone'])
    total = sum(parse_total_cost(r) for r in rtn)
    if total < 0:
        return None
    try:
        ptr_country = db_model['PaymentProcessingCountry'][option['country_input']]
        ptr_country.sales_fee_ 
        ptr_country.sales_fee
    except Exception as e:
        print(f'Error: no country found in PaymentProcessingCountry: {str(e)}')
    
    total + ptr_country.sales_fee
    
    v = calculate_options(option['objective_margin'], option['tax'], option['marketing'], ptr_country.sales_fee_)
    return total / v


''' VENDORS ''' 
@app.get("/vendor")
async def root():
    return db_model['Vendor']

@app.get("/vendor/{name_id}")
async def root(name_id: str): 
    if name_id in db_model['Vendor']:
        return db_model['Vendor'][name_id].get_skus()
    raise HTTPException(status_code=404, detail="Vendor not found")

@app.patch("/vendor/{name_id}")
async def update_vendor(vendor: Vendor):
    print(f'patching vendor {vendor}')
    if vendor.name_id in db_model['Vendor']:
        db_model['Vendor'][vendor.name_id] = vendor
        return {"message": "Vendor updated successfully", "vendor": vendor}
    raise HTTPException(status_code=404, detail="Vendor not found")

@app.post("/vendor")
async def create_vendor(vendor: Vendor):
    if vendor.name_id in db_model['Vendor']:
        raise HTTPException(status_code=400, detail="Vendor already exists")      
    db_model['Vendor'][vendor.name_id] = vendor
    return {"message": "Vendor created successfully"}

@app.delete("/vendor/{name_id}")
async def delete_vendor(name_id: str):
    if name_id in db_model['Vendor']:
        del db_model['Vendor'][name_id]
        return {"message": "Vendor deleted successfully"}
    raise HTTPException(status_code=404, detail="Vendor not found")

'''VendorTag'''
@app.post("/vendortag")
async def create_vendortag(vendor_tag: str, vendor_id: str):
    if not vendor_tag in db_model['VendorTag']:
        db_model['VendorTag'][vendor_tag] = []
    if vendor_id not in db_model['VendorTag'][vendor_tag]:
        db_model['VendorTag'][vendor_tag].append(vendor_id)
    return {"message": "VendorTag created successfully", "vendor_tag": vendor_tag, "vendor_id": vendor_id}

@app.get("/vendortag")
async def root():
    return db_model['VendorTag']

''' SKUS '''
@app.get("/sku")
async def root():
    return [sku.get_json() for sku in db_model['SKU'].values()]  # Extract values

@app.patch("/sku/{name_id}")
async def update_sku(name_id: str, sku: SKU):
    print('heloooooo.workd')
    if name_id in db_model['SKU']:
        db_model['SKU'][name_id] = sku
        return {"message": "SKU updated successfully",
                "object": sku.get_json()}
    raise HTTPException(status_code=404, detail="SKU not found")

@app.get("/sku/{name_id}")
async def get_sku(name_id: str):
    if name_id in db_model['SKU']:
        return db_model['SKU'][name_id].get_json()
    raise HTTPException(status_code=404, detail="SKU not found")

@app.post("/sku")
async def create_sku(sku: SKU):
    if sku.name_id in db_model['SKU']:
        raise HTTPException(status_code=402, detail="SKU already exists")
    if sku.vendor_id not in db_model['Vendor']:
        raise HTTPException(status_code=400, detail="Invalid vendor_id. Vendor not found.")
    try:
        sku_obj = SKU(**sku.dict())
        print(sku_obj.get_json())
        db_model['SKU'][sku.name_id] = sku_obj
        return {"message": "SKU created successfully"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.delete("/sku/{name_id}")
async def delete_sku(name_id: str):
    if name_id in db_model['SKU']:
        del db_model['SKU'][name_id]
        return {"message": "SKU deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="SKU not found")

'''PSKU'''
@app.get("/psku")
async def root():
    try:
        return [sku.get_json() for sku in db_model['PSKU'].values()]
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.patch("/psku/{name_id}")
async def update_psku(psku: PSKU):
    if psku.name_id in db_model['PSKU']:
        db_model['PSKU'][psku.name_id] = psku
        return {"message": "PSKU updated successfully"}
    raise HTTPException(status_code=404, detail="PSKU not found")

@app.post("/psku")
async def create_psku(psku: PSKU):
    if psku.name_id in db_model['PSKU']:
        raise HTTPException(status_code=400, detail="PSKU already exists")
    try:
        psku_dict = psku.dict()
        psku_dict['skus'] = ' '.join(psku_dict['skus'])
        psku_obj = PSKU(**psku_dict)
        db_model['PSKU'][psku_obj.name_id] = psku_obj
        return {"message": "PSKU created successfully"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
   
@app.get("/psku/{name_id}")
async def get_psku(name_id: str):
    if name_id in db_model['PSKU']:
        return db_model['PSKU'][name_id].dict()
    raise HTTPException(status_code=404, detail="PSKU not found")

@app.patch("/psku/{name_id}")
async def update_psku(name_id: str, psku: PSKU):
    if name_id in db_model['PSKU']:
        db_model['PSKU'][name_id] = psku
        return {"message": "PSKU updated successfully"}
    raise HTTPException(status_code=404, detail="PSKU not found")

@app.delete("/psku/{name_id}")
async def delete_psku(name_id: str):
    if name_id in db_model['PSKU']:
        del db_model['PSKU'][name_id]
        return {"message": "PSKU deleted successfully"}
    raise HTTPException(status_code=404, detail="PSKU not found")


'''Warehouse'''
@app.get("/warehouse")
async def root():
    return db_model['Warehouse']

@app.post("/warehouse")
async def create_warehouse(ptr: Warehouse):
    print('post to warehouse')
    try:
            warehouse_obj = Warehouse(**ptr.dict())
            key = {k: v for k, v in warehouse_obj.__dict__.items() if k != 'product_tag'}            
            
            if ptr.name_id not in db_model['Warehouse']:
                db_model['Warehouse'][ptr.name_id] = {}
            
            warehouse_dict = {ptr.product_tag: key}
            if ptr.product_tag in db_model['Warehouse'][ptr.name_id]:
                db_model['Warehouse'][ptr.name_id][ptr.product_tag] = {}
            
            db_model['Warehouse'][ptr.name_id][ptr.product_tag] = key
            
            if ptr.product_tag not in db_model['ProductTag']:
                db_model['ProductTag'][ptr.product_tag] = ptr.product_tag
                
            return {"message": "Warehouse created successfully;", "warehouse": warehouse_dict}
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=422, detail=str(e))

@app.patch("/warehouse/{name_id}/{product_tag}")
async def update_warehouse(warehouse: Warehouse):
    print(f'patching warehouse {warehouse} for {warehouse.name_id} and {warehouse.product_tag}')
    if warehouse.name_id in db_model['Warehouse']:
        db_model['Warehouse'][warehouse.name_id][warehouse.product_tag] = warehouse
        return {"message": "Warehouse updated successfully"}
    raise HTTPException(status_code=404, detail="Warehouse not found")

@app.delete("/warehouse/{name_id}/{product_tag}")
async def delete(name_id: str, product_tag: str):
    if name_id in db_model['Warehouse'] and product_tag in db_model['Warehouse'][name_id]:
        del db_model['Warehouse'][name_id][product_tag]
        return {'message': 'that was good'}
    raise HTTPException(status_code=404, detail="Warehouse Product not found")

'''PackagingVendor and PackagingWarehouse'''
@app.get("/packagingvendor")
async def root():
    return db_model['PackagingVendor']

@app.post("/packagingvendor")
async def create_packagingvendor(packaging: PackagingVendor):
    #to check for product tag to exist. but thats handled in the front end
    for list in db_model['PackagingVendor']:
        if list.vendor_id == packaging.vendor_id and list.product_tag == packaging.product_tag:
            list.cost_of_packaging = packaging.cost_of_packaging
            return JSONResponse(status_code=202, content={"message": "PackagingVendor updated successfully"})
    try:
         db_model['PackagingVendor'].append(packaging)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    return {"message": "PackagingVendor created successfully"}

@app.patch("/packagingvendor/{vendor_id}/{product_tag}")
async def update_packagingvendor(packaging: PackagingVendor):
    for list in db_model['PackagingVendor']:   
        if list.vendor_id == packaging.vendor_id and list.product_tag == packaging.product_tag:
            list.cost_of_packaging = packaging.cost_of_packaging 
            return {"message": "PackagingVendor updated successfully"}
    raise HTTPException(status_code=404, detail="PackagingVendor not found")   

@app.get("/packagingwarehouse")
async def root():
    return db_model['PackagingWarehouse']

@app.post("/packagingwarehouse")
async def create_packagingwarehouse(packaging: PackagingWarehouse):
    for list in db_model['PackagingWarehouse']:
        if list.product_tag == packaging.product_tag:
            list.cost_of_packaging = packaging.cost_of_packaging
            return JSONResponse(status_code=202, content={"message": "PackagingWarehouse updated successfully"})
    try:
         db_model['PackagingWarehouse'].append(packaging)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    return {"message": "PackagingWarehouse created successfully"}

@app.patch("/packagingwarehouse/{product_tag}")
async def update_packagingwarehouse(packaging: PackagingWarehouse):
    for list in db_model['PackagingWarehouse']:
        if list.product_tag == packaging.product_tag:
            list.cost_of_packaging = packaging.cost_of_packaging
            return {"message": "PackagingWarehouse updated successfully"}
    raise HTTPException(status_code=404, detail="PackagingWarehouse not found")

@app.delete("/packagingwarehouse/{name_id}")
async def delete_packagingwarehouse(name_id: str):
    for list in db_model['PackagingWarehouse']:
        if list.name_id == name_id:
            db_model['PackagingWarehouse'].remove(list)
            return {"message": "PackagingWarehouse deleted successfully"}
    raise HTTPException(status_code=404, detail="PackagingWarehouse not found")

'''ProductTag'''
@app.get("/producttag")
async def root():
    return db_model['ProductTag']

@app.post("/producttag")
async def create_producttag(product_tag: ProductTag):
    if product_tag.name_id not in db_model['ProductTag']:
        db_model['ProductTag'][product_tag.name_id] = product_tag
        return {"message": "ProductTag created successfully"}
    raise HTTPException(status_code=400, detail="ProductTag already exists")

@app.delete("/producttag/{name_id}")
async def delete_producttag(name_id: str):
    if name_id in db_model['ProductTag']:
        del db_model['ProductTag'][name_id]
        return {"message": "ProductTag deleted successfully"}
    raise HTTPException(status_code=404, detail="ProductTag not found")


'''Paymensts'''
@app.get("/paymentprocessingcard")
async def root():
    return db_model["PaymentProcessingCard"]

@app.patch("/paymentprocessingcard/{name_id}")
async def update_paymentprocessingcard(card: PaymentProcessingCard):
    name_id = card.name_id
    if name_id in db_model["PaymentProcessingCard"]:
        db_model["PaymentProcessingCard"][name_id] = card
        return {"message": "PaymentProcessingCard updated successfully"}
    raise HTTPException(status_code=404, detail="PaymentProcessingCard not found")

@app.get("/paymentprocessingcountry")
async def root():
    return db_model["PaymentProcessingCountry"]

@app.get("/paymentprocessingcountry/{name_id}")
async def root(name_id: str):
    if name_id in db_model['PaymentProcessingCountry']:
        return db_model['PaymentProcessingCountry'][name_id]
    raise HTTPException(status_code=404, detail="PaymentProcessingCountry not found")

@app.patch("/paymentprocessingcountry/{name_id}")
async def update_paymentprocessingcountry(country: PaymentProcessingCountry):
    name_id = country.name_id
    if name_id in db_model["PaymentProcessingCountry"]:
        db_model["PaymentProcessingCountry"][name_id] = country
        return {"message": "PaymentProcessingCountry updated successfully"}
    raise HTTPException(status_code=404, detail="PaymentProcessingCountry not found")

@app.get("/paymentpopcountry")
async def root():
    df_json = db_model["PaymentPopCountry"].to_dict(orient='index')
    return df_json

@app.patch("/paymentpopcountry/{name_id}")
async def update_paymentpopcountry(name_id: str, country: dict = Body(...)):
    if name_id in db_model["PaymentPopCountry"].index:
        existing_row = db_model["PaymentPopCountry"].loc[name_id].copy()
        for key, value in country.items():
            if key in existing_row.index:
                existing_row[key] = value
        db_model["PaymentPopCountry"].loc[name_id] = existing_row
        return {"message": f"PaymentPopCountry {name_id} updated successfully"}
    raise HTTPException(status_code=404, detail="PaymentPopCountry not found")


'''WarehouseConfig'''
@app.get("/warehouseconfig/{name_id}")
async def root(name_id: str):
    if name_id in db_model['WarehouseConfig']:
        return db_model['WarehouseConfig'][name_id]
    raise HTTPException(status_code=404, detail="WarehouseConfig not found")

@app.get("/warehouseconfig")
async def root():
    return db_model['WarehouseConfig']

@app.patch("/warehouseconfig/{name_id}")
async def root(name_id: str, item: WarehouseConfigParams):
    try:
        db_model['WarehouseConfig'][name_id][item.key] = item.value
        return db_model['WarehouseConfig'][name_id]
    except KeyError as e:
        raise HTTPException(status_code=404, detail=f"WarehouseConfigPatchKey not found: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


'''Zone'''
@app.get("/zone")
async def root():
    return db_model['Zone']


'''Country'''
@app.get("/country")
async def root():
    return db_model['Country']


'''Shipping'''
@app.get("/shipping")
async def root():
    return db_model['Shipping']

@app.get("/shipping/{name_id}")
async def root(name_id: str):
    if name_id in db_model['WarehouseConfig']:
        return db_model['WarehouseConfig'][name_id]['Shipping']
    raise HTTPException(status_code=404, detail="Shipping not found")

@app.get("/shipping/{name_id}/{courier}")
async def root(name_id: str, courier: str):
    if name_id in db_model['WarehouseConfig']:
        if courier in db_model['WarehouseConfig'][name_id]['Shipping']:
            return db_model['WarehouseConfig'][name_id]['Shipping'][courier]
    raise HTTPException(status_code=404, detail="Shipping not found")


'''Zone'''
@app.get("/zone")
async def root():
    return db_model['Zone']
