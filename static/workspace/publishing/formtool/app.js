var templateObject;
$(document).ready(function($) {
    //tabel rows, columns, rowHeight, columnHeight, lineType, lineThickness
    //tabel tabelTitle, tabelSummary

    //button name, value, type

    //Text  name, value, charWidth, maxChar, type, requried

    //radio name, requried, value

    //textarea name, textLimit, rows, requried, initalValue

    //checkbox name, requried, value

    //dropdown name, width, optionsText, optionsValue
    // $('input[type=file]').bootstrapFileInput();
    // $('.file-inputs').bootstrapFileInput();
    templateObject = {
        button: {
            "tag": "input id='t${test}' data-class='button' ",
            "name": "${inputValue}",
            "type": "date",
            "height": "${rowHeight}",
            "value": "",
            "verification": "${requried}",
            "size": "${rowWidth}",
            "style": "line-height:${rowHeight}",
            "data-bind":"${inputValue}.name.value",
                // "disabled": "${disabled}"
        },
        text: {
            "tag": "input id='t${test}' data-class='text'",
            "type": "${type}",
            "name": "${name}",
            "height":"${columnHeight}",
            // "html": "${html}",
            "value": "${value}",
            "style": "line-height:${columnHeight}",
            "verification": "${requried}",
            "size": "${columnWidth}",
            "class": "form-control",
            "data-bind":"${name}.name.value",
                // "placeholder": "${placeholder}",
        },
        checkbox: {
            "tag": "div id='t${test}' data-class='checkbox'",
            // "type": "checkbox",
            "name": "${name}",
            "data-bind":"${name}.name",
            "children": function(obj, index) {
                var values = obj.value.split("\n");
                 var data = [];
                    $.each(values, function(index) {
                        data.push({
                           value: values[index]
                        });

                    });
                return json2html.transform(data, {
                    "tag": "input",
                    "type": "checkbox",
                    "value": "${value}",
                    "values":obj.value,
                    "html": "${value}",
                    "data-bind":obj.name+".checked"
                });
            },
            "verification": "${requried}",
            // "checked": "${checked}",
            // "disabled": "${disabled}"
        },

        radio: {
            "tag": "div id='t${test}' data-class='radio'",
            // "type": "checkbox",
            "name": "${name}",
            "data-bind":"${name}.name",
            "children": function(obj, index) {
                var values = obj.value.split("\n");
                   var data = [];
                    $.each(values, function(index) {
                        data.push({
                           value: values[index],
                        });

                    });
                return json2html.transform(data, {
                    "tag": "input",
                    "type": "radio",
                    "data-values":obj.value,
                    "name": obj.name,
                    "value":"${value}",
                    "html": "${value}",
                    "data-bind":obj.name+".${value}"
                });
            },
            "verification": "${requried}",
            //"disabled": "${disabled}"
        },


        textarea: {
            "tag": "textarea id='t${test}' data-class='textarea'",
            "name": "${name}",
            "rows": "${columnHeight}",
            "cols": "${columnWidth}",
            "verification": "${requried}",
            "maxlength": "${textLimit}",
            "value": "${initalValue}",
            "html": "${initalValue}",
            "class": "form-control",
            "data-bind":"${name}.name.value",
                // "disabled": "${disabled}",
                // "placeholder": "${placeholder}",
                // "maxlength": "${maxlength}",
                // "wrap": "${wrap}"
        },
        dropdown: {
            "tag": "select id='t${test}' data-class='dropdown'",
            "name": "${name}",
            "verification": "${requried}",
            "width": "${width}",
            "class": "form-control",
            "data-bind":"${name}.name",
            "children": function(obj, index) {
                    console.log(obj);
                    var values = obj.optionsText.split("\n");
                    var options = obj.optionsText.split("\n");
                    var data = [];
                    $.each(values, function(index) {
                        data.push({
                            displayField: options[index],
                            valueField: values[index]
                        });
                    });
                    return json2html.transform(data, {
                        "tag": "option",
                        "value": "${valueField}",
                        "html": "${displayField}",
                        "data-bind":obj.name+".${valueField}",
                    });
                }
                // "disabled": "${disabled}",
                // "multiple": "${multiple}",
                // "size": "${size}"
        },
        //tabel rows, columns, rowHeight, columnHeight, lineType, lineThickness
        //tabel tabelTitle, tabelSummary

        table: {
            "tag": "table class='mainTable' id='t${test}' data-class='table'",
            "summary": "${tabelSummary}",
            "style": function(obj) {
                return 'margin: 0 auto;border-collapse:collapse;';
            },
            "children": function(obj, index) {
                var rows = [];
                for (var i = 0; i < obj.rows; i++) {
                    rows.push(i);
                }

                var cols = [];
                for (var i = 0; i < obj.columns; i++) {
                    cols.push(i)
                }
                return json2html.transform(rows, {
                    "tag": "tr",
                    "class": "row",
                    "style": function() {
                        return 'height:' + obj.rowHeight + 'px;';
                        // + 'border:' + obj.lineThickness + 'px ' + obj.lineType + ' #000';
                    },
                    children: function() {
                        return json2html.transform(cols, {
                            "tag": "td",
                            "class": "col",
                            "style": function() {
                                return 'width:' + obj.columnHeight + 'px;' + 'border:' + obj.lineThickness + 'px ' + obj.lineType + ' #000';
                            },
                        });
                    }
                });
            },
        },
        imageTemplate: {
            "tag": "img id='t${test}' data-class='image'",
            "name": "${name}",
            "src": "${src}",
            "alt": "${alt}",
            "height": "${height}",
            "width": "${width}",
            "align": "${align}",
            "border": "${border}"
        },
        divTemplate: {
            "tag": "div",
            "style": "${style}",
            "children": []
        },
    };

    // $("#imgUploadButton").click(function() {
    //     console.log("Hi---")
    //     $("input[id='fileInput']").click();
    // });

    // function chooseFile() {
    //     console.log("Hi")
    //     $("#fileInput").click();
    // }

    // $('#picker').colpick();

});
