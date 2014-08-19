/*
Copyright 2014, KISSY v1.42
MIT Licensed
build time: Jan 6 12:35
*/
KISSY.add("date/picker-xtpl",[],function(){return function(e){var b,d=this;b=this.config.utils;var l=b.runBlockCommand,f=b.renderOutput,j=b.getProperty,i=b.runInlineCommand,h=b.getPropertyOrRunCommand;b='<div class="';var a={},c=[];c.push("header");a.params=c;a=i(d,e,a,"getBaseCssClasses",1);b+=f(a,!0);b+='">\n    <a id="ks-date-picker-previous-year-btn-';a=h(d,e,{},"id",0,2);b+=f(a,!0);b+='"\n       class="';a={};c=[];c.push("prev-year-btn");a.params=c;a=i(d,e,a,"getBaseCssClasses",3);b+=f(a,!0);
b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=h(d,e,{},"previousYearLabel",0,7);b+=f(a,!0);b+='"\n       hidefocus="on">\n    </a>\n    <a id="ks-date-picker-previous-month-btn-';a=h(d,e,{},"id",0,10);b+=f(a,!0);b+='"\n       class="';a={};c=[];c.push("prev-month-btn");a.params=c;a=i(d,e,a,"getBaseCssClasses",11);b+=f(a,!0);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=h(d,e,{},"previousMonthLabel",0,15);b+=f(a,!0);b+=
'"\n       hidefocus="on">\n    </a>\n    <a class="';a={};c=[];c.push("month-select");a.params=c;a=i(d,e,a,"getBaseCssClasses",18);b+=f(a,!0);b+='"\n       role="button"\n       href="#"\n       tabindex="-1"\n       hidefocus="on"\n       title="';a=h(d,e,{},"monthSelectLabel",0,23);b+=f(a,!0);b+='"\n       id="ks-date-picker-month-select-';a=h(d,e,{},"id",0,24);b+=f(a,!0);b+='">\n        <span id="ks-date-picker-month-select-content-';a=h(d,e,{},"id",0,25);b+=f(a,!0);b+='">';a=h(d,e,{},"monthYearLabel",
0,25);b+=f(a,!0);b+='</span>\n        <span class="';a={};c=[];c.push("month-select-arrow");a.params=c;a=i(d,e,a,"getBaseCssClasses",26);b+=f(a,!0);b+='">x</span>\n    </a>\n    <a id="ks-date-picker-next-month-btn-';a=h(d,e,{},"id",0,28);b+=f(a,!0);b+='"\n       class="';a={};c=[];c.push("next-month-btn");a.params=c;a=i(d,e,a,"getBaseCssClasses",29);b+=f(a,!0);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=h(d,e,{},"nextMonthLabel",0,33);b+=f(a,!0);b+='"\n       hidefocus="on">\n    </a>\n    <a id="ks-date-picker-next-year-btn-';
a=h(d,e,{},"id",0,36);b+=f(a,!0);b+='"\n       class="';a={};c=[];c.push("next-year-btn");a.params=c;a=i(d,e,a,"getBaseCssClasses",37);b+=f(a,!0);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=h(d,e,{},"nextYearLabel",0,41);b+=f(a,!0);b+='"\n       hidefocus="on">\n    </a>\n</div>\n<div class="';a={};c=[];c.push("body");a.params=c;a=i(d,e,a,"getBaseCssClasses",45);b+=f(a,!0);b+='">\n    <table class="';a={};c=[];c.push("table");a.params=c;a=i(d,e,a,"getBaseCssClasses",
46);b+=f(a,!0);b+='" cellspacing="0" role="grid">\n        <thead>\n        <tr role="row">\n            ';var a={},c=[],k=j(d,e,"showWeekNumber",0,49);c.push(k);a.params=c;a.fn=function(b){var a;a='\n            <th role="columnheader" class="';var g={},c=[];c.push("column-header");g.params=c;g=i(d,b,g,"getBaseCssClasses",50);a+=f(g,!0);a+=" ";g={};c=[];c.push("week-number-header");g.params=c;g=i(d,b,g,"getBaseCssClasses",50);a+=f(g,!0);a+='">\n                <span class="';g={};c=[];c.push("column-header-inner");
g.params=c;b=i(d,b,g,"getBaseCssClasses",51);a+=f(b,!0);return a+'">x</span>\n            </th>\n            '};b+=l(d,e,a,"if",49);b+="\n            ";a={};c=[];k=j(d,e,"weekdays",0,54);c.push(k);a.params=c;a.fn=function(b){var a;a='\n            <th role="columnheader" title="';var g=h(d,b,{},".",0,55);a+=f(g,!0);a+='" class="';var g={},c=[];c.push("column-header");g.params=c;g=i(d,b,g,"getBaseCssClasses",55);a+=f(g,!0);a+='">\n                <span class="';g={};c=[];c.push("column-header-inner");
g.params=c;g=i(d,b,g,"getBaseCssClasses",56);a+=f(g,!0);a+='">\n                    ';g=j(d,b,"xindex",0,57);b=h(d,b,{},"veryShortWeekdays."+g+"",0,57);a+=f(b,!0);return a+"\n                </span>\n            </th>\n            "};b+=l(d,e,a,"each",54);b+='\n        </tr>\n        </thead>\n        <tbody id="ks-date-picker-tbody-';a=h(d,e,{},"id",0,63);b+=f(a,!0);b+='">\n        ';a=h(d,e,{},"renderDates",0,64);b+=f(a,!1);b+="\n        </tbody>\n    </table>\n</div>\n";var a={},c=[],k=j(d,e,"showToday",
0,68),m=j(d,e,"showClear",0,68);c.push(k||m);a.params=c;a.fn=function(b){var a;a='\n<div class="';var c={},e=[];e.push("footer");c.params=e;c=i(d,b,c,"getBaseCssClasses",69);a+=f(c,!0);a+='">\n    <a class="';c={};e=[];e.push("today-btn");c.params=e;c=i(d,b,c,"getBaseCssClasses",70);a+=f(c,!0);a+='"\n       role="button"\n       hidefocus="on"\n       tabindex="-1"\n       href="#"\n       id="ks-date-picker-today-btn-';c=h(d,b,{},"id",0,75);a+=f(c,!0);a+='"\n       title="';c=h(d,b,{},"todayTimeLabel",
0,76);a+=f(c,!0);a+='">';c=h(d,b,{},"todayLabel",0,76);a+=f(c,!0);a+='</a>\n    <a class="';c={};e=[];e.push("clear-btn");c.params=e;c=i(d,b,c,"getBaseCssClasses",77);a+=f(c,!0);a+='"\n       role="button"\n       hidefocus="on"\n       tabindex="-1"\n       href="#"\n       id="ks-date-picker-clear-btn-';c=h(d,b,{},"id",0,82);a+=f(c,!0);a+='">';b=h(d,b,{},"clearLabel",0,82);a+=f(b,!0);return a+"</a>\n</div>\n"};return b+=l(d,e,a,"if",68)}});
