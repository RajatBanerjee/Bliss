$(document).ready(function () {
	InitApp();
});

function InitApp() {
	InitFireBase();
	PrepareOrderDetails();
	SetupHandlers();
}

function PrepareOrderDetails() {
	var index = 1;

	if (ItemType.id && ItemType.id !== "") {
		$.each(ItemData, function (itemType) {
			if (itemType === "extra") {
				$.each(ItemData["extra"], function (extraType) {
					$("#orderDetails").append("<tr><td>" + index + "</td><td>" + ItemData[itemType][extraType].SubItemType + "</td><td>" + ItemData[itemType][extraType].SubItemValue + "</td><td></td><td></td></tr>");
					index++;
				});
			} else {
				$("#orderDetails").append("<tr><td>" + itemType + "</td><td>" + ItemData[itemType].SubItemType + "</td><td>" + ItemData[itemType].SubItemValue + "</td><td></td><td></td></tr>");
			}

			index++;
		});
	}
	$("#itemType").text("Order Details -" + ItemType.ItemTypeText);
}

function SetupHandlers() {
	/**
      * Place order submit
      */
	$("#contactForm").submit(function (e) {
		// alert("Handler for .submit() called.");
		e.preventDefault();
		var UserDetails = {
			Name: $("#name").val(),
			Email: $("#email").val(),
			Phone: $("#phone").val(),
			Address: $("#address").val(),
			Pincode: $("#pincode").val(),
			Pickup: $("#pickup").val(),
			Message: $("#message").val()
		};
		PlaceOrder(UserDetails);
	});

	/**
     * terms and condition checked
     */
	$("#termsCheck").change(function () {
		if (document.getElementById("termsCheck").checked === true) {
			document.getElementById("submitForm").disabled = false;
		} else {
			document.getElementById("submitForm").disabled = true;
		}
	});
}
function PlaceOrder(UserDetails) {
	$.post("/PlaceOrder", { Order: ItemData, UserDetails: UserDetails, PriceDetails: window.PriceDetails })
		.done(function () {
			/**remove the local storage having order details */
			sessionStorage.removeItem("ItemData")
			sessionStorage.removeItem("ItemType")
			ShowConfirmationModal();
		})
		.fail(function (error) {
			alert(error);
		});

}

function ShowConfirmationModal() {

	var x = "<div class=\"modal fade\" data-backdrop=\"static\"  data-keyboard=\"false\"  id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">"
		+ "<div class=\"modal-dialog\" role=\"document\">"
		+ " <div class=\"modal-content\">"
		+ "  <div class=\"modal-header\">"
		+ "   <button type=\"button\" class=\"close\"  onClick=\"redirectToHomePage()\"><span aria-hidden=\"true\">&times;</span></button>"
		+ "</div>"
		+ "<div class=\"modal-body\">"
		+ "<h4 class=\"modal-title\" id=\"exampleModalLabel\">Congratulations! your order is Placed.</h4>"
		+ "</div>"
		+ "<div class=\"modal-footer\">"
		+ "<button type=\"button\" class=\"btn btn-primary\" onClick=\"redirectToHomePage()\">Okay</button>"
		+ "</div>"
		+ "</div>"
		+ "</div>"
		+ "</div>";

	$(x).modal();
}

function Getprice() {
	var subItem = ItemData[1].SubItemValue;
	var ItemId = ItemType.id;
	$.post("/GetPrice/" + ItemId + "/" + subItem, { extra: ItemData["extra"] })
		.done(function (data) {
			window.PriceDetails = data;
			$("#orderDetails tr:nth-child(2) td:nth-child(4)").append("<td class='Orderprice'>" + data.ItemPrice + "</td>");
			$("#orderDetails").append("<tr><td></td><td></td><td></td><td></td><td class='Orderprice'>" + data.TotalPrice + "</td></tr>");

			$.each(data.extra, function () {
				$("#orderDetails tr:contains('" + this.SubItemValue + "')").find("td:nth-child(4)").addClass("Orderprice").text(this.Price);
			});

			if (data.MiscMessage.length > 0) {
				$("#orderDetails").append("<tr><td colspan='5' style='color:#FF7e82'>" + data.MiscMessage + "</td></tr>");
			}
		})
		.fail(function (error) {
			alert(error);
		});
}

/**************************************** Firebase  auth and logout******************************************/


/**
 * initialilize fire base ui and fire base application
 */
