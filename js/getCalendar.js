var mykey = 'AIzaSyC3ZGkh-1nGRXNYvFZHvNlxbPKeykKzoW8'; // typically like Gtg-rtZdsreUr_fLfhgPfgff
var calendarid = 'qt2okqgshiqhn49oacp9vab7e4@group.calendar.google.com'; // will look somewhat like 3ruy234vodf6hf4sdf5sd84f@group.calendar.google.com
// var calendarid = 'sasamat.org_epgj06f1mfkulifpqm207rvsho@group.calendar.google.com'; // will look somewhat like 3ruy234vodf6hf4sdf5sd84f@group.calendar.google.com


var program = null;
var calendar = null;
var monthAdjuster = 0;
var themeColour = null;
var firstDay;

var images=new Array('img/1.jpg','img/2.JPG', 'img/3.jpg');
var nextimage=0;

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

$(document).ready(function() {
    $( "#btnL1" ).hover(
        function() {
        bgTextColour("blue", true);
        }, function() {
        // bgTextColour("gray", true);
        }
    );

    $( "#btnL2" ).hover(
        function() {
        bgTextColour("lime", true);
        }, function() {
        // bgTextColour("gray", true);
        }
    );

    $( "#btnVol" ).hover(
        function() {
        bgTextColour("pink", true);
        }, function() {
        // bgTextColour("gray", true);
        }
    );

    updateBGText();



    slideshowFadeIn();
});

window.onresize = function(event) {
    updateBGText();
}

function updateBGText() {
    var fontSize = parseInt($(".container").height()/3)+"px";
    var lineSize = parseInt($(".container").height()/4)+"px";
    $(".bgtext").css('font-size', fontSize);
    $(".bgtext").css('line-height', lineSize);
}

