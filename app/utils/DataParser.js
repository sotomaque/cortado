import {
  User,
  Address,
  World
} from '../beans';

export function initializeUser(data) {
  User.firstName = data.first_name,
  User.lastName = data.last_name,
  User.fullName = data.full_name,
  User.email = data.email,
  User.profilePicture = data.profile_picture_url,
  User.FBID = data.fbid,
  User.phoneNumber = data.phone_number,
  User.isAdmin = data.is_admin,
  User.promoCode = data.promo_code,
  User.totalFreeCredits = data.total_free_credits

  Address.ID = data.address.address_id,
  Address.apt = data.address.apt,
  Address.city = data.address.city,
  Address.country = data.address.country,
  Address.notes = data.address.notes,
  Address.state = data.address.state,
  Address.street = data.address.street,
  Address.zipcode = data.address.zipcode
}

export function updateUserInfo(data) {
  for(let i in User) {
    if(data[i]!=undefined && data[i]!='') {
      User[i] = data[i];
    }
  }
  // User.firstName = data.firstName,
  // User.lastName = data[1],
  // User.email = data[2],
  // User.password = data[3],
  if(User.first_name!='' && User.last_name!='')
    User.full_name = User.first_name + ' ' + User.last_name;
  // User.profilePicture = '',
  // User.FBAccessToken = '',
  // User.FBID = '',
  // User.phoneNumber = '',
  // User.isAdmin = false,
  // User.promoCode = '',
  // User.totalFreeCredits = 0.00
}

export function initializeWorld(data) {
  World.customerSupportNumber = data.customerSupportNumber,
  World.current_order = data.current_order,
  World.user = data.user,
  World.order_phase = data.order_phase,
  World.zipcodes_served = data.zipcodes_served,
  World.intercom_enabled = data.intercom_enabled,
  World.pickup_times = data.pickup_times
}

export function getRegistrationData() {
  return {
    email: User.email,
    password: User.password,
    full_name: User.full_name,
    first_name: User.first_name,
    last_name: User.last_name,
    phone_number: "",
    fb_token: User.fb_token,
    fbid: User.fbid
  };
}

export function getLoginFBData() {
  return {
    email: User.email,
    fb_token: User.fb_token,
    fbid: User.fbid
  };
}
