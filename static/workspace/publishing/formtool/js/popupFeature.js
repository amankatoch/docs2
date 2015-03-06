var htmlArea = "";

var imageobj='';

var global_button='';
var global_id='';
var formid;
var btnobj;

jQuery(document).ready(function($) {
    //tabel rows, columns, rowHeight, columnHeight, lineType, lineThickness
    //tabel tabelTitle, tabelSummary

    //button name, value, type

    //Text  name, value, charWidth, maxChar, type, requried

    //radio name, requried, value

    //textarea name, textLimit, rows, requried, initalValue

    //checkbox name, requried, value

    //dropdown name, width, optionsText, optionsValue

    var currentPopup = "";
    // $('#tabs').tab();
    var closePopup = function() {
        //Hide all popup components
        $("div[data-type='popup']").hide();

    };
    var currentComponent = {};
    var htmlArea;



    $("#generatedCode").htmlarea({
        toolbar: [],
        loaded: function() {
            htmlArea = this;
            // htmlArea.resizing(true);
            // self.pasteHTML('<script src="js/bootstrap.min.js"></script>');
            // self.pasteHTML('<link href="css/bootstrap.min.css" rel="stylesheet">');
            $(htmlArea.editor.head).append('<style>table td{border:1px solid;}</style>');
            // $(htmlArea.editor.head).append('<link href="css/bootstrap.min.css" rel="stylesheet">');
            // $(htmlArea.editor.head).append('<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css"/>');
            
        
        }
    });
    var addComponent = function() {
        
        
        // console.log($("div[data-type='popup'][data-value='" + currentPopup + "']").find("[data-key]"));
        $("div[data-type='popup'][data-value='" + currentPopup + "']").find("[data-key]").each(function(index) {
        // console.log(index + ": " + $(this).text());
        currentComponent[$(this).attr('data-key')] = $(this).val();
        // console.log($(this).val(), $(this).attr('data-key'), $(this));
        });
        console.log(global_button);
        if(global_button=='table')
        {
             
             var row= currentComponent['rows'];
             row=row-1;
             var rowCount=$(htmlArea.iframe).contents().find('table#'+global_id+' tr:last').index() + 1;
             var col= currentComponent['columns'];
             var columnHeight=currentComponent['columnHeight'];
             var rowHeight=currentComponent['rowHeight'];
             var tableid=$(htmlArea.iframe).contents().find("#"+global_id);
             
             console.log(columnHeight+'height'+row);

             if(rowCount>row)
             {
               console.log('lesser')
               tableid.find("tr:gt("+row+")").remove();
             }
             else if(rowCount<=row)
             {
               rowadd=row+1;
               var diffrows= rowadd-rowCount;
               

                       for(var j=0;j<diffrows;j++)
                       { 
                       var colls="";
                       for (var i=0;i<col;i++)
                       {
                            colls=colls+'<td class="col" style="width:'+columnHeight+'"px;"></td>';
                       }
                       console.log(colls);
                       tableid.append('<tr class="row" style="height:'+rowHeight+'px">'+colls+'</tr>');
                       }
           
             }

             //columns 
             
             var totalcolumns=tableid.find("tr:first > td").length;
              if(col>totalcolumns)
              {
                var coldif=col-totalcolumns;
                for(var i=0;i<coldif;i++)
                {
                    
                   tableid.find("tr").each(function(){
                    $(this).append('<td class="col" style="width:'+columnHeight+'px;"></td>');
                   })
                }

              }
              else
              {
                coldif=col-1;
                tableid.find("tr").each(function(){
                $(this).find("td:gt("+coldif+")").remove();
                })
              }


                //css changes 



            global_button='';
            global_id='';
            return false ;




        } 
        if(global_button=='checkbox')
        {
           

           $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';
        }
        if(global_button=='radio')
        {
            $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';

        }
        if(global_button=='text')
        {
            $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';

        }
        if(global_button=='textarea')
        {
            $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';

        }
        if(global_button=='dropdown')
        {
            $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';

        }
        if(global_button=='button')
        {
            $(htmlArea.iframe).contents().find('#'+global_id+'').remove();
    
            global_button='';

        }






        if(currentPopup=='照片')
        {  
             if ( $.browser.webkit ) {
            
            htmlArea.pasteHTML('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAACMCAYAAACd15xyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQjc2NUJDMURBMTJFNDExOTBFN0MzQTEzODk2MkNCNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMTc0NjRDNzZFMDMxMUU0OTNEQUZGQkZCMThFREU0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMTc0NjRDNjZFMDMxMUU0OTNEQUZGQkZCMThFREU0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZDN0I0QjkxNkI1OEU0MTE5OTU0OTZFQzkyRUQ4NTNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVCNzY1QkMxREExMkU0MTE5MEU3QzNBMTM4OTYyQ0I2Ii8+IDwvcmRmOkRlc2NyaXB0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" height=200px width=150px><br>');
            htmlArea.pasteHTML('<br>');
            htmlArea.pasteHTML('<span align=center><a href="#">从本地上传</a></span>');
            htmlArea.pasteHTML('<br>');
            htmlArea.pasteHTML('<span align=center><a href="#">从照片库上传</a></span>');
          
            }
            else
            {
               
            htmlArea.pasteHTML('<span align=center><a href="#">从本地上传</a></span>');
            htmlArea.pasteHTML('<br>');
            htmlArea.pasteHTML('<span align=center><a href="#">从照片库上传</a></span>');
            htmlArea.pasteHTML('<br>');
            htmlArea.pasteHTML('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAACMCAYAAACd15xyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQjc2NUJDMURBMTJFNDExOTBFN0MzQTEzODk2MkNCNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMTc0NjRDNzZFMDMxMUU0OTNEQUZGQkZCMThFREU0RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMTc0NjRDNjZFMDMxMUU0OTNEQUZGQkZCMThFREU0RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZDN0I0QjkxNkI1OEU0MTE5OTU0OTZFQzkyRUQ4NTNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVCNzY1QkMxREExMkU0MTE5MEU3QzNBMTM4OTYyQ0I2Ii8+IDwvcmRmOkRlc2NyaXB0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" height=200px width=150px><br>');
               
           }
           
            return false;
        }
       
            currentComponent['test']=Math.floor(Math.random()*10000000);
       
        
        if (currentPopup=='image')
        {
         console.log(currentComponent['columnHeight']);
     
        }

         console.log(currentComponent);
        var generatedComp = json2html.transform(currentComponent, templateObject[currentPopup]);
        
        
        var x = htmlArea.pasteHTML(generatedComp);
 
    
        // .contents().find("body").append(scriptTag);
        //$(htmlArea.iframe).contents().find("img").draggable();
        $(htmlArea.iframe).contents().find("img").resizable({
            ghost: true,
            handles: "n, e, s, w"
        });
        $(htmlArea.iframe).contents().find("table").resizable({
            ghost: true,
            handles: "n, e, s, w"
        });
       // REDIPS.table.cell_index(true);
       // // define background color for marked cell
       // REDIPS.table.color.cell = '#9BB3DA';
       // REDIPS.table.onmousedown('mainTable', true,'classname');
       REDIPS.table.cell_index(true);
       // define background color for marked cell
       REDIPS.table.color.cell = '#9BB3DA';
       
       REDIPS.table.onmousedown('t'+currentComponent.test, true);
       //eval("var REDIPS=REDIPS||{};REDIPS.table=(function(){console.log('init');var onmousedown,handler_onmousedown,merge,merge_cells,max_cols,split,get_table,mark,cell_init,row,column,cell_list,relocate,remove_selection,cell_index,cell_ignore,tables=[],td_event,show_index,color={cell:false,row:false,column:false},mark_nonempty=true;onmousedown=function(el,flag,type){var td,i,t,get_tables;get_tables=function(el){var arr=[],nodes,i;nodes=$(el[0]).contents().find('table');for(i=0;i<nodes.length;i++){arr.push(nodes[i])}return arr};td_event=flag;if(typeof(el)==='string'){if(type==='classname'){tables=get_tables(document.getElementsByTagName('iframe'))}else{console.log(el);el=document.getElementsByTagName('iframe')[0].contentDocument.getElementById(el);console.log(el)}}if(el&&typeof(el)==='object'){if(el.nodeName==='TABLE'){tables[0]=el}else{tables=get_tables(el)}}for(t=0;t<tables.length;t++){td=tables[t].getElementsByTagName('td');for(i=0;i<td.length;i++){cell_init(td[i])}}cell_index()};cell_init=function(c){if(c.className.indexOf('ignore')>-1){return}if(td_event===true){REDIPS.event.add(c,'mousedown',handler_onmousedown)}else{REDIPS.event.remove(c,'mousedown',handler_onmousedown)}};cell_ignore=function(c){if(typeof(c)==='string'){c=document.getElementById(c)}REDIPS.event.remove(c,'mousedown',handler_onmousedown)};handler_onmousedown=function(e){var evt=e||window.event,td=evt.target||evt.srcElement,mouseButton,empty;empty=(/^\s*$/.test(td.innerHTML))?true:false;if(REDIPS.table.mark_nonempty===false&&empty===false){return}if(evt.which){mouseButton=evt.which}else{mouseButton=evt.button}if(mouseButton===1){console.log('mdown');td.redips=td.redips||{};if(td.redips.selected===true){mark(false,td)}else{mark(true,td)}}else if(mouseButton==3){REDIPS.table.merge('h',false);REDIPS.table.merge('v')}};merge=function(mode,clear,table){var tbl,tr,c,rc1,rc2,marked,span,id,cl,t,i,j,first={index:-1,span:-1};remove_selection();tbl=(table===undefined)?tables:get_table(table);for(t=0;t<tbl.length;t++){cl=cell_list(tbl[t]);tr=tbl[t].rows;rc1=(mode==='v')?max_cols(tbl[t]):tr.length;rc2=(mode==='v')?tr.length:max_cols(tbl[t]);for(i=0;i<rc1;i++){first.index=first.span=-1;for(j=0;j<=rc2;j++){id=(mode==='v')?(j+'-'+i):(i+'-'+j);if(cl[id]){c=cl[id];c.redips=c.redips||{};marked=c?c.redips.selected:false;span=(mode==='v')?c.colSpan:c.rowSpan}else{marked=false}if(marked===true&&first.index===-1){first.index=j;first.span=span}else if((marked!==true&&first.index>-1)||(first.span>-1&&first.span!==span)){merge_cells(cl,i,first.index,j,mode,clear);first.index=first.span=-1;if(marked===true){if(clear===true||clear===undefined){mark(false,c)}marked=false}}if(cl[id]){j+=(mode==='v')?c.rowSpan-1:c.colSpan-1}}if(marked===true){merge_cells(cl,i,first.index,j,mode,clear)}}}cell_index()};merge_cells=function(cl,idx,pos1,pos2,mode,clear){var span=0,id,fc,c,i;fc=(mode==='v')?cl[pos1+'-'+idx]:cl[idx+'-'+pos1];for(i=pos1+1;i<pos2;i++){id=(mode==='v')?(i+'-'+idx):(idx+'-'+i);if(cl[id]){c=cl[id];span+=(mode==='v')?c.rowSpan:c.colSpan;relocate(c,fc);c.parentNode.deleteCell(c.cellIndex)}}if(fc!==undefined){if(mode==='v'){fc.rowSpan+=span}else{fc.colSpan+=span}if(clear===true||clear===undefined){mark(false,fc)}}};max_cols=function(table){var tr=table.rows,span,max=0,i,j;if(typeof(table)==='string'){table=document.getElementById(table)}for(i=0;i<tr.length;i++){span=0;for(j=0;j<tr[i].cells.length;j++){span+=tr[i].cells[j].colSpan||1}if(span>max){max=span}}return max};split=function(mode,table){var tbl,tr,c,cl,rs,n,cols,max,t,i,j,get_rowspan;get_rowspan=function(c,row,col){var rs,last,i;rs=0;last=row+c.rowSpan-1;for(i=col-1;i>=0;i--){if(cl[last+'-'+i]===undefined){rs++}}return rs};remove_selection();tbl=(table===undefined)?tables:get_table(table);for(t=0;t<tbl.length;t++){cl=cell_list(tbl[t]);max=max_cols(tbl[t]);tr=tbl[t].rows;for(i=0;i<tr.length;i++){cols=(mode==='v')?max:tr[i].cells.length;for(j=0;j<cols;j++){if(mode==='v'){c=cl[i+'-'+j];if(c!==undefined){c.redips=c.redips||{}}if(c!==undefined&&c.redips.selected===true&&c.rowSpan>1){rs=get_rowspan(c,i,j);n=tr[i+c.rowSpan-1].insertCell(j-rs);n.colSpan=c.colSpan;c.rowSpan-=1;cell_init(n);cl=cell_list(tbl[t])}}else{c=tr[i].cells[j];c.redips=c.redips||{};if(c.redips.selected===true&&c.colSpan>1){cols++;n=tr[i].insertCell(j+1);n.rowSpan=c.rowSpan;c.colSpan-=1;cell_init(n)}}if(c!==undefined){mark(false,c)}}}}cell_index()};get_table=function(table){var tbl=[];if(table!==undefined){if(typeof(table)==='string'){table=document.getElementById(table)}if(table&&typeof(table)==='object'&&table.nodeName==='TABLE'){tbl[0]=table}}return tbl};row=function(table,mode,index){var nc,nr=null,fr,c,cl,cols=0,i,j,k;remove_selection();if(typeof(table)!=='object'){table=document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName(table)[0]}if(index===undefined){index=-1}if(mode==='insert'){fr=table.rows[0];for(i=0;i<fr.cells.length;i++){cols+=fr.cells[i].colSpan}nr=table.insertRow(index);for(i=0;i<cols;i++){nc=nr.insertCell(i);cell_init(nc)}cell_index()}else{if(table.rows.length===1){return}table.deleteRow(index);cl=cell_list(table);index=table.rows.length-1;cols=max_cols(table);for(i=0;i<cols;i++){c=cl[index+'-'+i];if(c===undefined){for(j=index,k=1;j>=0;j--,k++){c=cl[j+'-'+i];if(c!==undefined){c.rowSpan=k;break}}}else if(c.rowSpan>1){c.rowSpan-=1}i+=c.colSpan-1}}return nr};column=function(table,mode,index){var c,idx,nc,i;remove_selection();if(typeof(table)!=='object'){table=document.getElementById(table)}if(index===undefined){index=-1}if(mode==='insert'){for(i=0;i<table.rows.length;i++){nc=table.rows[i].insertCell(index);cell_init(nc)}cell_index()}else{c=table.rows[0].cells;if(c.length===1&&(c[0].colSpan===1||c[0].colSpan===undefined)){return}for(i=0;i<table.rows.length;i++){if(index===-1){idx=table.rows[i].cells.length-1}else{idx=index}c=table.rows[i].cells[idx];if(c.colSpan>1){c.colSpan-=1}else{table.rows[i].deleteCell(index)}i+=c.rowSpan-1}}};mark=function(flag,el,row,col){var cl;if(typeof(flag)!=='boolean'){return}if(typeof(el)==='string'){el=document.getElementById(el)}else if(typeof(el)!=='object'){return}if(el.nodeName==='TABLE'){cl=cell_list(el);el=cl[row+'-'+col]}if(!el||el.nodeName!=='TD'){return}el.redips=el.redips||{};if(typeof(REDIPS.table.color.cell)==='string'){if(flag===true){el.redips.background_old=el.style.backgroundColor;el.style.backgroundColor=REDIPS.table.color.cell}else{el.style.backgroundColor=el.redips.background_old}}el.redips.selected=flag};remove_selection=function(){if(window.getSelection){window.getSelection().removeAllRanges()}else if(document.selection&&document.selection.type===\"Text\"){try{document.selection.empty()}catch(error){}}};cell_list=function(table){var matrix=[],matrixrow,lookup={},c,ri,rowspan,colspan,firstAvailCol,tr,i,j,k,l;tr=table.rows;for(i=0;i<tr.length;i++){for(j=0;j<tr[i].cells.length;j++){c=tr[i].cells[j];ri=c.parentNode.rowIndex;rowspan=c.rowSpan||1;colspan=c.colSpan||1;matrix[ri]=matrix[ri]||[];for(k=0;k<matrix[ri].length+1;k++){if(typeof(matrix[ri][k])==='undefined'){firstAvailCol=k;break}}lookup[ri+'-'+firstAvailCol]=c;for(k=ri;k<ri+rowspan;k++){matrix[k]=matrix[k]||[];matrixrow=matrix[k];for(l=firstAvailCol;l<firstAvailCol+colspan;l++){matrixrow[l]='x'}}}}return lookup};relocate=function(from,to){var cn,i,j;if(from===to){return}cn=from.childNodes.length;for(i=0,j=0;i<cn;i++){if(from.childNodes[j].nodeType===1){to.appendChild(from.childNodes[j])}else{j++}}};cell_index=function(flag){if(flag===undefined&&show_index!==true){return}if(flag!==undefined){show_index=flag}var tr,c,cl,cols,i,j,t;for(t=0;t<tables.length;t++){tr=tables[t].rows;cols=max_cols(tables[t]);cl=cell_list(tables[t]);for(i=0;i<tr.length;i++){for(j=0;j<cols;j++){if(cl[i+'-'+j]){c=cl[i+'-'+j]}}}}};return{color:color,mark_nonempty:mark_nonempty,onmousedown:onmousedown,mark:mark,merge:merge,split:split,row:row,column:column,cell_index:cell_index,cell_ignore:cell_ignore}}());if(!REDIPS.event){REDIPS.event=(function(){var add,remove;add=function(obj,eventName,handler){if(obj.addEventListener){obj.addEventListener(eventName,handler,false)}else if(obj.attachEvent){obj.attachEvent('on'+eventName,handler)}else{obj['on'+eventName]=handler}};remove=function(obj,eventName,handler){if(obj.removeEventListener){obj.removeEventListener(eventName,handler,false)}else if(obj.detachEvent){obj.detachEvent('on'+eventName,handler)}else{obj['on'+eventName]=null}};return{add:add,remove:remove}}())}REDIPS.table.cell_index(true);REDIPS.table.color.cell = '#9BB3DA';REDIPS.table.onmousedown('t'+currentComponent.test, true);");
     
       console.log(currentComponent.test);
       /*     code clear  */
            
               

       /////////////////////////////////////////////clearing events ////////////////////////////////////
       $('input[type="reset"]').click();

       ///////////////////////////////


       currentPopup='';
       
      //end 
      // console.log(self.get);
    };
    
    //get selected //
      $(htmlArea.iframe).contents().find("img").click(function(){
        console.log('click');
      });
    //end of get selected //


    $("#popupSave").on("click", function() {
        addComponent();
    //closePopup();
    });

    $("#popupCancel").on("click", function() {
        closePopup();

    });

    $("#generatedCode").on('change', function(evt) {
        console.log(this);
    });

    //Add all popup components to modal-body i.e, popup
    //$("div[data-type='popup']").appendTo($(".modal-body"));

    //Add all popup components to Slide Toggle
    $("div[data-type='popup']").appendTo($(".slide-modal-content"));
     
     // merge button for table // 
     $('.tblm').on("click",function(evt){
        REDIPS.table.merge('h', false);
        // and then merge cells vertically and clear cells (second parameter is true by default)
        REDIPS.table.merge('v');
     })

     //split table  horizontally and vertically //
     $('.tblsh').on("click",function(evt){
        REDIPS.table.split('h');
   
     })
     $('.tblsv').on("click",function(evt){
      
        REDIPS.table.split('v');
     })

      
     //

     $("button[data-value='new']").on("click", function(evt) {
     console.log("new");
     })




    //Add / Show content related to selected component
    $("button[data-type='component']").on("click", function(evt) {
        console.log(evt, this);

    //Hide all popup components
        $('#slideToggle').hide().parent().removeClass('slide-open');
        $("div[data-type='popup']").hide();

    //$("#myModalLabel").text($(this).attr("data-value") + " Properties");

    // Comment the above line and uncomment the below line

    // $("#myModalLabel").text($(this).attr("data-title"));

    //Show selected component related content in popup
        if ($(this).attr("data-value") == 'image1') {
            // evt.preventDefault();
            // closePopup();
            //$('#uploadImage').click();

        } else {
            $("div[data-type='popup'][data-value='" + $(this).attr("data-value") + "']").show();
            currentPopup = $(this).attr("data-value");
            $('#slideToggle').slideDown().parent().addClass('slide-open');
        }
    });

    $('#closeSlider').click(function(){
        $('#slideToggle').slideUp().parent().removeClass('slide-open');
       
         

        addComponent();

    });

    

    $('#uploadImage').on('change', function() {
        console.log('upload image');
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
            imageobj=e;
            htmlArea.pasteHTML('<img  src='+imageobj.target.result+' height='+currentComponent['columnHeight']+' width='+currentComponent['columnWidth']+' />');
            $('input[type="reset"]').click();

            //htmlArea.image(e.target.result);
            };
           reader.readAsDataURL(this.files[0]);
        
        }
    });


    $('#fontName').on('change', function() {
        // alert(this.value); // or $(this).val()
        htmlArea.fontName(this.value);
    });
    $('#fontSize').on('change', function() {
        // alert(this.value); // or $(this).val()
        htmlArea.fontSize(this.value);
    });
    $('button[data-class="colorPicker1"]').click(function(){
       var dvalue=$(this).attr('data-value');
          
      
        console.log('cond1'+dvalue)
    $('.colpick').show();
    $('.colorPiker1').colpick({
        
        flat: true,
        layout: 'hex',
            onSubmit: function(hsb, hex, rgb, el , dvalue) {
              
                $(el).val(hex);
                
                console.log(el);
                 if (dvalue == "background") {
                htmlArea.forecolor("#" + hex);
            } else {
                 htmlArea.backgroundColor("#" + hex);
            }
                
                $(el).colpickHide();
                
            },
            onBeforeShow: function () {
                $(this).colpickSetColor(this.value);
            }
        })
        .bind('keyup', function(){
            $(this).colpickSetColor(this.value);
        });
  
  
    })

        
    $('#popupPicker').colpick({
        flat: true,
        layout: 'hex',
        submit: 0,
        // // colorScheme: 'dark',
        onChange: function(hsb, hex, rgb, el, bySetColor) {
            // $(el).css('background-color', '#' + hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if (!bySetColor) $(el).val(hex);


            $('#rvalue').val(rgb.r);
            $('#gvalue').val(rgb.g);
            $('#bvalue').val(rgb.b);
        },
    }).keyup(function() {
        $(this).colpickSetColor(this.value);
    });

    //Add properties to selected component
    $("button[data-type='property']").on("click", function(evt) {
        // console.log(evt, this);
        // self.getSelection();
        switch ($(this).attr("data-value")) {
            case 'bold':
                htmlArea.bold();
                break;
            case 'italic':
                htmlArea.italic();
                break;
            case 'underline':
                htmlArea.underline();
                break;
            case 'strikethrough':
                htmlArea.strikeThrough();
                break;
            case 'alignleft':
                htmlArea.justifyLeft();
                break;
            case 'alignright':
                htmlArea.justifyRight();
                break;
            case 'alignmiddle':
                htmlArea.justifyCenter();
                break;
            case 'distributed':
                htmlArea.justifyFull();
                break;
            case 'foreground':
                //htmlArea.forecolor();
                break;
             case 'background':
                //     htmlArea.backgroundColor();
                break;
            case 'decreaseFont':
                console.log('decreaseFont');
                htmlArea.decreaseFontSize();
                break;
            case 'increaseFont':
                htmlArea.increaseFontSize();
                break;

            default:
                console.log("Unknown Property" + $(this).attr("data-value"));
        }

    });
    $("button[data-type='action']").on("click", function(evt) {
        // console.log(evt, this);
        // self.getSelection();
        var blob;
        switch ($(this).attr("data-value")) {
            case 'design':
                $(htmlArea.iframe).contents().find("table").draggable();
                $(htmlArea.iframe).contents().find("table").resizable();
                $(htmlArea.iframe).contents().find("img").draggable();

                htmlArea.readOnly(false);
                htmlArea.editor.designMode = "on";

                htmlArea.hideHTMLView();
                break;
            case 'code':
                htmlArea.readOnly(false);
                htmlArea.editor.designMode = "on";

                htmlArea.showHTMLView();
                break;
            case 'preview':
                htmlArea.editor.designMode = "off";
                htmlArea.hideHTMLView();
                htmlArea.readOnly(true);
                break;
            case 'undo':
                htmlArea.undo();
                break;
            case 'redo':
                htmlArea.redo();
                break;
            case 'print':
                htmlArea.iframe[0].contentWindow.print();
                break;
            case 'save':
                var blo=htmlArea.toHtmlString();
                 console.log(blo);
                var pro=prompt("File Name:", ".html");
                if(pro=="" || pro==".html")
                {
                    alert("please specify file name");
                }
                else
                {
                        console.log(pro);
                        var data = {};
                        data.title = pro;
                        data.message = blo;
                        data.frmid=formid;
                    
                        if(!formid)
                        {
                        $.ajax({
                        type: 'POST',
                        data: data,
                        url: '/endpoint',
                        success: function(data) {
                        console.log('success');
                        var obj = jQuery.parseJSON(data);
                        console.log(obj);
                        console.log(obj.formid);
                        formid=obj.formid;
                        }
                        });
                        }
                        else{
                            $.ajax({
                        type: 'POST',
                        data: data,
                        formid:formid,
                        url: '/endpointupdate',
                        success: function(data) {
                        console.log('success');
                        var obj = jQuery.parseJSON(data);
                        console.log(obj);
                        console.log(obj.formid);
                        formid=obj.formid;
                        }
                        });
                        } 
                


                }
                //saveAs(blob, "app.html");
                break;
            case 'saveas':
                // htmlArea.iframe[0].contentWindow.print();
                blob = new Blob([htmlArea.toHtmlString()], {
                    type: "text/html;charset=utf-8"
                });
                saveAs(blob, prompt("File Name:", ".html"));
                break;

             case 'new' :
                $(htmlArea.iframe).contents().find("body").html("");
                break;

             case 'saveboot':

          
             
              $(".dividized").html(htmlArea.html());

                $('table').addClass('mytable');

                jQuery(document).ready(function(){
                    jQuery('.mytable').dividize({
                        removeHeaders       : false,
                        addLabelHeaders     : true,
                        hideLabels          : true,
                        preserveEvents      : true,
                        preserveDim         : true,
                        classes             : 'test-table',  
                        enableAltRows       : true
                    });
                });
                var boot=$('.dividized').html();
                console.log(boot);
                blob = new Blob([boot], {
                    type: "text/html;charset=utf-8"
                });
                saveAs(blob, "bootstrap.html");
                              break;

            default:
                console.log("Unknown Action" + $(this).attr("data-value"));
        }

    });
});




