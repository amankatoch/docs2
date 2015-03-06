/**
 * corrections client module
 *   This is a copy of inspection but may behave and look different than photos; thus a copy
 * written by Harm Meijer: harmmeiier@gmail.com
 */
    console.log('corrections is loaded...');
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/corrections'] = {mod: 'lbs.workspace.corrections', location: '/workspace/corrections/main.js'};
  lbs.routes['/workspace/corrections/unProcessed'] = 
  lbs.routes['/workspace/corrections/processSuccessful'] = 
  lbs.routes['/workspace/corrections/processFailed'] = 
          {mod:'lbs.workspace.corrections.sub',location:'/workspace/corrections/main.js'};
  lbs.routes['/workspace/corrections:list'] = 
          {mod:'lbs.workspace.corrections:list',location:'/workspace/corrections/main.js'};


lbs.modules['/workspace/corrections'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.unInspectedFolders='/workspace/corrections/folders.json'
      this.endPoints.qualifiedFolders='/workspace/corrections/folders.json'
      this.endPoints.unQualifiedFolders='/workspace/corrections/folders.json'
      this.endPoints.idPhotos='/workspace/photos/idphotos.json';
      lbs.workspace.corrections = this;
      var me = this;
      this.handlers['corrections:listView']=function(e){
        me['corrections:listView'](e);
      };
      this.handlers['corrections:galleryView']=function(e){
        me['corrections:galleryView'](e);
      };
      this.handlers['corrections:singleView']=function(e){
        me['corrections:singleView'](e);
      };
      
      delete this.deps;
      delete this.create;
    }
    ,'corrections:listView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      $listContainer.removeClass('idPhotoGalery');
      this.listMod.currentView='listView';
      this.listMod.pageSize = 10;
      this.listMod.rerender();
    }
    ,'corrections:galleryView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      $listContainer.addClass('idPhotoGalery');
      this.listMod.currentView='galleryView';
      this.listMod.pageSize = 8;
      this.listMod.rerender();
    }
    ,'corrections:singleView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      $listContainer.addClass('idPhotoGalery');
      this.listMod.currentView='singleView';
      this.listMod.pageSize = 1;
      this.listMod.rerender();
    }
    ,basePath:'/workspace/corrections'
    ,deps:['/workspace','/workspace/corrections:list']
    ,listMod:null
    ,render : function render(arg){
      arg = arg || {};
      var sub = lbs.workspace.corrections.sub;
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      jQuery.when(
        lbs.modHelper.getView('/workspace/corrections/corrections.html')
        ,lbs.modHelper.getMod('/workspace/corrections:list')
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
      'corrections:search':function(e){
        e.preventDefault();
      }
      ,setSelectedMode : function(e){
        lbs.basemodule['photo:list'].setSelectedMode.call(this,{e:e});
      }
    }
  };


lbs.modules['/workspace/corrections/unProcessed'] =
  lbs.modules['/workspace/corrections/processSuccessful'] =
  lbs.modules['/workspace/corrections/processFailed'] =
  {
    deps : ['/workspace/corrections']
    ,container:'#right_container'
    ,routes:{}
    ,view:null//to be set in render
    ,create : function create(){
      this.parent=lbs.workspace.corrections;
      this.routes['/workspace/corrections/unProcessed']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.corrections.endPoints.unInspectedFolders
        ,photoEndPoint:lbs.workspace.corrections.endPoints.idPhotos
        ,showDetail:true,showList:true,showGallery:true
        ,root:'制作中心'
        ,currentPage:'待制作照片'
      };
      this.routes['/workspace/corrections/processSuccessful']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.corrections.endPoints.qualifiedFolders
        ,photoEndPoint:lbs.workspace.corrections.endPoints.idPhotos
        ,showDetail:true,showList:true,showGallery:true
        ,root:'制作中心'
        ,currentPage:'制作成功'
      };
      this.routes['/workspace/corrections/processFailed']={
        endPoint:null
        ,folderEndPoint:lbs.workspace.corrections.endPoints.unQualifiedFolders
        ,photoEndPoint:lbs.workspace.corrections.endPoints.idPhotos
        ,showDetail:true,showList:true,showGallery:true
        ,root:'制作中心'
        ,currentPage:'制作失败'
      };
      lbs.workspace.corrections.sub = this;
      var me = this;
      this.handlers['corrections:openfolder']=function(e){
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
      'corrections:bbqUpdate': lbs.globalHandlers.bbqUpdate
    }
    ,remove : function remove(){
    }
  };

lbs.modules['/workspace/corrections:list'] = {
    deps : ['/workspace']
    ,views:{
      galleryView:'/workspace/corrections/galleryView.html'
      ,listView:'/workspace/corrections/listView.html'
      ,singleView:'/workspace/corrections/singlePhotoView.html'
      ,foldersView:'/workspace/corrections/foldersView.html'
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
      this.handlers['corrections:list:movePage']=function(e){
        me.movePage(e);
      }
      lbs.workspace['corrections:list'] = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      lbs.basemodule['photo:list'].render.call(this,arg);
    }
    ,rerender:function rerender(){
      lbs.basemodule['photo:list'].rerender.call(this);
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

