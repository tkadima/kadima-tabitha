module.exports = function (app) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    var multer = require('multer');
    var fs = require('fs');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    
    app.post ("/api/upload", upload.single('myFile'), uploadImage);


    var widgets =
        [
            {_id: "123", name: "Gizmodo", widgetType: "HEADER", pageId: "321", size: 2, text: "GIZMODO"},
            {_id: "234", widgetType: "HEADER", pageId: "321", size: 4, text: "Watermelon"},
            {
                _id: "345", name: "Bananas", widgetType: "IMAGE", pageId: "321", width: "50%",
                url: "http://lorempixel.com/400/200/"
            },
            {_id: "456", name: "ABCDEFGH", widgetType: "HTML", pageId: "321", text: "<p>ABCDEFGH</p>"},
            {_id: "567", widgetType: "HEADER", pageId: "321", size: 4, text: "Bananas"},
            {
                _id: "678", name: "Youtube", widgetType: "YOUTUBE", pageId: "321", width: "40%",
                url: "https://www.youtube.com/embed/AM2Ivdi9c4E"
            },
            {_id: "789", name: "html lorem", widgetType: "HTML", pageId: "321", text: "<p>Moon Taxi</p>"}
        ];

    function createWidget(req, res) {
        var newWidget = req.body;
        newWidget._id = widgets.size + 1;
        widgets.push(newWidget);
        res.json(newWidget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params['pageId'];
        var wdgts = []; 
        for (var w in widgets) {
            if (pageId === widgets[w].pageId) {
                wdgts.push(widgets[w]);
            }
        }
        res.json(wdgts); 
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];
        for (var w in widgets) {
            var widget = widgets[w];
            if (widget._id === widgetId) {
                res.send(widget);
                return;
            }
        }
        res.sendStatus(404).send({});
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                if (widgets[w].widgetType == "HEADER" || widgets[w].widgetType == "HTML") {
                    widgets[w].size = widget.size;
                    widgets[w].text = widget.text;

                } else if (widgets[w].widgetType == "IMAGE" || widgets[w].widgetType == "YOUTUBE") {
                    widgets[w].url = widget.url;
                    widgets[w].width = widget.width;

                }
                res.json(widgets[w]);
                return;
            }

        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['widgetId'];
        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function uploadImage(req, res) {

        var widget        = req.body;
        var myFile        = req.file;
        var url = req.protocol + '://' +req.get('host')+"/uploads/"+myFile.filename;
        if(widget.widgetId === "IMAGE")
        {
            widget.url = url;
            var id = parseInt(widgets[widgets.length-1]._id);
            id++;
            widget._id = id.toString();
            widget.widgetType = "IMAGE";
            widgets.push(widget);
        }
        else
        {
            for (var w in widgets)
            {
                if(widgets[w]._id === widget.widgetId)
                {
                    widgets[w].url = url;
                    widgets[w].width = widget.width;
                }
            }
            widget._id = widget.widgetId;
        }
        res.redirect("/user/" + req.body.userId + "/website/" + req.body.websiteId + "/page/"
            + req.body.pageId + "/widget/" + widget._id);
    }


};