function InitFireBase() {
	/**GLOBAL */
	var config = {
		apiKey: "AIzaSyA5It3IM79oIyzFUqiRiRPhHsERgp9I8c0",
		authDomain: "bliss-db.firebaseapp.com",
		databaseURL: "https://bliss-db.firebaseio.com",
		projectId: "bliss-db",
		storageBucket: "bliss-db.appspot.com",
		messagingSenderId: "897007396625"
	};

	firebase.initializeApp(config);

	// Google OAuth Client ID, needed to support One-tap sign-up.
	// Set to null if One-tap sign-up is not supported.
	var CLIENT_ID = 'YOUR_OAUTH_CLIENT_ID';

	// Initialize the FirebaseUI Widget using Firebase.
	window.ui = new firebaseui.auth.AuthUI(firebase.auth());
	// Disable auto-sign in.
	window.ui.disableAutoSignIn();
	// Listen to change in auth state so it displays the correct UI for when
	// the user is signed in or not.
	firebase.auth().onAuthStateChanged(function (user) {
		document.getElementById("loading").style.display = "none";
		document.getElementById("loaded").style.display = "block";
		user ? handleSignedInUser(user) : handleSignedOutUser();
	});
}

/**
 * Once the user has logged in OR if the user is already logged in
 * @param {*} user 
 */
function handleSignedInUser(user) {
	document.getElementById("user-signed-in").style.display = "block";
	document.getElementById("user-signed-out").style.display = "none";
	document.getElementById("name").textContent = user.displayName;
	document.getElementById("email").textContent = user.email;
	document.getElementById("phone").textContent = user.phoneNumber;
	if (user.photoURL) {
		var photoURL = user.photoURL;
		// Append size to the photo URL for Google hosted images to avoid requesting
		// the image with its original resolution (using more bandwidth than needed)
		// when it is going to be presented in smaller size.
		if ((photoURL.indexOf("googleusercontent.com") != -1) ||
			(photoURL.indexOf("ggpht.com") != -1)) {
			photoURL = photoURL + "?sz=" +
				document.getElementById("photo").clientHeight;
		}
		document.getElementById("photo").src = photoURL;
		document.getElementById("photo").style.display = "block";
	} else {
		document.getElementById("photo").style.display = "none";
	}

	if (ItemType.id && ItemType.id !== "") {
		$("#placeOrder").show();
		Getprice();
	}

}


/**
 * Displays the UI for a signed out user.
 */
function handleSignedOutUser() {
	$("#placeOrder").hide();
	document.getElementById("user-signed-in").style.display = "none";
	document.getElementById("user-signed-out").style.display = "block";
	ui.start("#firebaseui-container", getUiConfig());
}

function getUiConfig() {
	return {
		"callbacks": {
			// Called when the user has been successfully signed in.
			"signInSuccessWithAuthResult": function (authResult, redirectUrl) {
				if (authResult.user) {
					handleSignedInUser(authResult.user);
				}
				if (authResult.additionalUserInfo) {
					document.getElementById("is-new-user").textContent =
						authResult.additionalUserInfo.isNewUser ? "New User" : "Existing User";
				}
				// Do not redirect.
				return false;
			}
		},
		// Opens IDP Providers sign-in flow in a popup.
		"signInFlow": "popup",
		"signInOptions": [
			// TODO(developer): Remove the providers you don't need for your app.
			{
				provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// Required to enable this provider in One-Tap Sign-up.
				authMethod: "https://accounts.google.com",
				// Required to enable ID token credentials for this provider.
				clientId: CLIENT_ID
			},
			// {
			//   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			//   scopes :[
			//     'public_profile',
			//     'email',
			//     'user_likes',
			//     'user_friends'
			//   ]
			// }
		],
		// Terms of service url.
		"tosUrl": "https://www.google.com",
		"credentialHelper": CLIENT_ID && CLIENT_ID != "YOUR_OAUTH_CLIENT_ID" ?
			firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
			firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
	};
}

/**
/**
 * Deletes the user's account.
 */
// var deleteAccount = function () {
//     firebase.auth().currentUser.delete().catch(function (error) {
//         if (error.code == 'auth/requires-recent-login') {
//             // The user's credential is too old. She needs to sign in again.
//             firebase.auth().signOut().then(function () {
//                 // The timeout allows the message to be displayed after the UI has
//                 // changed to the signed out state.
//                 setTimeout(function () {
//                     alert('Please sign in again to delete your account.');
//                 }, 1);
//             });
//         }
//     });
// };


/**
 * Initializes the app.
 */
// function initApp() {
//     document.getElementById('sign-out').addEventListener('click', function () {
//         firebase.auth().signOut();
//     });
//     document.getElementById('delete-account').addEventListener(
//         'click', function () {
//             deleteAccount();
//         });
// };

//# sourceURL=PlaceOrder.js
