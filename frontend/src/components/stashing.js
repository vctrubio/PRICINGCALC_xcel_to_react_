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