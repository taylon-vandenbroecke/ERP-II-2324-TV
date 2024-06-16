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

  
        //   var odatamodel = this.getView().getModel("v2model");
        //   if (!odatamodel) {
        //     console.error("Model 'v2model' is niet beschikbaar!");
            
        //   }

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
          var sessionID = button.getBindingContext().getProperty("sessieID");
          var oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
          var controleText = oResourceBundle.getText(
            "eventDetailUitschrijvenSessie"
          );
  
          if (buttonText === controleText) {
            this.cancelSignUp(sessionID, button);
          } else {
            this.registerForSession(sessionID, button);
          }
          this.updateAantalInschrijvingen();
        },
  
        registerForSession: function (sessionID, button) {
          var odatamodel = this.getView().getModel("v2model");
          var alreadysignedup = false;
          var that = this;
          var oResourceBundle = that
            .getView()
            .getModel("i18n")
            .getResourceBundle();
  
          var filter = new sap.ui.model.Filter([
            // new sap.ui.model.Filter(
            //   "gebruikerID_gebruikerID",
            //   sap.ui.model.FilterOperator.EQ,
            //   user.gebruikerID
            // ),
            new sap.ui.model.Filter(
              "sessieID_sessieID",
              sap.ui.model.FilterOperator.EQ,
              sessionID
            ),
          ]);
          var aantalInschrijvingenSessie,
            teVeelInschrijvingen = false;
  
          odatamodel.read("/Sessies(" + sessionID + ")", {
            success: function (oData) {
              aantalInschrijvingenSessie = oData.maxAantalInschrijvingen;
            },
            error: function (error) {
              console.error("Error fetching aantal inschrijvingen:", error);
            },
          });
  
          odatamodel.read("/Inschrijvingen", {
            filters: [filter],
            success: function (oData) {
              console.log(oData.results.length);
              if (aantalInschrijvingenSessie <= oData.results.length) {
                teVeelInschrijvingen = true;
              }
              oData.results.forEach((e) => {
                if (
                  e.gebruikerID_gebruikerID == user.gebruikerID &&
                  e.sessieID_sessieID == sessionID
                ) {
                  alreadysignedup = true;
                }
              });
  
              if(teVeelInschrijvingen === true){
                MessageBox.error(oResourceBundle.getText("teVeelInschrijvingen"));
                return;
              };
  
              if (alreadysignedup === false) {
                var oData = {
                  gebruikerID: {
                    gebruikerID: user.gebruikerID,
                  },
                  sessieID: {
                    sessieID: sessionID,
                  },
                };
                odatamodel.create("/Inschrijvingen", oData, {
                  success: function (data, response) {
                    MessageBox.success(oResourceBundle.getText("ingeschreven"));
                    button.setText(
                      oResourceBundle.getText("eventDetailUitschrijvenSessie")
                    );
                    button.setType("Reject");
                  },
                  error: function (error) {
                    MessageBox.error(oResourceBundle.getText("inschrijvenError"));
                  },
                });
              } else {
                MessageBox.error(oResourceBundle.getText("reedsIngeschreven"));
                button.setText(
                  oResourceBundle.getText("eventDetailUitschrijvenSessie")
                );
                button.setType("Reject");
              }
            },
            error: function (error) {
              MessageBox.error(oResourceBundle.getText("errorInschrijven"));
            },
          });
        },
  
        cancelSignUp: function (sessionID, button) {
          var odatamodel = this.getView().getModel("v2model");
          var that = this;
  
          // Zoek de inschrijving die overeenkomt met de huidige gebruiker en sessie
          var filter = new sap.ui.model.Filter([
            new sap.ui.model.Filter(
              "gebruikerID_gebruikerID",
              sap.ui.model.FilterOperator.EQ,
              user.gebruikerID
            ),
            new sap.ui.model.Filter(
              "sessieID_sessieID",
              sap.ui.model.FilterOperator.EQ,
              sessionID
            ),
          ]);
  
          odatamodel.read("/Inschrijvingen", {
            filters: [filter],
            success: function (oData) {
              var inschrijvingID = 0;
              oData.results.forEach((e) => {
                if (e.gebruikerID_gebruikerID == user.gebruikerID) {
                  inschrijvingID = e.inschrijvingID;
                }
              });
              var oResourceBundle = that
                .getView()
                .getModel("i18n")
                .getResourceBundle();
              odatamodel.remove("/Inschrijvingen(" + inschrijvingID + ")", {
                success: function (data, response) {
                  var sButtonText = oResourceBundle.getText("uitgeschreven");
                  MessageBox.success(sButtonText);
                  button.setText(
                    oResourceBundle.getText("eventDetailRegistreerSessie")
                  );
                  button.setType("Emphasized");
                },
                error: function (error) {
                  uitschrijvenError;
                  MessageBox.error(oResourceBundle.getText("uitschrijvenError"));
                },
              });
            },
            error: function (error) {
              console.log("Error fetching inschrijving:", error);
              MessageBox.error(oResourceBundle.getText("errorInschrijven"));
            },
          });
          this.updateAantalInschrijvingen();
        },
  
        _onRouteMatched: function (oEvent) {
          var oArgs = oEvent.getParameter("arguments");
          var oView = this.getView();
          var urlPath =
            "/" + "StudentsList(StudentId=" + oArgs.StudentId + ")";
  
          oView.bindElement({ path: urlPath });
          this.checkActiveEvent(oArgs.StudentId);
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
          var evenementID = this.getView()
            .getBindingContext()
            .getProperty("evenementID");
          window.location.href = "#/Sessies#/new/" + evenementID;
        },
  
        seeFeedback: function () {
          var oSelectedItem = this.getView().getBindingContext();
          var evenementID = oSelectedItem.getProperty("evenementID");
          var currentDate = new Date();
          var eventDate = new Date(oSelectedItem.getProperty("eindDatum"));
          var eventDateObj = new Date(eventDate);
          if (currentDate >= eventDateObj) {
            var evenementID = this.getView()
              .getBindingContext()
              .getProperty("evenementID");
            window.location.href = "#/Feedback/" + evenementID;
          } else {
            MessageBox.information(
              "Het is nog niet mogelijk om feedback te zien voor dit evenement. Wacht tot het evenement is afgelopen!"
            );
          }
        },
  
        deleteEvent: function () {
          var odatamodel = this.getView().getModel("v2model");
          var evenementID = this.getView()
            .getBindingContext()
            .getProperty("evenementID");
  
          odatamodel.remove("/Evenementen(" + evenementID + ")", {
            success: function (data, response) {
              MessageBox.success("Het evenement is succesvol verwijderd!", {
                onClose: function () {
                  window.location.href = "#/Events";
                },
              });
            },
            error: function (error) {
              MessageBox.error(
                "Het is niet gelukt om het evenement te verwijderen. Probeer het opnieuw!"
              );
            },
          });
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
      });
    }
  );
  