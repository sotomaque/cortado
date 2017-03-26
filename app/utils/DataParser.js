import {
  User,
  Address,
  Order,
  World
} from '../beans';

export function initializeUser(data) {
  for(let i in User) {
    if(data[i]!=undefined && data[i]!='' && i!='address') {
      User[i] = data[i];
    }
  }

  let address = data.address;
  for(let i in Address) {
    if(address[i]!=undefined && address[i]!='') {
      Address[i] = address[i];
    }
  }

  let credit_card = data.credit_card;
  if(credit_card) {
    if(credit_card.last4) {
      User.payment_last4 = credit_card.last4;
    }
  }
}

export function updateCurrentOrderStatus(status) {
  if(getCurrentOrderStatus()!=Order.COMPLETE)
    Order.status = status.toUpperCase();
}

export function getCurrentOrderStatus() {
  if(Order.status=='SCHEDULED' || Order.status=='REQUESTED') {
    return Order.CONFIRMED;
  } else if(Order.status=='PICKUP') {
    return Order.PICKUP;
  } else if(Order.status=='WASH' || Order.status=='CLEANING') {
    return Order.CLEANING;
  } else if(Order.status=='DROPOFF') {
    return Order.DELIVERY;
  } else if(Order.status=='COMPLETE') {
    return Order.COMPLETE;
  } else {
    return Order.IDLE;
  }
}

export function initCurrentOrder(data) {
  Order.order_id = data.order_id;
  Order.pickup_date_string = data.pickup.date_string;
  Order.dropoff_date_string = data.dropoff.date_string;
  Order.total_price_string = data.total_price_string;
  Order.services = data.services;
  Order.status = data.status.toUpperCase();
  // for(let i in User) {
  //   if(data[i]!=undefined && data[i]!='' && i!='address') {
  //     User[i] = data[i];
  //   }
  // }
  //
  // let address = data.address;
  // for(let i in Address) {
  //   if(address[i]!=undefined && address[i]!='') {
  //     Address[i] = address[i];
  //   }
  // }
}

export function getUserInfo() {
  let data = {};
  for(let i in User) {
    data[i] = User[i];
  }
  data.address = Address;
  return data;
}

export function getAddress() {
  if(Address.zipcode==='' || Address.street==='') return "Set Address";
  else return Address.street;
}

export function getAddressSerialize() {
  return {
    street: Address.street,
    zipcode: Address.zipcode,
    notes: Address.notes,
    city: Address.city,
    country: Address.country,
    state: Address.state,
  };
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
    phone_number: User.phone_number,
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
