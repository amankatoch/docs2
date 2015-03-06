/**
 * smm client module, this handles 
 * Service, ServicePonts
 * written by Harm Meijer: harmmeiier@gmail.com
 */
    console.log('smm is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/basemodule'] = {mod: 'lbs.basemodule', location: '/basemodule.js'};
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/smm'] = {mod: 'lbs.workspace.smm', location: '/workspace/services/main.js'};
  lbs.routes['/workspace/services/myservices'] = {mod: 'lbs.workspace.smm.myservices', location: '/workspace/services/main.js'};
  lbs.routes['/workspace/services/myservicepoints'] = {mod: 'lbs.workspace.smm.myservicepoints', location: '/workspace/services/main.js'};
  lbs.routes['/workspace/services/myserviceslist'] = 
          {mod:'lbs.workspace.smm.myserviceslist',location:'/workspace/services/main.js'};
  lbs.routes['/workspace/services/myservicesnew'] = 
          {mod:'lbs.workspace.smm.myservicesnew',location:'/workspace/services/main.js'};
  lbs.routes['/workspace/services/myservicepointsnew'] = 
          {mod:'lbs.workspace.smm.myservicepointsnew',location:'/workspace/services/main.js'};
  lbs.routes['/workspace/services/myservicepointslist'] = 
          {mod:'lbs.workspace.smm.myservicepointslist',location:'/workspace/services/main.js'};
  lbs.routes['/workspace/services/template'] = 
          {mod:'lbs.workspace.smm.templates',location:'/workspace/services/template.js'};
  lbs.routes['/workspace/services/busnessrecords'] =
  lbs.routes['/workspace/services/allbookings'] =
      {mod: 'lbs.workspace.smm.grouped', location: '/workspace/services/main.js'};
  lbs.routes['/workspace/services:list'] =
      {mod: 'lbs.workspace.smm:list', location: '/workspace/services/main.js'};
      
  lbs.modules['/workspace/smm'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.serviceTypes = this.basePath+'/servicetypes.json';
      this.endPoints.myServices = this.basePath+'/myservices.json';
      this.endPoints.myServicePoints = this.basePath+'/myservicepoints.json';
      this.endPoints.myServiceNew = this.basePath+'/newservice.json';
      this.endPoints.myServicePointNew = this.basePath+'/newservicepoint.json';
      this.endPoints.serviceNames = this.basePath+'/servicenames.json';
      this.endPoints.serviceTypes = this.basePath+'/servicetypes.json';
      this.endPoints.servicePointTypes = this.basePath+'/servicepointtypes.json';
      
      lbs.workspace.smm = this;
      delete this.deps;
      delete this.create;
      //lbs.modHelper.getMod('/workspace/services/template');//@todo: with working grunt the templates of all of smm can be loaded here
    }
    ,basePath:'/workspace/services'
    ,deps:['/workspace']//@todo: add dep to template.js
    ,PriceList:function PriceList(arg){
      arg = arg || {};
      this.servicePoint = arg.servicePoint;
      this.servicePrices = arg.servicePrices;
      this.discountedPrice = arg.discountedPrice;
      this.appointmentRequeirement = arg.appointmentRequeirement;
      this.paymentMethod = arg.paymentMethod;
      this.remark = arg.remark;
    }
    ,render : function render(arg){
      return this.parent.render(arg);
    }
  };

  lbs.modules['/workspace/services/myservicepoints'] = {
    create:function(){
      this.parent = lbs.workspace.smm;
      lbs.workspace.smm.myservicepoints = this;
      delete this.deps;
      delete this.create;
    }
    ,handlers:{
      handleNew:function(e){
        lbs.modHelper.getMod('/workspace/services/myservicepointsnew')
        .then(function(e){//@todo: add to list after saving
          lbs.workspace.smm.myservicepointsnew.addedNew=lbs.workspace.smm.myservicepointslist.addedNew();
          return lbs.workspace.smm.myservicepointsnew.render({container:'#newServicePointModal'});
        }).then(function(){
          $('#newServicePointModal').modal();
        });
      }
    }
    ,container:'#right_container'
    ,render : function render(arg){
      var data = {
        container : '.myservicepoints-list-container'
        ,viewUrl:'/workspace/services/myservicepointslistmain.html'      
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/services/myservicepointslist'
        ,mainView:'/workspace/services/myservicepoints.html'
        ,data:data
      });
    }
    ,deps:['/workspace/smm']
  };
  
  lbs.modules['/workspace/services/myservicepointsnew'] = {
    view:''
    ,saving:false
    ,servicePoint : {
      servicePointCode: null
      ,servicePointName:null
      ,servicePointStatus:null
      ,servicePointAddress:null
      ,servicePointType:null
      ,operatingHours:null
      ,contactPerson:null
      ,contactPhone:null
      ,servicePointDescription:null
    }
    ,render : function render(arg){
        var d = arg.defer || jQuery.Deferred();
        var me = this;
        lbs.modHelper.getMessage(lbs.workspace.smm.endPoints.servicePointTypes,true,{})
        .then(function(msg){
          var data = {
            parentContainer : arg.container
            ,servicePointTypes : msg.pl
            ,servicePoint:me.servicePoint
            ,typeSelected:lbs.modHelper.createIsSelected(me.servicePoint.servicePointType)
          };
          return lbs.basemodule['general:list'].parentRender.call(me,{
            listMod:null
            ,mainView:'/workspace/services/myservicepointsnew.html'
            ,data:data
          });
        }).then(function(){
          lbs.binder.bind(arg.container,me.servicePoint,'servicePoint');
          lbs.basemodule.pageComplete();
          d.resolve();
        });
        return d.promise();
    }
    ,saveServicePoint : function(e){
      e.preventDefault();
      var me = this;
      if(this.saving){
        return;//do not do this if user clicks button again
      }
      this.saving=true;
      //@todo: talk to designer, what to show for loading
      var me = this;
      //@todo:here we should see if it's valid before submitting
      lbs.modHelper.getMessage(
            lbs.workspace.smm.endPoints.myServicePointNew//end point
            ,false//do not cache
            ,{//recover options
              message:'You have to log in to save this service point.'//@todo: should be in a settings file
             ,modalToHide:me.containerToSet
            }
            ,'POST'
            ,{json:JSON.stringify(this.servicePoint)})//data to post
      .then(function resolve(e){
        //@todo: what if we fail (user cancels login or re connect)
        //re set to clean values and close the dialog
        me.addedNew(me.servicePoint);
        me.servicePoint = {
          servicePointCode: null
          ,servicePointName:null
          ,servicePointStatus:null
          ,servicePointAddress:null
          ,servicePointType:null
          ,operatingHours:null
          ,contactPerson:null
          ,contactPhone:null
          ,servicePointDescription:null
        };
        //@todo: add the item to the list of services
        jQuery(me.containerToSet).modal('hide');
        jQuery(me.containerToSet).html('');//this will let jquery clean up event listeners
        me.saving=false;
        //@todo: remove handlers and listeners      
      },function reject(reason){
        me.saving = false;
        alert('Unable to save:'+reason);
      });
    }
    ,create : function(){
      var me = this;
      this.handlers.saveServicePoint = function(e){
        me.saveServicePoint(e);
      };
      lbs.workspace.smm.myservicepointsnew = this;
      delete this.deps;
      delete this.create;
    }
    ,handlers : {
    }
    ,deps:['/workspace/smm']
  };
  
  lbs.modules['/workspace/services/myservices'] = {
    container : '#right_container'
    ,handlers:{
      handleNew:function(e){
        // load myservicesnew init has to be called by me!! if no container is passed we have a problem
        lbs.modHelper.getMod('/workspace/services/myservicesnew')
        .then(function(e){
          lbs.workspace.smm.myservicesnew.addedNew=lbs.workspace.smm.myserviceslist.addedNew();//set it to a closure (the result of addednew)
          return lbs.workspace.smm.myservicesnew.render({container:'#newServiceModal'});
        }).then(function(){
          $('#newServiceModal').modal();
        });
      }
    }
    ,'myservices:search':function(e){
      console.log('in search:',this);
      e.preventDefault();
    }
    ,render : function render(arg){
      var data = {
        container : '.myservices-list-container'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/services/myserviceslist'
        ,mainView:'/workspace/services/myservices.html'
        ,data:data
      });
    }
    ,create : function(){
      var me = this;
      this.handlers['myservices:search']=function(e){
        me['myservices:search'](e);
      };
      this.parent = lbs.workspace.smm;
      lbs.workspace.smm.myservices = this;
      delete this.deps;
      delete this.create;
    }
    ,remove : function(){
      lbs.workspace.smm.myservicesnew.remove();
    }
    ,deps : ['/workspace/services/myservicesnew']//'/workspace/smm' is satisfied by myservicesnew
  };  
  
  lbs.modules['/workspace/services/myserviceslist'] = {
    view:''
    ,pageSize:10
    ,index:0
    ,list:[]
    ,addedNew:function(){
      var me = this;//return a closue so we know this whatever the invoking object is
      return function(service){
        me.list.unshift(service);
        lbs.modHelper.getView("/workspace/services/myserviceslist.html")
        .then(function(view){
          lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{myservices:me.list}),container:me.containerToSet});
        });
      };
    }
    ,render : function render(arg){
      arg.listView = arg.listView || '/workspace/services/myserviceslist.html';
      arg.listEndPoint = lbs.workspace.smm.endPoints.myServices;
      return lbs.basemodule['general:list'].render.call(this,arg);
    }
    ,create : function(){
      lbs.workspace.smm.myserviceslist = this;
      delete this.deps;
      delete this.create;
    }
    ,deps:['/workspace/smm']
  };
  
  lbs.modules['/workspace/services/myservicesnew'] = {
    view:''
    ,addToList:null
    ,saving:false
    ,boundValues:[]
    ,boundPriceLists:{}
    ,service : {
      price: null
      ,serviceCode:null
      ,serviceName:null//name provided from dropdown
      ,serviceFromTB:null//either name is provided as text of from the dropdown
      ,serviceType:null
      ,briefOverview:null
      ,standardPayment:null//todo:this is admin provided drop down
      ,standardServicePrice:null//will be used for pricelist default
      ,standardPricing:null//discount price used for pricelist default
      ,standardServiceNotes:null//will be filled out for pricelist default
      ,standardReservationRequest:null//will be used for default reservation value (yes/no)
      ,priceList:[]//this should be a new pricelist object always added first but in edit mode it has to be either added, removed or updated
    }
    ,addPriceList : function addPriceList(e){
      //@todo: could re use new for edit so need to check clientcommand currently assuming insert
      var itemIndex;
      if(e && e.target && e.target.checked){
        var priceList = new lbs.workspace.smm.PriceList({
          servicePoint : e.target.value//@todo: set the rest of the arg depending if boxes are empty if they are set the default
          ,servicePrices : this.service.standardServicePrice
          ,discountedPrice : this.service.standardPricing
          ,appointmentRequeirement : this.service.standardReservationRequest
          ,paymentMethod : this.service.standardPayment
          ,remark : this.service.standardServiceNotes
        });
        this.service.priceList.push(priceList);
        lbs.workspace.smm.myservicesnew.boundPriceLists[e.target.value]=lbs.binder.bind('#'+e.target.value,priceList,'priceDetail');
        this.setNewPriceListValues(lbs.workspace.smm.myservicesnew.boundPriceLists[e.target.value]);
      }
      if(e && e.target && !e.target.checked){
        itemIndex = lbs.util.find({
          arr:this.service.priceList
          ,key:'servicePoint'
          ,val:e.target.value
        });
        if(itemIndex!==-1){
          this.unbindPriceListItem(e.target.value);
          this.service.priceList.splice(itemIndex,1);
        }
      }
    }
    ,setNewPriceListValues : function setNewPriceListValues(binders){
      var i = -1,len=binders.length;
      while(++i<len){
        binders[i].updateUI();
      }
    }
    ,rebindPriceList : function rebindPriceList(){
      var i = -1,pl=this.service.priceList;len=pl.length;
      while(++i<len){
        lbs.binder.bind('#'+pl[i].servicePoint,pl[i],'priceDetail');
      }
    }
    ,unbindPriceListItem : function(key){
      lbs.binder.unbind(this.boundPriceLists[key]);
      delete this.boundPriceLists[key];
    }
    ,render : function render(arg){
        var d = jQuery.Deferred();
        var me = this;
        arg.parentContainer = arg.container;
        arg.container = '#myservicesnew\\\:servicepoints';
        this.addTolist=arg.addToList;
        arg.service = this.service;
        arg['priceListHelper'] = function(entityList,key){
          var helper = {item:{}};
          helper.init = function(){
            var itemIndex = lbs.util.find({
              arr:entityList
              ,key:key
              ,val:this._id
            });
            helper.item={};helper.paySelected='';helper.resSelected='';helper.isSelected='';
            if(itemIndex!==-1){
              helper.item = entityList[itemIndex];
              helper.paySelected = lbs.modHelper.createIsSelected(helper.item.paymentMethod,'val');
              helper.resSelected = lbs.modHelper.createIsSelected(helper.item.appointmentRequeirement,'val');
              helper.isSelected = 'checked=""';
            }
          };
          return helper;
        }(this.service.priceList,'servicePoint');
        //@todo: dropdowns need to be selected for appointmentRequeirement and paymentMethod
        arg.selectedName=lbs.modHelper.createIsSelected(this.service.serviceFromTB);
        arg.selectedType=lbs.modHelper.createIsSelected(this.service.serviceType);
        arg.standardReservationRequestIsSelected
                =lbs.modHelper.createIsSelected(this.service.standardReservationRequest,'val');
        arg.standardReservationRequest=[{val:'1',text:'Yes'},{val:'0',text:'No'}];
        arg.standardPayment=[//@todo: this needs to be an endpoint providing payment methods
          {val:'1',text:'Method 1'},{val:'2',text:'Method 2'}
          ,{val:'3',text:'Method 3'},{val:'4',text:'Method 4'}
        ];
        arg.standardPaymentIsSelected
                =lbs.modHelper.createIsSelected(this.service.standardPayment,'val');
        arg.showTB=lbs.modHelper.isVal({
          obj:this.service
          ,key:'serviceFromTB'
          ,val:'--fromtb--'
          ,yes:''
          ,no:'display:none'
        });
        arg.tbNameUsed=lbs.modHelper.isVal({
          obj:this.service
          ,key:'serviceFromTB'
          ,val:'--fromtb--'
          ,yes:'selected'
          ,no:''
        });
//        arg.isChecked=lbs.modHelper.isChecked(me.service.servicePoints,'_id');//@todo: ischecked
        arg.withPadding=false;
        this.containerToSet = arg.container;
        this.modalContainer = arg.parentContainer;
        //@todo: get service names and service types to be set on arg using jquery.when
        lbs.modHelper.getMessage(
          lbs.workspace.smm.endPoints.serviceNames
          ,true
          ,{}
        ).then(function(msg){
          arg.serviceNames = msg.pl;
          return lbs.modHelper.getMessage(
            lbs.workspace.smm.endPoints.serviceTypes
            ,true
            ,{});
        }).then(function(msg){
          arg.serviceTypes = msg.pl;
          return lbs.basemodule['general:list'].parentRender.call(me,{
            listMod:"/workspace/services/myservicepointslist"
            ,mainView:"/workspace/services/myservicesnew.html"
            ,data:arg
          });
        }).then(function(){
          jQuery(me.modalContainer).on('hidden.bs.modal.service.new',function(e){
            me.remove();
          });
          me.boundValues = lbs.binder.bind(arg.parentContainer,me.service,'service');
          me.rebindPriceList();
          lbs.basemodule.pageComplete();
          d.resolve();
        });
        return d.promise();
    }
    ,remove : function(arg){
      lbs.binder.unbind(this.boundValues);
      this.boundValues=[];
      var key;
      for(key in this.boundPriceLists){
        if(Object.prototype.hasOwnProperty.call(this.boundPriceLists)){
          this.unbindPriceListItem(key);
        }
      }
      //in create set handlers closeWindow to a closure that calls remove
      jQuery(this.modalContainer).off('hidden.bs.modal.service.new');
      //@todo: unbind other event listeners as well
    }
    ,saveService : function(e){
      e.preventDefault();
      var validator = lbs.validator.create('service');
      var me = this;
      if(this.saving){
        return;//do not do this if user clicks button again
      }
      this.saving=true;
      //@todo: talk to designer, what to show for loading
      var me = this;
      if(this.service.serviceFromTB!=='--fromtb--'){
        this.service.serviceName=this.service.serviceFromTB;
      }
      var valMsg = validator.validate({val:this.service});
      if(valMsg!==true){
        alert(valMsg);
        this.saving=false;
        return;
      }
      //@todo:here we should see if it's valid before submitting
      lbs.modHelper.getMessage(
            lbs.workspace.smm.endPoints.myServiceNew//end point
            ,false//do not cache
            ,{//recover options
              message:'You have to log in to save this service.'//@todo: should be in a settings file
             ,modalToHide:me.containerToSet
            }
            ,'POST'
            ,{json:JSON.stringify(this.service)})//data to post
      .then(function resolve(e){
        //@todo: what if we fail (user cancels login or re connect)
        //re set to clean values and close the dialog
        me.addedNew(me.service);
        me.service = {
          price: null
          ,serviceType:null
          ,description:null
          ,serviceName:null
          ,servicePoints:[]
        };
        //@todo: add the item to the list of services
        jQuery(me.containerToSet).modal('hide');
        jQuery(me.containerToSet).html('');//this will let jquery clean up event listeners
        me.saving=false;
        //@todo: remove handlers and listeners      
      },function reject(e){
        alert('Cannot save,'+e);
        me.saving=false;
      });
    }
    ,create : function(){
      var me = this;
      this.handlers.saveService = function(e){
        me.saveService(e);
      };
      this.handlers['service:new:add:PriceList'] = function(e){
        me.addPriceList(e);
      }
      lbs.workspace.smm.myservicesnew = this;
      delete this.deps;
      delete this.create;
    }
    ,handlers : {
      nameSelectChange:function(e){
        var showhide=(e.target.value==='--fromtb--')?'show':'hide';
        $('#service\\\:new\\\:name\\\:text')[showhide]();
      }
    }
    ,deps:['/workspace/smm']
  };
  
  lbs.modules['/workspace/services/myservicepointslist'] = {
    view:''
    ,pageSize:10
    ,index:0
    ,addedNew:function(){
      var me = this;//return a closue so we know this whatever the invoking object is
      return function(servicePoint){
        me.list.unshift(servicePoint);
        lbs.modHelper.getView(me.viewUrl)
        .then(function(view){
           lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{myservicepoints:me.list}),container:me.containerToSet});
        });
      };
    }
    ,list:[]
    ,render : function render(arg){
      arg.listView = arg.viewUrl || "/workspace/services/myservicepointslist.html";
      arg.listEndPoint = lbs.workspace.smm.endPoints.myServicePoints;
      return lbs.basemodule['general:list'].render.call(this,arg);
    }
    ,create : function(){
      lbs.workspace.smm.myservicepointslist = this;
      delete this.deps;
      delete this.create;
    }
    ,deps:['/workspace/smm']
  };

    lbs.modules['/workspace/services/busnessrecords'] = 
    lbs.modules['/workspace/services/allbookings'] =  {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.busnessrecords = this.basePath+'/busnessrecords.json';
      this.endPoints.allbookings = this.basePath+'/allbookings.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/services/allbookings':{
          listEndPoint:this.endPoints.allbookings
          ,listView:'/workspace/services/allbookingsList.html'
          ,currentPage:'所有预约'
        }
        ,'/workspace/services/busnessrecords':{
          listEndPoint:this.endPoints.busnessrecords
          ,listView:'/workspace/services/busnessrecordsList.html'
          ,currentPage:'业务记录'
        }
      };
      var me = this;
      this.handlers['services:createNew']=function(e){
        me.createNew(e);
      }
      lbs.workspace.smm.grouped = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/services'
    ,deps:['/workspace','/global:modal','/workspace/smm']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/services:list'
        ,mainView:'/workspace/services/main.html'
        ,data:data
      });
    }
    ,handlers:{}
    ,createNew : function createNew(e){
      var me = this;
      lbs.modHelper.getMod('/global:modal')
      .then(function(modalMod){
        modalMod.render({
          createdBy:me
          ,container:''
          ,view:''
          ,templateData:{}
        });
      });
    }
  };

  
  lbs.modules['/workspace/services:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/services/serviceslist.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.smm.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};
