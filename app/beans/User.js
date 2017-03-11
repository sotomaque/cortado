var User = {
		fb_token: '',
    password: '',
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    profile_picture: '',
    fbid: '',
    phone_number: '',
    payment_token: '',
    payment_last4: '',
    is_admin: false,
    customer_support_number: '',
    on_demand_enabled: false,
    on_demand_hours: '',
    zip_codes_served: [''],
    promo_code: '',
    total_free_credits: 0.00,
    intercom_enabled: false,
    hasPayment: function () {
        return (payment_token != null && payment_token != "")
    }
}
export default User
