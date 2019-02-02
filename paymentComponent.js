(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['paymentComponent'], factory);
    } else {
        // Browser globals
        root.paymentComponent = factory(root.options);
    }
}(window, function(options) {

    var paymentComponent = {

    	quantity: 0,

    	price: 0,

    	cod_eligible: false,

    	offer_amount: 0,

    	amount_payable: 0,

    	initialize : function(options){
    		var self = this;
			self.quantity = options.quantity;
            self.price = options.price;
            self.cod_eligible = options.cod_eligible;
            self.amount_payable = self.quantity*self.price;

            self.createHTML(document.getElementById(options.component_id));

            document.getElementById("quantity").innerHTML = self.quantity;

            document.getElementById("total-price").innerHTML = self.quantity*self.price;

            document.getElementById("amount-payable").innerHTML = self.amount_payable;

            document.querySelectorAll(".payment-options-tab").forEach(function(el){
            	var tabname = el.getAttribute("data-tabname");
            	if(tabname === "cod" && !self.cod_eligible) {
            		el.classList.add("disabled");
            	}
            	el.addEventListener('click', function() {
            		self.hideAllTabs();
            		el.nextElementSibling.style.display = "block";
            		el.parentElement.classList.add("activeTab");
            		self.checkOffersTab(tabname);
            	});
            });

            document.querySelectorAll(".pay-btn").forEach(function(el){
            	el.addEventListener('click', function() {
            		alert("Amount Payabele - Rs." + self.amount_payable);
            	});
            });

            document.querySelectorAll("input[name='card_type']").forEach(function(el){
            	el.addEventListener('change', function() {
            		self.checkOffersTab('cc');
            	});
            });
            document.querySelectorAll("input[name='card_bank']").forEach(function(el){
            	el.addEventListener('change', function() {
            		self.checkOffersTab('cc');
            	});
            });
    	},

    	hideAllTabs: function() {
    		document.querySelectorAll(".payment-options-content").forEach(function(el){
            	el.style.display = "none";
            	el.parentElement.classList.remove("activeTab");
            });
    	},

    	checkOffersTab: function(tabname) {
    		var self = this;
    		var total_amount = self.quantity*self.price;
    		if(tabname === 'cod') {
    			self.offer_amount = 0;
    			document.getElementById("bank-offers").style.display = "none";
    		
    		} else if(tabname === 'pp' && total_amount > 2500) {
    			self.offer_amount = 200;
    			document.getElementById("bank-offers").style.display = "block";
    		} else if(tabname === 'cc') {
    			var card_type = document.querySelectorAll("input[name=card_type]:checked")[0].value;
    			var card_bank = document.querySelectorAll("input[name=card_bank]:checked")[0].value;
    			self.offer_amount = 0;
    			if(card_type === 'mastercard') {
    				if(total_amount*0.1 < 1500) {
    					self.offer_amount = total_amount*0.1;
    				} else {
    					self.offer_amount = 1500;
    				}
    			} 
    			if( card_bank === "hdfc") {
    				if(total_amount*0.1 < 2000) {
    					self.offer_amount += (total_amount*0.1);
    				} else {
    					self.offer_amount += 2000;
    				}
    			} else if(card_bank === "sbi") {
    				if(total_amount*0.05 < 1000) {
    					self.offer_amount += (total_amount*0.05);
    				} else {
    					self.offer_amount += 1000;
    				}
    			}
    			document.getElementById("bank-offers").style.display = "block";
    		} 
    		document.getElementById("bank-offer-amount").innerHTML = self.offer_amount;
    		document.getElementById("amount-payable").innerHTML = total_amount - self.offer_amount;
    		self.amount_payable = total_amount - self.offer_amount;
    	},

        createHTML: function(el) {
            el.innerHTML = '<div class="page-wrapper">' +
                '<div class="container">'+
                    '<div class="col-9">'+
                        '<div class="payment-wrapper">'+
                            '<div class="payment-options-title">Payment Options</div>'+
                            '<div class="payment-options-item">'+
                                '<div class="payment-options-tab" data-tabname="cod">Cash on Delivery</div>'+
                                '<div class="payment-options-content">'+
                                    '<a href="javascript:void(0)" class="pay-btn">Continue</a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="payment-options-item">'+
                                '<div class="payment-options-tab" data-tabname="cc">Credit Card</div>'+
                                '<div class="payment-options-content">'+
                                    '<input type="radio" name="card_type" value="visa" checked>VISA<br/>'+
                                    '<input type="radio" name="card_type" value="mastercard">MASTERCARD<br/>'+
                                    '<input type="radio" name="card_type" value="maestro">MAESTRO<br/> '+

                                    '<br/>'+
                                    '<br/>'+
                                    '<input type="radio" name="card_bank" value="hdfc" checked>HDFC<br/>'+
                                    '<input type="radio" name="card_bank" value="sbi">SBI<br/>'+
                                    '<input type="radio" name="card_bank" value="other">Other<br/> '+
                                    '<a href="javascript:void(0)" class="pay-btn">Continue</a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="payment-options-item">'+
                                '<div class="payment-options-tab" data-tabname="pp">PhonePe</div>'+
                                '<div class="payment-options-content">'+
                                    '<div>You will be redirect to PhonePe page</div>'+
                                    '<a href="javascript:void(0)" class="pay-btn">Continue</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-3">'+
                        '<div class="price-details">'+
                            '<div class="price-details-title">Price Details</div>'+
                            '<div class="price-details-content">'+
                                '<div class="">'+
                                    '<div class="price-details-row">'+
                                        '<div>Price (<span id="quantity">1</span> item)</div>'+
                                        '<div id="total-price"></div>'+
                                    '</div>'+
                                    '<div id="bank-offers" class="price-details-row">'+
                                        '<div>Bank Offer</div>'+
                                        '<div id="bank-offer-amount"></div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="price-details-row amount-payable">'+
                                    '<div>Amount Payable</div>'+
                                    '<div id="amount-payable"></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="offers">'+
                            '<div class="offers-title">Offers</div>'+
                            '<div class="offers-content">'+
                                '<div>10% off upto Rs 1500 with Master Card</div>'+
                                '<div>10% off on top of existing discounts(through other bank offers) up to Rs 2000 with HDFC Credit Card</div>'+
                                '<div>5% off on top of existing discounts up to Rs 1000 with SBI Credit Card</div>'+
                                '<div>Flat Rs 200 off for order above Rs 2000 with PhonePe</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="clearfix"></div>'+
                '</div>'+
            '</div>';
        }
	}


    return paymentComponent;

}));