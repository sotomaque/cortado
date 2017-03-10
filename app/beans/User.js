var User = {

	FBAccessToken: '',
    password: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    profilePicture: '',
    FBID: '',
    phoneNumber: '',
    paymentToken: '',
    paymentLast4: '',

    isAdmin: false,
   
    customerSupportNumber: '',
    onDemandEnabled: false,
    onDemandHours: '',
    zipcodesServed: [''],
    promoCode: '',
    totalFreeCredits: 0.00,
    intercomEnabled: false,

    hasPayment: function () {
        return (paymentToken != null && paymentToken != "")
    }
	
}

export default User