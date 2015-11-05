var mykey = 'AIzaSyC3ZGkh-1nGRXNYvFZHvNlxbPKeykKzoW8'; // typically like Gtg-rtZdsreUr_fLfhgPfgff
var calendarid = 'qt2okqgshiqhn49oacp9vab7e4@group.calendar.google.com'; // will look somewhat like 3ruy234vodf6hf4sdf5sd84f@group.calendar.google.com

var calendar = null;
var monthAdjuster = 0;

// var googleDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})([+-]\d{2}):(\d{2})$/;

$.ajax({
    method: 'GET',
    url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + calendarid+ '/events?key=' + mykey),
    dataType: 'json',
    success: function (response) {
        // console.log(JSON.parse(response));
        // alert(response);
        // var returnedData = JSON.parse(response);
        //console.log(response);
        calendar = response;
        //console.log(calendar.items[0].summary);
        // console.log(new Date(calendar.items[0].start.date));
        // console.log(calendar.items[0].start.date);
        populateEvents();
    },
    error: function (response) {
        //tell that an error has occurred
    }
});

function getCalendar() {
	return calendar;
}


//////////////////////////////////////////////////////////////////////////////
// LOAD UP THE CALENDAR!													//
//////////////////////////////////////////////////////////////////////////////
function createCalendar() {
    //Set up an empty Calendar
    var boxID = 0;
    for (var i = 0; i < 6; i++) {
        document.write("<div class='week'>");
        for (var j = 0; j < 7; j++) {
            document.write("<div class='day' id='boxID" + boxID +"'></div>");
            boxID++;
        }
        document.write("</div>");
    }
}
            
function populateCalendar() {
    //Put basic month info on calendar

    console.log("monthAdjuster: " + monthAdjuster)
    //Get populate info
    var curMonth = new Date().getMonth() + monthAdjuster;
    //console.log(curMonth);

    var curYear = new Date().getFullYear() + Math.floor((curMonth)/12);
    //console.log(curYear);

    curMonth = curMonth % 12;

    //Getting first day of month
    var firstDay = new Date(curYear, curMonth, 1).getDay();

    //Write month on calendar
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $("#monthTitle").html("<div class='monthchanger left btn btn-default btn-sm' onclick='changeMonths(-1)'><i class='mdi-hardware-keyboard-arrow-left'></i></div>" + monthNames[curMonth] + " " + curYear + "<div class='monthchanger right btn btn-default btn-sm' onclick='changeMonths(1)'><i class='mdi-hardware-keyboard-arrow-right'></i></div>");


    //Clear previous calendar
    for (var i = 0; i < 42; i++) {
        var tempBox = "#boxID" + i;
        $(tempBox).removeClass("monthboxes");
        $(tempBox).removeClass("currentdaybox");
        $(tempBox).removeClass("eventday");
        $(tempBox).html("");


    }

    //Write dates on calendar
    for (var i = 0; i < daysInMonth(new Date().getFullYear(), new Date().getMonth()); i++) {
        var tempBoxID = "#boxID" + (i + firstDay);
        $(tempBoxID).addClass("monthboxes");
        $(tempBoxID).html("<div class='datenumber'>" + (i+1) + "</div>");


        //Show current day
        if ((curMonth == new Date().getMonth()) && (curYear == new Date().getFullYear()) && i+1 == new Date().getDate()) {
            $(tempBoxID).addClass("currentdaybox");
        }
    }
    if (calendar != null) {
        populateEvents();
    }
}

function daysInMonth(year, month) {
    return new Date(year, (month + 1), 0).getDate();
}

function changeMonths(adjuster) {
    monthAdjuster += adjuster;
    populateCalendar();
}

