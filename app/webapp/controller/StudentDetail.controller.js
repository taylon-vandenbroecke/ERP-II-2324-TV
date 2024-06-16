sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
      "sap/ui/model/Filter",
    ],
    function (Controller, MessageToast, MessageBox, Filter) {
      "use strict";
  
  
      return Controller.extend("app.controller.StudentDetail", {
        iAantalInschrijvingen: 0,
  
        onInit: function () {
          this.oOwnerComponent = this.getOwnerComponent();
          this.oRouter = this.oOwnerComponent.getRouter();
          this.oRouter
            .getRoute("StudentDetail")
            .attachPatternMatched(this._onRouteMatched, this);

  
          var odatamodel = this.getView().getModel("v2model");
          if (!odatamodel) {
            console.error("Model 'v2model' is niet beschikbaar!");
            
          }

        },
  
        fetchMaxAantalInschrijvingen: function () {
          var that = this;
          var studentId = this.getView()
            .getBindingContext()
            .getProperty("StudentId");
          var odatamodel = this.getView().getModel("v2model");
  
          odatamodel.read("/StudentSet(" + studentId + ")", {
            success: function (oData) {
              that.maxAantalInschrijvingen = oData.maxAantalInschrijvingen;
            },
            error: function (error) {
              console.error(
                "Fout bij het ophalen van maximale aantal inschrijvingen:",
                error
              );
              MessageBox.error(
                "Fout bij het ophalen van maximale aantal inschrijvingen."
              );
            },
          });
        },
  
        updateAantalInschrijvingen: function () {
          var that = this;
          var beschikbareSessies = this.getView().byId("personalSS1");
          var sessionID = 1;
          var odatamodel = this.getView().getModel("v2model");
          var filter = new sap.ui.model.Filter(
            "sessieID_sessieID",
            sap.ui.model.FilterOperator.EQ,
            sessionID
          );
  
          odatamodel.read("/Inschrijvingen", {
            filters: [filter],
            success: function (oData) {
              that.iAantalInschrijvingen = oData.results.length;
            },
            error: function (error) {
              console.log("Error fetching inschrijvingen:", error);
              MessageBox.error("Foutje bij het ophalen van inschrijvingen.");
            },
          });
        },
  
        signUp: function (evt) {
          var button = evt.getSource();
          var buttonText = button.getText();
          var sessionID = button.getBindingContext().getProperty("FavoriteId");
  

            this.cancelSignUp(sessionID, button);

        },
  
        cancelSignUp: function (sessionID, button) {
          var odatamodel = this.getView().getModel("v2model");
              odatamodel.remove("/FavoriteSet(" + sessionID + ")", {
                success: function (data, response) {
                  MessageBox.success("Removed from Favorite game!");
                },
                error: function (error) {
                  uitschrijvenError;
                  MessageBox.error("Could not remove favorite game...");
                },
              });
        },
  
        _onRouteMatched: function (oEvent) {
          var oArgs = oEvent.getParameter("arguments");
          var oView = this.getView();
          var urlPath =
            "/" + "StudentSet(" + oArgs.StudentId + ")";
  
          oView.bindElement({ path: urlPath });
          this.checkActiveEvent(oArgs.StudentId);
          //test

          // var oFilter = new Filter(
          //   "FkStudentid",
          //   sap.ui.model.FilterOperator.EQ,
          //   oArgs.StudentId
          // );
          // this.getView()
          //   .byId("sessiestable")
          //   .getBinding("items")
          //   .filter([oFilter]);
  
          // var oTable = this.getView().byId("sessiestable");
          // var oBinding = oTable.getBinding("items");
          // oBinding.sort(new sap.ui.model.Sorter("FkGameid", true, true));
  
        },
  
        handleListItemPress: function (oEvent) {
          var oSelectedItem = oEvent.getSource().getBindingContext();
          var sSessieID = oSelectedItem.getProperty("sessieID");
  
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("SessieDetail", {
            sessieID: sSessieID,
          });
        },
  
        addSessie: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("GamesList");
        },

        onEventPressEdit: function (EvenementID) {
          var oRouter = this.getOwnerComponent().getRouter();
          var sHash = window.location.hash;
  
          var aHashParts = sHash.split("/");
          var sStudentId = aHashParts[aHashParts.length - 1];
  
          // Navigate to "EditEvent" route without full page reload
          oRouter.navTo(
            "EditStudent",
            {
              StudentId: sStudentId,
            },
            /* bReplace */ false
          );
        },
  
        onTerug: function () {
          history.back();
        },
        checkActiveEvent: function (id) {
          var odatamodel = this.getView().getModel("v2model");
  
          var that = this;
          odatamodel.read("/StudentSet(" + id + ")", {
            success: function (oData) {
            },
            error: function (error) {
              console.error(
                "Fout bij het ophalen van actieve status van evenement:",
                error
              );
              MessageBox.error(
                "Fout bij het ophalen van actieve status van evenement."
              );
            },
          });
        },
        myCustomFormatterFunction2: function (beginUur, eindUur) {
          try {
            if (beginUur && eindUur) {
              var aTime = beginUur.split(":");
              var formattedTime = aTime[0] + ":" + aTime[1];
  
              var bTime = eindUur.split(":");
              var formattedTime2 = bTime[0] + ":" + bTime[1];
  
              var formattedDateTime = formattedTime + " - " + formattedTime2;
  
              return formattedDateTime;
            } else {
              return "Invalid time";
            }
          } catch (error) {
            console.error("Error formatting date and time:", error);
            return "Error formatting date and time";
          }
        },
        _getEvenementIDFromURL: function () {
          var oComponent = this.getOwnerComponent();
          var oRouter = oComponent.getRouter();
          var oArgs = oRouter.getHashChanger().getHash().split("/");
          return oArgs[oArgs.length - 1];
        },
        myCustomFormatterFunction: function (beginDatum, beginUur) {
          try {
            var oDate = new Date(beginDatum);
            var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
              pattern: "yyyy-MM-dd",
              UTC: true,
            }).format(oDate);
  
            if (beginUur) {
              var aTime = beginUur.split(":");
              var formattedTime = aTime[0] + ":" + aTime[1];
  
              var formattedDateTime = formattedDate + " " + formattedTime;
  
              return formattedDateTime;
            } else {
              return "Invalid time";
            }
          } catch (error) {
            console.error("Error formatting date and time:", error);
            return "Error formatting date and time";
          }
        },
        seeUsers: function () {
          //MessageBox.information("Onder constructie! hihi");
          var evenementIDtje = this._getEvenementIDFromURL();
          window.location.href = "#/Users/" + evenementIDtje;
        },

        formatDateOfBirth: function (dob) {
          if (dob && dob.length === 8) {
              var day = dob.substring(0, 2);
              var month = dob.substring(2, 4);
              var year = dob.substring(4, 8);
              return year + "-" + month + "-" + day;
          } else {
              return dob; // return as is if the format is unexpected
          }
      },
      });
    }
  );
  