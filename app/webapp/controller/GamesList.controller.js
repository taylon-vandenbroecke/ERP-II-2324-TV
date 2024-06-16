sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Dialog',
	'sap/m/Image',
	'sap/m/Button'
],
	function(Controller, JSONModel, Dialog, Image, Button) {
	"use strict";

	var ListController = Controller.extend("app.controller.GamesList", {

		onInit: function(oEvent) {

			// create and set JSON Model
			// this.oModel = new JSONModel(sap.ui.require.toUrl("https://A03Z.UCC.OVGU.DE:443/sap/opu/odata/sap/ZAS_66_STUDENTS_GW_SRV"));
			// this.getView().setModel(this.oModel);
		},

		onExit : function() {
			// destroy the model
			this.oModel.destroy();
		},

		handlePress: function (evt) {
			var sSrc = evt.getSource().getTarget();
			var oDialog = new Dialog({
				content: new Image({
					src: sSrc
				}),
				beginButton: new Button({
					text: 'Close',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			oDialog.open();
		}

	});



	return ListController;

});