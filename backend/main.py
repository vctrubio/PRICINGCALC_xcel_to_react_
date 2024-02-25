from fastapi import FastAPI, HTTPException, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from models import Vendor, SKU, PSKU, Shipping, Warehouse, ProductTag, Packaging
from db import db_model
import json


vendors = {v.name_id: v for v in db_model['Vendor'].values()}
skus = {v.name_id: v for v in db_model['SKU'].values()}
warehouse = list(db_model['Warehouse'].values())
packaging = list(db_model['Packaging'].values())
pskus = {v.name_id: v for v in db_model['PSKU'].values()}
shipping = list(db_model['Shipping'].values())

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
    lst = [model.lower() for model in db_model]
    return {'Models': lst}
   

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
async def update_vendor(name_id: str, vendor: Vendor):
    if name_id in vendors:  # check if the vendor exists in the vendors dictionary
        vendors[name_id] = vendor.dict()  # update the vendor
        return {"message": "Vendor updated successfully"}
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
        return pskus
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    
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



'''Packaging'''
@app.get("/packaging")
async def root():
    return packaging

@app.post("/packaging")
async def create_packaging(packaging: Packaging):
    if packaging.name_id not in db_model['Packaging']:
        db_model['Packaging'][packaging.name_id] = packaging
        return {"message": "Packaging created successfully"}
    raise HTTPException(status_code=400, detail="Packaging already exists")

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

'''PSKU'''
@app.get("/pskujson")
async def root():
    return [psku.get_json() for psku in pskus]


'''Zone'''
@app.get("/zone")
async def root():
    return db_model['Zone']


'''Shipping'''
@app.get("/shipping")
async def root():
    return db_model['Shipping']

'''For Debugging'''
@app.get("/test")
async def test_route():
    return skus[0].get_json()

