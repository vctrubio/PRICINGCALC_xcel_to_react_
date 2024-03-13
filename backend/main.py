from fastapi import FastAPI, HTTPException, File, UploadFile, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models import Vendor, SKU, PSKU, Warehouse, ProductTag, PackagingWarehouse, PackagingVendor, PaymentProcessingCard, PaymentProcessingCountry, PaymentPopCountry
from db import db_model
from calculation import calculate, Calculate, CalcOptions, parse_total_cost
import json
import os

vendors = {v.name_id: v for v in db_model['Vendor'].values()}
skus = {v.name_id: v for v in db_model['SKU'].values()}
warehouse = list(db_model['Warehouse'].values())
# packagingWarehouse = list(db_model['PackagingWarehouse'].values())
pskus = {v.name_id: v for v in db_model['PSKU'].values()}
shipping = list(db_model['Shipping'])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the actual URL of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_disposable_models():
    # lst = [model.lower() for model in db_model]
    lst = [model for model in db_model]
    return {'Models': lst}
   
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

@app.post("/calctop")
async def custom(item: Calculate):
    rtn = calculate(item.warehouse_name, item.pskus, item.shipping_selection, item.zone)
    total = sum(parse_total_cost(r) for r in rtn)
    return total if total > 0 else None

@app.post("/calcbot")
async def custom(item: CalcOptions):
    print(f'hello: {item}')
    
    
''' VENDORS ''' 
@app.get("/vendor")
async def root():
    return vendors

@app.get("/vendor/{name_id}/sku")
async def root(name_id: str): 
    if name_id in vendors:
            return vendors[name_id].get_skus()
    raise HTTPException(status_code=404, detail="Vendor not found")

@app.patch("/vendor/{name_id}")
async def update_vendor(vendor: Vendor):
    print(f'patching vendor {vendor}')
    if vendor.name_id in vendors:  # check if the vendor exists in the vendors dictionary
        vendors[vendor.name_id] = vendor.dict()  # update the vendor
        return {"message": "Vendor updated successfully", "vendor": vendor.dict}
    raise HTTPException(status_code=404, detail="Vendor not found")

@app.post("/vendor")
async def create_vendor(vendor: Vendor):
    if vendor.name_id in vendors:
        raise HTTPException(status_code=400, detail="Vendor already exists")      
    vendors[vendor.name_id] = vendor
    db_model['Vendor'][vendor.name_id] = vendor
    return {"message": "Vendor created successfully"}

@app.delete("/vendor/{name_id}")
async def delete_vendor(name_id: str):
    if name_id in vendors:
        del vendors[name_id]
        return {"message": "Vendor deleted successfully"}
    raise HTTPException(status_code=404, detail="Vendor not found")




''' SKUS '''
@app.get("/sku")
async def root():
    return [sku.get_json() for sku in skus.values()]  # Extract values


@app.patch("/sku/{name_id}")
async def update_sku(name_id: str, sku: SKU):
    if name_id in skus:
        skus[name_id] = sku
        return {"message": "SKU updated successfully"}
    raise HTTPException(status_code=404, detail="SKU not found")


@app.get("/sku/{name_id}")
async def get_sku(name_id: str):
    if name_id in skus:
        return skus[name_id].get_json()
    raise HTTPException(status_code=404, detail="SKU not found")


@app.post("/sku")
async def create_sku(sku: SKU):
    print('post to sku')
    print(sku)
    if sku.name_id in skus:
        raise HTTPException(status_code=402, detail="SKU already exists")
    if sku.vendor_id not in vendors:
        raise HTTPException(status_code=400, detail="Invalid vendor_id. Vendor not found.")
    try:
        sku_obj = SKU(**sku.dict())
        print(sku_obj.get_json())
        skus[sku.name_id] = sku_obj
        return {"message": "SKU created successfully"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

'''PSKU'''
@app.get("/psku")
async def root():
    try:
        return [sku.get_json() for sku in pskus.values()]
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.patch("/psku/{name_id}")
async def update_psku(psku: PSKU):
    if psku.name_id in pskus:
        pskus[psku.name_id] = psku
        return {"message": "PSKU updated successfully"}
    raise HTTPException(status_code=404, detail="PSKU not found")
 
 
@app.get("/pskujson")
async def root():
    try:
        return [psku.get_json() for psku in pskus.values()]
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    

@app.post("/psku")
async def create_psku(psku: PSKU):
    print('post to psku')
    print(psku)
    print('-----------')
    if psku.name_id in pskus:
        raise HTTPException(status_code=400, detail="PSKU already exists")
    try:
        psku_dict = psku.dict()
        psku_dict['skus'] = ' '.join(psku_dict['skus'])
        psku_obj = PSKU(**psku_dict)
        pskus[psku_obj.name_id] = psku_obj
        db_model['PSKU'][psku_obj.name_id] = psku_obj
        return {"message": "PSKU created successfully"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
   
    
@app.get("/psku/{name_id}")
async def get_psku(name_id: str):
    if name_id in pskus:
        return pskus[name_id].dict()
    raise HTTPException(status_code=404, detail="PSKU not found")

@app.patch("/psku/{name_id}")
async def update_psku(name_id: str, psku: PSKU):
    if name_id in pskus:
        #checkl to see what fields are input and only change those 
        pskus[name_id] = psku
        return {"message": "PSKU updated successfully"}
    raise HTTPException(status_code=404, detail="PSKU not found")

@app.delete("/psku/{name_id}")
async def delete_psku(name_id: str):
    if name_id in pskus:
        del pskus[name_id]
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
            print(warehouse_obj)
            
            print(ptr.product_tag)
            print(warehouse_obj)
            key = {k: v for k, v in warehouse_obj.__dict__.items() if k != 'product_tag'}            
            
            if ptr.name_id not in db_model['Warehouse']:
                db_model['Warehouse'][ptr.name_id] = {}
            
            warehouse_dict = {ptr.product_tag: key}
            if ptr.product_tag in db_model['Warehouse'][ptr.name_id]:
                db_model['Warehouse'][ptr.name_id][ptr.product_tag] = {}
            
            db_model['Warehouse'][ptr.name_id][ptr.product_tag] = key
            
            #if product tag is not in product tag. api post to product tag
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

'''ProductTag'''
@app.get("/producttag")
async def root():
    return db_model['ProductTag']

#post product tag
@app.post("/producttag")
async def create_producttag(product_tag: ProductTag):
    if product_tag.name_id not in db_model['ProductTag']:
        db_model['ProductTag'][product_tag.name_id] = product_tag
        return {"message": "ProductTag created successfully"}
    raise HTTPException(status_code=400, detail="ProductTag already exists")

#delete product tag
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


'''For Debugging'''
@app.get("/test")
async def test_route():
    return skus[0].get_json()

