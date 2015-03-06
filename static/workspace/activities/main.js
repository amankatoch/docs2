/**
 * activities client module
 * 
 * written by and Harm Meijer: harmmeiier@gmail.com
 */
    console.log('activities is loaded...');
  //register routers/modules of smm if not already registered
  lbs.routes['/workspace'] = lbs.routes['/workspace'] || {mod: 'lbs.workspace', location: '/workspace/main.js'};
  lbs.routes['/workspace/activities'] = 
    lbs.routes['/workspace/activities/activitieslist'] =
    lbs.routes['/workspace/activities/nameslist'] =
    lbs.routes['/workspace/activities/activitiesforms'] =
    lbs.routes['/workspace/activities/publicforms'] =
    lbs.routes['/workspace/activities/serviceslist'] =
        {mod: 'lbs.workspace.activities', location: '/workspace/activities/main.js'};
  
  lbs.routes['/workspace/activities:list'] = {mod:'lbs.workspace.activities.list',location:'/workspace/activities/main.js'};

  lbs.modules['/workspace/activities'] = 
    lbs.modules['/workspace/activities/activitieslist'] = 
    lbs.modules['/workspace/activities/nameslist'] = 
    lbs.modules['/workspace/activities/activitiesforms'] = 
    lbs.modules['/workspace/activities/publicforms'] = 
    lbs.modules['/workspace/activities/serviceslist'] =  {
    create:function(){
      this.parent = lbs.workspace;
      this.endPoints={};
      this.endPoints.activitieslist = this.basePath+'/activitieslist.json';
      this.endPoints.nameslist = this.basePath+'/nameslist.json';
      this.endPoints.activitiesforms = this.basePath+'/activitiesforms.json';
      this.endPoints.publicforms = this.basePath+'/publicforms.json';
      this.endPoints.serviceslist = this.basePath+'/serviceslist.json';
      this.routeParams={//@todo: in the end there will be one endpoint and we can just pass the filter arguements to it
        '/workspace/activities/activitieslist':{
          listEndPoint:this.endPoints.activitieslist
          ,listView:'/workspace/activities/activitieslist.html'
          ,currentPage:'事务列表'
        }
        ,'/workspace/activities/nameslist':{
          listEndPoint:this.endPoints.nameslist
          ,listView:'/workspace/activities/nameslist.html'
          ,currentPage:'事务名单'
        }
        ,'/workspace/activities/activitiesforms':{
          listEndPoint:this.endPoints.activitiesforms
          ,listView:'/workspace/activities/activitiesforms.html'
          ,currentPage:'事务表单'
        }
        ,'/workspace/activities/publicforms':{
          listEndPoint:this.endPoints.publicforms
          ,listView:'/workspace/activities/publicforms.html'
          ,currentPage:'公共表单'
        }
        ,'/workspace/activities/serviceslist':{
          listEndPoint:this.endPoints.serviceslist
          ,listView:'/workspace/activities/serviceslist.html'
          ,currentPage:'服务列表'
        }
      };
      var me = this;
      this.handlers['activities:createNew']=function(e){
        me.createNew(e);
      }
      lbs.workspace.activities = this;
      delete this.deps;
      delete this.create;
    }
    ,basePath:'/workspace/activities'
    ,deps:['/workspace','/global:modal']
    ,container:'#right_container'
    ,routeParams:null
    ,render : function render(arg){
      
      var data = {
        container : '.container_bottom'
      };
      return lbs.basemodule['general:list'].parentRender.call(this,{
        listMod:'/workspace/activities:list'
        ,mainView:'/workspace/activities/main.html'
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


  lbs.modules['/workspace/activities:list'] = {
  view:''
  ,list:[]
  ,viewUrl:null
  ,pageSize:10
  ,index:0
  ,render : function render(arg){
    arg.listView = arg.listView || '/workspace/activities/activitieslist.html'
    return lbs.basemodule['general:list'].render.call(this,arg);
  }
  ,create : function(){
    lbs.workspace.activities.list = this;
    delete this.deps;
    delete this.create;
  }
  ,deps:[]
};
