/**
 * Created by Елена on 26.07.2016.
 */
$(document).ready(function () {

//Вывод списка
    $(function () {
        $.getJSON('echo.json', function (data) {
            for (var i = 0; i < data.values.length; i++) {

//date
                var birthDay = data.values[i].birthDate.v;

                function dateReviver(value) {
                    var re1 = '((?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3}))[-:\\/.](?:[0]?[1-9]|[1][012])[-:\\/.](?:(?:[0-2]?\\d{1})|(?:[3][01]{1})))(?![\\d])';	// YYYYMMDD 1

                    var p = new RegExp(re1, ["i"]);
                    var m = p.exec(birthDay);
                    if (m != null) {
                        var yyyymmdd1 = m[1];
                        var endDate;
                        endDate = ("(" + yyyymmdd1.replace(/</, "&lt;") + ")" + "\n");
                    }
                    return endDate;
                };
                var birthdatDate = dateReviver();

//date

                // age
                var year = new Date().getFullYear(); //текущий год
                var birthdayYear = birthdatDate.slice(1, 5); // год рождения
                var age = year - birthdayYear; //возраст
                //age

                $('#users tbody').append('<tr><td>' + [i + 1] +
                    '</td><td>' + data.values[i].firstName.v +
                    '</td><td>' + data.values[i].name.v +
                    '</td><td>' + age + " "  + birthdatDate +
                    //телефон
                    '</td><td><a href="tel:' + data.values[i].tel.v +
                    '" class="ng-binding">' + data.values[i].tel.v + '</a></td>' +
                    //адрес
                    '<td><a class="bt_filters init-map map-initer" data-type="multiple" data-address="' + data.values[i].address.v + '" href="#" data-toggle="modal"  data-target="#myModal">' + data.values[i].address.v + '</a></td><tr>');
                //href="http://maps.google.com/?q=' + data.values[i].address.v + '"
            }


            $('#countContact').append('Количество контактов: ' + data.values.length);



        });
    });


//modal

    //сортировка таблицы
    initial_sort_id = 0; // номер начального отсортированного столбца, начиная с нуля
    initial_sort_up = 1; // 0 - сортировка вниз, 1 - вверх
    var sort_case_sensitive = false; // чуствительновть к регистру при сотрировке

    function _sort(a, b) {
        var a = a[0];
        var b = b[0];
        var _a = (a + '').replace(/,/, '.');
        var _b = (b + '').replace(/,/, '.');
        if (parseInt(_a) && parseInt(_b)) return sort_numbers(parseInt(_a), parseInt(_b));
        else if (!sort_case_sensitive) return sort_insensitive(a, b);
        else return sort_sensitive(a, b);
    }

    function sort_numbers(a, b) {
        return a - b;
    }

    function sort_insensitive(a, b) {
        var anew = a.toLowerCase();
        var bnew = b.toLowerCase();
        if (anew < bnew) return -1;
        if (anew > bnew) return 1;
        return 0;
    }

    function sort_sensitive(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    function getConcatenedTextContent(node) {
        var _result = "";
        if (node == null) {
            return _result;
        }
        var childrens = node.childNodes;
        var i = 0;
        while (i < childrens.length) {
            var child = childrens.item(i);
            switch (child.nodeType) {
                case 1: // ELEMENT_NODE
                case 5: // ENTITY_REFERENCE_NODE
                    _result += getConcatenedTextContent(child);
                    break;
                case 3: // TEXT_NODE
                case 2: // ATTRIBUTE_NODE
                case 4: // CDATA_SECTION_NODE
                    _result += child.nodeValue;
                    break;
                case 6: // ENTITY_NODE
                case 7: // PROCESSING_INSTRUCTION_NODE
                case 8: // COMMENT_NODE
                case 9: // DOCUMENT_NODE
                case 10: // DOCUMENT_TYPE_NODE
                case 11: // DOCUMENT_FRAGMENT_NODE
                case 12: // NOTATION_NODE
                    // skip
                    break;
            }
            i++;
        }
        return _result;
    }

    function sort(e) {
        var el = window.event ? window.event.srcElement : e.currentTarget;

        while (el.tagName.toLowerCase() != "td") el = el.parentNode;

        var a = new Array();
        var name = el.lastChild.nodeValue;
        var dad = el.parentNode;
        var table = dad.parentNode.parentNode;
        var up = table.up; // no set/getAttribute!

        var node, arrow, curcol;
        for (var i = 0; (node = dad.getElementsByTagName("td").item(i)); i++) {
            if (node.lastChild.nodeValue == name) {
                curcol = i;
                if (node.className == "curcol") {
                    arrow = node.firstChild;
                    table.up = Number(!up);
                } else {
                    node.className = "curcol";
                    arrow = node.insertBefore(document.createElement("span"), node.firstChild);
                    arrow.appendChild(document.createTextNode(""));
                    table.up = 0;
                }
                arrow.innerHTML = ((table.up == 0) ? "&#8595;" : "&#8593;") + "&nbsp;";
            } else {
                if (node.className == "curcol") {
                    node.className = "";
                    if (node.firstChild) node.removeChild(node.firstChild);
                }
            }
        }

        var tbody = table.getElementsByTagName("tbody").item(0);
        for (var i = 0; (node = tbody.getElementsByTagName("tr").item(i)); i++) {
            a[i] = new Array();
            a[i][0] = getConcatenedTextContent(node.getElementsByTagName("td").item(curcol));
            a[i][1] = getConcatenedTextContent(node.getElementsByTagName("td").item(1));
            a[i][2] = getConcatenedTextContent(node.getElementsByTagName("td").item(0));
            a[i][3] = node;
        }

        a.sort(_sort);

        if (table.up) a.reverse();

        for (var i = 0; i < a.length; i++) {
            tbody.appendChild(a[i][3]);
        }
    }

    function init(e) {
        if (!document.getElementsByTagName) return;

        if (document.createEvent) function click_elem(elem) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", false, false, window, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, elem);
            elem.dispatchEvent(evt);
        }

        for (var j = 0; (thead = document.getElementsByTagName("thead").item(j)); j++) {
            var node;
            for (var i = 0; (node = thead.getElementsByTagName("td").item(i)); i++) {
                if (node.addEventListener) node.addEventListener("click", sort, false);
                else if (node.attachEvent) node.attachEvent("onclick", sort);
                node.title = "Нажмите на заголовок, чтобы отсортировать колонку";
            }
            thead.parentNode.up = 0;

            if (typeof(initial_sort_id) != "undefined") {
                td_for_event = thead.getElementsByTagName("td").item(initial_sort_id);
                if (td_for_event.dispatchEvent) click_elem(td_for_event);
                else if (td_for_event.fireEvent) td_for_event.fireEvent("onclick");
                if (typeof(initial_sort_up) != "undefined" && initial_sort_up) {
                    if (td_for_event.dispatchEvent) click_elem(td_for_event);
                    else if (td_for_event.fireEvent) td_for_event.fireEvent("onclick");
                }
            }
        }
    }

    var root = window.addEventListener || window.attachEvent ? window : document.addEventListener ? document : null;
    if (root) {
        if (root.addEventListener) root.addEventListener("load", init, false);
        else if (root.attachEvent) root.attachEvent("onload", init);
    }

    //preLoader

    $(window).on('load', function () {
        var $preloader = $('#page-preloader'),
            $spinner = $preloader.find('.spinner');
        $spinner.fadeOut();
        $preloader.delay(350).fadeOut('slow');
    });



    //style

    $('#style').change(function () {
        var style = $('#style').val();
        chooseStyle(style, 60);
    });

    $('#myModal').on('shown.bs.modal', function (e) {
        var initer = $(e.relatedTarget);
        MapGoogle.initSingle('objects_map', {address: initer.data('address')});
    });
    calcMapHeight();


});

$(window).resize(function () {
    calcMapHeight();
    if (MapGoogle.map && MapGoogle.geo) {
        MapGoogle.map.setCenter(MapGoogle.geo);
    }
});

function calcMapHeight() {
    $('#objects_map').height($(window).height() - 230);
}