function bgTextColour(c, cleanup) {
    if (cleanup) {
        $(".bgtext").removeClass("bg-blue");
        $(".bgtext").removeClass("bg-lime");
        $(".bgtext").removeClass("bg-pink");
        // $(".bgtext").removeClass("bg-gray");
    }
    
    switch(c) {
        case "blue":
            $(".bgtext").addClass("bg-blue");
            break;
        case "lime":
            $(".bgtext").addClass("bg-lime");
            break;
        case "pink":
            $(".bgtext").addClass("bg-pink");
            break;
        case "gray":
            // $(".bgtext").addClass("bg-gray");
            break;
        default: 
            break;
    }
}

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

    // console.log("monthAdjuster: " + monthAdjuster)
    //Get populate info
    var curMonth = new Date().getMonth() + monthAdjuster;
    //console.log(curMonth);

    var curYear = new Date().getFullYear() + Math.floor((curMonth)/12);
    //console.log(curYear);

    curMonth = curMonth % 12;

    //Getting first day of month
    firstDay = new Date(curYear, curMonth, 1).getDay();

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

    //Clear previous events
    var boxID = 0;
    for (var i = 0; i < 42; i++) {
        tempBoxID = "#boxID" + i;
        // $(tempBoxID).find("div.eventname").addClass("well");
        $(tempBoxID).find("div.eventname").remove();
    }

    var monthEvents;

    var events = calendar.items;
    events.forEach(function(event, index, array) {
        if (event.summary.indexOf("[" + program + "]") != -1) {
            eventStart = new Date(Date.parse(event.start.dateTime));
            eventEnd = new Date(Date.parse(event.end.dateTime));

            var startsInPrevMonth = false;
            if (eventEnd.getMonth() == new Date().getMonth() + monthAdjuster && eventStart.getFullYear() == (new Date().getFullYear() + Math.floor((new Date().getMonth() + monthAdjuster)/12))) {
                startsInPrevMonth = true;
            }
            // console.log(event.summary);
            // console.log("event year: " + eventStart.getFullYear());
            // console.log("cur year: " + (new Date().getFullYear() + Math.floor((new Date().getMonth() + monthAdjuster)/12)));
            // console.log(startsInPrevMonth);
            // console.log(eventStart.getMonth());
            // console.log((new Date().getMonth() + monthAdjuster)%12);
            if ((eventStart.getMonth() == (new Date().getMonth() + monthAdjuster) % 12 && eventStart.getFullYear() == (new Date().getFullYear() + Math.floor((new Date().getMonth() + monthAdjuster)/12))) || startsInPrevMonth) {

                // var firstDay = new Date(curYear, curMonth, 1).getDay();
                var tempEventBox = "#boxID" + (eventStart.getDate() - 1 + firstDay);
                if (eventEnd.getDate() == eventStart.getDate()) {
                    $(tempEventBox).append("<div class='eventname " + event.id + "'>" + cleanUpNames(event.summary) + "</div>");
                    var tempID = "." + event.id;
                    setClickEvent(tempID, event);
                        // console.log("single");
                } else {
                    var tempStartString = "<div class='eventname startevent " + event.id + "'>" + cleanUpNames(event.summary) + "</div>";
                    var tempMidString = "<div class='eventname midevent " + event.id + "'>" + "&nbsp;" + "</div>";
                    var tempEndString = "<div class='eventname endevent " + event.id + "'>" + "&nbsp;" + "</div>";
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
                            var tempID = "." + event.id;
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
                                var tempID = "." + event.id;
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
                                var tempID = "." + event.id;
                                setClickEvent(tempID, event);

                            }
                        }
                    }      
                }
                // console.log($("#monthTitle").text());
            } else {
                // console.log("nah");
            }
            updateTheme();
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
    var eventstructure = '<div id="location"></div><div>Begins: <span id="start"></span></div><div class="tight">Ends: <span id="end"></span></div><div>Drop Off: <span id="dropoff"></span></div><div>Pick Up: <span id="pickup"></span></div><div>Details: <span id="details"></span></div><div>Attachments: <span id="attachments"></span></div>';
    $("#eventcontent").html(eventstructure);
    console.log("click");

    $(".calendar").addClass("col-sm-8");
    $(".calendar").removeClass("col-sm-12");
    $(".eventdetails").addClass("fadeInRight");
    $(".eventdetails").removeClass("fadeOutRight");

    $(".eventdetails").removeClass("hidden");



    var tempDesc = evt.description.replace(/(\r\n|\n|\r)/gm, "<br>");

    // createTags(evt.description);
    
    var dropoffTag = "DROPOFF";
    var pickupTag = "PICKUP";
    var detailsTag = "DETAILS";

    var eventName = cleanUpNames(evt.summary);
    var startTime = tConvert(evt.start.dateTime.slice(11, 16));
    var startDate = startTime + " " + new Date(Date.parse(evt.start.dateTime)).toDateString();
    var endTime = tConvert(evt.end.dateTime.slice(11, 16));
    var endDate = endTime + " " + new Date(Date.parse(evt.end.dateTime)).toDateString();
    var dropoff = cleanUpTags(dropoffTag, tempDesc);
    var pickup = cleanUpTags(pickupTag, tempDesc);
    var details = cleanUpTags(detailsTag, tempDesc);
    var attachments = "";

    if (evt.attachments != null) {
        evt.attachments.forEach(function(item, index, array) {
            attachments = attachments.concat("<br><img src='" + item.iconLink + "'/><a target='_blank' href='" + item.fileUrl +"'>" + item.title + "</a>");
        });
    }
    
    //console.log(attachments);

    $("#eventname").html(eventName);
    $("#location").html(evt.location);
    $("#start").html(startDate);
    $("#end").html(endDate);
    if (dropoff != null) {
        $("#dropoff").html(dropoff);
    } else {
        $("#dropoff").parent().html("");
    }
    if (pickup != null) {
        $("#pickup").html(pickup);
    } else {
        $("#pickup").parent().html("");
    }
    if (details != null) {
        $("#details").html(details);
    } else {
        $("#details").parent().html("");
    }
    if (attachments != "") {
        $("#attachments").html(attachments);
    } else {
        $("#attachments").parent().html("");
    }
}

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

function createTags(description) {
    // var test = "My cow always gives milk";
    var tags = new Array();
    var str = description;
    while (str.lastIndexOf("[/") > -1) {
        var newtext = str.slice(str.lastIndexOf("[/") + 2, str.lastIndexOf("]"));
        str = str.replace("[/" + newtext + "]", "REMOVED");
        // var 
        console.log(newtext);
        console.log(str);
        tags.push(newtext);

    }
    console.log(tags);
    console.log("done");
    // var re = /.*[\s+(.*)\s+].*/;
    // var newtext = description.replace(re, "$1");
    // console.log(newtext);
    // var tags = description.match("[/(.*)]");
    // console.log(tags);
    // alert(tags);
    // alert(testRE[1]);
}

function cleanUpTags(tag, desc) {
    var d = desc;
    var t = tag;
    var retVal = null;
    if (d.indexOf(t) > -1) {
        retVal = d.slice(d.indexOf("[" + t + "]") + (t.length + 2), d.indexOf("[/" + t + "]") /*- (t.length + 2)*/);
        retVal = retVal.replace("[link target=", "<a target='_blank' href='");// console.log(retVal);
        retVal = retVal.replace("[/link]", "</a>");
        retVal = retVal.replace("[image]", "<img src='");
        retVal = retVal.replace("[/image]", "'>");
        retVal = retVal.replace("]", "'>");
    }
    return retVal;
}

