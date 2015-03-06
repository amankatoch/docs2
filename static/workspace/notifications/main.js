/**
 * notifications client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('notifications is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/notifications'] = 
    lbs.routes['/workspace/notifications/all'] =
    lbs.routes['/workspace/notifications/unread'] =
    lbs.routes['/workspace/notifications/read'] =
        {mod: 'lbs.workspace.notifications', location: '/workspace/notifications/main.js'};
  
  lbs.routes['/workspace/notifications:list'] = {mod:'lbs.workspace.notifications.list',location:'/workspace/notifications/main.js'};

  lbs.modules['/workspace/notifications'] = 
    lbs.modules['/workspace/notifications/all'] = 
    lbs.modules['/workspace/notifications/unread'] = 
    lbs.modules['/workspace/notifications/read'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.all = this.basePath+'/all.json';
      this.endPoints.unread = this.basePath+'/unread.json';
      this.endPoints.read = this.basePath+'/read.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/notifications/all':{
          listEndPoint:this.endPoints.all
          ,currentPage:'所有通知'
        }
        ,'/workspace/notifications/unread':{
          listEndPoint:this.endPoints.unread
          ,currentPage:'未读通知'
        }
        ,'/workspace/notifications/read':{
          listEndPoint:this.endPoints.read
          ,currentPage:'已读通知'
        }
      };
      lbs.workspace.notifications = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/notifications'
    ,deps:['/workspace']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/notifications:list'
        ,mainView:'/workspace/notifications/main.html'
        ,data:data
      });
    }
  };


  lbs.modules['/workspace/notifications:list'] = {
  view:''
  ,list:[]
  ,pageSize:10
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/notifications/list.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.notifications.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};


