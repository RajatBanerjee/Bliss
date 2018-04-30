jQuery(function ($) {

	$("#user-signed-in").hide()
	window.ItemData = window.sessionStorage.ItemData? JSON.parse(window.sessionStorage.ItemData) : { extra: [] };
	window.ItemType = window.sessionStorage.ItemType ? JSON.parse(window.sessionStorage.ItemType) :{ id: "", ItemTypeText: "" };

	var stage = { next: "", prev: "" };

	/**route handlers */

	var blouse1 = function () {
		var url = "/views/BlouseFront";
		loadPartial(url);
	};
	var blouse2 = function () {
		var url = "/views/BlouseBack";
		loadPartial(url);
	};
	var blouse3 = function () {
		var url = "/views/BlouseSleeve";
		loadPartial(url);
	};
	var blouse4 = function () {
		ItemData["extra"]=[];
		var url = "/views/BlouseAddons";
		loadPartial(url);
	};
	var kurta1 = function () {
		var url = "/views/KurtaFront";
		loadPartial(url);
	};
	var kurta2 = function () {
		var url = "/views/KurtaBack";
		loadPartial(url);
	};
	var kurta3 = function () {
		var url = "/views/KurtaSleeve";
		loadPartial(url);
	};
	var kurta4 = function () {
		var url = "/views/KurtaHemline";
		loadPartial(url);
	};
	var kurta5 = function () {
		ItemData["extra"]=[];
		var url = "/views/KurtaAddons";
		loadPartial(url);
	};
	var BottomAddons = function () {
		ItemData["extra"]=[];
		var url = "/views/BottomAddons";
		loadPartial(url);
	};
	var BottomStyle = function () {
		var url = "/views/BottomStyle";
		loadPartial(url);
	};
	var salwar6 = function () {
		ItemData["extra"]=[];
		var url = "/views/SalwarSuitAddons";
		loadPartial(url);
	};
	var salwar5 = function () {
		var url = "/views/SalwarSuitStyle";
		loadPartial(url);
	};
	var salwar4 = function () {
		var url = "/views/SalwarSuitHemline";
		loadPartial(url);
	};
	var salwar3 = function () {
		var url = "/views/SalwarSuitSleeve";
		loadPartial(url);
	};
	var salwar2 = function () {
		var url = "/views/SalwarSuitBack";
		loadPartial(url);
	};
	var salwar1 = function () {
		var url = "/views/SalwarSuitFront";
		loadPartial(url);
	};
	var placeOrder = function () {
		var url = "/views/placeOrder";
		loadPartial(url);
	};

	var loadPartial = function (url) {
		$.get(url)
			.done(function (response) {
				$(".alert").hide();
				$("#customize").html(response);
				// console.log('$(".customisation-back")',$(".customisation-back"))
				// console.log('$(".customisation-next")',$(".customisation-next"))
				$(".customisation-back").attr("href", stage.prev);
				$(".customisation-next").attr("href", stage.next);

				Progress(stage.current, stage.previous, stage.nxt);
				$("#customize .product_p a").click(function (e) {
					e.preventDefault();
					var compType;
					var compTyepId;
					var type;
					//implementation for addons
					if ($(this).parent().hasClass("comp-data-extra")) {

						//implemenattion for item already selected
						if ($(this).hasClass("added")) {
							type = $(this).parent().find(".row h4:first").text();
							$(this).parent().find(".clickimg").hide();
							$(this).find("img").removeClass("pinkBorder");

							$.each(ItemData["extra"],function(){
								if(this.SubItemValue=== type){
									var index = ItemData["extra"].indexOf(this);
									if (index > -1) {
										ItemData["extra"].splice(index, 1);

									}
								}
							});
						}
						//implementation for selecting item first time
						else {


							$(this).parent().find(".clickimg").show();
							$(this).addClass("added");
							$(this).find("img").addClass("pinkBorder");
							/**find the type of info */
							compType = $(this).parents().find(".comp-stage-data").data("comp-type");
							compTyepId = $(this).parents().find(".comp-stage-data").data("subitemid").toString();
							/** find the item type */
							type = $(this).parent().find(".row h4:first").text();
                            
							ItemData["extra"].push({ SubItemType: compType, SubItemValue: type });
						}

					}
					//implementation for items other than addon or extra
					else {
						/**hide all selections */
						$(".clickimg").hide();
						$(".click_img").removeClass("pinkBorder");
						/**select the item */
						$(this).parent().find(".clickimg").show();
						$(this).find("img").addClass("pinkBorder");

						/**find the type of info */
						compType = $(this).parents().find(".comp-stage-data").data("comp-type");
						compTyepId = $(this).parents().find(".comp-stage-data").data("subitemid").toString();
						/** find the item type */
						type = $(this).parent().find(".row h4:first").text();
						// console.log("compType",compType)
						// console.log("type",type)
						ItemData[compTyepId] = ({ SubItemType: compType, SubItemValue: type });
						ItemType.ItemTypeText = $("#itemContainer").data("itemtype");
						ItemType.id = $("#itemContainer").data("itemtypeid");
					}

					console.info("Current Product info= >", ItemData);
					window.sessionStorage.ItemData = JSON.stringify(ItemData);
					window.sessionStorage.ItemType = JSON.stringify(ItemType);
				});
			});
	}

	var Progress = function (current, previous, next) {
		$(".bs-wizard-stepnum").each(function () {
			$(this).parent().removeClass("active");
			if ($(this).text() === current) {
				$(this).parent().removeClass("disabled");
				$(this).parent().addClass("active");
			}
			else if ($(this).text() === previous) {
				$(this).parent().addClass("complete");
			}
			else if ($(this).text() === next) {
				$(this).parent().removeClass("complete");
				$(this).parent().addClass("disabled");
			}

		});

	};

	var routes = {

		"/BlouseFront": [blouse1, function () {
			stage.current = "FRONT";
			stage.previous = "/";
			stage.nxt = "BACK";
			stage.next = "#/BlouseBack";
			stage.prev = "/";

		}],
		"/BlouseBack": [blouse2, function () {
			stage.current = "BACK";
			stage.previous = "FRONT";
			stage.nxt = "SLEEVE";
			stage.next = "#/BlouseSleeve";
			stage.prev = "#/BlouseFront";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/BlouseSleeve": [blouse3, function () {
			stage.current = "SLEEVE";
			stage.previous = "BACK";
			stage.nxt = "ADD-ONS";
			stage.next = "#/BlouseADDONS";
			stage.prev = "#/BlouseBack";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/BlouseADDONS": [blouse4, function () {
			stage.current = "ADD-ONS";
			stage.previous = "SLEEVE";
			stage.nxt = "PLACEORDER";
			stage.next = "#/placeOrder";
			stage.prev = "#/BlouseSleeve";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/KurtaFront": [kurta1, function () {
			stage.current = "FRONT";
			stage.previous = "/";
			stage.nxt = "BACK";
			stage.next = "#/KurtaBack";
			stage.prev = "/";

		}],
		"/KurtaBack": [kurta2, function () {
			stage.current = "BACK";
			stage.previous = "FRONT";
			stage.nxt = "SLEEVE";
			stage.next = "#/KurtaSleeve";
			stage.prev = "#/KurtaFront";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/KurtaSleeve": [kurta3, function () {
			stage.current = "SLEEVE";
			stage.previous = "BACK";
			stage.nxt = "ADD-ONS";
			stage.next = "#/KurtaHemline";
			stage.prev = "#/KurtaBack";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/KurtaHemline": [kurta4, function () {
			stage.current = "HEMLINE";
			stage.previous = "SLEEVE";
			stage.nxt = "ADD-ONS";
			stage.next = "#/KurtaADDONS";
			stage.prev = "#/KurtaBack";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/KurtaADDONS": [kurta5, function () {
			stage.current = "ADD-ONS";
			stage.previous = "SLEEVE";
			stage.nxt = "PLACEORDER";
			stage.next = "#/placeOrder";
			stage.prev = "#/KurtaSleeve";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/BottomAddons": [BottomAddons, function () {
			stage.current = "ADD-ONS";
			stage.previous = "STYLE";
			stage.nxt = "PLACEORDER";
			stage.next = "#/placeOrder";
			stage.prev = "#/BottomStyle";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/BottomStyle": [BottomStyle, function () {
			stage.current = "STYLE";
			stage.previous = "/";
			stage.nxt = "ADD-ONS";
			stage.next = "#/BottomAddons";
			stage.prev = "/";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitAddons": [salwar6, function () {
			stage.current = "EXTRA";
			stage.previous = "STYLE";
			stage.nxt = "PLACEORDER";
			stage.next = "#/placeOrder";
			stage.prev = "#/SalwarSuitStyle";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitStyle": [salwar5, function () {
			stage.current = "STYLE";
			stage.previous = "HEMLINE";
			stage.nxt = "ADD-ONS";
			stage.next = "#/SalwarSuitAddons";
			stage.prev = "#/SalwarSuitHemline";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitHemline": [salwar4, function () {
			stage.current = "HEMLINE";
			stage.previous = "BACK";
			stage.nxt = "STYLE";
			stage.next = "#/SalwarSuitStyle";
			stage.prev = "#/SalwarSuitSleeve";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitSleeve": [salwar3, function () {
			stage.current = "SLEEVE";
			stage.previous = "BACK";
			stage.nxt = "HEMLINE";
			stage.next = "#/SalwarSuitHemline";
			stage.prev = "#/SalwarSuitBack";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitBack": [salwar2, function () {
			stage.current = "BACK";
			stage.previous = "FRONT";
			stage.nxt = "SLEEVE";
			stage.next = "#/SalwarSuitSleeve";
			stage.prev = "#/SalwarSuitFront";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/SalwarSuitFront": [salwar1, function () {
			stage.current = "FRONT";
			stage.previous = "/";
			stage.nxt = "BACK";
			stage.next = "#/SalwarSuitBack";
			stage.prev = "/";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}],
		"/placeOrder": [placeOrder, function () {
			stage.current = "PLACEORDER";
			stage.previous = "ADD-ONS";
			stage.next = "#/placeOrder";
			stage.prev = "#/sleeve";
			$(".customisation-back").attr("href", stage.prev);
			$(".customisation-next").attr("href", stage.next);
		}]
	};

	var router = Router(routes);

	router.init();

	$(".customisation-next").click(function (e) {
       
		e.preventDefault();

		if ($(".pinkBorder").length > 0 || $(".comp-stage-data").data("comp-type").indexOf("add") > -1
            || $(".comp-stage-data").data("comp-type").indexOf("EXTRA") > -1
            || $(".comp-stage-data").data("comp-type").indexOf("ADD") > -1) {
			location.href = $(this).attr("href");
		} else {
			$(".alert").show();
		}
	});


	$(".customisation-back").click(function (e) {
		e.preventDefault();
		if ($("#placeOrder").length > 0 && $("#placeOrder").data("comp-type").indexOf("PlaceOrder") > -1) {
			history.go(-1);
		} else {
			location.href = $(this).attr("href");
		}

	});
});
