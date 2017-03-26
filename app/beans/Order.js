var Order = {
		order_id: '',
    status: '',
    services: '',
    pickup_date_string: '',
    dropoff_date_string: '',
    total_price_string: '',
    IDLE: -1,
    CONFIRMED: 0,
    PICKUP: 1,
    CLEANING: 2,
    DELIVERY: 3,
		COMPLETE: 4,
}
export default Order;
