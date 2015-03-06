/**
 * photos client module
 * 
 * written by Harm Meijer: harmmeiier@gmail.com
 */
    console.log('photos is loaded...');
  lbs.routes['/workspace'] = {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/photos'] = {mod: 'lbs.workspace.photos', location: '/workspace/photos/main.js'};
  lbs.routes['/workspace/photos/idphotos'] = 
  lbs.routes['/workspace/photos/processing'] = 
  lbs.routes['/workspace/photos/otherPhotos'] =
      {mod:'lbs.workspace.photos.photos',location:'/workspace/photos/main.js'};
  lbs.routes['/workspace/photos:list'] = 
          {mod:'lbs.workspace.photos:list',location:'/workspace/photos/main.js'};




lbs.modules['/workspace/photos'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.idPhotos='/workspace/photos/idphotos.json';
      this.endPoints.processing='/workspace/photos/processing.json';
      this.endPoints.otherPhotos='/workspace/photos/otherphotos.json';
      lbs.workspace.photos = this;
      var me = this;
      this.handlers['photos:listView']=function(e){
        me['photos:listView'](e);
      };
      this.handlers['photos:galleryView']=function(e){
        me['photos:galleryView'](e);
      };
      delete this.deps;
      delete this.create;
    }
    ,'photos:listView':function(e){
      //cannot savely put content in the container because style is set on this container
      //  style should have been set on a child of container_bottom so it can be replaced
      //  without messing with the classes in script as we have to do now
      var $listContainer = jQuery(this.listMod.forContainer);
      this.listMod.currentView='listView';
      this.listMod.pageSize=10;
      $listContainer.addClass('unprocessedPhotosContainer');
      $listContainer.removeClass('idPhotoGalery');
      this.listMod.rerender();
    }
    ,'photos:galleryView':function(e){
      var $listContainer = jQuery(this.listMod.forContainer);
      this.listMod.currentView='galleryView';
      this.listMod.pageSize=8;
      $listContainer.addClass('idPhotoGalery');
      $listContainer.removeClass('unprocessedPhotosContainer');
      this.listMod.rerender();
    }
    ,basePath:'/workspace/photos'
    ,deps:['/workspace','/workspace/photos:list']
    ,listMod:null
    ,render : function render(arg){
      arg = arg || {};
      var d = arg.defer || jQuery.Deferred();
      var me = this;
      jQuery.when(
        lbs.modHelper.getView('/workspace/photos/photos.html')
        ,lbs.modHelper.getMod('/workspace/photos:list')
        ,this.parent.render({fromChild:true})
      ).then(function(view,listMod){
        me.listMod=listMod;
        lbs.modHelper.setContainer({mod:me,html:Mustache.render(view,{settings:arg.settings}),container:arg.container});
        lbs.actionHandler({container:arg.container,handlers:me.handlers});
        return listMod.render({
          container:'.container_bottom'//@todo:just pass arg here and set arg.container
          ,endPoint:arg.settings.endPoint
          ,view:arg.view
          ,handlers:arg.listHandlers
          ,settings:arg.settings
        });
      }).then(function(){
        d.resolve();
      });
      return d.promise();
    }
    ,handlers:{
      'photo:search':function(e){
        e.preventDefault();
      }
      ,setSelectedMode : function(e){
        lbs.basemodule['photo:list'].setSelectedMode.call(this,{e:e});
      }
    }
  };

lbs.modules['/workspace/photos/idphotos'] =
  lbs.modules['/workspace/photos/processing'] =
  lbs.modules['/workspace/photos/otherPhotos'] =
  {
    deps : ['/workspace/photos']
    ,container:'#right_container'
    ,routes:{}
    ,create : function create(){
      this.parent=lbs.workspace.photos;
      this.routes['/workspace/photos/idphotos']={
        endPoint:lbs.workspace.photos.endPoints.idPhotos
        ,showDownload:false
        ,showDropDown:true
        ,showNewAlbum:false
        ,showList:true
        ,showGallery:true
        ,showSelect:true
        ,root:'证照管理'
        ,currentPage:'证照照片'
      };
      this.routes['/workspace/photos/processing']={
        endPoint:lbs.workspace.photos.endPoints.processing
        ,showDownload:false
        ,showDropDown:false
        ,showNewAlbum:false
        ,showList:true
        ,showGallery:true
        ,root:'证照管理'
        ,currentPage:'待检照片'
      };
      this.routes['/workspace/photos/otherPhotos']={
        endPoint:lbs.workspace.photos.endPoints.otherPhotos
        ,showDownload:false
        ,showDropDown:true
        ,showNewAlbum:false
        ,showList:true
        ,showGallery:true
         ,showSelect:true
        ,root:'证照管理'
        ,currentPage:'其他照片'
      };
      lbs.workspace.photos.photos = this;
      var me = this;
      delete this.deps;
      delete this.create;
    }
    ,render : function render(arg){
      return this.parent.render({
        fromChild:true
        ,container:this.container
        ,settings:this.routes[jQuery.param.fragment()]
      });
    }
    ,handlers:{
      'photos:bbqUpdate': lbs.globalHandlers.bbqUpdate
    }
    ,remove : function remove(){
    }
  };

lbs.modules['/workspace/photos:list'] = {
    deps : ['/workspace']
    ,views:{
      galleryView:'/workspace/photos/galleryView.html'
      ,listView:'/workspace/photos/listView.html'
    }
    ,currentView:null
    ,list:[]
    ,otherHandlers:false
    ,index:0
    ,totalRecords:null
    ,pageSize:8
    ,create : function create(){
      var me = this;
      this.handlers['photos:list:movePage']=function(e){
        me.movePage(e);
      }
      lbs.workspace['photos:list'] = this;
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
    ,handlers:{
    }
    ,remove : function remove(){
    }
  };



