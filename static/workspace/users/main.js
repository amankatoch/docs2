/**
 * users client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('users is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/users'] = 
    lbs.routes['/workspace/users/all'] =
    lbs.routes['/workspace/users/groups'] =
    lbs.routes['/workspace/users/acl'] =
        {mod: 'lbs.workspace.users', location: '/workspace/users/main.js'};
  
  lbs.routes['/workspace/users:list'] = {mod:'lbs.workspace.users.list',location:'/workspace/users/main.js'};

  lbs.modules['/workspace/users'] = 
    lbs.modules['/workspace/users/all'] = 
    lbs.modules['/workspace/users/groups'] = 
    lbs.modules['/workspace/users/acl'] = {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.all = this.basePath+'/all.json';
      this.endPoints.groups = this.basePath+'/groups.json';
      this.endPoints.acl = this.basePath+'/acl.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/users/all':{
          listEndPoint:this.endPoints.all
          ,listView:'/workspace/users/all.html'
          ,currentPage:'所有用户'
        }
        ,'/workspace/users/groups':{
          listEndPoint:this.endPoints.groups
          ,listView:'/workspace/users/groups.html'
          ,currentPage:'安全小组'
        }
        ,'/workspace/users/acl':{
          listEndPoint:this.endPoints.acl
          ,listView:'/workspace/users/acl.html'
          ,currentPage:'功能授权'
        }
      };
      var me = this;
      this.handlers['users:createNew']=function(e){
        me.createNew(e);
      }
      lbs.workspace.users = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/users'
    ,deps:['/workspace','/global:modal']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/users:list'
        ,mainView:'/workspace/users/main.html'
        ,data:{container : '.container_bottom'}
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


  lbs.modules['/workspace/users:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.users.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};