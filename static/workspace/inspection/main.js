/**
 * inspection client module
 *   This is a copy of photos but may behave and look different than photos; thus a copy
 *   Got to simplify this:
 *   inspection handles setting up the basic handlers for page switching using settings from inspection.sub.routes[jQuery.param.fragment()]
 *   inspection.sub should contain only the settings, its render will be called by the router but since it handles multiple routes
 *     it will pass the rendering along to it's parent (inspection)
 *   inspection:list is a dependency of inspection and should only be responsible for loading data and then rendering 
 *     or re rendering on page change or view change
 *     the change functions are defined in inspection:list, the global:paginator (to be created) can pageChange of inspection:list for listview
 *       when inspection:list is done rendering it'll inform inspection so it can do things 
 *       like hiding buttons and such (should have been done in css but isn't)
 * written by Harm Meijer: harmmeiier@gmail.com
 */
    console.log('inspection is loaded...');
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/inspection'] = {mod: 'lbs.workspace.inspection', location: '/workspace/inspection/main.js'};
  lbs.routes['/workspace/inspection/unInspected'] = 
  lbs.routes['/workspace/inspection/qualified'] = 
  lbs.routes['/workspace/inspection/unQualified'] = 
          {mod:'lbs.workspace.inspection.sub',location:'/workspace/inspection/main.js'};
  lbs.routes['/workspace/inspection:list'] = 
          {mod:'lbs.workspace.inspection:list',location:'/workspace/inspection/main.js'};


lbs.modules['/workspace/inspection'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.unInspectedFolders='/workspace/inspection/folders.json'
      this.endPoints.qualifiedFolders='/workspace/inspection/folders.json'
      this.endPoints.unQualifiedFolders='/workspace/inspection/folders.json'
      this.endPoints.idPhotos='/workspace/photos/idphotos.json';
      lbs.workspace.inspection = this;
      var me = this;
      this.handlers['inspection:listView']=function(e){
        me['inspection:listView'](e);
      };
      this.handlers['inspection:galleryView']=function(e){
        me['inspection:galleryView'](e);
      };
      this.handlers['inspection:singleView']=function(e){
        me['inspection:singleView'](e);
      };
      
      delete this.deps;
      delete this.create;
    }
    ,'inspection:listView':function(e){
      //cannot savely put content in the container because style is set on this container
      //  style should have been set on a child of container_bottom so it can be replaced
      //  without messing with the classes in script as we have to do now
      var $listContainer = jQuery(this.listMod.forContainer);
      this.listMod.currentView='listView';
      $listContainer.removeClass('idPhotoGalery');
      this.listMod.pageSize = 20;
      this.rerenderList('listView');
    }
    ,'inspection:galleryView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      this.listMod.currentView='galleryView';
      $listContainer.addClass('idPhotoGalery');
      this.listMod.pageSize = 20;
      this.rerenderList('galleryView');
    }
    ,'inspection:singleView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      $listContainer.addClass('idPhotoGalery');
      this.listMod.currentView='singleView';
      this.listMod.pageSize = 1;
      this.rerenderList('singleview');
    }
    ,basePath:'/workspace/inspection'
    ,deps:['/workspace','/workspace/inspection:list']
    ,listMod:null
    ,render : function render(arg){
      arg = arg || {};
      var sub = lbs.workspace.inspection.sub;
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      jQuery.when(
        lbs.modHelper.getView('/workspace/inspection/inspection.html')
        ,lbs.modHelper.getMod('/workspace/inspection:list')
        ,this.parent.render({fromChild:true})
      ).then(function(view,listMod){
        me.listMod=listMod;
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{
            settings:arg.settings
            ,helpers:{
              showSingle : sub.showItem('Single')
              ,showAction : sub.showItem('Action')
              ,showList : sub.showItem('List')
              ,showGallery : sub.showItem('Gallery')
            }
          }),container:arg.container});
        lbs.actionHandler({container:arg.container,handlers:me.handlers});
        return listMod.render({
          container:'.container_bottom'//@todo:just pass arg here and set arg.container
          ,endPoint:arg.settings.endPoint
          ,view:arg.view
          ,handlers:arg.listHandlers
          ,helpers:{
            showGallery : sub.showItem('Gallery')
            ,showAction : sub.showItem('Action')
            ,showDetail : sub.showItem('Detail')
            ,someId : function(i){//can be removed, fake endpoint does not have unique id for item
              return function(){
                return Math.floor(++i/2);//need same id twice for each item
              };
            }(-1)
          }
        });
      }).then(function(){
        d.resolve();
      });
      return d.promise();
    }
    ,handlers:{
      'inspection:search':function(e){
        e.preventDefault();
      }
      ,setSelectedMode : function(e){
        lbs.basemodule['photo:list'].setSelectedMode.call(this,{e:e});
      }
    }
    ,rerenderList : function rerenderList(currentView){
      this.listMod.rerender().then(function(){
        //@todo: this should be defined in css but can script it for now
        if(currentView==='galleryView'&&jQuery.param.fragment()==='/workspace/inspection/unInspected'){
          jQuery('.blueButton.IDPhotoInspectionConfirm').show();          
        }else{
          jQuery('.blueButton.IDPhotoInspectionConfirm').hide();
        }
      });
    }
  };


