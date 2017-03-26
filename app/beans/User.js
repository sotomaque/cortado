var User = {
		user_id: '',
		fb_token: '',
    password: '',
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    profile_picture_url: '',
    fbid: '',
    phone_number: '',
    stripe_payment_token: '',
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
        return (stripe_payment_token != null && stripe_payment_token != "")
    }
}
export default User
