<div className='d-flex flex-column' style={{ width: '100%', paddingLeft: 4 }}>
    <div type='button' className='d-flex flex-row justify-content-between pb-1'
        onClick={() => setUiShipping(prevState => ({ ...prevState, b2c: !prevState.b2c }))}
    >
        <div className='d-flex' style={{ paddingLeft: 5 }}>
            {uiShipping.b2c ? 'B2C' : 'B2B'}
        </div>
        <div className='d-flex'>
            <img
                style={{ height: 24, width: 24, color: 'white', marginRight: 0 }}
                src={uiShipping.b2c ? switchOn : switchOff}
                alt="Switch"
            />
        </div>
    </div>
    <input className='input-secondary'
        type="number"
        placeholder='Discount %'
        value={uiDC}
        onChange={(e) => setUiDC(e.target.value)}
        style={{ backgroundColor: (uiDC === null || uiDC === '' || uiDC === '0') ? 'transparent' : '', width: '100%' }}
    />
</div>


for (let sku of selectedSku) {
    const cskus = sku.skus;

    for (let csku of cskus) {
        const foundSku = cSkus.find(s => s.name_id === csku);

        let objectiveMarginDecimal = uiOM ? parseFloat(uiOM) : 0;
        let objectDiscount = uiDC ? parseFloat(uiDC) : 0;
        if (foundSku) {
            setCalcOutput(prevState => ({
                ...prevState,
                priceWithoutDiscount: (prevState.priceWithoutDiscount + foundSku.total_cost) * (uiOM ? 1 + uiOM / 100 : 1),
                priceWithDiscount: (prevState.priceWithDiscount + (uiDC !== 0 ? foundSku.total_cost - (foundSku.total_cost * uiDC / 100) : foundSku.total_cost)) * (uiOM ? 1 + uiOM / 100 : 1),


                toWarehouseMargin: uiOM ? objectiveMarginDecimal + (10.3) : 0,
                toConsumerMargin: uiOM ? objectiveMarginDecimal + (4.3) : 0,
            }));
        }
    }
}