lbs.modules['/workspace/inspection/unInspected'] =
  lbs.modules['/workspace/inspection/qualified'] =
  lbs.modules['/workspace/inspection/unQualified'] =
  {
    deps : ['/workspace/inspection']
    ,container:'#right_container'
    ,routes:{}
    ,view:null//to be set in render
    ,create : function create(){
      this.parent=lbs.workspace.inspection;
      this.routes['/workspace/inspection/unInspected']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.inspection.endPoints.unInspectedFolders
        ,photoEndPoint:lbs.workspace.inspection.endPoints.idPhotos
        ,showSingle:true,showGallery:true,showAction:true,showPhotoInfo:true
        ,root:'检测中心'
        ,currentPage:'待检照片'
      };
      this.routes['/workspace/inspection/qualified']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.inspection.endPoints.qualifiedFolders
        ,photoEndPoint:lbs.workspace.inspection.endPoints.idPhotos
        ,showList:true,showGallery:true,showDetail:true
        ,root:'检测中心'
        ,currentPage:'合格照片'
      };
      this.routes['/workspace/inspection/unQualified']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.inspection.endPoints.unQualifiedFolders
        ,photoEndPoint:lbs.workspace.inspection.endPoints.idPhotos
        ,showList:true,showGallery:true,showDetail:true
        ,root:'检测中心'
        ,currentPage:'不合格照'
      };
      lbs.workspace.inspection.sub = this;
      var me = this;
      this.handlers['inspection:openfolder']=function(e){
        me.openFolder(e);
      };
      delete this.deps;
      delete this.create;
    }
    ,getShowItem : function(item){
      return this.routes[jQuery.param.fragment()]['show'+item];
    }
    ,showItem : function(itemName){
      var me = this;
      return lbs.modHelper.isVal({
        obj: {val:true}
        ,key:'val'
        ,val : function(){
          if(me.view === 'foldersView'){
            return false;
          }
          return me.getShowItem(itemName);
        }
        ,yes : true
      });
    }
    ,openFolder : function openFolder(e){
      this.render({view:'galleryView'});
    }
    ,render : function render(arg){
      arg = arg || {};
      this.view = arg.view||'foldersView';
      var d = jQuery.Deferred();
      var me = this;
      if(this.view === 'foldersView'){
        this.routes[jQuery.param.fragment()].endPoint
          = this.routes[jQuery.param.fragment()].folderEndPoint;
      }else{
        this.routes[jQuery.param.fragment()].endPoint
          = this.routes[jQuery.param.fragment()].photoEndPoint;        
      }
      this.parent.render({
        fromChild:true
        ,container:this.container
        ,view:me.view
        ,settings:this.routes[jQuery.param.fragment()]
        ,listHandlers:this.handlers
      }).then(function(){
        d.resolve();
      })
      return d.promise();
    }
    ,handlers:{
      'inspection:bbqUpdate': lbs.globalHandlers.bbqUpdate
    }
    ,remove : function remove(){
    }
  };

lbs.modules['/workspace/inspection:list'] = {
    deps : ['/workspace']
    ,views:{
      galleryView:'/workspace/inspection/galleryView.html'
      ,listView:'/workspace/inspection/listView.html'
      ,singleView:'/workspace/inspection/singlePhotoView.html'
      ,foldersView:'/workspace/inspection/foldersView.html'
    }
    ,currentView:null
    ,list:[]
    ,templateHelpers:null
    ,otherHandlers:false
    ,index:0
    ,pageSize:null
    ,totalRecords:null
    ,create : function create(){
      var me = this;
      this.handlers['inspection:list:movePage']=function(e){
        me.movePage(e);
      }
      lbs.workspace['inspection:list'] = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      arg = arg || {};
      arg.pageSize = arg.pageSize || 20;
      lbs.basemodule['photo:list'].render.call(this,arg);
    }
    ,rerender:function rerender(){
      return lbs.basemodule['photo:list'].rerender.call(this);

    }
    ,movePage:function movePage(e){
      lbs.basemodule['photo:list'].movePage.call(this,{e:e});
    }
    ,updateArrows:function updateArrows(){
      lbs.basemodule['photo:list'].updateArrows.call(this);
    }
    ,handlers:{}
    ,remove : function remove(){
    }
  };