function populateEvents() {
    console.log(calendar.items);
    // calendar.items

    var monthEvents;

    var events = calendar.items;
    events.forEach(function(event, index, array) {
    eventStart = new Date(Date.parse(event.start.dateTime));
    eventEnd = new Date(Date.parse(event.end.dateTime));

    var startsInPrevMonth = false;
    if (eventEnd.getMonth() == new Date().getMonth() + monthAdjuster) {
        startsInPrevMonth = true;
    }

        if (eventStart.getMonth() == new Date().getMonth() + monthAdjuster || startsInPrevMonth) {
            // console.log("hola");
            // console.log(eventStart.getDate());

            var tempEventBox = "#boxID" + (eventStart.getDate() - 1);
            if (eventEnd.getDate() == eventStart.getDate()) {
                $(tempEventBox).append("<div class='eventname' id='" + event.id + "'>" + event.summary + "</div>");
                var tempID = "#" + event.id;
                setClickEvent(tempID, event);
                    // console.log("single");
            } else {
                var tempStartString = "<div class='eventname startevent' id='" + event.id + "'>" + event.summary + "</div>";
                var tempMidString = "<div class='eventname midevent' id='" + event.id + "'>" + "&nbsp;" + "</div>";
                var tempEndString = "<div class='eventname endevent' id='" + event.id + "'>" + "&nbsp;" + "</div>";
                if (eventStart.getMonth() == eventEnd.getMonth()) {
                    for (var i = 0; i <= eventEnd.getDate() - eventStart.getDate(); i++) {
                        var tempEventBox = "#boxID" + (eventStart.getDate() - 1 + i);
                        if (i == 0) {
                            $(tempEventBox).append(tempStartString);
                        } else if (i == eventEnd.getDate() - eventStart.getDate()) {
                            $(tempEventBox).append(tempEndString);
                        }else {
                            $(tempEventBox).append(tempMidString);
                        }
                        var tempID = "#" + event.id;
                        setClickEvent(tempID, event);

                    }
                } else {
                    for (var i = 0; i <= (eventEnd.getDate() + daysInMonth(eventStart.getFullYear(), eventStart.getMonth())) - eventStart.getDate(); i++) {
                        if (startsInPrevMonth) {
                            var tempEventBox = "#boxID" + (eventStart.getDate() + 1 + i - daysInMonth(eventStart.getFullYear(), eventStart.getMonth()));
                            if (i == 0) {
                                $(tempEventBox).append(tempStartString);
                            } else if (i == eventEnd.getDate() + daysInMonth(eventStart.getFullYear(), eventStart.getMonth()) - eventStart.getDate()) {
                                $(tempEventBox).append(tempEndString);
                            }else {
                                $(tempEventBox).append(tempMidString);
                            }
                            var tempID = "#" + event.id;
                            setClickEvent(tempID, event);

                        } else {
                            var tempEventBox = "#boxID" + (eventStart.getDate() - 1 + i);
                            if (i == 0) {
                                $(tempEventBox).append(tempStartString);
                            } else if (i == eventEnd.getDate() - eventStart.getDate()) {
                                $(tempEventBox).append(tempEndString);
                            }else {
                                $(tempEventBox).append(tempMidString);
                            }
                            var tempID = "#" + event.id;
                            setClickEvent(tempID, event);

                        }
                    }
                }
                
            }
            // $(tempEventBox).click(function() {
            //     setEvent(event);
            // });
            console.log($("#monthTitle").text());
            // $(tempEventBox).addClass("eventday");
            
            // $(tempEventBox).click(console.log(event));
        } else {
            // console.log("nah");
        }
    });
}

function setClickEvent(evtBox, evt) {
    console.log(evtBox);
    $(evtBox).click(function() {
        setEvent(evt);
    });
}

function setEvent(evt) {
    console.log("click");
    var tempDesc = evt.description.replace(/(\r\n|\n|\r)/gm, "<br>");
    
    var dropoffTag = "DROPOFF";
    var pickupTag = "PICKUP";
    var detailsTag = "DESCRIPTION";


    var startDate = new Date(Date.parse(evt.start.dateTime)).toDateString();
    var endDate = new Date(Date.parse(evt.end.dateTime)).toDateString();
    var dropoff = cleanUpTags(dropoffTag, tempDesc);
    var pickup = cleanUpTags(pickupTag, tempDesc);
    var details = cleanUpTags(detailsTag, tempDesc);
    var attachments = "";

    if (evt.attachments != null) {
        evt.attachments.forEach(function(item, index, array) {
            attachments = attachments.concat("<br><img src='" + item.iconLink + "'/><a target='_blank' href='" + item.fileUrl +"'>" + item.title + "</a>");
        
        });
    }
    
    console.log(attachments);

    $("#eventname").html(evt.summary);
    $("#location").html(evt.location);
    $("#start").html(startDate);
    $("#end").html(endDate);
    $("#dropoff").html(dropoff);
    $("#pickup").html(pickup);
    $("#details").html(details);
    $("#attachments").html(attachments);

}

function cleanUpTags(tag, desc) {
    var d = desc;
    var t = tag;
    var retVal = d.slice(d.indexOf("[" + t + "]") + (t.length + 2), d.indexOf("[/" + t + "]") /*- (t.length + 2)*/);
    retVal = retVal.replace("[link target=", "<a target='_blank' href='");// console.log(retVal);
    retVal = retVal.replace("[/link]", "</a>");
    retVal = retVal.replace("[image]", "<img src='");
    retVal = retVal.replace("[/image]", "'>");
    retVal = retVal.replace("]", "'>");

    // // console.log(desc.substr(desc.indexOf("[" + tag + "]") + (tag.length + 2), desc.indexOf("[/" + tag + "]") - (tag.length + 2)));
    // console.log("Start: " + desc.indexOf("[" + tag + "]") + (tag.length + 2));
    // console.log("End: " + desc.indexOf("[/" + tag + "]") - (tag.length + 2));
    return retVal;
}
