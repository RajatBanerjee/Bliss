var express = require('express');
var router = express.Router();
var _ = require('underscore.string');

router.get("/product/:ID", function (req, res) {
  res.render(req.params.ID)
});

router.post("/GetPrice/:ItemType/:SubItemType", function (req, res) {
  var ItemType = req.params.ItemType;
  var SubItemType = req.params.SubItemType;
  var extra = req.body.extra;
  var fs = require('fs');
  var obj;
  var ItemPrice = 0.00;
  var AddonPrice = 0.00;
  var TotalPrice = 0.00;
  var MiscMessage = "";

  if (_.include(SubItemType), 'as') {
    MiscMessage = "In case of your own design, Price will be confirmed during Pickup";
  }
  fs.readFile('./Prices.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    } else {
      obj = JSON.parse(data);

      obj.forEach(function (Item) {
        if (Item.Id.toString() === ItemType) {
          Item.Items.forEach(function (subItem) {
            if (subItem.Type === SubItemType) {
              ItemPrice = subItem.Price
            }
          })
        }
      }, this);

      obj.forEach(function (Item) {
        if (Item.Id.toString() === ItemType) {
          Item.Addons.forEach(function (subItem) {
            if (extra !== undefined) {
              extra.forEach(function (extrItem) {
                if (subItem.Type === extrItem.SubItemValue) {
                  extrItem.Price = subItem.Price
                }
              });
            }

          })
        }
      }, this);

      //total calculation
      if (extra !== undefined) {
        if (extra.length > 0) {
          extra.forEach(function (extraItem) {
            TotalPrice = TotalPrice + extraItem.Price;
          })
        }
      }

      TotalPrice = TotalPrice + ItemPrice;

      //override Itemprice
      if (_.include((SubItemType), 'As per Measurement') == true || _.include((SubItemType), 'As per Dress Material') == true) {
        MiscMessage = "In case of your own design, Price will be confirmed during Pickup";
        ItemPrice = "N/A"
      }
      res.status(200).send({ ItemPrice: ItemPrice, extra: extra, TotalPrice: TotalPrice, MiscMessage: MiscMessage })
    }
  });
})

router.get("/views/:view", function (req, res) {
  res.sendfile('./views/partials/' + req.params.view + '.html');

});

router.post("/PlaceOrder", function (req, res) {
  var Order = req.body.Order;
  var UserDetails = req.body.UserDetails;
  var PriceDetails = req.body.PriceDetails;
  var emailClient = require('./sendMail');

  emailClient.sendEmail(Order, UserDetails, PriceDetails, function (err, output) {
    if (err) {
      res.status(500).send("Error placing order: " + err)
    } else {
      res.send("Order Placed")
    }

  });
})

router.get('*', function (req, res) {
  res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;