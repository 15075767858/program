Ext.define('program.view.window.DrawWeeksWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-drawweekswindow',

    weekDivAddEvent: function (div) {
        var me = this
        console.log(me)
        console.log(div)
        div.hover(
            function () {
                var tmStart = new Date(div.attr("startTime"))
                var tmEnd = new Date(div.attr("endTime"))
                console.log(div.attr("startTime"))
                console.log(div.attr("endTime"))
                Ext.create('Ext.tip.ToolTip', {
                    target: div.attr("id"),
                    float: true,
                    trackMouse: true,
                    showDelay: 0,
                    hideDelay: 100,
                    dissmissDelay: 30000,
                    html: "StartTime:" + tmStart.toTimeString() + "<br>EndTime:&nbsp;" + tmEnd.toTimeString()
                });
            },
            function () {
            }
        );
        div.contextmenu(function (e) {
            e.stopPropagation()
            Ext.create('Ext.menu.Menu', {
                width: 100,
                plain: true,
                x: e.pageX,
                y: e.pageY,
                autoShow: true,
                floating: true,  // usually you want this set to True (default)
                items: [
                    {
                        text:"Copy Time",
                        handler:function(){
                            me.copydiv=div;

                        }
                    },{
                    text: 'Delete Time',
                    handler: function () {
                        div.remove()
                    }
                }
                ]
            });
            return false;
        })

        Ext.create("Ext.resizer.Resizer", {
            target: div[0],
            handles: 'n,s',
            maxHeight: me.dwPars.bMaxHeight,
            minHeight: 1,
            //constrainTo:th.id,
            pinned: true,
            listeners: {
                resize: function (th, width, height, e, eOpts) {
                    var tmStart = me.getTimeByLocation(parseInt(div.css("Top")) - me.dwPars.bMarginTop);
                    var tmEnd = me.getTimeByLocation(parseInt(div.css("Top")) - me.dwPars.bMarginTop + parseInt(div.css("height")))
                    div.attr("startTime", tmStart).attr("endTime", tmEnd)
                    var top = th.el.getTop(true)
                    if (top < me.dwPars.bMarginTop) {
                        th.el.setTop(me.dwPars.bMarginTop + "px")
                    }
                    var bt = height + top;
                    if (bt > me.dwPars.bMarginTopHeight) {
                        var cha = bt - me.dwPars.bMarginTopHeight;
                        th.el.setTop(top - cha);

                    }
                }
            }
        })
    },
    getDivData: function () {
        var me = this;
        var weekly = {
            "Weekly_Schedule": {}
        }
        var pubweekly = {
            "Weekly_Schedule": []
        }
        me.dwPars.drawWindowData = []
        WeekArr = me.dwPars.WeekArr

        for (var i = 0; i < WeekArr.length; i++) {

            //console.log(this.up("window").el.dom.getElementsByClassName(WeekArr[i]))
            var dayTimeArr = document.querySelectorAll("." + WeekArr[i]);
            var newWeeks = document.querySelectorAll(".new" + WeekArr[i]);
            console.log(newWeeks)
            var oldWeeks = document.querySelectorAll(".old" + WeekArr[i]);
            var isPubWeek = !(oldWeeks.length ==me.dwPars.WeekArrJson[i].oldCount)
                if(newWeeks.length>0){
                    isPubWeek=true;
                }
            console.info(isPubWeek)
            weekly.Weekly_Schedule[WeekArr[i]] = []
            var pubTimeArr = []
            pubweekly.Weekly_Schedule.push({
                day: i + 1,
                value: pubTimeArr
            })
            if (dayTimeArr.length > 0) {
                //pubweekly.Weekly_Schedule[WeekArr[i]] = []
                for (var j = 0; j < dayTimeArr.length; j++) {
                    console.log(dayTimeArr)
                    var starttime = new Date($(dayTimeArr[j]).attr("starttime"));
                    var endtime = new Date($(dayTimeArr[j]).attr("endtime"));
                    var sH = starttime.getHours()
                    var sM = starttime.getMinutes()
                    var sS = starttime.getSeconds()
                    var eH = endtime.getHours()
                    var eM = endtime.getMinutes()
                    var eS = endtime.getSeconds()
                    me.dwPars.drawWindowData.push({
                        divId: dayTimeArr[j].id,
                        SortWeek: (i + 1) + "_" + WeekArr[i],
                        Week: WeekArr[i],
                        StartTime: sH + ":" + sM + ":" + sS,
                        EndTime: eH + ":" + eM + ":" + eS
                    })
                    if (isPubWeek) {
                        pubTimeArr.push(
                            {
                                time: {
                                    "hour": sH,
                                    "minute": sM,
                                    "second": sS,
                                    "hundredths": 0
                                },
                                value: true
                            }, {
                                time: {
                                    "hour": eH,
                                    "minute": eM,
                                    "second": eS,
                                    "hundredths": 0
                                },
                                value: false
                            }
                        )
                    }

                    weekly.Weekly_Schedule[WeekArr[i]].push(
                        {
                            time: {
                                "hour": sH,
                                "minute": sM,
                                "second": sS,
                                "hundredths": 0
                            },
                            value: true
                        }, {
                            time: {
                                "hour": eH,
                                "minute": eM,
                                "second": eS,
                                "hundredths": 0
                            },
                            value: false
                        }
                    )
                }

            }

            if (pubTimeArr.length == 0) {
                pubweekly.Weekly_Schedule.pop()
            }
        }

        console.log(pubweekly)
        console.log(Ext.encode(pubweekly))
        console.log(Ext.encode(weekly))
        return {weekly: weekly, pubweekly: pubweekly};

    },
    weekDivResetPosition: function (banimate) {
        var me = this;
        var WeekArrJson = me.dwPars.WeekArrJson
        var oCanvas = me.dwPars.oCanvas
        var oneDay = me.dwPars.oneDay;
        var bMarginTop = me.dwPars.bMarginTop;
        WeekArr = me.dwPars.WeekArr;
        for (var i = 0; i < WeekArr.length; i++) {
            var dayTimeArr = document.querySelectorAll("." + WeekArr[i]);
            if (dayTimeArr.length > 0) {
                for (var j = 0; j < dayTimeArr.length; j++) {
                    var starttime = new Date($(dayTimeArr[j]).attr("starttime"));
                    var divStartPageY = parseInt(oCanvas.css("height")) * ((starttime - 2649600000) / oneDay);
                    //$(dayTimeArr[j]).css("top", divStartPageY + bMarginTop)
                    var endtime = new Date($(dayTimeArr[j]).attr("endtime"));
                    var divEndPageY = parseInt(oCanvas.css("height")) * ((endtime - 2649600000) / oneDay);
                    //$(dayTimeArr[j]).css("height", divEndPageY - divStartPageY + "px");
                    $(dayTimeArr[j]).animate({
                        top: divStartPageY + bMarginTop,
                        height: divEndPageY - divStartPageY
                    }, 1000)
                }
            }
        }
        var aWeeks = $(".week");
        for (var i = 0; i < aWeeks.length; i++) {
            for (var j = 0; j < WeekArrJson.length; j++) {
                if ($(aWeeks[i]).hasClass(WeekArrJson[j].name)) {
                    if (banimate) {
                        $(aWeeks[i]).css("left", me.dwPars.dw.el.getWidth() / 2.5);
                        function randomlingdao() {
                            for (var i = 0; i < 10; i++) {
                                var a = (Math.random() * 2.5);
                                if (a > 2 & a < 2.5) {
                                    return a
                                }
                            }
                            return 2;
                        }

                        $(aWeeks[i]).animate({
                            left: WeekArrJson[j].left
                        }, 1000)
                    }
                    else {
                        $(aWeeks[i]).css("left", WeekArrJson[j].left);
                    }


                }
            }
        }

    },
    drawWindowAddDiv: function (d) {
        console.log(d)
        var me = this;
        WeekArr = me.dwPars.WeekArr
        var dw = me.dwPars.dw;
        for (var i = 0; i < WeekArr.length; i++) {
            var dweek = d['Weekly_Schedule'][WeekArr[i]];
            if (dweek) {

                var times = d['Weekly_Schedule'][WeekArr[i]];
                for (var j = 0; j < times.length; j += 2) {
                    var div = me.dwPars.div()
                    div.addClass(WeekArr[i])
                    div.addClass("old" + WeekArr[i]);
                    me.dwPars.WeekArrJson[i].oldCount=dweek.length/2
                    var starttime = new Date(1970, 1, 1, times[j].time.hour, times[j].time.minute, times[j].time.second)
                    var endtime = new Date(1970, 1, 1, times[j + 1].time.hour, times[j + 1].time.minute, times[j + 1].time.second)

                    div.attr("starttime", starttime)
                    div.attr("endtime", endtime)
                    div.addClass(WeekArr[i])
                    $(dw.el.dom).append(div)
                    me.controller.weekDivAddEvent.call(me, div)
                }
            }
        }
        me.controller.weekDivResetPosition.call(me, true)

        console.log(d)
    },
    dwParsInit: function () {
        var me = this;
        me.dwPars = (function () {
            var drawWindowData = []
            var WeekArr = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            var WeekArrJson = [
                {name: "monday", left: "",oldCount:0},
                {name: "tuesday", left: "",oldCount:0},
                {name: "wednesday", left: "",oldCount:0},
                {name: "thursday", left: "",oldCount:0},
                {name: "friday", left: "",oldCount:0},
                {name: "saturday", left: "",oldCount:0},
                {name: "sunday", left: "",oldCount:0}];
            var dw = me;
            var oCanvas = $(dw.el.dom.querySelectorAll("canvas")[4]);
            var oneDay = 86400000;
            var bWidth = 100;
            var winOffsetLeft = dw.el.getLeft(true);
            var winOffsetTop = dw.el.getTop(true);
            var bMarginLeft = oCanvas.offset().left - winOffsetLeft;
            var bMaxWidth = oCanvas.attr("width");
            var interval = (bMaxWidth - bWidth * WeekArr.length) / 7;
            var bMarginTop = oCanvas.offset().top - winOffsetTop - 6;
            var startPoint = bMarginLeft + interval / 2 - 6;
            var posLeftArr = [];
            posLeftArr.push(startPoint)
            WeekArrJson[0]['left'] = startPoint;
            for (var i = 0; i < 7; i++) {
                var weekleft = Math.ceil(startPoint += bWidth + interval);
                posLeftArr.push(weekleft)
                if (i < 6) {
                    WeekArrJson[i + 1]['left'] = weekleft;
                }
            }
            var bMaxHeight = oCanvas.attr("height");
            var bMarginTopHeight = parseInt(bMarginTop) + parseInt(bMaxHeight);

            function newDiv() {
                var div = $("<div></div>")
                div.css("width", "100px")
                    .css("height", "20px")
                    .css("backgroundColor", "rgba(91,164,60,1)")
                    .css("zIndex", "9")
                    .css("position", "absolute")
                    .addClass("week")
                    .attr("id", "bar" + Math.floor(Math.random() * 100000000000000))
                return div;
            }

            //.css("top", bMarginTop + "px");
            //.css("top", win.pageY - winOffsetTop + "px");
            var e = {
                WeekArrJson: WeekArrJson,
                dw: dw,
                oCanvas: oCanvas,
                oneDay: oneDay,
                bWidth: bWidth,
                winOffsetLeft: winOffsetLeft,
                winOffsetTop: winOffsetTop,
                bMarginLeft: bMarginLeft,
                bMaxWidth: bMaxWidth,
                interval: interval,
                bMarginTop: bMarginTop,
                startPoint: startPoint,
                posLeftArr: posLeftArr,
                bMaxHeight: bMaxHeight,
                bMarginTopHeight: bMarginTopHeight,
                div: newDiv,
                WeekArr: WeekArr,
                drawWindowData: drawWindowData
            }
            return e;
        })()

    }

});