$('.action-switch-button').click(function(e){
    e.preventDefault();
    $(this).addClass('ft-white-gb swallow-border');
    $(this).siblings('.ft-white-gb.swallow-border').removeClass('ft-white-gb swallow-border');

    if($(this).hasClass('norm-param-button')){

        if($('.norm-param-form').hasClass('hideDiv')){


            $('.norm-param-form').removeClass('hideDiv').addClass('showDiv');


            if(!$('.norm-param-form').hasClass('hideDiv')){
                $('.make-param-form').addClass('hideDiv');

            }

        }


    }
    else  if($(this).hasClass('make-param-button')){




        if($('.make-param-form').hasClass('hideDiv')){


            $('.make-param-form').removeClass('hideDiv').addClass('showDiv');
            if(!$('.norm-param-form').hasClass('hideDiv')){
                $('.norm-param-form').addClass('hideDiv');


            }


        }


    }








});



/* edit functions */
$(document).ready(function(){
$('iframe').contents().find('body').dblclick(function(e){
var iid=e.target.id;
  var tabletarget=e.target.className;
  if(!iid)
  {
    console.log(e.target.innerHTML);
    if(!e.target.innerHTML)
    {
      console.log('is null');
      var parenttable=e.target.offsetParent.id;
      $('button[data-value="table"]').click();
     global_button='table';
     global_id=e.target.offsetParent.id;

    }
  }
  else
  {
  
   console.log($('#'+iid).attr('data-class'));
   var elem=$('iframe').contents().find('#'+iid);
   dvalue=elem.data('class');
   $('button[data-value="'+dvalue+'"]').click();
   global_button=dvalue;
   global_id=iid;
   btnobj=$('iframe').contents().find('#'+global_id).clone();
   console.log(btnobj);
    if(dvalue=='checkbox')
    {
        var name=btnobj.attr('name');
        var req=btnobj.attr('verification');
        var text=btnobj.find('input[type="checkbox"]')[0].attributes[2].nodeValue;
        var x=$("div[data-type='popup'][data-value='checkbox']").find("[data-key]").each(function(index) {
    })
   
    x[0].value=name;
    x[1].value=req;
    x[2].value=text;
    }

    else if (dvalue=='radio')
    {
      var name=btnobj.attr('name');
      var req=btnobj.attr('verification');
      var text=btnobj.find('input[type="radio"]')[0].attributes[4].nodeValue;
      var x=$("div[data-type='popup'][data-value='radio']").find("[data-key]").each(function(index) {
    })
      console.log(x);
       x[0].value=name;
       x[1].value=req;
       x[2].value=text;
    }

    else if (dvalue=='text')
    { 
      var name=btnobj.attr('name');
      var req=btnobj.attr('verification');
      var value=btnobj.attr('value');
      var height=btnobj.attr('height');
      var type=btnobj.attr('type');
      var width=btnobj.attr('size');
      
      var x=$("div[data-type='popup'][data-value='text']").find("[data-key]").each(function(index) {
       })
     
       x[0].value=name;
       x[1].value=value;
       x[2].value=height;
       x[3].value=width;
       x[4].value=type;
       x[5].value=req;
       
    }

    else if (dvalue == 'textarea')
    {
      var name=btnobj.attr('name');
      var req=btnobj.attr('verification');
      var value=btnobj.attr('value');
      var height=btnobj.attr('rows');
      
      var width=btnobj.attr('cols');
      
      var x=$("div[data-type='popup'][data-value='textarea']").find("[data-key]").each(function(index) {
       })
    
       x[0].value=name;
       x[1].value=height;
       x[2].value=width;
       x[3].value=req;
       x[4].value=value;
     }
     else if(dvalue=='button')
     {
      var name=btnobj.attr('name');
      var req=btnobj.attr('verification');
      var value=btnobj.attr('value');
      var height=btnobj.attr('height');
      
      var width=btnobj.attr('size');
      
      var x=$("div[data-type='popup'][data-value='button']").find("[data-key]").each(function(index) {
       })
       console.log(x);
       x[0].value=name;
       x[2].value=height;
       x[3].value=width;
       
     }
  }
})

})


/* end */