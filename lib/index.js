'use strict';
const axios = require('axios')
const qs = require('querystring')
Uniteller.PACKAGE_VERSION = require('../package.json').version;

const SHA256 = require('js-sha256').sha256
const sha256 = (secret) => {
	return SHA256(secret.toString())
}
// function to render Uniteller time forma like YYYY-MM-DD hh:mm:ss
function unitellerTimeFormat(){
	const timeZoneDef = (new Date().getTimezoneOffset() + 180) / 60 // 180 - Moscow time zone offset
	const newDate = new Date()
	newDate.setHours(newDate.getHours() + timeZoneDef)
	const year = newDate.getFullYear()
	const month = newDate.getMonth() + 1
	const date = newDate.getDate()
	const hours = newDate.getHours()
	const minutes = newDate.getMinutes()

	const result = year + '-' + (month <= 9 ? '0' + month : month) + '-' + (date <= 9 ? '0' + date : date) + ' ' + (hours <= 9 ? '0' + hours : hours) + ':' + (minutes <= 9 ? '0' + minutes : minutes) + ':00'
	return result
}

function Uniteller(UPID, LOGIN, PASSWORD, URL, DEBUG) {
	this.UPID = UPID
	this.LOGIN = LOGIN
	this.PASSWORD = PASSWORD
	this.URL = URL
	this.debug = DEBUG
}
Uniteller.prototype = {
	getPaymentLink: function({orderId, amount}) {
		// handle empty parameters
		if(!amount){
			console.error('please set amount parameter')
			return 
		}
		
		const self = this
		// prepare all parameters
		const OrderID = orderId || ''
		const OrderLifeTime = ''
		const Lifetime = ''
		const CurrentDate = unitellerTimeFormat()
		const Subtotal_P = amount
		const Signature = (sha256(sha256(OrderID) +
		'&' + sha256(self.UPID) +
		'&' + sha256(OrderLifeTime) +
		'&' + sha256(CurrentDate) +
		'&' + sha256(Subtotal_P) +
		'&' + sha256(Lifetime) +
		'&' + sha256(self.PASSWORD))).toUpperCase()

		const postData = qs.stringify({
			OrderID,
			UPID: self.UPID,
			OrderLifeTime,
			CurrentDate,
			Subtotal_P,
			Lifetime,
			URL_RETURN: self.URL,
			Signature
		})
		// making request
		return axios.post('https://api.uniteller.ru/simple/register', postData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((response) => {
			if(self.debug){console.log(response.data)}
			return response.data
		})
	},
	checkPaymentStatus: function(orderId){
		const self = this
		// get uniteller payment results
		const postData = qs.stringify({
			Shop_ID: self.UPID,
			Login: self.LOGIN,
			Password: self.PASSWORD,
			Format: 1,
			ShopOrderNumber: orderId
		})

		return axios.post('https://wpay.uniteller.ru/results/', postData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((response) => {
			if(self.debug){console.log(response.data)}
			return response.data
		})
	}
}

function init({UPID, LOGIN, PASSWORD, URL, DEBUG}) {
	return new Uniteller(UPID, LOGIN, PASSWORD, URL, DEBUG);
  }
  
  module.exports = init;
  module.exports.Uniteller = Uniteller;