function cleanUpNames(name) {
    name = name.replace("[L1]", "");
    name = name.replace("[L2]", "");
    name = name.replace("[VOL]", "");
    return name;
}

function closeEvent() {
    $(".eventdetails").addClass("fadeOutRight");
    $(".calendar").removeClass("col-sm-8");
    $(".calendar").addClass("col-sm-12");
}

function processLogin(p) {
    console.log("logged in");
    $(".login-screen").addClass("fadeOutDown");
    // $(".login-screen").addClass("fadeOut");

    $(".navbar").removeClass("hideup");

    $(".contentscreen").removeClass("hidden");
    $(".loginprompt").addClass("hidden");
    $(".calendar").removeClass("fadeOutUp");

    clearNavActives();
    $('#navCalendar').addClass('active');


    

    program = p;

    console.log(program);
    populateCalendar();
    updateNavbar();

    //populateEvents();
}

function processLogout() {
    $(".login-screen").removeClass("fadeOutDown");


    // $(".calendar").removeClass("shared");
    $(".calendar").addClass("fadeOutUp");

    $(".eventdetails").addClass("fadeOutRight");

    $(".calendar").removeClass("col-sm-8");
    $(".calendar").addClass("col-sm-12");
    // $(".eventdetails").removeClass("fadeOutRight");

    $(".navbar").addClass("hideup");
    $('.contactspage').addClass('fadeOutDown');


    $(".contentscreen").addClass("fadeOutUp");
    // $(".loginprompt").removeClass("hidden");
    $('.navbar-collapse').removeClass('in');

    monthAdjuster = 0;
    
}

function updateNavbar() {
    $(".navbar").removeClass("navbar-material-blue");
    $(".navbar").removeClass("navbar-material-lime");
    $(".navbar").removeClass("navbar-material-pink");

    switch(program) {
        case "L1":
            $(".navbar").addClass("navbar-material-blue");
            $("#navtitle").text("Leadership 1");
            break;
        case "L2":
            $(".navbar").addClass("navbar-material-lime");
            $("#navtitle").text("Leadership 2");

            break;
        case "VOL":
            $(".navbar").addClass("navbar-material-pink");
            $("#navtitle").text("Leadership Volunteering");

            break;
        default: 
            break;
    }
}

function updateTheme() {
    $(".eventname").removeClass("theme-blue");
    $(".eventname").removeClass("theme-lime");            
    $(".eventname").removeClass("theme-pink");

    switch(program) {
        case "L1":
            $(".eventname").addClass("theme-blue");
            bgTextColour("blue", false);
            break;
        case "L2":
            $(".eventname").addClass("theme-lime");
            bgTextColour("lime", false);

            break;
        case "VOL":
            $(".eventname").addClass("theme-pink");
            bgTextColour("pink", false);

            break;
        default: 
            break;
    }
}


function slideshowFadeIn()
{
    // console.log($('.slideshow').text());
    // $('.slideshow').html('hahahahah');
    // $('.slideshow').prepend($('<img class="slideshowimage" src="'+images[nextimage++]+'" style="display:none">').slideIn(500,function(){setTimeout(doSlideshow,1000);}));
    //$('.slideshow').css('background-image', 'url('+images[nextimage++]+')').slideIn(500,function(){setTimeout(doSlideshow,1000);});
    
    $('.slideshow').fadeTo('slow', 0, function() {
        $(this).css('background-image', 'url(' + images[nextimage++] + ')');
        }).delay(0).fadeTo(5000, 1, function() {
            setTimeout(slideshowFadeIn,10000)
        });

    if (nextimage>=images.length) {
        nextimage=0;

    }
}

function clickCalendar() {
    clearNavActives();
    $('#navCalendar').addClass('active');
    $('.calendar').removeClass('fadeOutUp');
    // $('.calendar').removeClass('shared');
    // $('.eventdetails').removeClass('fadeOutRight');
    $('.contactspage').addClass('fadeOutDown');
    $('.navbar-collapse').removeClass('in');



}

function clickContacts() {
    clearNavActives();
    $('#navContacts').addClass('active');
    $('.calendar').addClass('fadeOutUp');

    $(".calendar").removeClass("col-sm-8");
    $(".calendar").addClass("col-sm-12");

    // $('.calendar').removeClass('shared');
    $('.eventdetails').addClass('fadeOutRight');
    $('.contactspage').removeClass('fadeOutDown');

    $('.contactspage').removeClass('hidden');
    $('.contactspage').addClass('fadeInUp');

    $('.navbar-collapse').removeClass('in');

}

function clearNavActives() {
    $('#navCalendar').removeClass('active');
    $('#navContacts').removeClass('active');

}
