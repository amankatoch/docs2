/**
 * publishing client module, this handles 
 * Service, ServicePonts
 * written by Harm Meijer: harmmeiier@gmail.com
 */
    console.log('publishing is loaded...');
  //register routers/modules of publishing if not already registered
  lbs.routes['/basemodule'] = {mod: 'lbs.basemodule', location: '/basemodule.js'};
  lbs.routes['/workspace:nomenu'] = {mod: 'lbs.workspace:nomenu', location: '/workspace/main.js'};
  lbs.routes['/workspace/publishing'] = {mod: 'lbs.workspace:nomenu.publishing', location: '/workspace/publishing/main.js'};
  lbs.routes['/workspace/publishing/activities'] = {mod: 'lbs.workspace:nomenu.publishing.activities', location: '/workspace/publishing/main.js'};
  lbs.routes['/workspace/publishing/activities:form:new'] = {mod: 'lbs.workspace:nomenu.publishing.activities:form:new', location: '/workspace/publishing/main.js'};
  lbs.routes['/workspace/publishing/activities:list:new'] = {mod: 'lbs.workspace:nomenu.publishing.activities:list:new', location: '/workspace/publishing/main.js'};
  
  
  
      
  lbs.modules['/workspace/publishing'] = {
    create:function(){
      this.parent = lbs['workspace:nomenu'];
      this.endPoints={};
      this.endPoints.serviceTypes = this.basePath+'/servicetypes.json';
      this.endPoints.activities = this.basePath+'/activities.json';
      this.endPoints.myServicePoints = this.basePath+'/myservicepoints.json';
      this.endPoints.myServiceNew = this.basePath+'/newservice.json';
      this.endPoints.myServicePointNew = this.basePath+'/newservicepoint.json';
      this.endPoints.serviceNames = this.basePath+'/servicenames.json';
      this.endPoints.serviceTypes = this.basePath+'/servicetypes.json';
      this.endPoints.servicePointTypes = this.basePath+'/servicepointtypes.json';
      
      lbs['workspace:nomenu'].publishing = this;
      delete this.deps;
      delete this.create;
      //lbs.modHelper.getMod('/workspace/publishing/template');//@todo: with working grunt the templates of all of publishing can be loaded here
    }
    ,basePath:'/workspace/publishing'
    ,deps:['/workspace:nomenu']
    ,render : function render(arg){
      return this.parent.render(arg);
    }
  };
  
  lbs.modules['/workspace/publishing/activities'] = {
    container : '#right_container'
    ,handlers:{
    }
    ,handleNew:function(e){
      e.preventDefault();
      // load formnew init has to be called by me!! if no container is passed we have a problem
      lbs.modHelper.getMod('/workspace/publishing/activities:form:new')
      .then(function(newMod){
        newMod.render({container:'#formDesigner'});
      });
    }
    ,newList:function newList(e){
      lbs.modHelper.getMod('/workspace/publishing/activities:list:new')
      .then(function(listMod){
         return listMod.render({container:'#platformAPIsModal'});
      });
    }
    ,'activities:search':function(e){
      e.preventDefault();
    }
    ,render : function render(arg){
      //re use publishing render code
      //get the template for this one and bind it
      var arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;//resolve handler needs a reference to this
      jQuery.when(
        this.parent.render(arg)
        ,lbs.modHelper.getView("/workspace/publishing/activities.html")
      )
      .then(function(parent,view){
        //no data to bind so we can continue
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{}),container:me.container});
        //register handlers now, we rendered template and set innerhtml
        lbs.actionHandler({
          container:me.container
          ,handlers:me.handlers
        });
        return;
      }).then(function(res){
        d.resolve();
      });
      return d.promise();
    }
    ,create : function(){
      var me = this;
      this.handlers['activities:form:new']=function(e){
        me['handleNew'](e);
      };
      this.handlers['activities:list:new']=function(e){
        me.newList(e);
      }
      this.parent = lbs['workspace:nomenu'].publishing;
      lbs['workspace:nomenu'].publishing.activities = this;
      delete this.deps;
      delete this.create;
    }
    ,deps : ['/workspace/publishing']
  };  
    
  lbs.modules['/workspace/publishing/activities:form:new'] = {
    view:''
    ,addToList:null
    ,saving:false
    ,boundValues:[]
    ,service : {
      price: null
      ,serviceType:null
      ,description:null
      ,serviceName:null
      ,serviceFromTB:null
      ,servicePoints:[]
    }
    ,externalsLoaded:false
    ,render : function render(arg){
        arg = arg || {};
        this.addTolist=arg.addToList;
        var d = arg.defer || jQuery.Deferred();
        this.containerToSet = arg.container;
        var me = this;//then after resolve needs a reference to this
        //@todo: get the view and module at the same time and use jQuery.when.apply(jQuery,promissesarry).then
        //@todo: get a list of service names and serviceTypes
        var serviceNames;
        var serviceTypes;
        lbs.modHelper.getMod('/global:modal')
        .then(function(globalMod){
          return jQuery.when(
            lbs.modHelper.getView("/workspace/publishing/formtool/formdesign.html")
            ,globalMod.render({container:me.containerToSet})
          );
        })
        .then(function(view){
          lbs.modHelper.setContainer({
            mod:me
            ,html:Mustache.render(view,{})
            ,container:me.containerToSet
          });
          lbs.actionHandler({handlers:me.handlers,container:arg.container});
          //load this first, other script depends on it
          return (me.externalsLoaded)?true:jQuery.when(
            lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/FileSaver.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/json2html.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/jquery.json2html.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/jHtmlArea-0.8.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/json2html.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/jquery.json2html.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/app.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/colpick.js'})
            ,lbs.modHelper.getCssFromUrl({url:'/workspace/publishing/formtool/css/popup.css'})
            ,lbs.modHelper.getCssFromUrl({url:'/workspace/publishing/formtool/css/app.css'})
            ,lbs.modHelper.getCssFromUrl({url:'/workspace/publishing/formtool/css/colpick.css'})
            ,lbs.modHelper.getCssFromUrl({url:'/workspace/publishing/formtool/css/jHtmlArea.css'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/dividize.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/jquery.contextmenu.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/redips-table.js'})
             ,lbs.modHelper.getCssFromUrl({url:'/workspace/publishing/formtool/css/jquery.contextmenu.css'})
          );
        })
        .then(function(){
          return jQuery.when(
            lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/js/popupFeature.js'})
            ,lbs.modHelper.getScriptFromUrl({url:'/workspace/publishing/formtool/app.js'})
          );
        }).then(function(){
          me.externalsLoaded=true;
          d.resolve();
        });
        return d.promise();
    }
    ,remove : function(arg){
      //@todo: in create set handlers closeWindow to a closure that calls remove
      lbs.binder.unbind(this.boundValues);
      //@todo: unbind event listeners as well
    }
    ,create : function(){
      var me = this;
      this.handlers.saveService = function(e){
        me.saveService(e);
      };
      lbs['workspace:nomenu'].publishing['activities:form:new'] = this;
      delete this.deps;
      delete this.create;
    }
    ,handlers : {
      nameSelectChange:function(e){
        var showhide=(e.target.value==='--fromtb--')?'show':'hide';
        $('#service\\\:new\\\:name\\\:text')[showhide]();
      }
    }
    ,deps:['/workspace/publishing']
  };



  
  lbs.modules['/workspace/publishing/activities:list:new'] = {
    view:''
    ,renderStep2 : function renderStep2(arg){
      var me = this;
      arg.listView=arg.view;
      lbs.basemodule['general:list'].render.call(this,arg)
      .then(function(){
        jQuery(me.containerToSet).modal();
      });
    }
    ,render : function render(arg){
        arg = arg || {};
        var d = arg.defer || jQuery.Deferred();
        this.containerToSet = arg.container;
        var me = this;
        jQuery.when(
            lbs.modHelper.getView((arg.view)?arg.view:"/workspace/publishing/modalone.html")
        )
        .then(function(view){
          lbs.modHelper.setContainer({
            mod:me
            ,html:Mustache.render(view,{})
            ,container:me.containerToSet
          });
          lbs.actionHandler({handlers:me.handlers,container:me.containerToSet});
          me.radioClickedBindings = lbs.binder.bind(me.containerToSet,me.radioClicked);
          jQuery(me.containerToSet).modal();
          console.log(me.containerToSet);
          jQuery(me.containerToSet).on('hidden.bs.modal.new.list',function(){
            me.radioClicked.val=1;
            jQuery(me.containerToSet).off('hidden.bs.modal.new.list');
          })
          d.resolve();
        });
        return d.promise();
    }

    ,config : {
      "1":{
        view:'/workspace/publishing/modaltwo.html'
        ,listEndPoint:'/workspace/activities/nameslist.json'
        ,withPadding:false
        ,action:'renderStep2'
      }
      ,"2":{
        view:'/workspace/publishing/modalthree.html'
      }
      ,"3":{
        view:'/workspace/publishing/modalfour.html'
      }
    }
    ,radioClicked:{val:1},radioClickedBindings:null
    ,remove : function(arg){
      //@todo:

    }
    ,stepTwo : function stepTwo(){
      this.openDialog({},this.radioClicked.val);
    }
    ,create : function(){
      var me = this;
      this.handlers['list:step:two'] = function(e){
        me.stepTwo(e,'two');
      };
      this.handlers['list:new:user:search'] = function(e,addUserToSelection){
        me.userFilter(e,addUserToSelection);
      };
      this.handlers['list:new:user:select'] = function(e){
        me.addUserToSelection(e);
      };
      this.handlers['list:new:user:delete:all'] = function(e){
        me.emptyAllSelection(e);
      };

      lbs['workspace:nomenu'].publishing['activities:list:new'] = this;
      delete this.deps;
      delete this.create;
    }
    ,openDialog:function openDialog(e,whatDialog){
      var config = this.config[whatDialog];
      config.container=this.containerToSet;
      var fnName = config.action?config.action:'render';
      console.log(config);
      this[fnName](config);
    }

    ,searchedUserName : null
    ,searchedUserIcon : null

    ,handlers:{
        'list:new:file:upload':function(e){
          var input = $(e.target),
              numFiles = input.get(0).files ? input.get(0).files.length : 1,
              label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

              $('.uploadedFileName').text(label).addClass('addShadow');

        }
      ,'list:new:user:delete':function(e){
        $(e.target).closest('tr').empty();
      }

    }
  ,userFilter : function userFilter(e, cb){
    searchInput = $('.workSpacePopupSeachBox').val()||'search is empty';
    for (var key in this.userList) {
      var obj = this.userList[key];
      for (var prop in obj) {
        if(obj.hasOwnProperty(prop)){


           if(obj[prop].userName===searchInput){

             var iconUrl ="/commons/images/"+obj[prop].icon+".jpg";
             var userName =obj[prop].userName;


             $('.searchMatchShow').find('img').attr("src",iconUrl);
             $('.searchMatchShow').find('.addUsersName').text(userName);

             searchedUserName =userName;
             searchedUserIcon =iconUrl;


           }

        }
      }
    }
  }


  ,addUserToSelection:function addUserToSelection(e,addrow){

      //$('.optionSaveTable').find('tbody').append(function(searchedUserIcon,searchedUserName){   ///why?
      $('.optionSaveTable').find('tbody').append(function(){
        var  newRow = '<tr>'
            +'<td> <img class="addUsersIcon" src="'+searchedUserIcon+'"></td>'
            +'<td>'+searchedUserName+'</td>'
            + '<td><img data-action-click="list:new:user:delete" class="pull-right deleleItemsIcon" src="/commons/images/addUsersDeleteIcon.png"></td></tr>';
        return newRow;

      });


    }

    ,emptyAllSelection:function emptyAllSelection(e){

      $('.optionSaveTable').find('tbody').empty();

    }

  ,userList: {

      "pl": [{
        "userName": "Tom",
        "userID": "lbs8888",
        "phone": "88888888",
        "icon": 'addUsers1',
        "email": "tom@qq.com"
      }, {
        "userName": "甜甜",
        "userID": "lbs9999",
        "phone": "9999999",
        "icon": 'addUsers2',
        "email": "dadamier@qq.com"
      }, {
        "userName": "guest",
        "userID": "guest6666",
        "phone": "66666666",
        "icon": 'addUsers3',
        "email": "guest@qq.com"
      }
        , {
          "userName": "Lv_001",
          "userID": "guest6666",
          "phone": "66666666",
          "icon": 'addUsers4',
          "email": "guest@qq.com"
        }]

    }
    ,deps:[]
  };