from fastapi import FastAPI, HTTPException, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from models import Vendor, SKU
from seeding import db_model
import json

vendors = list(db_model['Vendor'].values())
skus = list(db_model['SKU'].values())
discounts = list(db_model['Discount'].values())
shipping_entities = list(db_model['ShippingEntity'].values())
orders = list(db_model['Order'].values())
shippings = list(db_model['Shipping'].values())
packagings = list(db_model['Packaging'].values())

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the actual URL of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    lst = []
    for i in db_model:
        lst.append(i.lower())
    return {
       'Models': lst
    }
    
@app.get("/vendor")
async def root():
    return list(vendors)

@app.patch("/vendor/{name_id}")
async def update_vendor(name_id: str, vendor: Vendor):
    for index, current_vendor in enumerate(vendors):
        if current_vendor.name_id == name_id:
            vendors[index] = vendor
            return {"message": "Vendor updated successfully"}
    raise HTTPException(status_code=404, detail="Vendor not found")


@app.get("/sku")
async def root():
    return [sku.get_json() for sku in skus]

@app.patch("/sku/{name_id}")
async def update_sku(name_id: str, sku: SKU):
    for index, current_sku in enumerate(skus):
        if current_sku.name_id == name_id:
            skus[index] = sku
            return {"message": "SKU updated successfully"}
    raise HTTPException(status_code=404, detail="SKU not found")

@app.get("/sku/{name_id}")
async def get_sku(name_id: str):
    for sku in skus:
        if sku.name_id == name_id:
            return sku.get_json()
    raise HTTPException(status_code=404, detail="SKU not found")



@app.get("/discount")
async def get_discounts():
    return [discount for discount in discounts]

@app.get("/shippingentity")
async def get_shipping_entities():
    return [shipping_entity for shipping_entity in shipping_entities]

@app.get("/order")
async def get_orders():
    return [order for order in orders]

@app.get("/shipping")
async def get_shippings():
    return [shipping for shipping in shippings]

@app.get("/packaging")
async def get_packagings():
    return [packaging for packaging in packagings]















@app.get("/test")
async def root():
    return skus[0].get_json()

