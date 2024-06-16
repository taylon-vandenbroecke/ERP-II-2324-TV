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
			this.oModel = this.getOwnerComponent().getModel("odataModel");
      		this.getView().setModel(this.oModel);
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
		},
		onListItemPress: function(oEvent) {
			var oSelectedItem = oEvent.getSource().getBindingContext();
			var sGameId = oSelectedItem.getProperty("Id");
	
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("CreateFavorite", {
				FkGameid: sGameId,
			});
		},
        goToStudents: function(f) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("StudentsList");
        },

	});



	return ListController;

});