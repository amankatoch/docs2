/**
 * profile client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('profile is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/profile'] = 
    lbs.routes['/workspace/profile/personals'] =
    lbs.routes['/workspace/profile/corporates'] =
    lbs.routes['/workspace/profile/securitymanagement'] =
    lbs.routes['/workspace/profile/personalprofile'] =
    lbs.routes['/workspace/profile/corporateprofile'] =
    lbs.routes['/workspace/profile/corporatedetail'] =
        {mod: 'lbs.workspace.profile', location: '/workspace/profile/main.js'};
  
  lbs.routes['/workspace/profile:list'] = {mod:'lbs.workspace.profile.list',location:'/workspace/profile/main.js'};

  lbs.modules['/workspace/profile'] = 
    lbs.modules['/workspace/profile/personals'] = 
    lbs.modules['/workspace/profile/corporates'] =  
    lbs.modules['/workspace/profile/securitymanagement'] =  
    lbs.modules['/workspace/profile/personalprofile'] =  
    lbs.modules['/workspace/profile/corporateprofile'] =  
    lbs.modules['/workspace/profile/corporatedetail'] =  
    {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.personal = this.basePath+'/personal.json';
      this.endPoints.corporate = this.basePath+'/corporate.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/profile/personals':{
          listEndPoint:this.endPoints.personal
          ,listView:'/workspace/profile/profileList.html'
          ,currentPage:'个人资料'
        }
        ,'/workspace/profile/corporates':{
          listEndPoint:this.endPoints.corporate
          ,listView:'/workspace/profile/profileList.html'
          ,currentPage:'单位资料'
        }
        ,'/workspace/profile/securitymanagement':{
          listEndPoint:null
          ,mainView:'/workspace/profile/securitymanagement.html'
          ,currentPage:'安全管理'
        }
        ,'/workspace/profile/personalprofile':{
          listEndPoint:null
          ,mainView:'/workspace/profile/personalprofile.html'
          ,currentPage:'我的信息'
        }
        ,'/workspace/profile/corporateprofile':{
          listEndPoint:null
          ,mainView:'/workspace/profile/corporateprofile.html'
          ,currentPage:'单位信息'
        }
        ,'/workspace/profile/corporatedetail':{
          listEndPoint:null
          ,mainView:'/workspace/profile/corporatedetail.html'
          ,currentPage:'单位详情'
        }
      };
      var me = this;
      this.handlers['profile:createNew']=function(e){
        me.createNew(e);
      }
      lbs.workspace.profile = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/profiles/v1'
    ,deps:['/workspace','/global:modal']
    ,container:'#right_container'
    ,routeParams:null
    ,mainTitles : {
      'corporate' : '单位资料'
      ,'admin' : '用户资料'
      ,'personal' : '个人资料'
    }
    ,render : function render(arg){
      var me = this;
      return this.parent.render().then(function(){
        var config = me.routeParams[jQuery.param.fragment()];
        config.root = me.mainTitles[lbs.user.userType];
        config.listMod = config.listEndPoint?'/workspace/profile:list':null;
        config.mainView = config.mainView?config.mainView:'/workspace/profile/main.html';
        config.container = '.container_bottom';
        config.data = config;
        return lbs.basemodule['general:list'].parentRender.call(me,config);
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


  lbs.modules['/workspace/profile:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/profile/profileList.html';
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.profile.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};