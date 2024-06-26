import { Col } from 'react-bootstrap'

export default function SkuLink({ name, onClick }) {

    return (
        <div className='sku-link' onClick={onClick}>
                <Col md={1}>
                    {name}
                </Col>
        </div>
    )
}